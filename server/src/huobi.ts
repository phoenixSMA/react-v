import io from "socket.io-client";

const url = `wss://www.hbdm.com/ws`;
const socket = io.connect(url);

socket.on('connect', () => {
	console.log(`Connected ${socket.id}`);
});

socket.on('connect_error', (error: Error) => {
	console.log(`Connect Error ${error.message}`);
});