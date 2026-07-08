import { pool } from './db.js';
import { auth } from './auth.js';
import { getCookie } from 'hono/cookie';
import { isUuid } from './resolvePublicUserId.js';

export { isUuid };

/**
 * Resolve Better Auth session from bearer token or cookie (server-side).
 * auth.api.getSession does not run the bearer plugin — lookup session row directly.
 */
export async function lookupSessionByToken(token) {
    if (!token) return null;

    const { rows } = await pool.query(
        `SELECT s.id AS session_id, s."userId", s.token, s."expiresAt",
                u.id AS user_id, u.email, u.name, u."emailVerified" AS email_verified,
                u.username, u."onboarding_stage"
         FROM "session" s
         INNER JOIN "user" u ON u.id = s."userId"
         WHERE s.token = $1
         LIMIT 1`,
        [token],
    );

    const row = rows[0];
    if (!row) return null;
    if (row.expiresAt && new Date(row.expiresAt) < new Date()) return null;

    return {
        user: {
            id: row.user_id,
            email: row.email,
            name: row.name,
            emailVerified: row.email_verified,
            username: row.username,
            onboardingStage: row.onboarding_stage,
            onboarding_stage: row.onboarding_stage,
        },
        session: {
            id: row.session_id,
            userId: row.userId,
            token: row.token,
        },
    };
}

export async function resolveAuthSession(c) {
    let token = getCookie(c, 'better-auth.session_token')
        || getCookie(c, '__Secure-better-auth.session_token');

    if (!token) {
        const authHeader = c.req.header('authorization');
        if (authHeader?.startsWith('Bearer ')) token = authHeader.slice(7).trim();
    }
    if (!token) token = c.req.query('token');

    if (token) {
        const direct = await lookupSessionByToken(token);
        if (direct?.user?.id) return direct;
    }

    try {
        const headers = new Headers(c.req.raw.headers);
        if (token && !headers.get('authorization')) {
            headers.set('authorization', `Bearer ${token}`);
        }
        const apiSession = await auth.api.getSession({ headers });
        const userId = apiSession?.user?.id;
        if (apiSession?.user && isUuid(userId)) return apiSession;
        if (apiSession?.session?.userId && isUuid(apiSession.session.userId)) {
            return lookupSessionByToken(apiSession.session.token || token);
        }
    } catch (err) {
        console.warn('[sessionResolve] getSession fallback failed:', err.message);
    }

    return null;
}
