import pg from 'pg';
import { getDatabaseUrl } from '../scripts/lib/load-env.mjs';

const pool = new pg.Pool({
    connectionString: getDatabaseUrl(),
    ssl: { rejectUnauthorized: false },
});

async function migrate() {
    try {
        await pool.query('ALTER TABLE goals ADD COLUMN IF NOT EXISTS meta JSONB DEFAULT \'{}\'::jsonb;');
        console.log('Added meta to goals');
        await pool.query('ALTER TABLE habits ADD COLUMN IF NOT EXISTS meta JSONB DEFAULT \'{}\'::jsonb;');
        console.log('Added meta to habits');
        await pool.end();
        process.exit(0);
    } catch (err) {
        console.error(err);
        await pool.end();
        process.exit(1);
    }
}
migrate();
