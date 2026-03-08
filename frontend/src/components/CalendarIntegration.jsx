import React, { useState } from 'react';
import MonthlyGrid from './calendar/MonthlyGrid';
import { redirectToGoogle } from '../utils/authRedirect';

/* ─── Integration Health Badge ─── */
const StatusBadge = ({ status }) => {
    const config = {
        connected: { color: 'var(--success)', bg: 'var(--success-dim)', border: 'rgba(99, 193, 133, 0.2)', label: 'Connected' },
        syncing: { color: 'var(--accent)', bg: 'var(--accent-dim)', border: 'rgba(245, 166, 35, 0.2)', label: 'Syncing…' },
        error: { color: 'var(--danger)', bg: 'var(--danger-dim)', border: 'rgba(239, 68, 68, 0.2)', label: 'Error' },
        disconnected: { color: 'var(--text-3)', bg: 'var(--bg-elevated)', border: 'var(--border)', label: 'Disconnected' },
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

/* ─── Mini calendar using canonical MonthlyGrid ─── */
const CalendarMonthView = () => {
    const now = new Date();
    const [viewYear, setViewYear] = useState(now.getFullYear());
    // viewMonth is 0-based (JS native), matching MonthlyGrid's expectation
    const [viewMonth, setViewMonth] = useState(now.getMonth());

    const isCurrentMonth = viewYear === now.getFullYear() && viewMonth === now.getMonth();
    const today = now.getDate();
    const monthLabel = new Date(viewYear, viewMonth).toLocaleString('default', { month: 'long', year: 'numeric' });

    const prevMonth = () => {
        if (viewMonth === 0) { setViewMonth(11); setViewYear(viewYear - 1); }
        else setViewMonth(viewMonth - 1);
    };
    const nextMonth = () => {
        if (viewMonth === 11) { setViewMonth(0); setViewYear(viewYear + 1); }
        else setViewMonth(viewMonth + 1);
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {/* Month navigation */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <button onClick={prevMonth} style={{ background: 'none', border: 'none', color: 'var(--text-2)', cursor: 'pointer', fontSize: '16px', padding: '4px 8px' }}>←</button>
                <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-1)' }}>{monthLabel}</div>
                <button onClick={nextMonth} style={{ background: 'none', border: 'none', color: 'var(--text-2)', cursor: 'pointer', fontSize: '16px', padding: '4px 8px' }}>→</button>
            </div>

            {/* Unified MonthlyGrid — 0-based viewMonth passed directly */}
            <MonthlyGrid
                year={viewYear}
                month={viewMonth}
                renderDay={(day) => {
                    const isToday = isCurrentMonth && day === today;
                    const isFuture = isCurrentMonth && day > today;
                    return (
                        <div
                            key={day}
                            className={`day-cell ${isFuture ? 'future-day' : ''}`}
                            style={{
                                aspectRatio: '1',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                borderRadius: '7px', fontSize: '11px',
                                background: isToday ? 'var(--accent)' : 'transparent',
                                color: isToday ? 'var(--text-1)' : 'var(--text-2)',
                                fontWeight: isToday ? 800 : 500,
                                border: '1px solid var(--border)',
                                cursor: !isFuture ? 'pointer' : 'default',
                                transition: 'background 0.12s',
                            }}
                            onMouseEnter={e => { if (!isToday && !isFuture) e.currentTarget.style.background = 'var(--bg-elevated)'; }}
                            onMouseLeave={e => { if (!isToday) e.currentTarget.style.background = 'transparent'; }}
                        >
                            {day}
                        </div>
                    );
                }}
            />

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
const EmptyEventsState = ({ isConnected, onSync, onConnect, isLoading }) => {
    if (!isConnected) {
        return (
            <div style={{
                padding: '40px 32px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px',
                background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: 'var(--r-lg)', textAlign: 'center',
            }}>
                <div style={{ width: '48px', height: '48px', background: 'var(--bg-elevated)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px' }}>📅</div>
                <div>
                    <div style={{ fontSize: '15px', fontWeight: 800, color: 'var(--text-1)', marginBottom: '4px' }}>Calendar integration inactive</div>
                    <div style={{ fontSize: '13px', color: 'var(--text-2)', maxWidth: '300px', lineHeight: 1.5, fontWeight: 500 }}>
                        AIIMIN cannot analyze schedule load without calendar access.
                    </div>
                </div>
                <div style={{ marginBottom: '16px', padding: '10px 14px', background: 'var(--bg-card)', borderRadius: '10px', border: '1px solid var(--border)', textAlign: 'left' }}>
                    <p style={{ fontSize: '11px', color: 'var(--text-3)', lineHeight: 1.5, margin: 0 }}>
                        By connecting your Google account you allow AIIMIN to access your Google Calendar data (read-only) to power productivity features. We do not sell or share Google user data. You can revoke access anytime.
                    </p>
                </div>
                <div style={{ display: 'flex', gap: '10px', marginTop: '4px', width: '100%', maxWidth: '320px' }}>
                    <button onClick={onConnect} style={{
                        flex: 1, height: '40px', background: 'var(--accent)', color: 'white', border: 'none',
                        borderRadius: 'var(--r-md)', fontSize: '13px', fontWeight: 700, cursor: 'pointer', transition: 'all 0.2s'
                    }} onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'} onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}>
                        Connect Google
                    </button>
                </div>
            </div>
        );
    }
    return (
        <div style={{
            padding: '40px 32px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px',
            border: '1px dashed var(--border)', borderRadius: 'var(--r-lg)', textAlign: 'center',
        }}>
            <div style={{ fontSize: '24px' }}>🗓</div>
            <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-1)' }}>No events scheduled today</div>
            <div style={{ fontSize: '12px', color: 'var(--text-3)', fontWeight: 500 }}>Clear calendar — ideal for deep work.</div>
            <button onClick={onSync} disabled={isLoading} style={{
                marginTop: '12px', padding: '10px 20px', background: 'var(--bg-elevated)',
                color: 'var(--text-1)', border: '1px solid var(--border)',
                borderRadius: 'var(--r-md)', fontSize: '12px', fontWeight: 700, cursor: 'pointer',
                display: 'flex', alignItems: 'center', gap: '8px'
            }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ animation: isLoading ? 'spin 1s linear infinite' : 'none' }}>
                    <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.59-8.27" />
                </svg>
                {isLoading ? 'Syncing…' : 'Retry Sync'}
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

    const handleConnectGoogle = async () => {
        setIsLoadingEvents(true);
        redirectToGoogle('login');
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
                            <EmptyEventsState isConnected={isConnected} onSync={handleSync} onConnect={handleConnectGoogle} isLoading={isLoadingEvents} />
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
