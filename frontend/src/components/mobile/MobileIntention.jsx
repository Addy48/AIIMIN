import React, { useState } from 'react';

const FOCUS_AREAS = ['Body', 'Mind', 'Discipline', 'Wealth', 'Craft', 'Focus'];
const STORAGE_PREFIX = 'aiimin_intention_';

const MobileIntention = () => {
    const today = new Date().toLocaleDateString('en-CA');
    const STORAGE_KEY = STORAGE_PREFIX + today;

    const [data, setData] = useState(() => {
        try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}'); } catch { return {}; }
    });
    const [text, setText] = useState(data.intention || '');
    const [focus, setFocus] = useState(data.focusArea || '');
    const [open, setOpen] = useState(!data.intention);

    const save = () => {
        const next = { ...data, intention: text, focusArea: focus };
        setData(next);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
        setOpen(false);
    };

    const hasSaved = !!data.intention;

    return (
        <div style={{
            background: 'var(--bg-card)', borderRadius: '14px', padding: '16px',
            border: `1px solid ${hasSaved ? 'rgba(16,185,129,0.25)' : 'var(--border)'}`,
            margin: '0 16px',
        }}>
            <button
                onClick={() => setOpen(o => !o)}
                style={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    width: '100%', background: 'none', border: 'none', padding: 0, cursor: 'pointer',
                }}
            >
                <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-2)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    🎯 INTENTION
                </span>
                <span style={{ fontSize: '10px', color: hasSaved ? 'var(--success)' : 'var(--text-3)' }}>
                    {hasSaved ? '✓ set' : '○ not set'}
                </span>
            </button>

            {open && (
                <div style={{ marginTop: '12px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <input
                        type="text"
                        value={text}
                        onChange={e => setText(e.target.value)}
                        placeholder="Today I will..."
                        style={{
                            width: '100%', padding: '10px 12px', borderRadius: '10px',
                            border: '1px solid var(--border)', background: 'var(--bg-elevated)',
                            color: 'var(--text-1)', fontSize: '14px', fontFamily: 'inherit',
                        }}
                    />
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                        {FOCUS_AREAS.map(a => (
                            <button key={a} onClick={() => setFocus(focus === a ? '' : a)} style={{
                                padding: '5px 12px', borderRadius: '99px', fontSize: '11px', fontWeight: 600,
                                border: focus === a ? '1px solid var(--accent)' : '1px solid var(--border)',
                                background: focus === a ? 'var(--accent-dim)' : 'var(--bg-elevated)',
                                color: focus === a ? 'var(--accent)' : 'var(--text-3)',
                                cursor: 'pointer',
                            }}>
                                {a}
                            </button>
                        ))}
                    </div>
                    <button
                        onClick={save}
                        disabled={!text.trim()}
                        style={{
                            padding: '9px 0', borderRadius: '10px', border: 'none',
                            background: text.trim() ? 'var(--accent)' : 'var(--bg-elevated)',
                            color: text.trim() ? '#fff' : 'var(--text-3)',
                            fontSize: '13px', fontWeight: 700, cursor: text.trim() ? 'pointer' : 'default',
                        }}
                    >
                        Set Intention
                    </button>
                </div>
            )}

            {hasSaved && !open && (
                <div style={{ marginTop: '10px' }}>
                    <div style={{ fontSize: '14px', color: 'var(--text-1)', fontWeight: 600 }}>{data.intention}</div>
                    {data.focusArea && (
                        <span style={{
                            display: 'inline-block', marginTop: '6px', padding: '3px 10px',
                            borderRadius: '99px', fontSize: '10px', fontWeight: 700,
                            background: 'var(--accent-dim)', color: 'var(--accent)',
                            border: '1px solid var(--border-accent)',
                        }}>
                            {data.focusArea}
                        </span>
                    )}
                </div>
            )}
        </div>
    );
};

export default MobileIntention;
