import * as dotenv from 'dotenv';
dotenv.config();
import { pool } from './server/lib/db.js';

async function test() {
  try {
    const { rows } = await pool.query('SELECT id, email FROM users LIMIT 1');
    console.log("Pool data:", rows);
  } catch (e) {
    console.log("Pool error:", e);
  }
}
test();
