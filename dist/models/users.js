"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.selectUserById = exports.selectUserByEmail = exports.selectAllUsers = void 0;
const connection_1 = __importDefault(require("../db/connection"));
// GET /api/users
const selectAllUsers = () => {
    const sql = `SELECT * FROM users`;
    return connection_1.default.query(sql).then(({ rows }) => {
        return rows;
    });
};
exports.selectAllUsers = selectAllUsers;
const selectUserByEmail = (email) => {
    const sql = `SELECT * FROM users WHERE email = $1;`;
    return connection_1.default.query(sql, [email.toLowerCase()]).then(({ rows }) => {
        return rows;
    });
};
exports.selectUserByEmail = selectUserByEmail;
const selectUserById = (id) => {
    const sql = `SELECT * FROM users WHERE user_id = $1;`;
    return connection_1.default.query(sql, [id]).then(({ rows }) => {
        return rows;
    });
};
exports.selectUserById = selectUserById;
