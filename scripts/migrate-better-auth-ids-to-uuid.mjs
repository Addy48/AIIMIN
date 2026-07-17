#!/usr/bin/env node
/**
 * One-time: remap legacy Better Auth text user ids → UUID for public.users compatibility.
 * Invalidates existing sessions (users must sign in again).
 */
import { pool } from '../server/lib/db.js';
import { isUuid, resolvePublicUserId } from '../server/lib/resolvePublicUserId.js';

const { rows } = await pool.query('SELECT id, email, name, username FROM "user" ORDER BY "createdAt" ASC');

if (!rows.length) {
    console.log('No Better Auth users found.');
    process.exit(0);
}

let migrated = 0;
for (const user of rows) {
    if (isUuid(user.id)) {
        await resolvePublicUserId(pool, user);
        console.log(`✓ ${user.email} already UUID`);
        continue;
    }
    const publicId = await resolvePublicUserId(pool, user);
    console.log(`✓ ${user.email}: ${user.id} → ${publicId}`);
    migrated += 1;
}

console.log(`\nDone. Migrated ${migrated} user(s). Ask testers to sign in again.`);
