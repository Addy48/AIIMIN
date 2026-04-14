/**
 * jobs/correlationEngine.js
 * 
 * Nightly cron: collect 30-day signals per user, compute pairwise
 * Spearman correlations, write to lab_correlations + generate lab_insights.
 * 
 * Run via: node jobs/correlationEngine.js
 * Or schedule with cron: 0 2 * * * node /path/to/jobs/correlationEngine.js
 */
import { pool } from '../lib/db.js';
import { spearman, benjaminiHochberg } from '../lib/spearman.js';

const SIGNAL_QUERIES = {
    // Each returns { day_of, value } rows for a user over last 30 days
    mood: `SELECT date AS day_of, mood::float AS value FROM daily_logs WHERE user_id = $1 AND mood IS NOT NULL AND date > CURRENT_DATE - 30 AND deleted_at IS NULL`,
    sleep_hours: `SELECT date AS day_of, sleep_hours::float AS value FROM daily_logs WHERE user_id = $1 AND sleep_hours IS NOT NULL AND date > CURRENT_DATE - 30 AND deleted_at IS NULL`,
    focus_score: `SELECT date AS day_of, focus_score::float AS value FROM daily_logs WHERE user_id = $1 AND focus_score > 0 AND date > CURRENT_DATE - 30 AND deleted_at IS NULL`,
    rc_count: `SELECT date AS day_of, rc_count::float AS value FROM daily_logs WHERE user_id = $1 AND date > CURRENT_DATE - 30 AND deleted_at IS NULL`,
    gym_done: `SELECT date AS day_of, CASE WHEN gym_done THEN 1.0 ELSE 0.0 END AS value FROM daily_logs WHERE user_id = $1 AND date > CURRENT_DATE - 30 AND deleted_at IS NULL`,
    steps: `SELECT date AS day_of, steps::float AS value FROM daily_logs WHERE user_id = $1 AND date > CURRENT_DATE - 30 AND deleted_at IS NULL`,
    water_bottles: `SELECT date AS day_of, water_bottles::float AS value FROM daily_logs WHERE user_id = $1 AND date > CURRENT_DATE - 30 AND deleted_at IS NULL`,
    typing_wpm: `SELECT day_of, MAX(wpm)::float AS value FROM lab_typing_tests WHERE user_id = $1 AND test_invalid = false AND day_of > CURRENT_DATE - 30 GROUP BY day_of`,
    reaction_ms: `SELECT day_of, MIN(mean_ms)::float AS value FROM lab_reaction_tests WHERE user_id = $1 AND test_invalid = false AND day_of > CURRENT_DATE - 30 GROUP BY day_of`,
    speaking_score: `SELECT day_of, MAX(confidence_score)::float AS value FROM lab_speaking_logs WHERE user_id = $1 AND day_of > CURRENT_DATE - 30 GROUP BY day_of`,
};

const SIGNAL_NAMES = Object.keys(SIGNAL_QUERIES);
const MIN_SAMPLES = 7;

function generateHeadline(signalA, signalB, rho) {
    const direction = rho > 0 ? 'higher' : 'lower';
    const pctImpact = Math.round(Math.abs(rho) * 100);
    return `When ${signalA.replace(/_/g, ' ')} is ${direction}, ${signalB.replace(/_/g, ' ')} trends ${rho > 0 ? 'up' : 'down'} by ~${pctImpact}%`;
}

async function processUser(userId) {
    // 1. Fetch all signals
    const signalData = {};
    for (const name of SIGNAL_NAMES) {
        const result = await pool.query(SIGNAL_QUERIES[name], [userId]);
        signalData[name] = new Map(result.rows.map(r => [r.day_of.toISOString().slice(0, 10), r.value]));
    }

    // 2. Compute pairwise correlations
    const results = [];
    for (let i = 0; i < SIGNAL_NAMES.length; i++) {
        for (let j = i + 1; j < SIGNAL_NAMES.length; j++) {
            const a = SIGNAL_NAMES[i];
            const b = SIGNAL_NAMES[j];
            const mapA = signalData[a];
            const mapB = signalData[b];

            // Find overlapping dates
            const commonDates = [...mapA.keys()].filter(d => mapB.has(d));
            if (commonDates.length < MIN_SAMPLES) continue;

            const xVals = commonDates.map(d => mapA.get(d));
            const yVals = commonDates.map(d => mapB.get(d));

            const { rho, pValue, n } = spearman(xVals, yVals);
            results.push({ signalA: a, signalB: b, rho, pValue, n });
        }
    }

    if (results.length === 0) return 0;

    // 3. Apply BH-FDR correction
    const passes = benjaminiHochberg(results, 0.10);

    // 4. Write to lab_correlations and generate insights
    let insightCount = 0;
    for (let k = 0; k < results.length; k++) {
        const r = results[k];
        const bhPassed = passes[k];

        const corrResult = await pool.query(
            `INSERT INTO lab_correlations (user_id, signal_a, signal_b, rho, p_value, bh_passed, n_samples)
             VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id`,
            [userId, r.signalA, r.signalB, r.rho, r.pValue, bhPassed, r.n]
        );

        // Generate insight if statistically significant and effect is notable
        if (bhPassed && Math.abs(r.rho) >= 0.35) {
            const headline = generateHeadline(r.signalA, r.signalB, r.rho);
            const severity = Math.abs(r.rho) >= 0.60 ? 'flag' : 'surface';

            await pool.query(
                `INSERT INTO lab_insights (user_id, correlation_id, headline, effect_pct, n_samples, rho, severity)
                 VALUES ($1, $2, $3, $4, $5, $6, $7)`,
                [userId, corrResult.rows[0].id, headline, Math.round(Math.abs(r.rho) * 100), r.n, r.rho, severity]
            );
            insightCount++;
        }
    }

    return insightCount;
}

async function main() {
    console.log('[CorrelationEngine] Starting...');
    const start = Date.now();

    try {
        // Get all users with enough data (at least 14 daily logs in last 30 days)
        const usersResult = await pool.query(
            `SELECT DISTINCT user_id FROM daily_logs
             WHERE date > CURRENT_DATE - 30 AND deleted_at IS NULL
             GROUP BY user_id HAVING COUNT(*) >= 14`
        );

        console.log(`[CorrelationEngine] Processing ${usersResult.rows.length} users...`);

        let totalInsights = 0;
        for (const row of usersResult.rows) {
            try {
                const count = await processUser(row.user_id);
                totalInsights += count;
            } catch (err) {
                console.error(`[CorrelationEngine] Error for user ${row.user_id}:`, err);
            }
        }

        const elapsed = ((Date.now() - start) / 1000).toFixed(1);
        console.log(`[CorrelationEngine] Done. ${totalInsights} insights generated in ${elapsed}s`);
    } catch (err) {
        console.error('[CorrelationEngine] Fatal error:', err);
        process.exit(1);
    } finally {
        await pool.end();
    }
}

main();
