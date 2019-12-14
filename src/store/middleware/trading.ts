import { Dispatch, Middleware, MiddlewareAPI } from "redux";
import { Actions, ActionTypes } from "../actions/types";
import { IPricePercent, IState, ITradingPrices, L2Data, OrderSides } from "../types";
import { updateTradingPrices } from "../actions/actions";
import { decAdjust } from "../../service/utils";

const tradingMiddleware: Middleware = ({getState}: MiddlewareAPI) => (next: Dispatch) => (action: ActionTypes) => {
	next(action);
	const state: IState = getState();
	const {symbol1, symbol2} = state;
	const trading: ITradingPrices = JSON.parse(JSON.stringify(state.trading));
	const formatter = Math.min(symbol1.formatter, symbol2.formatter);
	if (action.type === Actions.UPDATE_SYMBOL_L2) {
		const s1Ask = symbol1.asks[0][0];
		const s1Bid = symbol1.bids[0][0];
		const s2Ask = symbol2.asks[0][0];
		const s2Bid = symbol2.bids[0][0];
		const mid1 = (s1Ask + s1Bid) / 2;
		trading.deltaAsks = calcPercentFromPrice(s1Ask - s2Ask, mid1, `round`, formatter);
		trading.deltaBids = calcPercentFromPrice(s1Bid - s2Bid, mid1, `round`, formatter);
		trading.buyMarket = calcPercentFromPrice(s1Ask - s2Bid, mid1, `round`, formatter);
		trading.sellMarket = calcPercentFromPrice(s1Bid - s2Ask, mid1, `round`, formatter);
		trading.spreadBO = calcPercentFromPrice(+trading.buyMarket.price! - +trading.sellMarket.price!, mid1, `round`, formatter);
		trading.spreadSell.level = calcPriceFromPercent(+trading.spreadSell.level.percent!, mid1, `ceil`, formatter);
		trading.spreadBuy.level = calcPriceFromPercent(+trading.spreadBuy.level.percent!, mid1, `floor`, formatter);
		const s1AskLimit = trading.spreadSell.level.price! + s2Ask;
		const s1BidLimit = trading.spreadBuy.level.price! + s2Bid;
		const s2AskLimit = s1Ask - trading.spreadBuy.level.price!;
		const s2BidLimit = s1Bid - trading.spreadSell.level.price!;
		trading.spreadBuy.orders.symbol1.side = OrderSides.Buy;
		trading.spreadBuy.orders.symbol1.price = decAdjust(`floor`, s1BidLimit, -formatter);
		trading.spreadBuy.orders.symbol1.idx = calcIdx(`bid`, trading.spreadBuy.orders.symbol1.price, symbol1.bids);
		trading.spreadBuy.orders.symbol2.side = OrderSides.Sell;
		trading.spreadBuy.orders.symbol2.price = decAdjust(`ceil`, s2AskLimit, -formatter);
		trading.spreadBuy.orders.symbol2.idx = calcIdx(`ask`, trading.spreadBuy.orders.symbol2.price, symbol2.asks);
		trading.spreadSell.orders.symbol1.side = OrderSides.Sell;
		trading.spreadSell.orders.symbol1.price = decAdjust(`ceil`, s1AskLimit, -formatter);
		trading.spreadSell.orders.symbol1.idx = calcIdx(`ask`, trading.spreadSell.orders.symbol1.price, symbol1.asks);
		trading.spreadSell.orders.symbol2.side = OrderSides.Buy;
		trading.spreadSell.orders.symbol2.price = decAdjust(`floor`, s2BidLimit, -formatter);
		trading.spreadSell.orders.symbol2.idx = calcIdx(`bid`, trading.spreadSell.orders.symbol2.price, symbol2.bids);
		trading.formatter = formatter;
		next(updateTradingPrices(trading));
	}
};

export default tradingMiddleware;

const calcPercentFromPrice = (price: number, base: number, type: `floor` | `round` | `ceil`, formatter: number): IPricePercent => {
	return {
		price: decAdjust(type, price, -formatter),
		percent: decAdjust(`round`, price / base * 100, -3),
	};
};

const calcPriceFromPercent = (percent: number, base: number, type: `floor` | `round` | `ceil`, formatter: number): IPricePercent => {
	return {
		price: decAdjust(type, percent * base / 100, -formatter),
		percent: decAdjust('round', percent, -3),
	};
};

const calcIdx = (side: `bid` | `ask`, price: number, data: L2Data): number => {
	let idx: number;
	if (side === `bid`) {
		idx = data.findIndex(row => row[0] <= price);
	} else {
		idx = data.findIndex(row => row[0] >= price);
	}
	(idx === -1) && (idx = 19);
	return idx;
};
