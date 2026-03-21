import React, { useState } from 'react';

const MENTORS = [
    {
        id: 'cr7',
        name: 'Cristiano Ronaldo',
        codename: 'CR7',
        emoji: '⚽',
        color: '#3b82f6',
        traits: ['Obsession', 'Discipline', 'Perfection', 'Work Ethic'],
        quote: 'Talent without work is nothing.',
        grad: 'linear-gradient(135deg, #0f1e3d 0%, #1a2f5f 100%)',
    },
    {
        id: 'kohli',
        name: 'Virat Kohli',
        codename: 'King Kohli',
        emoji: '🏏',
        color: '#f59e0b',
        traits: ['Mental Toughness', 'Hunger', 'Aggression', 'Consistency'],
        quote: 'Self-belief and hard work will always earn you success.',
        grad: 'linear-gradient(135deg, #2d1a00 0%, #4a2d00 100%)',
    },
    {
        id: 'mamba',
        name: 'Kobe Bryant',
        codename: 'Black Mamba',
        emoji: '🐍',
        color: '#a855f7',
        traits: ['Relentlessness', 'Dark Hours', 'Competitiveness', 'Focus'],
        quote: 'The most important thing is to be great at what you do.',
        grad: 'linear-gradient(135deg, #1e0a2e 0%, #2d1247 100%)',
    },
    {
        id: 'mourinho',
        name: 'José Mourinho',
        codename: 'The Special One',
        emoji: '🎯',
        color: '#ef4444',
        traits: ['Strategy', 'Tactical IQ', 'Winning Mindset', 'Leadership'],
        quote: 'I don\'t feel pressure, I feel responsibility.',
        grad: 'linear-gradient(135deg, #2d0000 0%, #4a0000 100%)',
    },
    {
        id: 'goggins',
        name: 'David Goggins',
        codename: 'The Accountable',
        emoji: '💪',
        color: '#10b981',
        traits: ['Mental Fortitude', 'No Excuses', 'Pain Threshold', 'Endurance'],
        quote: 'Nobody is going to come and save you. You\'ve got to save yourself.',
        grad: 'linear-gradient(135deg, #001a0d 0%, #002b14 100%)',
    },
    {
        id: 'musk',
        name: 'Elon Musk',
        codename: 'First Principles',
        emoji: '🚀',
        color: '#60a5fa',
        traits: ['First Principles', 'Big Vision', 'Execution', 'Risk Taking'],
        quote: 'When something is important enough, you do it even if odds are against you.',
        grad: 'linear-gradient(135deg, #0a152e 0%, #0d1f47 100%)',
    },
    {
        id: 'jobs',
        name: 'Steve Jobs',
        codename: 'The Craftsman',
        emoji: '🍎',
        color: '#a3a3a3',
        traits: ['Simplicity', 'Craft Excellence', 'Reality Distortion', 'Legacy'],
        quote: 'The people crazy enough to think they can change the world are the ones who do.',
        grad: 'linear-gradient(135deg, #141414 0%, #1f1f1f 100%)',
    },
    {
        id: 'ali',
        name: 'Muhammad Ali',
        codename: 'The Greatest',
        emoji: '🥊',
        color: '#f97316',
        traits: ['Swagger', 'Self-Belief', 'Courage', 'Resilience'],
        quote: 'I hated every minute of training — but I said: don\'t quit. Suffer now and live as a champion.',
        grad: 'linear-gradient(135deg, #1c0a00 0%, #2e1200 100%)',
    },
];

const STORAGE_KEY = 'aiimin_identity_stack';

const IdentityStack = () => {
    const [selected, setSelected] = useState(() => {
        try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'); } catch { return []; }
    });
    const [showAll, setShowAll] = useState(false);

    const toggle = (id) => {
        setSelected(prev => {
            const next = prev.includes(id)
                ? prev.filter(x => x !== id)
                : prev.length < 3 ? [...prev, id] : prev;
            localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
            return next;
        });
    };

    const selectedMentors = MENTORS.filter(m => selected.includes(m.id));
    const unselectedMentors = MENTORS.filter(m => !selected.includes(m.id));
    const displayUnselected = showAll ? unselectedMentors : unselectedMentors.slice(0, 4);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

            {/* Active stack */}
            {selectedMentors.length > 0 && (
                <div>
                    <div style={{ fontSize: '10px', fontWeight: 700, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '12px' }}>
                        Your Identity Stack — {selectedMentors.length}/3 selected
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: `repeat(${Math.max(selectedMentors.length, 1)}, 1fr)`, gap: '12px' }}>
                        {selectedMentors.map(m => (
                            <MentorCard key={m.id} mentor={m} isSelected pressed={() => toggle(m.id)} />
                        ))}
                        {Array.from({ length: 3 - selectedMentors.length }).map((_, i) => (
                            <div key={i} style={{
                                borderRadius: '12px', border: '1px dashed var(--border)', minHeight: '130px',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                fontSize: '11px', color: 'var(--text-3)', background: 'var(--bg-elevated)',
                            }}>
                                + Add Mentor
                            </div>
                        ))}
                    </div>

                    {/* Combined trait display */}
                    <div style={{ marginTop: '14px', padding: '14px 16px', background: 'var(--bg-elevated)', borderRadius: '10px', border: '1px solid var(--border)' }}>
                        <div style={{ fontSize: '10px', fontWeight: 700, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '8px' }}>
                            Combined traits in your stack
                        </div>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                            {selectedMentors.flatMap(m => m.traits.map(t => ({ trait: t, color: m.color }))).map(({ trait, color }, i) => (
                                <span key={i} style={{
                                    fontSize: '11px', fontWeight: 600, padding: '3px 10px', borderRadius: '99px',
                                    background: `${color}18`, color, border: `1px solid ${color}33`,
                                }}>
                                    {trait}
                                </span>
                            ))}
                        </div>

                        {/* Daily quote from primary mentor */}
                        {selectedMentors[0] && (
                            <div style={{ marginTop: '12px', padding: '10px 14px', background: 'var(--bg-card)', borderRadius: '8px', borderLeft: `3px solid ${selectedMentors[0].color}` }}>
                                <div style={{ fontSize: '10px', fontWeight: 700, color: selectedMentors[0].color, marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                                    {selectedMentors[0].codename} says
                                </div>
                                <div style={{ fontSize: '12px', color: 'var(--text-2)', fontStyle: 'italic', lineHeight: 1.5 }}>
                                    "{selectedMentors[0].quote}"
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Mentor roster */}
            <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                    <div style={{ fontSize: '10px', fontWeight: 700, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                        {selectedMentors.length === 0 ? 'Choose Your Stack (pick up to 3)' : 'Add More'}
                    </div>
                    <button
                        onClick={() => setShowAll(v => !v)}
                        style={{ fontSize: '11px', color: 'var(--accent)', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600 }}
                    >
                        {showAll ? 'Show less ▴' : 'Show all ▾'}
                    </button>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px' }}>
                    {displayUnselected.map(m => (
                        <MentorCard key={m.id} mentor={m} isSelected={false} pressed={() => toggle(m.id)} />
                    ))}
                </div>
            </div>

        </div>
    );
};

const MentorCard = ({ mentor: m, isSelected, pressed }) => (
    <button
        onClick={pressed}
        title={m.quote}
        style={{
            background: isSelected ? m.grad : 'var(--bg-elevated)',
            border: isSelected ? `1.5px solid ${m.color}55` : '1px solid var(--border)',
            borderRadius: '12px', padding: '16px 12px', cursor: 'pointer', textAlign: 'left',
            transition: 'all 0.2s', position: 'relative',
            boxShadow: isSelected ? `0 0 20px ${m.color}22` : 'none',
        }}
    >
        <div style={{ fontSize: '22px', marginBottom: '7px' }}>{m.emoji}</div>
        <div style={{ fontSize: '12px', fontWeight: 800, color: isSelected ? m.color : 'var(--text-1)', lineHeight: 1.2, marginBottom: '3px' }}>
            {m.codename}
        </div>
        <div style={{ fontSize: '10px', color: 'var(--text-3)' }}>{m.name}</div>
        {isSelected && (
            <div style={{ position: 'absolute', top: '8px', right: '8px', width: '8px', height: '8px', borderRadius: '50%', background: m.color, boxShadow: `0 0 6px ${m.color}` }} />
        )}
    </button>
);

export default IdentityStack;
