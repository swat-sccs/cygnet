import mysql from 'mysql2/promise';
// const host = process.env.DB_HOST;
// const user = process.env.DB_USER;
// const password = process.env.DB_PASS;
// const db = process.env.DB_NAME;
// const table = process.env.DB_TABLE;
// const dbConfig = {
//   host: host,
//   user: user,
//   passwd: password,
//   db: db,
//   port: 3306,
// };

// FOR LOCAL DEV
const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: 'securepassword',
  database: 'its_cygnet',
};

export async function queryDb(query : string ) {
  try {
    const db = await mysql.createConnection(dbConfig);
    const [rows] = await db.query(query);
    return rows;
  }
  catch (e) {
    console.log(e);
    return e;
  }
}

