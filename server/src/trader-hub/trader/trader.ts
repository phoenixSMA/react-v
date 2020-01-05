import { arrayProp, getModelForClass, prop } from "@typegoose/typegoose";
import { Socket } from 'socket.io';
import { createDefaultLevels, Level } from "./level";
import { Order } from "./order";

export class Trader {
	@prop()
	_id: string;
	@prop()
	createdAt: Date;
	@prop()
	autoTrade: boolean;
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
		this.levels = levels || createDefaultLevels({
			depth: 10,
			step: 0.2,
			profit: 0.2,
		});
		this.orders = orders || [];
		this.clients = [];
	}
}

export const TraderModel = getModelForClass(Trader);
