import React from 'react';

const DayArchetypes = ({ logs = [], archetypes: archetypeData = null }) => {
    if (archetypeData?.length) {
        const counts = archetypeData.reduce((acc, item) => {
            acc[item.archetype] = (acc[item.archetype] || 0) + 1;
            return acc;
        }, {});

        const cards = [
            { label: 'Peak Performance Day', count: counts['Peak Performance Day'] || 0, color: 'var(--success)' },
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
    let peak = 0, recovery = 0, lowEnergy = 0, chaotic = 0;

    logs.forEach(l => {
        const sleep = parseFloat(l.sleep_hours) || 0;
        const gym = l.gym_done;
        const mood = l.mood || 0;

        if (sleep >= 7 && gym && mood >= 4) peak++;
        else if (sleep >= 8 && !gym && mood >= 3) recovery++;
        else if (sleep < 6 || mood <= 2) chaotic++;
        else lowEnergy++;
    });

    const archetypes = [
        { label: 'Peak Performance', count: peak, color: 'var(--success)' },
        { label: 'Recovery Mode', count: recovery, color: 'var(--accent)' },
        { label: 'Low Energy', count: lowEnergy, color: 'var(--text-3)' },
        { label: 'Chaotic / Burnout', count: chaotic, color: 'var(--danger)' }
    ];

    return (
        <div className="glass-panel" style={{ padding: '24px', borderRadius: 'var(--r-lg)' }}>
            <div style={{ fontSize: '11px', fontWeight: 800, color: 'var(--text-2)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '16px' }}>Macro State: Day Archetypes</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
                {archetypes.map(arc => (
                    <div key={arc.label} style={{ display: 'flex', flexDirection: 'column', gap: '4px', background: 'var(--bg-card)', padding: '12px', borderRadius: '8px', border: '1px solid var(--border)' }}>
                        <div style={{ fontSize: '24px', fontWeight: 800, color: arc.color }}>{arc.count}</div>
                        <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-2)' }}>{arc.label} Days</div>
                    </div>
                ))}
            </div>
            <div style={{ marginTop: '16px', fontSize: '12px', color: 'var(--text-3)', lineHeight: 1.5 }}>
                Your dominant archetype this period reveals a strong inclination toward <span style={{ color: 'var(--accent)', fontWeight: 700 }}>{archetypes.reduce((a, b) => a.count > b.count ? a : b).label}</span>.
            </div>
        </div>
    );
}

export default DayArchetypes;
