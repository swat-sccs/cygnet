import mysql from 'mysql2/promise'

const host = process.env.DB_HOST;
const user = process.env.DB_USER;
const password = process.env.DB_PASS;
const db = process.env.DB_NAME;

const dbConfig = {
  host: host,
  user: user,
  password: password,
  database: db,
  port: 3306,
};

console.time("dbcreate")
export var pool = mysql.createPool(
    dbConfig
);
console.timeEnd("dbcreate")
