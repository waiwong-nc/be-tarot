import Express from "express";
import { NextFunction, Request, Response } from "express";
import usersRouter from "./router/users";
import entriesRouter from "./router/entries";
import errorTestRouter from "./router/errorTest";
import { customerError, status404, status500 } from "./controllers/errors";

const app = Express();
const cors = require("cors");
app.use(Express.json());
app.use(cors());
app.use("/api/error-test", errorTestRouter);

// Routes 
app.get("/", (req: Request, res: Response, next: NextFunction) => {
    res.status(200).send({msg:"Server Ready"}); 
});


app.use("/api/users", usersRouter);
app.use("/api/entries", entriesRouter);

// Only enable this router during development stage




// Error Handling
app.all("*", status404);
app.use(customerError);
app.use(status500);

export default app;
