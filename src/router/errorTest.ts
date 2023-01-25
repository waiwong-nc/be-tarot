import Router from "express";
import {
  triggerStatus500Error,
  triggerServerError,
} from "../controllers/errors";

const route = Router();

// GET /api/error-test/trigger-status-500-error
route.get("/triggerStatus500Error", triggerStatus500Error);


// GET /api/error-test/table_not_found
route.get("/tableNotFound", triggerServerError);

export default route;
