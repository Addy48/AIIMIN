import React, { useState } from 'react';
import supabase from '../../utils/supabase';

const AdminPanel = ({ user, onClose }) => {
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState(null);

    const presets = [
        { id: 'high_discipline', name: 'High Discipline Week', icon: '🔥' },
        { id: 'drift', name: 'Drift Week', icon: '📉' },
        { id: 'recovery', name: 'Recovery Phase', icon: '📈' },
        { id: 'zero', name: 'Zero Activity', icon: '🔘' },
        { id: 'spike', name: 'Momentum Spike', icon: '⚡' }
    ];

    const injectSimulation = async (presetId) => {
        setLoading(true);
        setMessage({ text: 'Generating simulation data...', type: 'info' });

        try {
            // This would call a backend endpoint in a real scenario,
            // but for this task I will implement the injection logic here using the source_type flag.
            const response = await fetch(`${process.env.REACT_APP_API_URL || ''}/api/admin/simulate`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`
                },
                body: JSON.stringify({ presetId, userId: user.id })
            });

            const result = await response.json();
            if (result.success) {
                setMessage({ text: `Success: ${presetId} simulated for last 30 days.`, type: 'success' });
            } else {
                throw new Error(result.error || 'Simulation failed');
            }
        } catch (error) {
            setMessage({ text: error.message, type: 'error' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ padding: '24px', background: 'var(--bg-card)', borderRadius: '16px', border: '1px solid var(--border)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <h2 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text-1)', margin: 0 }}>Super Admin Controls</h2>
                <div style={{ padding: '4px 12px', background: 'var(--danger-dim)', color: 'var(--danger)', borderRadius: '99px', fontSize: '11px', fontWeight: 700 }}>ADMIN MODE</div>
            </div>

            <div style={{ marginBottom: '32px' }}>
                <h3 style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-2)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '16px' }}>Data Seeding Engine</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    {presets.map(p => (
                        <button
                            key={p.id}
                            onClick={() => injectSimulation(p.id)}
                            disabled={loading}
                            style={{
                                padding: '12px', background: 'var(--bg-elevated)', border: '1px solid var(--border)',
                                borderRadius: '12px', cursor: 'pointer', textAlign: 'left', transition: 'all 0.2s',
                                opacity: loading ? 0.5 : 1
                            }}
                            onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--accent)'}
                            onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}
                        >
                            <span style={{ fontSize: '18px', display: 'block', marginBottom: '4px' }}>{p.icon}</span>
                            <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-1)' }}>{p.name}</span>
                        </button>
                    ))}
                </div>
            </div>

            {message && (
                <div style={{
                    padding: '12px', borderRadius: '8px', marginBottom: '20px', fontSize: '13px', fontWeight: 600,
                    background: message.type === 'success' ? 'var(--success-dim)' : (message.type === 'error' ? 'var(--danger-dim)' : 'var(--bg-elevated)'),
                    color: message.type === 'success' ? 'var(--success)' : (message.type === 'error' ? 'var(--danger)' : 'var(--text-2)'),
                    border: `1px solid ${message.type === 'success' ? 'var(--success)' : (message.type === 'error' ? 'var(--danger)' : 'var(--border)')}`
                }}>
                    {message.text}
                </div>
            )}

            <div style={{ borderTop: '1px solid var(--border)', paddingTop: '24px' }}>
                <button
                    onClick={onClose}
                    style={{ width: '100%', padding: '12px', background: 'transparent', border: '1px solid var(--border)', borderRadius: '12px', color: 'var(--text-2)', cursor: 'pointer' }}
                >
                    Return to Settings
                </button>
            </div>
        </div>
    );
};

export default AdminPanel;
