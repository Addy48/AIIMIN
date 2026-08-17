import pg from 'pg';
import * as dotenv from 'dotenv';
dotenv.config({ path: '/Users/aaditya/Desktop/DASHBOARD PROJECT/.env.local' });

const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function run() {
  try {
    const res = await pool.query("SELECT id, os_id, username, full_name FROM users WHERE os_id = 'AADU0000'");
    console.log("Users:", res.rows);
  } catch (err) {
    console.error(err);
  } finally {
    await pool.end();
  }
}

run();
