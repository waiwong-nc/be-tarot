"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.tableNotFound = void 0;
const connection_1 = __importDefault(require("../db/connection"));
// GET /api/error/table-not-found
const tableNotFound = () => {
    const sql = `SELECT * FROM ussadfsadfdasers`;
    return connection_1.default.query(sql).then(({ rows }) => {
        return rows;
    });
};
exports.tableNotFound = tableNotFound;
