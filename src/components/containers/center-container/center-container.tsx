import React from "react";
import "./center-container.scss"
import CenterContainerHeader from "./center-container-header";
import CenterContainerBody from "./center-container-body/center-container-body";

const CenterContainer: React.FunctionComponent = () => {
	return (
		<div className="center-container">
			<table>
				<CenterContainerHeader />
			</table>
			<CenterContainerBody />
		</div>
	)
};

export default CenterContainer;