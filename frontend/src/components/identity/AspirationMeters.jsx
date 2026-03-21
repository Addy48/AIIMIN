import React, { useState, useMemo } from 'react';

const DIMENSIONS = [
    { id: 'body',        label: 'Body',        emoji: '💪', color: '#ef4444', desc: 'Gym consistency, sleep quality, steps, nutrition' },
    { id: 'mind',        label: 'Mind',        emoji: '🧠', color: '#8b5cf6', desc: 'Learning, journaling, brain clarity, mood' },
    { id: 'discipline',  label: 'Discipline',  emoji: '⚡', color: '#f59e0b', desc: 'Daily consistency, logging habit, breakfast' },
    { id: 'wealth',      label: 'Wealth',      emoji: '💰', color: '#10b981', desc: 'Financial tracking frequency and habits' },
    { id: 'craft',       label: 'Craft',       emoji: '🔥', color: '#3b82f6', desc: 'DSA, Pomodoro focus sessions, deep learning' },
];

const TIER_LABELS = [
    { min: 90, label: 'Apex',     color: '#ffd700' },
    { min: 75, label: 'Elite',    color: '#8b5cf6' },
    { min: 55, label: 'Solid',    color: '#3b82f6' },
    { min: 35, label: 'Building', color: '#10b981' },
    { min: 15, label: 'Emerging', color: '#f59e0b' },
    { min: 0,  label: 'Dormant',  color: '#6b7280' },
];

function getTier(score) {
    return TIER_LABELS.find(t => score >= t.min) || TIER_LABELS[TIER_LABELS.length - 1];
}

function computeScores(logs, pomoCycles, dsaCount, txCount) {
    const N = Math.max(logs.length, 1);
    const clamp = v => Math.min(100, Math.max(0, Math.round(v)));

    const gymRate        = logs.filter(l => l.gym_done).length / N;
    const goodSleepRate  = logs.filter(l => (l.sleep_hours || 0) >= 7).length / N;
    const stepsRate      = logs.filter(l => (l.steps || 0) >= 7000).length / N;
    const breakfastRate  = logs.filter(l => l.breakfast_done).length / N;
    const waterRate      = logs.filter(l => (l.water_bottles || 0) >= 3).length / N;
    const body = clamp((gymRate * 30 + goodSleepRate * 25 + stepsRate * 20 + breakfastRate * 12 + waterRate * 13) * 100);

    const learnRate     = logs.filter(l => l.learning_done).length / N;
    const journalRate   = logs.filter(l => l.journal_entry?.trim()).length / N;
    const avgBrainFog   = logs.reduce((s, l) => s + (l.brain_fog || 0), 0) / N;
    const clarityNorm   = Math.max(0, (avgBrainFog - 1) / 2);
    const avgMood       = logs.filter(l => l.mood > 0).reduce((s, l) => s + l.mood, 0) / Math.max(1, logs.filter(l => l.mood > 0).length);
    const moodNorm      = Math.max(0, (avgMood - 4) / 6);
    const mind = clamp((learnRate * 35 + journalRate * 30 + clarityNorm * 20 + moodNorm * 15) * 100);

    const fullLogRate = logs.filter(l => {
        return [(l.sleep_hours || 0) > 0, l.gym_done !== undefined, l.breakfast_done !== undefined, (l.steps || 0) > 0, (l.mood || 0) > 0].filter(Boolean).length >= 4;
    }).length / N;
    const discipline = clamp((breakfastRate * 25 + fullLogRate * 40 + Math.min(N / 30, 1) * 35) * 100);

    const trackingScore  = Math.min(txCount / 90, 1);
    const regularityScore = txCount > 0 ? Math.min(N / 30, 1) : 0;
    const wealth = clamp((trackingScore * 60 + regularityScore * 40) * 100);

    const pomosNorm  = Math.min(pomoCycles / 100, 1);
    const dsaNorm    = Math.min(dsaCount / 100, 1);
    const craft = clamp((pomosNorm * 40 + dsaNorm * 35 + learnRate * 25) * 100);

    return { body, mind, discipline, wealth, craft };
}

const AspirationMeters = ({ recentLogs = [], pomoCycles = 0, dsaCount = 0, txCount = 0 }) => {
    const [expanded, setExpanded] = useState(null);
    const scores = useMemo(
        () => computeScores(recentLogs, pomoCycles, dsaCount, txCount),
        [recentLogs, pomoCycles, dsaCount, txCount]
    );

    const circumference = 2 * Math.PI * 22; // r=22

    return (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '8px' }}>
            {DIMENSIONS.map(dim => {
                const score  = scores[dim.id];
                const tier   = getTier(score);
                const isExp  = expanded === dim.id;
                const dash   = (score / 100) * circumference;

                return (
                    <button
                        key={dim.id}
                        onClick={() => setExpanded(isExp ? null : dim.id)}
                        style={{
                            background: isExp
                                ? `linear-gradient(180deg, ${dim.color}18 0%, var(--bg-elevated) 100%)`
                                : 'var(--bg-elevated)',
                            border: `1px solid ${isExp ? dim.color + '44' : 'var(--border)'}`,
                            borderRadius: '14px', padding: '16px 10px', cursor: 'pointer',
                            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px',
                            transition: 'all 0.2s', textAlign: 'center',
                        }}
                    >
                        <span style={{ fontSize: '20px' }}>{dim.emoji}</span>

                        {/* SVG ring */}
                        <div style={{ position: 'relative', width: '60px', height: '60px' }}>
                            <svg viewBox="0 0 56 56" style={{ transform: 'rotate(-90deg)', width: '60px', height: '60px' }}>
                                <circle cx="28" cy="28" r="22" fill="none" stroke="var(--bg-card)" strokeWidth="5" />
                                <circle
                                    cx="28" cy="28" r="22" fill="none" stroke={dim.color}
                                    strokeWidth="5" strokeLinecap="round"
                                    strokeDasharray={`${dash} ${circumference}`}
                                    style={{ transition: 'stroke-dasharray 0.7s ease' }}
                                />
                            </svg>
                            <div style={{
                                position: 'absolute', inset: 0,
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                fontSize: '13px', fontWeight: 900, color: dim.color,
                            }}>
                                {score}
                            </div>
                        </div>

                        <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-1)' }}>{dim.label}</div>
                        <div style={{
                            fontSize: '10px', fontWeight: 700, color: tier.color,
                            background: `${tier.color}18`, padding: '2px 9px', borderRadius: '99px',
                            border: `1px solid ${tier.color}33`,
                        }}>
                            {tier.label}
                        </div>
                        {isExp && (
                            <div style={{ fontSize: '10px', color: 'var(--text-3)', lineHeight: 1.45, marginTop: '2px' }}>
                                {dim.desc}
                            </div>
                        )}
                    </button>
                );
            })}
        </div>
    );
};

export default AspirationMeters;
