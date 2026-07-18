/**
 * correlationService.js — Spearman correlations from real signal data (pool, not supabase shim).
 */
import { pool } from '../lib/db.js';
import { spearman, benjaminiHochberg } from '../lib/spearman.js';

const MIN_SAMPLES = 7;
const BH_Q = 0.10;
const MIN_RHO_INSIGHT = 0.35;
const WINDOW_DAYS = 30;

export const SIGNAL_NAMES = [
    'mood', 'sleep_hours', 'focus_minutes', 'rc_count', 'gym_done',
    'steps', 'water_bottles', 'typing_wpm', 'reaction_ms', 'speaking_score',
];

const SIGNAL_LABELS = {
    mood: 'Mood',
    sleep_hours: 'Sleep',
    focus_minutes: 'Focus',
    rc_count: 'Reset counter',
    gym_done: 'Gym',
    steps: 'Steps',
    water_bottles: 'Hydration',
    typing_wpm: 'Typing speed',
    reaction_ms: 'Reaction time',
    speaking_score: 'Speaking confidence',
};

function windowStart() {
    return new Date(Date.now() - WINDOW_DAYS * 86400000).toISOString().slice(0, 10);
}

function generateHeadline(signalA, signalB, rho) {
    const a = SIGNAL_LABELS[signalA] || signalA.replace(/_/g, ' ');
    const b = SIGNAL_LABELS[signalB] || signalB.replace(/_/g, ' ');
    const direction = rho > 0 ? 'higher' : 'lower';
    const pct = Math.round(Math.abs(rho) * 100);
    return `When ${a.toLowerCase()} is ${direction}, ${b.toLowerCase()} trends ${rho > 0 ? 'up' : 'down'} (~${pct}% association).`;
}

function mergeDailyMap(rows, dateKey, valueKey, { min = false } = {}) {
    const result = new Map();
    for (const row of rows) {
        const date = String(row[dateKey] || '').slice(0, 10);
        if (!date) continue;
        let val = row[valueKey];
        if (val == null || val === '') continue;
        val = Number(val);
        if (Number.isNaN(val)) continue;
        if (!result.has(date) || (min ? val < result.get(date) : val > result.get(date))) {
            result.set(date, val);
        }
    }
    return result;
}

async function fetchSignal(userId, name, since) {
    switch (name) {
        case 'mood': {
            const { rows } = await pool.query(
                `SELECT date::text AS date, mood FROM daily_logs
                 WHERE user_id = $1 AND date > $2 AND mood IS NOT NULL`,
                [userId, since],
            );
            return mergeDailyMap(rows, 'date', 'mood');
        }
        case 'sleep_hours': {
            const { rows } = await pool.query(
                `SELECT date::text AS date, sleep_hours FROM daily_logs
                 WHERE user_id = $1 AND date > $2 AND sleep_hours IS NOT NULL AND sleep_hours > 0`,
                [userId, since],
            );
            return mergeDailyMap(rows, 'date', 'sleep_hours');
        }
        case 'focus_minutes': {
            const { rows } = await pool.query(
                `SELECT date::text AS date,
                        COALESCE(SUM(total_focus_minutes), 0)::numeric AS focus_minutes
                 FROM pomodoro_sessions
                 WHERE user_id = $1 AND date > $2
                 GROUP BY 1`,
                [userId, since],
            );
            return mergeDailyMap(rows, 'date', 'focus_minutes');
        }
        case 'rc_count': {
            const { rows } = await pool.query(
                `SELECT date::text AS date, rc_count FROM daily_logs
                 WHERE user_id = $1 AND date > $2`,
                [userId, since],
            );
            return mergeDailyMap(rows, 'date', 'rc_count');
        }
        case 'gym_done': {
            const { rows } = await pool.query(
                `SELECT date::text AS date, CASE WHEN gym_done THEN 1.0 ELSE 0.0 END AS gym_val
                 FROM daily_logs WHERE user_id = $1 AND date > $2`,
                [userId, since],
            );
            return mergeDailyMap(rows, 'date', 'gym_val');
        }
        case 'steps': {
            const { rows } = await pool.query(
                `SELECT date::text AS date, steps FROM daily_logs
                 WHERE user_id = $1 AND date > $2`,
                [userId, since],
            );
            return mergeDailyMap(rows, 'date', 'steps');
        }
        case 'water_bottles': {
            const { rows } = await pool.query(
                `SELECT date::text AS date, water_bottles FROM daily_logs
                 WHERE user_id = $1 AND date > $2`,
                [userId, since],
            );
            return mergeDailyMap(rows, 'date', 'water_bottles');
        }
        case 'typing_wpm': {
            const { rows } = await pool.query(
                `SELECT day_of::text AS date, wpm FROM lab_typing_tests
                 WHERE user_id = $1 AND test_invalid = false AND day_of > $2`,
                [userId, since],
            );
            return mergeDailyMap(rows, 'date', 'wpm');
        }
        case 'reaction_ms': {
            const { rows } = await pool.query(
                `SELECT day_of::text AS date, mean_ms FROM lab_reaction_tests
                 WHERE user_id = $1 AND test_invalid = false AND day_of > $2`,
                [userId, since],
            );
            return mergeDailyMap(rows, 'date', 'mean_ms', { min: true });
        }
        case 'speaking_score': {
            const { rows } = await pool.query(
                `SELECT logged_at::text AS date, confidence_score FROM lab_speaking_logs
                 WHERE user_id = $1 AND logged_at > $2::date`,
                [userId, since],
            );
            return mergeDailyMap(rows, 'date', 'confidence_score');
        }
        default:
            return new Map();
    }
}

/**
 * Compute pairwise Spearman correlations for one user (no DB write).
 */
export async function computeUserCorrelations(userId, { since } = {}) {
    const sinceDate = since || windowStart();
    const signalData = {};
    for (const name of SIGNAL_NAMES) {
        signalData[name] = await fetchSignal(userId, name, sinceDate);
    }

    const results = [];
    for (let i = 0; i < SIGNAL_NAMES.length; i += 1) {
        for (let j = i + 1; j < SIGNAL_NAMES.length; j += 1) {
            const signalA = SIGNAL_NAMES[i];
            const signalB = SIGNAL_NAMES[j];
            const mapA = signalData[signalA];
            const mapB = signalData[signalB];
            const commonDates = [...mapA.keys()].filter((d) => mapB.has(d));
            if (commonDates.length < MIN_SAMPLES) continue;

            const xVals = commonDates.map((d) => mapA.get(d));
            const yVals = commonDates.map((d) => mapB.get(d));
            const { rho, pValue, n } = spearman(xVals, yVals);
            results.push({
                signalA,
                signalB,
                signalALabel: SIGNAL_LABELS[signalA] || signalA,
                signalBLabel: SIGNAL_LABELS[signalB] || signalB,
                rho: Number(rho.toFixed(3)),
                pValue,
                n,
            });
        }
    }

    if (!results.length) {
        return { correlations: [], insights: [], insufficientData: true };
    }

    const bhPassed = benjaminiHochberg(results.map((r) => ({ pValue: r.pValue })), BH_Q);
    const correlations = results.map((r, k) => ({
        ...r,
        bhPassed: bhPassed[k],
        headline: generateHeadline(r.signalA, r.signalB, r.rho),
        strength: Math.abs(r.rho),
        severity: Math.abs(r.rho) >= 0.60 ? 'flag' : 'surface',
    }));

    const insights = correlations
        .filter((r) => r.bhPassed && Math.abs(r.rho) >= MIN_RHO_INSIGHT)
        .sort((a, b) => b.strength - a.strength)
        .map((r) => ({
            headline: r.headline,
            signalA: r.signalA,
            signalB: r.signalB,
            rho: r.rho,
            n_samples: r.n,
            effect_pct: Math.round(Math.abs(r.rho) * 100),
            severity: r.severity,
        }));

    return { correlations, insights, insufficientData: correlations.length === 0 };
}

async function persistCorrelations(userId, computed) {
    const since = windowStart();
    try {
        await pool.query(
            'DELETE FROM lab_correlations WHERE user_id = $1 AND created_at >= $2::date',
            [userId, since],
        ).catch(() => pool.query('DELETE FROM lab_correlations WHERE user_id = $1', [userId]));
        await pool.query(
            'DELETE FROM lab_insights WHERE user_id = $1 AND correlation_id IS NOT NULL',
            [userId],
        ).catch(() => null);
    } catch {
        /* table may be empty */
    }

    let insightCount = 0;
    for (const r of computed.correlations) {
        try {
            const { rows } = await pool.query(
                `INSERT INTO lab_correlations (user_id, signal_a, signal_b, rho, p_value, bh_passed, n_samples)
                 VALUES ($1, $2, $3, $4, $5, $6, $7)
                 RETURNING id`,
                [userId, r.signalA, r.signalB, r.rho, r.pValue, r.bhPassed, r.n],
            );
            const corrId = rows[0]?.id;
            if (corrId && r.bhPassed && Math.abs(r.rho) >= MIN_RHO_INSIGHT) {
                await pool.query(
                    `INSERT INTO lab_insights (user_id, correlation_id, headline, effect_pct, n_samples, rho, severity)
                     VALUES ($1, $2, $3, $4, $5, $6, $7)`,
                    [userId, corrId, r.headline, Math.round(Math.abs(r.rho) * 100), r.n, r.rho, r.severity],
                );
                insightCount += 1;
            }
        } catch (err) {
            console.warn('[correlationService] persist row skip:', err.message);
        }
    }
    return insightCount;
}

async function processGoalHabitLinks(userId) {
    const since = windowStart();
    const { rows: edges } = await pool.query(
        `SELECT source_id, target_id FROM anchor_edges
         WHERE user_id = $1 AND source_type = 'habit' AND target_type = 'goal' AND confirmed = true`,
        [userId],
    );
    if (!edges.length) return 0;

    let made = 0;
    for (const edge of edges) {
        const { rows: logs } = await pool.query(
            `SELECT completed_at FROM habit_logs
             WHERE user_id = $1 AND habit_id = $2 AND completed_at >= $3::date`,
            [userId, edge.source_id, since],
        );
        const daysWithLog = new Set(logs.map((l) => String(l.completed_at).slice(0, 10))).size;
        const consistency = daysWithLog / WINDOW_DAYS;
        if (consistency >= 0.3) continue;

        const headline = 'A linked habit for one of your goals dropped below 30% consistency in the last 30 days — check the habit before pushing the goal harder.';
        try {
            await pool.query(
                `INSERT INTO lab_insights (user_id, headline, effect_pct, n_samples, severity)
                 VALUES ($1, $2, $3, $4, 'surface')`,
                [userId, headline, Math.round((1 - consistency) * 100), daysWithLog],
            );
            made += 1;
        } catch {
            /* schema variance */
        }
    }
    return made;
}

export async function processUserCorrelations(userId) {
    const computed = await computeUserCorrelations(userId);
    const persisted = await persistCorrelations(userId, computed);
    const linkInsights = await processGoalHabitLinks(userId);
    return { ...computed, persisted, linkInsights };
}

export async function fetchStoredCorrelations(userId) {
    try {
        const [corrRes, insightRes] = await Promise.all([
            pool.query(
                `SELECT signal_a, signal_b, rho, p_value, bh_passed, n_samples, created_at
                 FROM lab_correlations WHERE user_id = $1
                 ORDER BY ABS(rho) DESC LIMIT 30`,
                [userId],
            ),
            pool.query(
                `SELECT id, headline, effect_pct, n_samples, rho, severity, created_at
                 FROM lab_insights WHERE user_id = $1
                 ORDER BY created_at DESC LIMIT 20`,
                [userId],
            ),
        ]);

        const correlations = (corrRes.rows || []).map((r) => ({
            signalA: r.signal_a,
            signalB: r.signal_b,
            signalALabel: SIGNAL_LABELS[r.signal_a] || r.signal_a,
            signalBLabel: SIGNAL_LABELS[r.signal_b] || r.signal_b,
            rho: Number(r.rho),
            pValue: r.p_value,
            n: r.n_samples,
            bhPassed: r.bh_passed,
            headline: generateHeadline(r.signal_a, r.signal_b, r.rho),
            strength: Math.abs(Number(r.rho)),
        }));

        return {
            correlations,
            insights: insightRes.rows || [],
            source: 'stored',
            insufficientData: correlations.length === 0,
        };
    } catch {
        return { correlations: [], insights: [], source: 'stored', insufficientData: true };
    }
}

export async function getCorrelationsForUser(userId, { refresh = false } = {}) {
    if (!refresh) {
        const stored = await fetchStoredCorrelations(userId);
        if (stored.correlations.length >= 3) return stored;
    }
    const live = await computeUserCorrelations(userId);
    return { ...live, source: 'live' };
}

export async function runCorrelationEngine() {
    const since = windowStart();
    const { rows } = await pool.query(
        `SELECT user_id, COUNT(*)::int AS cnt FROM daily_logs
         WHERE date > $1 GROUP BY user_id HAVING COUNT(*) >= 14`,
        [since],
    );

    let totalInsights = 0;
    for (const { user_id: userId } of rows) {
        try {
            const result = await processUserCorrelations(userId);
            totalInsights += (result.persisted || 0) + (result.linkInsights || 0);
        } catch (err) {
            console.error(`[CorrelationEngine] user ${userId}:`, err.message);
        }
    }
    return { usersProcessed: rows.length, insightsGenerated: totalInsights };
}
