import { Hono } from 'hono';
import { deleteCookie } from 'hono/cookie';
import { getSupabaseAdmin } from '../lib/supabaseAdmin.js';
import { requireAuth } from '../middleware/auth.js';

const app = new Hono();

const COOKIE_NAME = 'aiimin_session';
// OS-ID: exactly 8 chars, max 4 digits
const USERNAME_PATTERN = /^[A-Z0-9@,._\-=+*^$#!]+$/;
const PIN_PATTERN = /^\d{6}$/;

const validateOsId = (username) => {
    if (username.length !== 8) {
        return 'OS-ID must be exactly 8 characters long.';
    }
    if (!USERNAME_PATTERN.test(username)) {
        return 'Only letters, numbers, and @,._-=+*^$#! are allowed.';
    }
    const digits = (username.match(/[0-9]/g) || []).length;
    if (digits > 4) {
        return 'OS-ID can have at most 4 numbers';
    }
    return null;
};

/**
 * GET /auth/resolve?identifier=...
 * Resolves an OS-ID or email to the actual email address for login.
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
        const supabase = getSupabaseAdmin();
        const { data, error } = await supabase
            .from('users')
            .select('email')
            .ilike('username', identifier)
            .maybeSingle();

        if (error) {
            console.error('[auth/resolve] supabase error:', error.message);
            return c.json({ error: 'Internal server error' }, 500);
        }

        if (!data) {
            return c.json({ error: 'User not found' }, 404);
        }

        return c.json({ email: data.email });
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

        if (normalizedUsername) {
            const osIdErr = validateOsId(normalizedUsername);
            if (osIdErr) return c.json({ error: osIdErr }, 400);
        }

        const supabase = getSupabaseAdmin();

        // Check if user already exists in public.users
        const { data: existing } = await supabase
            .from('users')
            .select('id')
            .or(`email.eq.${normalizedEmail},username.ilike.${normalizedUsername}`)
            .maybeSingle();

        if (existing) {
            return c.json({ error: 'User already exists' }, 400);
        }

        // Create auth user via Supabase Admin
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

        // Upsert into public.users table
        const { data: userRow, error: upsertErr } = await supabase
            .from('users')
            .upsert({
                id: data.user.id,
                email: normalizedEmail,
                full_name: fullName || '',
                username: normalizedUsername || '',
                role: 'user',
                onboarding_stage: 'complete',
            }, { onConflict: 'id' })
            .select()
            .single();

        if (upsertErr) {
            console.error('[auth/signup] upsert error:', upsertErr.message);
            // Don't fail — user was created in auth, return basic info
            return c.json({
                user: {
                    id: data.user.id,
                    email: normalizedEmail,
                    username: normalizedUsername,
                    full_name: fullName || '',
                    role: 'user',
                }
            });
        }

        return c.json({ user: userRow });
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
        const supabase = getSupabaseAdmin();

        // Ensure user profile exists
        if (authUser?.id) {
            await supabase.from('users').upsert({
                id: authUser.id,
                email: authUser.email,
                full_name: authUser.user_metadata?.full_name || '',
                username: authUser.user_metadata?.username || '',
                role: 'user',
            }, { onConflict: 'id', ignoreDuplicates: true });
        }

        const { data, error } = await supabase
            .from('users')
            .select('id, email, full_name, username, role, avatar_url, timezone, onboarding_stage, created_at')
            .eq('id', userId)
            .maybeSingle();

        if (error || !data) return c.json({ user: null }, 401);
        return c.json({ user: data });
    } catch (err) {
        console.error('[auth/me] error:', err.message);
        return c.json({ user: null }, 401);
    }
});

/**
 * POST /auth/complete-google-profile
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
        const osIdErr = validateOsId(normalizedUsername);
        if (osIdErr) return c.json({ error: osIdErr }, 400);

        const supabase = getSupabaseAdmin();

        // Check username uniqueness (exclude self)
        const { data: taken } = await supabase
            .from('users')
            .select('id')
            .ilike('username', normalizedUsername)
            .neq('id', userId)
            .maybeSingle();

        if (taken) {
            return c.json({ error: 'Username already taken' }, 409);
        }

        // Update Supabase auth user password (PIN) + metadata
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

        // Upsert DB users row
        const { data: userRow } = await supabase
            .from('users')
            .upsert({
                id: userId,
                email: authUser.email,
                username: normalizedUsername,
                full_name: full_name || '',
                onboarding_stage: 'complete',
            }, { onConflict: 'id' })
            .select()
            .single();

        return c.json({ success: true, user: userRow || null });
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
