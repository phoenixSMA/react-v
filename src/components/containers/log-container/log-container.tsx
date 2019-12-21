import React from "react";
import "./log-container.scss"
import ContainerHeader from "../../container-header";
const LogContainer: React.FC = () => {
	return (
		<div className="log-container">
			<ContainerHeader text={`Log`} />
		</div>
	);
};

export default LogContainer;