import db from "../db/connection";

export const createUser = (username:string, email:string, password:string) => {
    
    const sql = `INSERT INTO users (user_name, email, password) VALUES ($1,$2,$3) RETURNING *`;
    return db.query(sql, [username, email, password])
    .then(({ rows}) => {
        return rows[0];
    })
}



export const selectLatestUsesr = () => {
    const sql = `SELECT * FROM users ORDER BY user_id DESC LIMIT 1`
    return db.query(sql)
    .then(({ rows}) => {
        return rows;
    })
}

export const createPendingUser = (
  username: string,
  password: string,
  email: string,
  code: number,
) => {
    const sql = `INSERT INTO pending_users ( user_name, email, password, code)
                VALUES ($1, $2, $3, $4) RETURNING *;`

   return  db.query(sql, [username, email,password, code]).then(({rows}) => {    
    return rows[0].user_id;
    })
};

export const selectPendingUser = (id:number) => {
    const sql = `SELECT * from pending_users WHERE user_id = $1;`;
    return db.query(sql, [id]).then(({ rows }) => {
    return rows[0];
});
}

export const deletePendingUser = (id: number) => {
  const sql = `DELETE FROM pending_users WHERE user_id = $1;`;
  return db.query(sql, [id]);
};



export const getCode = (pendingUserId:number) => {
const sql = `SELECT * from pending_users WHERE user_id = $1;`;
return db.query(sql, [pendingUserId]).then(({ rows }) => {
    return rows[0].code;
});
}