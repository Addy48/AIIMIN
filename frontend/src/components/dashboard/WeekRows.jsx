import React, { useMemo } from 'react';
import { useDailyLogsRange } from '../../hooks/useDailyLogsQuery';

const WeekRows = ({ stat, user }) => {
    const { logs, loading: loadingWeek } = useDailyLogsRange(7, {
        enabled: Boolean(user),
        fields: 'date,sleep_hours,gym_done,steps,learning_done,mood,journal_entry',
    });

    const weekData = useMemo(() => {
        const map = {};
        (logs || []).forEach((log) => { map[log.date] = log; });
        return map;
    }, [logs]);

    const formatValue = (log, type) => {
        if (!log) return null;
        if (type === 'sleep') return log.sleep_hours ? `${log.sleep_hours}h` : null;
        if (type === 'gym') return log.gym_done !== undefined ? (log.gym_done ? '✓ Done' : '✗ Skip') : null;
        if (type === 'steps') return log.steps ? `${(log.steps / 1000).toFixed(1)}k` : null;
        if (type === 'focus') return log.learning_done !== undefined ? (log.learning_done ? '✓ Done' : '—') : null;
        if (type === 'score') {
            let s = 0;
            if (log.sleep_hours && log.sleep_hours >= 5) s++;
            if (log.gym_done) s++;
            if (log.learning_done) s++;
            if (log.journal_entry && log.journal_entry.trim().length > 5) s++;
            if (log.steps && log.steps >= 5000) s++;
            if (log.mood) s++;
            return `${s}/6`;
        }
        return null;
    };

    const days = [];
    for (let i = 6; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        days.push({ label: d.toLocaleDateString('en-US', { weekday: 'short' }), dateStr: d.toISOString().split('T')[0], isToday: i === 0 });
    }

    if (loadingWeek) {
        return (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                {days.map((_, i) => <div key={i} className="skeleton" style={{ height: '34px', borderRadius: '6px' }} />)}
            </div>
        );
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {days.map((day, i) => {
                const log = weekData[day.dateStr];
                const val = formatValue(log, stat.id);
                const hasEntry = val !== null;

                if (day.isToday) {
                    return (
                        <div key={i} style={{
                            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                            padding: '8px 12px', borderRadius: '8px',
                            background: 'var(--accent-dim)', border: '1px solid var(--border-accent)',
                        }}>
                            <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--accent)' }}>Today</span>
                            <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--accent)' }}>
                                {hasEntry ? val : '—'}
                            </span>
                        </div>
                    );
                }

                return (
                    <div key={i} style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                        padding: '8px 12px', borderRadius: '8px',
                        background: hasEntry ? 'var(--bg-elevated)' : 'transparent',
                        border: '1px solid transparent',
                        opacity: hasEntry ? 1 : 0.5,
                    }}>
                        <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-3)' }}>{day.label}</span>
                        <span style={{ fontSize: '12px', fontWeight: 700, color: hasEntry ? 'var(--text-1)' : 'var(--text-3)' }}>
                            {hasEntry ? val : '—'}
                        </span>
                    </div>
                );
            })}
        </div>
    );
};

export default WeekRows;
