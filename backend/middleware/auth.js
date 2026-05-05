/**
 * middleware/auth.js
 *
 * Validates Supabase JWT from Authorization header.
 * Attaches c.set('user', ...) and c.set('userId', ...) on success.
 */
import { supabaseAdmin as supabase } from '../supabase.js';

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

    try {
        const { data: { user }, error } = await supabase.auth.getUser(token);
        if (error || !user) {
            return c.json({ error: 'Unauthorized: invalid or expired token', code: 'INVALID_TOKEN' }, 401);
        }

        // Enrich with public.users profile (role, onboarding_stage)
        const now = Date.now();
        let profile = profileCache.get(user.id);

        if (!profile || (now - profile.timestamp > CACHE_TTL)) {
            const { data: publicUser, error: pgError } = await supabase
                .from('users')
                .select('role, onboarding_stage, username')
                .eq('id', user.id)
                .single();

            if (!pgError && publicUser) {
                profile = { ...publicUser, timestamp: now };
                profileCache.set(user.id, profile);
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
