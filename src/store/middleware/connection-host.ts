import { Actions, ActionTypes, BidAskData, CloseLineData, CloseLinePoint, ConnectionStatus, IState } from "../types";
import { Dispatch, Middleware, MiddlewareAPI } from "redux";
import {
	setConnectionStatus,
	setSymbol1CL,
	setSymbol1Websocket,
	setSymbol2CL,
	setSymbol2Websocket,
	updateSymbol1CL,
	updateSymbol1L2,
	updateSymbol2CL,
	updateSymbol2L2
} from "../actions/actions";
import { HuobiWebsocket } from "../../service/websockets/huobi";
import {
	SubsriptionData,
	WebsocketRequest,
	WebsocketRequestHandler,
	WebsocketStatus,
	WebsocketStatusHandler,
	WebsocketSubscribeHandler,
	WebsocketSubscription
} from "../../service/websockets/types";

const connectionHostMiddleware: Middleware = ({getState, dispatch}: MiddlewareAPI) => (next: Dispatch) => (action: ActionTypes) => {
		let state: IState = getState();
		const {connectionStatus, symbol1, symbol2} = state;
		const actionType = action.type;

		const statusHandler: WebsocketStatusHandler = (exchange, status, error) => {
			state = getState();
			const {symbol1, symbol2, chart: {period}} = state;
			if (status === WebsocketStatus.Opened) {
				for (const symbol of [symbol1, symbol2]) {
					if (exchange === symbol.exchange) {
						const contract = symbol.name.split(`:`)[1];
						symbol.websocket!.subscribe({
							sub: WebsocketSubscription.MarketDepth,
							contract,
							type: `step6`,
							handler: streamHandler,
						});
						symbol.websocket!.request({
							req: WebsocketRequest.CloseLine,
							contract,
							period,
							handler: requestHandler,
						});
						symbol.websocket!.subscribe({
							sub: WebsocketSubscription.CloseLine,
							contract,
							period,
							handler: streamHandler,
						});
					}
				}
				if (symbol1.websocket!.status === WebsocketStatus.Opened && symbol2.websocket!.status === WebsocketStatus.Opened) {
					next(setConnectionStatus(ConnectionStatus.Connected));
				}
			} else {
				if (error) {
					// todo обработать разрыв соединения - реконнесе
				} else {
					next(setSymbol1Websocket(null));
					next(setSymbol2Websocket(null));
				}
			}
		};

		const streamHandler: WebsocketSubscribeHandler = (exchange: string, symbol: string, sub: WebsocketSubscription, data: SubsriptionData) => {
			if (sub === WebsocketSubscription.MarketDepth) {
				if (`${exchange}:${symbol}` === symbol1.name) {
					next(updateSymbol1L2(data as BidAskData));
				}
				if (`${exchange}:${symbol}` === symbol2.name) {
					next(updateSymbol2L2(data as BidAskData));
				}
			} else if (sub === WebsocketSubscription.CloseLine) {
				if (`${exchange}:${symbol}` === symbol1.name) {
					next(updateSymbol1CL(data as CloseLinePoint));
				}
				if (`${exchange}:${symbol}` === symbol2.name) {
					next(updateSymbol2CL(data as CloseLinePoint));
				}
			}
		};

		const requestHandler: WebsocketRequestHandler = (exchange, symbol, req, data) => {
			if (req === WebsocketRequest.CloseLine) {
				if (`${exchange}:${symbol}` === symbol1.name) {
					next(setSymbol1CL(data as CloseLineData));
				}
				if (`${exchange}:${symbol}` === symbol2.name) {
					next(setSymbol2CL(data as CloseLineData));
				}
			}
		};

		const websocketByExchange = (exchange: string) => {
			return HuobiWebsocket; //todo добавить swith при появлении новых бирж
		};

		if (actionType === Actions.CHANGE_CONNECTION_STATUS) {
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
					const websocketClass = websocketByExchange(symbol1.exchange);
					let websocket = new websocketClass(false);
					websocket.open(statusHandler);
					next(setSymbol1Websocket(websocket));
					if (symbol2.exchange !== symbol1.exchange) {
						const websocketClass = websocketByExchange(symbol1.exchange);
						websocket = new websocketClass(false);
						websocket.open(statusHandler);
					}
					next(setSymbol2Websocket(websocket));
					break;
				case ConnectionStatus.Connected:
					symbol1.websocket!.close();
					symbol2.websocket!.close();
				default:
					next(setConnectionStatus(ConnectionStatus.Disconnected));
			}
		} else {
			console.log(`else Action: `, action);
			next(action);
		}
	}
;


export default connectionHostMiddleware;