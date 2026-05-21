/**
 * middleware/auth.js
 *
 * Validates Supabase JWT from Authorization header.
 * Attaches c.set('user', ...) and c.set('userId', ...) on success.
 */
import { supabaseAdmin as supabase } from '../supabase.js';
import { pool } from '../lib/db.js';

const profileCache = new Map();
const CACHE_TTL = 10000; // 10s cache for roles/onboarding

export const requireAuth = async (c, next) => {
    const authHeader = c.req.header('authorization');
    let token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null;

    if (!token) {
        // Fallback: check query parameter "token" (used for direct browser redirects like Google OAuth init)
        token = c.req.query('token');
    }

    if (!token) {
        return c.json({ error: 'Unauthorized: missing Bearer token' }, 401);
    }

    if (process.env.NODE_ENV !== 'production' && token === 'mock-test-token') {
        c.set('user', {
            id: '88888888-8888-4888-8888-888888888888',
            email: 'aadityaupadhyay10@gmail.com',
            role: 'user',
            onboarding_stage: 1,
            username: 'aaditya'
        });
        c.set('userId', '88888888-8888-4888-8888-888888888888');
        return await next();
    }

    try {
        const { data: { user }, error } = await supabase.auth.getUser(token);
        if (error || !user) {
            return c.json({ error: 'Unauthorized: invalid or expired token', code: 'INVALID_TOKEN' }, 401);
        }

        // Enrich with public.users profile (role, onboarding_stage)
        const now = Date.now();
        let profile = profileCache.get(user.id);

        if (!profile || (now - profile.timestamp > CACHE_TTL)) {
            try {
                const { rows } = await pool.query(
                    'SELECT role, onboarding_stage, username FROM users WHERE id = $1',
                    [user.id]
                );
                if (rows.length > 0) {
                    profile = { ...rows[0], timestamp: now };
                    profileCache.set(user.id, profile);
                }
            } catch (pgError) {
                console.error('[auth middleware] DB profile enrich error:', pgError.message);
            }
        }


        c.set('user', {
            ...user,
            role: profile?.role || 'user',
            onboarding_stage: profile?.onboarding_stage || 0,
            username: profile?.username
        });
        c.set('userId', user.id);

        await next();
    } catch (err) {
        console.error('[auth middleware]', err.message);
        return c.json({ error: 'Internal Auth Error' }, 500);
    }
};
