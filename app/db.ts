import mysql from 'mysql2/promise';

const host = process.env.DB_HOST;
const user = process.env.DB_USER;
const password = process.env.DB_PASS;
const db = process.env.DB_NAME


const dbConfig = {
  host: host,
  user: user,
  password: password,
  database: db,
};

//FOR LOCAL DEV
// const dbConfig = {
//   host: 'localhost',
//   user: 'root',
//   password: 'password',
//   database: 'its_cygnet',
// };

export const connectToDatabase = async () => {
  const connection = await mysql.createConnection(dbConfig);
  return connection;
};