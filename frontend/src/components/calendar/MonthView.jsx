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
        <div style={{ background: 'var(--bg-primary)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
            {/* Weekday headers */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', borderBottom: '1px solid var(--color-border)', background: 'var(--bg-elevated)' }}>
                {WEEKDAYS.map(w => (
                    <div key={w} style={{ textAlign: 'center', fontSize: '11px', fontWeight: 600, color: 'var(--text-2)', padding: '12px 0', borderRight: '1px solid var(--color-border)' }}>
                        {w}
                    </div>
                ))}
            </div>

            {/* Day cells */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', background: 'var(--color-border)', gap: '1px' }}>
                {Array.from({ length: firstDayOffset }, (_, i) => (
                    <div key={`pad-${i}`} style={{ minHeight: '120px', background: 'var(--bg-elevated)' }} />
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
                                minHeight: '120px', padding: '8px', cursor: 'pointer',
                                background: isToday ? 'var(--accent-dim)' : 'var(--bg-primary)',
                                transition: 'background var(--dur-fast)',
                                position: 'relative'
                            }}
                            onMouseEnter={e => { if (!isToday) e.currentTarget.style.background = 'var(--bg-elevated)'; }}
                            onMouseLeave={e => { if (!isToday) e.currentTarget.style.background = 'var(--bg-primary)'; }}
                        >
                            <div style={{
                                fontSize: '13px', fontWeight: isToday ? 600 : 400,
                                color: isToday ? 'var(--accent)' : 'var(--text-2)', marginBottom: '8px',
                                display: 'flex', justifyContent: 'center', alignItems: 'center',
                                width: '24px', height: '24px', borderRadius: '50%',
                                background: isToday ? 'var(--bg-primary)' : 'transparent',
                                boxShadow: isToday ? 'var(--glass-shadow-sm)' : 'none'
                            }}>
                                {day}
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                {dayEvents.slice(0, 4).map(ev => (
                                    <EventCard key={ev.id} event={ev} compact onClick={onEventClick} />
                                ))}
                                {dayEvents.length > 4 && (
                                    <div style={{ fontSize: '10px', color: 'var(--text-3)', fontWeight: 500, paddingLeft: '4px' }}>
                                        +{dayEvents.length - 4} more
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
                
                {/* Fill remaining cells to complete the grid */}
                {Array.from({ length: (7 - ((firstDayOffset + daysInMonth) % 7)) % 7 }, (_, i) => (
                    <div key={`pad-end-${i}`} style={{ minHeight: '120px', background: 'var(--bg-elevated)' }} />
                ))}
            </div>
        </div>
    );
};

export default MonthView;
