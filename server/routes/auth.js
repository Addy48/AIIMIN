import { Hono } from 'hono';
import { pool } from '../lib/db.js';
import { deleteCookie } from 'hono/cookie';
import { getSupabaseAdmin } from '../lib/supabaseAdmin.js';
import { ensureUserProfile } from '../services/userProfileService.js';
import { requireAuth } from '../middleware/auth.js';

const app = new Hono();

const COOKIE_NAME = 'aiimin_session';
// OS-ID: 4-8 uppercase letters/numbers, max 4 digits
const USERNAME_PATTERN = /^[A-Z0-9]{4,8}$/;
const PIN_PATTERN = /^\d{6}$/;

const validateOsId = (username) => {
    if (!USERNAME_PATTERN.test(username)) {
        return 'OS-ID must be 4-8 uppercase letters/numbers';
    }
    const digits = (username.match(/[0-9]/g) || []).length;
    if (digits > 4) {
        return 'OS-ID can have at most 4 numbers';
    }
    return null;
};

/**
 * GET /auth/resolve?identifier=...
 * Resolves a username or email to the actual email address for login.
 */
app.get('/resolve', async (c) => {
    const identifier = c.req.query('identifier');

    if (!identifier) {
        return c.json({ error: 'Identifier is required' }, 400);
    }

    if (identifier.includes('@')) {
        return c.json({ email: identifier.toLowerCase() });
    }

    try {
        const { rows } = await pool.query(
            'SELECT email FROM users WHERE LOWER(username) = LOWER($1)',
            [identifier]
        );

        if (rows.length === 0) {
            return c.json({ error: 'User not found' }, 404);
        }

        return c.json({ email: rows[0].email });
    } catch (err) {
        console.error('[auth/resolve] error:', err.message);
        return c.json({ error: 'Internal server error' }, 500);
    }
});

/**
 * POST /auth/signup
 */
app.post('/signup', async (c) => {
    try {
        const body = await c.req.json();
        const { email, password, fullName, username } = body;

        if (!email || !password) {
            return c.json({ error: 'Email and password are required' }, 400);
        }

        const normalizedEmail = email.toLowerCase().trim();
        const normalizedUsername = username?.trim().toUpperCase() || null;

        if (!PIN_PATTERN.test(password)) {
            return c.json({ error: 'PIN must be exactly 6 digits' }, 400);
        }

        if (normalizedUsername && !USERNAME_PATTERN.test(normalizedUsername)) {
            const osIdErr = validateOsId(normalizedUsername);
            return c.json({ error: osIdErr || 'Invalid OS-ID format' }, 400);
        }

        // Check if public profile exists before creating an Auth user.
        const check = await pool.query('SELECT id FROM users WHERE email = $1 OR LOWER(username) = LOWER($2)', [normalizedEmail, normalizedUsername]);
        if (check.rows.length > 0) {
            return c.json({ error: 'User already exists' }, 400);
        }

        const supabase = getSupabaseAdmin();
        const { data, error } = await supabase.auth.admin.createUser({
            email: normalizedEmail,
            password,
            email_confirm: true,
            user_metadata: {
                full_name: fullName || '',
                username: normalizedUsername || '',
            },
        });

        if (error) {
            const status = /already|registered|exists/i.test(error.message) ? 400 : 500;
            return c.json({ error: error.message }, status);
        }

        const user = await ensureUserProfile(pool, data.user, {
            fullName,
            username: normalizedUsername,
        });

        return c.json({ user });
    } catch (err) {
        console.error('[auth/signup] error:', err);
        return c.json({ error: 'Internal server error' }, 500);
    }
});

/**
 * POST /auth/login
 */
app.post('/login', async (c) => {
    return c.json({
        error: 'Use Supabase Auth from the client. This endpoint is kept only for compatibility.',
    }, 410);
});

/**
 * GET /auth/me
 */
app.get('/me', requireAuth, async (c) => {
    const userId = c.get('userId');
    const authUser = c.get('user');
    try {
        if (authUser?.id) {
            await ensureUserProfile(pool, authUser);
        }

        const { rows } = await pool.query(
            `SELECT id, email, full_name, username, role, avatar_url, timezone,
                    onboarding_stage, created_at
             FROM users WHERE id = $1`,
            [userId]
        );
        if (rows.length === 0) return c.json({ user: null }, 401);
        return c.json({ user: rows[0] });
    } catch (err) {
        console.error('[auth/me] error:', err.message);
        return c.json({ user: null }, 401);
    }
});

/**
 * POST /auth/complete-google-profile
 * Called after Google OAuth to set username + PIN for new Google users.
 * Requires a valid Supabase session (Bearer token).
 */
app.post('/complete-google-profile', requireAuth, async (c) => {
    const userId = c.get('userId');
    const authUser = c.get('user');

    try {
        const body = await c.req.json();
        const { username, pin, full_name } = body;

        if (!username || !pin) {
            return c.json({ error: 'Username and PIN are required' }, 400);
        }

        if (!PIN_PATTERN.test(pin)) {
            return c.json({ error: 'PIN must be exactly 6 digits' }, 400);
        }

        const normalizedUsername = username.trim().toUpperCase();
        if (!USERNAME_PATTERN.test(normalizedUsername)) {
            return c.json({ error: 'Username must be 3-20 uppercase letters, numbers, _, ., or -' }, 400);
        }

        // Check username uniqueness (exclude self)
        const check = await pool.query(
            'SELECT id FROM users WHERE LOWER(username) = LOWER($1) AND id != $2',
            [normalizedUsername, userId]
        );
        if (check.rows.length > 0) {
            return c.json({ error: 'Username already taken' }, 409);
        }

        // Update Supabase auth user password (PIN) + metadata
        const supabase = getSupabaseAdmin();
        const { error: updateError } = await supabase.auth.admin.updateUserById(userId, {
            password: pin,
            user_metadata: {
                ...authUser.user_metadata,
                username: normalizedUsername,
                full_name: full_name || authUser.user_metadata?.full_name || '',
            },
        });

        if (updateError) {
            console.error('[complete-google-profile] Supabase update error:', updateError.message);
            return c.json({ error: 'Failed to update credentials' }, 500);
        }

        // Update / create DB users row
        const { rows: existing } = await pool.query('SELECT id FROM users WHERE id = $1', [userId]);

        if (existing.length > 0) {
            await pool.query(
                `UPDATE users SET username = $1, full_name = $2, onboarding_stage = 'complete', updated_at = NOW() WHERE id = $3`,
                [normalizedUsername, full_name || '', userId]
            );
        } else {
            await ensureUserProfile(pool, { ...authUser, user_metadata: { username: normalizedUsername, full_name: full_name || '' } }, {
                username: normalizedUsername,
                fullName: full_name || '',
            });
        }

        const { rows } = await pool.query(
            'SELECT id, email, full_name, username, role, avatar_url, onboarding_stage FROM users WHERE id = $1',
            [userId]
        );

        return c.json({ success: true, user: rows[0] || null });
    } catch (err) {
        console.error('[complete-google-profile] error:', err);
        return c.json({ error: 'Internal server error' }, 500);
    }
});

/**
 * POST /auth/logout
 */
app.post('/logout', async (c) => {
    deleteCookie(c, COOKIE_NAME, { path: '/' });
    return c.json({ success: true });
});

export default app;
