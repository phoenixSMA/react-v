import { CloseLineData, CloseLinePoint, ConnectionStatus, IContract, IState, ISymbol } from "../types";
import { contracts } from "../../service/constants";

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
	websocket: null,
};

export const initialState = (): IState => {
	const contract1: IContract = contracts.find(({name}) => name === localStorage.getItem(`symbol1`)) || contracts[0];
	const contract2: IContract = contracts.find(({name}) => name === localStorage.getItem(`symbol2`)) || contracts[0];
	return {
		symbol1: Object.assign({}, emptySymbol, contract1),
		symbol2: Object.assign({}, emptySymbol, contract2),
		connectionStatus: ConnectionStatus.Disconnected,
	}
};