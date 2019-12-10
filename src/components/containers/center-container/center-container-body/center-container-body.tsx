import React from "react";
import { IState, ITradingPrices } from "../../../../store/types";
import { connect } from "react-redux";
import { CenterContainerTable } from "./center-container-table";
import { fixUndefined } from "./utils";

interface ICenterContainerBodyProps {
	trading: ITradingPrices;
}

const CenterContainerBody: React.FC<ICenterContainerBodyProps> = props => {
	const {asks, bids, buyMarket, sellMarket, spreadMarket, spreadBuy, spreadSell} = props.trading;
	const grid = {
		asks: Array(20).fill(Array(4).fill(`\u00A0`)),
		center: Array(4).fill(`\u00A0`),
		bids: Array(20).fill(Array(4).fill(`\u00A0`)),
	};
	grid.asks[17] = [`\u00A0`, fixUndefined(spreadSell.level.price), fixUndefined(spreadSell.level.percent, `%`), `\u00A0`];
	grid.asks[18] = [`\u00A0`, fixUndefined(asks.price), fixUndefined(asks.percent, `%`), `\u00A0`];
	grid.asks[19] = [`\u00A0`, fixUndefined(buyMarket.price), fixUndefined(buyMarket.percent, `%`), `\u00A0`];
	grid.center = [`\u00A0`, fixUndefined(spreadMarket.price), fixUndefined(spreadMarket.percent, `%`), `\u00A0`];
	grid.bids[0] = [`\u00A0`, fixUndefined(sellMarket.price), fixUndefined(sellMarket.percent, `%`), `\u00A0`];
	grid.bids[1] = [`\u00A0`, fixUndefined(bids.price), fixUndefined(bids.percent, `%`), `\u00A0`];
	grid.bids[2] = [`\u00A0`, fixUndefined(spreadBuy.level.price), fixUndefined(spreadSell.level.percent, `%`), `\u00A0`];
	return (
		<CenterContainerTable grid={grid} />
	)
};

const mapStateToProps = (state: IState) => {
	const {trading} = state;
	return {
		trading,
	}
};

export default connect(mapStateToProps)(CenterContainerBody);

