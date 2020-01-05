import {TradeSides} from "../../../src/store/types";
import {arrayProp, getModelForClass, prop, Ref} from "@typegoose/typegoose";
import {Socket} from 'socket.io';

class Order {
    @prop()
    _id: string;
}

class Level {
    @prop()
    _id: string;
    @prop()
    side: TradeSides;
    @prop()
    enter: number;
    @prop()
    exit: number;
    @prop()
    opened: boolean;
    @prop({ref: Order})
    openOrder: Ref<Order> | null;
}

export class Trader {
    @prop()
    _id: string;
    @prop()
    createdAt: Date;
    @prop()
    autoTrade: boolean;
    @arrayProp({items: Level})
    levels: Level[];
    @arrayProp({items: Order})
    orders: Order[];

    clients: Socket[];

    constructor(initials: {
        _id: string,
        createdAt?: Date,
        autoTrade?: boolean,
        levels?: Level[],
        orders?: Order[],
    }) {
        const {_id, createdAt, autoTrade, levels, orders} = initials;
        this._id = _id;
        this.createdAt = createdAt || new Date();
        this.autoTrade = !!autoTrade;
        this.levels = levels || [];
        this.orders = orders || [];
        this.clients = [];
    }
}

export const TraderModel = getModelForClass(Trader);
