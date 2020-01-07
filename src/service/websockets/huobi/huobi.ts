import { inflate } from "pako";
import { IWebsocket, WebsocketStatus, WebsocketStatusHandler } from "../types";
import { HuobiWebsocketBase } from "./huobi-base";

export class HuobiWebsocket extends HuobiWebsocketBase implements IWebsocket {
    constructor(logging: boolean = false) {
        super(logging);
    }

    public open(handler: WebsocketStatusHandler): void {
        this._statusHandler = handler;
        this.ws = new WebSocket(this.url);
        this.ws.onopen = this._openHandler;
        this.ws.onmessage = async (event: MessageEvent) => {
            this._logger(`[message] Data recieved: `, event.data);
            const blobArrayBuffer = await event.data.arrayBuffer();
            const msg = JSON.parse(inflate(blobArrayBuffer, { to: `string` }));
            this._logger(`[pako] `, msg);
            this._messageHandler(msg);
        };
        this.ws.onclose = (event: CloseEvent) => {
            let error = false;
            if (event.wasClean) {
                this._logger(`[close] Connection closed clear, code=${event.code} reason=${event.reason}`);
            } else {
                this._logger(`[close] Disconnected`);
                error = true;
            }
            this.status = WebsocketStatus.Closed;
            this._statusHandler && this._statusHandler(this.exchange, this.status, error);
        }
    }
}
