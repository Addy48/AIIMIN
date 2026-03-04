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
            'SELECT id, email, full_name, username, role, onboarding_stage, timezone, avatar_url, created_at FROM users WHERE id = $1',
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

        // S12: Also persist to Supabase auth metadata so name survives session refresh
        if (allowed.full_name !== undefined) {
            try {
                await adminSupabase.auth.admin.updateUserById(req.userId, {
                    user_metadata: { full_name: allowed.full_name }
                });
            } catch (metaErr) {
                console.error('[account/profile] Auth metadata update failed:', metaErr.message);
                // Non-fatal — users table is the source of truth
            }
        }

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

        const totalFocusMin = pomodoro.rows.reduce((a, s) => a + (s.duration || 0), 0);
        const totalSpent = transactions.rows.filter(t => t.type === 'expense').reduce((a, t) => a + Number(t.amount || 0), 0);
        const totalIncome = transactions.rows.filter(t => t.type === 'income').reduce((a, t) => a + Number(t.amount || 0), 0);
        const avgSleep = logs.rows.length > 0
            ? (logs.rows.reduce((a, l) => a + (l.sleep_hours || 0), 0) / logs.rows.length).toFixed(1)
            : 0;

        const exportData = {
            export_format: 'aiimin_v1',
            app_version: '2.0.0',
            exported_at: new Date().toISOString(),
            export_date: new Date().toISOString().split('T')[0],
            user: profile.rows[0],
            daily_logs: {
                summary: {
                    total_entries: logs.rows.length,
                    avg_sleep_hours: Number(avgSleep),
                    date_range: logs.rows.length > 0
                        ? `${logs.rows[logs.rows.length - 1].date} to ${logs.rows[0].date}`
                        : null,
                },
                entries: logs.rows,
            },
            focus_sessions: {
                summary: {
                    total_sessions: pomodoro.rows.length,
                    total_focus_hours: Math.round((totalFocusMin / 60) * 10) / 10,
                },
                entries: pomodoro.rows,
            },
            financial: {
                summary: {
                    total_income: totalIncome,
                    total_expenses: totalSpent,
                    net: totalIncome - totalSpent,
                },
                entries: transactions.rows,
            },
            goals: goals.rows,
            wins: wins.rows,
            commitments: commitments.rows,
            weekly_summaries: summaries.rows,
            notifications: notifications.rows,
            insights: {
                top_correlations: [],
            },
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
