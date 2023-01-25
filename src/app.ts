import Express from "express";
import { NextFunction, Request, Response } from "express";
import usersRouter from "./router/users";
import entriesRouter from "./router/entries";
import entryByIdRouter from "./router/entryById"

const app = Express();
const cors = require("cors");
app.use(Express.json());
app.use(cors());


// Routes 
app.get("/", (req: Request, res: Response, next: NextFunction) => {
    res.status(200).send({msg:"Server Ready"}); 
});


app.use("/api/users",usersRouter);
app.use("/api/entries", entriesRouter);
app.use("/api/entries/:entry_id", entryByIdRouter);


// Error Handling

export default app;
