/**
 * routes/notifications.js
 *
 * In-app notification system.
 * Notifications created server-side only — never from frontend.
 * createNotification() has 24h dedup guard to prevent notification spam.
 */
import express from 'express';
import { pool } from '../lib/googleClient.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

/**
 * Typed error codes used by all integration health responses.
 * Allows IntegrationHealthCard to show specific error states.
 */
export const INTEGRATION_ERROR_CODES = {
    TOKEN_EXPIRED: 'token_expired',
    REFRESH_FAILED: 'refresh_failed',
    SCOPE_INSUFFICIENT: 'scope_insufficient',
    QUOTA_EXCEEDED: 'quota_exceeded',
    REVOKED_BY_USER: 'revoked_by_user',
    UNKNOWN: 'unknown',
};

/**
 * GET /notifications
 * List active (non-dismissed) notifications, newest first.
 * Optional: ?limit=20&offset=0
 */
router.get('/', requireAuth, async (req, res) => {
    try {
        const limit = Math.min(parseInt(req.query.limit || 30), 100);
        const offset = parseInt(req.query.offset || 0, 10);

        const result = await pool.query(
            `SELECT id, type, title, body, action_url, read_at, created_at
             FROM notifications
             WHERE user_id = $1 AND dismissed_at IS NULL
             ORDER BY created_at DESC
             LIMIT $2 OFFSET $3`,
            [req.userId, limit, offset]
        );

        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

/**
 * GET /notifications/count
 * Returns { unread: N } — used for the bell badge.
 * Lightweight endpoint, safe to poll every 60s.
 */
router.get('/count', requireAuth, async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT COUNT(*)::int AS unread
             FROM notifications
             WHERE user_id = $1 AND dismissed_at IS NULL AND read_at IS NULL`,
            [req.userId]
        );
        res.json({ unread: result.rows[0].unread });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

/**
 * PATCH /notifications/:id/read
 * Mark a single notification as read.
 */
router.patch('/:id/read', requireAuth, async (req, res) => {
    try {
        const result = await pool.query(
            `UPDATE notifications
             SET read_at = NOW()
             WHERE id = $1 AND user_id = $2 AND read_at IS NULL
             RETURNING id`,
            [req.params.id, req.userId]
        );
        if (result.rowCount === 0) return res.status(404).json({ error: 'Notification not found or already read' });
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

/**
 * POST /notifications/mark-all-read
 * Mark all unread notifications as read.
 */
router.post('/mark-all-read', requireAuth, async (req, res) => {
    try {
        const result = await pool.query(
            `UPDATE notifications
             SET read_at = NOW()
             WHERE user_id = $1 AND dismissed_at IS NULL AND read_at IS NULL`,
            [req.userId]
        );
        res.json({ updated: result.rowCount });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

/**
 * DELETE /notifications/:id
 * Dismiss a notification (soft delete via dismissed_at).
 */
router.delete('/:id', requireAuth, async (req, res) => {
    try {
        const result = await pool.query(
            `UPDATE notifications
             SET dismissed_at = NOW()
             WHERE id = $1 AND user_id = $2 AND dismissed_at IS NULL
             RETURNING id`,
            [req.params.id, req.userId]
        );
        if (result.rowCount === 0) return res.status(404).json({ error: 'Notification not found' });
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

/**
 * Internal helper — exported for use by commitment/drift controllers and background jobs.
 * De-duplicates: same type + title cannot be inserted within dedupWindowHours (default 24h).
 * This prevents notification spam from repeated cron runs or rapid triggers.
 *
 * @param {string} userId
 * @param {string} type
 * @param {string} title
 * @param {string|null} body
 * @param {string|null} actionUrl
 * @param {number} dedupWindowHours  - default 24h; use 48h for weekly drift alerts
 */
export const createNotification = async (userId, type, title, body = null, actionUrl = null, dedupWindowHours = 24) => {
    await pool.query(
        `INSERT INTO notifications (user_id, type, title, body, action_url)
         SELECT $1, $2, $3, $4, $5
         WHERE NOT EXISTS (
           SELECT 1 FROM notifications
           WHERE user_id      = $1
             AND type         = $2
             AND title        = $3
             AND dismissed_at IS NULL
             AND created_at   > NOW() - ($6 || ' hours')::interval
         )`,
        [userId, type, title, body, actionUrl, String(dedupWindowHours)]
    );
};

export default router;
