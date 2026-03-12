import { Pool } from 'pg';

const pool = new Pool({
    connectionString: 'postgresql://REDACTED:REDACTED@db.REDACTED.supabase.co:6543/postgres'
});

async function createTables() {
    try {
        await pool.query(`
            CREATE TABLE IF NOT EXISTS public.oauth_states (
                state TEXT PRIMARY KEY,
                user_id UUID NOT NULL,
                is_login BOOLEAN NOT NULL DEFAULT false,
                expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
            );
        `);
        console.log('Created oauth_states table');

        await pool.query(`
            CREATE TABLE IF NOT EXISTS public.user_oauth_tokens (
                user_id UUID PRIMARY KEY REFERENCES public.users(id) ON DELETE CASCADE,
                provider TEXT NOT NULL,
                access_token TEXT,
                access_token_enc TEXT,
                refresh_token TEXT,
                refresh_token_enc TEXT,
                expires_at TIMESTAMP WITH TIME ZONE,
                scope TEXT,
                updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
            );
        `);
        console.log('Created user_oauth_tokens table');

        await pool.query(`
            CREATE TABLE IF NOT EXISTS public.sports_cache (
                key TEXT PRIMARY KEY,
                data JSONB NOT NULL,
                updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
            );
        `);
        console.log('Created sports_cache table');

        process.exit(0);
    } catch (err) {
        console.error('Error creating tables:', err);
        process.exit(1);
    }
}

createTables();
