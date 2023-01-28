"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const entries_1 = require("../controllers/entries");
const route = (0, express_1.default)();
// GET /api/entries
route.get("/", entries_1.getEntryById);
exports.default = route;
