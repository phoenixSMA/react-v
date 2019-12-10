import { Dispatch, Middleware, MiddlewareAPI } from "redux";
import { Actions, ActionTypes } from "../actions/types";
import { contracts } from "../../service/constants";
import { setSymbol2Contract } from "../actions/actions";

export const settingsMiddleware: Middleware = ({dispatch}: MiddlewareAPI) => (next: Dispatch) => (action: ActionTypes) => {
	switch (action.type) {
		case Actions.SET_SYMBOL1_CONTRACT: {
			const {name} = action.payload;
			localStorage.setItem(`symbol1`, name);
			dispatch(setSymbol2Contract(findPair(name)));
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
		case Actions.SET_CHART_VIEWMODE: {
			const viewMode = action.payload;
			localStorage.setItem(`viewMode`, viewMode);
			break;
		}
	}
	next(action);
};

const findPair = (name: string): string => {
	const idx = contracts.findIndex((c) => c.name === name);
	if (idx === -1) {
		return name;
	}
	let i = idx + 1;
	while (true) {
		if (i > contracts.length - 1) {
			i = 0;
		}
		if (contracts[i].underlying === contracts[idx].underlying) {
			return contracts[i].name;
		}
		i++;
	}
};