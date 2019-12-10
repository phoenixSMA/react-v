import { inflate } from "pako";
import {
	IWebsocket,
	RequestData,
	RequestParams,
	SubscribeParams,
	SubsriptionData,
	WebsocketRequest,
	WebsocketRequestHandler,
	WebsocketStatus,
	WebsocketStatusHandler,
	WebsocketSubscribeHandler,
	WebsocketSubscription
} from "./types";
import { ChartPeriods } from "../../store/types";

export class HuobiWebsocket implements IWebsocket {
	private readonly _logging: boolean;
	private ws: WebSocket | undefined;
	private url = `wss://www.hbdm.com/ws`;
	public exchange = `HUOBI`;
	public status = WebsocketStatus.Closed;
	private _statusHandler: WebsocketStatusHandler | null;
	private readonly _subscriptions: Record<string, WebsocketSubscribeHandler[]>;
	private readonly _requests: Record<string, WebsocketRequestHandler[]>;
	private readonly _mapChartPeriods = {
		M1: `1min`,
		M5: `5min`,
		M15: `15min`,
		M30: `30min`,
		H1: `60min`,
		H4: `4hour`,
		D1: `1day`,
	};

	constructor(logging: boolean = false) {
		this._logging = logging;
		this._statusHandler = null;
		this._subscriptions = {};
		this._requests = {};
	}

	public open(handler: WebsocketStatusHandler): void {
		this._statusHandler = handler;
		this.ws = new WebSocket(this.url);
		this.ws.onopen = () => {
			this._logger('[open] Connection opened');
			this.status = WebsocketStatus.Opened;
			this._statusHandler && this._statusHandler(this.exchange, this.status);
		};
		this.ws.onmessage = async (event) => {
			this._logger(`[message] Data recieved: `, event.data);
			const blobArrayBuffer = await event.data.arrayBuffer();
			const msg = JSON.parse(inflate(blobArrayBuffer, {to: `string`}));
			this._logger(`[pako] `, msg);
			if (msg.ping) {
				this.ws!.send(JSON.stringify({pong: msg.ping}));
			} else {
				if (msg.ch && msg.tick) {
					const ch = msg.ch.split(`.`);
					let dataType: WebsocketSubscription;
					let data: SubsriptionData;
					if (ch[2] === `depth`) {
						dataType = WebsocketSubscription.MarketDepth;
						data = {
							asks: msg.tick.asks,
							bids: msg.tick.bids,
						};
					} else if (ch[2] === `kline`) {
						dataType = WebsocketSubscription.CloseLine;
						data = [msg.tick.id, msg.tick.close];
					}
					this._subscriptions[msg.ch] && this._subscriptions[msg.ch].forEach((handler) => {
						handler(this.exchange, ch[1], dataType, data)
					});
				} else if (msg.rep && msg.data) {
					const rep = msg.rep.split(`.`);
					let dataType: WebsocketRequest;
					let data: RequestData = [];
					if (rep[2] === `kline`) {
						dataType = WebsocketRequest.CloseLine;
						msg.data.forEach((tick: { id: number; close: number; }) => data.push([tick.id, tick.close]));
					}
					this._requests[msg.rep] && this._requests[msg.rep].forEach((handler) => {
						handler(this.exchange, rep[1], dataType, data)
					})
				}
			}
		};
		this.ws.onclose = (event) => {
			let error = false;
			if (event.wasClean) {
				this._logger(`[close] Connection closed clear, code=${event.code} reason=${event.reason}`);
			} else {
				this._logger(`[close] Disconnected`);
				error = true;
			}
			this.status = WebsocketStatus.Closed;
			this._statusHandler && this._statusHandler(this.exchange, this.status, error);
		}
	}

	public close(): void {
		this.ws && this.ws.close();
	}

	public subscribe(params: SubscribeParams) {
		const {sub, contract, handler, period, type} = params;
		const closeLinePeriod = this._mapChartPeriods[period || `M1`] || `1min`;
		let subscribeMethod: string;
		const id = `id888`;
		switch (sub) {
			case WebsocketSubscription.CloseLine:
				subscribeMethod = `market.${contract}.kline.${closeLinePeriod}`;
				break;
			case WebsocketSubscription.MarketDepth:
				subscribeMethod = `market.${contract}.depth.${type}`;
		}
		this._sendSubscription({sub: subscribeMethod, id, handler});
	}

	private _sendSubscription = (params: { sub: string; id: string; handler: WebsocketSubscribeHandler }) => {
		const {sub, id, handler} = params;
		if (!this._subscriptions[sub]) {
			this._subscriptions[sub] = [];
		}
		this._subscriptions[sub].push(handler);
		this.ws!.send(JSON.stringify({
			sub,
			id,
		}))
	};

	public unsubscribe(params: SubscribeParams) {
		const {sub, contract, handler, period, type} = params;
		const closeLinePeriod = this._mapChartPeriods[period || `M1`] || `1min`;
		let subscribeMethod: string;
		switch (sub) {
			case WebsocketSubscription.CloseLine:
				subscribeMethod = `market.${contract}.kline.${closeLinePeriod}`;
				break;
			case WebsocketSubscription.MarketDepth:
				subscribeMethod = `market.${contract}.depth.${type}`;
		}
		if (this._subscriptions[subscribeMethod]) {
			const idx = this._subscriptions[subscribeMethod].findIndex(
				(h) => typeof h === typeof handler);
			if (idx > -1) {
				this._subscriptions[subscribeMethod] = [
					...this._subscriptions[subscribeMethod].slice(0, idx),
					...this._subscriptions[subscribeMethod].slice(idx + 1)
				]
			}
			if (!this._subscriptions[subscribeMethod].length) {
				this.ws!.send(JSON.stringify({
					unsub: subscribeMethod
				}));
				delete this._subscriptions[subscribeMethod];
			}
		}
	}

	public request(params: RequestParams) {
		const {req, contract, period, handler} = params;
		const closeLinePeriod = this._mapChartPeriods[period || `M1`] || `1min`;
		if (req === WebsocketRequest.CloseLine) {
			const requestMethod = `market.${contract}.kline.${closeLinePeriod}`;
			if (!this._requests[requestMethod]) {
				this._requests[requestMethod] = [];
			}
			this._requests[requestMethod].push(handler);
			const end: number = Math.round(new Date().getTime() / 1000);
			const beg: number = end - 2000 * this._calcStepInSeconds(period!);
			this.ws!.send(JSON.stringify({
				req: requestMethod,
				id: `id888`,
				from: beg,
				to: end,
			}))
		}
	}

	private _calcStepInSeconds(period: ChartPeriods) {
		let output: number = period.substr(0, 1) === `M` ? 60 : period.substr(0, 1) === `H` ? 60 * 60 : 60 * 60 * 24;
		output = output * (period.substr(1) as unknown as number);
		return output;
	}

	private _logger(...args: any[]) {
		if (this._logging) {
			console.log(...args);
		}
	}

}