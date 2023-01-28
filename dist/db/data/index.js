"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.pendingUsersData = exports.entriesData = exports.usersData = void 0;
const entries_1 = __importDefault(require("./entries"));
const users_1 = __importDefault(require("./users"));
const pendingUsers_1 = __importDefault(require("./pendingUsers"));
exports.usersData = users_1.default;
exports.entriesData = entries_1.default;
exports.pendingUsersData = pendingUsers_1.default;
exports.default = { usersData: exports.usersData, entriesData: exports.entriesData, pendingUsersData: exports.pendingUsersData };
