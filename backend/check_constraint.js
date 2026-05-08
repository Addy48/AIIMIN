import pg from 'pg';
import dotenv from 'dotenv';

const { Pool } = pg;
dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function check() {
  try {
    const res = await pool.query(`
      SELECT 
        ccu.column_name,
        tc.constraint_name, 
        cc.check_clause
      FROM 
        information_schema.table_constraints tc 
        JOIN information_schema.constraint_column_usage ccu ON tc.constraint_name = ccu.constraint_name 
        JOIN information_schema.check_constraints cc ON tc.constraint_name = cc.constraint_name
      WHERE 
        tc.table_name = 'money_transactions';
    `);
    console.log('Constraints on money_transactions:');
    res.rows.forEach(r => console.log(`Column: ${r.column_name} | Constraint: ${r.constraint_name} | Clause: ${r.check_clause}`));
  } catch (err) {
    console.error('Error:', err);
  } finally {
    await pool.end();
  }
}

check();
