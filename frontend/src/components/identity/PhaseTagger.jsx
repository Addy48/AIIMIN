import React, { useState, useEffect } from 'react';

const PHASES = [
    { id: 'exam',     label: 'Exam Mode',           emoji: '📚', color: '#ef4444', desc: 'Heads down, maximum focus' },
    { id: 'grind',    label: 'Summer Grind',         emoji: '☀️', color: '#f59e0b', desc: 'No excuses, full output' },
    { id: 'build',    label: 'Foundation Building',  emoji: '🏗️', color: '#3b82f6', desc: 'Setting habits and structure' },
    { id: 'peak',     label: 'Peak Performance',     emoji: '⚡', color: '#8b5cf6', desc: 'Everything firing simultaneously' },
    { id: 'recovery', label: 'Recovery Mode',        emoji: '🌱', color: '#10b981', desc: 'Healing, gentler approach' },
    { id: 'sprint',   label: 'Focus Sprint',         emoji: '🎯', color: '#ff6b35', desc: 'Short-term intense push' },
    { id: 'travel',   label: 'Travel Mode',          emoji: '✈️', color: '#60a5fa', desc: 'Maintaining minimums on the road' },
    { id: 'custom',   label: 'Custom Phase',         emoji: '✏️', color: '#a3a3a3', desc: '' },
];

const STORAGE_KEY = 'aiimin_phase';

const PhaseTagger = () => {
    const [phase, setPhase] = useState(null);
    const [showPicker, setShowPicker] = useState(false);
    const [customName, setCustomName] = useState('');
    const [editCustom, setEditCustom] = useState(false);

    useEffect(() => {
        try {
            const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null');
            if (stored) setPhase(stored);
        } catch {}
    }, []);

    const selectPhase = (p) => {
        if (p.id === 'custom') { setEditCustom(true); return; }
        const data = { ...p, startDate: new Date().toLocaleDateString('en-CA') };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
        setPhase(data);
        setShowPicker(false);
    };

    const saveCustom = () => {
        if (!customName.trim()) return;
        const p = { id: 'custom', label: customName.trim(), emoji: '✏️', color: '#a3a3a3', desc: '', startDate: new Date().toLocaleDateString('en-CA') };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(p));
        setPhase(p);
        setEditCustom(false);
        setShowPicker(false);
    };

    const clearPhase = () => { localStorage.removeItem(STORAGE_KEY); setPhase(null); };

    const daysActive = phase?.startDate
        ? Math.floor((Date.now() - new Date(phase.startDate)) / 86400000)
        : 0;

    return (
        <div style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: '14px', padding: '16px 18px' }}>
            {phase ? (
                <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: phase.desc ? '10px' : '0' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <span style={{ fontSize: '26px' }}>{phase.emoji}</span>
                            <div>
                                <div style={{ fontSize: '14px', fontWeight: 800, color: phase.color }}>{phase.label}</div>
                                <div style={{ fontSize: '11px', color: 'var(--text-3)' }}>
                                    {daysActive === 0 ? 'Started today' : `${daysActive} day${daysActive !== 1 ? 's' : ''} in`}
                                    {phase.startDate && ` — since ${new Date(phase.startDate + 'T12:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`}
                                </div>
                            </div>
                        </div>
                        <div style={{ display: 'flex', gap: '6px', flexShrink: 0 }}>
                            <button onClick={() => setShowPicker(v => !v)} style={{ fontSize: '11px', color: 'var(--accent)', background: 'var(--accent-dim)', border: '1px solid var(--border-accent)', padding: '4px 10px', borderRadius: '99px', cursor: 'pointer', fontWeight: 600 }}>
                                Change
                            </button>
                            <button onClick={clearPhase} style={{ fontSize: '11px', color: 'var(--text-3)', background: 'var(--bg-card)', border: '1px solid var(--border)', padding: '4px 8px', borderRadius: '99px', cursor: 'pointer' }}>
                                ✕
                            </button>
                        </div>
                    </div>
                    {phase.desc && <div style={{ fontSize: '12px', color: 'var(--text-2)', fontStyle: 'italic' }}>"{phase.desc}"</div>}
                </div>
            ) : (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div>
                        <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-1)' }}>No active phase</div>
                        <div style={{ fontSize: '11px', color: 'var(--text-3)', marginTop: '2px' }}>Tag the mode you're in — it contextualises your logs</div>
                    </div>
                    <button onClick={() => setShowPicker(v => !v)} style={{ fontSize: '11px', color: 'var(--accent)', background: 'var(--accent-dim)', border: '1px solid var(--border-accent)', padding: '6px 14px', borderRadius: '99px', cursor: 'pointer', fontWeight: 700, flexShrink: 0 }}>
                        + Set Phase
                    </button>
                </div>
            )}

            {showPicker && (
                <div style={{ marginTop: '14px', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' }}>
                    {PHASES.map(p => (
                        <button key={p.id} onClick={() => selectPhase(p)} style={{ padding: '10px 8px', borderRadius: '10px', border: '1px solid var(--border)', background: 'var(--bg-card)', cursor: 'pointer', textAlign: 'left', transition: 'all 0.15s' }}>
                            <div style={{ fontSize: '18px', marginBottom: '5px' }}>{p.emoji}</div>
                            <div style={{ fontSize: '11px', fontWeight: 700, color: p.color, lineHeight: 1.2 }}>{p.label}</div>
                        </button>
                    ))}
                </div>
            )}

            {editCustom && (
                <div style={{ marginTop: '12px', display: 'flex', gap: '8px' }}>
                    <input
                        autoFocus
                        type="text"
                        value={customName}
                        onChange={e => setCustomName(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && saveCustom()}
                        placeholder="Name your phase…"
                        style={{ flex: 1, padding: '9px 12px', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--text-1)', fontSize: '13px', outline: 'none' }}
                    />
                    <button onClick={saveCustom} style={{ padding: '9px 16px', background: 'var(--accent)', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 700, cursor: 'pointer', fontSize: '12px' }}>
                        Set
                    </button>
                </div>
            )}
        </div>
    );
};

export default PhaseTagger;
