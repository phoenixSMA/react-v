import { Actions, BidAskData, CloseLineData, CloseLinePoint, ConnectionStatus, IContract } from "../types";
import { contracts } from "../../service/constants";
import { WebsocketTypes } from "../../service/websockets/types";

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

export const setSymbol1Websocket = (websocket: WebsocketTypes | null) => {
	return {type: Actions.SET_SYMBOL1_WEBSOCKET, payload: websocket};
};

export const setSymbol2Websocket = (websocket: WebsocketTypes | null) => {
	return {type: Actions.SET_SYMBOL2_WEBSOCKET, payload: websocket};
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