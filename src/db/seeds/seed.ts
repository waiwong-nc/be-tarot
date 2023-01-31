import format from "pg-format";
import db from "../connection";
import bcrypt from "bcryptjs";

const seed = async (data: SeedDataType) => {
  const { usersData, entriesData, pendingUsersData } = data;
  await db.query(`DROP TABLE IF EXISTS pending_users;`);
  await db.query(`DROP TABLE IF EXISTS entries;`);
  await db.query(`DROP TABLE IF EXISTS users;`);

  //  Create table "users" and insert data into the table
  await db.query(
    ` CREATE TABLE users (
          user_id SERIAL PRIMARY KEY,
          user_name VARCHAR NOT NULL,
          email VARCHAR NOT NULL,
          password VARCHAR NOT NULL,
          created_at TIMESTAMP DEFAULT NOW()
    );`
  );

  const insertUsersDataPromises = usersData.map(
    ({ user_name, email, password }) => {
      return bcrypt.hash(password, 12).then((hashedPwd: string) => {
        return [user_name, email.toLowerCase(), hashedPwd];
      });
    }
  );

  let insertUsersQueryStr = "";
  await Promise.all(insertUsersDataPromises).then((promises) => {
    insertUsersQueryStr = format(
      "INSERT INTO users (user_name, email, password) VALUES %L RETURNING *;",
      promises
    );
  });

  await db.query(insertUsersQueryStr);

  //  Create table "entries" and insert data into the table
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

  //  Create table "pending_users" and insert data into the table
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

  const insertPendingUsersDataPromises = pendingUsersData.map(
    ({ user_name, email, password, code, created_at }) => {
      return bcrypt.hash(password, 12).then((hashedPwd) => {
        return [user_name, email, hashedPwd, code, created_at];
      });
    }
  );

  let insertPendingUsersQueryStr = "";
  await Promise.all(insertPendingUsersDataPromises).then((promises) => {
    insertPendingUsersQueryStr = format(
      "INSERT INTO pending_users (user_name, email, password,code, created_at) VALUES %L RETURNING *;",
      promises
    );
  });

  await db.query(insertPendingUsersQueryStr);
};
export default seed;
