import {
	BidAskData,
	ChartPeriods,
	CloseLineData,
	CloseLinePoint,
	ConnectionStatus,
	IContract,
	ITradingPrices
} from "../types";
import { contracts } from "../../service/constants";
import {
	Actions,
	ChangeConnectionStatus,
	SetChartViewMode,
	SetSymbolContract,
	UpdateSymbolL2,
	UpdateTradingPrices
} from "./types";
import { ChartTimePriceData } from "../../components/chart3L/types";

export const setSymbolContract = (name: string, left: boolean): SetSymbolContract => {
	const contract: IContract = contracts.find((cont) => cont.name === name) || contracts[0];
	return {type: Actions.SET_SYMBOL_CONTRACT, payload: contract, left}
};

export const changeConnectionStatus = (): ChangeConnectionStatus => {
	return {type: Actions.CHANGE_CONNECTION_STATUS}
};

export const setConnectionStatus = (status: ConnectionStatus) => {
	return {type: Actions.SET_CONNECTION_STATUS, payload: status};
};

export const updateSymbolL2 = (data: BidAskData, meta: 1|2): UpdateSymbolL2 => {
	return {type: Actions.UPDATE_SYMBOL_L2, payload: data, meta}
};

export const setSymbol1CL = (data: CloseLineData) => {
	return {type: Actions.SET_SYMBOL1_CL, payload: data}
};

export const setSymbol2CL = (data: CloseLineData) => {
	return {type: Actions.SET_SYMBOL2_CL, payload: data}
};

export const updateSymbol1CL = (data: CloseLinePoint) => {
	return {type: Actions.UPDATE_SYMBOL1_CL, payload: data}
};

export const updateSymbol2CL = (data: CloseLinePoint) => {
	return {type: Actions.UPDATE_SYMBOL2_CL, payload: data}
};

export const setChartPeriod = (data: ChartPeriods) => {
	return {type: Actions.SET_CHART_PERIOD, payload: data}
};

export const setChartViewMode = (data: string): SetChartViewMode => {
	return {type: Actions.SET_CHART_VIEWMODE, payload: data}
};

export const setChartSymbolData = (data: ChartTimePriceData, symbol: number) => {
	return {type: Actions.SET_CHART_SYMBOL_DATA, payload: data, meta: symbol}
};

export const setChartSpreadData = (data: ChartTimePriceData) => {
	return {type: Actions.SET_CHART_SPREAD_DATA, payload: data}
};

export const updateTradingPrices = (trading: ITradingPrices): UpdateTradingPrices => {
	return {
		type: Actions.UPDATE_TRADING_PRICES,
		payload: trading,
	}
};