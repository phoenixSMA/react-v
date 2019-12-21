import { BidAskData, CloseLineData, CloseLinePoint, ConnectionStatus, IState, LogTypes } from "../types";
import { Dispatch, Middleware, MiddlewareAPI } from "redux";
import {
	addLogMessage,
	changeConnectionStatus,
	setConnectionStatus,
	setSymbolCL,
	updateSymbolCL,
	updateSymbolL2
} from "../actions/actions";
import { HuobiWebsocket } from "../../service/websockets/huobi";
import {
	SubsriptionData,
	WebsocketRequest,
	WebsocketRequestHandler,
	WebsocketStatus,
	WebsocketStatusHandler,
	WebsocketSubscribeHandler,
	WebsocketSubscription,
	WebsocketTypes
} from "../../service/websockets/types";
import { Actions, ActionTypes } from "../actions/types";

export let openedWebsockets: WebsocketTypes[] = [];

const connectionHostMiddleware: Middleware = ({getState, dispatch}: MiddlewareAPI) => (next: Dispatch) => (action: ActionTypes) => {
		let state: IState = getState();
		const {connectionStatus, symbol1, symbol2} = state;

		const statusHandler: WebsocketStatusHandler = (exchange, status, error) => {
			state = getState();
			const {symbol1, symbol2, chart: {period}} = state;
			if (status === WebsocketStatus.Opened) {
				console.log(`${new Date().toLocaleString()}: statusHandler > connected: ok`);
				for (const symbol of [symbol1, symbol2]) {
					if (exchange === symbol.exchange) {
						const contract = symbol.name.split(`:`)[1];
						const websocket = symbol === symbol1 ? openedWebsockets[0] : openedWebsockets[1];
						websocket.subscribe({
							sub: WebsocketSubscription.MarketDepth,
							contract,
							type: `step6`,
							handler: streamHandler,
						});
						websocket.request({
							req: WebsocketRequest.CloseLine,
							contract,
							period,
							handler: requestHandler,
						});
						websocket.subscribe({
							sub: WebsocketSubscription.CloseLine,
							contract,
							period,
							handler: streamHandler,
						});
						if ((symbol === symbol1) || (symbol === symbol2 && symbol1.exchange !== symbol2.exchange)) {
							next(addLogMessage({
								time: Date.now(),
								type: LogTypes.Success,
								message: `${symbol.exchange} websocket connected`
							}))
						}
					}
				}
				if (openedWebsockets[0].status === WebsocketStatus.Opened && openedWebsockets[1].status === WebsocketStatus.Opened) {
					next(setConnectionStatus(ConnectionStatus.Connected));
				}
			} else {
				next(setConnectionStatus(ConnectionStatus.Disconnected));
				openedWebsockets = [];
				if (error) {
					// todo обработать разрыв соединения - реконнесе
					console.log(`${new Date().toLocaleString()}: statusHandler > ${exchange} disconnected: error`);
					next(addLogMessage({
						time: Date.now(),
						type: LogTypes.Error,
						message: `${exchange} disconnected`,
					}));
					dispatch(changeConnectionStatus());
				} else {
					next(addLogMessage({
						time: Date.now(),
						type: LogTypes.Info,
						message: `${exchange} disconnected`,
					}));
				}
			}
		};

		const streamHandler: WebsocketSubscribeHandler = (exchange: string, symbol: string, sub: WebsocketSubscription, data: SubsriptionData) => {
			if (sub === WebsocketSubscription.MarketDepth) {
				if (`${exchange}:${symbol}` === symbol1.name) {
					next(updateSymbolL2(data as BidAskData, 1));
				}
				if (`${exchange}:${symbol}` === symbol2.name) {
					next(updateSymbolL2(data as BidAskData, 2));
				}
			} else if (sub === WebsocketSubscription.CloseLine) {
				if (`${exchange}:${symbol}` === symbol1.name) {
					next(updateSymbolCL(data as CloseLinePoint, 1));
				}
				if (`${exchange}:${symbol}` === symbol2.name) {
					next(updateSymbolCL(data as CloseLinePoint, 2));
				}
			}
		};

		const requestHandler: WebsocketRequestHandler = (exchange, symbol, req, data) => {
			if (req === WebsocketRequest.CloseLine) {
				if (`${exchange}:${symbol}` === symbol1.name) {
					next(setSymbolCL(data as CloseLineData, 1));
				}
				if (`${exchange}:${symbol}` === symbol2.name) {
					next(setSymbolCL(data as CloseLineData, 2));
				}
			}
		};

		const websocketByExchange = (exchange: string) => {
			if (exchange === `HUOBI`) {
				return HuobiWebsocket; //todo добавить swith при появлении новых бирж
			}
			return HuobiWebsocket;
		};

		if (action.type === Actions.CHANGE_CONNECTION_STATUS) {
			switch (connectionStatus) {
				case ConnectionStatus.Disconnected:
					let error: boolean = symbol1.name === symbol2.name;
					error = error || symbol1.name === `` || symbol2.name === ``;
					if (error) {
						next(setConnectionStatus(ConnectionStatus.Error));
						return;
					} else {
						next(setConnectionStatus(ConnectionStatus.Connecting));
					}
					next(addLogMessage({
						time: Date.now(),
						type: LogTypes.Info,
						message: `Opening ${symbol1.exchange} websocket`
					}));
					const websocketClass = websocketByExchange(symbol1.exchange);
					let websocket = new websocketClass(false);
					websocket.open(statusHandler);
					// @ts-ignore
					window.wss = websocket;
					openedWebsockets.push(websocket);
					if (symbol2.exchange !== symbol1.exchange) {
						const websocketClass = websocketByExchange(symbol1.exchange);
						websocket = new websocketClass(false);
						next(addLogMessage({
							time: Date.now(),
							type: LogTypes.Info,
							message: `Opening ${symbol2.exchange} websocket`
						}));
						websocket.open(statusHandler);
					}
					openedWebsockets.push(websocket);
					break;
				case ConnectionStatus.Connected:
					for (const websocket of openedWebsockets) {
						websocket.close();
					}
					break;
				default:
					next(setConnectionStatus(ConnectionStatus.Disconnected));
			}
		} else if (action.type === Actions.SET_CHART_PERIOD) {
			for (const symbol of [symbol1, symbol2]) {
				const contract = symbol.name.split(`:`)[1];
				const websocket = symbol === symbol1 ? openedWebsockets[0] : openedWebsockets[1];
				const {chart: {period}} = state;
				if (websocket) {
					websocket.unsubscribe({
						sub: WebsocketSubscription.CloseLine,
						contract,
						period,
						handler: streamHandler,
					});
				}
			}
			next(action);
			state = getState();
			for (const symbol of [symbol1, symbol2]) {
				const contract = symbol.name.split(`:`)[1];
				const websocket = symbol === symbol1 ? openedWebsockets[0] : openedWebsockets[1];
				const {chart: {period}} = state;
				if (websocket) {
					websocket.request({
						req: WebsocketRequest.CloseLine,
						contract,
						period,
						handler: requestHandler,
					});
					websocket.subscribe({
						sub: WebsocketSubscription.CloseLine,
						contract,
						period,
						handler: streamHandler,
					});
				}
			}
		} else {
			next(action);
		}
	}
;

export default connectionHostMiddleware;