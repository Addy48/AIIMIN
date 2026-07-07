#!/usr/bin/env node
/**
 * Remove all rows from waitlist_emails.
 * Usage: node scripts/clear-waitlist.mjs
 */
import dotenv from 'dotenv';
import { pool } from '../server/lib/db.js';

dotenv.config();

const { rows, rowCount } = await pool.query(
  'DELETE FROM waitlist_emails RETURNING email, reserved_username',
);
console.log(`Removed ${rowCount} waitlist signup(s).`);
if (rows.length) {
  rows.forEach((r) => console.log(`  - ${r.email}${r.reserved_username ? ` (@${r.reserved_username})` : ''}`));
}
await pool.end();
