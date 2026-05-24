import { pool } from '../lib/db.js';
import jwt from 'jsonwebtoken';
import { getCookie } from 'hono/cookie';
import { createClient } from '@supabase/supabase-js';

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET && process.env.NODE_ENV === 'production') {
    console.error('[FATAL] JWT_SECRET env var is not set in production!');
}
const _JWT_SECRET = JWT_SECRET || 'aiimin_super_secret_dev_key';

const COOKIE_NAME = 'aiimin_session';

// Profile cache with TTL-based eviction to prevent memory leaks
const profileCache = new Map();
const CACHE_TTL_MS = 10_000; // 10 seconds

// Periodic cleanup: evict expired cache entries every 60 seconds
setInterval(() => {
    const now = Date.now();
    for (const [key, entry] of profileCache.entries()) {
        if (now - entry.timestamp > CACHE_TTL_MS) {
            profileCache.delete(key);
        }
    }
}, 60_000);

// Initialize Supabase Admin client (lazy — avoids failing if env vars missing)
let _supabase = null;
const getSupabase = () => {
    if (!_supabase) {
        const url = process.env.SUPABASE_URL;
        const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
        if (!url || !key) {
            console.warn('[auth] SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY not set');
            return null;
        }
        _supabase = createClient(url, key);
    }
    return _supabase;
};

export const requireAuth = async (c, next) => {
    // 1. Extract token from cookie, then Bearer header
    let token = getCookie(c, COOKIE_NAME);
    if (!token) {
        const authHeader = c.req.header('authorization');
        if (authHeader?.startsWith('Bearer ')) token = authHeader.slice(7);
    }
    // Dev mock token
    if (!token) token = c.req.query('token');

    if (!token) {
        return c.json({ error: 'Unauthorized: missing token' }, 401);
    }

    // Dev-only mock bypass
    if (process.env.NODE_ENV !== 'production' && token === 'mock-test-token') {
        c.set('user', { id: '88888888-8888-4888-8888-888888888888', email: 'dev@aiimin.in', role: 'user', onboarding_stage: 1, username: 'DEVUSER' });
        c.set('userId', '88888888-8888-4888-8888-888888888888');
        return await next();
    }

    let decoded = null;
    let isSupabaseToken = false;

    // 2. Try local JWT first (fast path)
    try {
        decoded = jwt.verify(token, _JWT_SECRET);
    } catch (_) {
        // 3. Fallback: try Supabase token (for users who logged in via Supabase Auth)
        const supabase = getSupabase();
        if (supabase) {
            try {
                const { data: { user }, error } = await supabase.auth.getUser(token);
                if (user && !error) {
                    decoded = { id: user.id, email: user.email };
                    isSupabaseToken = true;
                }
            } catch (supaErr) {
                console.error('[auth] Supabase token verify error:', supaErr.message);
            }
        }
    }

    if (!decoded) {
        return c.json({ error: 'Unauthorized: invalid or expired token' }, 401);
    }

    // 4. Enrich with profile from DB (cached)
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
            } else if (isSupabaseToken) {
                // Auto-create public profile for new Supabase Auth users
                const supabase = getSupabase();
                if (supabase) {
                    const { data: { user } } = await supabase.auth.getUser(token);
                    const fullName = user?.user_metadata?.full_name || '';
                    const username = user?.user_metadata?.username || '';
                    const { rows: inserted } = await pool.query(
                        `INSERT INTO users (id, email, full_name, username, onboarding_stage, role)
                         VALUES ($1, $2, $3, $4, 0, 'user')
                         ON CONFLICT (id) DO UPDATE SET email = EXCLUDED.email
                         RETURNING role, onboarding_stage, username`,
                        [decoded.id, decoded.email, fullName, username]
                    );
                    cached = { ...inserted[0], timestamp: now };
                    profileCache.set(decoded.id, cached);
                }
            } else {
                return c.json({ error: 'User not found' }, 401);
            }
        }

        c.set('user', {
            id: decoded.id,
            email: decoded.email,
            role: cached?.role || 'user',
            onboarding_stage: cached?.onboarding_stage ?? 0,
            username: cached?.username,
        });
        c.set('userId', decoded.id);
        await next();
    } catch (err) {
        console.error('[auth middleware] Error:', err.message);
        return c.json({ error: 'Unauthorized: session error' }, 401);
    }
};
