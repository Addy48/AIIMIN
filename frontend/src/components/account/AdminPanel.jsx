import React, { useState, useEffect } from 'react';
import supabase from '../../utils/supabase';
import toast from '../../utils/toast';
import { API_URL } from '../../utils/api';

const AdminPanel = ({ user, onClose }) => {
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState(null);
    const [activeSection, setActiveSection] = useState('simulate');

    // Table browser state
    const [tables, setTables] = useState([]);
    const [selectedTable, setSelectedTable] = useState('');
    const [tableData, setTableData] = useState(null);
    const [tableFetching, setTableFetching] = useState(false);

    const getHeaders = async () => {
        const { data: { session } } = await supabase.auth.getSession();
        return {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${session?.access_token}`
        };
    };

    const presets = [
        { id: 'high_discipline', name: 'High Discipline', icon: '🔥' },
        { id: 'drift', name: 'Drift Week', icon: '📉' },
        { id: 'recovery', name: 'Recovery Phase', icon: '📈' },
        { id: 'zero', name: 'Zero Activity', icon: '🔘' },
    ];

    const injectSimulation = async (presetId) => {
        setLoading(true);
        setMessage({ text: 'Generating simulation data...', type: 'info' });
        try {
            const headers = await getHeaders();
            const response = await fetch(`${API_URL}/admin/simulate`, {
                method: 'POST',
                headers,
                body: JSON.stringify({ presetId, userId: user.id })
            });
            const result = await response.json();
            if (result.success) {
                setMessage({ text: `✓ ${presetId} simulated (30 days)`, type: 'success' });
                toast.success(`Seed complete: ${presetId}`);
            } else {
                throw new Error(result.error || 'Simulation failed');
            }
        } catch (error) {
            setMessage({ text: error.message, type: 'error' });
        } finally {
            setLoading(false);
        }
    };

    // Fetch table list
    const fetchTables = async () => {
        try {
            const headers = await getHeaders();
            const res = await fetch(`${API_URL}/admin/tables`, { headers });
            if (res.ok) {
                const data = await res.json();
                setTables(data);
            }
        } catch (err) {
            console.error('Failed to fetch tables:', err);
        }
    };

    // Fetch table data
    const fetchTableData = async (table) => {
        setTableFetching(true);
        setTableData(null);
        try {
            const headers = await getHeaders();
            const res = await fetch(`${API_URL}/admin/tables/${table}?limit=50`, { headers });
            if (res.ok) {
                const data = await res.json();
                setTableData(data);
            }
        } catch (err) {
            console.error('Failed to fetch table data:', err);
        } finally {
            setTableFetching(false);
        }
    };

    // Wipe table
    const wipeTable = async (table) => {
        if (!window.confirm(`WIPE all rows from "${table}" for your user? This cannot be undone.`)) return;
        try {
            const headers = await getHeaders();
            const res = await fetch(`${API_URL}/admin/wipe/${table}`, {
                method: 'POST',
                headers,
                body: JSON.stringify({ userId: user.id })
            });
            const result = await res.json();
            if (result.success) {
                setMessage({ text: `Wiped ${result.deleted} rows from ${table}`, type: 'success' });
                toast.success(`Wiped ${result.deleted} rows from ${table}`);
                if (selectedTable === table) fetchTableData(table);
            }
        } catch (err) {
            setMessage({ text: `Wipe failed: ${err.message}`, type: 'error' });
        }
    };

    useEffect(() => {
        if (activeSection === 'tables' && tables.length === 0) {
            fetchTables();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [activeSection]);

    const sectionBtn = (key, label, icon) => (
        <button
            key={key}
            onClick={() => setActiveSection(key)}
            style={{
                flex: 1, padding: '8px', borderRadius: '8px', fontSize: '11px', fontWeight: 700,
                cursor: 'pointer', border: 'none', transition: 'all 0.2s',
                background: activeSection === key ? 'var(--accent)' : 'var(--bg-elevated)',
                color: activeSection === key ? '#fff' : 'var(--text-3)',
            }}
        >
            {icon} {label}
        </button>
    );

    return (
        <div style={{ padding: '24px', background: 'var(--bg-card)', borderRadius: '16px', border: '1px solid var(--border)', maxHeight: '80vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h2 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text-1)', margin: 0 }}>Admin Controls</h2>
                <div style={{ padding: '4px 12px', background: 'var(--danger-dim)', color: 'var(--danger)', borderRadius: '99px', fontSize: '11px', fontWeight: 700 }}>ADMIN</div>
            </div>

            {/* Section tabs */}
            <div style={{ display: 'flex', gap: '6px', marginBottom: '20px', background: 'var(--bg-secondary)', borderRadius: '10px', padding: '4px' }}>
                {sectionBtn('simulate', 'Simulate', '🎲')}
                {sectionBtn('tables', 'Tables', '📋')}
                {sectionBtn('wipe', 'Wipe', '🗑')}
            </div>

            {/* Message */}
            {message && (
                <div style={{
                    padding: '10px 12px', borderRadius: '8px', marginBottom: '16px', fontSize: '12px', fontWeight: 600,
                    background: message.type === 'success' ? 'var(--success-dim)' : (message.type === 'error' ? 'var(--danger-dim)' : 'var(--bg-elevated)'),
                    color: message.type === 'success' ? 'var(--success)' : (message.type === 'error' ? 'var(--danger)' : 'var(--text-2)'),
                    border: `1px solid ${message.type === 'success' ? 'var(--success)' : (message.type === 'error' ? 'var(--danger)' : 'var(--border)')}`
                }}>
                    {message.text}
                </div>
            )}

            {/* Simulate Section */}
            {activeSection === 'simulate' && (
                <div>
                    <div style={{ fontSize: '12px', color: 'var(--text-3)', marginBottom: '14px', fontWeight: 500 }}>
                        Inject 30 days of synthetic data for the current user.
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                        {presets.map(p => (
                            <button
                                key={p.id}
                                onClick={() => injectSimulation(p.id)}
                                disabled={loading}
                                style={{
                                    padding: '12px', background: 'var(--bg-elevated)', border: '1px solid var(--border)',
                                    borderRadius: '10px', cursor: 'pointer', textAlign: 'left', transition: 'all 0.2s',
                                    opacity: loading ? 0.5 : 1
                                }}
                            >
                                <span style={{ fontSize: '16px', display: 'block', marginBottom: '4px' }}>{p.icon}</span>
                                <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-1)' }}>{p.name}</span>
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Table Browser Section */}
            {activeSection === 'tables' && (
                <div>
                    <div style={{ display: 'flex', gap: '8px', marginBottom: '14px', flexWrap: 'wrap' }}>
                        {tables.map(t => (
                            <button
                                key={t}
                                onClick={() => { setSelectedTable(t); fetchTableData(t); }}
                                style={{
                                    padding: '4px 10px', borderRadius: '6px', fontSize: '11px', fontWeight: 600,
                                    cursor: 'pointer', border: '1px solid var(--border)', transition: 'all 0.15s',
                                    background: selectedTable === t ? 'var(--accent)' : 'var(--bg-elevated)',
                                    color: selectedTable === t ? '#fff' : 'var(--text-2)',
                                }}
                            >
                                {t}
                            </button>
                        ))}
                    </div>
                    {tableFetching && <div style={{ color: 'var(--text-3)', fontSize: '12px' }}>Loading...</div>}
                    {tableData && (
                        <div style={{ fontSize: '11px', color: 'var(--text-2)' }}>
                            <div style={{ marginBottom: '8px', fontWeight: 700, color: 'var(--text-1)' }}>
                                {tableData.table} — {tableData.count} rows
                            </div>
                            <div style={{ maxHeight: '300px', overflowY: 'auto', overflowX: 'auto', background: 'var(--bg-elevated)', borderRadius: '8px', border: '1px solid var(--border)' }}>
                                <pre style={{ padding: '12px', margin: 0, whiteSpace: 'pre-wrap', wordBreak: 'break-all', fontSize: '10px', lineHeight: 1.5, color: 'var(--text-2)' }}>
                                    {JSON.stringify(tableData.rows, null, 2)}
                                </pre>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Wipe Section */}
            {activeSection === 'wipe' && (
                <div>
                    <div style={{ fontSize: '12px', color: 'var(--danger)', marginBottom: '14px', fontWeight: 600 }}>
                        ⚠ Destructive Actions — Wipe data for your user ID only.
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        {['daily_logs', 'pomodoro_sessions', 'money_transactions', 'wins', 'notifications', 'resets'].map(t => (
                            <button
                                key={t}
                                onClick={() => wipeTable(t)}
                                style={{
                                    padding: '10px 14px', background: 'var(--bg-elevated)', border: '1px solid var(--border)',
                                    borderRadius: '8px', fontSize: '12px', fontWeight: 600, color: 'var(--text-1)',
                                    cursor: 'pointer', textAlign: 'left', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                                    transition: 'all 0.15s'
                                }}
                            >
                                <span>{t}</span>
                                <span style={{ fontSize: '10px', color: 'var(--danger)', fontWeight: 700 }}>WIPE</span>
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Close */}
            <div style={{ borderTop: '1px solid var(--border)', paddingTop: '20px', marginTop: '20px' }}>
                <button
                    onClick={onClose}
                    style={{ width: '100%', padding: '10px', background: 'transparent', border: '1px solid var(--border)', borderRadius: '10px', color: 'var(--text-2)', cursor: 'pointer', fontSize: '13px', fontWeight: 600 }}
                >
                    Close Panel
                </button>
            </div>
        </div>
    );
};

export default AdminPanel;
