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
			trading.asks = calcPercentFromPrice(symbol1.asks[symbol1.asks.length - 1][0] - symbol2.asks[symbol2.asks.length - 1][0], mid1, formatter);
			trading.bids = calcPercentFromPrice(symbol1.bids[0][0] - symbol2.bids[0][0], mid1, formatter);
			trading.buyMarket = calcPercentFromPrice(symbol1.asks[symbol1.asks.length - 1][0] - symbol2.bids[0][0], mid1, formatter);
			trading.sellMarket = calcPercentFromPrice(symbol1.bids[0][0] - symbol2.asks[symbol2.asks.length - 1][0], mid1, formatter);
			trading.spreadMarket = calcPercentFromPrice(+trading.buyMarket.price! - +trading.sellMarket.price!, mid1, formatter);
			trading.spreadSell.level = calcPriceFromPercent(+trading.spreadSell.level.percent!, mid1, formatter);
			trading.spreadBuy.level = calcPriceFromPercent(+trading.spreadBuy.level.percent!, mid1, formatter);
			next(updateTradingPrices(trading));
	}
};

export default tradingMiddleware;

const calcPercentFromPrice = (price: number, base: number, formatter: number): IPricePercent => {
	return {
		price: price.toFixed(formatter),
		percent: (price / base * 100).toFixed(3)
	};
};

const calcPriceFromPercent = (percent: number, base: number, formatter: number): IPricePercent => {
	return {
		price: (percent * base / 100).toFixed(formatter),
		percent: percent.toFixed(3)
	};
};