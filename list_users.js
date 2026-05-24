import dotenv from 'dotenv';
dotenv.config({ path: './.env' });
import pg from 'pg';
const { Pool } = pg;
const pool = new Pool({ connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false } });
async function main() {
  const { rows } = await pool.query("SELECT id, email, username FROM users");
  console.log('Users:', rows);
  process.exit(0);
}
main().catch(console.error);
