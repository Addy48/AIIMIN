/**
 * routes/googleAuth.js — Calendar/YouTube integration OAuth (separate from app login).
 */
import { Hono } from 'hono';
import { google } from 'googleapis';
import { pool } from '../lib/db.js';
import { encrypt } from '../lib/crypto.js';
import { requireAuth } from '../middleware/auth.js';
import crypto from 'node:crypto';

const app = new Hono();

const STATE_TTL_MS = 10 * 60 * 1000;

const SCOPES = [
    'openid',
    'email',
    'profile',
    'https://www.googleapis.com/auth/calendar.readonly',
    'https://www.googleapis.com/auth/tasks.readonly',
    'https://www.googleapis.com/auth/youtube.readonly',
    // Notes Drive folder watch (user reconnects Google to grant)
    'https://www.googleapis.com/auth/drive.readonly',
];

const getCalendarOAuthConfig = () => ({
    clientId: process.env.GOOGLE_CALENDAR_CLIENT_ID || process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CALENDAR_CLIENT_SECRET || process.env.GOOGLE_CLIENT_SECRET,
    redirectUri: process.env.GOOGLE_CALENDAR_REDIRECT_URI
        || process.env.GOOGLE_REDIRECT_URI
        || process.env.GOOGLE_CALLBACK_URL
        || 'https://api.aiimin.in/api/google/auth/callback',
});

const createOAuthClient = () => {
    const { clientId, clientSecret, redirectUri } = getCalendarOAuthConfig();
    return new google.auth.OAuth2(clientId, clientSecret, redirectUri);
};

app.get('/auth/google', async (c) => {
    return c.json({
        error: 'Use Better Auth for app login. This route is for Calendar connection only.',
    }, 410);
});

/**
 * Start Calendar OAuth — user may pick ANY Google account (not tied to login email).
 */
app.get('/auth/init', requireAuth, async (c) => {
    const userId = c.get('userId');
    const loginHint = c.req.query('login_hint') || '';
    const client = createOAuthClient();
    const state = crypto.randomUUID().replace(/-/g, '');
    const expiresAt = new Date(Date.now() + STATE_TTL_MS).toISOString();

    await pool.query(
        `INSERT INTO public.oauth_states (state, user_id, is_login, expires_at)
         VALUES ($1, $2, false, $3)
         ON CONFLICT (state) DO UPDATE SET user_id = EXCLUDED.user_id, expires_at = EXCLUDED.expires_at`,
        [state, userId, expiresAt],
    );

    const authUrl = client.generateAuthUrl({
        access_type: 'offline',
        prompt: 'select_account consent',
        scope: SCOPES,
        state,
        include_granted_scopes: true,
        ...(loginHint ? { login_hint: loginHint } : {}),
    });

    return c.json({ authUrl });
});

app.get('/auth/callback', async (c) => {
    const { code, state, error: googleError } = c.req.query();
    const frontendUrl = process.env.FRONTEND_URL || 'https://aiimin.in';
    const calendarReturn = `${frontendUrl}/calendar?integration=google`;

    if (googleError) {
        return c.redirect(`${calendarReturn}&status=error&reason=${encodeURIComponent(googleError)}`);
    }

    let stateData = null;
    try {
        const stateRes = await pool.query(
            'DELETE FROM public.oauth_states WHERE state = $1 RETURNING *',
            [state],
        );
        stateData = stateRes.rows[0];
    } catch (err) {
        console.error('[googleAuth/callback] State verification error:', err);
    }

    if (!stateData || new Date(stateData.expires_at) < new Date()) {
        return c.redirect(`${calendarReturn}&status=error&reason=invalid_or_expired_state`);
    }

    try {
        const client = createOAuthClient();
        const { tokens } = await client.getToken(code);
        client.setCredentials(tokens);

        const oauth2 = google.oauth2({ version: 'v2', auth: client });
        const userInfo = await oauth2.userinfo.get();
        const linkedEmail = userInfo.data.email;

        const userId = stateData.user_id;
        if (!userId) {
            return c.redirect(`${calendarReturn}&status=error&reason=missing_user`);
        }

        const accessEnc = encrypt(tokens.access_token);
        const refreshEnc = tokens.refresh_token ? encrypt(tokens.refresh_token) : null;

        await pool.query(`
            INSERT INTO public.user_oauth_tokens (
                user_id, provider, linked_email,
                access_token, access_token_enc,
                refresh_token, refresh_token_enc,
                expiry_date, scope, last_refresh_at, updated_at
            ) VALUES ($1, 'google', $2, $3, $4, $5, $6, $7, $8, NOW(), NOW())
            ON CONFLICT (user_id, provider) DO UPDATE SET
                linked_email = EXCLUDED.linked_email,
                access_token = EXCLUDED.access_token,
                access_token_enc = EXCLUDED.access_token_enc,
                refresh_token = COALESCE(EXCLUDED.refresh_token, public.user_oauth_tokens.refresh_token),
                refresh_token_enc = COALESCE(EXCLUDED.refresh_token_enc, public.user_oauth_tokens.refresh_token_enc),
                expiry_date = EXCLUDED.expiry_date,
                scope = EXCLUDED.scope,
                last_refresh_at = NOW(),
                updated_at = NOW(),
                refresh_error = NULL
        `, [
            userId,
            linkedEmail,
            tokens.access_token,
            accessEnc,
            tokens.refresh_token || null,
            refreshEnc,
            tokens.expiry_date ? String(tokens.expiry_date) : null,
            tokens.scope || '',
        ]);

        const emailParam = linkedEmail ? `&linked_email=${encodeURIComponent(linkedEmail)}` : '';
        return c.redirect(`${calendarReturn}&status=success${emailParam}`);
    } catch (err) {
        console.error('[googleAuth/callback] Error:', err);
        return c.redirect(`${calendarReturn}&status=error&reason=exchange_failed`);
    }
});

app.get('/auth/status', requireAuth, async (c) => {
    const userId = c.get('userId');
    try {
        const { rows } = await pool.query(
            `SELECT linked_email, scope, refresh_error, last_refresh_at, updated_at, expiry_date
             FROM public.user_oauth_tokens WHERE user_id = $1 AND provider = 'google'`,
            [userId],
        );
        const data = rows[0];
        return c.json({
            connected: !!data && !data.refresh_error,
            linkedEmail: data?.linked_email || null,
            loginEmail: c.get('user')?.email || null,
            emailsDiffer: !!(data?.linked_email && c.get('user')?.email
                && data.linked_email.toLowerCase() !== c.get('user').email.toLowerCase()),
            scopes: data?.scope?.split(' ').filter(Boolean) || [],
            lastSync: data?.last_refresh_at || data?.updated_at || null,
            error: data?.refresh_error || null,
        });
    } catch (err) {
        console.warn('[googleAuth/status] error:', err.message);
        return c.json({ connected: false, error: err.message });
    }
});

app.post('/auth/disconnect', requireAuth, async (c) => {
    const userId = c.get('userId');
    await pool.query(
        'DELETE FROM public.user_oauth_tokens WHERE user_id = $1 AND provider = $2',
        [userId, 'google'],
    );
    return c.json({ success: true });
});

export default app;
