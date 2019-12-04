import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import './index.css';
import App from './components/app/App';
import configureStore from "./store";

export const store = configureStore();

// store.subscribe(connectionHost.dispatcher);

// websocketDemo();

ReactDOM.render(
	<Provider store={store}>
		<App />
	</Provider>,
	document.getElementById('root')
);
