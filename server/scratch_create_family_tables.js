import { Pool } from 'pg';

const pool = new Pool({
    connectionString: 'postgresql://REDACTED:REDACTED@db.REDACTED.supabase.co:6543/postgres',
    ssl: { rejectUnauthorized: false }
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

        await pool.query(`
            CREATE TABLE IF NOT EXISTS public.family_relationships (
                id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
                name TEXT NOT NULL,
                relation_type TEXT NOT NULL,
                anniversary_date DATE,
                birthday DATE,
                last_contacted DATE,
                notes TEXT,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
            );
        `);
        console.log('Created family_relationships table');

        process.exit(0);
    } catch (err) {
        console.error('Error creating tables:', err);
        process.exit(1);
    }
}

createTables();
