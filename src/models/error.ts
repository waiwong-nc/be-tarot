import db from "../db/connection";

// GET /api/error/table-not-found
export const tableNotFound = () => {
  const sql = `SELECT * FROM ussadfsadfdasers`;
  return db.query(sql).then(({ rows }) => {
    return rows;
  });
};
