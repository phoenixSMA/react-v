import { IContract } from "../../src/store/types";
import { Socket } from "socket.io";

export interface IClient {
	id: string;
	socket?: Socket;
	legs?: IContract[];
}