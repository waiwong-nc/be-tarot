
import Router from "express";
import { postEntry } from "../controllers/entries";
const route = Router();

// GET /api/entries
route.get("/", postEntry);

export default route;

