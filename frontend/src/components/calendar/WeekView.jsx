import React, { useMemo } from 'react';
import { SYSTEM_COLORS } from './EventCard';
import { useThemeContext } from '../../context/ThemeContext';

const HOURS = Array.from({ length: 24 }, (_, i) => i);

/**
 * WeekView — 7-column time grid with event blocks positioned by time.
 * Redesigned with Nordic Calm aesthetic.
 */
const WeekView = ({ events, currentDate, onEventClick, onSlotClick }) => {
    const { theme } = useThemeContext();
    const isDark = theme === 'dark';

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

    const border = 'var(--color-border)';
    const text1 = 'var(--color-text-1)';
    const text2 = 'var(--color-text-2)';
    const bg = 'var(--color-base)';

    return (
        <div style={{ 
            background: bg, border: `1px solid ${border}`, 
            borderRadius: 'var(--r-lg)', overflow: 'hidden',
            boxShadow: 'var(--glass-shadow-sm)'
        }}>
            {/* Day headers */}
            <div style={{ 
                display: 'grid', gridTemplateColumns: '60px repeat(7, 1fr)', 
                borderBottom: `1px solid ${border}`, background: 'var(--color-surface)',
                backdropFilter: 'var(--glass-blur)', WebkitBackdropFilter: 'var(--glass-blur)'
            }}>
                <div style={{ borderRight: `1px solid ${border}` }} />
                {days.map((day, i) => {
                    const isToday = day.toDateString() === todayStr;
                    return (
                        <div key={day.toDateString()} style={{
                            padding: '14px 8px', textAlign: 'center',
                            borderRight: i < 6 ? `1px solid ${border}` : 'none',
                            background: isToday ? 'var(--color-accent-dim)' : 'transparent',
                            transition: 'all 200ms var(--ease)',
                        }}>
                            <div style={{ fontSize: '10px', fontWeight: 700, color: text2, textTransform: 'uppercase', letterSpacing: '0.08em', fontFamily: 'var(--font-sans)', marginBottom: '4px' }}>
                                {day.toLocaleDateString('en-US', { weekday: 'short' })}
                            </div>
                            <div style={{ 
                                fontSize: '16px', fontWeight: isToday ? 700 : 600, 
                                color: isToday ? 'var(--color-accent)' : text1,
                                fontFamily: 'var(--font-sans)', letterSpacing: '-0.02em'
                            }}>
                                {day.getDate()}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Time grid */}
            <div style={{ maxHeight: '600px', overflowY: 'auto', background: bg }}>
                {HOURS.map(hour => (
                    <div key={hour} style={{ 
                        display: 'grid', gridTemplateColumns: '60px repeat(7, 1fr)', 
                        minHeight: '60px', borderBottom: `1px solid ${border}` 
                    }}>
                        <div style={{ 
                            padding: '12px 8px', fontSize: '10px', fontWeight: 700, 
                            color: text2, borderRight: `1px solid ${border}`, 
                            textAlign: 'right', fontFamily: 'var(--font-sans)',
                            letterSpacing: '0.02em'
                        }}>
                            {hour === 0 ? '12 AM' : hour < 12 ? `${hour} AM` : hour === 12 ? '12 PM' : `${hour - 12} PM`}
                        </div>
                        {days.map((day, i) => {
                            const dayKey = day.toDateString();
                            const hourEvents = (eventsByDay[dayKey] || []).filter(ev => {
                                const h = new Date(ev.start_time).getHours();
                                return h === hour;
                            });
                            const isWeekend = day.getDay() === 0 || day.getDay() === 6;

                            return (
                                <div
                                    key={dayKey + hour}
                                    onClick={() => {
                                        const slot = new Date(day);
                                        slot.setHours(hour, 0, 0, 0);
                                        onSlotClick?.(slot);
                                    }}
                                    style={{
                                        borderRight: i < 6 ? `1px solid ${border}` : 'none',
                                        padding: '4px', cursor: 'pointer',
                                        position: 'relative',
                                        background: isWeekend ? 'var(--color-surface)' : 'transparent',
                                        transition: 'background 200ms var(--ease)',
                                    }}
                                    onMouseEnter={e => { e.currentTarget.style.background = 'var(--color-elevated)'; }}
                                    onMouseLeave={e => { e.currentTarget.style.background = isWeekend ? 'var(--color-surface)' : 'transparent'; }}
                                >
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                        {hourEvents.map(ev => {
                                            const sys = SYSTEM_COLORS[ev.system_type] || SYSTEM_COLORS.general;
                                            return (
                                                <div 
                                                    key={ev.id} 
                                                    onClick={e => { e.stopPropagation(); onEventClick?.(ev); }} 
                                                    style={{
                                                        padding: '4px 8px', borderRadius: '6px',
                                                        background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)', 
                                                        borderLeft: `2px solid ${sys.color}`,
                                                        fontSize: '10px', fontWeight: 600, color: sys.color,
                                                        cursor: 'pointer', fontFamily: 'var(--font-sans)',
                                                        whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                                                        transition: 'transform 150ms var(--ease)',
                                                        boxShadow: 'var(--glass-shadow-sm)',
                                                    }}
                                                    onMouseEnter={e => e.currentTarget.style.transform = 'translateX(2px)'}
                                                    onMouseLeave={e => e.currentTarget.style.transform = 'translateX(0)'}
                                                >
                                                    {ev.title}
                                                </div>
                                            );
                                        })}
                                    </div>
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
