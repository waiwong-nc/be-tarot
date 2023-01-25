import db from "../db/connection";

// GET /api/entries
export const selectAllEntries = () => {
  const sql = `SELECT * FROM entries`;
  return db.query(sql).then(({ rows }) => {
    return rows;
  });
};
