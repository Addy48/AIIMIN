import { pool } from '../lib/db.js';
import { getCookie } from 'hono/cookie';
import * as dotenv from 'dotenv';
import { getSupabaseAdmin } from '../lib/supabaseAdmin.js';
import { ensureUserProfile } from '../services/userProfileService.js';
import crypto from 'node:crypto';
dotenv.config({ path: '/Users/aaditya/Desktop/DASHBOARD PROJECT/.env' });

function generateUuidFromClerkId(clerkId) {
    const hash = crypto.createHash('md5').update(clerkId).digest('hex');
    return `${hash.slice(0,8)}-${hash.slice(8,12)}-4${hash.slice(13,16)}-a${hash.slice(17,20)}-${hash.slice(20,32)}`;
}

// Clerk JWT verification
let clerkVerifyToken = null;
const initClerk = async () => {
    if (clerkVerifyToken) return;
    const secretKey = process.env.CLERK_SECRET_KEY;
    if (!secretKey || secretKey.startsWith('PASTE_YOUR')) return;
    try {
        const { createClerkClient } = await import('@clerk/backend');
        const clerk = createClerkClient({ secretKey });
        clerkVerifyToken = async (token) => {
            const payload = await clerk.verifyToken(token);
            if (payload?.sub) {
                let email = payload.email || payload.email_address;
                if (!email) {
                    try {
                        const clerkUser = await clerk.users.getUser(payload.sub);
                        email = clerkUser.emailAddresses?.[0]?.emailAddress || '';
                    } catch (err) {
                        console.warn('[auth] Failed to fetch user from Clerk API:', err.message);
                    }
                }
                payload.email = email;
            }
            return payload;
        };
        console.log('[auth] Clerk verification enabled');
    } catch (e) {
        console.warn('[auth] Clerk backend SDK not installed, skipping Clerk JWT verification:', e.message);
    }
};
initClerk();

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
        if (clerkVerifyToken) {
            try {
                const payload = await clerkVerifyToken(token);
                if (payload?.sub) {
                    const clerkId = payload.sub;
                    let email = payload.email || '';
                    let dbId = null;

                    if (email) {
                        const { rows } = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
                        if (rows.length > 0) {
                            dbId = rows[0].id;
                        }
                    }

                    if (!dbId) {
                        dbId = generateUuidFromClerkId(clerkId);
                    }

                    decoded = { id: dbId, email: email, clerkId: clerkId };
                    authUser = { id: dbId, email: email };
                }
            } catch (clerkErr) {
                console.warn('[auth] Clerk token verify failed:', clerkErr.message);
            }
        }
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

