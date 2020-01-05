import io from "socket.io-client";
import { ClientEvents, ServerEvents } from "../common/socket-events";
import { store } from "../index";
import { addLogMessage, setTradingLevels } from "../store/actions/actions";
import { IOrderLevel, IState, LogTypes } from "../store/types";

class Socket {
	private socket: SocketIOClient.Socket;
	public traderId: string | null = null;

	constructor() {
		this.socket = io.connect("http://localhost:3001");
		this.socket.on(ServerEvents.CONNECTED, () => {
			store.dispatch(addLogMessage({
				type: LogTypes.Success,
				time: Date.now(),
				message: `Socket connected id="${this.socket.id}"`
			}));
			this.setTrader();
		});
		this.socket.on(ServerEvents.DISCONNECTED, () => {
			store.dispatch(addLogMessage({
				type: LogTypes.Error,
				time: Date.now(),
				message: `Socket connection error`,
			}));
			this.traderId = null;
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
}

export default Socket;
