import { HuobiWebsocket } from "./huobi";
import { BidAskData, ChartPeriods, CloseLineData, CloseLinePoint } from "../../store/types";

export type WebsocketTypes = HuobiWebsocket;

export interface SubscribeParams {
	sub: WebsocketSubscription;
	contract: string;
	type?: string;
	period?: ChartPeriods;
	handler: WebsocketSubscribeHandler;
}

export interface RequestParams {
	req: WebsocketRequest;
	contract: string;
	period?: ChartPeriods;
	handler: WebsocketRequestHandler;
}

export interface IWebsocket {
	status: WebsocketStatus;
	exchange: string;
	open: (handler: WebsocketStatusHandler) => void;
	close: () => void;
	subscribe: (params: SubscribeParams) => void;
	request: (params: RequestParams) => void;
}

export enum WebsocketStatus {
	Closed,
	Opened
}

export type SubsriptionData = BidAskData | CloseLinePoint;

export type RequestData = CloseLineData;

export type WebsocketStatusHandler = (exchange: string, state: WebsocketStatus, error?: boolean) => void;

export type WebsocketSubscribeHandler = (exchange: string, symbol: string, sub: WebsocketSubscription, data: SubsriptionData) => void;

export type WebsocketRequestHandler = (exchange: string, symbol: string, req: WebsocketRequest, data: RequestData) => void;

export enum WebsocketSubscription {
	CloseLine,
	MarketDepth,
}

export enum WebsocketRequest {
	CloseLine,
}