
import format from "pg-format";
import db from "../connection";

const seed = (data: TextDataType) => {

  const { usersData, entriesData } = data;

  const dropUsersTablePromises = db.query(
    "DROP TABLE IF EXISTS users CASCADE;"
  );
  const dropEntriesTablePromises = db.query("DROP TABLE IF EXISTS entries;");

  Promise.all([dropUsersTablePromises, dropEntriesTablePromises])
    .then(() => {
      // create those tables again
      return db.query(
        // Create users table first
        ` CREATE TABLE users (
              user_id SERIAL PRIMARY KEY,
              user_name VARCHAR NOT NULL,
              email VARCHAR NOT NULL,
              password VARCHAR NOT NULL
        );`
      );
    })
    .then(() => {
      // Then create entries table, as it needs to refer user_id
      return db.query(
        ` CREATE TABLE entries (
                entry_id SERIAL PRIMARY KEY,
                user_id INT REFERENCES users(user_id),
                entry_body VARCHAR,
                tarot_card_id VARCHAR,
                created_at TIMESTAMP DEFAULT NOW()
            );`
      );
    })
    .then(() => {
      // Insert User data
      const insertUsersQueryStr = format(
        "INSERT INTO users (user_name, email, password) VALUES %L RETURNING *;",
        usersData.map(({ user_name, email, password }) => [
          user_name,
          email,
          password,
        ])
      );

      return db.query(insertUsersQueryStr);
    })
    .then(() => {
      //  Insert entries data
      const insertEntriesQueryStr = format(
        "INSERT INTO entries (user_id, entry_body, tarot_card_id, created_at) VALUES %L RETURNING *;",
        entriesData.map(
          ({ user_id, entry_body, tarot_card_id, created_at }) => {
            return [
              user_id,
              entry_body,
              JSON.stringify(tarot_card_id),
              created_at,
            ];
          }
        )
      );

      return db.query(insertEntriesQueryStr);
    })
    .then(() => {
      db.end();
    })
    .catch((err) => {
      console.log(err, "<< Error in Seed");
      db.end();
    });
};

export default seed;