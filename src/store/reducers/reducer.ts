import { Actions, ActionTypes, CloseLineData, IState } from "../types";
import { getCloseLine, initialState, resetL2 } from "./helpers";

const reducer = (
	state: IState | undefined,
	action: ActionTypes
	): IState => {
		if (state === undefined) {
			state = initialState();
		}
		switch (action.type) {
			case Actions.SET_SYMBOL1_CONTRACT:
				return {...state, symbol1: {...state.symbol1, ...action.payload, ...resetL2()}};
			case Actions.SET_SYMBOL2_CONTRACT:
				return {...state, symbol2: {...state.symbol2, ...action.payload, ...resetL2()}};
			case Actions.SET_CONNECTION_STATUS:
				return {...state, connectionStatus: action.payload};
			case Actions.SET_SYMBOL1_WEBSOCKET:
				return {...state, symbol1: {...state.symbol1, websocket: action.payload}};
			case Actions.SET_SYMBOL2_WEBSOCKET:
				return {...state, symbol2: {...state.symbol2, websocket: action.payload}};
			case Actions.UPDATE_SYMBOL1_L2:
				return {...state, symbol1: {...state.symbol1, ...action.payload}};
			case Actions.UPDATE_SYMBOL2_L2:
				return {...state, symbol2: {...state.symbol2, ...action.payload}};
			case Actions.SET_SYMBOL1_CL:
				return {...state, symbol1: {...state.symbol1, closeLine: action.payload}};
			case Actions.SET_SYMBOL2_CL:
				return {...state, symbol2: {...state.symbol2, closeLine: action.payload}};
			case Actions.UPDATE_SYMBOL1_CL: {
				let closeLine: CloseLineData = getCloseLine(state.symbol1.closeLine, action.payload);
				return {...state, symbol1: {...state.symbol1, closeLine}}
			}
			case Actions.UPDATE_SYMBOL2_CL: {
				let closeLine: CloseLineData = getCloseLine(state.symbol2.closeLine, action.payload);
				return {...state, symbol2: {...state.symbol2, closeLine}}
			}
			case Actions.SET_CHART_PERIOD:
				return {...state, chart: {...state.chart, period: action.payload}};
			case Actions.WEBSOCKET_OPENED:
			case Actions.WEBSOCKET_CLOSED:
			default:
				return state;
		}
	}
;

export default reducer;