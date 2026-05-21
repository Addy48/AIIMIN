import { pool } from '../lib/db.js';
import jwt from 'jsonwebtoken';
import { getCookie } from 'hono/cookie';
import { createClient } from '@supabase/supabase-js';

const JWT_SECRET = process.env.JWT_SECRET || 'aiimin_super_secret_dev_key';
const COOKIE_NAME = 'aiimin_session';
const profileCache = new Map();
const CACHE_TTL = 10000;

// Initialize Supabase Client for token verification
const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

export const requireAuth = async (c, next) => {
    let token = getCookie(c, COOKIE_NAME);

    // Fallback to Bearer token in header
    if (!token) {
        const authHeader = c.req.header('authorization');
        if (authHeader?.startsWith('Bearer ')) {
            token = authHeader.slice(7);
        }
    }

    if (!token) {
        token = c.req.query('token');
    }

    if (!token) {
        return c.json({ error: 'Unauthorized: missing token' }, 401);
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

    let decoded = null;
    let isSupabaseToken = false;

    // Try our local custom JWT verification first
    try {
        decoded = jwt.verify(token, JWT_SECRET);
    } catch (err) {
        // Local verification failed, try Supabase verification
        try {
            const { data: { user }, error } = await supabase.auth.getUser(token);
            if (user && !error) {
                decoded = { id: user.id, email: user.email };
                isSupabaseToken = true;
            }
        } catch (supabaseErr) {
            console.error('[auth middleware] Supabase token verify error:', supabaseErr.message);
        }
    }

    if (!decoded) {
        return c.json({ error: 'Unauthorized: invalid or expired token' }, 401);
    }

    try {
        const now = Date.now();
        let profile = profileCache.get(decoded.id);

        if (!profile || (now - profile.timestamp > CACHE_TTL)) {
            try {
                const { rows } = await pool.query(
                    'SELECT role, onboarding_stage, username FROM users WHERE id = $1',
                    [decoded.id]
                );
                if (rows.length > 0) {
                    profile = { ...rows[0], timestamp: now };
                    profileCache.set(decoded.id, profile);
                } else {
                    // Fallback: If user is validated by Supabase but not in public.users yet,
                    // create the public record immediately to prevent race conditions or errors
                    if (isSupabaseToken) {
                        try {
                            const { data: { user } } = await supabase.auth.getUser(token);
                            const name = user.raw_user_meta_data?.full_name || '';
                            const username = user.raw_user_meta_data?.username || '';
                            const insertRes = await pool.query(
                                `INSERT INTO users (id, email, full_name, username, onboarding_stage, role)
                                 VALUES ($1, $2, $3, $4, 0, 'user')
                                 ON CONFLICT (id) DO UPDATE SET email = EXCLUDED.email
                                 RETURNING role, onboarding_stage, username`,
                                [decoded.id, decoded.email, name, username]
                            );
                            profile = { ...insertRes.rows[0], timestamp: now };
                            profileCache.set(decoded.id, profile);
                        } catch (createErr) {
                            console.error('[auth middleware] Fallback user creation failed:', createErr.message);
                            return c.json({ error: 'User not found in profile database' }, 401);
                        }
                    } else {
                        return c.json({ error: 'User not found' }, 401);
                    }
                }
            } catch (pgError) {
                console.error('[auth middleware] DB profile enrich error:', pgError.message);
            }
        }

        c.set('user', {
            id: decoded.id,
            email: decoded.email,
            role: profile?.role || 'user',
            onboarding_stage: profile?.onboarding_stage || 0,
            username: profile?.username
        });
        c.set('userId', decoded.id);

        await next();
    } catch (err) {
        return c.json({ error: 'Unauthorized: invalid or expired token' }, 401);
    }
};

