import Router from "express";
import { getEntryById } from "../controllers/entries";
const route = Router();

// GET /api/entries
route.get("/", getEntryById);

export default route;
