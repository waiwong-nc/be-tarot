import { Pool } from "pg";

const ENV = process.env.NODE_ENV || "development";

require("dotenv").config({ 
    path: `${__dirname}/../../.env`
});

if (!process.env.PGDATABASE && !process.env.DATABASE_URL) {
    throw new Error("PGDATABASE or DATABASE_URL not set");
};

const config = 
    ENV === "production" 
    ? {
        connectionString: process.env.DATABASE_URL,
        max: 2,
    }
    : {};


export default new Pool(config);