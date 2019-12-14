import {
	ChartPeriods,
	CloseLineData,
	CloseLinePoint,
	ConnectionStatus,
	IContract,
	IPricePercent,
	IState,
	ISymbol
} from "../types";
import { contracts } from "../../service/constants";
import { data, options } from "../../components/chart3L/config";

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

const emptySymbol: ISymbol = {
	...contracts[0],
	...resetL2(),
	closeLine: [],
};

const emptyPricePercent = (): IPricePercent => {
	return {
		price: undefined,
		percent: undefined,
	}
};

const emptySpread = (percent: number) => {
	return {
		level: {
			price: undefined,
			percent,
		},
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

export const initialState = (): IState => {
	const contract1: IContract = contracts.find(({name}) => name === localStorage.getItem(`symbol1`)) || contracts[0];
	const contract2: IContract = contracts.find(({name}) => name === localStorage.getItem(`symbol2`)) || contracts[0];
	const period: ChartPeriods = localStorage.getItem(`period`) as ChartPeriods || `M1`;
	const viewMode: string = localStorage.getItem(`viewMode`) || `price`;
	const sellLevel = 0.2;
	const buyLevel = -0.2;
	data.datasets![0].label = `${contract1.name} - ${contract2.name}`;
	data.datasets![1].label = contract1.name;
	data.datasets![2].label = contract2.name;
	return {
		symbol1: Object.assign({}, emptySymbol, contract1),
		symbol2: Object.assign({}, emptySymbol, contract2),
		connectionStatus: ConnectionStatus.Disconnected,
		chart: {
			period,
			viewMode,
			data,
			options,
		},
		trading: {
			deltaAsks: emptyPricePercent(),
			deltaBids: emptyPricePercent(),
			buyMarket: emptyPricePercent(),
			sellMarket: emptyPricePercent(),
			spreadBO: emptyPricePercent(),
			spreadSell: emptySpread(sellLevel),
			spreadBuy: emptySpread(buyLevel),
			formatter: 0,
		},
	}
};