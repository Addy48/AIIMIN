import React, { useState } from 'react';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000';
const STATES = ['clarity', 'scarcity', 'abundance', 'fear', 'growth', 'aimlessness', 'focus', 'noise'];
const STATE_ICONS = { clarity: '🔍', scarcity: '🪨', abundance: '🌊', fear: '🌑', growth: '🌱', aimlessness: '🌫️', focus: '🎯', noise: '📡' };

export default function MindsetLogger({ currentState, onComplete }) {
    const [selected, setSelected] = useState(currentState || null);
    const [note, setNote] = useState('');
    const [saving, setSaving] = useState(false);
    const [done, setDone] = useState(false);

    const handleSave = async () => {
        if (!selected) return;
        setSaving(true);
        try {
            const token = localStorage.getItem('access_token');
            await fetch(`${API_BASE}/lab/mindset`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
                body: JSON.stringify({ state: selected, note: note || null }),
            });
            setDone(true);
            onComplete?.({ state: selected });
        } catch (err) {
            console.error('[MindsetLogger] Save error:', err);
        } finally {
            setSaving(false);
        }
    };

    if (done) {
        return (
            <div className="lab-intel-row">
                <div className="lab-intel-left">
                    <span className="lab-intel-title">Mindset logged</span>
                    <span className="lab-intel-subtitle">{STATE_ICONS[selected]} {selected}</span>
                </div>
                <span className="lab-intel-value">✓</span>
            </div>
        );
    }

    return (
        <div className="lab-metric-card" style={{ padding: 'var(--space-4)' }}>
            <div className="lab-metric-header">
                <span className="lab-metric-title">Mindset · Today</span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 'var(--space-2)', margin: 'var(--space-3) 0' }}>
                {STATES.map(s => (
                    <button key={s} onClick={() => setSelected(s)}
                        style={{
                            background: selected === s ? 'var(--color-accent)' : 'var(--color-elevated)',
                            color: selected === s ? 'white' : 'var(--color-text-2)',
                            border: '1px solid var(--color-border)', borderRadius: 'var(--r-sm)',
                            padding: 'var(--space-2)', cursor: 'pointer',
                            font: '400 11px/1.2 var(--font-sans)', textAlign: 'center',
                            transition: 'all 0.15s',
                        }}
                    >
                        <div style={{ fontSize: '16px', marginBottom: '2px' }}>{STATE_ICONS[s]}</div>
                        {s}
                    </button>
                ))}
            </div>
            {selected && (
                <>
                    <input type="text" value={note} onChange={e => setNote(e.target.value)}
                        placeholder="Quick note (optional)"
                        style={{
                            width: '100%', font: '400 13px/1 var(--font-sans)', color: 'var(--color-text-1)',
                            background: 'var(--color-elevated)', border: '1px solid var(--color-border)',
                            borderRadius: 'var(--r-sm)', padding: 'var(--space-2) var(--space-3)', outline: 'none',
                        }}
                    />
                    <button onClick={handleSave} disabled={saving} className="lab-retry-btn" style={{ marginTop: 'var(--space-3)', width: '100%' }}>
                        {saving ? 'Saving...' : 'Log Mindset'}
                    </button>
                </>
            )}
        </div>
    );
}
