import { WebsocketTypes } from "../service/websockets/types";

type L2Row = [number, number];

export type L2Data = L2Row[];

export type CloseLinePoint = [number, number];

export type CloseLineData = CloseLinePoint[];

export type BidAskData = { asks: L2Data, bids: L2Data };

export interface ISymbol extends IContract {
	asks: L2Data;
	bids: L2Data;
	closeLine: CloseLineData;
	websocket: WebsocketTypes | null;
}

export interface IState {
	symbol1: ISymbol,
	symbol2: ISymbol,
	connectionStatus: ConnectionStatus,
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

// ACTION NAMES
export enum Actions {
	SET_SYMBOL1_CONTRACT = `SET_SYMBOL1`,
	SET_SYMBOL2_CONTRACT = `SET_SYMBOL2`,
	CHANGE_CONNECTION_STATUS = `CHANGE_CONNECTION_STATUS`,
	SET_CONNECTION_STATUS = `SET_CONNECTION_STATUS`,
	SET_SYMBOL1_WEBSOCKET = `SET_SYMBOL1_WEBSOCKET`,
	SET_SYMBOL2_WEBSOCKET = `SET_SYMBOL2_WEBSOCKET`,
	WEBSOCKET_OPENED = `WEBSOCKET_OPENED`,
	WEBSOCKET_CLOSED = `WEBSOCKET_CLOSED`,
	UPDATE_SYMBOL1_L2 = `UPDATE_SYMBOL1_L2`,
	UPDATE_SYMBOL2_L2 = `UPDATE_SYMBOL2_L2`,
	SET_SYMBOL1_CL = `SET_SYMBOL1_CL`,
	SET_SYMBOL2_CL = `SET_SYMBOL2_CL`,
	UPDATE_SYMBOL1_CL = `UPDATE_SYMBOL1_CL`,
	UPDATE_SYMBOL2_CL = `UPDATE_SYMBOL2_CL`,
}

interface SetSymbol1Contract {
	type: typeof Actions.SET_SYMBOL1_CONTRACT;
	payload: IContract;
}

interface SetSymbol2Contract {
	type: typeof Actions.SET_SYMBOL2_CONTRACT;
	payload: IContract;
}

interface ChangeConnectionStatus {
	type: typeof Actions.CHANGE_CONNECTION_STATUS;
}

interface SetConnectionStatus {
	type: typeof Actions.SET_CONNECTION_STATUS;
	payload: ConnectionStatus;
}

interface SetSymbol1Websocket {
	type: typeof Actions.SET_SYMBOL1_WEBSOCKET,
	payload: WebsocketTypes,
}

interface SetSymbol2Websocket {
	type: typeof Actions.SET_SYMBOL2_WEBSOCKET,
	payload: WebsocketTypes,
}

interface WebsocketOpened {
	type: typeof Actions.WEBSOCKET_OPENED,
	payload: { exchange: string },
}

interface WebsocketClosed {
	type: typeof Actions.WEBSOCKET_CLOSED,
	payload: { exchange: string, error: boolean },
}

interface UpdateSymbol1L2 {
	type: typeof Actions.UPDATE_SYMBOL1_L2,
	payload: BidAskData,
}

interface UpdateSymbol2L2 {
	type: typeof Actions.UPDATE_SYMBOL2_L2,
	payload: BidAskData,
}

interface SetSymbol1CL {
	type: typeof Actions.SET_SYMBOL1_CL,
	payload: CloseLineData,
}

interface SetSymbol2CL {
	type: typeof Actions.SET_SYMBOL2_CL,
	payload: CloseLineData,
}

interface UpdateSymbol1CL {
	type: typeof Actions.UPDATE_SYMBOL1_CL,
	payload: CloseLinePoint,
}

interface UpdateSymbol2CL {
	type: typeof Actions.UPDATE_SYMBOL2_CL,
	payload: CloseLinePoint,
}

export type  ActionTypes = SetSymbol1Contract
	| SetSymbol2Contract
	| ChangeConnectionStatus
	| SetConnectionStatus
	| SetSymbol1Websocket
	| SetSymbol2Websocket
	| WebsocketOpened
	| WebsocketClosed
	| UpdateSymbol1L2
	| UpdateSymbol2L2
	| SetSymbol1CL
	| SetSymbol2CL
	| UpdateSymbol1CL
	| UpdateSymbol2CL;
