import { inflate } from "pako";

export const websocketDemo = () => {
    const url = `wss://www.hbdm.com/ws`;
    const ws = new WebSocket(url);
    let prevTS = 0;

    ws.onopen = function (e) {
        console.log('[open] Соединение открыто');
        // ws.send(JSON.stringify({
        //     sub: "market.BTC_CQ.depth.step0",
        //     id: "id888"
        // }));
    };

    ws.onmessage = async function (event) {
        console.log(`[message] Данные получены с сервера: `, event.data);
        const blobArrayBuffer = await event.data.arrayBuffer();
        const msg = JSON.parse(inflate(blobArrayBuffer, {to: `string`}));
        console.log(`[pako] `, msg);
        if (msg.ping) {
            ws.send(JSON.stringify({pong: msg.ping}));
        } else if (msg.ts) {
            if (prevTS) {
                console.log(`[${msg.ts - prevTS}]`);
                prevTS = msg.ts;
            } else {
                console.log(`[undefied]`);
            }
        }
    };

    ws.onclose = function (event) {
        if (event.wasClean) {
            console.log(`[close] Соединение закрыто чисто, код=${event.code} причина=${event.reason}`, event);
        } else {
            console.log(`[close] Соединение прервано`);
        }
    };

    ws.onerror = function (event) {
        console.log(`[error] `, event);
    };
};

// websocketDemo();