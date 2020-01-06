import {
    BidAskData,
    ChartPeriods,
    CloseLineData,
    CloseLinePoint,
    ConnectionStatus,
    IContract,
    ILogMessage,
    IOrderLevel,
    ITrading
} from "../types";
import { contracts } from "../../service/constants";
import {
    Actions,
    AddLogMessage,
    ChangeConnectionStatus,
    ChangeTraderStatus,
    SetChartViewMode,
    SetSymbolCL,
    SetSymbolContract,
    SetTraderStatus,
    SetTradingLevels,
    UpdateSymbolCL,
    UpdateSymbolL2,
    UpdateTradingPrices
} from "./types";
import { ChartTimePriceData } from "../../components/chart3L/types";
import { TraderStatus } from "../../common/trader-status";

export const setSymbolContract = (name: string, left: boolean): SetSymbolContract => {
    const contract: IContract = contracts.find((cont) => cont.name === name) || contracts[0];
    return {
        type: Actions.SET_SYMBOL_CONTRACT,
        payload: contract,
        left
    }
};

export const changeConnectionStatus = (): ChangeConnectionStatus => {
    return {
        type: Actions.CHANGE_CONNECTION_STATUS
    }
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

export const setChartSymbolData = (payload: ChartTimePriceData, meta: 1 | 2) => {
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

export const updateTradingPrices = (payload: ITrading): UpdateTradingPrices => {
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

export const setTradingLevels = (payload: IOrderLevel[]): SetTradingLevels => {
    return {
        type: Actions.SET_TRADING_LEVELS,
        payload,
    }
};

export const setTraderStatus = (payload: TraderStatus): SetTraderStatus => {
    return {
        type: Actions.SET_TRADER_STATUS,
        payload,
    }
};

export const changeTraderStatus = (): ChangeTraderStatus => {
    return {
        type: Actions.CHANGE_TRADER_STATUS,
    }
};
