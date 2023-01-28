"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../controllers/auth");
const route = (0, express_1.Router)();
// POST auth/signup
route.post('/signup', auth_1.signUp);
// POST auth/login
route.post('/login', auth_1.login);
// POST auth/login
route.post('/signUpConfirm', auth_1.signUpConfirom);
exports.default = route;
