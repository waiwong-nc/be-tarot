import db from "../db/connection"

// GET /api/users
export const selectAllUsers = () => {
  const sql = `SELECT * FROM users`;
  return db.query(sql).then(({ rows }) => {
    return rows;
  })
};



export const selectUserByEmail = (email: string) => {
  
  const sql = `SELECT * FROM users WHERE email = $1;`;
  return db.query(sql, [email]).then(({ rows }) => {
    return rows;
  });
};


export const selectUserByEmail2 = (email: string) => {
  console.log('herere')
  const sql = `SELECT * FROM us-ers`;
  return db.query(sql).then((rows) => {
    console.log(rows, "<<< rows")
    return rows;
  })
  .catch((err) => {
    console.log(err, "<<< err")
  })
};




