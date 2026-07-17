import { randomUUID } from 'crypto';
import { ensureUserProfile } from '../services/userProfileService.js';

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export function isUuid(value) {
    return typeof value === 'string' && UUID_RE.test(value);
}

/**
 * Better Auth pre-UUID users have text ids. public.users requires UUID.
 * Remap legacy ids to UUID (by email) and sync profile row.
 */
export async function resolvePublicUserId(pool, authUser) {
    const authId = authUser?.id;
    const email = authUser?.email?.toLowerCase?.();
    if (!authId || !email) return null;

    if (isUuid(authId)) {
        await ensureUserProfile(pool, {
            id: authId,
            email,
            user_metadata: {
                full_name: authUser.name || authUser.fullName || authUser.full_name || '',
                username: authUser.username || authUser.displayUsername || '',
            },
        }).catch((err) => {
            console.warn('[resolvePublicUserId] ensure profile:', err.message);
        });
        return authId;
    }

    const byEmail = await pool.query('SELECT id FROM public.users WHERE email = $1 LIMIT 1', [email]);
    if (byEmail.rows[0]?.id) {
        return byEmail.rows[0].id;
    }

    const newId = randomUUID();
    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        const { rows: legacyUsers } = await client.query('SELECT * FROM "user" WHERE id = $1 LIMIT 1', [authId]);
        if (!legacyUsers[0]) {
            await client.query('ROLLBACK');
            return null;
        }

        await client.query('DELETE FROM "session" WHERE "userId" = $1', [authId]);
        await client.query('DELETE FROM "account" WHERE "userId" = $1', [authId]);
        await client.query('DELETE FROM "twoFactor" WHERE "userId" = $1', [authId]);
        await client.query('UPDATE "user" SET id = $1 WHERE id = $2', [newId, authId]);

        await client.query('COMMIT');

        const legacy = legacyUsers[0];
        await ensureUserProfile(pool, {
            id: newId,
            email,
            user_metadata: {
                full_name: legacy.name || legacy.full_name || '',
                username: legacy.username || legacy.displayUsername || '',
            },
        });

        console.log(`[resolvePublicUserId] migrated Better Auth user ${authId} → ${newId} (${email}) — re-login required`);
        return newId;
    } catch (err) {
        await client.query('ROLLBACK');
        throw err;
    } finally {
        client.release();
    }
}
