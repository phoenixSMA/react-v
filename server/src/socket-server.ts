import {createServer, Server} from 'http';
import express from 'express';
import socketIo, {Socket} from 'socket.io';
import {ClientEvents, ServerEvents} from "../../src/common/socket-events";
import {traderHub} from "./index";

export class SocketServer {
    public static readonly PORT: number = 3001;
    private readonly app: express.Application;
    private readonly server: Server;
    private io: socketIo.Server;
    private readonly port: string | number;

    constructor() {
        this.app = express();
        this.server = createServer(this.app);
        this.io = socketIo(this.server);
        this.port = process.env.PORT || SocketServer.PORT;
        this.listen();
    }

    private listen(): void {
        this.server.listen(this.port, () => {
            console.log('Running SocketServer on port %s', this.port);
        });

        this.io.on(ClientEvents.CONNECT, (socket: Socket) => {
            console.log(`Connected client on port ${this.port} ${socket.id}.`);
            socket.emit(ServerEvents.CONNECTED, socket.id);

            socket.on(ClientEvents.DISCONNECT, () => {
                console.log(`Client ${socket.id} disconnected`);
                traderHub.removeClient(socket);
            });

            socket.on(ClientEvents.SET_TRADER, (_id, fn) => {
                traderHub.addClient(_id, socket);
                fn({_id});
            })
        });
    }

    public getApp(): express.Application {
        return this.app;
    }
}
