import Router from "express";
import { patchEntryById } from "../controllers/patchEntry";

const route = Router();

// PATCH /api/users/:entry_id
route.patch("/:entry_id", patchEntryById)

export default route;
