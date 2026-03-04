import React, { useState, useEffect } from 'react';
import useDevMode from '../hooks/useDevMode';
import { useDevContext } from '../context/DevContext';
import { devLogger } from '../utils/devLogger';
import supabase from '../utils/supabase';

export default function DevOverlay() {
    const { isDevMode } = useDevMode();

    if (!isDevMode) return null;

    return <DevOverlayContent />;
}

function DevOverlayContent() {
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        const handleKeyDown = (e) => {
            if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key.toLowerCase() === 'd') {
                e.preventDefault();
                setIsOpen(prev => !prev);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    return (
        <div style={{
            position: 'fixed', top: 0, right: 0, bottom: 0, width: '420px',
            zIndex: 999999, background: 'var(--bg-primary)', borderLeft: '1px solid var(--border)',
            boxShadow: '-8px 0 40px rgba(0,0,0,0.6)', display: 'flex', flexDirection: 'column',
            fontFamily: 'monospace', transform: `translateX(${isOpen ? '0' : '100%'})`,
            transition: '0.25s ease'
        }}>
            <div style={{
                height: '52px', borderBottom: '1px solid rgba(255,255,255,0.08)',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '0 20px', flexShrink: 0
            }}>
                <span style={{ color: '#fff', fontWeight: 'bold' }}>DEV OVERLAY</span>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                    <span style={{ color: '#666', fontSize: '12px' }}>⌘/Ctrl+⇧D</span>
                    <button onClick={() => setIsOpen(false)} style={{
                        background: 'none', border: 'none', color: '#fff', cursor: 'pointer', padding: '4px'
                    }}>✕</button>
                </div>
            </div>

            <div style={{ flex: 1, overflowY: 'auto', padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <TestDatePanel />
                <SeedDataPanel />
                <TableViewerPanel />
                <FeatureFlagsPanel />
                <LiveLoggerPanel />
            </div>
        </div>
    );
}

function TestDatePanel() {
    const { testDate, setTestDate } = useDevContext();
    const [localDate, setLocalDate] = useState(testDate || '');

    return (
        <Panel title="Test Date Override">
            <div style={{ display: 'flex', gap: '10px' }}>
                <input
                    type="date"
                    value={localDate}
                    onChange={(e) => setLocalDate(e.target.value)}
                    style={{ flex: 1, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', padding: '8px', borderRadius: '4px' }}
                />
                <button onClick={() => setTestDate(localDate)} style={{ background: '#f5a623', color: '#000', border: 'none', padding: '8px 12px', borderRadius: '4px', cursor: 'pointer' }}>Set</button>
                <button onClick={() => { setLocalDate(''); setTestDate(null); }} style={{ background: 'rgba(255,255,255,0.1)', color: '#fff', border: 'none', padding: '8px 12px', borderRadius: '4px', cursor: 'pointer' }}>Reset</button>
            </div>
            {testDate && (
                <div style={{ marginTop: '10px', color: '#f5a623', fontSize: '12px', background: 'rgba(245, 166, 35, 0.1)', padding: '4px 8px', borderRadius: '4px', display: 'inline-block' }}>
                    Testing: {testDate}
                </div>
            )}
        </Panel>
    );
}

function SeedDataPanel() {
    const [loading, setLoading] = useState(false);
    const [msg, setMsg] = useState('');

    const generateSeed = async () => {
        setLoading(true);
        setMsg('');
        try {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) throw new Error("No session");

            const userId = session.user.id;
            const records = [];
            const today = new Date();

            for (let i = 0; i < 30; i++) {
                const d = new Date(today);
                d.setDate(d.getDate() - i);
                const dateStr = d.toISOString().split('T')[0];

                records.push({
                    user_id: userId,
                    date: dateStr,
                    sleep_start: '23:00',
                    sleep_end: '07:00',
                    sleep_hours: 8.0,
                    gym_done: Math.random() > 0.28,
                    gym_duration: Math.floor(Math.random() * 45) + 30,
                    breakfast_done: Math.random() > 0.14,
                    steps: Math.floor(Math.random() * 9000) + 3000,
                    protein_grams: Math.floor(Math.random() * 120) + 60,
                    learning_done: Math.random() > 0.42,
                    mood_before: Math.floor(Math.random() * 5) + 1,
                    mood_after: Math.floor(Math.random() * 5) + 1,
                    energy_level: Math.floor(Math.random() * 5) + 1
                });
            }

            const { error } = await supabase.from('daily_logs').upsert(records, { onConflict: 'user_id,date' });
            if (error) throw error;
            setMsg('Seeded 30 days of data successfully.');
        } catch (e) {
            setMsg(`Error: ${e.message}`);
        }
        setLoading(false);
    };

    const clearSeed = async () => {
        setLoading(true);
        setMsg('');
        try {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) throw new Error("No session");

            const userId = session.user.id;
            const thirtyDaysAgo = new Date();
            thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 31);
            const dateThreshold = thirtyDaysAgo.toISOString().split('T')[0];

            const { error } = await supabase.from('daily_logs')
                .delete()
                .eq('user_id', userId)
                .gte('date', dateThreshold);

            if (error) throw error;
            setMsg('Cleared last 31 days successfully.');
        } catch (e) {
            setMsg(`Error: ${e.message}`);
        }
        setLoading(false);
    };

    return (
        <Panel title="Seed Data Generator">
            <div style={{ display: 'flex', gap: '10px' }}>
                <button disabled={loading} onClick={generateSeed} style={{ flex: 1, background: 'rgba(255,255,255,0.1)', color: '#fff', border: 'none', padding: '8px', cursor: 'pointer', borderRadius: '4px' }}>
                    Generate 30 Days
                </button>
                <button disabled={loading} onClick={clearSeed} style={{ flex: 1, background: 'rgba(255,50,50,0.2)', color: '#ff6b6b', border: 'none', padding: '8px', cursor: 'pointer', borderRadius: '4px' }}>
                    Clear Seeded
                </button>
            </div>
            {msg && <div style={{ marginTop: '10px', fontSize: '11px', color: msg.includes('Error') ? '#ff6b6b' : '#a0d0a0' }}>{msg}</div>}
        </Panel>
    );
}

function TableViewerPanel() {
    const tables = ['daily_logs', 'goals', 'pomodoro_sessions', 'wins', 'money_transactions'];
    const [selectedTable, setSelectedTable] = useState('daily_logs');
    const [rows, setRows] = useState([]);
    const [errorMsg, setErrorMsg] = useState('');

    useEffect(() => {
        const fetchRows = async () => {
            setErrorMsg('');
            try {
                const { data: { session } } = await supabase.auth.getSession();
                if (!session) return;

                let sortField = 'created_at';
                if (['daily_logs', 'pomodoro_sessions', 'wins', 'money_transactions'].includes(selectedTable)) {
                    sortField = 'date';
                }

                const { data, error } = await supabase.from(selectedTable)
                    .select('*')
                    .eq('user_id', session.user.id)
                    .order(sortField, { ascending: false })
                    .limit(5);

                if (error) throw error;
                if (data) setRows(data);
            } catch (err) {
                setErrorMsg(`Failed to load: ${err.message}`);
                setRows([]);
            }
        };
        fetchRows();
    }, [selectedTable]);

    return (
        <Panel title="Table Viewer">
            <select value={selectedTable} onChange={e => setSelectedTable(e.target.value)} style={{ width: '100%', background: 'rgba(255,255,255,0.05)', color: '#fff', padding: '8px', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '4px', marginBottom: '10px' }}>
                {tables.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
            {errorMsg && <div style={{ fontSize: '11px', color: '#ff6b6b', marginBottom: '10px' }}>{errorMsg}</div>}
            <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', fontSize: '10px', color: '#888', borderCollapse: 'collapse' }}>
                    <tbody>
                        {rows.map((row, i) => (
                            <tr key={i} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                <td style={{ padding: '6px 4px' }}>{row.id?.substring(0, 8)}</td>
                                <td style={{ padding: '6px 4px' }}>{row.date || row.created_at?.split('T')[0]}</td>
                                <td style={{ padding: '6px 4px' }}>
                                    {selectedTable === 'daily_logs' && `Gym: ${row.gym_done}`}
                                    {selectedTable === 'goals' && `${row.metric}: ${row.target}`}
                                    {selectedTable === 'wins' && row.description?.substring(0, 15)}
                                    {selectedTable === 'pomodoro_sessions' && `Cycles: ${row.cycles_completed}`}
                                    {selectedTable === 'money_transactions' && `$${row.amount}`}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {rows.length === 0 && !errorMsg && <div style={{ fontSize: '11px', color: '#666', textAlign: 'center', padding: '10px' }}>No rows</div>}
            </div>
        </Panel>
    );
}

function FeatureFlagsPanel() {
    const flagsList = ['monthly_grid', 'weekly_charts', 'streaks', 'win_tracker', 'money_manager', 'google_calendar', 'youtube_player'];
    const [flags, setFlags] = useState({});

    useEffect(() => {
        try {
            const stored = JSON.parse(localStorage.getItem('aiimin_dev_flags') || '{}');
            setFlags(stored);
        } catch (e) { /* silent fail */ }
    }, []);

    const toggle = (flag) => {
        const updated = { ...flags, [flag]: !flags[flag] };
        setFlags(updated);
        localStorage.setItem('aiimin_dev_flags', JSON.stringify(updated));
    };

    return (
        <Panel title="Feature Flags">
            {flagsList.map(flag => (
                <div key={flag} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px', fontSize: '12px' }}>
                    <span style={{ color: '#aaa' }}>{flag}</span>
                    <button onClick={() => toggle(flag)} style={{
                        background: flags[flag] ? '#a0d0a0' : 'rgba(255,255,255,0.1)',
                        color: flags[flag] ? '#000' : '#888',
                        border: 'none', padding: '4px 8px', borderRadius: '4px', cursor: 'pointer', fontSize: '10px'
                    }}>
                        {flags[flag] ? 'ON' : 'OFF'}
                    </button>
                </div>
            ))}
        </Panel>
    );
}

function LiveLoggerPanel() {
    const [logs, setLogs] = useState([]);

    useEffect(() => {
        const unsubscribe = devLogger.subscribe((newLogs) => setLogs(newLogs));
        return unsubscribe; // Crucial for memory leak prevention
    }, []);

    return (
        <Panel title="Live Supabase Ops">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {logs.length === 0 && <span style={{ fontSize: '11px', color: '#666' }}>Waiting for operations...</span>}
                {logs.map(log => (
                    <div key={log.id} style={{ background: 'rgba(255,255,255,0.03)', padding: '12px', borderRadius: '6px' }}>
                        <div style={{ fontSize: '10px', color: '#888', marginBottom: '8px' }}>{new Date(log.timestamp).toLocaleTimeString()}</div>
                        <details style={{ marginBottom: '6px' }}>
                            <summary style={{ fontSize: '11px', color: '#ccc', cursor: 'pointer' }}>Payload</summary>
                            <pre style={{ fontSize: '10px', color: '#a0d0a0', maxHeight: '150px', overflow: 'auto', whiteSpace: 'pre-wrap', marginTop: '4px' }}>
                                {JSON.stringify(log.payload, null, 2)}
                            </pre>
                        </details>
                        <details>
                            <summary style={{ fontSize: '11px', color: '#ccc', cursor: 'pointer' }}>Response</summary>
                            <pre style={{ fontSize: '10px', color: '#a0d0a0', maxHeight: '150px', overflow: 'auto', whiteSpace: 'pre-wrap', marginTop: '4px' }}>
                                {JSON.stringify(log.response, null, 2)}
                            </pre>
                        </details>
                    </div>
                ))}
            </div>
        </Panel>
    );
}

function Panel({ title, children }) {
    return (
        <div style={{ border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', padding: '16px' }}>
            <h3 style={{ fontSize: '12px', color: '#fff', textTransform: 'uppercase', margin: '0 0 16px 0', letterSpacing: '0.05em' }}>{title}</h3>
            {children}
        </div>
    );
}
