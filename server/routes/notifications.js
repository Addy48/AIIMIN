/**
 * routes/notifications.js
 * In-app notification system — uses pool.query() against Supabase PostgreSQL.
 */
import { Hono } from 'hono';
import { pool } from '../lib/db.js';
import { requireAuth } from '../middleware/auth.js';

const app = new Hono();

/**
 * GET /api/notifications
 */
app.get('/', requireAuth, async (c) => {
    try {
        const userId = c.get('userId');
        const limit = Math.min(parseInt(c.req.query('limit') || '30'), 100);
        const offset = parseInt(c.req.query('offset') || '0', 10);

        const { rows } = await pool.query(
            `SELECT id, type, title, body, action_url, read_at, created_at
             FROM notifications
             WHERE user_id = $1 AND dismissed_at IS NULL
             ORDER BY created_at DESC
             LIMIT $2 OFFSET $3`,
            [userId, limit, offset]
        );
        return c.json(rows);
    } catch (err) {
        return c.json({ error: err.message }, 500);
    }
});

/**
 * GET /api/notifications/count
 */
app.get('/count', requireAuth, async (c) => {
    try {
        const userId = c.get('userId');
        const { rows } = await pool.query(
            `SELECT COUNT(*) AS unread FROM notifications
             WHERE user_id = $1 AND dismissed_at IS NULL AND read_at IS NULL`,
            [userId]
        );
        return c.json({ unread: parseInt(rows[0]?.unread || '0') });
    } catch (err) {
        return c.json({ error: err.message }, 500);
    }
});

/**
 * PATCH /api/notifications/:id/read
 */
app.patch('/:id/read', requireAuth, async (c) => {
    try {
        const userId = c.get('userId');
        const id = c.req.param('id');
        const { rowCount } = await pool.query(
            `UPDATE notifications SET read_at = NOW()
             WHERE id = $1 AND user_id = $2 AND read_at IS NULL`,
            [id, userId]
        );
        if (rowCount === 0) return c.json({ error: 'Already read or not found' }, 404);
        return c.json({ success: true });
    } catch (err) {
        return c.json({ error: err.message }, 500);
    }
});

/**
 * POST /api/notifications/mark-all-read
 */
app.post('/mark-all-read', requireAuth, async (c) => {
    try {
        const userId = c.get('userId');
        const { rowCount } = await pool.query(
            `UPDATE notifications SET read_at = NOW()
             WHERE user_id = $1 AND dismissed_at IS NULL AND read_at IS NULL`,
            [userId]
        );
        return c.json({ updated: rowCount || 0 });
    } catch (err) {
        return c.json({ error: err.message }, 500);
    }
});

/**
 * DELETE /api/notifications/:id — soft dismiss
 */
app.delete('/:id', requireAuth, async (c) => {
    try {
        const userId = c.get('userId');
        const id = c.req.param('id');
        const { rowCount } = await pool.query(
            `UPDATE notifications SET dismissed_at = NOW()
             WHERE id = $1 AND user_id = $2 AND dismissed_at IS NULL`,
            [id, userId]
        );
        if (rowCount === 0) return c.json({ error: 'Notification not found' }, 404);
        return c.json({ success: true });
    } catch (err) {
        return c.json({ error: err.message }, 500);
    }
});

/**
 * Internal helper — creates a deduped notification via direct SQL
 */
export const createNotification = async (userId, type, title, body = null, actionUrl = null, dedupWindowHours = 24) => {
    try {
        const cutoff = new Date(Date.now() - dedupWindowHours * 3600000).toISOString();
        const { rows: existing } = await pool.query(
            `SELECT id FROM notifications
             WHERE user_id = $1 AND type = $2 AND title = $3
               AND dismissed_at IS NULL AND created_at > $4 LIMIT 1`,
            [userId, type, title, cutoff]
        );
        if (existing.length > 0) return;
        await pool.query(
            `INSERT INTO notifications (user_id, type, title, body, action_url)
             VALUES ($1, $2, $3, $4, $5)`,
            [userId, type, title, body, actionUrl]
        );
    } catch (err) {
        console.error('[createNotification] error:', err.message);
    }
};

export default app;
