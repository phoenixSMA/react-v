import { CloseLineData, IState } from "../types";
import { getCloseLine, initialState, resetL2 } from "./helpers";
import { Actions, ActionTypes } from "../actions/types";

const reducer = (
	state: IState | undefined,
	action: ActionTypes
	): IState => {
		if (state === undefined) {
			state = initialState();
		}
		switch (action.type) {
			case Actions.SET_SYMBOL_CONTRACT: {
				if (action.left) {
					const symbol1 = {...state.symbol1, ...action.payload, ...resetL2()};
					const {symbol2} = state;
					const chart = {
						...state.chart,
						data: {
							...state.chart.data,
							datasets: [
								{...state.chart.data.datasets[0]},
								{
									...state.chart.data.datasets[1],
									label: `${symbol1.name} - ${symbol2.name}`,
									data: [],
								},
								{
									...state.chart.data.datasets[2],
									label: `${symbol1.name}`,
									data: [],
								},
								{
									...state.chart.data.datasets[3],
									data: [],
								}
							]
						},
					};
					return {...state, symbol1, chart};
				} else {
					const {symbol1} = state;
					const symbol2 = {...state.symbol2, ...action.payload, ...resetL2()};
					const chart = {
						...state.chart,
						data: {
							...state.chart.data,
							datasets: [
								{...state.chart.data.datasets[0]},
								{
									...state.chart.data.datasets[1],
									label: `${symbol1.name} - ${symbol2.name}`,
									data: [],
								},
								{
									...state.chart.data.datasets[2],
									data: [],
								},
								{
									...state.chart.data.datasets[3],
									label: `${symbol2.name}`,
									data: [],
								}
							]
						},
					};
					return {...state, symbol2, chart};
				}
			}
			case Actions.SET_CONNECTION_STATUS:
				return {...state, connectionStatus: action.payload};
			case Actions.UPDATE_SYMBOL_L2:
				if (action.meta === 1) {
					return {...state, symbol1: {...state.symbol1, ...action.payload}};
				} else {
					return {...state, symbol2: {...state.symbol2, ...action.payload}};
				}
			case Actions.SET_SYMBOL_CL:
				if (action.meta === 1) {
					return {...state, symbol1: {...state.symbol1, closeLine: action.payload}};
				} else {
					return {...state, symbol2: {...state.symbol2, closeLine: action.payload}};
				}
			case Actions.UPDATE_SYMBOL_CL:
				if (action.meta === 1) {
					let closeLine: CloseLineData = getCloseLine(state.symbol1.closeLine, action.payload);
					return {...state, symbol1: {...state.symbol1, closeLine}}
				} else {
					let closeLine: CloseLineData = getCloseLine(state.symbol2.closeLine, action.payload);
					return {...state, symbol2: {...state.symbol2, closeLine}}
				}
			case Actions.SET_CHART_PERIOD:
				return {...state, chart: {...state.chart, period: action.payload}};
			case Actions.SET_CHART_VIEWMODE:
				return {...state, chart: {...state.chart, viewMode: action.payload}};
			case Actions.SET_CHART_SYMBOL_DATA:
				if (action.meta === 1) {
					return {
						...state,
						chart: {
							...state.chart,
							data: {
								...state.chart.data,
								datasets: [
									state.chart.data.datasets[0],
									state.chart.data.datasets[1],
									{
										...state.chart.data.datasets[2],
										data: [...action.payload],
									},
									state.chart.data.datasets[3],
								]
							}
						}
					};
				} else {
					return {
						...state,
						chart: {
							...state.chart,
							data: {
								...state.chart.data,
								datasets: [
									state.chart.data.datasets[0],
									state.chart.data.datasets[1],
									state.chart.data.datasets[2],
									{
										...state.chart.data.datasets[3],
										data: [...action.payload],
									}
								]
							}
						}
					};
				}
			case Actions.SET_CHART_SPREAD_DATA:
				return {
					...state,
					chart: {
						...state.chart,
						data: {
							...state.chart.data,
							datasets: [
								{
									...state.chart.data.datasets[0],
									data: [...action.payload][0],
								},
								{
									...state.chart.data.datasets[1],
									data: [...action.payload][1],
								},
								state.chart.data.datasets[2],
								state.chart.data.datasets[3]
							]
						}
					}
				};
			case Actions.UPDATE_TRADING_PRICES:
				const trading = JSON.parse(JSON.stringify(action.payload));
				return {...state, trading};
			default:
				return state;
		}
	}
;

export default reducer;