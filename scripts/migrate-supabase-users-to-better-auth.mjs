#!/usr/bin/env node
/**
 * Migrate existing public.users (+ optional Supabase auth.users) into Better Auth tables.
 *
 * Usage:
 *   node scripts/migrate-supabase-users-to-better-auth.mjs [--dry-run]
 *
 * Requires: DATABASE_URL, SUPABASE_SERVICE_ROLE_KEY (optional, for password hash import)
 */
import 'dotenv/config';
import pg from 'pg';
import { createClient } from '@supabase/supabase-js';
import { randomUUID } from 'node:crypto';

const dryRun = process.argv.includes('--dry-run');

const pool = new pg.Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
});

const supabase = process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY
    ? createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, {
        auth: { persistSession: false, autoRefreshToken: false },
    })
    : null;

async function listSupabaseAuthUsers() {
    if (!supabase) return new Map();
    try {
        const map = new Map();
        let page = 1;
        const perPage = 200;
        while (true) {
            const { data, error } = await supabase.auth.admin.listUsers({ page, perPage });
            if (error) throw error;
            for (const u of data.users || []) map.set(u.id, u);
            if ((data.users || []).length < perPage) break;
            page += 1;
        }
        return map;
    } catch (err) {
        console.warn('[migrate] Supabase auth list unavailable — migrating profiles without password hashes:', err.message);
        return new Map();
    }
}

async function main() {
    console.log(`[migrate] dryRun=${dryRun}`);
    const authUsers = await listSupabaseAuthUsers();
    const { rows: appUsers } = await pool.query(
        `SELECT id, email, full_name, username, onboarding_stage, created_at FROM public.users ORDER BY created_at`,
    );

    let created = 0;
    let skipped = 0;

    for (const u of appUsers) {
        const existing = await pool.query('SELECT id FROM "user" WHERE id = $1', [u.id]);
        if (existing.rows[0]) {
            skipped += 1;
            continue;
        }

        const sb = authUsers.get(u.id);
        const email = (u.email || sb?.email || '').toLowerCase();
        if (!email) {
            console.warn(`[migrate] skip ${u.id} — no email`);
            skipped += 1;
            continue;
        }

        const name = u.full_name || sb?.user_metadata?.full_name || email.split('@')[0];
        const username = (u.username || sb?.user_metadata?.username || '').toUpperCase() || null;
        const emailVerified = sb?.email_confirmed_at ? true : email.endsWith('@aiimin.com');
        const userId = u.id;

        console.log(`[migrate] ${dryRun ? 'would create' : 'creating'} ${email} (${userId})`);

        if (!dryRun) {
            try {
                await pool.query(
                    `INSERT INTO "user" (id, name, email, "emailVerified", image, "createdAt", "updatedAt", username, "displayUsername", "onboarding_stage", full_name)
                     VALUES ($1, $2, $3, $4, NULL, COALESCE($5, NOW()), NOW(), $6, $6, $7, $8)
                     ON CONFLICT (id) DO NOTHING`,
                    [userId, name, email, emailVerified, u.created_at, username, u.onboarding_stage ?? 0, name],
                );
            } catch (insertErr) {
                if (insertErr.code === '23505' && String(insertErr.detail || '').includes('username')) {
                    await pool.query(
                        `INSERT INTO "user" (id, name, email, "emailVerified", image, "createdAt", "updatedAt", username, "displayUsername", "onboarding_stage", full_name)
                         VALUES ($1, $2, $3, $4, NULL, COALESCE($5, NOW()), NOW(), NULL, NULL, $6, $7)
                         ON CONFLICT (id) DO NOTHING`,
                        [userId, name, email, emailVerified, u.created_at, u.onboarding_stage ?? 0, name],
                    );
                } else {
                    throw insertErr;
                }
            }

            if (sb?.encrypted_password) {
                await pool.query(
                    `INSERT INTO account (id, "accountId", "providerId", "userId", password, "createdAt", "updatedAt")
                     VALUES ($1, $2, 'credential', $3, $4, NOW(), NOW())
                     ON CONFLICT DO NOTHING`,
                    [randomUUID(), userId, userId, sb.encrypted_password],
                );
            }
        }
        created += 1;
    }

    console.log(`[migrate] done created=${created} skipped=${skipped}`);
    await pool.end();
}

main().catch((err) => {
    console.error('[migrate] fatal:', err);
    process.exit(1);
});
