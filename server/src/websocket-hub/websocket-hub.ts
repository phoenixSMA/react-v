import { HoubiWebsocketS } from "./huobi";

export class WebsocketHub {
    private websockets: {
        exchange: string;
        underlying: string;
        websocket: HoubiWebsocketS;
    }[] = [];
}
