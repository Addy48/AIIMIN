import React from 'react';

const BehavioralReplay = ({ logs = [], bestDay = null }) => {
    let peakDay = bestDay || logs[0];
    let maxScore = -1;

    if (!bestDay) logs.forEach(l => {
        let score = 0;
        if (l.sleep_hours >= 7) score++;
        if (l.gym_done) score++;
        if (l.steps >= 10000) score++;
        if (l.learning_done) score++;
        if (l.mood >= 4) score++;
        if (score > maxScore) {
            maxScore = score;
            peakDay = l;
        }
    });

    if (!peakDay) return null;

    const dateStr = new Date(peakDay.date).toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' });

    const sequence = [
        { time: '07:00 AM', event: `Woke up recovered (${parseFloat(peakDay.sleep_hours).toFixed(1)}h sleep).`, color: 'var(--success)' },
        peakDay.gym_done ? { time: '08:30 AM', event: 'Executed physical training session.', color: 'var(--accent)' } : null,
        peakDay.learning_done ? { time: '11:00 AM', event: 'Completed deep learning module.', color: 'var(--gold)' } : null,
        { time: '05:00 PM', event: `Met movement baseline (${(peakDay.steps / 1000).toFixed(1)}k steps).`, color: 'var(--success)' },
        { time: '09:00 PM', event: `Ended day with high emotional resonance (Mood: ${peakDay.mood}/5).`, color: 'var(--accent)' }
    ].filter(Boolean);

    return (
        <div className="glass-panel-gold" style={{ padding: '24px', borderRadius: 'var(--r-lg)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
                <div style={{ fontSize: '12px', fontWeight: 800, color: 'var(--gold)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Behavioral Replay</div>
                <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-3)' }}>{dateStr}</div>
            </div>

            <div style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text-1)', marginBottom: '16px', letterSpacing: '-0.01em' }}>
                Deconstructing a Peak Day
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
                {sequence.map((seq, i) => (
                    <div key={i} style={{ display: 'flex', gap: '16px' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: '60px' }}>
                            <div style={{ fontSize: '10px', fontWeight: 700, color: 'var(--text-3)', marginBottom: '4px' }}>{seq.time}</div>
                            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: seq.color, zIndex: 2, boxShadow: `0 0 8px ${seq.color}40` }}></div>
                            {i !== sequence.length - 1 && <div style={{ width: '2px', flex: 1, background: 'var(--border-glass)', marginTop: '4px', marginBottom: '4px' }}></div>}
                        </div>
                        <div style={{ fontSize: '13px', color: 'var(--text-1)', paddingBottom: '20px', paddingTop: '2px' }}>
                            {seq.event}
                        </div>
                    </div>
                ))}
            </div>

            <button style={{ width: '100%', padding: '10px', background: 'var(--accent)', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 800, fontSize: '13px', cursor: 'pointer', boxShadow: '0 4px 15px rgba(212,175,55,0.3)', marginTop: '12px' }}>
                ▶ Replay Sequence
            </button>
        </div>
    );
};

export default BehavioralReplay;
