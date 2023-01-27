import Router from "express";
import { patchEntryById } from "../controllers/patchEntry";

const route = Router();

// PATCH /api/users/:entry_id
route.patch("/", patchEntryById)

export default route;
