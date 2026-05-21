/**
 * routes/googleAuth.js
 *
 * Consolidated Google OAuth 2.0 flow for AIIMIN.
 * Refactored for Hono / Cloudflare Workers.
 */
import { Hono } from 'hono';
import { google } from 'googleapis';
import { pool } from '../lib/db.js';
import { encrypt } from '../lib/crypto.js';
import { requireAuth } from '../middleware/auth.js';

const app = new Hono();

const STATE_TTL_MS = 10 * 60 * 1000;

const SCOPES = [
    'openid',
    'email',
    'profile',
    'https://www.googleapis.com/auth/calendar.readonly',
    'https://www.googleapis.com/auth/calendar.events',
    'https://www.googleapis.com/auth/youtube.readonly',
];

const createOAuthClient = () => {
    const redirectUri = process.env.GOOGLE_REDIRECT_URI || process.env.GOOGLE_CALLBACK_URL || 'https://api.aiimin.in/api/google/auth/callback';
    return new google.auth.OAuth2(
        process.env.GOOGLE_CLIENT_ID,
        process.env.GOOGLE_CLIENT_SECRET,
        redirectUri
    );
};

app.get('/auth/google', async (c) => {
    const client = createOAuthClient();
    const state = crypto.randomUUID().replace(/-/g, '');
    const expiresAt = new Date(Date.now() + STATE_TTL_MS).toISOString();

    await pool.query(
        `INSERT INTO public.oauth_states (state, is_login, expires_at) 
         VALUES ($1, $2, $3)
         ON CONFLICT (state) DO UPDATE SET is_login = EXCLUDED.is_login, expires_at = EXCLUDED.expires_at`,
        [state, true, expiresAt]
    );

    const authUrl = client.generateAuthUrl({ access_type: 'offline', prompt: 'consent', scope: SCOPES, state });
    return c.redirect(authUrl);
});

app.get('/auth/init', requireAuth, async (c) => {
    const userId = c.get('userId');
    const client = createOAuthClient();
    const state = crypto.randomUUID().replace(/-/g, '');
    const expiresAt = new Date(Date.now() + STATE_TTL_MS).toISOString();

    await pool.query(
        `INSERT INTO public.oauth_states (state, user_id, is_login, expires_at) 
         VALUES ($1, $2, $3, $4)
         ON CONFLICT (state) DO UPDATE SET user_id = EXCLUDED.user_id, is_login = EXCLUDED.is_login, expires_at = EXCLUDED.expires_at`,
        [state, userId, false, expiresAt]
    );

    const authUrl = client.generateAuthUrl({ access_type: 'offline', prompt: 'consent', scope: SCOPES, state });
    return c.redirect(authUrl);
});

app.get('/auth/callback', async (c) => {
    const { code, state, error: googleError } = c.req.query();
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';

    if (googleError) {
        return c.redirect(`${frontendUrl}/auth/callback?status=error&reason=${encodeURIComponent(googleError)}`);
    }

    // Atomic verify and consume the state row from oauth_states
    let stateData = null;
    try {
        const stateRes = await pool.query(
            'DELETE FROM public.oauth_states WHERE state = $1 RETURNING *',
            [state]
        );
        stateData = stateRes.rows[0];
    } catch (err) {
        console.error('[googleAuth/callback] State verification error:', err);
    }

    if (!stateData || new Date(stateData.expires_at) < new Date()) {
        return c.redirect(`${frontendUrl}/auth/callback?status=error&reason=invalid_or_expired_state`);
    }

    try {
        const client = createOAuthClient();
        const { tokens } = await client.getToken(code);
        client.setCredentials(tokens);

        const oauth2 = google.oauth2({ version: 'v2', auth: client });
        const userInfo = await oauth2.userinfo.get();
        const email = userInfo.data.email;

        let userId = stateData.user_id;

        if (stateData.is_login) {
            let userResult = await pool.query('SELECT id, email FROM users WHERE email = $1', [email]);
            if (userResult.rows.length === 0) {
                userResult = await pool.query(
                    `INSERT INTO users (email, full_name, username, timezone, avatar_url)
                     VALUES ($1, $2, $3, $4, $5) RETURNING id, email`,
                    [email, userInfo.data.name, '', 'Asia/Kolkata', userInfo.data.picture]
                );
            }
            const user = userResult.rows[0];
            userId = user.id;
            
            // Generate JWT
            const jwt = await import('jsonwebtoken');
            const token = jwt.default.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET || 'aiimin_super_secret_dev_key', { expiresIn: '30d' });
            
            const { setCookie } = await import('hono/cookie');
            setCookie(c, 'aiimin_session', token, {
                path: '/',
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'Lax',
                maxAge: 30 * 24 * 60 * 60,
            });
        }

        if (userId) {
            const accessEnc = encrypt(tokens.access_token);
            const refreshEnc = tokens.refresh_token ? encrypt(tokens.refresh_token) : null;

            await pool.query(`
                INSERT INTO public.user_oauth_tokens (
                    user_id,
                    provider,
                    access_token,
                    access_token_enc,
                    refresh_token,
                    refresh_token_enc,
                    expiry_date,
                    scope,
                    last_refresh_at,
                    updated_at
                ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW(), NOW())
                ON CONFLICT (user_id, provider) DO UPDATE SET
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
                'google',
                tokens.access_token,
                accessEnc,
                tokens.refresh_token || null,
                refreshEnc,
                tokens.expiry_date ? String(tokens.expiry_date) : null,
                tokens.scope || ''
            ]);
        }

        return c.redirect(`${frontendUrl}/auth/callback?status=success`);
    } catch (err) {
        console.error('[googleAuth/callback] Error:', err);
        return c.redirect(`${frontendUrl}/auth/callback?status=error&reason=exchange_failed`);
    }
});

app.post('/auth/disconnect', requireAuth, async (c) => {
    const userId = c.get('userId');
    await pool.query(
        'DELETE FROM public.user_oauth_tokens WHERE user_id = $1 AND provider = $2',
        [userId, 'google']
    );
    return c.json({ success: true });
});

export default app;
