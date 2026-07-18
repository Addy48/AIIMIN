/**
 * routes/dashboard.js
 * Aggregate dashboard endpoint — uses pool.query() against Supabase PostgreSQL.
 */
import { Hono } from 'hono';
import { pool } from '../lib/db.js';
import { requireAuth } from '../middleware/auth.js';

const app = new Hono();

/**
 * GET /api/dashboard/summary
 */
app.get('/summary', requireAuth, async (c) => {
    try {
        const userId = c.get('userId');
        const today = new Date().toISOString().slice(0, 10);
        const sevenDaysAgo = new Date(Date.now() - 7 * 86400000).toISOString().slice(0, 10);

        const [logRes, commitRes, notifRes, weekLogsRes] = await Promise.all([
            pool.query(
                'SELECT * FROM daily_logs WHERE user_id = $1 AND date = $2 LIMIT 1',
                [userId, today]
            ),
            pool.query(
                'SELECT * FROM daily_commitments WHERE user_id = $1 AND date = $2 LIMIT 1',
                [userId, today]
            ),
            pool.query(
                `SELECT type, title, body, read_at, created_at FROM notifications
                 WHERE user_id = $1 AND dismissed_at IS NULL
                 ORDER BY created_at DESC LIMIT 20`,
                [userId]
            ),
            pool.query(
                'SELECT * FROM daily_logs WHERE user_id = $1 AND date >= $2 ORDER BY date DESC',
                [userId, sevenDaysAgo]
            ),
        ]);

        const log = logRes.rows[0] || null;
        const commit = commitRes.rows[0] || null;
        const allNotifs = notifRes.rows || [];
        const drifts = allNotifs.filter(n => n.type === 'drift_alert').slice(0, 5);
        const unreadCount = allNotifs.filter(n => !n.read_at).length;

        // Simple momentum score from logs
        const logs = weekLogsRes.rows || [];
        const avgMood = logs.length > 0
            ? Math.round(logs.reduce((s, l) => s + (l.mood || 0), 0) / logs.length)
            : null;

        return c.json({
            stats_today: log ? {
                sleep_hours: log.sleep_hours,
                gym_done: log.gym_done,
                steps: log.steps,
                mood: log.mood,
                energy_level: log.energy_level,
                water_bottles: log.water_bottles,
                learning_done: log.learning_done,
            } : null,
            commitment_today: commit ? {
                targets: commit.targets,
                met_count: commit.met_count,
                total_count: commit.total_count,
                fulfillment_pct: parseFloat(commit.fulfillment_pct),
            } : null,
            drift_alerts: drifts,
            weekly_insight: { avg_mood: avgMood, days_logged: logs.length },
            integration_health: {
                calendar: { connected: false },
            },
            notifications: { unread: unreadCount },
            momentum: { score: Math.min(100, logs.length * 14), days: logs.length },
        });
    } catch (err) {
        console.error('[dashboard/summary] Fatal:', err);
        return c.json({ error: err.message }, 500);
    }
});

/**
 * GET /api/dashboard/widgets — 7-day rollup for Overview widgets
 */
app.get('/widgets', requireAuth, async (c) => {
    try {
        const userId = c.get('userId');
        const sevenDaysAgo = new Date(Date.now() - 7 * 86400000).toISOString().split('T')[0];

        const [logsRes, journalRes, spendRes, labRes] = await Promise.all([
            pool.query(
                `SELECT mood FROM daily_logs
                 WHERE user_id = $1 AND date >= $2 AND mood IS NOT NULL`,
                [userId, sevenDaysAgo]
            ),
            pool.query(
                `SELECT COUNT(*)::int AS count FROM journal_entries
                 WHERE user_id = $1 AND date >= $2`,
                [userId, sevenDaysAgo]
            ),
            pool.query(
                `SELECT
                    COALESCE(SUM(CASE WHEN type IN ('expense', 'transfer_out', 'lend') THEN ABS(amount) ELSE 0 END), 0)::numeric AS expense_total,
                    COALESCE(SUM(CASE WHEN type IN ('income', 'transfer_in', 'repayment') THEN amount ELSE 0 END), 0)::numeric AS income_total,
                    COUNT(*)::int AS transaction_count
                 FROM money_transactions
                 WHERE user_id = $1 AND date >= $2`,
                [userId, sevenDaysAgo]
            ),
            pool.query(
                `SELECT COUNT(*)::int AS count FROM lab_mindset_logs
                 WHERE user_id = $1 AND logged_at >= $2::timestamptz`,
                [userId, `${sevenDaysAgo}T00:00:00.000Z`]
            ),
        ]);

        const moods = logsRes.rows.map((r) => Number(r.mood)).filter((m) => !Number.isNaN(m));
        const avgMood = moods.length
            ? Number((moods.reduce((s, m) => s + m, 0) / moods.length).toFixed(1))
            : null;

        const spend = spendRes.rows[0] || {};

        return c.json({
            journal_entries: journalRes.rows[0]?.count || 0,
            expense_total: Number(spend.expense_total || 0),
            income_total: Number(spend.income_total || 0),
            transaction_count: spend.transaction_count || 0,
            avg_mood: avgMood,
            lab_sessions: labRes.rows[0]?.count || 0,
            period_days: 7,
            since: sevenDaysAgo,
        });
    } catch (err) {
        console.error('[dashboard/widgets] Fatal:', err);
        return c.json({ error: err.message }, 500);
    }
});

export default app;
