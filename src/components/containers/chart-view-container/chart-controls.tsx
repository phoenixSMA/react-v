import React from "react";
import Select from "../../elements/select";
import { chartPeriods } from "../../../service/constants";
import { ChartPeriods, IState } from "../../../store/types";
import { connect } from "react-redux";
import { bindActionCreators, Dispatch } from "redux";
import { setChartPeriod, setChartViewMode } from "../../../store/actions/actions";
import RadioButton from "../../elements/radio-button";

interface IChartControlsProps {
	period: ChartPeriods;
	viewMode?: string;
	setChartPeriod: typeof setChartPeriod;
	setChartViewMode: typeof setChartViewMode;
}

const ChartControls: React.FC<IChartControlsProps> = (props) => {
	const {period, viewMode, setChartPeriod, setChartViewMode} = props;
	const onSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
		setChartPeriod(event.target.value as ChartPeriods);
	};
	const radioButtons = [
		{name: `viewMode`, value: `price`, label: `Price`},
		{name: `viewMode`, value: `percent`, label: `Percent`},
	];
	const onRadioButtonChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setChartViewMode(event.target.value);
	};
	return (
		<div>
			<label>
				Period:
				<Select
					options={chartPeriods}
					selectedValue={period}
					onChange={onSelectChange}
				/>
			</label>
			<RadioButton
				buttons={radioButtons}
				onChange={onRadioButtonChange}
				classes="radio"
				checked={viewMode}
			/>
		</div>
	)
};

const mapStateToProps = (state: IState) => {
	const {chart: {period, viewMode}} = state;
	return {
		period,
		viewMode,
	}
};

const mapDispatchToProps = (dispatch: Dispatch) => {
	return {
		setChartPeriod: bindActionCreators(setChartPeriod, dispatch),
		setChartViewMode: bindActionCreators(setChartViewMode, dispatch),
	}
};

export default connect(mapStateToProps, mapDispatchToProps)(ChartControls);