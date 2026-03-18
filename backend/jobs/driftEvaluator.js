/**
 * jobs/driftEvaluator.js
 *
 * Background job: weekly behavioral drift analysis for all users.
 * Runs outside request/response cycle. Timezone-aware.
 * Fully idempotent.
 *
 * Drift logic:
 *   For each metric, compare avg over last 7 days vs days 8-14 ago (all in user's local timezone).
 *   15% drop threshold → drift alert.
 *   3+ consecutive days of low mood (≤ 2/5) → mood alert.
 *   3+ consecutive days below 60% fulfillment → commitment drop alert.
 *
 * Notification dedup:
 *   Same drift_alert title cannot be inserted twice within 48 hours per user.
 *
 * Insight versioning:
 *   Weekly summaries written with insight_version = current INSIGHT_VERSION constant.
 *   Increment INSIGHT_VERSION when algorithm logic changes.
 *
 * Suggested schedule: 0 17 * * 0 (17:00 UTC Sunday = 22:30 IST Sunday)
 */
import pg from 'pg';
import dotenv from 'dotenv';
import { DateTime } from 'luxon';
import logger from '../lib/logger.js';

dotenv.config();

const pool = new pg.Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

const INSIGHT_VERSION = 1;
const DRIFT_THRESHOLD = 0.85;   // 15% drop
const STREAK_THRESHOLD = 3;
const MOOD_LOW = 2;
const COMMITMENT_LOW = 60;
const DEFAULT_TZ = 'Asia/Kolkata';
const DEDUP_WINDOW_H = 48;     // hours

const TRACKED_METRICS = [
    { key: 'sleep_hours', label: 'Sleep', unit: 'hrs' },
    { key: 'focus_minutes', label: 'Focus', unit: 'min' },
    { key: 'mood_before', label: 'Mood', unit: '/5' },
    { key: 'energy_level', label: 'Energy', unit: '/5' },
    { key: 'commitment_pct', label: 'Commitment', unit: '%' },
    { key: 'steps', label: 'Steps', unit: 'steps' },
];

const avg = (arr, key) => {
    const vals = arr.map(r => parseFloat(r[key])).filter(v => !isNaN(v) && v !== null);
    return vals.length ? vals.reduce((s, v) => s + v, 0) / vals.length : null;
};

/**
 * Insert a drift notification with dedup guard.
 * Prevents same title from appearing more than once in DEDUP_WINDOW_H hours.
 */
const insertDriftAlert = async (client, userId, title, body) => {
    await client.query(
        `INSERT INTO notifications (user_id, type, title, body, action_url)
         SELECT $1, 'drift_alert', $2, $3, '/account#insights'
         WHERE NOT EXISTS (
           SELECT 1 FROM notifications
           WHERE user_id = $1
             AND type    = 'drift_alert'
             AND title   = $2
             AND dismissed_at IS NULL
             AND created_at  > NOW() - INTERVAL '${DEDUP_WINDOW_H} hours'
         )`,
        [userId, title, body]
    );
};

const evaluateUser = async (client, userId, timezone) => {
    const tz = timezone || DEFAULT_TZ;
    const localNow = DateTime.now().setZone(tz);
    // Dates in UTC stored, but we convert to user-local for window boundaries
    const endDate = localNow.minus({ days: 1 }).toISODate();   // yesterday local
    const mid = localNow.minus({ days: 7 }).toISODate();   // 7 days ago local
    const startDate = localNow.minus({ days: 14 }).toISODate(); // 14 days ago local

    const result = await client.query(
        `SELECT date, sleep_hours, focus_minutes, mood_before, energy_level,
                commitment_pct, steps, session_mood_avg
         FROM user_daily_metrics
         WHERE user_id = $1
           AND date BETWEEN $2 AND $3
         ORDER BY date DESC`,
        [userId, startDate, endDate]
    );

    const rows = result.rows;
    if (rows.length < 6) return { skipped: true, reason: 'insufficient_data' };

    const recent7 = rows.filter(r => r.date > mid);
    const baseline = rows.filter(r => r.date <= mid);
    if (recent7.length < 3 || baseline.length < 3) return { skipped: true, reason: 'insufficient_windows' };

    const detected = [];

    // ── Rolling average drift ──────────────────────────────
    for (const metric of TRACKED_METRICS) {
        const currentAvg = avg(recent7, metric.key);
        const baselineAvg = avg(baseline, metric.key);
        if (currentAvg === null || baselineAvg === null || baselineAvg === 0) continue;

        const ratio = currentAvg / baselineAvg;
        if (ratio < DRIFT_THRESHOLD) {
            const drop = Math.round((1 - ratio) * 100);
            const title = `${metric.label} drift — ${drop}% drop`;
            const body = `${metric.label} averaged ${currentAvg.toFixed(1)}${metric.unit} this week vs ${baselineAvg.toFixed(1)}${metric.unit} the week before.`;
            await insertDriftAlert(client, userId, title, body);
            detected.push({ metric: metric.key, drop });
        }
    }

    // ── Mood streak ────────────────────────────────────────
    const sortedRecent = [...recent7].sort((a, b) => new Date(b.date) - new Date(a.date));
    const moodStreak = sortedRecent.filter(r => parseFloat(r.mood_before) <= MOOD_LOW).length;
    if (moodStreak >= STREAK_THRESHOLD) {
        const title = `Low mood — ${moodStreak} consecutive days`;
        const body = `Your pre-session mood has been ${MOOD_LOW}/5 or lower for ${moodStreak} days straight.`;
        await insertDriftAlert(client, userId, title, body);
        detected.push({ metric: 'mood_streak', days: moodStreak });
    }

    // ── Commitment drop streak ─────────────────────────────
    const commitStreak = sortedRecent.filter(r => parseFloat(r.commitment_pct) < COMMITMENT_LOW).length;
    if (commitStreak >= STREAK_THRESHOLD) {
        const title = `Commitment drop — ${commitStreak} days under 60%`;
        const body = `Commitment fulfillment has been below 60% for ${commitStreak} consecutive days.`;
        await insertDriftAlert(client, userId, title, body);
        detected.push({ metric: 'commitment_streak', days: commitStreak });
    }

    // ── Track in internal_metrics ──────────────────────────
    if (detected.length > 0) {
        await client.query(
            `INSERT INTO internal_metrics (user_id, metric_name, value, meta, recorded_at)
             VALUES ($1, 'drift_alerts_generated', $2, $3::jsonb, NOW())`,
            [userId, detected.length, JSON.stringify({ metrics: detected, week_end: endDate })]
        );
    }

    // ── Write weekly summary with insight_version ──────────
    const weekStart = localNow.startOf('week').toISODate(); // Monday of current week
    const avgFulfillment = avg(recent7, 'commitment_pct');
    const bestDay = [...recent7].sort((a, b) => b.commitment_pct - a.commitment_pct)[0]?.date;
    const worstDay = [...recent7].sort((a, b) => a.commitment_pct - b.commitment_pct)[0]?.date;

    await client.query(
        `INSERT INTO weekly_summaries (user_id, week_start, data, insight_version, generated_at)
         VALUES ($1, $2, $3::jsonb, $4, NOW())
         ON CONFLICT (user_id, week_start) DO UPDATE
           SET data           = EXCLUDED.data,
               insight_version = EXCLUDED.insight_version,
               generated_at   = NOW()`,
        [userId, weekStart, JSON.stringify({
            avg_fulfillment: avgFulfillment?.toFixed(1),
            best_day: bestDay,
            worst_day: worstDay,
            drift_flags: detected.map(d => d.metric),
            analyzed_days: rows.length,
        }), INSIGHT_VERSION]
    );

    return { detected: detected.length, weekStart };
};

const run = async () => {
    const startTime = Date.now();
    logger.info('[driftEvaluator] Starting weekly drift evaluation');

    const client = await pool.connect();
    try {
        const users = await client.query('SELECT id, timezone FROM users');
        let evaluated = 0, skipped = 0, errors = 0;

        for (const user of users.rows) {
            try {
                const result = await evaluateUser(client, user.id, user.timezone);
                if (result.skipped) skipped++;
                else evaluated++;
            } catch (err) {
                errors++;
                logger.error('[driftEvaluator] User drift evaluation failed', {
                    userId: user.id, error: err.message,
                });
            }
        }

        logger.info('[driftEvaluator] Run complete', {
            evaluated, skipped, errors, durationMs: Date.now() - startTime,
            insightVersion: INSIGHT_VERSION,
        });
    } finally {
        client.release();
        await pool.end();
    }
};

run().catch(err => {
    logger.error('[driftEvaluator] Fatal error', { error: err.message });
    process.exit(1);
});
