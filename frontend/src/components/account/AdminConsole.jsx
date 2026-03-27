import React, { useState, useEffect, useCallback } from 'react';
import toast from '../../utils/toast';
import { API_URL } from '../../utils/api';

/**
 * AdminConsole — God Mode 2.0
 *
 * - Last 10 API calls with correlationId (/admin/recent-logs)
 * - Latency Simulator (inject delays via context)
 * - Force Error Toggle
 */
const AdminConsole = ({ session }) => {
    const [logs, setLogs] = useState([]);
    const [logsLoading, setLogsLoading] = useState(false);
    const [simLatency, setSimLatency] = useState(0);
    const [forceError, setForceError] = useState(false);
    const [tab, setTab] = useState('logs'); // logs | simulator | client_errors
    const [clientErrors, setClientErrors] = useState([]);

    const token = session?.access_token;

    const fetchLogs = useCallback(async () => {
        if (!token) return;
        setLogsLoading(true);
        try {
            const res = await fetch(`${API_URL}/admin/recent-logs`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            setLogs((data.logs || []).slice(0, 20));
        } catch (e) {
            toast.error('Failed to fetch logs');
        } finally {
            setLogsLoading(false);
        }
    }, [token]);

    useEffect(() => { fetchLogs(); }, [fetchLogs]);

    // Store sim settings in sessionStorage for middleware to pick up
    useEffect(() => {
        sessionStorage.setItem('__aimiin_sim_latency', simLatency);
        sessionStorage.setItem('__aimiin_sim_error', forceError);
    }, [simLatency, forceError]);

    // Periodically fetch client errors from window
    useEffect(() => {
        if (tab === 'client_errors') {
            const interval = setInterval(() => {
                setClientErrors([...(window.__AIIMIN_ERROR_LOG || [])].reverse());
            }, 1000);
            setClientErrors([...(window.__AIIMIN_ERROR_LOG || [])].reverse());
            return () => clearInterval(interval);
        }
    }, [tab]);

    const tabStyle = (active) => ({
        padding: '8px 16px', borderRadius: '8px',
        fontSize: '11px', fontWeight: 700, cursor: 'pointer',
        background: active ? 'var(--accent-dim)' : 'transparent',
        color: active ? 'var(--accent)' : 'var(--text-3)',
        border: 'none', textTransform: 'uppercase', letterSpacing: '0.04em'
    });

    return (
        <div style={{ marginTop: '24px' }}>
            <div style={{ fontSize: '13px', fontWeight: 800, color: 'var(--text-1)', marginBottom: '16px' }}>⚡ Admin Console</div>

            {/* Tabs */}
            <div style={{ display: 'flex', gap: '4px', marginBottom: '16px' }}>
                <button onClick={() => setTab('logs')} style={tabStyle(tab === 'logs')}>API Logs</button>
                <button onClick={() => setTab('client_errors')} style={tabStyle(tab === 'client_errors')}>Client Errors</button>
                <button onClick={() => setTab('simulator')} style={tabStyle(tab === 'simulator')}>Simulator</button>
            </div>

            {tab === 'logs' && (
                <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                        <span style={{ fontSize: '11px', color: 'var(--text-3)' }}>{logs.length} recent requests</span>
                        <button onClick={fetchLogs} style={{
                            padding: '4px 12px', borderRadius: '6px', border: '1px solid var(--border)',
                            background: 'var(--bg-elevated)', color: 'var(--text-2)', fontSize: '11px', fontWeight: 600, cursor: 'pointer'
                        }}>Refresh</button>
                    </div>
                    <div style={{ maxHeight: '400px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        {logsLoading ? (
                            <div className="skeleton" style={{ height: '200px' }} />
                        ) : logs.length === 0 ? (
                            <div style={{ fontSize: '12px', color: 'var(--text-3)', textAlign: 'center', padding: '24px' }}>No logs yet</div>
                        ) : logs.map((log, i) => (
                            <div key={i} style={{
                                display: 'grid', gridTemplateColumns: '60px 50px 1fr 60px 80px',
                                gap: '8px', alignItems: 'center', padding: '8px 12px',
                                background: 'var(--bg-card)', borderRadius: '6px', fontSize: '11px',
                                fontFamily: 'monospace', color: 'var(--text-1)'
                            }}>
                                <span style={{ fontWeight: 700, color: log.method === 'GET' ? 'var(--success)' : 'var(--accent)' }}>
                                    {log.method || '—'}
                                </span>
                                <span style={{ color: log.status >= 400 ? 'var(--danger)' : 'var(--text-3)' }}>
                                    {log.status || '—'}
                                </span>
                                <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                    {log.path || log.message || '—'}
                                </span>
                                <span style={{ color: (log.ms || 0) > 500 ? 'var(--danger)' : 'var(--text-3)' }}>
                                    {log.ms ? `${log.ms}ms` : '—'}
                                </span>
                                <span style={{ fontSize: '9px', color: 'var(--text-3)', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                    {log.correlationId ? log.correlationId.slice(0, 8) : '—'}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {tab === 'client_errors' && (
                <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                        <span style={{ fontSize: '11px', color: 'var(--text-3)' }}>{clientErrors.length} recent errors</span>
                        <button onClick={() => setClientErrors([...(window.__AIIMIN_ERROR_LOG || [])].reverse())} style={{
                            padding: '4px 12px', borderRadius: '6px', border: '1px solid var(--border)',
                            background: 'var(--bg-elevated)', color: 'var(--text-2)', fontSize: '11px', fontWeight: 600, cursor: 'pointer'
                        }}>Refresh</button>
                    </div>
                    <div style={{ maxHeight: '400px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        {clientErrors.length === 0 ? (
                            <div style={{ fontSize: '12px', color: 'var(--text-3)', textAlign: 'center', padding: '24px' }}>No client errors logged</div>
                        ) : clientErrors.map((error, i) => (
                            <div key={i} style={{
                                padding: '8px 12px', background: 'var(--bg-card)', borderRadius: '6px',
                                fontSize: '11px', fontFamily: 'monospace', color: 'var(--text-1)', wordBreak: 'break-all'
                            }}>
                                <div style={{ fontWeight: 700, marginBottom: '4px' }}>[{new Date(error.timestamp).toLocaleTimeString()}] {error.message}</div>
                                {error.stack && <div style={{ fontSize: '9px', opacity: 0.8, marginTop: '4px', whiteSpace: 'pre-wrap' }}>{error.stack}</div>}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {tab === 'simulator' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {/* Latency Simulator */}
                    <div style={{ background: 'var(--bg-elevated)', borderRadius: '10px', padding: '16px' }}>
                        <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-1)', marginBottom: '12px' }}>Simulate Latency</div>
                        <div style={{ display: 'flex', gap: '8px' }}>
                            {[0, 100, 500, 1000, 2000].map(ms => (
                                <button
                                    key={ms}
                                    onClick={() => { setSimLatency(ms); toast.info(`Latency: ${ms}ms`); }}
                                    style={{
                                        flex: 1, padding: '8px', borderRadius: '6px', border: '1px solid var(--border)',
                                        background: simLatency === ms ? 'var(--accent-dim)' : 'var(--bg-card)',
                                        color: simLatency === ms ? 'var(--accent)' : 'var(--text-2)',
                                        fontSize: '12px', fontWeight: 700, cursor: 'pointer'
                                    }}
                                >
                                    {ms === 0 ? 'Off' : `${ms}ms`}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Force Error Toggle */}
                    <div style={{
                        background: 'var(--bg-elevated)', borderRadius: '10px', padding: '16px',
                        display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                    }}>
                        <div>
                            <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-1)' }}>Force API Errors</div>
                            <div style={{ fontSize: '11px', color: 'var(--text-3)', marginTop: '2px' }}>All API calls will return 500</div>
                        </div>
                        <div
                            onClick={() => { setForceError(!forceError); toast.info(forceError ? 'Errors: Off' : 'Errors: On'); }}
                            style={{
                                width: '44px', height: '24px', borderRadius: '12px',
                                background: forceError ? 'var(--danger)' : 'var(--border-hover)',
                                position: 'relative', cursor: 'pointer', transition: 'background 0.2s'
                            }}
                        >
                            <div style={{
                                position: 'absolute', width: '18px', height: '18px', borderRadius: '50%',
                                background: 'white', top: '3px', left: forceError ? '23px' : '3px',
                                transition: 'left 0.2s', boxShadow: '0 1px 3px rgba(0,0,0,0.2)'
                            }} />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminConsole;
