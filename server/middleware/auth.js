import { pool } from '../lib/db.js';
import { getCookie } from 'hono/cookie';
import * as dotenv from 'dotenv';
import { getSupabaseAdmin } from '../lib/supabaseAdmin.js';
import { ensureUserProfile } from '../services/userProfileService.js';
dotenv.config({ path: '/Users/aaditya/Desktop/DASHBOARD PROJECT/.env' });

const COOKIE_NAME = 'aiimin_session';

// Profile cache
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
    let token = getCookie(c, COOKIE_NAME);
    if (!token) {
        const authHeader = c.req.header('authorization');
        if (authHeader?.startsWith('Bearer ')) token = authHeader.slice(7);
    }
    if (!token) {
        token = c.req.query('token');
    }

    if (!token) {
        return c.json({ error: 'Unauthorized: missing token' }, 401);
    }

    if (process.env.NODE_ENV !== 'production' && token === 'mock-test-token') {
        c.set('user', { id: '88888888-8888-4888-8888-888888888888', email: 'dev@aiimin.in', role: 'user', onboarding_stage: 1, username: 'DEVUSER' });
        c.set('userId', '88888888-8888-4888-8888-888888888888');
        return await next();
    }

    let decoded = null;
    let authUser = null;

    try {
        const supabase = getSupabaseAdmin();
        const { data: { user }, error } = await supabase.auth.getUser(token);
        if (user && !error) {
            authUser = user;
            decoded = { id: user.id, email: user.email };
        }
    } catch (supaErr) {
        console.error('[auth] Supabase token verify error:', supaErr.message);
    }

    if (!decoded) {
        return c.json({ error: 'Unauthorized: invalid or expired token' }, 401);
    }

    try {
        const now = Date.now();
        let cached = profileCache.get(decoded.id);

        if (!cached || (now - cached.timestamp > CACHE_TTL_MS)) {
            const { rows } = await pool.query(
                'SELECT role, onboarding_stage, username FROM users WHERE id = $1',
                [decoded.id]
            );

            if (rows.length > 0) {
                cached = { ...rows[0], timestamp: now };
                profileCache.set(decoded.id, cached);
            } else if (authUser) {
                const profile = await ensureUserProfile(pool, authUser);
                cached = {
                    role: profile.role,
                    onboarding_stage: profile.onboarding_stage,
                    username: profile.username,
                    timestamp: now,
                };
                profileCache.set(decoded.id, cached);
            } else {
                return c.json({ error: 'User not found' }, 401);
            }
        }

        c.set('user', {
            ...(authUser || {}),
            id: decoded.id,
            email: decoded.email,
            role: cached?.role || 'user',
            onboarding_stage: cached?.onboarding_stage ?? 0,
            username: cached?.username,
        });
        c.set('userId', decoded.id);
    } catch (err) {
        console.error('[auth middleware] Error:', err.message);
        return c.json({ error: 'Unauthorized: session error', details: err.message }, 401);
    }

    await next();
};

