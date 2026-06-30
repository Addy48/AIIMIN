import { Pool } from 'pg';
import { getDatabaseUrl } from '../scripts/lib/load-env.mjs';

const pool = new Pool({
    connectionString: getDatabaseUrl(),
    ssl: { rejectUnauthorized: false },
});

async function createTables() {
    try {
        await pool.query(`
            CREATE TABLE IF NOT EXISTS public.family_finance (
                id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
                member_id UUID REFERENCES public.family_members(id) ON DELETE SET NULL,
                account_type TEXT NOT NULL,
                institution_name TEXT NOT NULL,
                account_number TEXT,
                current_balance NUMERIC,
                notes TEXT,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
            );
        `);
        console.log('Created family_finance table');
        await pool.end();
        process.exit(0);
    } catch (err) {
        console.error('Error creating tables:', err);
        await pool.end();
        process.exit(1);
    }
}

createTables();
