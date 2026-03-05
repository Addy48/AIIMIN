/**
 * lib/oauthLogger.js
 *
 * Structured OAuth lifecycle event logger.
 * Writes to oauth_audit_log table. Never throws — logging failures
 * are console-only so they don't break the main request flow.
 */

/**
 * @param {pg.Pool} pool
 * @param {string}  userId
 * @param {string}  provider    - 'google' | 'google_calendar' | 'youtube'
 * @param {string}  event       - 'authorize' | 'exchange' | 'refresh' | 'refresh_error' | 'revoke' | 'disconnect' | 'error' | 'decrypt_error'
 * @param {object}  [detail={}] - Extra metadata (never include raw tokens)
 * @param {string}  [ip]        - Request IP address
 */
export const logOAuthEvent = async (pool, userId, provider, event, detail = {}, ip = null) => {
    try {
        // Strip any accidental token values from detail before logging
        const safeDetail = JSON.parse(JSON.stringify(detail));
        delete safeDetail.access_token;
        delete safeDetail.refresh_token;
        delete safeDetail.code;

        await pool.query(
            `INSERT INTO oauth_audit_log (user_id, provider, event, detail, ip_address)
             VALUES ($1, $2, $3, $4, $5)`,
            [userId, provider, event, JSON.stringify(safeDetail), ip]
        );
    } catch (err) {
        // Logging must never break the request
        console.error('[oauthLogger] Failed to write audit log:', err.message, { userId, provider, event });
    }
};
