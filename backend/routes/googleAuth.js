/**
 * routes/googleAuth.js
 *
 * Consolidated Google OAuth 2.0 flow for AIIMIN.
 * Handles both Login and Calendar/YouTube integration.
 * Tokens are stored securely in the DB (encrypted).
 */
import express from 'express';
import { google } from 'googleapis';
import crypto from 'crypto';
import { pool, getIntegrationStatus } from '../lib/googleClient.js';
import { encrypt } from '../lib/crypto.js';
import { logOAuthEvent } from '../lib/oauthLogger.js';
import { requireAuth } from '../middleware/auth.js';
import { createClient } from '@supabase/supabase-js';

const router = express.Router();

const supabaseAdmin = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

// In-memory CSRF state store
const oauthStates = new Map();
const STATE_TTL_MS = 10 * 60 * 1000;

const createOAuthClient = () => new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI
);

const SCOPES = [
    'openid',
    'email',
    'profile',
    'https://www.googleapis.com/auth/calendar.readonly',
    'https://www.googleapis.com/auth/youtube.readonly',
];

/**
 * Combined Auth Init (Login or Integration)
 * If req.userId exists (via middleware), it's an integration flow.
 * Otherwise, it's a login flow.
 */
const initiateAuth = (req, res, isLogin = false) => {
    const client = createOAuthClient();
    const state = crypto.randomBytes(16).toString('hex');

    oauthStates.set(state, {
        userId: isLogin ? null : req.userId,
        isLogin,
        expiresAt: Date.now() + STATE_TTL_MS,
    });

    const authUrl = client.generateAuthUrl({
        access_type: 'offline',
        prompt: 'consent',
        scope: SCOPES,
        state,
    });

    res.json({ authUrl });
};

// Login Initiation (Public)
router.get('/auth/login', (req, res) => initiateAuth(req, res, true));

// Integration Initiation (Authenticated)
router.get('/auth/init', requireAuth, (req, res) => initiateAuth(req, res, false));

/**
 * OAuth Callback
 */
router.get('/auth/callback', async (req, res) => {
    const { code, state, error: googleError } = req.query;
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';

    if (googleError) {
        return res.redirect(`${frontendUrl}/auth/callback?status=error&reason=${encodeURIComponent(googleError)}`);
    }

    const stateData = oauthStates.get(state);
    if (!stateData || Date.now() > stateData.expiresAt) {
        return res.redirect(`${frontendUrl}/auth/callback?status=error&reason=invalid_state`);
    }
    oauthStates.delete(state);

    try {
        const client = createOAuthClient();
        const { tokens } = await client.getToken(code);
        client.setCredentials(tokens);

        // Get user info from Google
        const oauth2 = google.oauth2({ version: 'v2', auth: client });
        const userInfo = await oauth2.userinfo.get();
        const email = userInfo.data.email;

        let userId = stateData.userId;

        if (stateData.isLogin) {
            // Flow: Login -> Find or Create Supabase User
            const { data: user, error: userError } = await supabaseAdmin.auth.admin.listUsers(); // Simple check or use getByEmail
            // For production, use better lookup. Here we'll search by email.
            let targetUser = (user.users || []).find(u => u.email === email);

            if (!targetUser) {
                // Create user if not exists
                const { data: newUser, error: createError } = await supabaseAdmin.auth.admin.createUser({
                    email,
                    email_confirm: true,
                    user_metadata: { full_name: userInfo.data.name, avatar_url: userInfo.data.picture }
                });
                if (createError) throw createError;
                targetUser = newUser.user;
            }
            userId = targetUser.id;
        }

        // Store tokens securely
        const accessEnc = encrypt(tokens.access_token);
        const refreshEnc = tokens.refresh_token ? encrypt(tokens.refresh_token) : null;

        await pool.query(
            `INSERT INTO user_oauth_tokens
               (user_id, provider, access_token_enc, refresh_token_enc, expiry_date, scope, last_refresh_at)
             VALUES ($1, 'google', $2, $3, $4, $5, NOW())
             ON CONFLICT (user_id, provider)
             DO UPDATE SET
               access_token_enc  = EXCLUDED.access_token_enc,
               refresh_token_enc = COALESCE(EXCLUDED.refresh_token_enc, user_oauth_tokens.refresh_token_enc),
               expiry_date       = EXCLUDED.expiry_date,
               scope             = EXCLUDED.scope,
               last_refresh_at   = NOW(),
               updated_at        = NOW()`,
            [userId, accessEnc, refreshEnc, tokens.expiry_date, (tokens.scope || '')]
        );

        if (stateData.isLogin) {
            // Generate Supabase session link for the user
            const { data: link, error: linkError } = await supabaseAdmin.auth.admin.generateLink({
                type: 'magiclink',
                email: email,
                options: { redirectTo: `${frontendUrl}/` }
            });

            if (linkError) throw linkError;
            return res.redirect(link.properties.action_link);
        }

        res.redirect(`${frontendUrl}/auth/callback?status=success`);
    } catch (err) {
        console.error('[googleAuth/callback]', err.message);
        res.redirect(`${frontendUrl}/auth/callback?status=error&reason=exchange_failed`);
    }
});

router.post('/auth/disconnect', requireAuth, async (req, res) => {
    try {
        await pool.query('DELETE FROM user_oauth_tokens WHERE user_id = $1 AND provider = $2', [req.userId, 'google']);
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: 'Disconnect failed' });
    }
});

router.get('/auth/status', requireAuth, async (req, res) => {
    try {
        const status = await getIntegrationStatus(req.userId, 'google');
        res.json({
            calendar: { connected: status.connected, error: status.error },
            youtube: { connected: status.connected, error: status.error },
            scopes: status.scopes,
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

export default router;

