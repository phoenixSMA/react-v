import {ChartData} from "react-chartjs-2";
import {ChartOptions} from "chart.js";

type Level2Row = [number, number];

export type Level2Data = Level2Row[];

export type CloseLinePoint = [number, number];

export type CloseLineData = CloseLinePoint[];

export type BidAskData = { asks: Level2Data, bids: Level2Data };

export interface IContract {
    text: string;
    name: string;
    underlying: string;
    exchange: string;
    formatter: number;
}

export interface ISymbol extends IContract {
    asks: Level2Data;
    bids: Level2Data;
    closeLine: CloseLineData;
}

export type ChartPeriods = `M1` | `M5` | `M15` | `M30` | `H1` | `H4` | `D1`;

export interface IState {
    symbol1: ISymbol;
    symbol2: ISymbol;
    connectionStatus: ConnectionStatus;
    chart: {
        period: ChartPeriods;
        viewMode: string;
        data: ChartData<any>;
        options: ChartOptions;
    };
    trading: ITradingPrices;
    log: ILogMessage[];
}

export interface ITradingPrices {
    deltaAsks: IPricePercent;
    deltaBids: IPricePercent;
    sellMarket: IPricePercent;
    buyMarket: IPricePercent;
    spreadBO: IPricePercent;
    spreadLevels: ISpreadLevel[];
    formatter: number;
}

export interface IPricePercent {
    price?: number | undefined;
    percent: number | undefined;
}

export interface IPriceSideIdx {
    price: number | undefined,
    side: TradeSides | undefined,
    idx: number,
}

export interface IOrderLevel extends IPricePercent {
    side: TradeSides;
    qty: number;
}

export interface ISpreadLevel {
    level: IOrderLevel,
    orders: {
        symbol1: IPriceSideIdx;
        symbol2: IPriceSideIdx;
    };
}

export enum ConnectionStatus {
    Disconnected,
    Connecting,
    Connected,
    Error,
}

export enum TradeSides {
    Buy = 'BUY',
    Sell = 'SELL',
}

export enum LogTypes {
    Error,
    Success,
    Warning,
    Info,
    Message,
}

export interface ILogMessage {
    type: LogTypes;
    time: number;
    message: string;
}
