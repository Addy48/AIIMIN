/**
 * routes/account.js
 *
 * Account Settings API:
 * Refactored for Hono / Cloudflare Workers.
 */
import { Hono } from 'hono';
import { pool } from '../lib/db.js';
import { requireAuth } from '../middleware/auth.js';

import { decrypt, encrypt } from '../lib/crypto.js';

const app = new Hono();

/**
 * GET /api/account/profile
 */
app.get('/profile', requireAuth, async (c) => {
    try {
        const userId = c.get('userId');
        const user = c.get('user');

        const { rows } = await pool.query(
            'SELECT id, email, full_name, username, role, onboarding_stage, timezone, avatar_url, created_at FROM users WHERE id = $1',
            [userId]
        );
        let data = rows[0] || null;

        if (!data) {
            const meta = user?.user_metadata || {};
            const { rows: newRows } = await pool.query(
                `INSERT INTO users (id, email, full_name, username, avatar_url, timezone)
                 VALUES ($1, $2, $3, $4, $5, $6)
                 ON CONFLICT (id) DO UPDATE SET
                     email = EXCLUDED.email,
                     full_name = COALESCE(users.full_name, EXCLUDED.full_name),
                     username = COALESCE(users.username, EXCLUDED.username),
                     avatar_url = COALESCE(users.avatar_url, EXCLUDED.avatar_url),
                     timezone = COALESCE(users.timezone, EXCLUDED.timezone)
                 RETURNING id, email, full_name, username, role, onboarding_stage, timezone, avatar_url, created_at`,
                [
                    userId,
                    user?.email,
                    meta.full_name || meta.name || null,
                    meta.username || null,
                    meta.avatar_url || meta.picture || null,
                    meta.timezone || 'Asia/Kolkata'
                ]
            );
            data = newRows[0];
        }

        return c.json(data);
    } catch (err) {
        return c.json({ error: err.message }, 500);
    }
});

/**
 * PATCH /api/account/profile
 */
app.patch('/profile', requireAuth, async (c) => {
    try {
        const userId = c.get('userId');
        const body = await c.req.json();
        const { full_name, timezone, avatar_url } = body;

        const updates = {};
        if (full_name !== undefined) updates.full_name = full_name;
        if (timezone !== undefined) updates.timezone = timezone;
        if (avatar_url !== undefined) updates.avatar_url = avatar_url;

        if (Object.keys(updates).length === 0) {
            return c.json({ error: 'No valid fields to update' }, 400);
        }

        const keys = Object.keys(updates);
        const values = Object.values(updates);
        const setClauses = keys.map((key, idx) => `${key} = $${idx + 2}`).join(', ');

        const { rows } = await pool.query(
            `UPDATE users SET ${setClauses} WHERE id = $1 RETURNING id, email, full_name, username, role, onboarding_stage, timezone, avatar_url, created_at`,
            [userId, ...values]
        );

        if (rows.length === 0) {
            return c.json({ error: 'User not found' }, 404);
        }

        const data = rows[0];

        // Sync to Auth Metadata (Async, non-blocking)
        // adminSupabase.auth.admin.updateUserById(userId, {
        //     user_metadata: {
        //         ...(c.get('user')?.user_metadata || {}),
        //         ...updates
        //     }
        // }).catch(e => console.error('[account/profile] Auth sync failed:', e));

        return c.json(data);
    } catch (err) {
        return c.json({ error: err.message }, 500);
    }
});

/**
 * GET /api/account/export
 */
app.get('/export', requireAuth, async (c) => {
    try {
        const userId = c.get('userId');

        const [userRes, dlRes, mtRes, wRes, dcRes, nRes] = await Promise.all([
            pool.query('SELECT * FROM users WHERE id = $1', [userId]),
            pool.query('SELECT * FROM daily_logs WHERE user_id = $1 ORDER BY date DESC', [userId]),
            pool.query('SELECT * FROM money_transactions WHERE user_id = $1 ORDER BY date DESC', [userId]).catch(() => ({ rows: [] })),
            pool.query('SELECT * FROM wins WHERE user_id = $1 ORDER BY date DESC', [userId]).catch(() => ({ rows: [] })),
            pool.query('SELECT * FROM daily_commitments WHERE user_id = $1 ORDER BY date DESC', [userId]).catch(() => ({ rows: [] })),
            pool.query('SELECT * FROM notifications WHERE user_id = $1 ORDER BY created_at DESC', [userId]).catch(() => ({ rows: [] })),
        ]);

        const exportData = {
            export_format: 'aiimin_v1',
            exported_at: new Date().toISOString(),
            user: userRes.rows[0] || null,
            daily_logs: dlRes.rows,
            finances: mtRes.rows,
            wins: wRes.rows,
            commitments: dcRes.rows,
            notifications: nRes.rows,
        };

        return c.json(exportData, 200, {
            'Content-Disposition': `attachment; filename="aiimin-export-${userId.slice(0, 8)}.json"`
        });
    } catch (err) {
        return c.json({ error: err.message }, 500);
    }
});

/**
 * DELETE /api/account
 */
app.delete('/', requireAuth, async (c) => {
    try {
        const body = await c.req.json();
        if (body.confirm !== 'DELETE') {
            return c.json({ error: 'Send { confirm: "DELETE" } to confirm' }, 400);
        }
        const userId = c.get('userId');

        // Revoke Google token if stored
        try {
            const { rows: tokenRows } = await pool.query(
                `SELECT access_token_enc FROM user_oauth_tokens WHERE user_id = $1 AND provider = 'google' LIMIT 1`,
                [userId]
            );
            if (tokenRows[0]?.access_token_enc) {
                const token = decrypt(tokenRows[0].access_token_enc);
                fetch(`https://oauth2.googleapis.com/revoke?token=${token}`, { method: 'POST' }).catch(() => {});
            }
        } catch (_) {}

        await pool.query('DELETE FROM users WHERE id = $1', [userId]);
        // await adminSupabase.auth.admin.deleteUser(userId);

        return c.json({ success: true, message: 'Account permanently deleted' });
    } catch (err) {
        return c.json({ error: err.message }, 500);
    }
});

export default app;
