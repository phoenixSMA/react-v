import React from "react";
import { connect } from "react-redux";
import "./l2-container.scss";
import { contracts } from "../../../service/constants";
import Select from "../../elements/select";
import L2Table, { IL2TableProps } from "./l2-table";
import { ConnectionStatus, IState } from "../../../store/types";
import { setSymbolContract } from "../../../store/actions/actions";

interface IL2ContainerProps extends IL2TableProps {
	connectionStatus?: ConnectionStatus;
	selectedValue?: string;
	setSymbolContract?: typeof setSymbolContract;
}

const L2Container: React.FunctionComponent<IL2ContainerProps> = (props) => {
	const {connectionStatus, formatter, asks, bids, left, selectedValue, setSymbolContract} = props;
	const tableProps = {formatter, asks, bids, left};
	const disabled = connectionStatus !== ConnectionStatus.Disconnected;
	const onChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		setSymbolContract && setSymbolContract(e.target.value, left);
	};
	return (
		<div className="container-l2">
			<Select
				options={contracts}
				onChange={onChange}
				disabled={disabled}
				selectedValue={selectedValue}
			/>
			<L2Table {...tableProps} />
		</div>
	);
};

const mapStateToProps = (state: IState, ownProps: IL2ContainerProps) => {
	const {connectionStatus} = state;
	const {left} = ownProps;
	const symbol = left ? state.symbol1 : state.symbol2;
	const selectedValue = left ? state.symbol1.name : state.symbol2.name;
	return {
		formatter: symbol.formatter,
		asks: symbol.asks,
		bids: symbol.bids,
		left,
		connectionStatus,
		selectedValue,
	}
};

const mapDispatchToProps = {setSymbolContract};

export default connect(mapStateToProps, mapDispatchToProps)(L2Container);