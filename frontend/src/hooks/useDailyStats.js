import { useQuery } from '@tanstack/react-query';
import { apiGet } from '../utils/api';
import { useMockData } from '../providers/MockDataProvider';
import { fetchDailyLogs, dateRange } from '../api/dailyLogs';

/**
 * useDailyStats — daily logs + focus via API routes (React Query cached).
 */
export function useDailyStats(user) {
    const { isUsingMock, mockData } = useMockData() || {};
    const today = new Date().toLocaleDateString('en-CA');
    const weekAgo = new Date(Date.now() - 6 * 86400000).toLocaleDateString('en-CA');
    const thirtyDaysAgo = new Date(Date.now() - 30 * 86400000).toLocaleDateString('en-CA');

    const todayQuery = useQuery({
        queryKey: ['daily-logs', user?.id, today, today, 'today-single'],
        queryFn: () => apiGet(`/daily-logs/${user.id}/${today}`).catch(() => ({})),
        enabled: Boolean(user && !isUsingMock),
        staleTime: 60_000,
    });

    const weekQuery = useQuery({
        queryKey: ['daily-logs', user?.id, weekAgo, today, 'all'],
        queryFn: () => fetchDailyLogs(weekAgo, today),
        enabled: Boolean(user && !isUsingMock),
        staleTime: 60_000,
    });

    const thirtyQuery = useQuery({
        queryKey: ['daily-logs', user?.id, thirtyDaysAgo, today, 'all'],
        queryFn: () => fetchDailyLogs(thirtyDaysAgo, today),
        enabled: Boolean(user && !isUsingMock),
        staleTime: 60_000,
    });

    const focusQuery = useQuery({
        queryKey: ['pomodoro-today-count', user?.id, today],
        queryFn: () => apiGet('/db/pomodoro_sessions', {
            params: {
                gte: JSON.stringify({ started_at: `${today}T00:00:00` }),
                lte: JSON.stringify({ started_at: `${today}T23:59:59` }),
            },
        }).then((rows) => (Array.isArray(rows) ? rows.length : 0)),
        enabled: Boolean(user && !isUsingMock),
        staleTime: 60_000,
    });

    const dsaQuery = useQuery({
        queryKey: ['dsa-30d-count', user?.id, thirtyDaysAgo],
        queryFn: () => apiGet('/db/dsa_problems', {
            params: { gte: JSON.stringify({ solved_at: `${thirtyDaysAgo}T00:00:00` }) },
        }).then((rows) => (Array.isArray(rows) ? rows.length : 0)),
        enabled: Boolean(user && !isUsingMock),
        staleTime: 120_000,
    });

    if (isUsingMock && mockData) {
        const { dailyLogs = [], pomodoroSessions = [] } = mockData;
        const todayLogData = dailyLogs.find((d) => d.date === today) || {};
        const weekTrendData = dailyLogs.filter((d) => d.date >= weekAgo && d.date <= today).sort((a, b) => b.date.localeCompare(a.date));
        const thirtyDayTrendData = dailyLogs.filter((d) => d.date >= thirtyDaysAgo && d.date <= today).sort((a, b) => b.date.localeCompare(a.date));
        const focusData = pomodoroSessions.filter((s) => s.started_at >= `${today}T00:00:00` && s.started_at <= `${today}T23:59:59`).length;

        return {
            loading: false,
            todayLog: todayLogData,
            weekTrend: weekTrendData,
            thirtyDayTrend: thirtyDayTrendData,
            todayFocus: focusData,
            dsaCount30d: 0,
            error: null,
            computed: buildComputed(weekTrendData, thirtyDayTrendData),
        };
    }

    const todayRaw = todayQuery.data;
    const todayLog = todayRaw && Object.keys(todayRaw).length ? todayRaw : null;
    const weekTrend = Array.isArray(weekQuery.data) ? weekQuery.data : [];
    const thirtyDayTrend = Array.isArray(thirtyQuery.data) ? thirtyQuery.data : [];
    const loading = todayQuery.isLoading || weekQuery.isLoading || thirtyQuery.isLoading;

    return {
        loading,
        todayLog,
        weekTrend,
        thirtyDayTrend,
        todayFocus: focusQuery.data ?? 0,
        dsaCount30d: dsaQuery.data ?? 0,
        error: todayQuery.error || weekQuery.error || thirtyQuery.error,
        computed: buildComputed(weekTrend, thirtyDayTrend),
    };
}

function buildComputed(weekTrend, thirtyDayTrend) {
    const gymDaysThisWeek = weekTrend?.filter((d) => d.gym_done).length || 0;
    const avgSleep = weekTrend?.length ? (weekTrend.reduce((sum, d) => sum + (d.sleep_hours || 0), 0) / weekTrend.length).toFixed(1) : 0;
    const avgSteps = weekTrend?.length ? Math.round(weekTrend.reduce((sum, d) => sum + (d.steps || 0), 0) / weekTrend.length) : 0;

    let currentStreak = 0;
    if (thirtyDayTrend) {
        const sorted = [...thirtyDayTrend].sort((a, b) => b.date.localeCompare(a.date));
        for (const log of sorted) {
            const did = log.gym_done || log.breakfast_done || log.learning_done || log.journal_entry?.trim();
            if (did) currentStreak += 1;
            else break;
        }
    }

    return {
        gymDaysThisWeek,
        avgSleep,
        avgSteps,
        currentStreak,
        loggedDays: thirtyDayTrend?.length || 0,
        gymDays: thirtyDayTrend?.filter((l) => l.gym_done).length || 0,
        learningDays: thirtyDayTrend?.filter((l) => l.learning_done).length || 0,
    };
}

export { dateRange };
