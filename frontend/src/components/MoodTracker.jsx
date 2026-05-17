import React, { useState } from 'react';

const MOODS = [
    { n: 1, emoji: '😔', label: 'Terrible. Overwhelming, cannot function.' },
    { n: 2, emoji: '😞', label: 'Very low. Anxious or depressed, struggling.' },
    { n: 3, emoji: '😕', label: 'Low. Unmotivated, drained, going through motions.' },
    { n: 4, emoji: '😑', label: 'Below average. Tired, slightly off, manageable.' },
    { n: 5, emoji: '😐', label: 'Neutral. Neither good nor bad. Baseline.' },
    { n: 6, emoji: '🙂', label: 'Decent. Okay day, slightly positive.' },
    { n: 7, emoji: '😊', label: 'Good. Productive, feeling capable.' },
    { n: 8, emoji: '😄', label: 'Great. Energized, focused, things flowing.' },
    { n: 9, emoji: '🤩', label: 'Excellent. Peak state, highly motivated.' },
    { n: 10, emoji: '🔥', label: 'Exceptional. Everything clicking, best version of self.' },
];

const getColorGroup = (n) => {
    if (n <= 2) return { base: 'var(--danger-dim)', active: 'var(--danger)', ring: 'rgba(239, 68, 68, 0.4)' };
    if (n <= 4) return { base: 'var(--accent-dim)', active: 'var(--accent)', ring: 'rgba(245, 166, 35, 0.4)' };
    if (n <= 6) return { base: 'var(--success-dim)', active: 'var(--success)', ring: 'rgba(99, 193, 133, 0.4)' };
    if (n <= 8) return { base: 'rgba(0,190,255,0.1)', active: '#00beff', ring: 'rgba(0,190,255,0.4)' };
    return { base: 'rgba(155,138,245,0.1)', active: '#9b8af5', ring: 'rgba(155,138,245,0.4)' };
};

// Static mock weekly values (Mon → today placeholder)
const WEEK_MOCK = [7, 5, 8, 6, 9, 7, null];

const getLast7DayLabels = () => {
    const labels = [];
    for (let i = 6; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        labels.push(d.toLocaleDateString('en-US', { weekday: 'short' }).slice(0, 1));
    }
    return labels;
};

const MoodTracker = ({ user, onMoodChange }) => {
    const [selectedMood, setSelectedMood] = useState(null);
    const [hoveredMood, setHoveredMood] = useState(null);

    const handleSelect = (n) => {
        setSelectedMood(n);
        if (onMoodChange) onMoodChange(n);
    };

    const displayMood = hoveredMood ?? selectedMood;
    const displayData = displayMood ? MOODS[displayMood - 1] : null;
    const dayLabels = getLast7DayLabels();
    const weekValues = [...WEEK_MOCK.slice(0, 6), selectedMood];

    return (
        <div style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--r-lg)',
            padding: 'var(--card-px)',
            boxShadow: 'var(--shadow-md)',
        }}>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <span style={{ fontSize: '15px', fontWeight: 800, color: 'var(--text-1)', letterSpacing: '-0.02em' }}>Daily Mood</span>
                {selectedMood !== null && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{
                            padding: '3px 12px',
                            background: 'rgba(245,166,35,0.12)',
                            border: '1px solid rgba(245,166,35,0.3)',
                            borderRadius: '20px',
                            fontSize: '13px',
                            fontWeight: 700,
                            color: '#f5a623',
                        }}>
                            {selectedMood}/10
                        </span>
                        <button 
                            onClick={() => handleSelect(null)}
                            style={{
                                background: 'transparent',
                                border: 'none',
                                color: 'var(--text-3)',
                                cursor: 'pointer',
                                fontSize: '14px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}
                        >✕</button>
                    </div>
                )}
            </div>

            {/* Mood buttons row */}
            <div style={{ display: 'flex', gap: '6px', justifyContent: 'space-between', marginBottom: '16px' }}>
                {MOODS.map(({ n }) => {
                    const { base, active, ring } = getColorGroup(n);
                    const isSelected = selectedMood === n;
                    const isHov = hoveredMood === n;
                    const activated = isSelected || isHov;

                    return (
                        <div
                            key={n}
                            style={{ flex: 1, position: 'relative' }}
                            onMouseEnter={() => setHoveredMood(n)}
                            onMouseLeave={() => setHoveredMood(null)}
                        >
                            <button
                                onClick={() => handleSelect(n)}
                                style={{
                                    width: '100%',
                                    height: '44px',
                                    borderRadius: '10px',
                                    border: 'none',
                                    cursor: 'pointer',
                                    fontSize: '15px',
                                    fontWeight: 800,
                                    transition: 'all 0.15s ease',
                                    background: activated ? active : base,
                                    color: activated ? 'white' : active,
                                    transform: isHov ? 'scale(1.08)' : isSelected ? 'scale(1.05)' : 'scale(1)',
                                    zIndex: isHov ? 1 : 'auto',
                                    boxShadow: isSelected ? `0 0 0 2px ${ring}` : 'none',
                                }}
                            >
                                {n}
                            </button>

                            {/* Tooltip */}
                            {isHov && (
                                <div style={{
                                    position: 'absolute',
                                    bottom: 'calc(100% + 8px)',
                                    left: '50%',
                                    transform: 'translateX(-50%)',
                                    background: 'var(--bg-elevated)',
                                    border: '1px solid var(--border)',
                                    borderRadius: '8px',
                                    padding: '6px 10px',
                                    whiteSpace: 'nowrap',
                                    zIndex: 100,
                                    pointerEvents: 'none',
                                    boxShadow: 'var(--shadow-md)',
                                }}>
                                    <div style={{ fontWeight: 800, fontSize: '13px', color: 'var(--text-1)' }}>{n}</div>
                                    <div style={{ fontSize: '11px', color: 'var(--text-2)', maxWidth: '180px', whiteSpace: 'normal' }}>
                                        {MOODS[n - 1].label}
                                    </div>
                                    {/* Arrow */}
                                    <div style={{
                                        position: 'absolute',
                                        top: '100%',
                                        left: '50%',
                                        transform: 'translateX(-50%)',
                                        borderLeft: '5px solid transparent',
                                        borderRight: '5px solid transparent',
                                        borderTop: '5px solid var(--border)',
                                    }} />
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Mood description line */}
            <div style={{ height: '32px', display: 'flex', alignItems: 'center', transition: 'opacity 0.2s', opacity: displayData ? 1 : 0 }}>
                {displayData && (
                    <span style={{ fontSize: '13px', color: 'var(--text-2)' }}>
                        {displayData.emoji}&nbsp;&nbsp;{displayData.label}
                    </span>
                )}
            </div>

            {/* Mini bar trend — only if selectedMood set */}
            {selectedMood !== null && (
                <div style={{ borderTop: '1px solid var(--border)', marginTop: '16px', paddingTop: '14px' }}>
                    <div style={{ fontSize: '11px', color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '8px' }}>
                        This week
                    </div>
                    <div style={{ display: 'flex', gap: '4px' }}>
                        {dayLabels.map((label, i) => {
                            const val = weekValues[i];
                            const isToday = i === 6;
                            const fillPct = val ? `${(val / 10) * 100}%` : '0%';
                            const { active } = val ? getColorGroup(val) : { active: 'transparent' };

                            return (
                                <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', flex: 1 }}>
                                    <div style={{
                                        width: '100%',
                                        borderRadius: '4px',
                                        background: 'rgba(255,255,255,0.05)',
                                        height: '32px',
                                        position: 'relative',
                                        overflow: 'hidden',
                                    }}>
                                        <div style={{
                                            position: 'absolute',
                                            bottom: 0, left: 0, right: 0,
                                            borderRadius: '4px',
                                            height: fillPct,
                                            background: active,
                                            transition: 'height 0.3s ease',
                                        }} />
                                    </div>
                                    <span style={{
                                        fontSize: '9px',
                                        color: 'var(--text-3)',
                                        borderBottom: isToday ? '1px solid var(--accent)' : 'none',
                                        paddingBottom: isToday ? '1px' : '0',
                                    }}>
                                        {label}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
};

export default MoodTracker;
