"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.insertEntry = exports.selectEntryById = exports.selectAllEntriesById = exports.selectAllEntries = void 0;
const connection_1 = __importDefault(require("../db/connection"));
// GET /api/entries
const selectAllEntries = () => {
    const sql = `SELECT * FROM entries`;
    return connection_1.default.query(sql).then(({ rows }) => {
        return rows;
    });
};
exports.selectAllEntries = selectAllEntries;
// GET /api/entries
const selectAllEntriesById = (id) => {
    const sql = `SELECT * FROM entries WHERE user_id = $1`;
    return connection_1.default.query(sql, [id]).then(({ rows }) => {
        return rows;
    });
};
exports.selectAllEntriesById = selectAllEntriesById;
// GET /api/entries/:entry_id
// export const selectEntryById = (entry_id: string) => {
//   const sql = "SELECT * FROM entries WHERE entry_id = $1;"
//   return db.query(sql, [entry_id]).then(({ rows }) => {
//     return rows;
//   });
// };
// GET /api/entries/:entry_id
const selectEntryById = (entry_id, user_id) => {
    const sql = "SELECT * FROM entries WHERE entry_id = $1 AND user_id = $2;";
    return connection_1.default.query(sql, [entry_id, user_id]).then(({ rows }) => {
        return rows;
    });
};
exports.selectEntryById = selectEntryById;
const insertEntry = (userId, entryBody) => {
    const sql = "INSERT INTO entries (user_id, entry_body, tarot_card_id, intention) VALUES ($1, $2, $3, $4) RETURNING *;";
    return connection_1.default
        .query(sql, [
        userId,
        entryBody.entry_body,
        JSON.stringify(entryBody.tarot_card_id),
        entryBody.intention,
    ])
        .then(({ rows }) => {
        return rows[0];
    })
        .catch((err) => console.log(err, "err in model"));
};
exports.insertEntry = insertEntry;
