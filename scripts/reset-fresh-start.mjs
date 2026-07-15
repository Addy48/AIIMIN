#!/usr/bin/env node
/**
 * Fresh start: wipe users, Better Auth, waitlist — keep tester_allowlist (re-seeded from env).
 *
 * Usage:
 *   node scripts/reset-fresh-start.mjs --confirm
 */
import 'dotenv/config';
import pg from 'pg';
import { spawn } from 'node:child_process';

const pool = new pg.Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
});

const confirm = process.argv.includes('--confirm');

async function run(client, label, sql) {
    console.log(`[reset] ${label}`);
    await client.query(sql);
}

async function main() {
    if (!confirm) {
        console.error('Refusing to run without --confirm');
        console.error('  node scripts/reset-fresh-start.mjs --confirm');
        process.exit(1);
    }

    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        // Better Auth tables
        await run(client, 'Better Auth sessions', 'DELETE FROM session');
        await run(client, 'Better Auth accounts', 'DELETE FROM account');
        await run(client, 'Better Auth verifications', 'DELETE FROM verification');
        await run(client, 'Better Auth 2FA', 'DELETE FROM "twoFactor"');
        await run(client, 'Better Auth users', 'DELETE FROM "user"');

        // OAuth integration state
        await run(client, 'oauth_states', 'DELETE FROM oauth_states');
        await run(client, 'user_oauth_tokens', 'DELETE FROM user_oauth_tokens');

        // Waitlist (signups only — not tester allowlist)
        await run(client, 'waitlist_emails', 'DELETE FROM waitlist_emails');
        try {
            await client.query('DELETE FROM waitlist_feedback');
        } catch (_) { /* table may not exist */ }

        // App users (CASCADE deletes logs, calendar, habits, etc.)
        await run(client, 'public.users (+ cascaded app data)', 'DELETE FROM public.users');

        try {
            await client.query('DELETE FROM auth.sessions');
            await client.query('DELETE FROM auth.refresh_tokens');
            await client.query('DELETE FROM auth.identities');
            await client.query('DELETE FROM auth.users');
            console.log('[reset] legacy Supabase auth.users cleared');
        } catch (err) {
            console.warn('[reset] auth schema skip:', err.message);
        }

        await client.query('COMMIT');
        console.log('[reset] database wipe complete');
    } catch (err) {
        await client.query('ROLLBACK');
        throw err;
    } finally {
        client.release();
        await pool.end();
    }

    // Re-seed tester/dev allowlist from .env
    await new Promise((resolve, reject) => {
        const child = spawn('node', ['scripts/seed-access-allowlist.mjs'], {
            stdio: 'inherit',
            cwd: process.cwd(),
            env: process.env,
        });
        child.on('exit', (code) => (code === 0 ? resolve() : reject(new Error(`seed exit ${code}`))));
    });

    console.log('[reset] done — fresh start. tester_allowlist preserved/re-seeded from DEV_EMAILS + TESTER_EMAILS');
}

main().catch((err) => {
    console.error('[reset] fatal:', err);
    process.exit(1);
});
