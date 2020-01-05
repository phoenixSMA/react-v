import React from "react";
import { IState, ISymbol, ITradingPrices, TradeSides } from "../../../../store/types";
import { connect } from "react-redux";
import { CenterContainerTable } from "./center-container-table";
import { createEmptyGridPart, fixUndefined } from "./utils";

interface ICenterContainerBodyProps {
	symbol1: ISymbol,
	symbol2: ISymbol,
	trading: ITradingPrices;
}

const CenterContainerBody: React.FC<ICenterContainerBodyProps> = props => {
	const { deltaAsks, deltaBids, buyMarket, sellMarket, spreadBO, spreadLevels, formatter } = props.trading;
	const grid = {
		asks: createEmptyGridPart(20),
		center: [`\u00A0`, `\u00A0`, `\u00A0`, `\u00A0`],
		bids: createEmptyGridPart(20),
	};
	grid.asks[1] = [
		`\u00A0`,
		fixUndefined(formatter, deltaAsks.price),
		`Delta Asks`,
		fixUndefined(3, deltaAsks.percent, `%`),
		`\u00A0`,
	];
	grid.asks[0] = [
		`\u00A0`,
		fixUndefined(formatter, buyMarket.price),
		`Buy Spread`,
		fixUndefined(3, buyMarket.percent, `%`),
		`\u00A0`,
	];
	grid.center = [
		`\u00A0`,
		fixUndefined(formatter, spreadBO.price),
		`Spread BO`,
		fixUndefined(3, spreadBO.percent, `%`),
		`\u00A0`,
	];
	grid.bids[0] = [
		`\u00A0`,
		fixUndefined(formatter, sellMarket.price),
		`Sell Spread`,
		fixUndefined(3, sellMarket.percent, `%`),
		`\u00A0`,
	];
	grid.bids[1] = [
		`\u00A0`,
		fixUndefined(formatter, deltaBids.price),
		`Delta Bids`,
		fixUndefined(3, deltaBids.percent, `%`),
		`\u00A0`,
	];
	for (const side of [TradeSides.Buy, TradeSides.Sell]) {
		const levels = spreadLevels.filter((spreadLevel) => spreadLevel.level.side === side);
		const name = side === TradeSides.Buy ? `Buy Level` : `Sell Level`;
		const gridSide = side === TradeSides.Buy ? grid.bids : grid.asks;
		for (let i = 0; i < levels.length; i++) {
			const level = levels[i];
			const { price, percent } = level.level;
			gridSide[i + 2][1] = fixUndefined(formatter, price);
			gridSide[i + 2][2] = name;
			gridSide[i + 2][3] = fixUndefined(3, percent, `%`);
			if (side === TradeSides.Buy) {
				grid.bids[level.orders.symbol1.idx][0] = fixUndefined(formatter, level.orders.symbol1.price);
				grid.asks[level.orders.symbol2.idx][4] = fixUndefined(formatter, level.orders.symbol2.price);
			} else {
				grid.bids[level.orders.symbol2.idx][4] = fixUndefined(formatter, level.orders.symbol2.price);
				grid.asks[level.orders.symbol1.idx][0] = fixUndefined(formatter, level.orders.symbol1.price);
			}
		}
	}
	return (
		<CenterContainerTable grid={grid}/>
	)
};

const mapStateToProps = (state: IState) => {
	const { symbol1, symbol2, trading } = state;
	return {
		symbol1,
		symbol2,
		trading,
	}
};

export default connect(mapStateToProps)(CenterContainerBody);

