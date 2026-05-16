import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { pool } from '../lib/db.js';

// Load .env variables
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../.env') });

const runMigration = async () => {
  try {
    const migrationPath = path.join(__dirname, '../migrations/024_sports_cache.sql');
    console.log(`[Migration] Reading migration from: ${migrationPath}`);
    const sql = fs.readFileSync(migrationPath, 'utf8');
    
    console.log('[Migration] Running SQL query on database...');
    await pool.query(sql);
    console.log('[Migration] Successfully created sports_cache table and index.');
  } catch (err) {
    console.error('[Migration] Failed to run migration:', err);
    process.exit(1);
  } finally {
    // End the pool connection
    const activePool = pool.end ? pool : null;
    if (activePool) {
      await activePool.end();
    }
    process.exit(0);
  }
};

runMigration();
