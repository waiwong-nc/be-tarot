import Router from "express";
import { getEntries, getEntryById, postEntry } from "../controllers/entries";

const route = Router();

// GET /api/entries
route.get("/", getEntries);
route.get("/:entry_id",getEntryById)
route.post("/", postEntry);

export default route;
