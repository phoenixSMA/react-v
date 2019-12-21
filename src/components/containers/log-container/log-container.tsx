import React from "react";
import "./log-container.scss"
import ContainerHeader from "../../container-header";
import LogContainerBody from "./log-container-body";

const LogContainer: React.FC = () => {
	return (
		<div className="log-container">
			<ContainerHeader text={`Log`} />
			<LogContainerBody />
		</div>
	);
};

export default LogContainer;