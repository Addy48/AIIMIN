/**
 * routes/account.js
 *
 * Account Settings API:
 *   - Profile editing (name, timezone, avatar_url)
 *   - Data export (full JSON download)
 *   - Account deletion (CASCADE from Supabase auth)
 *   - Integration overview
 */
import express from 'express';
import { pool, getIntegrationStatus } from '../lib/googleClient.js';
import { requireAuth } from '../middleware/auth.js';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const router = express.Router();

const adminSupabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

/**
 * GET /account/profile
 */
router.get('/profile', requireAuth, async (req, res) => {
    try {
        const result = await pool.query(
            'SELECT id, email, full_name, timezone, avatar_url, created_at FROM users WHERE id = $1',
            [req.userId]
        );
        if (result.rows.length === 0) return res.status(404).json({ error: 'User not found' });
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

/**
 * PATCH /account/profile
 * Update: full_name, timezone, avatar_url
 */
router.patch('/profile', requireAuth, async (req, res) => {
    try {
        const { full_name, timezone, avatar_url } = req.body;

        const allowed = {};
        if (full_name !== undefined) allowed.full_name = full_name;
        if (timezone !== undefined) allowed.timezone = timezone;
        if (avatar_url !== undefined) allowed.avatar_url = avatar_url;

        if (Object.keys(allowed).length === 0) {
            return res.status(400).json({ error: 'No valid fields to update' });
        }

        const setClauses = Object.keys(allowed).map((k, i) => `${k} = $${i + 1}`);
        const values = [...Object.values(allowed), req.userId];

        const result = await pool.query(
            `UPDATE users SET ${setClauses.join(', ')}, updated_at = NOW()
             WHERE id = $${values.length} RETURNING id, email, full_name, timezone, avatar_url`,
            values
        );

        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

/**
 * GET /account/integrations
 * Returns status of all OAuth integrations (no token values).
 */
router.get('/integrations', requireAuth, async (req, res) => {
    try {
        const status = await getIntegrationStatus(req.userId, 'google');
        const hasCalendarScope = status.scopes?.some(s => s.includes('calendar'));
        const hasYoutubeScope = status.scopes?.some(s => s.includes('youtube'));
        res.json({
            google_calendar: {
                connected: status.connected && hasCalendarScope,
                error: status.error,
                lastRefresh: status.lastRefresh,
            },
            youtube: {
                connected: status.connected && hasYoutubeScope,
                error: status.error,
                lastRefresh: status.lastRefresh,
            },
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

/**
 * GET /account/export
 * Full data export as JSON. Streams all user data.
 */
router.get('/export', requireAuth, async (req, res) => {
    try {
        const userId = req.userId;

        const [profile, logs, goals, pomodoro, transactions, wins, commitments, summaries, notifications] = await Promise.all([
            pool.query('SELECT id, email, full_name, timezone, created_at FROM users WHERE id = $1', [userId]),
            pool.query('SELECT * FROM daily_logs WHERE user_id = $1 ORDER BY date DESC', [userId]),
            pool.query('SELECT * FROM goals WHERE user_id = $1', [userId]),
            pool.query('SELECT * FROM pomodoro_sessions WHERE user_id = $1 ORDER BY date DESC', [userId]),
            pool.query('SELECT * FROM money_transactions WHERE user_id = $1 ORDER BY date DESC', [userId]),
            pool.query('SELECT * FROM wins WHERE user_id = $1 ORDER BY date DESC', [userId]),
            pool.query('SELECT date, targets, met_count, fulfillment_pct, evaluated_at FROM daily_commitments WHERE user_id = $1 ORDER BY date DESC', [userId]),
            pool.query('SELECT week_start, data, generated_at FROM weekly_summaries WHERE user_id = $1 ORDER BY week_start DESC', [userId]),
            pool.query('SELECT type, title, body, created_at FROM notifications WHERE user_id = $1 ORDER BY created_at DESC', [userId]),
        ]);

        const exportData = {
            exported_at: new Date().toISOString(),
            profile: profile.rows[0],
            daily_logs: logs.rows,
            goals: goals.rows,
            pomodoro_sessions: pomodoro.rows,
            money_transactions: transactions.rows,
            wins: wins.rows,
            commitments: commitments.rows,
            weekly_summaries: summaries.rows,
            notifications: notifications.rows,
        };

        res.setHeader('Content-Type', 'application/json');
        res.setHeader('Content-Disposition', `attachment; filename="aiimin-export-${userId.slice(0, 8)}-${new Date().toISOString().slice(0, 10)}.json"`);
        res.json(exportData);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

/**
 * DELETE /account
 * Permanently delete all user data + revoke auth.
 * Requires { confirm: "DELETE" } in body as confirmation.
 */
router.delete('/', requireAuth, async (req, res) => {
    try {
        if (req.body.confirm !== 'DELETE') {
            return res.status(400).json({ error: 'Send { confirm: "DELETE" } to permanently delete your account' });
        }

        const userId = req.userId;

        // All table deletes cascade from users(id), so just delete the user record + auth entry
        await pool.query('DELETE FROM users WHERE id = $1', [userId]);

        // Soft-delete from Supabase auth (uses admin client)
        const { error: authErr } = await adminSupabase.auth.admin.deleteUser(userId);
        if (authErr) {
            console.error('[account/delete] Supabase auth delete error:', authErr.message);
            // Non-fatal if data is already deleted
        }

        res.json({ success: true, message: 'Account permanently deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

export default router;
