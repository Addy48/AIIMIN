import React, { useMemo } from 'react';

const NUDGE_POOL = {
    sleep: [
        'You slept under 7h most days this week. Try moving your bedtime 30 min earlier tonight.',
        'Your sleep average is low. Consistent sleep time matters more than duration — pick a fixed bedtime.',
    ],
    gym: [
        'Only hit the gym a couple days this week. One session today flips the week.',
        'Gym frequency is your weakest signal. Even a 20-minute session resets momentum.',
    ],
    steps: [
        'Steps average is low. A 10-minute walk after every meal adds up to 5k+ easily.',
        'Try taking calls while walking. It\'s the easiest way to hit step targets without "working out".',
    ],
    water: [
        'Hydration is below target. Keep a filled bottle visible — out of sight means out of mind.',
        'Start the morning with 2 glasses immediately. It removes the catch-up throughout the day.',
    ],
    learning: [
        'You haven\'t logged learning much recently. Even 10 pages or 15 minutes of a course counts.',
        'Your learning rate is low. Pick one topic and commit to 15 min before going online.',
    ],
    journal: [
        'Journal rate is low this week. Two sentences counts. Just open it and write one thing.',
        'Not journaling consistently. Try: write one sentence immediately after dinner. That\'s it.',
    ],
    breakfast: [
        'Skipping breakfast most days. Prep something simple the night before — fruit, eggs, anything.',
        'Breakfast rate is low. Starting the day fuelled sets your energy and mood baseline.',
    ],
    mood: [
        'Mood has been low recently. What\'s one thing that genuinely lifts you? Do that today.',
        'Low mood pattern detected. A single gym session statistically improves mood by ~20% that day.',
    ],
};

function getWeakest(logs7) {
    if (!logs7 || !logs7.length) return null;
    const N = logs7.length;

    const scores = {
        sleep:     { rate: logs7.filter(l => (l.sleep_hours || 0) >= 7).length / N },
        gym:       { rate: logs7.filter(l => l.gym_done).length / N },
        steps:     { rate: logs7.filter(l => (l.steps || 0) >= 7000).length / N },
        water:     { rate: logs7.filter(l => (l.water_bottles || 0) >= 3).length / N },
        learning:  { rate: logs7.filter(l => l.learning_done).length / N },
        journal:   { rate: logs7.filter(l => l.journal_entry?.trim()).length / N },
        breakfast: { rate: logs7.filter(l => l.breakfast_done).length / N },
        mood:      { rate: logs7.filter(l => (l.mood || 0) >= 7).length / N },
    };

    let weakest = null, lowestRate = 2;
    for (const [key, val] of Object.entries(scores)) {
        if (val.rate < lowestRate) { lowestRate = val.rate; weakest = key; }
    }
    return weakest;
}

const METRIC_EMOJI = { sleep: '😴', gym: '💪', steps: '👟', water: '💧', learning: '📚', journal: '✍️', breakfast: '🍳', mood: '😊' };

const OneBetterNudge = ({ recentLogs = [] }) => {
    const logs7 = recentLogs.slice(0, 7);
    const weakest = useMemo(() => getWeakest(logs7), [logs7.length]); // eslint-disable-line

    if (!weakest || !logs7.length) return null;

    const pool = NUDGE_POOL[weakest] || [];
    const nudge = pool[new Date().getDate() % pool.length] || '';

    return (
        <div style={{
            display: 'flex', alignItems: 'flex-start', gap: '14px',
            padding: '16px 18px',
            background: 'linear-gradient(90deg, rgba(245,158,11,0.07), var(--bg-elevated))',
            border: '1px solid rgba(245,158,11,0.25)',
            borderLeft: '3px solid var(--accent)',
            borderRadius: '12px',
        }}>
            <span style={{ fontSize: '24px', flexShrink: 0 }}>{METRIC_EMOJI[weakest]}</span>
            <div>
                <div style={{ fontSize: '10px', fontWeight: 700, color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '5px' }}>
                    1% Better Today
                </div>
                <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-1)', lineHeight: 1.55 }}>
                    {nudge}
                </div>
                <div style={{ fontSize: '10px', color: 'var(--text-3)', marginTop: '5px' }}>
                    Weakest area this week: <span style={{ color: 'var(--text-2)', fontWeight: 600 }}>{weakest}</span>
                </div>
            </div>
        </div>
    );
};

export default OneBetterNudge;
