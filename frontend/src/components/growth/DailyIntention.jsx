import React, { useState } from 'react';

const FOCUS_AREAS = ['Body', 'Mind', 'Discipline', 'Wealth', 'Craft', 'Relationships', 'Focus'];
const STORAGE_PREFIX = 'aiimin_intention_';

const DailyIntention = () => {
    const today = new Date().toLocaleDateString('en-CA');
    const hour = new Date().getHours();
    const isEvening = hour >= 18;
    const STORAGE_KEY = STORAGE_PREFIX + today;

    const [data, setData] = useState(() => {
        try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}'); } catch { return {}; }
    });

    const save = (updates) => {
        const next = { ...data, ...updates };
        setData(next);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    };

    const [intentionText, setIntentionText] = useState(data.intention || '');
    const [focusArea, setFocusArea] = useState(data.focusArea || '');
    const [followThrough, setFollowThrough] = useState(data.followThrough || '');
    const [wentWell, setWentWell] = useState(data.wentWell || '');
    const [improve, setImprove] = useState(data.improve || '');
    const [savedM, setSavedM] = useState(false);
    const [savedE, setSavedE] = useState(false);

    const saveIntention = () => {
        save({ intention: intentionText, focusArea });
        setSavedM(true);
        setTimeout(() => setSavedM(false), 2000);
    };

    const saveEvening = () => {
        save({ followThrough, wentWell, improve, eveningSaved: true });
        setSavedE(true);
        setTimeout(() => setSavedE(false), 2000);
    };

    const hasMorning = !!(data.intention);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

            {/* Morning */}
            <div style={{ background: 'var(--bg-elevated)', border: `1px solid ${hasMorning ? 'rgba(16,185,129,0.3)' : 'var(--border)'}`, borderRadius: '14px', padding: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span style={{ fontSize: '20px' }}>🌅</span>
                        <div>
                            <div style={{ fontSize: '13px', fontWeight: 800, color: 'var(--text-1)' }}>Morning Intention</div>
                            <div style={{ fontSize: '11px', color: 'var(--text-3)' }}>What are you fighting for today?</div>
                        </div>
                    </div>
                    {hasMorning && <span style={{ fontSize: '11px', color: 'var(--success)', fontWeight: 700 }}>Set ✓</span>}
                </div>

                <textarea
                    value={intentionText}
                    onChange={e => setIntentionText(e.target.value)}
                    placeholder="Today I will focus on…"
                    rows={2}
                    style={{ width: '100%', resize: 'vertical', padding: '10px 14px', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--text-1)', fontSize: '13px', lineHeight: 1.5, outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit' }}
                />

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '10px' }}>
                    {FOCUS_AREAS.map(a => (
                        <button
                            key={a}
                            onClick={() => setFocusArea(a === focusArea ? '' : a)}
                            style={{ padding: '4px 11px', borderRadius: '99px', fontSize: '11px', fontWeight: 600, cursor: 'pointer', transition: 'all 0.15s', border: focusArea === a ? '1px solid var(--accent)' : '1px solid var(--border)', background: focusArea === a ? 'var(--accent-dim)' : 'var(--bg-card)', color: focusArea === a ? 'var(--accent)' : 'var(--text-2)' }}
                        >
                            {a}
                        </button>
                    ))}
                </div>

                <button
                    onClick={saveIntention}
                    style={{ marginTop: '14px', width: '100%', padding: '9px', background: savedM ? 'var(--success)' : 'var(--accent)', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 700, cursor: 'pointer', fontSize: '12px', transition: 'background 0.2s' }}
                >
                    {savedM ? 'Saved ✓' : 'Set Intention'}
                </button>
            </div>

            {/* Evening */}
            {(isEvening || data.eveningSaved) && (
                <div style={{ background: 'var(--bg-elevated)', border: `1px solid ${data.eveningSaved ? 'rgba(16,185,129,0.3)' : 'var(--border)'}`, borderRadius: '14px', padding: '20px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <span style={{ fontSize: '20px' }}>🌙</span>
                            <div>
                                <div style={{ fontSize: '13px', fontWeight: 800, color: 'var(--text-1)' }}>Evening Review</div>
                                <div style={{ fontSize: '11px', color: 'var(--text-3)' }}>Close the loop on today</div>
                            </div>
                        </div>
                        {data.eveningSaved && <span style={{ fontSize: '11px', color: 'var(--success)', fontWeight: 700 }}>Done ✓</span>}
                    </div>

                    {hasMorning && (
                        <div style={{ padding: '10px 14px', background: 'var(--bg-card)', borderRadius: '8px', marginBottom: '14px', fontSize: '12px', color: 'var(--text-2)', fontStyle: 'italic' }}>
                            Your intention: "{data.intention}"
                        </div>
                    )}

                    <div style={{ marginBottom: '12px' }}>
                        <div style={{ fontSize: '11px', color: 'var(--text-3)', marginBottom: '7px' }}>Did you follow through?</div>
                        <div style={{ display: 'flex', gap: '6px' }}>
                            {['Yes ✓', 'Partially', 'No'].map(v => {
                                const val = v.replace(' ✓', '');
                                return (
                                    <button
                                        key={v}
                                        onClick={() => setFollowThrough(val)}
                                        style={{ flex: 1, padding: '8px', borderRadius: '8px', fontSize: '12px', fontWeight: 700, cursor: 'pointer', transition: 'all 0.15s', border: followThrough === val ? '1px solid var(--accent)' : '1px solid var(--border)', background: followThrough === val ? 'var(--accent-dim)' : 'var(--bg-card)', color: followThrough === val ? 'var(--accent)' : 'var(--text-2)' }}
                                    >
                                        {v}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '12px' }}>
                        <input type="text" value={wentWell} onChange={e => setWentWell(e.target.value)} placeholder="One thing that went well…" style={{ padding: '9px 12px', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--text-1)', fontSize: '12px', outline: 'none' }} />
                        <input type="text" value={improve} onChange={e => setImprove(e.target.value)} placeholder="One thing to improve tomorrow…" style={{ padding: '9px 12px', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--text-1)', fontSize: '12px', outline: 'none' }} />
                    </div>

                    <button
                        onClick={saveEvening}
                        style={{ width: '100%', padding: '9px', background: savedE ? 'var(--success)' : '#8b5cf6', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 700, cursor: 'pointer', fontSize: '12px', transition: 'background 0.2s' }}
                    >
                        {savedE ? 'Saved ✓' : 'Close the Day'}
                    </button>
                </div>
            )}

        </div>
    );
};

export default DailyIntention;
