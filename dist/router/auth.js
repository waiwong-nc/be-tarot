"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../controllers/auth");
const validator_1 = require("../middlewares/validator");
const route = (0, express_1.Router)();
// POST auth/signup
route.post('/signup', (0, validator_1.signupInputValidator)(), auth_1.signUp);
// POST auth/login
route.post('/login', (0, validator_1.loginInInputValidator)(), auth_1.login);
// POST auth/signUpConfirm
route.post('/signUpConfirm', auth_1.signUpConfirom);
exports.default = route;
