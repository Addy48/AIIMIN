/**
 * components/calendar/CalendarHeatmap.jsx
 *
 * Fetches daily_logs for a given month and renders a MetricMonthGrid
 * heatmap. Supports all tracked metric types via the `type` prop.
 */
import React, { useMemo } from 'react';
import { useAuth } from '../../hooks/useAuth';
import MetricMonthGrid from './MetricMonthGrid';
import { useDailyLogsQuery } from '../../hooks/useDailyLogsQuery';

/** Extract the numeric value for a given metric from a daily_log row. */
const valueForMetric = (log, type) => {
    if (!log) return 0;
    switch (type) {
        case 'sleep': return log.sleep_hours ? Math.round(log.sleep_hours * 60) : 0; // minutes
        case 'gym': return log.gym_done ? 1 : 0;
        case 'steps': return log.steps || 0;
        case 'focus': return log.pomodoro_minutes || (log.learning_done ? 60 : 0);
        case 'water': return log.water_bottles || 0;
        case 'mood': return log.mood || 0;
        case 'score': {
            let s = 0;
            if (log.sleep_hours && log.sleep_hours >= 5) s++;
            if (log.gym_done) s++;
            if (log.learning_done) s++;
            if (log.journal_entry?.trim()?.length > 5) s++;
            if (log.steps >= 5000) s++;
            if (log.mood) s++;
            return s;
        }
        default: return 0;
    }
};

const CalendarHeatmap = ({ year, month, type = 'focus' }) => {
    const { session } = useAuth();
    const startDate = `${year}-${String(month).padStart(2, '0')}-01`;
    const lastDay = new Date(year, month, 0).getDate();
    const endDate = `${year}-${String(month).padStart(2, '0')}-${String(lastDay).padStart(2, '0')}`;

    const { logs, loading } = useDailyLogsQuery({
        from: startDate,
        to: endDate,
        fields: 'date,sleep_hours,gym_done,steps,learning_done,mood,journal_entry,water_bottles',
        enabled: Boolean(session?.user?.id),
    });

    const data = useMemo(() => {
        const map = {};
        (logs || []).forEach((log) => {
            const habitsCompleted = [
                log.gym_done,
                log.learning_done,
                log.journal_entry?.trim()?.length > 5,
                log.steps >= 5000,
                log.mood >= 1,
            ].filter(Boolean).length;
            const focusSessions = Math.round((log.pomodoro_minutes || 0) / 25);
            map[log.date] = {
                value: valueForMetric(log, type),
                habitsCompleted,
                focusSessions,
                mood: log.mood || 0,
                focusMinutes: log.pomodoro_minutes || 0,
                steps: log.steps || 0,
            };
        });

        const dates = Object.keys(map).sort();
        const streakLen = {};
        let streak = 0;
        let prevDate = null;
        for (const d of dates) {
            if (prevDate) {
                const diff = (new Date(d) - new Date(prevDate)) / 86400000;
                streak = diff === 1 ? streak + 1 : 1;
            } else {
                streak = 1;
            }
            streakLen[d] = streak;
            prevDate = d;
        }

        for (const [d, entry] of Object.entries(map)) {
            const { habitsCompleted, focusSessions, mood } = entry;
            if (habitsCompleted >= 5) entry.signal = '✓';
            else if (focusSessions >= 3 && habitsCompleted >= 3) entry.signal = '★';
            else if ((streakLen[d] || 0) >= 5 && focusSessions >= 1) entry.signal = '🔥';
            else if (mood > 0 && mood <= 3) entry.signal = '●';
        }

        return map;
    }, [logs, type]);

    return (
        <div style={{ width: '100%', minHeight: '180px', opacity: loading ? 0.6 : 1, transition: 'opacity 0.2s' }}>
            <MetricMonthGrid
                year={year}
                month={month}
                data={data}
                defaultColor="var(--accent)"
                metricName={type}
                metricProp={type}
            />
        </div>
    );
};

export default CalendarHeatmap;
