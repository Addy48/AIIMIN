import React from 'react';
import { format, isSameDay } from 'date-fns';
import { EventCard } from './EventCard';

/**
 * AgendaView — Chronological list of upcoming events grouped by date.
 */
const AgendaView = ({ events, onEventClick }) => {
    const grouped = {};
    const sorted = [...(events || [])].sort((a, b) => new Date(a.start_time) - new Date(b.start_time));

    sorted.forEach(ev => {
        const key = new Date(ev.start_time).toDateString();
        if (!grouped[key]) grouped[key] = [];
        grouped[key].push(ev);
    });

    const dateGroups = Object.entries(grouped);
    if (!dateGroups.length) {
        return (
            <div className="glass-panel" style={{ borderRadius: '16px', padding: '40px 20px', textAlign: 'center' }}>
                <div style={{ fontSize: '28px', marginBottom: '10px' }}>📭</div>
                <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-2)' }}>No events in this period</div>
                <div style={{ fontSize: '12px', color: 'var(--text-3)', marginTop: '4px' }}>Click "+ New" to schedule something</div>
            </div>
        );
    }

    const now = new Date();
    const todayString = now.toDateString();

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {dateGroups.map(([dateStr, evts]) => {
                const isToday = dateStr === todayString;
                const label = isToday ? 'Today' : new Date(dateStr).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

                return (
                    <div key={dateStr} className="glass-panel" style={{ borderRadius: '14px', padding: '16px 18px' }}>
                        <div style={{
                            fontSize: '12px', fontWeight: 800, color: isToday ? 'var(--accent)' : 'var(--text-2)',
                            textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '10px',
                            display: 'flex', alignItems: 'center', gap: '8px',
                        }}>
                            {isToday && <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--accent)' }} />}
                            {label}
                            <span style={{ fontSize: '10px', fontWeight: 500, color: 'var(--text-3)' }}>({evts.length})</span>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                            {evts.map(ev => (
                                <EventCard key={ev.id} event={ev} onClick={onEventClick} />
                            ))}
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default AgendaView;
