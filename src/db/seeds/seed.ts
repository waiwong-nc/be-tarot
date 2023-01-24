
// import seed from "..seeds/seed";
import format from "pg-format";
import db from "../connection";
import { usersData, entriesData } from "../data";

// console.log(users, "<< users")
// console.log(entries, "<< entries");
// console.log(usersData, entriesData);

const seed = () => {
  // drop the exsiting tables
 const dropEntriesTablePromises = db.query("DROP TABLE IF EXISTS entries;");
  const dropUsersTablePromises = db.query("DROP TABLE IF EXISTS users;");
//   const dropEntriesTablePromises = db.query("DROP TABLE IF EXISTS entries;");

  // create those tables again
  const createtUsersTablePromise = db.query(`
    CREATE TABLE users (
        user_id SERIAL PRIMARY KEY,
        user_name VARCHAR NOT NULL,
        email VARCHAR NOT NULL,
        password VARCHAR NOT NULL
    );`);

  const createEntriesTablePromise = db.query(`
    CREATE TABLE entries (
        entry_id SERIAL PRIMARY KEY,
        user_id INT REFERENCES users(user_id),
        entry_body VARCHAR NOT NULL,
        tarot_card_id VARCHAR[],
        created_at TIMESTAMP DEFAULT NOW()
    );`);

// const insertUsersQueryStr = format(
//   "INSERT INTO users (user_name, email, password) VALUES %L RETURNING *;",
//   usersData.map(({ user_name, email, password }) => [
//     user_name,
//     email,
//     password,
//   ])
// );

// const insertEntriesQueryStr = format(
//   "INSERT INTO entries (user_id, entry_body, tarot_card_id, created_at ) VALUES %L RETURNING *;",
//   entriesData.map(({ user_id, entry_body, tarot_card_id, created_at }) => [
//     user_id,
//     entry_body,
//     tarot_card_id,
//     created_at,
//   ])
// );

// const insertUsersPromise = db.query(insertUsersQueryStr);
// const insertEntriesPromise = db.query(insertEntriesQueryStr);

  // insert data to those table.

//   dropUsersTablePromises.then((data)=>{console.log(data)})

//   Promise.all([dropUsersTablePromises, dropEntriesTablePromises])
//     .then((data) => {
//       // dropping table
//       // after dropping ok, create tables
//       console.log(data[0], "< data0");
//     //     return Promise.all([createtUsersTablePromise, createEntriesTablePromise]);
//     })
//     // .then((data)=>{
//     //     console.log(data, "<< data insert")
//     //     return Promise.all([insertUsersPromise, insertEntriesPromise]);
//     // })
//     .catch((err) => {
//       //     console.log(err,"<< err")
//       //   console.log("tables not dropped", err);
//     });
}

seed();

export default seed;