import { applyMiddleware, createStore } from "redux";
import { composeWithDevTools } from 'redux-devtools-extension';
import reducer from "./reducers";
import connectionHostMiddleware from "./middleware/connection-host";
import { settingsMiddleware } from "./middleware/settings";

const configureStore = () => {
	return createStore(reducer, composeWithDevTools(applyMiddleware(settingsMiddleware, connectionHostMiddleware)))
};

export default configureStore;