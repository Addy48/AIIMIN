import { Hono } from 'hono';
import { deleteCookie } from 'hono/cookie';
import { pool } from '../lib/db.js';
import { requireAuth } from '../middleware/auth.js';
import { resolveAccess } from '../services/accessService.js';
import { auth, validateOsId, PIN_PATTERN } from '../lib/auth.js';
import { resolveAuthSession } from '../lib/sessionResolve.js';

const app = new Hono();

const COOKIE_NAME = 'aiimin_session';

const frontendUrl = () => process.env.FRONTEND_URL || 'http://localhost:3000';

/**
 * GET /auth/oauth-handoff
 * Better Auth OAuth lands here (API host) so the session cookie is readable,
 * then we redirect to the SPA with a one-time token for bearer storage.
 */
app.get('/oauth-handoff', async (c) => {
    const frontend = frontendUrl();
    try {
        const session = await resolveAuthSession(c);
        if (!session?.session) {
            console.warn('[oauth-handoff] no session after OAuth');
            return c.redirect(`${frontend}/auth/callback?status=error&reason=no_session`);
        }

        const { token } = await auth.api.generateOneTimeToken({ headers: c.req.raw.headers });
        if (!token) {
            return c.redirect(`${frontend}/auth/callback?status=error&reason=ott_generate_failed`);
        }

        return c.redirect(`${frontend}/auth/callback?ott=${encodeURIComponent(token)}`);
    } catch (err) {
        console.error('[oauth-handoff] error:', err.message);
        return c.redirect(`${frontend}/auth/callback?status=error&reason=${encodeURIComponent(err.message || 'handoff_failed')}`);
    }
});

/**
 * GET /auth/resolve?identifier=...
 * Resolves OS-ID to email for legacy clients / display.
 */
app.get('/resolve', async (c) => {
    const identifier = c.req.query('identifier');
    if (!identifier) return c.json({ error: 'Identifier is required' }, 400);

    if (identifier.includes('@')) {
        return c.json({ email: identifier.toLowerCase() });
    }

    try {
        const { rows } = await pool.query(
            'SELECT email FROM users WHERE username ILIKE $1 LIMIT 1',
            [identifier.trim()],
        );
        if (!rows[0]) return c.json({ error: 'User not found' }, 404);
        return c.json({ email: rows[0].email });
    } catch (err) {
        console.error('[auth/resolve] error:', err.message);
        return c.json({ error: 'Internal server error' }, 500);
    }
});

/**
 * GET /auth/access — waitlist gate
 */
app.get('/access', requireAuth, async (c) => {
    const userId = c.get('userId');
    const authUser = c.get('user');
    const access = await resolveAccess({
        email: authUser?.email,
        userId,
    });
    return c.json({
        canAccessApp: access.canAccess,
        canAccess: access.canAccess,
        role: access.role,
        tier: access.tier,
    });
});

/**
 * GET /auth/me
 */
app.get('/me', requireAuth, async (c) => {
    const userId = c.get('userId');
    const authUser = c.get('user');
    try {
        const { rows } = await pool.query(
            `SELECT id, email, full_name, username, role, avatar_url, timezone, onboarding_stage, created_at
             FROM users WHERE id = $1`,
            [userId],
        );
        if (!rows[0]) {
            return c.json({
                user: {
                    id: userId,
                    email: authUser.email,
                    full_name: authUser.full_name || authUser.name || '',
                    username: authUser.username || '',
                    role: authUser.role || 'user',
                    onboarding_stage: authUser.onboarding_stage ?? 0,
                    emailVerified: Boolean(authUser?.emailVerified),
                },
            });
        }
        return c.json({
            user: {
                ...rows[0],
                emailVerified: Boolean(authUser?.emailVerified),
            },
        });
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
        const { username, full_name } = body;
        if (!username) return c.json({ error: 'Username is required' }, 400);

        const normalizedUsername = username.trim().toUpperCase();
        const osIdErr = validateOsId(normalizedUsername);
        if (osIdErr) return c.json({ error: osIdErr }, 400);

        const { rows: taken } = await pool.query(
            'SELECT id FROM users WHERE username ILIKE $1 AND id <> $2 LIMIT 1',
            [normalizedUsername, userId],
        );
        if (taken[0]) return c.json({ error: 'Username already taken' }, 409);

        await pool.query(
            `UPDATE users SET username = $1, full_name = COALESCE($2, full_name), onboarding_stage = GREATEST(COALESCE(onboarding_stage, 0), 1), updated_at = NOW()
             WHERE id = $3`,
            [normalizedUsername, full_name || authUser.full_name || '', userId],
        );

        try {
            await auth.api.updateUser({
                headers: c.req.raw.headers,
                body: {
                    username: normalizedUsername,
                    name: full_name || authUser.full_name || authUser.name || '',
                },
            });
        } catch (updateErr) {
            console.warn('[complete-google-profile] Better Auth user update:', updateErr.message);
        }

        const { rows } = await pool.query(
            'SELECT id, email, full_name, username, role, onboarding_stage FROM users WHERE id = $1',
            [userId],
        );
        return c.json({ success: true, user: rows[0] || null });
    } catch (err) {
        console.error('[complete-google-profile] error:', err);
        return c.json({ error: 'Internal server error' }, 500);
    }
});

/**
 * POST /auth/set-pin — set 6-digit PIN (call last in onboarding).
 */
app.post('/set-pin', requireAuth, async (c) => {
    try {
        const body = await c.req.json();
        const { pin, currentPin } = body;
        if (!pin || !PIN_PATTERN.test(pin)) {
            return c.json({ error: 'PIN must be exactly 6 digits' }, 400);
        }

        try {
            await auth.api.setPassword({
                headers: c.req.raw.headers,
                body: { newPassword: pin },
            });
        } catch (setErr) {
            if (!currentPin) {
                console.error('[auth/set-pin] setPassword failed:', setErr.message);
                return c.json({ error: setErr.message || 'Failed to set PIN' }, 500);
            }
            await auth.api.changePassword({
                headers: c.req.raw.headers,
                body: {
                    newPassword: pin,
                    currentPassword: currentPin,
                    revokeOtherSessions: false,
                },
            });
        }

        await pool.query(
            'UPDATE users SET onboarding_stage = GREATEST(COALESCE(onboarding_stage, 0), 1), updated_at = NOW() WHERE id = $1',
            [c.get('userId')],
        );

        return c.json({ success: true });
    } catch (err) {
        console.error('[auth/set-pin] error:', err.message);
        return c.json({ error: err.message || 'Failed to set PIN' }, 500);
    }
});

app.post('/logout', async (c) => {
    try {
        await auth.api.signOut({ headers: c.req.raw.headers });
    } catch (_) { /* ignore */ }
    deleteCookie(c, COOKIE_NAME, { path: '/' });
    return c.json({ success: true });
});

export default app;
