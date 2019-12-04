import React from "react";
import { connect } from "react-redux";
import "./l2-container.scss";
import { contracts } from "../../../service/constants";
import Select from "../../elements/select";
import L2Table, { IL2TableProps } from "./l2-table";
import { ConnectionStatus, IState } from "../../../store/types";
import { bindActionCreators, Dispatch } from "redux";
import { setSymbol1Contract, setSymbol2Contract } from "../../../store/actions/actions";

interface IL2ContainerProps extends IL2TableProps {
	connectionStatus?: ConnectionStatus,
	selectedValue?: string;
	setSymbol?: typeof setSymbol1Contract | typeof setSymbol2Contract;
}

const L2Container: React.FunctionComponent<IL2ContainerProps> = (props) => {
	const {connectionStatus, formatter, asks, bids, left, selectedValue, setSymbol} = props;
	const tableProps = {formatter, asks, bids, left};
	const disabled = connectionStatus !== ConnectionStatus.Disconnected;
	const onChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
			setSymbol && setSymbol(e.target.value);
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

const mapDispatchToProps = (dispatch: Dispatch, ownProps: IL2ContainerProps) => {
	const {left} = ownProps;
	const setSymbol = left ? setSymbol1Contract : setSymbol2Contract;
	return {
		setSymbol: bindActionCreators(setSymbol, dispatch),
	}
};

export default connect(mapStateToProps, mapDispatchToProps)(L2Container);