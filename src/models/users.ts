import db from "../db/connection"

// GET /api/users
export const selectAllUsers = () => {
  const sql = `SELECT * FROM users`;
  return db.query(sql).then(({ rows }) => {
    return rows;
  })
};


