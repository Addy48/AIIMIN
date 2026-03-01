import React, { useState, useEffect } from 'react';
import supabase from '../utils/supabase';

const CalendarIntegration = ({ user }) => {
    // Note: To fully implement this, the user's Supabase session needs 
    // the provider_token from Google OAuth with Calendar scopes.

    const [events, setEvents] = useState([]);
    const [isLoadingEvents, setIsLoadingEvents] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');

    useEffect(() => {
        handleSync();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleSync = async () => {
        setIsLoadingEvents(true);
        setErrorMsg('');
        try {
            const { data: { session } } = await supabase.auth.getSession();
            const providerToken = session?.provider_token;

            if (!providerToken) {
                setErrorMsg('No Google Calendar access token found. Please sign in again with Calendar scopes enabled.');
                setEvents([]);
                return;
            }

            // Fetch today's events from Google Calendar API
            const now = new Date();
            const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();
            const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59).toISOString();

            const res = await fetch(`https://www.googleapis.com/calendar/v3/calendars/primary/events?timeMin=${encodeURIComponent(startOfDay)}&timeMax=${encodeURIComponent(endOfDay)}&singleEvents=true&orderBy=startTime`, {
                headers: {
                    Authorization: `Bearer ${providerToken}`
                }
            });

            if (!res.ok) {
                if (res.status === 401 || res.status === 403) {
                    throw new Error('Insufficient permissions. You must add the Calendar scope in Supabase Google Provider settings.');
                }
                throw new Error('Error fetching calendar events.');
            }

            const data = await res.json();
            const formattedEvents = (data.items || []).map(item => {
                let startTime = item.start.dateTime || item.start.date;
                let endTime = item.end.dateTime || item.end.date;

                const formatTime = (isoString) => {
                    const d = new Date(isoString);
                    // Check if it's an all-day event
                    if (isoString.length === 10) return 'All Day';
                    return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
                };

                // Naive categorization based on title keywords
                const titleLower = item.summary?.toLowerCase() || '';
                let type = 'personal';
                if (titleLower.includes('work') || titleLower.includes('focus') || titleLower.includes('study')) type = 'focus';
                if (titleLower.includes('meet') || titleLower.includes('call') || titleLower.includes('sync')) type = 'meeting';

                return {
                    id: item.id,
                    title: item.summary || 'Busy',
                    time: `${formatTime(startTime)} - ${formatTime(endTime)}`,
                    type
                };
            });

            setEvents(formattedEvents);

        } catch (err) {
            console.error('Calendar sync error:', err);
            setErrorMsg(err.message);
        } finally {
            setIsLoadingEvents(false);
        }
    };

    return (
        <div className="fade-up flex flex-col gap-6">

            {/* Header info */}
            <div style={{ background: 'var(--bg-card)', borderRadius: '16px', padding: '24px', border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)', position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'relative', zIndex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                        <h3 style={{ fontSize: '18px', fontWeight: 800, margin: 0, color: 'var(--text-1)' }}>Today's Schedule</h3>
                        <button
                            onClick={handleSync}
                            className="hover:scale-105"
                            style={{ background: 'var(--accent-dim)', color: 'var(--accent)', border: '1px solid var(--border-accent)', padding: '6px 14px', borderRadius: '6px', fontSize: '13px', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', transition: 'all 0.2s' }}
                        >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={isLoadingEvents ? 'animate-spin' : ''}>
                                <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.59-8.27l5.67-5.67" />
                            </svg>
                            Sync Calendar
                        </button>
                    </div>

                    <p style={{ fontSize: '13px', color: 'var(--text-3)', margin: '0 0 20px 0', lineHeight: 1.5, maxWidth: '80%' }}>
                        Time block your day to stay focused. Enable Google Calendar scopes (`https://www.googleapis.com/auth/calendar`) in your Supabase Auth settings to sync automatically.
                    </p>

                    {errorMsg && (
                        <div style={{ padding: '10px 14px', background: 'var(--danger-dim)', color: 'var(--danger)', fontSize: '12px', fontWeight: 600, borderRadius: '8px', border: '1px solid rgba(224,92,92,0.2)' }}>
                            {errorMsg}
                        </div>
                    )}
                </div>

                {/* Decorative background element */}
                <svg style={{ position: 'absolute', right: '-20px', bottom: '-20px', width: '120px', height: '120px', opacity: 0.05, zIndex: 0, pointerEvents: 'none' }} viewBox="0 0 24 24" fill="currentColor">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                    <line x1="16" y1="2" x2="16" y2="6"></line>
                    <line x1="8" y1="2" x2="8" y2="6"></line>
                    <line x1="3" y1="10" x2="21" y2="10"></line>
                </svg>
            </div>

            {/* Schedule Timeline */}
            <div style={{ padding: '0 8px' }}>
                <div style={{ width: '2px', background: 'var(--border)', position: 'absolute', left: '38px', top: '160px', bottom: '0', zIndex: -1 }}></div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

                    {events.length === 0 && !isLoadingEvents && !errorMsg && (
                        <div style={{ color: 'var(--text-3)', fontSize: '14px', fontStyle: 'italic', paddingLeft: '40px' }}>No events scheduled for today.</div>
                    )}

                    {events.map((event, index) => {
                        let dotColor = 'var(--text-3)';
                        let bg = 'var(--bg-card)';
                        let border = 'var(--border)';

                        if (event.type === 'focus') {
                            dotColor = 'var(--warning)';
                            bg = 'var(--warning-dim)';
                            border = 'var(--border-accent)';
                        } else if (event.type === 'meeting') {
                            dotColor = 'var(--purple)';
                        } else if (event.type === 'personal') {
                            dotColor = 'var(--success)';
                        }

                        return (
                            <div key={event.id} style={{ display: 'flex', gap: '16px', position: 'relative' }}>
                                {/* Timeline Dot */}
                                <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: 'var(--bg-elevated)', border: '2px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1, marginTop: '12px', flexShrink: 0 }}>
                                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: dotColor }}></div>
                                </div>

                                {/* Event Card */}
                                <div style={{ flex: 1, background: bg, border: `1px solid ${border}`, borderRadius: '12px', padding: '16px', transition: 'transform 0.2s', cursor: 'default' }} className="hover:-translate-y-1 hover:shadow-md">
                                    <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-3)', letterSpacing: '0.05em', marginBottom: '4px' }}>
                                        {event.time}
                                    </div>
                                    <div style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-1)' }}>
                                        {event.title}
                                    </div>
                                </div>
                            </div>
                        );
                    })}

                    <div style={{ display: 'flex', gap: '16px', opacity: 0.5, marginTop: '8px' }}>
                        <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: 'var(--bg-elevated)', border: '2px dashed var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1, marginTop: '12px', flexShrink: 0 }}></div>
                        <div style={{ flex: 1, background: 'transparent', border: `1px dashed var(--border)`, borderRadius: '12px', padding: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-3)' }}>+ Add blocked time</span>
                        </div>
                    </div>

                </div>
            </div>

            <div className="h-8"></div>
        </div>
    );
};

export default CalendarIntegration;
