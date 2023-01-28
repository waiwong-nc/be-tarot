"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pg_1 = require("pg");
const ENV = process.env.NODE_ENV || "development";
require("dotenv").config({
    path: `${__dirname}/../../.env.${ENV}`
});
if (!process.env.PGDATABASE && !process.env.DATABASE_URL) {
    throw new Error("PGDATABASE or DATABASE_URL not set");
}
;
const config = ENV === "production"
    ? {
        connectionString: process.env.DATABASE_URL,
        max: 2,
    }
    : {};
exports.default = new pg_1.Pool(config);
