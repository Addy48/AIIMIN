#!/usr/bin/env node
/**
 * Backfill Better Auth credential accounts from Supabase auth.users password hashes.
 * Run after migrate-supabase-users-to-better-auth.mjs
 */
import 'dotenv/config';
import pg from 'pg';
import { randomUUID } from 'node:crypto';

const pool = new pg.Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
});

async function main() {
    const { rows: authRows } = await pool.query(`
        SELECT u.id, u.email, au.encrypted_password, au.email_confirmed_at
        FROM public.users u
        JOIN auth.users au ON au.id = u.id
        WHERE au.encrypted_password IS NOT NULL
    `);

    let linked = 0;
    let verified = 0;

    for (const row of authRows) {
        const existing = await pool.query(
            `SELECT id FROM account WHERE "userId" = $1 AND "providerId" = 'credential'`,
            [row.id],
        );

        if (!existing.rows[0]) {
            await pool.query(
                `INSERT INTO account (id, "accountId", "providerId", "userId", password, "createdAt", "updatedAt")
                 VALUES ($1, $2, 'credential', $3, $4, NOW(), NOW())`,
                [randomUUID(), row.id, row.id, row.encrypted_password],
            );
            linked += 1;
            console.log(`[backfill] credential account: ${row.email}`);
        }

        if (row.email_confirmed_at) {
            await pool.query('UPDATE "user" SET "emailVerified" = true WHERE id = $1', [row.id]);
            verified += 1;
        }
    }

    // Google OAuth accounts from Supabase identities
    const { rows: googleRows } = await pool.query(`
        SELECT u.id, i.provider_id, i.identity_data
        FROM public.users u
        JOIN auth.identities i ON i.user_id = u.id
        WHERE i.provider = 'google'
    `);

    for (const row of googleRows) {
        const existing = await pool.query(
            `SELECT id FROM account WHERE "userId" = $1 AND "providerId" = 'google'`,
            [row.id],
        );
        if (existing.rows[0]) continue;

        const accountId = row.provider_id || row.identity_data?.sub || row.id;
        await pool.query(
            `INSERT INTO account (id, "accountId", "providerId", "userId", "createdAt", "updatedAt")
             VALUES ($1, $2, 'google', $3, NOW(), NOW())`,
            [randomUUID(), accountId, row.id],
        );
        console.log(`[backfill] google account: ${row.id}`);
    }

    console.log(`[backfill] done credentials=${linked} verified=${verified}`);
    await pool.end();
}

main().catch((err) => {
    console.error('[backfill] fatal:', err);
    process.exit(1);
});
