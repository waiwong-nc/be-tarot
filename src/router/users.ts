import Router from 'express';
import { getUsers } from "../controllers/users";
const route = Router();


// GET /api/user
route.get("/api/users", getUsers);

export default route;