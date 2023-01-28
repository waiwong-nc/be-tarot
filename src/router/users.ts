import Router from 'express';
import { getUsers, getProfile } from "../controllers/users";
import { auth } from "../middlewares/is-auth";
const route = Router();

// GET /api/users
route.get("/",auth, getUsers);

// GET /api/users/profile
route.get("/profile", auth, getProfile);

export default route;
