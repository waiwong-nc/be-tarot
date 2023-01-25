import Router from "express";
import { getEntries, getEntryById } from "../controllers/entries";

const route = Router();

// GET /api/entries
route.get("/", getEntries);
route.get("/:entry_id",getEntryById)

export default route;
