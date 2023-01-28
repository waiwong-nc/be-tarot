import db from "../db/connection";

// GET /api/entries
export const selectAllEntries = () => {
  const sql = `SELECT * FROM entries`;
  return db.query(sql).then(({ rows }) => {
    return rows;
  });
};

// GET /api/entries
export const selectAllEntriesById = (id:number) => {
  const sql = `SELECT * FROM entries WHERE user_id = $1`;
  return db.query(sql,[id]).then(({ rows }) => {
    return rows;
  });
};

// GET /api/entries/:entry_id
// export const selectEntryById = (entry_id: string) => {
//   const sql = "SELECT * FROM entries WHERE entry_id = $1;"
//   return db.query(sql, [entry_id]).then(({ rows }) => {
//     return rows;
//   });
// };

// GET /api/entries/:entry_id
export const selectEntryById = (entry_id: string, user_id: number) => {
  const sql = "SELECT * FROM entries WHERE entry_id = $1 AND user_id = $2;"
  return db.query(sql, [entry_id, user_id]).then(({ rows }) => {
    return rows;
  });
};

type entry_body_type = {user_id: number, entry_body: string, tarot_card_id: string, intention: string} 

export const insertEntry = (userId:number, entryBody: entry_body_type) => {
  const sql =
    "INSERT INTO entries (user_id, entry_body, tarot_card_id, intention) VALUES ($1, $2, $3, $4) RETURNING *;";
  return db
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