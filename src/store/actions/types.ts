// ACTION NAMES
import {
	BidAskData,
	ChartPeriods,
	CloseLineData,
	CloseLinePoint,
	ConnectionStatus,
	IContract, ILogMessage, IOrderLevel,
	ITradingPrices
} from "../types";
import { ChartTimePriceData } from "../../components/chart3L/types";

export enum Actions {
	SET_SYMBOL_CONTRACT = `SET_SYMBOL_CONTRACT`,
	CHANGE_CONNECTION_STATUS = `CHANGE_CONNECTION_STATUS`,
	SET_CONNECTION_STATUS = `SET_CONNECTION_STATUS`,
	WEBSOCKET_OPENED = `WEBSOCKET_OPENED`,
	WEBSOCKET_CLOSED = `WEBSOCKET_CLOSED`,
	UPDATE_SYMBOL_L2 = `UPDATE_SYMBOL_L2`,
	SET_SYMBOL_CL = `SET_SYMBOL_CL`,
	UPDATE_SYMBOL_CL = `UPDATE_SYMBOL_CL`,
	SET_CHART_PERIOD = `SET_CHART_PERIOD`,
	SET_CHART_VIEWMODE = `SET_CHART_VIEWMODE`,
	SET_CHART_SYMBOL_DATA = `SET_CHART_SYMBOL_DATA`,
	SET_CHART_SPREAD_DATA = `SET_CHART_SPREAD_DATA`,
	UPDATE_TRADING_PRICES = `UPDATE_TRADING_PRICES`,
	ADD_LOG_MESSAGE = `ADD_LOG_MESSAGE`,
	SET_TRADING_LEVELS = `SET_TRADING_LEVELS`,
}

export interface SetSymbolContract {
	type: typeof Actions.SET_SYMBOL_CONTRACT;
	payload: IContract;
	left: boolean;
}

export interface ChangeConnectionStatus {
	type: typeof Actions.CHANGE_CONNECTION_STATUS;
}

export interface SetConnectionStatus {
	type: typeof Actions.SET_CONNECTION_STATUS;
	payload: ConnectionStatus;
}

export interface WebsocketOpened {
	type: typeof Actions.WEBSOCKET_OPENED;
	payload: { exchange: string };
}

export interface WebsocketClosed {
	type: typeof Actions.WEBSOCKET_CLOSED;
	payload: { exchange: string, error: boolean };
}

export interface UpdateSymbolL2 {
	type: typeof Actions.UPDATE_SYMBOL_L2;
	payload: BidAskData;
	meta: 1 | 2;
}

export interface SetSymbolCL {
	type: typeof Actions.SET_SYMBOL_CL;
	payload: CloseLineData;
	meta: 1 | 2;
}

export interface UpdateSymbolCL {
	type: typeof Actions.UPDATE_SYMBOL_CL;
	payload: CloseLinePoint;
	meta: 1 | 2;
}

export interface SetChartPeriod {
	type: typeof Actions.SET_CHART_PERIOD;
	payload: ChartPeriods;
}

export interface SetChartViewMode {
	type: typeof Actions.SET_CHART_VIEWMODE;
	payload: string;
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

export interface UpdateTradingPrices {
	type: typeof Actions.UPDATE_TRADING_PRICES;
	payload: ITradingPrices;
}

export interface AddLogMessage {
	type: typeof Actions.ADD_LOG_MESSAGE;
	payload: ILogMessage;
}

export interface SetTradingLevels {
	type: typeof Actions.SET_TRADING_LEVELS,
	payload: IOrderLevel[],
}

export type  ActionTypes = SetSymbolContract
	| ChangeConnectionStatus
	| SetConnectionStatus
	| WebsocketOpened
	| WebsocketClosed
	| UpdateSymbolL2
	| SetSymbolCL
	| UpdateSymbolCL
	| SetChartPeriod
	| SetChartViewMode
	| SetChartSymbolData
	| SetChartSpreadData
	| UpdateTradingPrices
	| AddLogMessage
	| SetTradingLevels;
