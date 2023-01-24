
// import seed from "..seeds/seed";
import format from "pg-format";
import db from "../connection";
import { usersData, entriesData } from "../data";



const seed = () => {

  // drop the exsiting tables
 const dropUsersTablePromises = db.query("DROP TABLE IF EXISTS users CASCADE;");
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
      )
      .then(() => {
         // Then create entries table, as it needs to refer user_id
         return db
           .query(
             ` CREATE TABLE entries (
                  entry_id SERIAL PRIMARY KEY,
                  user_id INT REFERENCES users(user_id),
                  entry_body VARCHAR,
                  tarot_card_id VARCHAR,
                  created_at TIMESTAMP DEFAULT NOW()
              );`
           )
           .catch(() => {
             return Promise.reject('Cannot Create Table "entries"');
           });
      })
      .catch((err) => {
          return Promise.reject(`Cannot Create Table: ${err}`);
      })

    })
    .then(() => {

      // Insert User data 
      const insertUsersQueryStr = format(
        "INSERT INTO users (user_name, email, password) VALUES %L RETURNING *;",
        usersData.map(({ user_name, email, password }) => 
            [
          user_name,
          email,
          password,
        ])
        
      );
      db.query(insertUsersQueryStr).then((result) => result.rows);


       //  Insert entries data
      const insertEntriesQueryStr = format(
        "INSERT INTO entries (user_id, entry_body, tarot_card_id, created_at) VALUES %L RETURNING *;",
        entriesData.map(({ user_id, entry_body, tarot_card_id, created_at }) => {
             return  [
            user_id,
            entry_body,
            JSON.stringify(tarot_card_id),
            created_at,
          ]
        })
      );
      db.query(insertEntriesQueryStr).then((result) => result.rows);

    })
    .catch((err) => {
      console.log(err, "<< Error in Seed");
    });
}

export default seed;