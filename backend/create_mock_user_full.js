import pg from 'pg';
import dotenv from 'dotenv';

const { Pool } = pg;
dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function run() {
  const userId = '88888888-8888-4888-8888-888888888888';
  const email = 'aadityaupadhyay10@gmail.com';
  const username = 'aaditya';
  const fullName = 'Aaditya Upadhyay';

  try {
    console.log('Checking if user already exists...');
    const checkRes = await pool.query('SELECT id FROM public.users WHERE id = $1', [userId]);
    
    if (checkRes.rows.length > 0) {
      console.log('User already exists in public.users!');
      return;
    }

    console.log('Inserting mock user...');
    await pool.query(
      `INSERT INTO public.users (id, email, username, full_name, role, onboarding_stage)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [userId, email, username, fullName, 'user', 1]
    );
    console.log('Successfully created mock user in public.users!');
  } catch (err) {
    console.error('Error creating mock user:', err);
  } finally {
    await pool.end();
  }
}

run();
