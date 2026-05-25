/**
 * lib/googleClient.js
 *
 * Shared factory for creating authenticated Google API clients.
 * Reads encrypted tokens from DB, auto-refreshes on expiry, logs refresh events.
 */
import { google } from 'googleapis';
import { encrypt, decrypt } from './crypto.js';
import { logOAuthEvent } from './oauthLogger.js';
import { pool } from './db.js';
import dotenv from 'dotenv';
dotenv.config();

// Re-export pool for backward compatibility (M-1: pool now lives in lib/db.js)
export { pool };

/**
 * Returns an authenticated OAuth2 client for the given user.
 * Handles: decryption, credential loading, token refresh + re-encryption.
 *
 * @param {string} userId  - Supabase user UUID
 * @param {string} [provider='google'] - for future multi-provider support
 * @returns {google.auth.OAuth2}
 */
export const getOAuthClient = async (userId, provider = 'google') => {
    const result = await pool.query(
        `SELECT access_token_enc, refresh_token_enc, access_token, refresh_token,
                expiry_date, scope, refresh_error
         FROM user_oauth_tokens
         WHERE user_id = $1 AND provider = $2`,
        [userId, provider]
    );

    if (result.rows.length === 0) {
        throw Object.assign(new Error('Google account not connected'), { code: 'NOT_CONNECTED' });
    }

    const row = result.rows[0];

    // Decrypt encrypted tokens (fallback to plaintext during transition period)
    let accessToken, refreshToken;
    try {
        accessToken = row.access_token_enc ? decrypt(row.access_token_enc) : row.access_token;
        refreshToken = row.refresh_token_enc ? decrypt(row.refresh_token_enc) : row.refresh_token;
    } catch (decryptErr) {
        await logOAuthEvent(pool, userId, provider, 'decrypt_error', { error: decryptErr.message });
        throw Object.assign(new Error('Token decryption failed — please reconnect your Google account'), { code: 'TOKEN_DECRYPT_ERROR' });
    }

    const client = new google.auth.OAuth2(
        process.env.GOOGLE_CLIENT_ID,
        process.env.GOOGLE_CLIENT_SECRET,
        process.env.GOOGLE_REDIRECT_URI || process.env.GOOGLE_CALLBACK_URL || 'https://aiimin.in/api/google/auth/callback'
    );

    client.setCredentials({
        access_token: accessToken,
        refresh_token: refreshToken,
        expiry_date: row.expiry_date ? Number(row.expiry_date) : undefined,
    });

    // Auto-refresh if expired or within 5 minutes of expiry
    const isExpiredSoon = row.expiry_date && (Date.now() > Number(row.expiry_date) - 5 * 60 * 1000);
    if (isExpiredSoon) {
        try {
            const { credentials } = await client.refreshAccessToken();
            const newAccessEnc = encrypt(credentials.access_token);
            const newRefreshEnc = credentials.refresh_token
                ? encrypt(credentials.refresh_token)
                : null;

            await pool.query(
                `UPDATE user_oauth_tokens
                 SET access_token_enc  = $1,
                     refresh_token_enc = COALESCE($2, refresh_token_enc),
                     expiry_date       = $3,
                     last_refresh_at   = NOW(),
                     refresh_error     = NULL,
                     updated_at        = NOW()
                 WHERE user_id = $4 AND provider = $5`,
                [newAccessEnc, newRefreshEnc, credentials.expiry_date, userId, provider]
            );

            await logOAuthEvent(pool, userId, provider, 'refresh', {
                expires_at: new Date(credentials.expiry_date).toISOString(),
            });

            client.setCredentials(credentials);
        } catch (refreshErr) {
            // Store the error for display in integration health
            await pool.query(
                `UPDATE user_oauth_tokens
                 SET refresh_error = $1, updated_at = NOW()
                 WHERE user_id = $2 AND provider = $3`,
                [refreshErr.message, userId, provider]
            );
            await logOAuthEvent(pool, userId, provider, 'refresh_error', { error: refreshErr.message });
            throw Object.assign(
                new Error('Token refresh failed — please reconnect your Google account'),
                { code: 'TOKEN_REFRESH_ERROR' }
            );
        }
    }

    return client;
};

/**
 * Convenience: return an authenticated Calendar v3 client.
 */
export const getCalendarClient = async (userId) => {
    const auth = await getOAuthClient(userId, 'google');
    return google.calendar({ version: 'v3', auth });
};

/**
 * Convenience: return an authenticated YouTube v3 client.
 */
export const getYouTubeClient = async (userId) => {
    const auth = await getOAuthClient(userId, 'google');
    return google.youtube({ version: 'v3', auth });
};

/**
 * Check integration status without throwing — returns { connected, error, scopes, lastRefresh }
 */
export const getIntegrationStatus = async (userId, provider = 'google') => {
    const result = await pool.query(
        `SELECT expiry_date, scope, refresh_error, last_refresh_at, updated_at
         FROM user_oauth_tokens WHERE user_id = $1 AND provider = $2`,
        [userId, provider]
    );
    if (result.rows.length === 0) return { connected: false, error: null };
    const row = result.rows[0];
    const hasRefreshError = !!row.refresh_error;
    const isExpired = row.expiry_date && Date.now() > Number(row.expiry_date);
    return {
        connected: !hasRefreshError && !isExpired,
        error: row.refresh_error || null,
        scopes: row.scope ? row.scope.split(' ') : [],
        lastRefresh: row.last_refresh_at,
        lastUpdated: row.updated_at,
    };
};
