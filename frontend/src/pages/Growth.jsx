import React from 'react';

const Card = ({ children, style = {} }) => (
    <div style={{
        background: 'var(--color-surface)',
        border: '1px solid var(--color-border)',
        borderRadius: '14px',
        padding: '24px',
        ...style,
    }}>
        {children}
    </div>
);

const Label = ({ children }) => (
    <span style={{
        font: '500 10px/1 var(--font-mono)',
        color: 'var(--color-text-2)',
        letterSpacing: '0.1em',
        textTransform: 'uppercase',
        display: 'block',
        marginBottom: '16px',
    }}>
        {children}
    </span>
);

/* ── Mastery badges ─────────────────────────────────────── */
const BADGES = [
    { emoji: '🧠', label: 'DSA Grinder', desc: 'Solve 50 problems', done: false },
    { emoji: '⚡', label: 'Speed Typer', desc: 'Type 60+ WPM', done: false },
    { emoji: '💪', label: 'Iron Habit', desc: '7-day gym streak', done: false },
    { emoji: '🌅', label: 'Early Riser', desc: '5 days before 6am', done: false },
    { emoji: '📚', label: 'Daily Learner', desc: 'Log learning 10 days', done: false },
    { emoji: '🔥', label: 'On Fire', desc: '30-day streak', done: false },
    { emoji: '💧', label: 'Hydrated', desc: '3 bottles 7 days', done: false },
    { emoji: '🧘', label: 'Clear Mind', desc: 'Log mood 14 days', done: false },
];

/* ── Correlation heatmap (7-day activity) ───────────────── */
const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const METRICS = ['Sleep', 'Gym', 'Water', 'Steps', 'Learning'];

const mockHeat = () => METRICS.map(() => DAYS.map(() => Math.random()));

const HeatCell = ({ val }) => {
    const opacity = 0.1 + val * 0.9;
    return (
        <div style={{
            width: '36px',
            height: '28px',
            borderRadius: '5px',
            background: `rgba(90,158,114,${opacity})`,
            transition: 'background 300ms ease',
        }} />
    );
};

/* ── Weekly consistency bars ────────────────────────────── */
const ConsistencyBar = ({ label, pct, color }) => (
    <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
            <span style={{ font: '400 13px/1 var(--font-sans)', color: 'var(--color-text-1)' }}>{label}</span>
            <span style={{ font: '400 12px/1 var(--font-mono)', color: 'var(--color-text-2)' }}>{pct}%</span>
        </div>
        <div style={{ height: '3px', background: 'var(--color-border)', borderRadius: '3px' }}>
            <div style={{ height: '100%', width: `${pct}%`, background: color || 'var(--color-accent)', borderRadius: '3px', transition: 'width 800ms ease' }} />
        </div>
    </div>
);

/* ═══════════════════════════════════════════════════════
   Growth page
═══════════════════════════════════════════════════════ */
const heat = mockHeat();

const Growth = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

        {/* Header */}
        <div style={{ paddingBottom: '4px' }}>
            <div style={{ font: '400 13px/1 var(--font-sans)', color: 'var(--color-text-2)', marginBottom: '8px' }}>
                Long-run patterns
            </div>
            <h1 style={{ font: '500 clamp(28px,3.5vw,44px)/1.1 var(--font-sans)', color: 'var(--color-text-1)', letterSpacing: '-0.02em' }}>
                Growth
            </h1>
        </div>

        {/* Mastery badges */}
        <Card>
            <Label>Mastery Badges</Label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
                {BADGES.map(b => (
                    <div key={b.label} style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '16px 8px',
                        background: b.done ? 'var(--color-accent-dim)' : 'var(--color-elevated)',
                        border: `1px solid ${b.done ? 'var(--color-accent)' : 'var(--color-border)'}`,
                        borderRadius: '12px',
                        opacity: b.done ? 1 : 0.5,
                        textAlign: 'center',
                    }}>
                        <span style={{ fontSize: '22px' }}>{b.emoji}</span>
                        <span style={{ font: '500 11px/1.2 var(--font-sans)', color: 'var(--color-text-1)' }}>{b.label}</span>
                        <span style={{ font: '400 10px/1.3 var(--font-sans)', color: 'var(--color-text-3)' }}>{b.desc}</span>
                    </div>
                ))}
            </div>
        </Card>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>

            {/* Heatmap */}
            <Card>
                <Label>7-Day Correlation</Label>
                <div style={{ display: 'flex', gap: '8px', marginBottom: '6px' }}>
                    <div style={{ width: '60px' }} />
                    {DAYS.map(d => (
                        <div key={d} style={{ width: '36px', font: '400 10px/1 var(--font-mono)', color: 'var(--color-text-3)', textAlign: 'center' }}>{d}</div>
                    ))}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    {METRICS.map((m, mi) => (
                        <div key={m} style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                            <div style={{ width: '60px', font: '400 11px/1 var(--font-sans)', color: 'var(--color-text-2)', flexShrink: 0 }}>{m}</div>
                            {heat[mi].map((v, di) => <HeatCell key={di} val={v} />)}
                        </div>
                    ))}
                </div>
            </Card>

            {/* Consistency */}
            <Card>
                <Label>Weekly Consistency</Label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <ConsistencyBar label="Gym" pct={71} color="var(--color-gym)" />
                    <ConsistencyBar label="Sleep 7h" pct={57} color="var(--color-sleep)" />
                    <ConsistencyBar label="Water 3L" pct={85} />
                    <ConsistencyBar label="Learning" pct={43} color="var(--color-steps)" />
                    <ConsistencyBar label="DSA" pct={28} color="var(--color-warning)" />
                </div>
            </Card>
        </div>

        {/* Coming soon note */}
        <div style={{
            background: 'var(--color-sage-bg)',
            border: '1px solid rgba(0,0,0,0.05)',
            borderRadius: '12px',
            padding: '16px 20px',
            font: '400 13px/1.5 var(--font-sans)',
            color: 'var(--color-sage-text)',
        }}>
            📈 Trend lines, streak history, and correlated score analysis coming soon as you log more data.
        </div>
    </div>
);

export default Growth;
