/**
 * Apply migration 026 (email_logs, billing columns, last_seen).
 * Usage: node scripts/run-migration-026.mjs
 * Requires DATABASE_URL in .env
 */
import pg from 'pg';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '..', '.env') });

const { Pool } = pg;
const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  console.error('DATABASE_URL not set');
  process.exit(1);
}

const sql = fs.readFileSync(
  path.join(__dirname, '..', 'server', 'migrations', '026_email_billing_columns.sql'),
  'utf8',
);

const pool = new Pool({ connectionString, ssl: { rejectUnauthorized: false } });
const client = await pool.connect();

try {
  await client.query(sql);
  console.log('✅ Migration 026 applied');

  const checks = await client.query(`
    SELECT
      EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'email_logs') AS email_logs,
      EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'last_seen') AS last_seen,
      EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'user_profiles' AND column_name = 'subscription_tier') AS subscription_tier
  `);
  console.log('Verification:', checks.rows[0]);
} catch (err) {
  console.error('❌ Migration failed:', err.message);
  process.exit(1);
} finally {
  client.release();
  await pool.end();
}
