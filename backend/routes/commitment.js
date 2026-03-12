/**
 * routes/commitment.js
 *
 * Daily Commitment Engine:
 *   - Users set daily tracking targets (per metric + threshold)
 *   - End-of-day evaluation compares log data to targets
 *   - Fulfillment % drives streak, insights, and drift detection
 */
import express from 'express';
import { pool } from '../lib/googleClient.js';
import { requireAuth } from '../middleware/auth.js';
import { createNotification } from './notifications.js';

const router = express.Router();

const todayDate = () => new Date().toISOString().slice(0, 10);

/**
 * GET /commitment/today
 * Today's commitment state: targets, met count, fulfillment %.
 * Creates a blank record if none exists yet.
 */
router.get('/today', requireAuth, async (req, res) => {
    try {
        const date = req.query.date || todayDate();

        // Upsert an empty commitment record if not exists
        await pool.query(
            `INSERT INTO daily_commitments (user_id, date, targets)
             VALUES ($1, $2, '[]'::jsonb)
             ON CONFLICT (user_id, date) DO NOTHING`,
            [req.userId, date]
        );

        const result = await pool.query(
            `SELECT date, targets, met_count, total_count, fulfillment_pct, evaluated_at
             FROM daily_commitments WHERE user_id = $1 AND date = $2`,
            [req.userId, date]
        );

        res.json(result.rows[0] || null);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

/**
 * POST /commitment/targets
 * Upsert today's commitment targets.
 * Body: { date?, targets: [{metric, target, unit, weight}] }
 *
 * Supported metrics: sleep_hours, gym_done, steps, focus_cycles,
 *   protein_grams, mood_before, energy_level, learning_done
 */
router.post('/targets', requireAuth, async (req, res) => {
    try {
        const { targets, date = todayDate() } = req.body;
        if (!Array.isArray(targets)) {
            return res.status(400).json({ error: 'targets must be an array' });
        }

        const result = await pool.query(
            `INSERT INTO daily_commitments (user_id, date, targets, total_count)
             VALUES ($1, $2, $3::jsonb, $4)
             ON CONFLICT (user_id, date) DO UPDATE
               SET targets    = EXCLUDED.targets,
                   total_count = EXCLUDED.total_count
             RETURNING *`,
            [req.userId, date, JSON.stringify(targets), targets.length]
        );

        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

/**
 * POST /commitment/evaluate
 * Compare today's daily_log against targets. Update fulfillment %.
 * Creates a notification if fulfillment < 60%.
 * Designed to be called by a nightly cron at 23:00 local time.
 */
router.post('/evaluate', requireAuth, async (req, res) => {
    try {
        const date = req.body.date || todayDate();

        const [commitResult, logResult] = await Promise.all([
            pool.query(
                'SELECT * FROM daily_commitments WHERE user_id = $1 AND date = $2',
                [req.userId, date]
            ),
            pool.query(
                `SELECT dl.*, COALESCE(ps.cycles_completed, 0) AS focus_cycles
                 FROM daily_logs dl
                 LEFT JOIN pomodoro_sessions ps ON ps.user_id = dl.user_id AND ps.date = dl.date
                 WHERE dl.user_id = $1 AND dl.date = $2`,
                [req.userId, date]
            ),
        ]);

        if (commitResult.rows.length === 0 || logResult.rows.length === 0) {
            return res.status(404).json({ error: 'No commitment or log found for this date' });
        }

        const targets = commitResult.rows[0].targets || [];
        const log = logResult.rows[0];

        let metCount = 0;
        const evaluatedTargets = targets.map(t => {
            const actual = log[t.metric];
            let met = false;
            if (typeof actual === 'boolean') {
                met = actual === true;
            } else if (typeof actual === 'number' || typeof actual === 'string') {
                met = parseFloat(actual) >= parseFloat(t.target);
            }
            if (met) metCount++;
            return { ...t, actual, met };
        });

        const totalCount = targets.length;
        const fulfillmentPct = totalCount > 0 ? Math.round((metCount / totalCount) * 100) : 0;

        await pool.query(
            `UPDATE daily_commitments
             SET met_count       = $1,
                 total_count     = $2,
                 fulfillment_pct = $3,
                 targets         = $4::jsonb,
                 evaluated_at    = NOW()
             WHERE user_id = $5 AND date = $6`,
            [metCount, totalCount, fulfillmentPct, JSON.stringify(evaluatedTargets), req.userId, date]
        );

        // Notify if fulfillment is below threshold
        if (fulfillmentPct < 60) {
            await createNotification(
                req.userId,
                'commitment_miss',
                `Day closed at ${fulfillmentPct}% fulfillment`,
                `You met ${metCount} of ${totalCount} commitments today. Tomorrow is a new day.`,
                '/account#commitments'
            );
        }

        res.json({ date, metCount, totalCount, fulfillmentPct, targets: evaluatedTargets });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

/**
 * GET /commitment/history?days=14
 * Last N days of fulfillment_pct for sparkline/trend chart.
 */
router.get('/history', requireAuth, async (req, res) => {
    try {
        const days = Math.min(parseInt(req.query.days || 14), 90);
        const result = await pool.query(
            `SELECT date::text, fulfillment_pct, met_count, total_count
             FROM daily_commitments
             WHERE user_id = $1 AND date >= CURRENT_DATE - $2::interval
             ORDER BY date ASC`,
            [req.userId, `${days} days`]
        );
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

/**
 * GET /commitment/weekly
 * This week's weekly summary (Mon–Sun).
 */
router.get('/weekly', requireAuth, async (req, res) => {
    try {
        // Get Monday of current week
        const now = new Date();
        const day = now.getDay();
        const daysToMon = (day === 0 ? -6 : 1 - day);
        const monday = new Date(now);
        monday.setDate(now.getDate() + daysToMon);
        const weekStart = monday.toISOString().slice(0, 10);

        const result = await pool.query(
            'SELECT * FROM weekly_summaries WHERE user_id = $1 AND week_start = $2',
            [req.userId, weekStart]
        );

        res.json(result.rows[0] || null);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

export default router;
