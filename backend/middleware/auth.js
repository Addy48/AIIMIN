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

export const requireAuth = async (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null;

    if (!token) {
        return res.status(401).json({ error: 'Unauthorized: missing Bearer token' });
    }

    try {
        const { data: { user }, error } = await supabase.auth.getUser(token);
        if (error || !user) {
            return res.status(401).json({ error: 'Unauthorized: invalid or expired token' });
        }
        req.user = user;          // full Supabase user object
        req.userId = user.id;       // convenience shorthand
        next();
    } catch (err) {
        console.error('[auth middleware]', err.message);
        return res.status(500).json({ error: 'Auth service unavailable' });
    }
};
