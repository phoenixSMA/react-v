import React from "react";
import "./container-header.scss";

interface IContainerHeaderProps {
	text: string;
}

const ContainerHeader: React.FC<IContainerHeaderProps> = (props) => {
	const {text} = props;
	return (
		<div className="container-header">
			{text}
		</div>
	)
};

export default ContainerHeader;