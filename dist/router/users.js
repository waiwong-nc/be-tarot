"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const users_1 = require("../controllers/users");
const is_auth_1 = require("../middlewares/is-auth");
const route = (0, express_1.default)();
// GET /api/users
route.get("/", is_auth_1.auth, users_1.getUsers);
// GET /api/users/profile
route.get("/profile", is_auth_1.auth, users_1.getProfile);
exports.default = route;
