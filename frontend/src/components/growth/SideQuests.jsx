import React, { useState, useEffect } from 'react';

const CHALLENGES = [
    { id: 'sleep_fortress', name: '7-Day Sleep Fortress', emoji: '🌙', duration: 7, color: '#8b5cf6', desc: 'Sleep 7h+ every single day this week', check: logs => logs.filter(l => (l.sleep_hours || 0) >= 7).length },
    { id: 'step_warrior', name: '10K Step Warrior', emoji: '🏃', duration: 7, color: '#ef4444', desc: '10,000 steps every day for 7 days', check: logs => logs.filter(l => (l.steps || 0) >= 10000).length },
    { id: 'learn_streak', name: 'Learn Every Day', emoji: '📚', duration: 14, color: '#3b82f6', desc: 'Learn something every day for 14 days', check: logs => logs.filter(l => l.learning_done).length },
    { id: 'gym_beast', name: 'Gym Beast Week', emoji: '💪', duration: 7, color: '#f97316', desc: '5 gym sessions in 7 days', check: logs => logs.filter(l => l.gym_done).length, threshold: 5 },
    { id: 'hydration', name: 'Hydration Week', emoji: '💧', duration: 7, color: '#06b6d4', desc: 'Drink 4+ bottles every day for 7 days', check: logs => logs.filter(l => (l.water_bottles || 0) >= 4).length },
    { id: 'journal_week', name: 'Journal Every Day', emoji: '📝', duration: 7, color: '#10b981', desc: 'Write a journal entry every day for 7 days', check: logs => logs.filter(l => l.journal_entry?.trim()).length },
    { id: 'no_excuses', name: 'No Excuses Week', emoji: '🔥', duration: 7, color: '#fbbf24', desc: 'Log all 8 metrics every day for 7 days', check: logs => logs.filter(l => [l.sleep_start, (l.steps || 0) > 0, l.mood > 0, l.learning_done, l.journal_entry?.trim(), l.gym_done !== undefined].filter(Boolean).length >= 6).length },
    { id: 'clean_week', name: 'Clean 7 Days', emoji: '🛡️', duration: 7, color: '#a855f7', desc: '7 days with no resets logged', check: logs => logs.filter(l => !(l.rc_count > 0)).length },
    { id: 'breakfast_habit', name: 'Breakfast Habit', emoji: '🍳', duration: 14, color: '#84cc16', desc: 'Have breakfast 14 days in a row', check: logs => logs.filter(l => l.breakfast_done).length },
    { id: 'mood_mastery', name: 'Mood 7+ Challenge', emoji: '😊', duration: 7, color: '#fb923c', desc: 'Maintain mood 7+ for 7 days straight', check: logs => logs.filter(l => (l.mood || 0) >= 7).length },
    { id: 'big30', name: '30-Day Streak', emoji: '⚡', duration: 30, color: '#f59e0b', desc: 'Log every single day for 30 days', check: logs => logs.filter(l => (l.mood || 0) > 0 || l.gym_done || l.breakfast_done).length },
    { id: 'gym_5x_4w', name: '5× Gym for 4 Weeks', emoji: '🏋️', duration: 28, color: '#e11d48', desc: '20 gym sessions in 28 days', check: logs => logs.filter(l => l.gym_done).length, threshold: 20 },
];

const STORAGE_KEY = 'aiimin_side_quest';

const SideQuests = ({ recentLogs = [] }) => {
    const [active, setActive] = useState(null);
    const [showPicker, setShowPicker] = useState(false);

    useEffect(() => {
        try {
            const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null');
            if (stored) setActive(stored);
        } catch { }
    }, []);

    const startQuest = (c) => {
        const storable = { id: c.id, name: c.name, emoji: c.emoji, duration: c.duration, color: c.color, desc: c.desc, threshold: c.threshold || c.duration, startDate: new Date().toLocaleDateString('en-CA') };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(storable));
        setActive(storable);
        setShowPicker(false);
    };

    const abandonQuest = () => { localStorage.removeItem(STORAGE_KEY); setActive(null); };

    const getProgress = () => {
        if (!active) return { done: 0, total: 1, pct: 0, daysLeft: 0 };
        const challenge = CHALLENGES.find(c => c.id === active.id);
        const daysElapsed = Math.floor((Date.now() - new Date(active.startDate)) / 86400000) + 1;
        const windowLogs = recentLogs.slice(0, Math.min(daysElapsed, active.duration));
        const done = challenge?.check ? challenge.check(windowLogs) : 0;
        const total = active.threshold || active.duration;
        const daysLeft = Math.max(0, active.duration - daysElapsed + 1);
        return { done, total, pct: done / total, daysLeft };
    };

    const progress = active ? getProgress() : null;
    const isComplete = progress && progress.done >= progress.total;

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

            {active ? (
                <div style={{
                    background: `linear-gradient(135deg, ${active.color}12 0%, var(--bg-elevated) 100%)`,
                    border: `1px solid ${active.color}44`, borderRadius: '14px', padding: '20px',
                }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                        <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '5px' }}>
                                <span style={{ fontSize: '22px' }}>{active.emoji}</span>
                                <span style={{ fontSize: '16px', fontWeight: 800, color: active.color }}>{active.name}</span>
                                {isComplete && <span style={{ fontSize: '12px', color: 'var(--accent)', fontWeight: 700, background: 'var(--accent-dim)', padding: '2px 8px', borderRadius: '99px', border: '1px solid var(--border-accent)' }}>✓ COMPLETE!</span>}
                            </div>
                            <div style={{ fontSize: '12px', color: 'var(--text-2)' }}>{active.desc}</div>
                        </div>
                        <button onClick={abandonQuest} style={{ fontSize: '10px', color: 'var(--text-3)', background: 'var(--bg-card)', border: '1px solid var(--border)', padding: '4px 9px', borderRadius: '6px', cursor: 'pointer', flexShrink: 0 }}>
                            Abandon
                        </button>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                        <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-1)' }}>{progress.done} / {progress.total}</span>
                        <span style={{ fontSize: '11px', color: 'var(--text-3)' }}>{progress.daysLeft} days left</span>
                    </div>
                    <div style={{ height: '10px', borderRadius: '5px', background: 'var(--bg-card)', overflow: 'hidden' }}>
                        <div style={{ height: '100%', borderRadius: '5px', background: isComplete ? '#10b981' : active.color, width: `${Math.min(progress.pct * 100, 100)}%`, transition: 'width 0.5s ease' }} />
                    </div>
                    <div style={{ marginTop: '8px', textAlign: 'right', fontSize: '12px', fontWeight: 700, color: isComplete ? '#10b981' : active.color }}>
                        {Math.round(progress.pct * 100)}% complete
                    </div>

                    <button onClick={() => setShowPicker(v => !v)} style={{ marginTop: '12px', fontSize: '11px', color: 'var(--text-3)', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}>
                        {showPicker ? 'Hide picker' : 'Switch challenge'}
                    </button>
                </div>
            ) : (
                <div style={{ padding: '24px', background: 'var(--bg-elevated)', border: '1px dashed var(--border)', borderRadius: '14px', textAlign: 'center' }}>
                    <div style={{ fontSize: '28px', marginBottom: '10px' }}>⚔️</div>
                    <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-1)', marginBottom: '6px' }}>No active side quest</div>
                    <div style={{ fontSize: '12px', color: 'var(--text-3)', marginBottom: '16px' }}>Pick a multi-day challenge to earn bonus XP faster</div>
                    <button onClick={() => setShowPicker(true)} style={{ padding: '9px 20px', background: 'var(--accent)', color: '#fff', border: 'none', borderRadius: '99px', fontWeight: 700, cursor: 'pointer', fontSize: '13px' }}>
                        Choose a Challenge
                    </button>
                </div>
            )}

            {(!active || showPicker) && (
                <div>
                    <div style={{ fontSize: '10px', fontWeight: 700, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '10px' }}>
                        Challenge Pool
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
                        {CHALLENGES.map(c => (
                            <button
                                key={c.id}
                                onClick={() => startQuest(c)}
                                style={{ padding: '14px 10px', borderRadius: '10px', border: `1px solid ${c.color}33`, background: `${c.color}0d`, cursor: 'pointer', textAlign: 'left', transition: 'all 0.15s' }}
                            >
                                <div style={{ fontSize: '20px', marginBottom: '6px' }}>{c.emoji}</div>
                                <div style={{ fontSize: '11px', fontWeight: 700, color: c.color, lineHeight: 1.25, marginBottom: '3px' }}>{c.name}</div>
                                <div style={{ fontSize: '10px', color: 'var(--text-3)' }}>{c.duration} days</div>
                            </button>
                        ))}
                    </div>
                </div>
            )}

        </div>
    );
};

export default SideQuests;
