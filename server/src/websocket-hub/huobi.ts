import { HuobiWebsocketBase } from "../../../src/service/websockets/huobi/huobi-base";
import { WebsocketStatus, WebsocketStatusHandler } from "../../../src/service/websockets/types";
import WebSocket from "ws";
import pako from "pako";
import { Trader } from "../trader-hub/trader/trader";

export class HoubiWebsocketS extends HuobiWebsocketBase {
    public clients: Trader[];

    constructor(logging: boolean = false) {
        super(logging);
        this.clients = [];
    }

    public open(handler: WebsocketStatusHandler): void {
        this._statusHandler = handler;
        this.ws = new WebSocket(this.url);
        this.ws.on('open', this._openHandler);
        this.ws.on('message', (data: pako.Data) => {
            const text = pako.inflate(data, {
                to: 'string'
            });
            const msg = JSON.parse(text);
            this._messageHandler(msg);
        });
        this.ws.on('close', () => {
            this.status = WebsocketStatus.Closed;
            this._statusHandler && this._statusHandler(this.exchange, this.status);
        })
    }
}

