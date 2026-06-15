import pg from 'pg';

const pool = new pg.Pool({
    connectionString: 'postgresql://REDACTED:REDACTED@db.REDACTED.supabase.co:6543/postgres'
});

async function migrate() {
    try {
        await pool.query('ALTER TABLE goals ADD COLUMN IF NOT EXISTS meta JSONB DEFAULT \'{}\'::jsonb;');
        console.log('Added meta to goals');
        await pool.query('ALTER TABLE habits ADD COLUMN IF NOT EXISTS meta JSONB DEFAULT \'{}\'::jsonb;');
        console.log('Added meta to habits');
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}
migrate();
