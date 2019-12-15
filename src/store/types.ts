import { ChartData } from "react-chartjs-2";
import { ChartOptions } from "chart.js";

type L2Row = [number, number];

export type L2Data = L2Row[];

export type CloseLinePoint = [number, number];

export type CloseLineData = CloseLinePoint[];

export type BidAskData = { asks: L2Data, bids: L2Data };

export interface ISymbol extends IContract {
	asks: L2Data;
	bids: L2Data;
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
	}
	trading: ITradingPrices;
}

export interface ITradingPrices {
	deltaAsks: IPricePercent;
	deltaBids: IPricePercent;
	sellMarket: IPricePercent;
	buyMarket: IPricePercent;
	spreadBO: IPricePercent;
	spreadLevels: ISpreadLevel[];
	formatter: number,
}

export interface IPricePercent {
	price?: number | undefined;
	percent: number | undefined;
}

export interface IOrderLevel extends IPricePercent {
	side: TradeSides;
	qty: number;
}

export interface ISpreadLevel {
	level: IOrderLevel,
	orders: {
		symbol1: {
			price: number | undefined;
			side: TradeSides | undefined;
			idx: number;
		},
		symbol2: {
			price: number | undefined;
			side: TradeSides | undefined;
			idx: number;
		},
	},
}

export interface IContract {
	text: string;
	name: string;
	underlying: string;
	exchange: string;
	formatter: number;
}

export enum ConnectionStatus {
	Disconnected,
	Connecting,
	Connected,
	Error,
}

export enum TradeSides {
	Buy,
	Sell,
}

