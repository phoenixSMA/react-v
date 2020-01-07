import { IContract } from "../../../../src/store/types";
import { prop } from "@typegoose/typegoose";
import { Exchange, Underlying } from "../../../../src/service/constants";

export class Contract implements IContract {
    @prop()
    text: string;
    @prop()
    name: string;
    @prop()
    underlying: Underlying;
    @prop()
    exchange: Exchange;
    @prop()
    formatter: number;
}
