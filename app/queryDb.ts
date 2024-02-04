import { pool } from './createDb';

export async function queryDb(query : string ) {
  const connection = await pool.getConnection();
  const [rows, fields] = await connection.query(query);
  connection.release();
  return rows;
}
