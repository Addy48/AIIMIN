import React from 'react';
import { EventCard } from './EventCard';

/**
 * AgendaView — Chronological list of upcoming events grouped by date.
 * Redesigned with Nordic Calm aesthetic.
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
    
    const border = 'var(--color-border)';
    const text1 = 'var(--color-text-1)';
    const text2 = 'var(--color-text-2)';
    const bg = 'var(--color-base)';

    if (!dateGroups.length) {
        return (
            <div style={{ 
                background: 'var(--color-elevated)', border: `1px solid ${border}`, 
                borderRadius: 'var(--r-lg)', padding: '60px 20px', textAlign: 'center',
                boxShadow: 'var(--glass-shadow-sm)'
            }}>
                <div style={{ fontSize: '32px', marginBottom: '16px', opacity: 0.5 }}>📭</div>
                <div style={{ fontSize: '15px', fontWeight: 700, color: text1, fontFamily: 'var(--font-sans)' }}>No events scheduled</div>
                <div style={{ fontSize: '12px', color: text2, marginTop: '6px', fontFamily: 'var(--font-sans)' }}>Schedule a new event to see it here</div>
            </div>
        );
    }

    const now = new Date();
    const todayString = now.toDateString();

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {dateGroups.map(([dateStr, evts]) => {
                const isToday = dateStr === todayString;
                const label = isToday ? 'Today' : new Date(dateStr).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

                return (
                    <div key={dateStr} style={{ 
                        background: 'var(--color-surface)', border: `1px solid ${border}`, 
                        borderRadius: 'var(--r-lg)', padding: '20px 24px',
                        boxShadow: 'var(--glass-shadow-sm)'
                    }}>
                        <div style={{
                            fontSize: '11px', fontWeight: 700, color: isToday ? 'var(--color-accent)' : text2,
                            textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '16px',
                            display: 'flex', alignItems: 'center', gap: '10px',
                            fontFamily: 'var(--font-sans)'
                        }}>
                            {isToday && <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--color-accent)' }} />}
                            {label}
                            <span style={{ fontSize: '10px', fontWeight: 600, color: 'var(--color-text-3)', opacity: 0.6 }}>· {evts.length} events</span>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
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
