import React, { useMemo } from 'react';
import { SYSTEM_COLORS } from './EventCard';

/**
 * CalendarSidebar — Mini month navigator + system type filter + upcoming strip.
 */
const CalendarSidebar = ({ currentDate, onDateChange, events, systemFilter, onSystemFilterChange }) => {
    const d = new Date(currentDate);
    const year = d.getFullYear();
    const month = d.getMonth();
    const now = useMemo(() => new Date(), []);
    const today = now.getDate();
    const isCurrentMonth = year === now.getFullYear() && month === now.getMonth();

    const daysInMonth = new Date(year, month + 1, 0).getDate();
    let firstDayOffset = new Date(year, month, 1).getDay() - 1;
    if (firstDayOffset < 0) firstDayOffset = 6;

    const monthLabel = d.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

    /* System type counts */
    const systemCounts = useMemo(() => {
        const counts = {};
        (events || []).forEach(ev => {
            const type = ev.system_type || 'general';
            counts[type] = (counts[type] || 0) + 1;
        });
        return counts;
    }, [events]);

    /* Upcoming (next 7 days) */
    const upcoming = useMemo(() => {
        const cutoff = new Date(now.getTime() + 7 * 86400000);
        return (events || [])
            .filter(ev => new Date(ev.start_time) >= now && new Date(ev.start_time) <= cutoff && !ev.completed)
            .sort((a, b) => new Date(a.start_time) - new Date(b.start_time))
            .slice(0, 5);
    }, [events, now]);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '220px', flexShrink: 0 }}>
            {/* Mini Month */}
            <div style={{ background: 'var(--bg-elevated)', borderRadius: 'var(--radius-lg)', padding: '16px', border: '1px solid var(--color-border)' }}>
                <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-1)', marginBottom: '16px', textAlign: 'center' }}>
                    {monthLabel}
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px', fontSize: '10px', textAlign: 'center' }}>
                    {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((w, i) => (
                        <div key={i} style={{ color: 'var(--text-3)', fontWeight: 600, padding: '2px 0' }}>{w}</div>
                    ))}
                    {Array.from({ length: firstDayOffset }, (_, i) => <div key={`p-${i}`} />)}
                    {Array.from({ length: daysInMonth }, (_, i) => {
                        const day = i + 1;
                        const isToday = isCurrentMonth && day === today;
                        const isSelected = d.getDate() === day;
                        return (
                            <div
                                key={day}
                                onClick={() => onDateChange(new Date(year, month, day).toISOString())}
                                style={{
                                    padding: '4px 0', borderRadius: '4px', cursor: 'pointer',
                                    fontWeight: isToday || isSelected ? 600 : 400,
                                    color: isSelected ? 'var(--bg-primary)' : isToday ? 'var(--accent)' : 'var(--text-2)',
                                    background: isSelected ? 'var(--text-1)' : isToday ? 'var(--accent-dim)' : 'transparent',
                                    transition: 'background var(--dur-fast)',
                                }}
                            >{day}</div>
                        );
                    })}
                </div>
            </div>

            {/* System Filters */}
            <div style={{ background: 'var(--bg-elevated)', borderRadius: 'var(--radius-lg)', padding: '16px', border: '1px solid var(--color-border)' }}>
                <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '12px' }}>
                    Systems
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <button
                        onClick={() => onSystemFilterChange(null)}
                        style={{
                            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                            padding: '6px 10px', borderRadius: '6px', border: 'none', cursor: 'pointer',
                            background: !systemFilter ? 'var(--text-1)' : 'transparent',
                            color: !systemFilter ? 'var(--bg-primary)' : 'var(--text-2)',
                            fontSize: '12px', fontWeight: 500, width: '100%', textAlign: 'left',
                            transition: 'background var(--dur-fast)'
                        }}
                    >
                        <span>All</span>
                        <span style={{ fontSize: '10px', fontWeight: 600 }}>{(events || []).length}</span>
                    </button>
                    {Object.entries(SYSTEM_COLORS).map(([key, sys]) => (
                        <button
                            key={key}
                            onClick={() => onSystemFilterChange(systemFilter === key ? null : key)}
                            style={{
                                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                                padding: '6px 10px', borderRadius: '6px', border: 'none', cursor: 'pointer',
                                background: systemFilter === key ? sys.bg : 'transparent',
                                color: systemFilter === key ? sys.color : 'var(--text-2)',
                                fontSize: '12px', fontWeight: 500, width: '100%', textAlign: 'left',
                                transition: 'background var(--dur-fast)'
                            }}
                        >
                            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: sys.color }}></span>
                                {sys.label}
                            </span>
                            <span style={{ fontSize: '10px', fontWeight: 600 }}>{systemCounts[key] || 0}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Upcoming Strip */}
            {upcoming.length > 0 && (
                <div style={{ background: 'var(--bg-elevated)', borderRadius: 'var(--radius-lg)', padding: '16px', border: '1px solid var(--color-border)' }}>
                    <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '12px' }}>
                        Upcoming
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        {upcoming.map(ev => {
                            const sys = SYSTEM_COLORS[ev.system_type] || SYSTEM_COLORS.general;
                            const dt = new Date(ev.start_time);
                            return (
                                <div key={ev.id} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '11px' }}>
                                    <div style={{ width: '4px', height: '4px', borderRadius: '50%', background: sys.color, flexShrink: 0 }} />
                                    <div style={{ flex: 1, color: 'var(--text-1)', fontWeight: 600, overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
                                        {ev.title}
                                    </div>
                                    <div style={{ color: 'var(--text-3)', fontSize: '10px', flexShrink: 0 }}>
                                        {dt.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
};

export default CalendarSidebar;
