import React from 'react';
import { EventCard } from './EventCard';
import { useThemeContext } from '../../context/ThemeContext';

const HOURS = Array.from({ length: 24 }, (_, i) => i);

/**
 * DayView — Single-day hourly timeline with event blocks.
 * Redesigned with Nordic Calm aesthetic.
 */
const DayView = ({ events, currentDate, onEventClick, onSlotClick }) => {
    const { theme } = useThemeContext();
    const isDark = theme === 'dark';

    const d = new Date(currentDate);
    const dateLabel = d.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
    const now = new Date();
    const isToday = d.toDateString() === now.toDateString();
    const currentHour = now.getHours();

    const allDayEvents = (events || []).filter(ev => ev.all_day);
    const timedEvents = (events || []).filter(ev => !ev.all_day);

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
            <div style={{ 
                padding: '24px 28px', borderBottom: `1px solid ${border}`,
                background: 'var(--color-surface)',
                backdropFilter: 'var(--glass-blur)', WebkitBackdropFilter: 'var(--glass-blur)'
            }}>
                <div style={{ 
                    fontSize: '18px', fontWeight: 700, color: text1, 
                    fontFamily: 'var(--font-sans)', letterSpacing: '-0.02em'
                }}>{dateLabel}</div>
                {allDayEvents.length > 0 && (
                    <div style={{ display: 'flex', gap: '8px', marginTop: '16px', flexWrap: 'wrap' }}>
                        {allDayEvents.map(ev => (
                            <EventCard key={ev.id} event={ev} compact onClick={onEventClick} />
                        ))}
                    </div>
                )}
            </div>

            <div style={{ maxHeight: '600px', overflowY: 'auto', background: bg }}>
                {HOURS.map(hour => {
                    const hourEvents = timedEvents.filter(ev => new Date(ev.start_time).getHours() === hour);
                    const isNowHour = isToday && hour === currentHour;

                    return (
                        <div
                            key={hour}
                            onClick={() => {
                                const slot = new Date(d);
                                slot.setHours(hour, 0, 0, 0);
                                onSlotClick?.(slot);
                            }}
                            style={{
                                display: 'grid', gridTemplateColumns: '70px 1fr',
                                minHeight: '64px', borderBottom: `1px solid ${border}`,
                                cursor: 'pointer',
                                background: isNowHour ? 'var(--color-accent-dim)' : 'transparent',
                                transition: 'background 200ms var(--ease)',
                            }}
                            onMouseEnter={e => { e.currentTarget.style.background = 'var(--color-elevated)'; }}
                            onMouseLeave={e => { e.currentTarget.style.background = isNowHour ? 'var(--color-accent-dim)' : 'transparent'; }}
                        >
                            <div style={{
                                padding: '16px 12px', fontSize: '11px', fontWeight: 700,
                                color: isNowHour ? 'var(--color-accent)' : text2, textAlign: 'right',
                                borderRight: `1px solid ${border}`,
                                fontFamily: 'var(--font-sans)',
                                letterSpacing: '0.02em'
                            }}>
                                {hour === 0 ? '12 AM' : hour < 12 ? `${hour} AM` : hour === 12 ? '12 PM' : `${hour - 12} PM`}
                            </div>
                            <div style={{ padding: '8px 16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                {hourEvents.map(ev => (
                                    <EventCard key={ev.id} event={ev} onClick={onEventClick} />
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default DayView;
