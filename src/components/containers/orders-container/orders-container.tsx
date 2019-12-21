import React from "react";
import ContainerHeader from "../../container-header";
import "./orders-container.scss";

const OrdersContainer: React.FC = () => {
	return (
		<div className="orders-container">
			<ContainerHeader text={`Orders`} />
		</div>
	)
};

export default OrdersContainer;