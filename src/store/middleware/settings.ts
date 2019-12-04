import { Dispatch, Middleware, MiddlewareAPI } from "redux";
import { Actions, ActionTypes, ChartPeriods } from "../types";

export const settingsMiddleware: Middleware = ({getState}: MiddlewareAPI) => (next: Dispatch) => (action: ActionTypes) => {
	switch (action.type) {
		case Actions.SET_SYMBOL1_CONTRACT: {
			const {name} = action.payload;
			localStorage.setItem(`symbol1`, name);
			break;
		}
		case Actions.SET_SYMBOL2_CONTRACT: {
			const {name} = action.payload;
			localStorage.setItem(`symbol2`, name);
			break;
		}
		case Actions.SET_CHART_PERIOD: {
			const period = action.payload;
			localStorage.setItem(`period`, period);
			break;
		}
	}
	next(action);
};
