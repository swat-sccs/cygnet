import mysql from 'mysql2/promise';
import { Pool } from 'mysql2/typings/mysql/lib/Pool';
import { resolve } from 'path';
import { pool } from './createDb';

export async function queryDb(query : string ) {
  const connection = await pool.getConnection();
  const [rows, fields] = await connection.query(query);
  connection.release();
  return rows;
}
