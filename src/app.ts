import Express from "express";
import { NextFunction, Request, Response } from "express";
import usersRouter from "./router/users";

const app = Express();
const cors = require("cors");
app.use(Express.json());
app.use(cors());


// Routes 
app.get("/", (req: Request, res: Response, next: NextFunction) => {
    res.status(200).send({msg:"Server Ready"}); 
});


app.get("/api/users",usersRouter);



// Error Handling

export default app;
