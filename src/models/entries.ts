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
