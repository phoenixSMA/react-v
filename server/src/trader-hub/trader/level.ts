import { prop } from "@typegoose/typegoose";
import { TradeSides } from "../../../../src/store/types";

export enum LevelStatus {
	Idle = 'IDLE',
	Opening = 'OPENING',
	Closing = 'CLOSING',
}

export class Level {
	@prop()
	_id: string;
	@prop()
	side: TradeSides;
	@prop()
	qty: number;
	@prop()
	enter: number;
	@prop()
	exit: number;
	@prop()
	strictProfit: boolean;
	@prop()
	status: LevelStatus;

	constructor(initials: {
		_id: string,
		side: TradeSides,
		enter: number,
		exit: number,
		strictProfit?: boolean,
	}) {
		const { _id, side, enter, exit, strictProfit } = initials;
		this._id = _id;
		this.side = side;
		this.enter = enter;
		this.exit = exit;
		this.strictProfit = !!strictProfit;
		this.status = LevelStatus.Idle;
	}
}

interface ICreateDefaultLevelsParams {
	zeroPoint?: number;
	depth: number;
	step: number;
	profit: number;
	strictProfit?: boolean;
}

export const createDefaultLevels = (params: ICreateDefaultLevelsParams): Level[] => {
	const { zeroPoint = 0, depth, step, profit, strictProfit = false } = params;
	const levels: Level[] = [];
	for (const side of [TradeSides.Buy, TradeSides.Sell]) {
		for (let idx = 0; idx < depth; idx++) {
			const direction = side === TradeSides.Buy ? 1 : -1;
			const enter = zeroPoint - direction * step * (idx + 1);
			const exit = enter + direction * profit;
			levels.push(new Level({
				_id: `${side}-${idx}`,
				side,
				enter,
				exit,
				strictProfit,
			}))
		}
	}
	return levels;
};
