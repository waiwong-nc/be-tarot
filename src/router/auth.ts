import { Router } from "express";
import { signUp, login, signUpConfirom } from "../controllers/auth";

const route = Router();

// POST auth/signup
route.post('/signup', signUp);

// POST auth/login
route.post('/login', login);

// POST auth/login
route.post('/signUpConfirm', signUpConfirom);

export default route;