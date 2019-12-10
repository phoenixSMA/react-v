import React from "react";
import ChartControls from "./chart-controls";
import "./chart-view-container.scss";
import Chart3Line from "../../chart3L/chart-3-line";

const ChartViewContainer: React.FC = () => {

	return (
		<div className="container-vertical chart-view-container">
			<ChartControls />
			<Chart3Line />
		</div>
	)
};

export default ChartViewContainer;