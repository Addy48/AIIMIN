import React, { useMemo } from 'react';
import { SYSTEM_COLORS } from './EventCard';

const HOURS = Array.from({ length: 24 }, (_, i) => i);

/**
 * WeekView — 7-column time grid with event blocks positioned by time.
 */
const WeekView = ({ events, currentDate, onEventClick, onSlotClick }) => {
    const d = new Date(currentDate);
    const dayOfWeek = d.getDay();
    const mondayOffset = dayOfWeek === 0 ? 6 : dayOfWeek - 1;

    const monday = new Date(d);
    monday.setDate(d.getDate() - mondayOffset);
    monday.setHours(0, 0, 0, 0);

    const days = Array.from({ length: 7 }, (_, i) => {
        const date = new Date(monday);
        date.setDate(monday.getDate() + i);
        return date;
    });

    const now = new Date();
    const todayStr = now.toDateString();

    const eventsByDay = useMemo(() => {
        const grouped = {};
        days.forEach(day => { grouped[day.toDateString()] = []; });
        (events || []).forEach(ev => {
            const key = new Date(ev.start_time).toDateString();
            if (grouped[key]) grouped[key].push(ev);
        });
        return grouped;
    }, [events, days]);

    return (
        <div className="glass-panel" style={{ borderRadius: '16px', overflow: 'hidden' }}>
            {/* Day headers */}
            <div style={{ display: 'grid', gridTemplateColumns: '50px repeat(7, 1fr)', borderBottom: '1px solid var(--border)' }}>
                <div style={{ padding: '10px', borderRight: '1px solid var(--border)' }} />
                {days.map(day => {
                    const isToday = day.toDateString() === todayStr;
                    return (
                        <div key={day.toDateString()} style={{
                            padding: '10px 8px', textAlign: 'center',
                            borderRight: '1px solid var(--border)',
                            background: isToday ? 'rgba(245,166,35,0.06)' : 'transparent',
                        }}>
                            <div style={{ fontSize: '10px', fontWeight: 600, color: 'var(--text-3)', textTransform: 'uppercase' }}>
                                {day.toLocaleDateString('en-US', { weekday: 'short' })}
                            </div>
                            <div style={{ fontSize: '16px', fontWeight: isToday ? 800 : 600, color: isToday ? 'var(--accent)' : 'var(--text-1)' }}>
                                {day.getDate()}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Time grid */}
            <div style={{ maxHeight: '600px', overflow: 'auto' }}>
                {HOURS.map(hour => (
                    <div key={hour} style={{ display: 'grid', gridTemplateColumns: '50px repeat(7, 1fr)', minHeight: '48px', borderBottom: '1px solid var(--border)' }}>
                        <div style={{ padding: '4px 6px', fontSize: '10px', fontWeight: 600, color: 'var(--text-3)', borderRight: '1px solid var(--border)', textAlign: 'right' }}>
                            {hour === 0 ? '12 AM' : hour < 12 ? `${hour} AM` : hour === 12 ? '12 PM' : `${hour - 12} PM`}
                        </div>
                        {days.map(day => {
                            const dayKey = day.toDateString();
                            const hourEvents = (eventsByDay[dayKey] || []).filter(ev => {
                                const h = new Date(ev.start_time).getHours();
                                return h === hour;
                            });
                            return (
                                <div
                                    key={dayKey + hour}
                                    onClick={() => {
                                        const slot = new Date(day);
                                        slot.setHours(hour, 0, 0, 0);
                                        onSlotClick?.(slot);
                                    }}
                                    style={{
                                        borderRight: '1px solid var(--border)',
                                        padding: '2px', cursor: 'pointer',
                                        position: 'relative',
                                    }}
                                    onMouseEnter={e => { e.currentTarget.style.background = 'var(--bg-elevated)'; }}
                                    onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
                                >
                                    {hourEvents.map(ev => {
                                        const sys = SYSTEM_COLORS[ev.system_type] || SYSTEM_COLORS.general;
                                        return (
                                            <div key={ev.id} onClick={e => { e.stopPropagation(); onEventClick?.(ev); }} style={{
                                                padding: '2px 6px', borderRadius: '4px',
                                                background: sys.bg, borderLeft: `3px solid ${sys.color}`,
                                                fontSize: '10px', fontWeight: 600, color: sys.color,
                                                cursor: 'pointer', marginBottom: '2px',
                                                whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                                            }}>
                                                {ev.title}
                                            </div>
                                        );
                                    })}
                                </div>
                            );
                        })}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default WeekView;
