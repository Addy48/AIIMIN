/**
 * routes/googleAuth.js
 *
 * Proper Authorization Code flow for Google OAuth.
 * Tokens are NEVER returned to the frontend — only status is exposed.
 *
 * Flow:
 *   1. Frontend: GET /google/auth/init  → receives { authUrl }
 *   2. Frontend: window.location.href = authUrl
 *   3. Google: redirects to GOOGLE_REDIRECT_URI (/google/auth/callback)
 *   4. Backend: exchanges code → encrypts tokens → stores → redirects to frontend
 */
import express from 'express';
import { google } from 'googleapis';
import crypto from 'crypto';
import { pool, getIntegrationStatus } from '../lib/googleClient.js';
import { encrypt } from '../lib/crypto.js';
import { logOAuthEvent } from '../lib/oauthLogger.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

// In-memory CSRF state store (use Redis in production)
const oauthStates = new Map();
const STATE_TTL_MS = 10 * 60 * 1000; // 10 minutes

const createOAuthClient = () => new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI // e.g. https://api.aiimin.in/google/auth/callback
);

const SCOPES = [
    'https://www.googleapis.com/auth/calendar.readonly',
    'https://www.googleapis.com/auth/youtube.readonly',
    'profile',
    'email',
];

/**
 * Step 1: Generate the Google OAuth consent URL.
 * Authenticated — user must be logged in to initiate.
 */
router.get('/auth/init', requireAuth, (req, res) => {
    const client = createOAuthClient();
    const state = crypto.randomBytes(16).toString('hex');

    // Store: state → userId, expire after TTL
    oauthStates.set(state, {
        userId: req.userId,
        expiresAt: Date.now() + STATE_TTL_MS,
    });

    const authUrl = client.generateAuthUrl({
        access_type: 'offline',
        prompt: 'consent',       // Force refresh_token on every auth
        scope: SCOPES,
        state,
    });

    logOAuthEvent(pool, req.userId, 'google', 'authorize', {
        scopes: SCOPES,
        redirect_uri: process.env.GOOGLE_REDIRECT_URI,
    }, req.ip);

    res.json({ authUrl });
});

/**
 * Step 2: Google redirects here with ?code=&state=
 * Public — no auth header (Google can't send one).
 * After success, redirects browser to FRONTEND_URL/auth/callback?status=success
 */
router.get('/auth/callback', async (req, res) => {
    const { code, state, error: googleError } = req.query;
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';

    if (googleError) {
        return res.redirect(`${frontendUrl}/auth/callback?status=error&reason=${encodeURIComponent(googleError)}`);
    }

    // Validate CSRF state
    const stateData = oauthStates.get(state);
    if (!stateData || Date.now() > stateData.expiresAt) {
        return res.redirect(`${frontendUrl}/auth/callback?status=error&reason=invalid_state`);
    }
    oauthStates.delete(state);
    const userId = stateData.userId;

    try {
        const client = createOAuthClient();
        const { tokens } = await client.getToken(code);

        if (!tokens.refresh_token) {
            // This happens if user already granted access before — force re-consent
            await logOAuthEvent(pool, userId, 'google', 'exchange_warn', {
                message: 'No refresh_token returned — user may need to revoke and re-authorize',
            });
        }

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
               refresh_error     = NULL,
               updated_at        = NOW()`,
            [userId, accessEnc, refreshEnc, tokens.expiry_date, (tokens.scope || '')]
        );

        await logOAuthEvent(pool, userId, 'google', 'exchange', {
            scopes: tokens.scope,
            has_refresh_token: !!tokens.refresh_token,
        });

        res.redirect(`${frontendUrl}/auth/callback?status=success`);
    } catch (err) {
        console.error('[googleAuth/callback]', err.message);
        await logOAuthEvent(pool, userId, 'google', 'error', { error: err.message });
        res.redirect(`${frontendUrl}/auth/callback?status=error&reason=exchange_failed`);
    }
});

/**
 * Disconnect: revoke token at Google, delete from DB.
 */
router.post('/auth/disconnect', requireAuth, async (req, res) => {
    try {
        const result = await pool.query(
            'SELECT access_token_enc FROM user_oauth_tokens WHERE user_id = $1 AND provider = $2',
            [req.userId, 'google']
        );

        if (result.rows.length > 0) {
            // Best-effort revoke at Google
            try {
                const client = createOAuthClient();
                const { decrypt } = await import('../lib/crypto.js');
                await client.revokeToken(decrypt(result.rows[0].access_token_enc));
            } catch (_) { /* Revoke failure is non-fatal */ }
        }

        await pool.query(
            'DELETE FROM user_oauth_tokens WHERE user_id = $1 AND provider = $2',
            [req.userId, 'google']
        );

        await logOAuthEvent(pool, req.userId, 'google', 'disconnect', {}, req.ip);
        res.json({ success: true });
    } catch (err) {
        console.error('[googleAuth/disconnect]', err.message);
        res.status(500).json({ error: 'Disconnect failed' });
    }
});

/**
 * Integration status — safe to expose to frontend.
 */
router.get('/auth/status', requireAuth, async (req, res) => {
    try {
        const status = await getIntegrationStatus(req.userId, 'google');
        res.json({
            calendar: {
                connected: status.connected,
                error: status.error,
                lastRefresh: status.lastRefresh,
            },
            youtube: {
                connected: status.connected, // shares same token for now
                error: status.error,
            },
            scopes: status.scopes,
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

export default router;
