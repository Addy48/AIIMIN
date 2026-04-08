import pg from 'pg';
import dotenv from 'dotenv';
dotenv.config();

const { Pool } = pg;
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

const run = async () => {
    try {
        console.log('Connecting to Supabase PostgreSQL...');
        const res = await pool.query(`
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'public'
            ORDER BY table_name;
        `);
        console.log('Existing public tables:');
        const tables = res.rows.map(r => r.table_name);
        console.log(tables);

        // Check if wealth_assets table exists, if not, create it
        if (!tables.includes('wealth_assets')) {
            console.log('wealth_assets table is missing. Creating it now...');
            await pool.query(`
                CREATE TABLE IF NOT EXISTS public.wealth_assets (
                    id             UUID DEFAULT gen_random_uuid() PRIMARY KEY,
                    user_id        UUID REFERENCES public.users(id) ON DELETE CASCADE,
                    asset_name     TEXT NOT NULL,
                    asset_type     TEXT NOT NULL,
                    units          NUMERIC(20, 8) DEFAULT 0,
                    current_value  NUMERIC(15, 2) DEFAULT 0,
                    invested_value NUMERIC(15, 2) DEFAULT 0,
                    created_at     TIMESTAMPTZ DEFAULT NOW(),
                    updated_at     TIMESTAMPTZ DEFAULT NOW()
                );
                ALTER TABLE public.wealth_assets ENABLE ROW LEVEL SECURITY;
                CREATE INDEX IF NOT EXISTS idx_wealth_assets_user ON public.wealth_assets(user_id);
                GRANT SELECT, INSERT, UPDATE, DELETE ON public.wealth_assets TO authenticated;
                GRANT ALL ON public.wealth_assets TO service_role;
            `);
            console.log('wealth_assets table created successfully.');
        } else {
            console.log('wealth_assets table exists.');
        }
    } catch (err) {
        console.error('Error checking/creating tables:', err);
    } finally {
        await pool.end();
    }
};

run();
