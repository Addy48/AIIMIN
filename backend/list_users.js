import pg from 'pg';
import dotenv from 'dotenv';

const { Pool } = pg;
dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function listUsers() {
  try {
    const res = await pool.query('SELECT id, email, username FROM public.users LIMIT 10');
    console.log('Users in database:');
    res.rows.forEach(r => console.log(` - ID: ${r.id} | Email: ${r.email} | Username: ${r.username}`));
  } catch (err) {
    console.error('Error fetching users:', err);
  } finally {
    await pool.end();
  }
}

listUsers();
