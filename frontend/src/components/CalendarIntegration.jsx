import React, { useState, useEffect } from 'react';

/* ─── Integration Health Badge ─── */
const StatusBadge = ({ status }) => {
    const config = {
        connected: { color: '#22c55e', bg: 'rgba(34,197,94,0.08)', border: 'rgba(34,197,94,0.2)', label: 'Connected' },
        syncing: { color: '#f5a623', bg: 'rgba(245,166,35,0.08)', border: 'rgba(245,166,35,0.2)', label: 'Syncing…' },
        error: { color: '#eb8c8c', bg: 'rgba(235,140,140,0.08)', border: 'rgba(235,140,140,0.2)', label: 'Error' },
        disconnected: { color: '#454038', bg: 'rgba(69,64,56,0.08)', border: 'rgba(69,64,56,0.2)', label: 'Not connected' },
    };
    const s = config[status] || config.disconnected;
    return (
        <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '6px',
            padding: '4px 10px', borderRadius: '99px',
            background: s.bg, border: `1px solid ${s.border}`,
            fontSize: '11px', fontWeight: 700, color: s.color, flexShrink: 0,
        }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: s.color, flexShrink: 0 }} />
            {s.label}
        </div>
    );
};

/* ─── Correct calendar grid ─── */
const getDaysInMonth = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();
    const firstDay = new Date(year, month, 1).getDay(); // 0=Sun
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const offset = firstDay === 0 ? 6 : firstDay - 1; // Mon-first
    const cells = [];
    for (let i = 0; i < offset; i++) cells.push(null);
    for (let i = 1; i <= daysInMonth; i++) cells.push(i);
    return cells;
};

const CalendarMonthView = () => {
    const cells = getDaysInMonth();
    const today = new Date().getDate();
    const dayHeaders = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const monthLabel = new Date().toLocaleString('default', { month: 'long', year: 'numeric' });

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-1)' }}>{monthLabel}</div>

            {/* Day headers */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px', textAlign: 'center' }}>
                {dayHeaders.map(d => (
                    <div key={d} style={{ fontSize: '9px', fontWeight: 700, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.06em', padding: '2px 0' }}>{d}</div>
                ))}
            </div>

            {/* Day cells */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px' }}>
                {cells.map((day, i) => {
                    if (day === null) return <div key={`e-${i}`} />;
                    const isToday = day === today;
                    const isFuture = day > today;
                    return (
                        <div key={i} style={{
                            aspectRatio: '1', display: 'flex', alignItems: 'center', justifyContent: 'center',
                            borderRadius: '7px', fontSize: '11px',
                            background: isToday ? 'var(--accent)' : 'transparent',
                            color: isToday ? '#fff' : isFuture ? 'var(--text-3)' : 'var(--text-2)',
                            fontWeight: isToday ? 800 : 500,
                            border: isToday ? 'none' : '1px solid var(--border)',
                            opacity: isFuture ? 0.4 : 1,
                            cursor: !isFuture ? 'pointer' : 'default',
                            transition: 'background 0.12s, opacity 0.12s',
                        }}
                            onMouseEnter={e => { if (!isToday && !isFuture) e.currentTarget.style.background = 'var(--bg-elevated)'; }}
                            onMouseLeave={e => { if (!isToday) e.currentTarget.style.background = 'transparent'; }}
                        >
                            {day}
                        </div>
                    );
                })}
            </div>

            {/* Year countdown */}
            <div style={{ padding: '10px 14px', background: 'var(--bg-elevated)', borderRadius: '10px', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '11px', color: 'var(--text-3)', fontWeight: 600 }}>Days left in year</span>
                <span style={{ fontSize: '13px', fontWeight: 800, color: 'var(--text-1)' }}>
                    {Math.ceil((new Date(new Date().getFullYear(), 11, 31) - new Date()) / 86400000)}
                </span>
            </div>
        </div>
    );
};

/* ─── Empty state for no events ─── */
const EmptyEventsState = ({ isConnected, onSync }) => {
    if (!isConnected) {
        return (
            <div style={{
                padding: '32px 24px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px',
                border: '1px dashed var(--border)', borderRadius: '12px', textAlign: 'center',
            }}>
                <div style={{ fontSize: '28px' }}>📅</div>
                <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-2)' }}>Calendar not connected</div>
                <div style={{ fontSize: '12px', color: 'var(--text-3)', maxWidth: '240px', lineHeight: 1.5 }}>
                    Connect Google Calendar to view and time-block your schedule here.
                </div>
            </div>
        );
    }
    return (
        <div style={{
            padding: '28px 24px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px',
            border: '1px dashed var(--border)', borderRadius: '12px', textAlign: 'center',
        }}>
            <div style={{ fontSize: '24px' }}>🗓</div>
            <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-2)' }}>No events scheduled today</div>
            <div style={{ fontSize: '12px', color: 'var(--text-3)' }}>Clear calendar — good day to deep work.</div>
            <button onClick={onSync} style={{
                marginTop: '8px', padding: '6px 14px', background: 'var(--accent-dim)',
                color: 'var(--accent)', border: '1px solid var(--border-accent)',
                borderRadius: '8px', fontSize: '12px', fontWeight: 700, cursor: 'pointer',
            }}>
                Refresh
            </button>
        </div>
    );
};

const CalendarIntegration = ({ user }) => {
    const [events, setEvents] = useState([]);
    const [isLoadingEvents, setIsLoadingEvents] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');
    const [viewMode, setViewMode] = useState('today');
    const [lastSync, setLastSync] = useState(null);
    const [integrationStatus, setIntegrationStatus] = useState('disconnected'); // connected | syncing | error | disconnected
    const [isConnected, setIsConnected] = useState(false);

    const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

    const handleSync = async () => {
        setIsLoadingEvents(true);
        setErrorMsg('');
        setIntegrationStatus('syncing');
        try {
            const res = await fetch(`${API_URL}/calendar/events`, {
                headers: { 'x-user-id': user.id }
            });
            if (!res.ok) {
                if ([401, 403, 500].includes(res.status)) {
                    setIntegrationStatus('error');
                    setIsConnected(false);
                    throw new Error('Google Calendar not connected. Use the Connect button to link your account.');
                }
                throw new Error('Unable to fetch calendar events. Please try again.');
            }
            const formattedEvents = await res.json();
            setEvents(formattedEvents);
            setLastSync(new Date());
            setIsConnected(true);
            setIntegrationStatus('connected');
        } catch (err) {
            setErrorMsg(err.message);
            setIntegrationStatus('error');
        } finally {
            setIsLoadingEvents(false);
        }
    };

    const handleDisconnect = () => {
        if (window.confirm('Disconnect Google Calendar? Your existing events state will be cleared.')) {
            setIsConnected(false);
            setEvents([]);
            setLastSync(null);
            setIntegrationStatus('disconnected');
        }
    };

    return (
        <div className="fade-up" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

            {/* ── Integration header card ── */}
            <div style={{
                background: 'var(--bg-card)', border: '1px solid var(--border)',
                borderRadius: '16px', padding: '20px 22px', boxShadow: 'var(--shadow-sm)',
            }}>

                {/* Top row */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px', marginBottom: '14px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{ width: '34px', height: '34px', background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px' }}>
                            📅
                        </div>
                        <div>
                            <div style={{ fontSize: '14px', fontWeight: 800, color: 'var(--text-1)' }}>Google Calendar</div>
                            {lastSync && (
                                <div style={{ fontSize: '10px', color: 'var(--text-3)', marginTop: '2px', fontWeight: 500 }}>
                                    Last synced {lastSync.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </div>
                            )}
                        </div>
                    </div>
                    <StatusBadge status={integrationStatus} />
                </div>

                {/* Action row */}
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    {/* View toggle */}
                    <div style={{ display: 'flex', background: 'var(--bg-elevated)', borderRadius: '8px', padding: '2px', border: '1px solid var(--border)', flex: 1, minWidth: '0' }}>
                        {['today', 'month'].map(mode => (
                            <button key={mode} onClick={() => setViewMode(mode)} style={{
                                flex: 1, padding: '5px 0', fontSize: '12px', fontWeight: 700, border: 'none',
                                background: viewMode === mode ? 'var(--bg-card)' : 'transparent',
                                color: viewMode === mode ? 'var(--text-1)' : 'var(--text-3)',
                                borderRadius: '6px', cursor: 'pointer',
                                boxShadow: viewMode === mode ? 'var(--shadow-sm)' : 'none',
                                transition: 'all 0.15s ease',
                            }}>
                                {mode.charAt(0).toUpperCase() + mode.slice(1)}
                            </button>
                        ))}
                    </div>

                    <button
                        onClick={handleSync}
                        disabled={isLoadingEvents}
                        style={{
                            display: 'flex', alignItems: 'center', gap: '6px',
                            padding: '6px 14px', background: 'var(--accent-dim)',
                            color: 'var(--accent)', border: '1px solid var(--border-accent)',
                            borderRadius: '8px', fontSize: '12px', fontWeight: 700,
                            cursor: isLoadingEvents ? 'not-allowed' : 'pointer',
                            opacity: isLoadingEvents ? 0.7 : 1, transition: 'all 0.2s',
                        }}
                    >
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
                            style={{ animation: isLoadingEvents ? 'spin 0.7s linear infinite' : 'none' }}>
                            <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.59-8.27" />
                        </svg>
                        {isLoadingEvents ? 'Syncing…' : 'Sync'}
                    </button>

                    {isConnected && (
                        <button onClick={handleDisconnect} style={{
                            padding: '6px 12px', background: 'transparent', color: 'var(--text-3)',
                            border: '1px solid var(--border)', borderRadius: '8px',
                            fontSize: '12px', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s',
                        }}
                            onMouseEnter={e => { e.currentTarget.style.color = 'var(--danger)'; e.currentTarget.style.borderColor = 'rgba(235,140,140,0.3)'; }}
                            onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-3)'; e.currentTarget.style.borderColor = 'var(--border)'; }}
                        >
                            Disconnect
                        </button>
                    )}
                </div>

                {/* Error state */}
                {errorMsg && (
                    <div style={{
                        marginTop: '12px', padding: '10px 14px', display: 'flex', alignItems: 'flex-start', gap: '10px',
                        background: 'rgba(235,140,140,0.08)', color: 'var(--danger)',
                        fontSize: '12px', fontWeight: 600, borderRadius: '8px',
                        border: '1px solid rgba(235,140,140,0.18)',
                    }}>
                        <span style={{ flexShrink: 0, marginTop: '1px' }}>⚠</span>
                        <div>
                            <div style={{ marginBottom: '4px' }}>{errorMsg}</div>
                            <button onClick={handleSync} style={{
                                background: 'none', border: 'none', color: 'var(--accent)', fontSize: '11px',
                                fontWeight: 700, cursor: 'pointer', padding: 0, textDecoration: 'underline',
                            }}>
                                Retry sync
                            </button>
                        </div>
                    </div>
                )}

                {/* Privacy note */}
                <div style={{ marginTop: '12px', fontSize: '10px', color: 'var(--text-3)', display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
                    Event data is read-only and never stored on AIIMIN servers.
                </div>
            </div>

            {/* ── Content area ── */}
            <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '16px', padding: '20px 22px' }}>
                {viewMode === 'today' ? (
                    <>
                        <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-1)', marginBottom: '14px' }}>
                            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                        </div>
                        {events.length === 0 ? (
                            <EmptyEventsState isConnected={isConnected} onSync={handleSync} />
                        ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                {events.map((event) => {
                                    const typeColors = {
                                        focus: { dot: 'var(--warning)', bg: 'rgba(245,166,35,0.05)', border: 'rgba(245,166,35,0.15)' },
                                        meeting: { dot: 'var(--purple)', bg: 'rgba(155,138,245,0.05)', border: 'rgba(155,138,245,0.15)' },
                                        personal: { dot: 'var(--success)', bg: 'rgba(93,184,122,0.05)', border: 'rgba(93,184,122,0.15)' },
                                    };
                                    const c = typeColors[event.type] || { dot: 'var(--text-3)', bg: 'var(--bg-elevated)', border: 'var(--border)' };
                                    return (
                                        <div key={event.id} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                                            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: c.dot, marginTop: '14px', flexShrink: 0 }} />
                                            <div style={{ flex: 1, background: c.bg, border: `1px solid ${c.border}`, borderRadius: '10px', padding: '12px 14px' }}>
                                                <div style={{ fontSize: '10px', fontWeight: 700, color: 'var(--text-3)', letterSpacing: '0.04em', marginBottom: '3px' }}>{event.time}</div>
                                                <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-1)' }}>{event.title}</div>
                                            </div>
                                        </div>
                                    );
                                })}
                                {/* Add slot CTA */}
                                <div style={{ display: 'flex', gap: '12px', alignItems: 'center', opacity: 0.5 }}>
                                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', border: '2px dashed var(--text-3)', flexShrink: 0 }} />
                                    <div style={{ flex: 1, border: '1px dashed var(--border)', borderRadius: '10px', padding: '10px 14px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <span style={{ fontSize: '12px', color: 'var(--text-3)', fontWeight: 600 }}>+ Block time slot</span>
                                    </div>
                                </div>
                            </div>
                        )}
                    </>
                ) : (
                    <CalendarMonthView />
                )}
            </div>
        </div>
    );
};

export default CalendarIntegration;
