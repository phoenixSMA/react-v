import dotenv from "dotenv";
import {SocketServer} from "./socket-server";
import {TraderHub} from "./trader-hub/trader-hub";
import mongoose from 'mongoose';

dotenv.config();

(async () => {
    await mongoose.connect('mongodb://localhost:27017/', {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        dbName: "data"
    });
})();

export const traderHub = new TraderHub();

export const app = new SocketServer().getApp();


// define a route handler for the default home page
// app.get("/", (req: Request, res: Response) => {
// 	res.send("Hello world!");
// });

// start the Express server
// app.listen(port, () => {
// 	console.log(`server started at http://localhost:${port}`);
// });

