import React from "react";
import { IState, ISymbol, ITradingPrices } from "../../../../store/types";
import { connect } from "react-redux";
import { CenterContainerTable } from "./center-container-table";
import { createEmptyGridPart, fixUndefined } from "./utils";

interface ICenterContainerBodyProps {
	symbol1: ISymbol,
	symbol2: ISymbol,
	trading: ITradingPrices;
}

const CenterContainerBody: React.FC<ICenterContainerBodyProps> = props => {
	const {deltaAsks, deltaBids, buyMarket, sellMarket, spreadBO, spreadBuy, spreadSell, formatter} = props.trading;
	const {symbol1, symbol2} = props;
	const grid = {
		asks: createEmptyGridPart(20),
		center: [`\u00A0`, `\u00A0`, `\u00A0`, `\u00A0`],
		bids: createEmptyGridPart(20),
	};
	grid.asks[2] = [
		`\u00A0`,
		fixUndefined(formatter, spreadSell.level.price),
		`Sell Level`,
		fixUndefined(3, spreadSell.level.percent, `%`),
		`\u00A0`,
	];
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
		`Spread Ask`,
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
		`Spread Bid`,
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
	grid.bids[2] = [
		`\u00A0`,
		fixUndefined(formatter, spreadBuy.level.price),
		`Buy Level`,
		fixUndefined(3, spreadBuy.level.percent, `%`),
		`\u00A0`,
	];
	let idx = symbol1.asks.findIndex(row => row[0] >= spreadSell.orders.symbol1.price!);
	(idx === -1) && (idx = 19);
	grid.asks[idx][0] = fixUndefined(formatter, spreadSell.orders.symbol1.price);
	idx = symbol2.asks.findIndex(row => row[0] >= spreadBuy.orders.symbol2.price!);
	(idx === -1) && (idx = 19);
	grid.asks[idx][4] = fixUndefined(formatter, spreadBuy.orders.symbol2.price);
	idx = symbol1.bids.findIndex(row => row[0] <= spreadBuy.orders.symbol1.price!);
	(idx === -1) && (idx = 19);
	grid.bids[idx][0] = fixUndefined(formatter, spreadBuy.orders.symbol1.price);
	idx = symbol2.bids.findIndex(row => row[0] <= spreadSell.orders.symbol2.price!);
	(idx === -1) && (idx = 19);
	grid.bids[idx][4] = fixUndefined(formatter, spreadSell.orders.symbol2.price);
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

