import React from 'react';
import { EventCard } from './EventCard';
import { format, isSameDay, addHours, startOfDay } from 'date-fns';

const HOURS = Array.from({ length: 24 }, (_, i) => i);

/**
 * DayView — Single-day hourly timeline with event blocks.
 */
const DayView = ({ events, currentDate, onEventClick, onSlotClick }) => {
    const d = new Date(currentDate);
    const dateLabel = d.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
    const now = new Date();
    const isToday = d.toDateString() === now.toDateString();
    const currentHour = now.getHours();

    const allDayEvents = (events || []).filter(ev => ev.all_day);
    const timedEvents = (events || []).filter(ev => !ev.all_day);

    return (
        <div className="glass-panel" style={{ borderRadius: '16px', overflow: 'hidden' }}>
            <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)' }}>
                <div style={{ fontSize: '16px', fontWeight: 800, color: 'var(--text-1)' }}>{dateLabel}</div>
                {allDayEvents.length > 0 && (
                    <div style={{ display: 'flex', gap: '6px', marginTop: '10px', flexWrap: 'wrap' }}>
                        {allDayEvents.map(ev => (
                            <EventCard key={ev.id} event={ev} compact onClick={onEventClick} />
                        ))}
                    </div>
                )}
            </div>

            <div style={{ maxHeight: '600px', overflow: 'auto' }}>
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
                                display: 'grid', gridTemplateColumns: '60px 1fr',
                                minHeight: '52px', borderBottom: '1px solid var(--border)',
                                cursor: 'pointer',
                                background: isNowHour ? 'rgba(245,166,35,0.04)' : 'transparent',
                            }}
                            onMouseEnter={e => { e.currentTarget.style.background = 'var(--bg-elevated)'; }}
                            onMouseLeave={e => { e.currentTarget.style.background = isNowHour ? 'rgba(245,166,35,0.04)' : 'transparent'; }}
                        >
                            <div style={{
                                padding: '6px 8px', fontSize: '11px', fontWeight: 600,
                                color: isNowHour ? 'var(--accent)' : 'var(--text-3)', textAlign: 'right',
                                borderRight: isNowHour ? '2px solid var(--accent)' : '1px solid var(--border)',
                            }}>
                                {hour === 0 ? '12 AM' : hour < 12 ? `${hour} AM` : hour === 12 ? '12 PM' : `${hour - 12} PM`}
                            </div>
                            <div style={{ padding: '4px 8px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
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
