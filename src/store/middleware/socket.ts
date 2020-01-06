import { Dispatch, Middleware } from "redux";
import { Actions, ActionTypes } from "../actions/types";
import { socket } from "../../index";

export const socketMiddleware: Middleware = () => (next: Dispatch) => (action: ActionTypes) => {
    switch (action.type) {
        case Actions.SET_SYMBOL_CONTRACT:
            next(action);
            if (!action.left) {
                socket.setTrader();
            }
            break;
        case Actions.CHANGE_TRADER_STATUS:
            socket.changeTraderStatus();
            next(action);
            break;
        default:
            next(action);
    }
};
