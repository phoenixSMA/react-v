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

export class HuobiWebsocket implements IWebsocket {
	private readonly _logging: boolean;
	private ws: WebSocket | undefined;
	private url = `wss://www.hbdm.com/ws`;
	public exchange = `HUOBI`;
	public status = WebsocketStatus.Closed;
	private _statusHandler: WebsocketStatusHandler | null;
	private readonly _subscriptions: Record<string, WebsocketSubscribeHandler[]>;
	private readonly _requests: Record<string, WebsocketRequestHandler[]>;

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
					this._subscriptions[msg.ch].forEach((handler) => {
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
					this._requests[msg.rep].forEach((handler) => {
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
		let subscribeMethod: string;
		const id = `id888`;
		switch (sub) {
			case WebsocketSubscription.CloseLine:
				subscribeMethod = `market.${contract}.kline.5min`;
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

	public request(params: RequestParams) {
		const {req, contract, period, handler} = params;
		if (req === WebsocketRequest.CloseLine) {
			const requestMethod = `market.${contract}.kline.5min`;
			if (!this._requests[requestMethod]) {
				this._requests[requestMethod] = [];
			}
			this._requests[requestMethod].push(handler);
			const end: number = Math.round(new Date().getTime() / 1000);
			const beg: number = end - 2000 * 300;
			this.ws!.send(JSON.stringify({
				req: requestMethod,
				id: `id888`,
				from: beg,
				to: end,
			}))
		}
	}

	private _logger(...args: any[]) {
		if (this._logging) {
			console.log(...args);
		}
	}


}