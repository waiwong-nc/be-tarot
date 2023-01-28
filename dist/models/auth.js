"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCode = exports.deletePendingUser = exports.selectPendingUser = exports.createPendingUser = exports.selectLatestUsesr = exports.createUser = void 0;
const connection_1 = __importDefault(require("../db/connection"));
const createUser = (username, email, password) => {
    const sql = `INSERT INTO users (user_name, email, password) VALUES ($1,$2,$3) RETURNING *`;
    return connection_1.default.query(sql, [username, email, password])
        .then(({ rows }) => {
        return rows[0];
    });
};
exports.createUser = createUser;
const selectLatestUsesr = () => {
    const sql = `SELECT * FROM users ORDER BY user_id DESC LIMIT 1`;
    return connection_1.default.query(sql)
        .then(({ rows }) => {
        return rows;
    });
};
exports.selectLatestUsesr = selectLatestUsesr;
const createPendingUser = (username, password, email, code) => {
    const sql = `INSERT INTO pending_users ( user_name, email, password, code)
                VALUES ($1, $2, $3, $4) RETURNING *;`;
    return connection_1.default.query(sql, [username, email, password, code]).then(({ rows }) => {
        return rows[0].user_id;
    });
};
exports.createPendingUser = createPendingUser;
const selectPendingUser = (id) => {
    const sql = `SELECT * from pending_users WHERE user_id = $1;`;
    return connection_1.default.query(sql, [id]).then(({ rows }) => {
        return rows[0];
    });
};
exports.selectPendingUser = selectPendingUser;
const deletePendingUser = (id) => {
    const sql = `DELETE FROM pending_users WHERE user_id = $1;`;
    return connection_1.default.query(sql, [id]);
};
exports.deletePendingUser = deletePendingUser;
const getCode = (pendingUserId) => {
    const sql = `SELECT * from pending_users WHERE user_id = $1;`;
    return connection_1.default.query(sql, [pendingUserId]).then(({ rows }) => {
        return rows[0].code;
    });
};
exports.getCode = getCode;
