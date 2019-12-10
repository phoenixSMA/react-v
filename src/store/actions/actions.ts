import {
	BidAskData,
	ChartPeriods,
	CloseLineData,
	CloseLinePoint,
	ConnectionStatus,
	IContract,
	IPricePercent,
	ISpreadPrices,
	ITradingPrices
} from "../types";
import { contracts } from "../../service/constants";
import { WebsocketTypes } from "../../service/websockets/types";
import { Actions, SetChartViewMode, UpdatePrice, UpdateSpeadPrices, UpdateTradingPrices } from "./types";
import { ChartTimePriceData } from "../../components/chart3L/types";

export const setSymbol1Contract = (name: string) => {
	const contract: IContract | undefined = contracts.find((cont) => cont.name === name);
	return {type: Actions.SET_SYMBOL1_CONTRACT, payload: contract}
};
export const setSymbol2Contract = (name: string) => {
	const contract: IContract | undefined = contracts.find((cont) => cont.name === name);
	return {type: Actions.SET_SYMBOL2_CONTRACT, payload: contract}
};

export const changeConnectionStatus = () => {
	return {type: Actions.CHANGE_CONNECTION_STATUS}
};

export const setConnectionStatus = (status: ConnectionStatus) => {
	return {type: Actions.SET_CONNECTION_STATUS, payload: status};
};

export const updateSymbol1L2 = (data: BidAskData) => {
	return {type: Actions.UPDATE_SYMBOL1_L2, payload: data}
};

export const updateSymbol2L2 = (data: BidAskData) => {
	return {type: Actions.UPDATE_SYMBOL2_L2, payload: data}
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

export const updatePrice = (price: IPricePercent, mode: `asks` | `bids` | `sellmarket` | 'buymarket' | `selllevel` | 'buylevel'): UpdatePrice => {
	switch (mode) {
		case "asks":
			return {type: Actions.UPDATE_PRICE_ASKS, payload: price};
		case "bids":
			return {type: Actions.UPDATE_PRICE_BIDS, payload: price};
		case "sellmarket":
			return {type: Actions.UPDATE_PRICE_SELLMARKET, payload: price};
		case "buymarket":
			return {type: Actions.UPDATE_PRICE_BUYMARKET, payload: price};
		case "selllevel":
			return {type: Actions.UPDATE_PRICE_SELLMARKET, payload: price};
		case "buylevel":
			return {type: Actions.UPDATE_PRICE_BUYMARKET, payload: price};
	}
};

export const updateSpeadPrices = (prices: ISpreadPrices, side: `buy` | `sell`): UpdateSpeadPrices => {
	return {
		type: Actions.UPDATE_SPREAD_PRICES,
		payload: prices,
		side,
	}
};

export const updateTradingPrices = (trading: ITradingPrices): UpdateTradingPrices => {
	return {
		type: Actions.UPDATE_TRADING_PRICES,
		payload: trading,
	}
};