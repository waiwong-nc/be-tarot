import Router from 'express';
import { getUsers } from "../controllers/users";
import { auth } from "../middlewares/is-auth";
const route = Router();

// GET /api/user
route.get("/",auth, getUsers);

export default route;
