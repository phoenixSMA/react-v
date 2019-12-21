import React from 'react';
import './App.scss';
import Header from "../header";
import L2Container from "../containers/l2-conainer/";
import CenterContainer from "../containers/center-container";
import ChartViewContainer from "../containers/chart-view-container/chart-view-container";
import LogContainer from "../containers/log-container";
import OrdersContainer from "../containers/orders-container";
import PositionsContainer from "../containers/positions-container/positions-container";

const App = () => {
	return (
		<div className="App">
			<Header />
			<div className="content-wrapper">
				<div className="container-horizontal row-up">
					<L2Container left={true} />
					<CenterContainer />
					<L2Container left={false} />
					<ChartViewContainer />
				</div>
				<div className="container-horizontal row-down">
					<LogContainer />
					<OrdersContainer />
					<PositionsContainer />
				</div>
			</div>
		</div>
	);
};

export default App;
