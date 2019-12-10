// ACTION NAMES
import { WebsocketTypes } from "../../service/websockets/types";
import {
	BidAskData,
	ChartPeriods,
	CloseLineData,
	CloseLinePoint,
	ConnectionStatus,
	IContract,
	IPricePercent,
	ISpreadPrices, ITradingPrices
} from "../types";
import { ChartTimePriceData } from "../../components/chart3L/types";

export enum Actions {
	SET_SYMBOL1_CONTRACT = `SET_SYMBOL1`,
	SET_SYMBOL2_CONTRACT = `SET_SYMBOL2`,
	CHANGE_CONNECTION_STATUS = `CHANGE_CONNECTION_STATUS`,
	SET_CONNECTION_STATUS = `SET_CONNECTION_STATUS`,
	WEBSOCKET_OPENED = `WEBSOCKET_OPENED`,
	WEBSOCKET_CLOSED = `WEBSOCKET_CLOSED`,
	UPDATE_SYMBOL1_L2 = `UPDATE_SYMBOL1_L2`,
	UPDATE_SYMBOL2_L2 = `UPDATE_SYMBOL2_L2`,
	SET_SYMBOL1_CL = `SET_SYMBOL1_CL`,
	SET_SYMBOL2_CL = `SET_SYMBOL2_CL`,
	UPDATE_SYMBOL1_CL = `UPDATE_SYMBOL1_CL`,
	UPDATE_SYMBOL2_CL = `UPDATE_SYMBOL2_CL`,
	SET_CHART_PERIOD = `SET_CHART_PERIOD`,
	SET_CHART_VIEWMODE = `SET_CHART_VIEWMODE`,
	SET_CHART_SYMBOL_DATA = `SET_CHART_SYMBOL_DATA`,
	SET_CHART_SPREAD_DATA = `SET_CHART_SPREAD_DATA`,
	UPDATE_PRICE_ASKS = `UPDATE_PRICE_ASKS`,
	UPDATE_PRICE_BIDS = `UPDATE_PRICE_BIDS`,
	UPDATE_PRICE_SELLMARKET = `UPDATE_PRICE_SELLMARKET`,
	UPDATE_PRICE_BUYMARKET = `UPDATE_PRICE_BUYMARKET`,
	UPDATE_SPREAD_PRICES = `UPDATE_SPREAD_PRICES`,
	UPDATE_TRADING_PRICES = `UPDATE_TRADING_PRICES`,
}

export interface SetSymbol1Contract {
	type: typeof Actions.SET_SYMBOL1_CONTRACT;
	payload: IContract;
}

export interface SetSymbol2Contract {
	type: typeof Actions.SET_SYMBOL2_CONTRACT;
	payload: IContract;
}

export interface ChangeConnectionStatus {
	type: typeof Actions.CHANGE_CONNECTION_STATUS;
}

export interface SetConnectionStatus {
	type: typeof Actions.SET_CONNECTION_STATUS;
	payload: ConnectionStatus;
}

export interface WebsocketOpened {
	type: typeof Actions.WEBSOCKET_OPENED,
	payload: { exchange: string },
}

export interface WebsocketClosed {
	type: typeof Actions.WEBSOCKET_CLOSED,
	payload: { exchange: string, error: boolean },
}

export interface UpdateSymbol1L2 {
	type: typeof Actions.UPDATE_SYMBOL1_L2,
	payload: BidAskData,
}

export interface UpdateSymbol2L2 {
	type: typeof Actions.UPDATE_SYMBOL2_L2,
	payload: BidAskData,
}

export interface SetSymbol1CL {
	type: typeof Actions.SET_SYMBOL1_CL,
	payload: CloseLineData,
}

export interface SetSymbol2CL {
	type: typeof Actions.SET_SYMBOL2_CL,
	payload: CloseLineData,
}

export interface UpdateSymbol1CL {
	type: typeof Actions.UPDATE_SYMBOL1_CL,
	payload: CloseLinePoint,
}

export interface UpdateSymbol2CL {
	type: typeof Actions.UPDATE_SYMBOL2_CL,
	payload: CloseLinePoint,
}

export interface SetChartPeriod {
	type: typeof Actions.SET_CHART_PERIOD,
	payload: ChartPeriods,
}

export interface SetChartViewMode {
	type: typeof Actions.SET_CHART_VIEWMODE,
	payload: string,
}

export interface SetChartSymbolData {
	type: typeof Actions.SET_CHART_SYMBOL_DATA;
	payload: ChartTimePriceData;
	meta: 1 | 2;
}

export interface SetChartSpreadData {
	type: typeof Actions.SET_CHART_SPREAD_DATA;
	payload: ChartTimePriceData;
}

export interface UpdatePrice {
	type: typeof Actions.UPDATE_PRICE_ASKS
		| typeof Actions.UPDATE_PRICE_BIDS
		| typeof Actions.UPDATE_PRICE_SELLMARKET
		| typeof Actions.UPDATE_PRICE_BUYMARKET;
	payload: IPricePercent;
}

export interface UpdateSpeadPrices {
	type: typeof Actions.UPDATE_SPREAD_PRICES;
	payload: ISpreadPrices;
	side: `buy` | `sell`;
}

export interface UpdateTradingPrices {
	type: typeof Actions.UPDATE_TRADING_PRICES;
	payload: ITradingPrices;
}

export type  ActionTypes = SetSymbol1Contract
	| SetSymbol2Contract
	| ChangeConnectionStatus
	| SetConnectionStatus
	| WebsocketOpened
	| WebsocketClosed
	| UpdateSymbol1L2
	| UpdateSymbol2L2
	| SetSymbol1CL
	| SetSymbol2CL
	| UpdateSymbol1CL
	| UpdateSymbol2CL
	| SetChartPeriod
	| SetChartViewMode
	| SetChartSymbolData
	| SetChartSpreadData
	| UpdatePrice
	| UpdateSpeadPrices
	| UpdateTradingPrices;