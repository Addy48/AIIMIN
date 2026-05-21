/**
 * routes/dashboard.js
 * Aggregate dashboard endpoint — uses pool.query() (Neon PostgreSQL direct).
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

export default app;
