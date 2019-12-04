import React from "react";
import ChartControls from "./chart-controls";
import "./chart-view-container.scss";

const ChartViewContainer: React.FC = () => {

	return (
		<div className="container-vertical chart-view-conainer">
			<ChartControls />
		</div>
	)
};

export default ChartViewContainer;