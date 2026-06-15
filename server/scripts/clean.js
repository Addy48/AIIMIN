import pkg from 'pg';
const { Pool } = pkg;
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../../.env') });

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

const USER_ID = '9539352e-ec5f-4091-a18d-f5e02796e680';

async function clean() {
  try {
    await pool.query('DELETE FROM habit_logs WHERE user_id = $1', [USER_ID]);
    await pool.query('DELETE FROM habits WHERE user_id = $1', [USER_ID]);
    await pool.query('DELETE FROM goals WHERE user_id = $1', [USER_ID]);
    await pool.query('DELETE FROM notes WHERE user_id = $1', [USER_ID]);
    console.log('All fake data cleared for user');
  } catch(e) {
    console.error(e);
  } finally {
    pool.end();
  }
}
clean();
