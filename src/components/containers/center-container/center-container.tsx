import React from "react";
import "./center-container.scss"
import CenterContainerHeader from "./center-container-header";

const CenterContainer: React.FunctionComponent = () => {
	return (
		<div className="center-container">
			<table>
				<CenterContainerHeader />
			</table>
		</div>
	)
};

export default CenterContainer;