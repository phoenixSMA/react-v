import { Trader, TraderModel } from "./trader/trader";
import { Socket } from 'socket.io';
import { DocumentType } from "@typegoose/typegoose";
import { IOrderLevel } from "../../../src/store/types";
import { TraderStatus } from "../../../src/common/trader-status";

export class TraderHub {
    private traders: Trader[] = [];

    constructor() {
        TraderModel.find({}).exec()
            .then((traders) => {
                this.traders = TraderHub.patchTraders(traders);
                this.logTraders('constructor');
            });
    }

    createTrader(_id: string): Trader {
        const trader = new Trader({ _id });
        TraderModel.create(trader)
            .then((trd) => {
                this.traders.push(trader);
                TraderHub.consoleLog('SUCCESS: trader created: ', trd._id);
                this.logTraders('createTrader');
            })
            .catch((err) => {
                console.log(err)
            });
        return trader;
    }

    findTraderBySocket(socket: Socket): { trader: Trader | null, idx: number } {
        let trader = null;
        let idx = -1;
        for (const _trader of this.traders) {
            idx = _trader.clients.findIndex(s => s === socket);
            if (idx > -1) {
                trader = _trader;
                break;
            }
        }
        return { trader, idx };
    }

    removeClient(socket: Socket) {
        const { trader, idx } = this.findTraderBySocket(socket);
        if (trader) {
            trader.clients.splice(idx, 1);
            this.logTraders('removeClient');
        }
    }

    addClient(_id: string, socket: Socket): { _id: string; levels: IOrderLevel[]; status: TraderStatus } {
        this.removeClient(socket);
        let trader = this.traders.find(t => t._id === _id);
        if (!trader) {
            trader = this.createTrader(_id);
        }
        trader.clients.push(socket);
        this.logTraders('addClient');
        return {
            _id: trader._id,
            levels: trader.getClientsLevels(),
            status: trader.status,
        }
    }

    changeTraderStatus(socket: Socket): TraderStatus {
        const { trader } = this.findTraderBySocket(socket);
        if (trader) {
            return trader.changeStatus(socket.id);
        } else {
            TraderHub.consoleLog(`changeTraderStatus: ERROR: Trader for socket (id="${socket.id}") not found!`);
        }
    }

    private static consoleLog(msg: string = '', ...args: any) {
        console.log(`TraderHub > ${msg}: `, ...args);
    }

    private logTraders(owner: string) {
        let output = `${owner}: traders update:\n`;
        this.traders.forEach((trader, idx) => {
            const clients = trader.clients
                ? trader.clients.reduce((a, c) => a + ', "' + c.id + '"', '')
                : ', undefined';
            output += `(${idx}) _id: "${trader._id}", clients: [${clients.substr(2)}]\n`;
        });
        TraderHub.consoleLog(output);
    }

    private static patchTraders(traders: DocumentType<Trader>[]): Trader[] {
        const patchedTraders: Trader[] = [];
        for (const trader of traders) {
            const { _id, createdAt, autoTrade, levels, orders } = trader;
            patchedTraders.push(new Trader({ _id, createdAt, autoTrade, levels, orders }));
        }
        return patchedTraders;
    }
}
