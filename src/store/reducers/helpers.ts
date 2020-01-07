import {
    ChartPeriods,
    CloseLineData,
    CloseLinePoint,
    ConnectionStatus,
    IContract,
    IOrderLevel,
    IPricePercent,
    IState,
    ISymbol,
} from "../types";
import { contracts } from "../../service/constants";
import { data, options } from "../../components/chart3L/config";
import { TraderStatus } from "../../common/trader-status";

export const getCloseLine = (line: CloseLineData, point: CloseLinePoint) => {
    const idx = line.findIndex((clp: CloseLinePoint) => clp[0] === point[0]);
    let closeLine: CloseLineData;
    if (idx > -1) {
        closeLine = [
            ...line.slice(0, idx),
            point,
            ...line.slice(idx + 1),
        ]
    } else {
        closeLine = [...line, point];
    }
    return closeLine;
};

export const resetL2 = () => {
    return {
        asks: Array(20).fill([0, 0]),
        bids: Array(20).fill([0, 0]),
    }
};

const initSymbol: ISymbol = {
    ...contracts[0],
    ...resetL2(),
    closeLine: [],
};

const initPricePercent = (): IPricePercent => {
    return {
        price: undefined,
        percent: undefined,
    }
};

export const initSpreadLevel = (level: IOrderLevel) => {
    return {
        level,
        orders: {
            symbol1: {
                price: undefined,
                side: undefined,
                idx: 19,
            },
            symbol2: {
                price: undefined,
                side: undefined,
                idx: 19,
            },
        },
    }
};

export const initTrading = (formatter: number = 0, traderStatus: TraderStatus = TraderStatus.Idle) => {
    return {
        deltaAsks: initPricePercent(),
        deltaBids: initPricePercent(),
        buyMarket: initPricePercent(),
        sellMarket: initPricePercent(),
        spreadBO: initPricePercent(),
        formatter,
        spreadLevels: [],
        traderStatus,
    }
};

export const initialState = (): IState => {
    const contract1: IContract = contracts.find(({ name }) => name === localStorage.getItem(`symbol1`)) || contracts[0];
    const contract2: IContract = contracts.find(({ name }) => name === localStorage.getItem(`symbol2`)) || contracts[1];
    const period: ChartPeriods = localStorage.getItem(`period`) as ChartPeriods || `M1`;
    const viewMode: string = localStorage.getItem(`viewMode`) || `price`;
    data.datasets![1].label = `${contract1.name} - ${contract2.name}`;
    data.datasets![2].label = contract1.name;
    data.datasets![3].label = contract2.name;
    return {
        symbol1: Object.assign({}, initSymbol, contract1),
        symbol2: Object.assign({}, initSymbol, contract2),
        connectionStatus: ConnectionStatus.Disconnected,
        chart: {
            period,
            viewMode,
            data,
            options,
        },
        trading: initTrading(),
        log: [],
    }
};
