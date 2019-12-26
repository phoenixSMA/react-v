import io from "socket.io-client";
import { ServerEvents } from "../common/socket-events";
import { store } from "../index";
import { addLogMessage } from "../store/actions/actions";
import { LogTypes } from "../store/types";

class Socket {
	private socket: SocketIOClient.Socket;
	private dispatch = store.dispatch;

	constructor() {
		this.socket = io.connect("http://localhost:3001");
		this.socket.on(ServerEvents.CONNECTED, (id: string) => {
			console.log(`Connected id='${id}' ${this.socket.id}`);
			this.dispatch(addLogMessage({
				type: LogTypes.Success,
				time: Date.now(),
				message: `Socket connected id="${this.socket.id}"`
			}));
		});
		this.socket.on(ServerEvents.DISCONNECTED, () => {
			console.log(`Socket CONNECT_ERROR ${this.socket.id}`);
			this.dispatch(addLogMessage({
				type: LogTypes.Error,
				time: Date.now(),
				message: `Socket connection error`,
			}))
		});
	}
}

export default Socket;