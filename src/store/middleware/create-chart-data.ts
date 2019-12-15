import { Dispatch, Middleware, MiddlewareAPI } from "redux";
import { Actions, ActionTypes } from "../actions/types";
import { CloseLinePoint, ConnectionStatus, IState, ISymbol } from "../types";
import { ChartTimePriceData, ChartTimePricePoint } from "../../components/chart3L/types";
import { setChartSpreadData, setChartSymbolData } from "../actions/actions";

export const createChartDataMiddleware: Middleware = ({getState}: MiddlewareAPI) => (next: Dispatch) => (action: ActionTypes) => {
	next(action);
	const {symbol1, symbol2, connectionStatus, chart: {viewMode}}: IState = getState();
	if (connectionStatus !== ConnectionStatus.Connected) {
		return;
	}
	const price = viewMode === `price`;
	switch (action.type) {
		case Actions.SET_SYMBOL_CL: {
			const symbol = action.meta === 1 ? symbol1 : symbol2;
			next(setChartSymbolData(createSymbolChartData(symbol), action.meta));
			next(setChartSpreadData(createSpreadChartData(symbol1, symbol2, price)));
			return;
		}
		case Actions.UPDATE_SYMBOL_CL: {
			const symbol = action.meta === 1 ? symbol1 : symbol2;
			next(setChartSymbolData(createSymbolChartData(symbol), action.meta));
			next(setChartSpreadData(createSpreadChartData(symbol1, symbol2, price)));
			return;
		}
		case Actions.SET_CHART_VIEWMODE:
			next(setChartSpreadData(createSpreadChartData(symbol1, symbol2, price)));
			return;
	}
};

const createSymbolChartData = (symbol: ISymbol): ChartTimePriceData => {
	const {formatter} = symbol;
	return symbol.closeLine.map((point: CloseLinePoint) => {
		return {x: point[0] * 1000, y: point[1].toFixed(formatter)}
	})
};

const createSpreadChartData = (symbol1: ISymbol, symbol2: ISymbol, price: boolean): ChartTimePriceData[] => {
	const spreadLine: ChartTimePriceData = [];
	let spreadData: ChartTimePriceData = [];
	const {formatter} = symbol1;
	for (const point1 of symbol1.closeLine) {
		const time = point1[0];
		const point2 = symbol2.closeLine.find((p) => p[0] === time);
		if (point2) {
			spreadData.push({x: time * 1000, y: (point1[1] - point2[1]).toFixed(formatter)});
		}
	}
	if (!price) {
		const base = symbol1.closeLine[symbol1.closeLine.length - 1][1];
		spreadData = spreadData.map<ChartTimePricePoint>((p) => {
			return {x: p.x, y: ((p.y as unknown as number) / base * 100).toFixed(3)}
		});
	}
	if (spreadData.length){
		const y = spreadData[spreadData.length - 1].y;
		spreadLine.push({x: spreadData[0].x, y});
		spreadLine.push({x: spreadData[spreadData.length - 1].x, y});
	}
	return [spreadLine, spreadData];
};