import { pool } from '../lib/db.js';
import * as dotenv from 'dotenv';
import { ensureUserProfile } from '../services/userProfileService.js';
import { isUuid, resolvePublicUserId } from '../lib/resolvePublicUserId.js';
import { resolveAuthSession } from '../lib/sessionResolve.js';

dotenv.config();

const profileCache = new Map();
const CACHE_TTL_MS = 10_000;

setInterval(() => {
    const now = Date.now();
    for (const [key, entry] of profileCache.entries()) {
        if (now - entry.timestamp > CACHE_TTL_MS) {
            profileCache.delete(key);
        }
    }
}, 60_000);

export const requireAuth = async (c, next) => {
    if (process.env.NODE_ENV !== 'production' && c.req.header('authorization') === 'Bearer mock-test-token') {
        c.set('user', { id: '88888888-8888-4888-8888-888888888888', email: 'dev@aiimin.in', role: 'user', onboarding_stage: 1, username: 'DEVUSER' });
        c.set('userId', '88888888-8888-4888-8888-888888888888');
        return await next();
    }

    let sessionResult;
    try {
        sessionResult = await resolveAuthSession(c);
    } catch (err) {
        console.error('[auth] session resolve error:', err.message);
        return c.json({ error: 'Unauthorized: session error' }, 401);
    }

    const user = sessionResult?.user;
    const session = sessionResult?.session;
    const authUserId = user?.id;

    if (!authUserId || !user?.email) {
        return c.json({ error: 'Unauthorized: invalid or expired token' }, 401);
    }

    let userId;
    try {
        userId = await resolvePublicUserId(pool, user);
    } catch (err) {
        console.error('[auth] public user resolve error:', err.message);
        return c.json({ error: 'Unauthorized: session error' }, 401);
    }

    if (!userId || !isUuid(userId)) {
        return c.json({ error: 'Unauthorized: invalid or expired token' }, 401);
    }

    try {
        const now = Date.now();
        let cached = profileCache.get(userId);

        if (!cached || (now - cached.timestamp > CACHE_TTL_MS)) {
            const { rows } = await pool.query(
                'SELECT role, onboarding_stage, username, email, full_name FROM users WHERE id = $1',
                [userId],
            );

            if (rows.length > 0) {
                cached = { ...rows[0], timestamp: now };
                profileCache.set(userId, cached);
            } else {
                const profile = await ensureUserProfile(pool, {
                    id: userId,
                    email: user.email,
                    user_metadata: {
                        full_name: user.name || user.fullName || '',
                        username: user.username || user.displayUsername || '',
                    },
                });
                cached = {
                    role: profile.role,
                    onboarding_stage: profile.onboarding_stage,
                    username: profile.username,
                    email: profile.email,
                    full_name: profile.full_name,
                    timestamp: now,
                };
                profileCache.set(userId, cached);
            }
        }

        c.set('user', {
            id: userId,
            email: user.email || cached?.email,
            name: user.name,
            role: cached?.role || 'user',
            onboarding_stage: cached?.onboarding_stage ?? user.onboardingStage ?? user.onboarding_stage ?? 0,
            username: cached?.username || user.username || user.displayUsername,
            full_name: cached?.full_name || user.name || user.fullName,
            emailVerified: user.emailVerified,
        });
        c.set('userId', userId);
        c.set('authSession', session);
    } catch (err) {
        console.error('[auth middleware] Error:', err.message);
        return c.json({ error: 'Unauthorized: session error', details: err.message }, 401);
    }

    await next();
};
