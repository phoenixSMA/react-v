import io from "socket.io-client";
import { ClientEvents, ServerEvents } from "../common/socket-events";
import { store } from "../index";
import { addLogMessage, setTraderStatus, setTradingLevels } from "../store/actions/actions";
import { IOrderLevel, IState, LogTypes } from "../store/types";
import { TraderStatus } from "../common/trader-status";

class Socket {
    private socket: SocketIOClient.Socket;
    public traderId: string | null = null;

    constructor() {
        this.socket = io.connect("http://localhost:3001");
        this.socket.on(ServerEvents.CONNECTED, this._handleConnected);
        this.socket.on(ServerEvents.DISCONNECTED, this._handleDisconnected);
        this.socket.on(ServerEvents.TRADER_STATUS_CHANGED, (status: TraderStatus) => {
            this._handleTraderStatusChanged(status)
        });
    }

    setTrader() {
        const state: IState = store.getState();
        const { symbol1, symbol2 } = state;
        const id = `${symbol1.name}:${symbol2.name}`;
        this.socket.emit(ClientEvents.SET_TRADER, id, (res: { _id: string, levels: IOrderLevel[] }) => {
            store.dispatch(addLogMessage({
                type: LogTypes.Success,
                time: Date.now(),
                message: `Trader "${res._id}" connected`,
            }));
            store.dispatch(setTradingLevels(res.levels));
            this.traderId = res._id;
        })
    }

    changeTraderStatus() {
        this.socket.emit(ClientEvents.CHANGE_TRADER_STATUS, (status: TraderStatus) => {
            store.dispatch(addLogMessage({
                type: LogTypes.Info,
                time: Date.now(),
                message: `Trader "${this.traderId}" status changed to "${status}"`,
            }));
            store.dispatch(setTraderStatus(status));
        });
    }

    private _handleConnected = () => {
        store.dispatch(addLogMessage({
            type: LogTypes.Success,
            time: Date.now(),
            message: `Socket connected id="${this.socket.id}"`
        }));
        this.setTrader();
    };

    private _handleDisconnected = () => {
        store.dispatch(addLogMessage({
            type: LogTypes.Error,
            time: Date.now(),
            message: `Socket connection error`,
        }));
        this.traderId = null;
    };

    private _handleTraderStatusChanged = (status: TraderStatus) => {
        store.dispatch(addLogMessage({
            type: LogTypes.Warning,
            time: Date.now(),
            message: `Trader "${this.traderId}" status changed to "${status}" by another cient`,
        }));
        store.dispatch(setTraderStatus(status));
    }
}

export default Socket;
