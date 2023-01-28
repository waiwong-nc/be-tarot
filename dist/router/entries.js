"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const entries_1 = require("../controllers/entries");
const is_auth_1 = require("../middlewares/is-auth");
const validator_1 = require("../middlewares/validator");
const route = (0, express_1.default)();
// GET /api/entries
route.get("/", is_auth_1.auth, entries_1.getEntries);
route.get("/:entry_id", is_auth_1.auth, entries_1.getEntryById);
route.post("/", (0, validator_1.entryInputValidator)(), is_auth_1.auth, entries_1.postEntry);
exports.default = route;
