import Router from 'express';
import { getUsers } from "../controllers/users";
const route = Router();


// GET /api/user
route.get("/", getUsers);

export default route;