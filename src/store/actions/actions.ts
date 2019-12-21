import {
	BidAskData,
	ChartPeriods,
	CloseLineData,
	CloseLinePoint,
	ConnectionStatus,
	IContract,
	ILogMessage,
	ITradingPrices
} from "../types";
import { contracts } from "../../service/constants";
import {
	Actions,
	AddLogMessage,
	ChangeConnectionStatus,
	SetChartViewMode,
	SetSymbolCL,
	SetSymbolContract,
	UpdateSymbolCL,
	UpdateSymbolL2,
	UpdateTradingPrices
} from "./types";
import { ChartTimePriceData } from "../../components/chart3L/types";

export const setSymbolContract = (name: string, left: boolean): SetSymbolContract => {
	const contract: IContract = contracts.find((cont) => cont.name === name) || contracts[0];
	return {
		type: Actions.SET_SYMBOL_CONTRACT,
		payload: contract,
		left}
};

export const changeConnectionStatus = (): ChangeConnectionStatus => {
	return {type: Actions.CHANGE_CONNECTION_STATUS}
};

export const setConnectionStatus = (payload: ConnectionStatus) => {
	return {
		type: Actions.SET_CONNECTION_STATUS,
		payload,
	};
};

export const updateSymbolL2 = (payload: BidAskData, meta: 1 | 2): UpdateSymbolL2 => {
	return {
		type: Actions.UPDATE_SYMBOL_L2,
		payload,
		meta,
	}
};

export const setSymbolCL = (payload: CloseLineData, meta: 1 | 2): SetSymbolCL => {
	return {
		type: Actions.SET_SYMBOL_CL,
		payload,
		meta,
	}
};

export const updateSymbolCL = (payload: CloseLinePoint, meta: 1 | 2): UpdateSymbolCL => {
	return {
		type: Actions.UPDATE_SYMBOL_CL,
		payload,
		meta,
	}
};

export const setChartPeriod = (payload: ChartPeriods) => {
	return {
		type: Actions.SET_CHART_PERIOD,
		payload,
	}
};

export const setChartViewMode = (payload: string): SetChartViewMode => {
	return {
		type: Actions.SET_CHART_VIEWMODE,
		payload,
	}
};

export const setChartSymbolData = (payload: ChartTimePriceData,  meta: 1 | 2) => {
	return {
		type: Actions.SET_CHART_SYMBOL_DATA,
		payload,
		meta,
	}
};

export const setChartSpreadData = (payload: ChartTimePriceData[]) => {
	return {
		type: Actions.SET_CHART_SPREAD_DATA,
		payload
	}
};

export const updateTradingPrices = (payload: ITradingPrices): UpdateTradingPrices => {
	return {
		type: Actions.UPDATE_TRADING_PRICES,
		payload,
	}
};

export const addLogMessage = (payload: ILogMessage): AddLogMessage => {
	return {
		type: Actions.ADD_LOG_MESSAGE,
		payload,
	}
};