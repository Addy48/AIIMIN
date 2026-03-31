import React from 'react';

const DayArchetypes = ({ logs = [], archetypes: archetypeData = null }) => {
    if (archetypeData?.length) {
        const counts = archetypeData.reduce((acc, item) => {
            acc[item.archetype] = (acc[item.archetype] || 0) + 1;
            return acc;
        }, {});

        const deepWorkCount = logs.filter(l => (l.pomodoro_minutes || 0) >= 90 && (l.mood || 0) >= 7).length;

        const cards = [
            { label: 'Peak Performance Day', count: counts['Peak Performance Day'] || 0, color: 'var(--success)' },
            { label: 'Deep Work Day', count: counts['Deep Work Day'] || deepWorkCount, color: '#8b5cf6' },
            { label: 'Recovery Day', count: counts['Recovery Day'] || 0, color: 'var(--accent)' },
            { label: 'Low Energy Day', count: counts['Low Energy Day'] || 0, color: 'var(--text-3)' },
            { label: 'Chaotic Day', count: counts['Chaotic Day'] || 0, color: 'var(--danger)' },
            { label: 'Financial Risk Day', count: counts['Financial Risk Day'] || 0, color: 'var(--gold)' },
        ];

        return (
            <div className="glass-panel" style={{ padding: '24px', borderRadius: 'var(--r-lg)' }}>
                <div style={{ fontSize: '11px', fontWeight: 800, color: 'var(--text-2)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '16px' }}>Day Archetype Classifier</div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
                    {cards.map((arc) => (
                        <div key={arc.label} style={{ display: 'flex', flexDirection: 'column', gap: '4px', background: 'var(--bg-card)', padding: '12px', borderRadius: '8px', border: '1px solid var(--border)' }}>
                            <div style={{ fontSize: '24px', fontWeight: 800, color: arc.color }}>{arc.count}</div>
                            <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-2)' }}>{arc.label}</div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    // Determine archetype counts over the provided logs (usually 30 days)
    let peak = 0, recovery = 0, lowEnergy = 0, chaotic = 0, flow = 0, discipline = 0;

    logs.forEach(l => {
        const sleep = parseFloat(l.sleep_hours) || 0;
        const gym = l.gym_done;
        const mood = l.mood || 0;
        const focus = l.pomodoro_minutes || 0;

        if (focus >= 120 && mood >= 8) {
            flow++;
        } else if (gym && sleep >= 7 && focus >= 60) {
            discipline++;
        } else if (sleep >= 7 && gym && mood >= 6) {
            peak++;
        } else if (sleep >= 8 && !gym && mood >= 5) {
            recovery++;
        } else if (sleep < 6 || mood <= 4) {
            chaotic++;
        } else {
            lowEnergy++;
        }
    });

    const deepWorkCount = logs.filter(l => (l.pomodoro_minutes || 0) >= 90 && (l.mood || 0) >= 7).length;

    const archetypes = [
        { label: 'Flow State Day', count: flow, icon: '🌊', color: 'var(--accent)', desc: 'High focus & high mood.' },
        { label: 'High Discipline Day', count: discipline, icon: '🛡️', color: '#22C55E', desc: 'Sleep, gym, and focus met.' },
        { label: 'Peak Performance', count: peak, icon: '⚡', color: '#3b82f6', desc: 'Balanced physical and mental.' },
        { label: 'Deep Work Day', count: deepWorkCount, icon: '⏱️', color: '#8b5cf6', desc: '90m+ focus and good mood.' },
        { label: 'Recovery Mode', count: recovery, icon: '🔋', color: 'var(--text-1)', desc: 'Extra sleep, resting body.' },
        { label: 'Low Energy', count: lowEnergy, icon: '📉', color: 'var(--text-3)', desc: 'Suboptimal inputs & outputs.' },
        { label: 'Chaotic / Burnout', count: chaotic, icon: '⚠️', color: 'var(--danger)', desc: 'Poor sleep and low mood.' }
    ];

    const highest = archetypes.reduce((a, b) => a.count > b.count ? a : b);

    return (
        <div className="glass-panel" style={{ padding: '24px', borderRadius: 'var(--r-lg)' }}>
            <div style={{ fontSize: '11px', fontWeight: 800, color: 'var(--text-2)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '16px' }}>Macro State: Day Archetypes</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
                {archetypes.map(arc => (
                    <div key={arc.label} style={{ display: 'flex', flexDirection: 'column', gap: '6px', background: 'var(--bg-card)', padding: '14px', borderRadius: '10px', border: '1px solid var(--border)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <div style={{ fontSize: '20px' }}>{arc.icon}</div>
                            <div style={{ fontSize: '24px', fontWeight: 800, color: arc.color }}>{arc.count}</div>
                        </div>
                        <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-1)', marginTop: '4px' }}>{arc.label}</div>
                        <div style={{ fontSize: '10px', fontWeight: 500, color: 'var(--text-3)', lineHeight: 1.3 }}>{arc.desc}</div>
                    </div>
                ))}
            </div>
            <div style={{ marginTop: '20px', fontSize: '12px', color: 'var(--text-3)', lineHeight: 1.5 }}>
                Your dominant archetype this period reveals a strong inclination toward <span style={{ color: 'var(--accent)', fontWeight: 700 }}>{highest.label}</span>.
            </div>
        </div>
    );
}

export default DayArchetypes;
