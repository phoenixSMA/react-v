import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import './index.css';
import App from './components/app/App';
import configureStore from "./store";
import Socket from "./service/socket";

export const store = configureStore();

export const socket = new Socket();

ReactDOM.render(
	<Provider store={store}>
		<App />
	</Provider>,
	document.getElementById('root')
);
