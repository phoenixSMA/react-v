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
	const {deltaAsks, deltaBids, buyMarket, sellMarket, spreadBO, spreadLevels, formatter} = props.trading;
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
	const sellLevels = spreadLevels.filter((spreadLevel) => spreadLevel.level.side === TradeSides.Sell);
	for (let i = 0; i < sellLevels.length; i++) {
		const sellLevel = sellLevels[i];
		grid.asks[i + 2] = [
			`\u00A0`,
			fixUndefined(formatter, sellLevel.level.price),
			`Sell Level`,
			fixUndefined(3, sellLevel.level.percent, `%`),
			`\u00A0`,
		];
		grid.asks[sellLevel.orders.symbol1.idx][0] = fixUndefined(formatter, sellLevel.orders.symbol1.price);
		grid.bids[sellLevel.orders.symbol2.idx][4] = fixUndefined(formatter, sellLevel.orders.symbol2.price);
	}
	const buyLevels = spreadLevels.filter((spreadLevel) => spreadLevel.level.side === TradeSides.Buy);
	for (let i = 0; i < buyLevels.length; i++) {
		const buyLevel = buyLevels[i];
		grid.bids[i + 2] = [
			`\u00A0`,
			fixUndefined(formatter, buyLevel.level.price),
			`Sell Level`,
			fixUndefined(3, buyLevel.level.percent, `%`),
			`\u00A0`,
		];
		grid.bids[buyLevel.orders.symbol1.idx][0] = fixUndefined(formatter, buyLevel.orders.symbol1.price);
		grid.asks[buyLevel.orders.symbol2.idx][4] = fixUndefined(formatter, buyLevel.orders.symbol2.price);
	}
	return (
		<CenterContainerTable grid={grid} />
	)
};

const mapStateToProps = (state: IState) => {
	const {symbol1, symbol2, trading} = state;
	return {
		symbol1,
		symbol2,
		trading,
	}
};

export default connect(mapStateToProps)(CenterContainerBody);

