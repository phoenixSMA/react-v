import { Dispatch, Middleware, MiddlewareAPI } from "redux";
import { Actions, ActionTypes } from "../actions/types";
import { IPricePercent, ISpreadLevel, IState, ITradingPrices, Level2Data, TradeSides } from "../types";
import { updateTradingPrices } from "../actions/actions";
import { decAdjust } from "../../service/utils";
import { emptyTrading } from "../reducers/helpers";

const tradingMiddleware: Middleware = ({getState}: MiddlewareAPI) => (next: Dispatch) => (action: ActionTypes) => {
	next(action);
	const state: IState = getState();
	const {symbol1, symbol2, trading} = state;
	const spreadLevels: ISpreadLevel[] = JSON.parse(JSON.stringify(trading.spreadLevels));
	const formatter = Math.min(symbol1.formatter, symbol2.formatter);
	if (action.type === Actions.UPDATE_SYMBOL_L2) {
		next(updateTradingPrices(calcTradingPrices({
			symbol1,
			symbol2,
			spreadLevels,
			formatter
		})));
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

const calcIdx = (side: `bid` | `ask`, price: number, data: Level2Data): number => {
	let idx: number;
	if (side === `bid`) {
		idx = data.findIndex(row => row[0] <= price);
	} else {
		idx = data.findIndex(row => row[0] >= price);
	}
	(idx === -1) && (idx = 19);
	return idx;
};

interface ICalcTradingParams {
	symbol1: {
		asks: Level2Data;
		bids: Level2Data;
	};
	symbol2: {
		asks: Level2Data;
		bids: Level2Data;
	};
	spreadLevels: ISpreadLevel[];
	formatter: number;
}

export const calcTradingPrices = (params: ICalcTradingParams): ITradingPrices => {
	const {symbol1, symbol2, spreadLevels, formatter} = params;
	const trading: ITradingPrices = {
		...emptyTrading(formatter),
		spreadLevels,
	};
	const s1Ask = symbol1.asks[0][0];
	const s1Bid = symbol1.bids[0][0];
	const s2Ask = symbol2.asks[0][0];
	const s2Bid = symbol2.bids[0][0];
	const mid1 = (s1Ask + s1Bid) / 2;
	trading.deltaAsks = calcPercentFromPrice(s1Ask - s2Ask, mid1, `round`, formatter);
	trading.deltaBids = calcPercentFromPrice(s1Bid - s2Bid, mid1, `round`, formatter);
	trading.buyMarket = calcPercentFromPrice(s1Ask - s2Bid, mid1, `round`, formatter);
	trading.sellMarket = calcPercentFromPrice(s1Bid - s2Ask, mid1, `round`, formatter);
	trading.spreadBO = calcPercentFromPrice(trading.buyMarket.price! - +trading.sellMarket.price!, mid1, `round`, formatter);
	for (const spreadLevel of trading.spreadLevels) {
		const {level} = spreadLevel;
		const type = level.side === TradeSides.Buy ? `floor` : `ceil`;
		spreadLevel.level = {
			...level,
			...calcPriceFromPercent(spreadLevel.level.percent!, mid1, type, formatter),
		};
		spreadLevel.orders.symbol1.side = level.side;
		spreadLevel.orders.symbol2.side = level.side === TradeSides.Buy ? TradeSides.Sell : TradeSides.Buy;
		if (level.side === TradeSides.Buy) {
			const askLimit = s1Ask - level.price!;
			const bidLimit = s2Bid + level.price!;
			spreadLevel.orders.symbol1.price = decAdjust(`floor`, bidLimit, -formatter);
			spreadLevel.orders.symbol1.idx = calcIdx(`bid`, spreadLevel.orders.symbol1.price, symbol1.bids);
			spreadLevel.orders.symbol2.price = decAdjust(`ceil`, askLimit, -formatter);
			spreadLevel.orders.symbol2.idx = calcIdx(`ask`, spreadLevel.orders.symbol2.price, symbol2.asks);
		} else {
			const askLimit = s2Ask + level.price!;
			const bidLimit = s1Bid - level.price!;
			spreadLevel.orders.symbol1.price = decAdjust(`ceil`, askLimit, -formatter);
			spreadLevel.orders.symbol1.idx = calcIdx(`ask`, spreadLevel.orders.symbol1.price, symbol1.asks);
			spreadLevel.orders.symbol2.price = decAdjust(`floor`, bidLimit, -formatter);
			spreadLevel.orders.symbol2.idx = calcIdx(`bid`, spreadLevel.orders.symbol2.price, symbol2.bids);
		}
	}
	return trading;
};

