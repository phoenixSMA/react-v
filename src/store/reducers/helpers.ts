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
	TradeSides
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

const emptySpreadLevel = (level: IOrderLevel) => {
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

export const emptyTrading = (formatter: number = 0) => {
	return {
		deltaAsks: emptyPricePercent(),
		deltaBids: emptyPricePercent(),
		buyMarket: emptyPricePercent(),
		sellMarket: emptyPricePercent(),
		spreadBO: emptyPricePercent(),
		formatter,
	}
};

export const initialState = (): IState => {
	const contract1: IContract = contracts.find(({ name }) => name === localStorage.getItem(`symbol1`)) || contracts[0];
	const contract2: IContract = contracts.find(({ name }) => name === localStorage.getItem(`symbol2`)) || contracts[1];
	const period: ChartPeriods = localStorage.getItem(`period`) as ChartPeriods || `M1`;
	const viewMode: string = localStorage.getItem(`viewMode`) || `price`;
	const sellLevel = 0.2;
	const buyLevel = -0.2;
	data.datasets![1].label = `${contract1.name} - ${contract2.name}`;
	data.datasets![2].label = contract1.name;
	data.datasets![3].label = contract2.name;
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
			...emptyTrading(),
			spreadLevels: [
				emptySpreadLevel({ side: TradeSides.Sell, percent: sellLevel, qty: 1 }),
				emptySpreadLevel({ side: TradeSides.Buy, percent: buyLevel, qty: 1 }),
			],
		},
		log: [],
	}
};
