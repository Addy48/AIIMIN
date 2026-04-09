import React, { useMemo } from 'react';
import { EventCard } from './EventCard';

const WEEKDAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

/**
 * MonthView — 7×N calendar grid with event dots and day-click interaction.
 */
const MonthView = ({ events, currentDate, onDayClick, onEventClick }) => {
    const d = new Date(currentDate);
    const year = d.getFullYear();
    const month = d.getMonth();
    const now = new Date();
    const today = now.getDate();
    const isCurrentMonth = year === now.getFullYear() && month === now.getMonth();

    const daysInMonth = new Date(year, month + 1, 0).getDate();
    let firstDayOffset = new Date(year, month, 1).getDay() - 1;
    if (firstDayOffset < 0) firstDayOffset = 6;

    const eventsByDay = useMemo(() => {
        const grouped = {};
        (events || []).forEach(ev => {
            const day = new Date(ev.start_time).getDate();
            if (!grouped[day]) grouped[day] = [];
            grouped[day].push(ev);
        });
        return grouped;
    }, [events]);

    return (
        <div className="glass-panel" style={{ borderRadius: '16px', padding: '20px' }}>
            {/* Weekday headers */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '2px', marginBottom: '8px' }}>
                {WEEKDAYS.map(w => (
                    <div key={w} style={{ textAlign: 'center', fontSize: '10px', fontWeight: 700, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.06em', padding: '4px 0' }}>
                        {w}
                    </div>
                ))}
            </div>

            {/* Day cells */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '2px' }}>
                {Array.from({ length: firstDayOffset }, (_, i) => (
                    <div key={`pad-${i}`} style={{ minHeight: '80px' }} />
                ))}

                {Array.from({ length: daysInMonth }, (_, i) => {
                    const day = i + 1;
                    const isToday = isCurrentMonth && day === today;
                    const dayEvents = eventsByDay[day] || [];

                    return (
                        <div
                            key={day}
                            onClick={() => onDayClick(new Date(year, month, day))}
                            style={{
                                minHeight: '80px', padding: '4px 6px', cursor: 'pointer',
                                borderRadius: '8px', border: isToday ? '1.5px solid var(--accent)' : '1px solid transparent',
                                background: isToday ? 'rgba(245,166,35,0.06)' : 'transparent',
                                transition: 'background 0.1s',
                            }}
                            onMouseEnter={e => { if (!isToday) e.currentTarget.style.background = 'var(--bg-elevated)'; }}
                            onMouseLeave={e => { if (!isToday) e.currentTarget.style.background = 'transparent'; }}
                        >
                            <div style={{
                                fontSize: '11px', fontWeight: isToday ? 800 : 500,
                                color: isToday ? 'var(--accent)' : 'var(--text-2)', marginBottom: '4px',
                            }}>{day}</div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                                {dayEvents.slice(0, 3).map(ev => (
                                    <EventCard key={ev.id} event={ev} compact onClick={onEventClick} />
                                ))}
                                {dayEvents.length > 3 && (
                                    <div style={{ fontSize: '9px', color: 'var(--text-3)', fontWeight: 600 }}>
                                        +{dayEvents.length - 3} more
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default MonthView;
