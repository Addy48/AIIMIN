import React, { useState } from 'react';

const METRICS = [
    { id: 'sleep',    label: 'Sleep',    mirrorFn: logs => avg(logs.map(l => l.sleep_hours || 0).filter(v => v > 0)),              visionDefault: 8,  fmt: v => v.toFixed(1) + 'h',  compUnit: 'h'   },
    { id: 'gym',      label: 'Gym',      mirrorFn: logs => pct(logs, l => l.gym_done),                                              visionDefault: 71, fmt: v => Math.round(v) + '%', compUnit: 'pct' },
    { id: 'steps',    label: 'Steps',    mirrorFn: logs => avg(logs.map(l => (l.steps || 0) / 1000).filter(v => v > 0)),           visionDefault: 10, fmt: v => v.toFixed(1) + 'k',  compUnit: 'k'   },
    { id: 'water',    label: 'Water',    mirrorFn: logs => avg(logs.map(l => l.water_bottles || 0)),                                visionDefault: 4,  fmt: v => v.toFixed(1),        compUnit: 'btl' },
    { id: 'learning', label: 'Learning', mirrorFn: logs => pct(logs, l => l.learning_done),                                        visionDefault: 86, fmt: v => Math.round(v) + '%', compUnit: 'pct' },
    { id: 'journal',  label: 'Journal',  mirrorFn: logs => pct(logs, l => !!(l.journal_entry?.trim())),                            visionDefault: 71, fmt: v => Math.round(v) + '%', compUnit: 'pct' },
    { id: 'mood',     label: 'Mood',     mirrorFn: logs => avg(logs.filter(l => l.mood > 0).map(l => l.mood)),                     visionDefault: 8,  fmt: v => v.toFixed(1),        compUnit: '/10' },
];

const avg = arr => arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : 0;
const pct = (logs, fn) => logs.length ? (logs.filter(fn).length / logs.length) * 100 : 0;

const MirrorVision = ({ recentLogs = [] }) => {
    const [visionTargets, setVisionTargets] = useState(() => {
        try { return JSON.parse(localStorage.getItem('aiimin_vision_targets') || '{}'); } catch { return {}; }
    });
    const [editMode, setEditMode] = useState(false);
    const [draft, setDraft] = useState({});

    const saveVision = () => {
        localStorage.setItem('aiimin_vision_targets', JSON.stringify(draft));
        setVisionTargets(draft);
        setEditMode(false);
    };

    const last7 = recentLogs.slice(0, 7);

    return (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>

            {/* Mirror */}
            <div style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: '14px', overflow: 'hidden' }}>
                <div style={{ padding: '14px 18px', background: 'linear-gradient(90deg, rgba(107,114,128,0.12), transparent)', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ fontSize: '20px' }}>🪞</span>
                    <div>
                        <div style={{ fontSize: '13px', fontWeight: 800, color: 'var(--text-1)' }}>Mirror — Who you are</div>
                        <div style={{ fontSize: '10px', color: 'var(--text-3)' }}>Last 7-day average</div>
                    </div>
                </div>
                <div style={{ padding: '16px 18px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {METRICS.map(m => {
                        const val = m.mirrorFn(last7);
                        return (
                            <div key={m.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span style={{ fontSize: '12px', color: 'var(--text-2)' }}>{m.label}</span>
                                <span style={{ fontSize: '13px', fontWeight: 700, color: last7.length && val > 0 ? 'var(--text-1)' : 'var(--text-3)' }}>
                                    {last7.length && val > 0 ? m.fmt(val) : '—'}
                                </span>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Vision */}
            <div style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: '14px', overflow: 'hidden' }}>
                <div style={{ padding: '14px 18px', background: 'linear-gradient(90deg, rgba(245,158,11,0.1), transparent)', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span style={{ fontSize: '20px' }}>🎯</span>
                        <div>
                            <div style={{ fontSize: '13px', fontWeight: 800, color: 'var(--accent)' }}>Vision — Who you're becoming</div>
                            <div style={{ fontSize: '10px', color: 'var(--text-3)' }}>Your targets vs actual</div>
                        </div>
                    </div>
                    <button
                        onClick={() => { setDraft(visionTargets); setEditMode(v => !v); }}
                        style={{ fontSize: '10px', color: 'var(--text-3)', background: 'var(--bg-card)', border: '1px solid var(--border)', padding: '4px 9px', borderRadius: '6px', cursor: 'pointer', fontWeight: 600 }}
                    >
                        {editMode ? 'Cancel' : 'Edit ✏️'}
                    </button>
                </div>
                <div style={{ padding: '16px 18px', display: 'flex', flexDirection: 'column', gap: editMode ? '14px' : '12px' }}>
                    {METRICS.map(m => {
                        const target = visionTargets[m.id] ?? m.visionDefault;
                        const mirror = m.mirrorFn(last7);
                        const ratio  = last7.length && mirror > 0 ? Math.min(mirror / target, 1) : 0;
                        const isGood = ratio >= 0.85;

                        if (editMode) {
                            return (
                                <div key={m.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px' }}>
                                    <span style={{ fontSize: '12px', color: 'var(--text-2)', flexShrink: 0 }}>{m.label}</span>
                                    <input
                                        type="number"
                                        value={draft[m.id] ?? m.visionDefault}
                                        onChange={e => setDraft(p => ({ ...p, [m.id]: parseFloat(e.target.value) || m.visionDefault }))}
                                        style={{ width: '64px', padding: '4px 8px', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '6px', color: 'var(--text-1)', fontSize: '12px', textAlign: 'right', outline: 'none' }}
                                    />
                                </div>
                            );
                        }

                        return (
                            <div key={m.id} style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <span style={{ fontSize: '12px', color: 'var(--text-2)' }}>{m.label}</span>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                                        <span style={{ fontSize: '11px', color: isGood ? 'var(--success)' : 'var(--text-3)' }}>
                                            {last7.length && mirror > 0 ? m.fmt(mirror) : '—'}
                                        </span>
                                        <span style={{ fontSize: '10px', color: 'var(--text-3)' }}>/</span>
                                        <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--accent)' }}>
                                            {m.fmt(target)}
                                        </span>
                                    </div>
                                </div>
                                <div style={{ height: '3px', borderRadius: '2px', background: 'var(--bg-card)', overflow: 'hidden' }}>
                                    <div style={{ height: '100%', borderRadius: '2px', background: isGood ? 'var(--success)' : 'var(--accent)', width: `${ratio * 100}%`, transition: 'width 0.6s ease' }} />
                                </div>
                            </div>
                        );
                    })}
                    {editMode && (
                        <button onClick={saveVision} style={{ padding: '9px', background: 'var(--accent)', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 700, cursor: 'pointer', fontSize: '12px', marginTop: '2px' }}>
                            Save Vision
                        </button>
                    )}
                </div>
            </div>

        </div>
    );
};

export default MirrorVision;
