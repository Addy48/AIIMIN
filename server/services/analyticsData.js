import { pool } from '../lib/googleClient.js';
import { cacheGet, cacheSet } from '../lib/cache.js';

const DAY_MS = 24 * 60 * 60 * 1000;

const toDateKey = (value) => new Date(value).toISOString().slice(0, 10);
export const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
export const avg = (values) => values.length ? values.reduce((sum, value) => sum + value, 0) / values.length : 0;
const numberOrNull = (value) => value === null || value === undefined || value === '' || Number.isNaN(Number(value)) ? null : Number(value);
const boolOrNull = (value) => value === null || value === undefined ? null : Boolean(value);

function createDailyRecord(date, log, session, spend, commitments, routineRuns, habitLogs) {
    const focusCycles = numberOrNull(session?.focus_cycles);
    const focusMinutes = numberOrNull(session?.focus_minutes);
    const dailySpend = numberOrNull(spend?.daily_spend);
    const dailyIncome = numberOrNull(spend?.daily_income);
    const savingsRate = dailyIncome != null && dailyIncome > 0 && dailySpend != null
        ? clamp((dailyIncome - dailySpend) / dailyIncome, -1, 1)
        : (dailyIncome === 0 && dailySpend != null && dailySpend > 0 ? -1 : null);
    const habitCompletion = commitments?.fulfillment_pct != null
        ? numberOrNull(commitments.fulfillment_pct)
        : (Number(habitLogs?.total) > 0 ? (Number(habitLogs.done || 0) / Number(habitLogs.total)) * 100 : null);
    const routineAdherence = Number(routineRuns?.started) > 0
        ? clamp((Number(routineRuns.completed || 0) / Number(routineRuns.started)) * 100, 0, 100)
        : null;

    const sourceRecordIds = [];
    if (log) sourceRecordIds.push(`daily_logs:${date}`);
    if (session) sourceRecordIds.push(`pomodoro_sessions:${date}`);
    if (spend) sourceRecordIds.push(`money_transactions:${date}`);
    if (commitments) sourceRecordIds.push(`daily_commitments:${date}`);
    if (routineRuns) sourceRecordIds.push(`routine_runs:${date}`);
    if (habitLogs) sourceRecordIds.push(`habit_logs:${date}`);

    return {
        date,
        sourceRecordIds,
        sleep_hours: numberOrNull(log?.sleep_hours),
        gym_done: boolOrNull(log?.gym_done),
        steps: numberOrNull(log?.steps),
        learning_done: boolOrNull(log?.learning_done),
        journal_entry: log?.journal_entry == null ? null : String(log.journal_entry),
        water_bottles: numberOrNull(log?.water_bottles),
        mood: numberOrNull(log?.mood),
        breakfast_done: boolOrNull(log?.breakfast_done),
        focus_cycles: focusCycles,
        focus_minutes: focusMinutes,
        target_cycles: session ? 4 : null,
        daily_spend: dailySpend,
        daily_income: dailyIncome,
        burn_target: dailySpend != null ? 1500 : null,
        savings_rate: savingsRate,
        budget_adherence: dailySpend != null ? (dailySpend <= 1500 ? 100 : clamp(100 - (((dailySpend / 1500) - 1) * 50), 0, 100)) : null,
        commitment_pct: commitments?.fulfillment_pct == null ? null : numberOrNull(commitments.fulfillment_pct),
        habit_completion_pct: habitCompletion == null ? null : clamp(habitCompletion, 0, 100),
        routine_adherence_pct: routineAdherence,
        habits_done: habitLogs ? Number(habitLogs?.done || 0) : null,
        habits_total: habitLogs ? Number(habitLogs?.total || 0) : null,
        routines_started: routineRuns ? Number(routineRuns?.started || 0) : null,
        routines_completed: routineRuns ? Number(routineRuns?.completed || 0) : null,
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
