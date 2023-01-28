import { Router } from "express";
import { signUp, login, signUpConfirom } from "../controllers/auth";
import {
  loginInInputValidator,
  signupInputValidator,
} from "../middlewares/validator";

const route = Router();

// POST auth/signup
route.post('/signup',signupInputValidator(), signUp);

// POST auth/login
route.post('/login',loginInInputValidator(), login);

// POST auth/signUpConfirm
route.post('/signUpConfirm', signUpConfirom);

export default route;