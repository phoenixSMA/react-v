import dotenv from "dotenv";
import express from "express";
import { Request, Response } from "express";

dotenv.config();
const app = express();
const port = process.env.SERVER_PORT; // default port to listen

// define a route handler for the default home page
app.get("/", (req: Request, res: Response) => {
	res.send("Hello world!");
});

// start the Express server
app.listen(port, () => {
	console.log(`server started at http://localhost:${port}`);
});
