import { pool } from '../lib/db.js';
import jwt from 'jsonwebtoken';
import { getCookie } from 'hono/cookie';

const JWT_SECRET = process.env.JWT_SECRET || 'aiimin_super_secret_dev_key';
const COOKIE_NAME = 'aiimin_session';
const profileCache = new Map();
const CACHE_TTL = 10000;

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

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        
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
                    return c.json({ error: 'User not found' }, 401);
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
