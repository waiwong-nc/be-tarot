import Router from "express";
import { getEntries, getEntryById, postEntry } from "../controllers/entries";
import { auth } from "../middlewares/is-auth";
import { entryInputValidator } from "../middlewares/validator";
const route = Router();

// GET /api/entries
route.get("/",auth, getEntries);
route.get("/:entry_id", auth,getEntryById);
route.post("/", entryInputValidator(), auth, postEntry);

export default route;
