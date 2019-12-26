import dotenv from "dotenv";
import { SocketServer } from "./socket-server";

dotenv.config();

export const app = new SocketServer().getApp();

// define a route handler for the default home page
// app.get("/", (req: Request, res: Response) => {
// 	res.send("Hello world!");
// });

// start the Express server
// app.listen(port, () => {
// 	console.log(`server started at http://localhost:${port}`);
// });

