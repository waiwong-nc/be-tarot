import format from "pg-format";
import db from "../connection";

const seed = async (data: SeedDataType) => {
  const { usersData, entriesData, pendingUsersData } = data;
  await db.query(`DROP TABLE IF EXISTS pending_users;`);
  await db.query(`DROP TABLE IF EXISTS entries;`);
  await db.query(`DROP TABLE IF EXISTS users;`);
  await db.query(
    // Create users table first
    ` CREATE TABLE users (
          user_id SERIAL PRIMARY KEY,
          user_name VARCHAR NOT NULL,
          email VARCHAR NOT NULL,
          password VARCHAR NOT NULL
    );`
  );

  const insertUsersQueryStr = format(
    "INSERT INTO users (user_name, email, password) VALUES %L RETURNING *;",
    usersData.map(({ user_name, email, password }) => [
      user_name,
      email,
      password,
    ])
  );

  await db.query(insertUsersQueryStr);

  await db.query(
    ` CREATE TABLE entries (
        entry_id SERIAL PRIMARY KEY,
        user_id INT NOT NULL REFERENCES users(user_id),
        entry_body VARCHAR,
        tarot_card_id VARCHAR,
        created_at TIMESTAMP DEFAULT NOW(),
        intention VARCHAR

    );`
  );

  const insertEntriesQueryStr = format(
    "INSERT INTO entries (user_id, entry_body, tarot_card_id, created_at, intention) VALUES %L RETURNING *;",
    entriesData.map(
      ({ user_id, entry_body, tarot_card_id, created_at, intention }) => {
        return [
          user_id,
          entry_body,
          JSON.stringify(tarot_card_id),
          created_at,
          intention,
        ];
      }
    )
  );

  await db.query(insertEntriesQueryStr);

  await db.query(
    ` CREATE TABLE pending_users (
        user_id SERIAL PRIMARY KEY,
        user_name VARCHAR,
        email VARCHAR,
        password VARCHAR,
        code INT,
        created_at TIMESTAMP DEFAULT NOW()
      );`
  );

  const insertPendingUsersQueryStr = format(
    "INSERT INTO pending_users (user_name, email, password,code, created_at) VALUES %L RETURNING *;",
    pendingUsersData.map(({ user_name, email, password, code, created_at }) => {
      return [user_name, email, password, code, created_at];
    })
  );

  await db.query(insertPendingUsersQueryStr);
};
export default seed;
