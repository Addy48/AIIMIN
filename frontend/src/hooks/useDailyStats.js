import { useState, useEffect } from 'react';
import supabase from '../utils/supabase';
import { useMockData } from '../providers/MockDataProvider';

/**
 * useDailyStats hook
 * 
 * Centralized hook to fetch daily statistics from Supabase for a given user.
 * Eliminates duplicate data fetching logic across Physical, Cognitive, Behavior, and Overview pages.
 */
export function useDailyStats(user) {
    const { isUsingMock, mockData } = useMockData() || {};
    const [todayLog, setTodayLog] = useState(null);
    const [weekTrend, setWeekTrend] = useState(null);
    const [thirtyDayTrend, setThirtyDayTrend] = useState(null);
    const [todayFocus, setTodayFocus] = useState(null);
    const [dsaCount30d, setDsaCount30d] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) return;

        const today = new Date().toLocaleDateString('en-CA');
        const weekAgo = new Date(Date.now() - 6 * 86400000).toLocaleDateString('en-CA');
        const thirtyDaysAgo = new Date(Date.now() - 30 * 86400000).toLocaleDateString('en-CA');

        if (isUsingMock && mockData) {
            setLoading(true);
            const { dailyLogs = [], pomodoroSessions = [] } = mockData;

            const todayLogData = dailyLogs.find(d => d.date === today) || {};
            const weekTrendData = dailyLogs.filter(d => d.date >= weekAgo && d.date <= today).sort((a, b) => b.date.localeCompare(a.date));
            const thirtyDayTrendData = dailyLogs.filter(d => d.date >= thirtyDaysAgo && d.date <= today).sort((a, b) => b.date.localeCompare(a.date));
            const focusData = pomodoroSessions.filter(s => s.started_at >= today + 'T00:00:00' && s.started_at <= today + 'T23:59:59').length;

            setTodayLog(todayLogData);
            setWeekTrend(weekTrendData);
            setThirtyDayTrend(thirtyDayTrendData);
            setTodayFocus(focusData);
            setDsaCount30d(0);
            setLoading(false);
            return;
        }

        Promise.all([
            // 1. Today's daily log
            supabase.from('daily_logs')
                .select('*')
                .eq('user_id', user.id).eq('date', today).maybeSingle()
                .then(({ data }) => data || {}),

            // 2. 7-day trend (Physical/Overview)
            supabase.from('daily_logs')
                .select('date, sleep_hours, steps, gym_done, water_bottles')
                .eq('user_id', user.id).gte('date', weekAgo)
                .order('date', { ascending: false })
                .then(({ data }) => data || []),

            // 3. 30-day trend (Behavior/Overview)
            supabase.from('daily_logs')
                .select('date, gym_done, breakfast_done, learning_done, journal_entry')
                .eq('user_id', user.id).gte('date', thirtyDaysAgo)
                .order('date', { ascending: false })
                .then(({ data }) => data || []),

            // 4. Today's focus sessions (Cognitive/Overview)
            supabase.from('pomodoro_sessions').select('id').eq('user_id', user.id)
                .gte('started_at', today + 'T00:00:00').lte('started_at', today + 'T23:59:59')
                .then(({ data }) => data?.length || 0),

            // 5. 30-day DSA count (Cognitive)
            supabase.from('dsa_problems').select('id').eq('user_id', user.id)
                .gte('solved_at', thirtyDaysAgo + 'T00:00:00')
                .then(({ data }) => data?.length || 0),
        ])
            .then(([today, week, thirtyDays, focus, dsa]) => {
                setTodayLog(today);
                setWeekTrend(week);
                setThirtyDayTrend(thirtyDays);
                setTodayFocus(focus);
                setDsaCount30d(dsa);
            })
            .catch((err) => {
                console.error("Pipeline failure in useDailyStats:", err);
                setError(err);
                throw err;
            })
            .finally(() => setLoading(false));

    }, [user, isUsingMock, mockData]);

    // Calculate generic stats
    const gymDaysThisWeek = weekTrend?.filter(d => d.gym_done).length || 0;
    const avgSleep = weekTrend?.length ? (weekTrend.reduce((sum, d) => sum + (d.sleep_hours || 0), 0) / weekTrend.length).toFixed(1) : 0;
    const avgSteps = weekTrend?.length ? Math.round(weekTrend.reduce((sum, d) => sum + (d.steps || 0), 0) / weekTrend.length) : 0;

    let currentStreak = 0;
    if (thirtyDayTrend) {
        const sorted = [...thirtyDayTrend].sort((a, b) => b.date.localeCompare(a.date));
        for (const log of sorted) {
            const did = log.gym_done || log.breakfast_done || log.learning_done || log.journal_entry?.trim();
            if (did) currentStreak++;
            else break;
        }
    }
    const loggedDays = thirtyDayTrend?.length || 0;
    const gymDays = thirtyDayTrend?.filter(l => l.gym_done).length || 0;
    const learningDays = thirtyDayTrend?.filter(l => l.learning_done).length || 0;

    return {
        loading,
        todayLog,
        weekTrend,
        thirtyDayTrend,
        todayFocus,
        dsaCount30d,
        error,
        computed: {
            gymDaysThisWeek,
            avgSleep,
            avgSteps,
            currentStreak,
            loggedDays,
            gymDays,
            learningDays
        }
    };
}
