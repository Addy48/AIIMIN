/**
 * middleware/auth.js
 *
 * Validates Supabase JWT from Authorization header.
 * Attaches req.user = { id, email } on success.
 * Replaces the insecure x-user-id header approach.
 */
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

const profileCache = new Map();
const CACHE_TTL = 10000; // 10s cache for roles/onboarding

export const requireAuth = async (req, res, next) => {
    res.setHeader('Content-Type', 'application/json');

    const authHeader = req.headers['authorization'];
    const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null;

    if (!token) {
        return res.status(401).json({ error: 'Unauthorized: missing Bearer token' });
    }

    try {
        const { data: { user }, error } = await supabase.auth.getUser(token);
        if (error || !user) {
            return res.status(401).json({ error: 'Unauthorized: invalid or expired token', code: 'INVALID_TOKEN' });
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

        req.user = {
            ...user,
            role: profile?.role || 'user',
            onboarding_stage: profile?.onboarding_stage || 0,
            username: profile?.username
        };
        req.userId = user.id;
        next();
    } catch (err) {
        console.error('[auth middleware]', err.message);
        return res.status(500).json({ error: 'Internal Auth Error' });
    }
};
