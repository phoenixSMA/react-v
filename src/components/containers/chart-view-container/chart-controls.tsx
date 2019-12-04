import React from "react";
import Select from "../../elements/select";
import { chartPeriods } from "../../../service/constants";
import { ChartPeriods, IState } from "../../../store/types";
import { connect } from "react-redux";
import { bindActionCreators, Dispatch } from "redux";
import { setChartPeriod } from "../../../store/actions/actions";

interface IChartControlsProps {
	period: ChartPeriods;
	setChartPeriod: typeof setChartPeriod;
}

const ChartControls: React.FC<IChartControlsProps> = (props) => {
	const {period, setChartPeriod} = props;
	const onChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
		setChartPeriod(event.target.value as ChartPeriods);
	};
	return (
		<div>
			<label>
				Period:
				<Select
					options={chartPeriods}
					selectedValue={period}
					onChange={onChange}
				/>
			</label>
		</div>
	)
};

const mapStateToProps = (state: IState) => {
	const {chart: {period}} = state;
	return {
		period,
	}
};

const mapDispatchToProps = (dispatch: Dispatch) => {
	return {
		setChartPeriod: bindActionCreators(setChartPeriod, dispatch),
	}
};

export default connect(mapStateToProps, mapDispatchToProps)(ChartControls);