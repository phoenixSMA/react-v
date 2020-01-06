import { arrayProp, getModelForClass, prop } from "@typegoose/typegoose";
import { Socket } from 'socket.io';
import { createDefaultLevels, Level } from "./level";
import { Order } from "./order";
import { IOrderLevel } from "../../../../src/store/types";
import { TraderStatus } from "../../../../src/common/trader-status";
import { ServerEvents } from "../../../../src/common/socket-events";

export class Trader {
    @prop()
    _id: string;
    @prop()
    createdAt: Date;
    @prop()
    autoTrade: boolean;
    @prop()
    status: TraderStatus;
    @arrayProp({ items: Level })
    levels: Level[];
    @arrayProp({ items: Order })
    orders: Order[];

    clients: Socket[];

    constructor(initials: {
        _id: string,
        createdAt?: Date,
        autoTrade?: boolean,
        levels?: Level[],
        orders?: Order[],
    }) {
        const { _id, createdAt, autoTrade, levels, orders } = initials;
        this._id = _id;
        this.createdAt = createdAt || new Date();
        this.autoTrade = !!autoTrade;
        this.status = TraderStatus.Idle;
        this.levels = levels || createDefaultLevels({
            depth: 10,
            step: 0.2,
            profit: 0.2,
        });
        this.orders = orders || [];
        this.clients = [];
    }

    getClientsLevels(): IOrderLevel[] {
        const buyLevel = this.levels.find(({ _id }) => _id === 'BUY-0');
        const sellLevel = this.levels.find(({ _id }) => _id === 'SELL-0');
        return [
            { qty: buyLevel.qty, side: buyLevel.side, percent: buyLevel.enter },
            { qty: sellLevel.qty, side: sellLevel.side, percent: sellLevel.enter },
        ];
    }

    changeStatus(socketId: string): TraderStatus {
        if (this.status === TraderStatus.Trading) {
            this.status = TraderStatus.Idle;
        } else {
            this.status = TraderStatus.Trading;
        }
        const clients = this.clients.filter(({ id }) => id !== socketId);
        clients.forEach((socket) => {
            socket.emit(ServerEvents.TRADER_STATUS_CHANGED, this.status);
        });
        return this.status;
    }
}

export const TraderModel = getModelForClass(Trader);
