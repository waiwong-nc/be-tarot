import db from "../db/connection"

// GET /api/users
export const selectAllUsers = () => {
  const sql = `SELECT * FROM users`;
  return db.query(sql).then(({ rows }) => {
    //   console.log(rows)
    return rows;
  }).catch(err => console.log(err));
};


