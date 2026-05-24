import dotenv from 'dotenv';
dotenv.config({ path: './.env' });
import pg from 'pg';
const { Pool } = pg;
const pool = new Pool({ connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false } });
async function main() {
  const { rows } = await pool.query("UPDATE users SET username = 'AU48' WHERE email = 'aadityaupadhyay10@gmail.com' RETURNING *");
  console.log('Updated user:', rows[0]);
  process.exit(0);
}
main().catch(console.error);
