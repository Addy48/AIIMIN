#!/usr/bin/env node
/**
 * Read-only sign-in diagnosis for one OS-ID. Prints yes/no facts only:
 * never an email address, a PIN, or a hash.
 *
 *   node scripts/diagnose-signin.mjs AADI0837
 *
 * Checks every step the website and the app take when signing in with OS-ID + PIN:
 *   1. /auth/resolve looks the OS-ID up in public.users, then in the auth "user" table
 *   2. sign-in by email looks the email up in the auth "user" table
 *   3. the credential account must hold a Better Auth (scrypt) hash; an old Supabase
 *      bcrypt hash ("$2a$…") cannot be verified
 *   4. the email must be verified (requireEmailVerification is on)
 *   5. the sign-in rate limit is 30 tries per 15 minutes
 */
import { getPool } from '../server/lib/db.js';

const osId = String(process.argv[2] || '').trim().toUpperCase();
if (!osId) {
    console.error('Usage: node scripts/diagnose-signin.mjs <OS-ID>');
    process.exit(1);
}

const yes = (v) => (v ? 'yes' : 'NO');
const pool = getPool();

try {
    const { rows: profile } = await pool.query(
        'SELECT id, email FROM public.users WHERE UPPER(TRIM(username)) = $1',
        [osId],
    );
    const { rows: authUsers } = await pool.query(
        'SELECT id, email, username, "emailVerified" FROM public."user" WHERE UPPER(TRIM(username)) = $1',
        [osId],
    );

    console.log(`OS-ID ${osId}`);
    console.log(`- profile rows (public.users): ${profile.length}`);
    console.log(`- auth rows ("user"): ${authUsers.length}`);

    const authUser = authUsers[0];
    if (!authUser) {
        console.log('=> No auth user has this OS-ID. Sign-in can never succeed.');
        process.exit(0);
    }

    const resolvedEmail = (profile[0]?.email || authUser.email || '').toLowerCase();
    const authEmail = (authUser.email || '').toLowerCase();
    console.log(`- stored username casing: ${authUser.username === authUser.username.toLowerCase() ? 'lowercase' : 'UPPERCASE/mixed'}`);
    console.log(`- /auth/resolve email matches the auth email: ${yes(resolvedEmail === authEmail)}`);
    console.log(`- profile id matches auth id: ${profile[0] ? yes(profile[0].id === authUser.id) : 'n/a'}`);
    console.log(`- email verified: ${yes(authUser.emailVerified)}`);

    const { rows: accounts } = await pool.query(
        `SELECT "providerId", password FROM account WHERE "userId" = $1`,
        [authUser.id],
    );
    const credential = accounts.find((a) => a.providerId === 'credential');
    console.log(`- sign-in methods: ${accounts.map((a) => a.providerId).join(', ') || 'none'}`);
    console.log(`- has a PIN (credential account): ${yes(credential?.password)}`);
    if (credential?.password) {
        const kind = credential.password.startsWith('$2') ? 'old Supabase bcrypt (cannot verify)' : 'Better Auth scrypt';
        console.log(`- PIN hash kind: ${kind}`);
    }

    const { rows: limits } = await pool.query(
        `SELECT key, count, "lastRequest" FROM "rateLimit" WHERE key LIKE '%sign-in%' ORDER BY "lastRequest" DESC LIMIT 5`,
    ).catch(() => ({ rows: [] }));
    const recentWindow = Date.now() - 15 * 60 * 1000;
    const hot = limits.filter((l) => Number(l.lastRequest) > recentWindow && Number(l.count) >= 30);
    console.log(`- sign-in rate limit hit in the last 15 min (any IP): ${hot.length ? 'YES' : 'no'}`);
} finally {
    await pool.end();
}
