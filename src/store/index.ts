import { applyMiddleware, createStore } from "redux";
import { composeWithDevTools } from 'redux-devtools-extension';
import reducer from "./reducers";
import connectionHostMiddleware from "./middleware/connection-host";
import { settingsMiddleware } from "./middleware/settings";
import { createChartDataMiddleware } from "./middleware/create-chart-data";
import tradingMiddleware from "./middleware/trading";
import {socketMiddleware} from "./middleware/socket";

const configureStore = () => {
	return createStore(reducer,
		composeWithDevTools(
			applyMiddleware(
				settingsMiddleware,
				connectionHostMiddleware,
				createChartDataMiddleware,
				tradingMiddleware,
				socketMiddleware)))
};

export default configureStore;
