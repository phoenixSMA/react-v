import React from 'react';
import './App.scss';
import Header from "../header";
import L2Container from "../containers/l2-conainer/";
import CenterContainer from "../containers/center-container";

const App = () => {
	return (
		<div className="App">
			<Header />
			<div className="content-wrapper">
				<div className="container-horizontal row-up">
					<L2Container left={true} />
					<CenterContainer />
					<L2Container left={false} />
				</div>
				<div className="container-horizontal row-down"></div>
			</div>
		</div>
	);
};

export default App;