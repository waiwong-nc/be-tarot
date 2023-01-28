"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const errors_1 = require("../controllers/errors");
const route = (0, express_1.default)();
// GET /api/error-test/trigger-status-500-error
route.get("/triggerStatus500Error", errors_1.triggerStatus500Error);
// GET /api/error-test/table_not_found
route.get("/tableNotFound", errors_1.triggerServerError);
exports.default = route;
