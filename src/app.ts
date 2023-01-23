import Express from "express";
import { NextFunction, Request, Response } from "express";

const app = Express();
const cors = require("cors");
app.use(Express.json());
app.use(cors());

// Middlewares

app.get("/", (req: Request, res: Response, next: NextFunction) => {
    res.status(200).send("server ready"); 
});

// Routes 

// Error Handling

export default app;
