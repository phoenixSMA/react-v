import React from "react";
import ContainerHeader from "../../container-header";
import "./positions-container.scss";

const PositionsContainer: React.FC = () => {
	return (
		<div className="positions-container">
			<ContainerHeader text={`Positions`} />
		</div>
	)
};

export default PositionsContainer;