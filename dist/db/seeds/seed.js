"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const pg_format_1 = __importDefault(require("pg-format"));
const connection_1 = __importDefault(require("../connection"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const seed = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const { usersData, entriesData, pendingUsersData } = data;
    yield connection_1.default.query(`DROP TABLE IF EXISTS pending_users;`);
    yield connection_1.default.query(`DROP TABLE IF EXISTS entries;`);
    yield connection_1.default.query(`DROP TABLE IF EXISTS users;`);
    //  Create table "users" and insert data into the table
    yield connection_1.default.query(` CREATE TABLE users (
          user_id SERIAL PRIMARY KEY,
          user_name VARCHAR NOT NULL,
          email VARCHAR NOT NULL,
          password VARCHAR NOT NULL,
          created_at TIMESTAMP DEFAULT NOW()
    );`);
    const insertUsersDataPromises = usersData.map(({ user_name, email, password }) => {
        return bcryptjs_1.default.hash(password, 12).then((hashedPwd) => {
            return [user_name, email.toLowerCase(), hashedPwd];
        });
    });
    let insertUsersQueryStr = "";
    yield Promise.all(insertUsersDataPromises).then((promises) => {
        insertUsersQueryStr = (0, pg_format_1.default)("INSERT INTO users (user_name, email, password) VALUES %L RETURNING *;", promises);
    });
    yield connection_1.default.query(insertUsersQueryStr);
    //  Create table "entries" and insert data into the table
    yield connection_1.default.query(` CREATE TABLE entries (
        entry_id SERIAL PRIMARY KEY,
        user_id INT NOT NULL REFERENCES users(user_id),
        entry_body VARCHAR,
        tarot_card_id VARCHAR,
        created_at TIMESTAMP DEFAULT NOW(),
        intention VARCHAR

    );`);
    const insertEntriesQueryStr = (0, pg_format_1.default)("INSERT INTO entries (user_id, entry_body, tarot_card_id, created_at, intention) VALUES %L RETURNING *;", entriesData.map(({ user_id, entry_body, tarot_card_id, created_at, intention }) => {
        return [
            user_id,
            entry_body,
            JSON.stringify(tarot_card_id),
            created_at,
            intention,
        ];
    }));
    yield connection_1.default.query(insertEntriesQueryStr);
    //  Create table "pending_users" and insert data into the table
    yield connection_1.default.query(` CREATE TABLE pending_users (
        user_id SERIAL PRIMARY KEY,
        user_name VARCHAR,
        email VARCHAR,
        password VARCHAR,
        code INT,
        created_at TIMESTAMP DEFAULT NOW()
      );`);
    const insertPendingUsersDataPromises = pendingUsersData.map(({ user_name, email, password, code, created_at }) => {
        return bcryptjs_1.default.hash(password, 12).then((hashedPwd) => {
            return [user_name, email, hashedPwd, code, created_at];
        });
    });
    let insertPendingUsersQueryStr = "";
    yield Promise.all(insertPendingUsersDataPromises).then((promises) => {
        insertPendingUsersQueryStr = (0, pg_format_1.default)("INSERT INTO pending_users (user_name, email, password,code, created_at) VALUES %L RETURNING *;", promises);
    });
    yield connection_1.default.query(insertPendingUsersQueryStr);
});
exports.default = seed;
