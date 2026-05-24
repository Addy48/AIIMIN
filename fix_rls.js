import dotenv from 'dotenv';
dotenv.config({ path: './.env' });
import pg from 'pg';
const { Pool } = pg;
const pool = new Pool({ connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false } });
async function main() {
  try {
    await pool.query('ALTER TABLE users DISABLE ROW LEVEL SECURITY;');
    console.log("RLS disabled for users table.");
  } catch(e) {
    console.error("Error:", e.message);
  }
  process.exit(0);
}
main();
