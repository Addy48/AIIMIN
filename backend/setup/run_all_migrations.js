import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import pg from 'pg';

const { Pool } = pg;

// Load .env variables
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../.env') });

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  console.error('[Error] DATABASE_URL is not set in .env file');
  process.exit(1);
}

const pool = new Pool({
  connectionString,
  ssl: { rejectUnauthorized: false }
});

const runAllMigrations = async () => {
  const migrationsDir = path.join(__dirname, '../migrations');
  console.log(`[Migrations] Scanning directory: ${migrationsDir}`);

  try {
    const files = fs.readdirSync(migrationsDir)
      .filter(file => file.endsWith('.sql'))
      .sort(); // Sort to ensure alphabetical/numerical execution order

    console.log(`[Migrations] Found ${files.length} migration files to process.`);

    for (const file of files) {
      const filePath = path.join(migrationsDir, file);
      console.log(`\n--------------------------------------------------`);
      console.log(`[Migrations] Executing: ${file}`);
      console.log(`--------------------------------------------------`);
      
      const sql = fs.readFileSync(filePath, 'utf8');
      
      // We can run each migration file
      const startTime = Date.now();
      await pool.query(sql);
      const duration = Date.now() - startTime;
      
      console.log(`[Migrations] SUCCESS: ${file} completed in ${duration}ms`);
    }

    console.log(`\n==================================================`);
    console.log(`[Migrations] All ${files.length} migrations applied successfully!`);
    console.log(`==================================================`);
  } catch (err) {
    console.error(`\n[Migrations] ERROR applying migration:`, err);
    process.exit(1);
  } finally {
    await pool.end();
    process.exit(0);
  }
};

runAllMigrations();
