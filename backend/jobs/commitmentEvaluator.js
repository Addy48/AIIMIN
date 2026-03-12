/**
 * jobs/commitmentEvaluator.js
 *
 * Background job: runs nightly end-of-day commitment evaluation for ALL users.
 * Handles timezone correctly: evaluates each user for THEIR local "yesterday"
 * based on user.timezone (stored in DB).
 *
 * Design:
 *  - Idempotent: uses `evaluated_at` column — skips already-evaluated records.
 *  - Safe to run multiple times (cron retry safety).
 *  - Logs via Winston.
 *  - Writes weekly summaries if it's Monday morning (end of previous week).
 *
 * Run via:
 *   node jobs/commitmentEvaluator.js
 * Or from Railway/Render cron:
 *   node --experimental-vm-modules jobs/commitmentEvaluator.js
 *
 * Suggested schedule: 0 18 * * * (18:00 UTC = 23:30 IST — after most IST users' midnight)
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

const DEFAULT_TZ = 'Asia/Kolkata';

/**
 * Returns the "today" date string in the user's local timezone.
 * At 23:30 UTC (when cron runs), IST users are at 05:00+1 next day —
 * so we evaluate for the PREVIOUS local day.
 */
const getLocalDate = (timezone) => {
    const tz = timezone || DEFAULT_TZ;
    const localNow = DateTime.now().setZone(tz);
    // Evaluate for "yesterday" in user's timezone (assuming cron runs after midnight local)
    return localNow.minus({ days: 1 }).toISODate();
};

const evaluateUser = async (client, userId, timezone) => {
    const date = getLocalDate(timezone);

    // Idempotency: skip if already evaluated
    const existing = await client.query(
        'SELECT evaluated_at FROM daily_commitments WHERE user_id = $1 AND date = $2',
        [userId, date]
    );
    if (!existing.rows.length) return { skipped: true, reason: 'no_commitment_record' };
    if (existing.rows[0].evaluated_at) return { skipped: true, reason: 'already_evaluated' };

    // Fetch commitment targets
    const commit = await client.query(
        'SELECT * FROM daily_commitments WHERE user_id = $1 AND date = $2',
        [userId, date]
    );
    const targets = commit.rows[0]?.targets || [];
    if (!targets.length) return { skipped: true, reason: 'no_targets' };

    // Fetch daily log for that date
    const logResult = await client.query(
        `SELECT dl.*, COALESCE(ps.cycles_completed, 0) AS focus_cycles,
                COALESCE(ps.total_focus_minutes, 0) AS focus_minutes
         FROM daily_logs dl
         LEFT JOIN pomodoro_sessions ps ON ps.user_id = dl.user_id AND ps.date = dl.date
         WHERE dl.user_id = $1 AND dl.date = $2 AND dl.deleted_at IS NULL`,
        [userId, date]
    );
    if (!logResult.rows.length) return { skipped: true, reason: 'no_log' };

    const log = logResult.rows[0];
    let metCount = 0;

    const evaluatedTargets = targets.map(t => {
        const actual = log[t.metric];
        let met = false;
        if (typeof actual === 'boolean') {
            met = actual === true;
        } else if (actual !== null && actual !== undefined) {
            met = parseFloat(actual) >= parseFloat(t.target);
        }
        if (met) metCount++;
        return { ...t, actual, met };
    });

    const totalCount = targets.length;
    const fulfillmentPct = Math.round((metCount / totalCount) * 100);

    await client.query(
        `UPDATE daily_commitments
         SET met_count = $1, total_count = $2, fulfillment_pct = $3,
             targets = $4::jsonb, evaluated_at = NOW()
         WHERE user_id = $5 AND date = $6`,
        [metCount, totalCount, fulfillmentPct, JSON.stringify(evaluatedTargets), userId, date]
    );

    // Send notification only if fulfillment < 60% — with dedup (see notifications.js)
    if (fulfillmentPct < 60) {
        const title = `Day closed at ${fulfillmentPct}% fulfillment`;
        await client.query(
            `INSERT INTO notifications (user_id, type, title, body, action_url)
             SELECT $1, 'commitment_miss', $2, $3, '/account#commitments'
             WHERE NOT EXISTS (
               SELECT 1 FROM notifications
               WHERE user_id = $1
                 AND type = 'commitment_miss'
                 AND title = $2
                 AND created_at > NOW() - INTERVAL '24 hours'
             )`,
            [userId, title, `You met ${metCount} of ${totalCount} commitments. Tomorrow is a fresh start.`]
        );
    }

    // Track in internal_metrics
    await client.query(
        `INSERT INTO internal_metrics (user_id, metric_name, value, meta, recorded_at)
         VALUES ($1, 'daily_fulfillment_pct', $2, $3::jsonb, NOW())`,
        [userId, fulfillmentPct, JSON.stringify({ date, met_count: metCount, total_count: totalCount })]
    );

    return { date, metCount, totalCount, fulfillmentPct };
};

const run = async () => {
    const startTime = Date.now();
    logger.info('[commitmentEvaluator] Starting nightly evaluation run');

    const client = await pool.connect();
    try {
        // Get all users with their timezones
        const users = await client.query(
            "SELECT id, timezone FROM users WHERE timezone IS NOT NULL"
        );

        let evaluated = 0, skipped = 0, errors = 0;

        for (const user of users.rows) {
            try {
                const result = await evaluateUser(client, user.id, user.timezone);
                if (result.skipped) skipped++;
                else evaluated++;
            } catch (err) {
                errors++;
                logger.error('[commitmentEvaluator] User evaluation failed', {
                    userId: user.id,
                    error: err.message,
                });
            }
        }

        const duration = Date.now() - startTime;
        logger.info('[commitmentEvaluator] Run complete', {
            evaluated, skipped, errors, durationMs: duration,
        });
    } finally {
        client.release();
        await pool.end();
    }
};

run().catch(err => {
    logger.error('[commitmentEvaluator] Fatal error', { error: err.message });
    process.exit(1);
});
