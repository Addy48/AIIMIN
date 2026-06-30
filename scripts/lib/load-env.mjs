/**
 * Load root .env files for one-off scripts (never commit secrets).
 */
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '../..');

dotenv.config({ path: path.join(root, '.env') });
dotenv.config({ path: path.join(root, '.env.local'), override: true });

export function requireEnv(name) {
  const value = process.env[name];
  if (!value) {
    console.error(`[env] ${name} is required. Set it in .env at the project root.`);
    process.exit(1);
  }
  return value;
}

export function getDatabaseUrl() {
  return requireEnv('DATABASE_URL');
}
