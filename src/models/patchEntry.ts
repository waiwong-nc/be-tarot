import db from "../db/connection";

// PATCH /api/users/:entry_id
export const patchEntry = (entry_id: string, editedEntry: any) => {

  const {user_id} = editedEntry;
  const {entry_body} = editedEntry;


const sql = "UPDATE entries SET entry_body = $1 WHERE entry_id = $2 AND user_id = $3 RETURNING *;"
return db.query(sql, [entry_body, entry_id, user_id]).then(({ rows }) => {
  return rows;
});
};