import pkg from 'pg';
const { Pool } = pkg;
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, 'backend', '.env') }); // It was originally in backend/.env

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function main() {
  try {
    await pool.query('ALTER TABLE users ADD COLUMN password_hash VARCHAR;');
    console.log('Added password_hash column.');
  } catch (err) {
    if (err.code === '42701') {
      console.log('Column password_hash already exists.');
    } else {
      console.error(err);
    }
  }
  process.exit(0);
}
main();
