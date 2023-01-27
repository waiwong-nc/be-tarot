import Express from "express";
import { NextFunction, Request, Response } from "express";
import usersRouter from "./router/users";
import entriesRouter from "./router/entries";
import entryByIdRouter from "./router/entryById"
import patchEntriesRouter from "./router/patchEntries"
import { customerError, status404, status500 } from "./controllers/errors";


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
app.use("/api/entries/:entry_id", patchEntriesRouter);


// Only enable this router during development stage
import errorTestRouter from "./router/errorTest";
app.use("/api/error-test", errorTestRouter);
// Only enable this router during development stage

// Error Handling
app.all("*", status404);
app.use(customerError);
app.use(status500);

export default app;
