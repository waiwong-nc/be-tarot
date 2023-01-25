import Router from "express";
import { getEntries } from "../controllers/entries";
const route = Router();

// GET /api/entries
route.get("/", getEntries);

export default route;
