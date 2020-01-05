import {Dispatch, Middleware, MiddlewareAPI} from "redux";
import {Actions, ActionTypes} from "../actions/types";
import {socket} from "../../index";

export const socketMiddleware: Middleware = ({}: MiddlewareAPI) => (next: Dispatch) => (action: ActionTypes) => {
    next(action);
    switch (action.type) {
        case Actions.SET_SYMBOL_CONTRACT: {
            if (!action.left) {
                socket.setTrader();
            }
            break;
        }
    }
};
