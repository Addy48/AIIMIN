/**
 * routes/dashboard.js
 *
 * Single aggregate endpoint — called once on Dashboard mount.
 * Frontend renders everything from this one response.
 * No individual stat calls needed.
 */
import express from 'express';
import { pool, getIntegrationStatus } from '../lib/googleClient.js';
import { requireAuth } from '../middleware/auth.js';
import { cacheMiddleware, cacheInvalidate } from '../lib/cache.js';
import { BehavioralEngine } from '../utils/BehavioralEngine.js';

const router = express.Router();

// 60-second per-user cache. Key: "dashboard-summary:<userId>"
const dashboardCache = cacheMiddleware(60_000, (req) => `dashboard-summary:${req.userId}`);

/**
 * GET /dashboard/summary
 * Returns: stats_today, commitment_today, drift_alerts, weekly_insight, integration_health
 */
router.get('/summary', requireAuth, dashboardCache, async (req, res) => {
    try {
        const userId = req.userId;
        const today = new Date().toISOString().slice(0, 10);

        // Run all DB queries in parallel
        const [
            logResult,
            commitResult,
            weeklyResult,
            driftResult,
            notifResult,
            integResult,
            mLogResult,
            mSessResult,
            mCommitResult
        ] = await Promise.all([
            // Today's log
            pool.query(
                `SELECT dl.*, COALESCE(ps.cycles_completed, 0) AS focus_cycles,
                        COALESCE(ps.total_focus_minutes, 0) AS focus_minutes
                 FROM daily_logs dl
                 LEFT JOIN pomodoro_sessions ps ON ps.user_id = dl.user_id AND ps.date = dl.date
                 WHERE dl.user_id = $1 AND dl.date = $2`,
                [userId, today]
            ),
            // Today's commitment
            pool.query(
                'SELECT date, targets, met_count, total_count, fulfillment_pct FROM daily_commitments WHERE user_id = $1 AND date = $2',
                [userId, today]
            ),
            // This week's summary
            pool.query(
                `SELECT data FROM weekly_summaries
                 WHERE user_id = $1 AND week_start = date_trunc('week', CURRENT_DATE)::date`,
                [userId]
            ),
            // Drift alerts (active, non-dismissed)
            pool.query(
                `SELECT id, title, body, created_at
                 FROM notifications
                 WHERE user_id = $1 AND type = 'drift_alert' AND dismissed_at IS NULL
                 ORDER BY created_at DESC LIMIT 5`,
                [userId]
            ),
            // Unread notification count
            pool.query(
                'SELECT COUNT(*)::int AS unread FROM notifications WHERE user_id = $1 AND dismissed_at IS NULL AND read_at IS NULL',
                [userId]
            ),
            // Integration status
            getIntegrationStatus(userId, 'google').catch(() => ({ connected: false, error: 'Status unavailable' })),
            // 7-day logs for Momentum
            pool.query(
                'SELECT * FROM daily_logs WHERE user_id = $1 AND date > NOW() - INTERVAL \'7 days\' ORDER BY date DESC',
                [userId]
            ),
            // 7-day sessions for Momentum
            pool.query(
                'SELECT * FROM sessions WHERE user_id = $1 AND started_at > NOW() - INTERVAL \'7 days\'',
                [userId]
            ),
            // 7-day commitments for Momentum
            pool.query(
                'SELECT * FROM daily_commitments WHERE user_id = $1 AND date > NOW() - INTERVAL \'7 days\'',
                [userId]
            )
        ]);

        const log = logResult.rows[0] || null;
        const commit = commitResult.rows[0] || null;
        const weekly = weeklyResult.rows[0] || null;
        const drifts = driftResult.rows;
        const unread = notifResult.rows[0].unread;
        const integ = integResult;

        // ─── Momentum Intelligence ───
        const momentum = BehavioralEngine.calculateMomentum({
            logs: mLogResult.rows,
            sessions: mSessResult.rows,
            commitments: mCommitResult.rows
        });

        res.json({
            stats_today: log ? {
                sleep_hours: log.sleep_hours,
                focus_cycles: log.focus_cycles,
                focus_minutes: log.focus_minutes,
                gym_done: log.gym_done,
                steps: log.steps,
                mood_before: log.mood_before,
                mood_after: log.mood_after,
                energy_level: log.energy_level,
                water_bottles: log.water_bottles || 0,
            } : null,
            commitment_today: commit ? {
                targets: commit.targets,
                met_count: commit.met_count,
                total_count: commit.total_count,
                fulfillment_pct: parseFloat(commit.fulfillment_pct),
            } : null,
            drift_alerts: drifts,
            weekly_insight: weekly?.data || null,
            integration_health: {
                calendar: {
                    connected: integ.connected,
                    error: integ.error,
                    lastRefresh: integ.lastRefresh,
                },
                youtube: {
                    connected: integ.connected,
                    error: integ.error,
                },
            },
            notifications: { unread },
            momentum: momentum
        });
    } catch (err) {
        console.error('[dashboard/summary] Fatal:', err);
        res.status(500).json({
            error: err.message || 'Internal logic error',
            code: err.code,
            stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
        });
    }
});

export default router;
