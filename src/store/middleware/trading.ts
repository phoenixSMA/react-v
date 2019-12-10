import { Dispatch, Middleware, MiddlewareAPI } from "redux";
import { Actions, ActionTypes } from "../actions/types";
import { IPricePercent, IState, ITradingPrices } from "../types";
import { updateTradingPrices } from "../actions/actions";

const tradingMiddleware: Middleware = ({getState}: MiddlewareAPI) => (next: Dispatch) => (action: ActionTypes) => {
	next(action);
	const state: IState = getState();
	const {symbol1, symbol2} = state;
	const trading: ITradingPrices = JSON.parse(JSON.stringify(state.trading));
	const formatter = Math.min(symbol1.formatter, symbol2.formatter);
	switch (action.type) {
		case Actions.UPDATE_SYMBOL1_L2:
		case Actions.UPDATE_SYMBOL2_L2:
			const mid1 = (symbol1.asks[symbol1.asks.length - 1][0] + symbol1.bids[0][0]) / 2;
			trading.asks = calcPricePercent(symbol1.asks[symbol1.asks.length - 1][0] - symbol2.asks[symbol2.asks.length - 1][0], mid1, formatter);
			trading.bids = calcPricePercent(symbol1.bids[0][0] - symbol2.bids[0][0], mid1, formatter);
			trading.buyMarket = calcPricePercent(symbol1.asks[symbol1.asks.length - 1][0] - symbol2.bids[0][0], mid1, formatter);
			trading.sellMarket = calcPricePercent(symbol1.bids[0][0] - symbol2.asks[symbol2.asks.length - 1][0], mid1, formatter);
			next(updateTradingPrices(trading));
	}
};

export default tradingMiddleware;

const calcPricePercent = (value: number, base: number, formatter: number): IPricePercent => {
	return {
		price: value.toFixed(formatter),
		percent: (value / base * 100).toFixed(3)
	};
};