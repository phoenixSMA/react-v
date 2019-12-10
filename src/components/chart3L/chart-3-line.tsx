import React from "react";
import { ChartData, Line } from 'react-chartjs-2';
import { ChartOptions } from "chart.js";
import { connect } from "react-redux";
import { IState } from "../../store/types";

interface IChart3LineProps {
	data: ChartData<any>;
	options: ChartOptions;
}

const Chart3Lines: React.FC<IChart3LineProps> = (props) => {
	const {data, options} = props;
	const dataC = JSON.parse(JSON.stringify(data));
	return (
		<div className="chart-container">
			<Line
				data={dataC}
				options={options}
			/>
		</div>
	)
};

const mapStateToProps = ({chart: {data, options}}: IState) => {
	return {
		data,
		options,
	}
};

export default connect(mapStateToProps)(Chart3Lines);