import { pool } from '../lib/googleClient.js';
import { cacheGet, cacheSet } from '../lib/cache.js';

const DAY_MS = 24 * 60 * 60 * 1000;

const toDateKey = (value) => new Date(value).toISOString().slice(0, 10);
const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
const avg = (values) => values.length ? values.reduce((sum, value) => sum + value, 0) / values.length : 0;

function createDailyRecord(date, log, session, spend, commitments, routineRuns, habitLogs) {
    const focusCycles = Number(session?.focus_cycles || 0);
    const focusMinutes = Number(session?.focus_minutes || 0);
    const dailySpend = Number(spend?.daily_spend || 0);
    const dailyIncome = Number(spend?.daily_income || 0);
    const savingsRate = dailyIncome > 0 ? clamp((dailyIncome - dailySpend) / dailyIncome, -1, 1) : 0;
    const habitCompletion = commitments?.fulfillment_pct != null
        ? Number(commitments.fulfillment_pct)
        : (habitLogs?.total > 0 ? (habitLogs.done / habitLogs.total) * 100 : 0);
    const routineAdherence = routineRuns?.started > 0
        ? clamp((routineRuns.completed / routineRuns.started) * 100, 0, 100)
        : 0;

    return {
        date,
        sleep_hours: Number(log?.sleep_hours || 0),
        gym_done: Boolean(log?.gym_done),
        steps: Number(log?.steps || 0),
        learning_done: Boolean(log?.learning_done),
        journal_entry: log?.journal_entry || '',
        water_bottles: Number(log?.water_bottles || 0),
        mood: Number(log?.mood || 0),
        breakfast_done: Boolean(log?.breakfast_done),
        focus_cycles: focusCycles,
        focus_minutes: focusMinutes,
        target_cycles: 4,
        daily_spend: dailySpend,
        daily_income: dailyIncome,
        burn_target: 1500,
        savings_rate: savingsRate,
        budget_adherence: dailySpend <= 1500 ? 100 : clamp(100 - (((dailySpend / 1500) - 1) * 50), 0, 100),
        commitment_pct: Number(commitments?.fulfillment_pct || 0),
        habit_completion_pct: clamp(habitCompletion, 0, 100),
        routine_adherence_pct: routineAdherence,
        habits_done: Number(habitLogs?.done || 0),
        habits_total: Number(habitLogs?.total || 0),
        routines_started: Number(routineRuns?.started || 0),
        routines_completed: Number(routineRuns?.completed || 0),
    };
}

/**
 * @param {string} userId
 * @param {number} windowDays — rolling window when start/end not set
 * @param {{ start?: string, end?: string }} [opts] — YYYY-MM-DD inclusive range for past reports
 */
export async function getAnalyticsDataset(userId, windowDays = 120, opts = {}) {
    const startOverride = opts.start || null;
    const endOverride = opts.end || null;
    const cacheKey = `analytics-dataset:${userId}:${windowDays}:${startOverride || ''}:${endOverride || ''}`;
    const cached = cacheGet(cacheKey);
    if (cached) return cached;

    const untilDate = endOverride || new Date().toISOString().slice(0, 10);
    const sinceDate = startOverride
        || new Date(Date.now() - ((windowDays - 1) * DAY_MS)).toISOString().slice(0, 10);

    const hasEnd = Boolean(endOverride);
    const baseParams = hasEnd ? [userId, sinceDate, untilDate] : [userId, sinceDate];
    const dayCol = hasEnd ? 'AND date >= $2 AND date <= $3' : 'AND date >= $2';
    const routineCol = hasEnd
        ? `AND DATE(started_at AT TIME ZONE 'Asia/Kolkata') >= $2 AND DATE(started_at AT TIME ZONE 'Asia/Kolkata') <= $3`
        : `AND DATE(started_at AT TIME ZONE 'Asia/Kolkata') >= $2`;
    const habitCol = hasEnd
        ? `AND DATE(completed_at AT TIME ZONE 'Asia/Kolkata') >= $2 AND DATE(completed_at AT TIME ZONE 'Asia/Kolkata') <= $3`
        : `AND DATE(completed_at AT TIME ZONE 'Asia/Kolkata') >= $2`;

    const [
        logsResult,
        sessionResult,
        spendResult,
        commitmentResult,
        routineRunsResult,
        habitLogsResult,
    ] = await Promise.all([
        pool.query(
            `SELECT date, sleep_hours, gym_done, steps, learning_done, journal_entry, water_bottles, mood, breakfast_done
             FROM daily_logs
             WHERE user_id = $1 ${dayCol}
             ORDER BY date ASC`,
            baseParams
        ),
        pool.query(
            // Live schema: daily rollup rows (date, cycles_completed, total_focus_minutes) — not per-start timestamps.
            `SELECT date::text AS date,
                    COALESCE(SUM(cycles_completed), 0)::numeric AS focus_cycles,
                    COALESCE(SUM(total_focus_minutes), 0)::numeric AS focus_minutes
             FROM pomodoro_sessions
             WHERE user_id = $1 ${hasEnd ? 'AND date >= $2 AND date <= $3' : 'AND date >= $2'}
             GROUP BY 1
             ORDER BY 1 ASC`,
            baseParams
        ),
        pool.query(
            `SELECT date,
                    COALESCE(SUM(CASE WHEN type IN ('expense', 'transfer_out', 'lend') THEN amount ELSE 0 END), 0)::numeric AS daily_spend,
                    COALESCE(SUM(CASE WHEN type IN ('income', 'transfer_in', 'repayment') THEN amount ELSE 0 END), 0)::numeric AS daily_income
             FROM money_transactions
             WHERE user_id = $1 ${dayCol}
             GROUP BY 1
             ORDER BY 1 ASC`,
            baseParams
        ),
        pool.query(
            `SELECT date, fulfillment_pct, met_count, total_count
             FROM daily_commitments
             WHERE user_id = $1 ${dayCol}
             ORDER BY date ASC`,
            baseParams
        ),
        pool.query(
            `SELECT DATE(started_at AT TIME ZONE 'Asia/Kolkata') AS date,
                    COUNT(*)::int AS started,
                    COUNT(*) FILTER (WHERE completed = true)::int AS completed
             FROM routine_runs
             WHERE user_id = $1 ${routineCol}
             GROUP BY 1
             ORDER BY 1 ASC`,
            baseParams
        ),
        pool.query(
            `SELECT DATE(completed_at AT TIME ZONE 'Asia/Kolkata') AS date,
                    COUNT(*)::int AS total,
                    COUNT(*) FILTER (WHERE status = 'done')::int AS done
             FROM habit_logs
             WHERE user_id = $1 ${habitCol}
             GROUP BY 1
             ORDER BY 1 ASC`,
            baseParams
        ),
    ]);

    const logsByDate = Object.fromEntries(logsResult.rows.map((row) => [toDateKey(row.date), row]));
    const sessionsByDate = Object.fromEntries(sessionResult.rows.map((row) => [toDateKey(row.date), row]));
    const spendByDate = Object.fromEntries(spendResult.rows.map((row) => [toDateKey(row.date), row]));
    const commitmentsByDate = Object.fromEntries(commitmentResult.rows.map((row) => [toDateKey(row.date), row]));
    const routineRunsByDate = Object.fromEntries(routineRunsResult.rows.map((row) => [toDateKey(row.date), row]));
    const habitLogsByDate = Object.fromEntries(habitLogsResult.rows.map((row) => [toDateKey(row.date), row]));

    const dateSet = new Set([
        ...Object.keys(logsByDate),
        ...Object.keys(sessionsByDate),
        ...Object.keys(spendByDate),
        ...Object.keys(commitmentsByDate),
        ...Object.keys(routineRunsByDate),
        ...Object.keys(habitLogsByDate),
    ]);

    const dailyRecords = [...dateSet]
        .sort()
        .map((date) => createDailyRecord(
            date,
            logsByDate[date],
            sessionsByDate[date],
            spendByDate[date],
            commitmentsByDate[date],
            routineRunsByDate[date],
            habitLogsByDate[date]
        ));

    const dataset = {
        sinceDate,
        untilDate,
        dailyRecords,
        latestRecord: dailyRecords[dailyRecords.length - 1] || null,
        windows: {
            last7: dailyRecords.slice(-7),
            last14: dailyRecords.slice(-14),
            last30: dailyRecords.slice(-30),
            baseline: dailyRecords.slice(0, Math.max(0, dailyRecords.length - 14)),
            all: dailyRecords,
        },
    };

    cacheSet(cacheKey, dataset, 60_000);
    return dataset;
}

export { avg, clamp };
