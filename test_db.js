import pg from 'pg';
const { Pool } = pg;
const pool = new Pool({
  connectionString: "postgresql://REDACTED:REDACTED@ep-REDACTED.aws.neon.tech/neondb?sslmode=require",
  ssl: { rejectUnauthorized: false }
});
console.log('Connecting...');
pool.query('SELECT NOW()').then(res => {
  console.log('Success:', res.rows[0]);
  process.exit(0);
}).catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
