import db from "../db/connection";

// GET /api/entries
export const selectAllEntries = () => {
  const sql = `SELECT * FROM entries`;
  return db.query(sql).then(({ rows }) => {
    return rows;
  });
};

// GET /api/entries/:entry_id
export const selectEntryById = (entry_id: string) => {

 
  console.log("Hi from model")
const sql = "SELECT * FROM entries WHERE entry_id = $1;"
return db.query(sql, [entry_id]).then(({ rows }) => {
  return rows;
});
};

type entry_body_type = {entry_body: string, tarot_card_id: string, intention: string} 

export const insertEntry = (entryBody: entry_body_type) => {
  console.log(entryBody, "entryBody")
  console.log("In model")
  const sql = 'INSERT INTO entries (entry_body, tarot_card_id, intention) VALUES ($1, $2, $3) RETURNING *;'
  return db.query(sql, [entryBody.entry_body, entryBody.tarot_card_id, entryBody.intention ]).then(( rows ) => {
    console.log(rows, "rows")
    console.log({rows}, "{rows}")
    return {rows};
  });
  };