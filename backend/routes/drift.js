/**
 * routes/drift.js
 *
 * Behavioral Drift Detection Engine.
 *
 * Drift = a sustained decline in a tracked metric compared to its own baseline.
 * Detection logic runs server-side (backend-only). Frontend only receives alerts.
 *
 * Algorithm:
 *   For each tracked metric, compare avg over last 7 days vs days 8-14 ago.
 *   If current avg < baseline avg * 0.85 → drift detected (15% drop threshold).
 *   Also checks: 3+ consecutive days of low mood, 3+ consecutive days of low fulfillment.
 */
import express from 'express';
import { pool } from '../lib/googleClient.js';
import { requireAuth } from '../middleware/auth.js';
import { createNotification } from './notifications.js';

const router = express.Router();

const DRIFT_THRESHOLD = 0.85;  // 15% drop triggers drift
const STREAK_THRESHOLD = 3;     // Consecutive days for mood/commitment alerts
const MOOD_LOW = 2;     // mood_before ≤ this is considered low
const COMMITMENT_LOW = 60;    // fulfillment_pct below this is commitment drop

const TRACKED_METRICS = [
    { key: 'sleep_hours', label: 'Sleep', unit: 'hrs', direction: 'down_is_bad' },
    { key: 'focus_minutes', label: 'Focus', unit: 'min', direction: 'down_is_bad' },
    { key: 'mood_before', label: 'Mood', unit: '/5', direction: 'down_is_bad' },
    { key: 'energy_level', label: 'Energy', unit: '/5', direction: 'down_is_bad' },
    { key: 'commitment_pct', label: 'Commitment', unit: '%', direction: 'down_is_bad' },
    { key: 'steps', label: 'Steps', unit: 'steps', direction: 'down_is_bad' },
];

/**
 * GET /drift/current
 * Returns active drift alerts for the user (deduplicated, most recent first).
 */
router.get('/current', requireAuth, async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT id, type, title, body, created_at
             FROM notifications
             WHERE user_id = $1 AND type = 'drift_alert' AND dismissed_at IS NULL
             ORDER BY created_at DESC
             LIMIT 10`,
            [req.userId]
        );
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

/**
 * POST /drift/evaluate
 * Run drift analysis for the user against their last 14 days of data.
 * Called by nightly cron or triggered manually.
 * Returns { detected: [], skipped_metrics: [] }
 */
router.post('/evaluate', requireAuth, async (req, res) => {
    try {
        const userId = req.userId;
        const detected = [];

        // Fetch rolling 14-day data from the user_daily_metrics view
        const dataResult = await pool.query(
            `SELECT date, sleep_hours, focus_minutes, mood_before, energy_level,
                    commitment_pct, steps
             FROM user_daily_metrics
             WHERE user_id = $1
               AND date >= CURRENT_DATE - INTERVAL '14 days'
               AND date  < CURRENT_DATE
             ORDER BY date DESC`,
            [userId]
        );

        const rows = dataResult.rows;
        const recent7 = rows.filter(r => {
            const d = new Date(r.date);
            return d >= new Date(Date.now() - 7 * 86400000);
        });
        const baseline = rows.filter(r => {
            const d = new Date(r.date);
            return d < new Date(Date.now() - 7 * 86400000);
        });

        if (recent7.length < 3 || baseline.length < 3) {
            return res.json({ detected: [], reason: 'Insufficient data (need 3+ days in each window)' });
        }

        const avg = (arr, key) => {
            const vals = arr.map(r => parseFloat(r[key])).filter(v => !isNaN(v));
            return vals.length ? vals.reduce((s, v) => s + v, 0) / vals.length : null;
        };

        // ── Rolling average drift detection ──────────────────────
        for (const metric of TRACKED_METRICS) {
            const currentAvg = avg(recent7, metric.key);
            const baselineAvg = avg(baseline, metric.key);

            if (currentAvg === null || baselineAvg === null || baselineAvg === 0) continue;

            const ratio = currentAvg / baselineAvg;
            if (ratio < DRIFT_THRESHOLD) {
                const drop = Math.round((1 - ratio) * 100);
                const message = `Your ${metric.label} has dropped ${drop}% over the last 7 days. ` +
                    `Average: ${currentAvg.toFixed(1)}${metric.unit} vs ${baselineAvg.toFixed(1)}${metric.unit} baseline.`;

                await createNotification(
                    userId,
                    'drift_alert',
                    `${metric.label} drift detected — ${drop}% drop`,
                    message,
                    '/account#insights'
                );
                detected.push({ metric: metric.key, label: metric.label, drop, currentAvg, baselineAvg });
            }
        }

        // ── Consecutive mood streak check ─────────────────────────
        const sortedRecent = [...recent7].sort((a, b) => new Date(b.date) - new Date(a.date));
        const moodStreak = sortedRecent.filter(r => parseFloat(r.mood_before) <= MOOD_LOW).length;
        if (moodStreak >= STREAK_THRESHOLD) {
            await createNotification(
                userId,
                'drift_alert',
                `Low mood streak — ${moodStreak} consecutive days`,
                `Your mood has been ${MOOD_LOW}/5 or lower for ${moodStreak} days. Consider checking in with yourself.`,
                '/account#insights'
            );
            detected.push({ metric: 'mood_streak', label: 'Mood streak', days: moodStreak });
        }

        // ── Consecutive commitment drop check ─────────────────────
        const commitStreak = sortedRecent.filter(r => parseFloat(r.commitment_pct) < COMMITMENT_LOW).length;
        if (commitStreak >= STREAK_THRESHOLD) {
            await createNotification(
                userId,
                'drift_alert',
                `Commitment drop — ${commitStreak} days under 60%`,
                `You've been below 60% commitment fulfillment for ${commitStreak} straight days. Time to recalibrate.`,
                '/account#commitments'
            );
            detected.push({ metric: 'commitment_streak', label: 'Commitment streak', days: commitStreak });
        }

        res.json({ detected, analyzed: rows.length, recent7: recent7.length, baseline: baseline.length });
    } catch (err) {
        console.error('[drift/evaluate]', err.message);
        res.status(500).json({ error: err.message });
    }
});

/**
 * GET /drift/history?metric=sleep_hours&days=30
 * Time series of a single metric for trend visualization.
 */
router.get('/history', requireAuth, async (req, res) => {
    try {
        const { metric = 'sleep_hours', days = 30 } = req.query;
        const allowed = TRACKED_METRICS.map(m => m.key);
        if (!allowed.includes(metric)) {
            return res.status(400).json({ error: `metric must be one of: ${allowed.join(', ')}` });
        }

        const result = await pool.query(
            `SELECT date::text, ${metric} AS value
             FROM user_daily_metrics
             WHERE user_id = $1
               AND date >= CURRENT_DATE - $2::interval
             ORDER BY date ASC`,
            [req.userId, `${parseInt(days)} days`]
        );

        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

export default router;
