import React, { useState } from 'react';

/* ── Card wrapper ─────────────────────────────────────── */
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

/* ═══════════════════════════════════════════════════════
   Skills — typing, reaction time, decision scenarios
═══════════════════════════════════════════════════════ */
const SENTENCES = [
    'The only way to do great work is to love what you do.',
    'Build slowly and trust the process.',
    'Stay curious. Keep shipping. Earn the reps.',
    'Small inputs compounded over time create large outputs.',
];

const TypingTest = () => {
    const [active, setActive] = useState(false);
    const [text, setText] = useState('');
    const [start, setStart] = useState(null);
    const [wpm, setWpm] = useState(null);
    const [acc, setAcc] = useState(null);
    const idx = Math.floor(Date.now() / 86400000) % SENTENCES.length;
    const target = SENTENCES[idx];

    const handleChange = (e) => {
        const val = e.target.value;
        if (!active && val.length === 1) { setActive(true); setStart(Date.now()); }
        setText(val);
        if (val === target) {
            const mins = (Date.now() - start) / 60000;
            const words = target.split(' ').length;
            const correct = val.split('').filter((c, i) => c === target[i]).length;
            setWpm(Math.round(words / mins));
            setAcc(Math.round((correct / target.length) * 100));
            setActive(false);
        }
    };

    const reset = () => { setText(''); setWpm(null); setAcc(null); setActive(false); setStart(null); };

    return (
        <Card>
            <Label>Typing Speed</Label>
            <p style={{ font: '400 16px/1.7 var(--font-sans)', color: 'var(--color-text-1)', marginBottom: '16px', letterSpacing: '-0.01em' }}>
                {target.split('').map((char, i) => {
                    let color = 'var(--color-text-3)';
                    if (i < text.length) color = text[i] === char ? 'var(--color-accent)' : 'var(--color-alert-red)';
                    return <span key={i} style={{ color }}>{char}</span>;
                })}
            </p>
            {wpm !== null ? (
                <div style={{ display: 'flex', gap: '24px', marginBottom: '16px' }}>
                    <div>
                        <div style={{ font: '300 36px/1 var(--font-sans)', color: 'var(--color-text-1)' }}>{wpm}</div>
                        <div style={{ font: '400 11px/1 var(--font-sans)', color: 'var(--color-text-3)', marginTop: '4px' }}>WPM</div>
                    </div>
                    <div>
                        <div style={{ font: '300 36px/1 var(--font-sans)', color: 'var(--color-text-1)' }}>{acc}%</div>
                        <div style={{ font: '400 11px/1 var(--font-sans)', color: 'var(--color-text-3)', marginTop: '4px' }}>Accuracy</div>
                    </div>
                </div>
            ) : (
                <textarea
                    value={text}
                    onChange={handleChange}
                    placeholder="Start typing here..."
                    rows={3}
                    style={{
                        width: '100%',
                        background: 'var(--color-elevated)',
                        border: '1px solid var(--color-border)',
                        borderRadius: '10px',
                        color: 'var(--color-text-1)',
                        fontFamily: 'var(--font-sans)',
                        fontSize: '14px',
                        padding: '12px',
                        resize: 'none',
                        outline: 'none',
                        marginBottom: '12px',
                        boxSizing: 'border-box',
                    }}
                    onFocus={e => e.target.style.borderColor = 'var(--color-accent)'}
                    onBlur={e => e.target.style.borderColor = 'var(--color-border)'}
                />
            )}
            <button onClick={reset} style={{
                padding: '8px 20px',
                background: 'var(--color-accent)',
                color: '#fff',
                border: 'none',
                borderRadius: '8px',
                font: '400 13px/1 var(--font-sans)',
                cursor: 'pointer',
            }}>
                {wpm !== null ? 'Try Again' : 'Reset'}
            </button>
        </Card>
    );
};

const ReactionTest = () => {
    const [state, setState] = useState('idle'); // idle | waiting | ready | done
    const [ms, setMs] = useState(null);
    const [startTs, setStartTs] = useState(null);

    const begin = () => {
        setState('waiting');
        const delay = 1500 + Math.random() * 2500;
        setTimeout(() => {
            setState('ready');
            setStartTs(Date.now());
        }, delay);
    };

    const tap = () => {
        if (state === 'ready') {
            setMs(Date.now() - startTs);
            setState('done');
        } else if (state === 'waiting') {
            setState('idle'); // too early
        }
    };

    const reset = () => { setState('idle'); setMs(null); setStartTs(null); };

    const bgColor = state === 'ready' ? 'rgba(90,158,114,0.18)' : state === 'waiting' ? 'rgba(212,168,67,0.1)' : 'var(--color-elevated)';

    return (
        <Card>
            <Label>Reaction Time</Label>
            <div
                onClick={state === 'idle' ? begin : tap}
                style={{
                    height: '160px',
                    borderRadius: '12px',
                    background: bgColor,
                    border: `1px solid ${state === 'ready' ? 'var(--color-accent)' : 'var(--color-border)'}`,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    transition: 'all 200ms ease',
                    userSelect: 'none',
                    marginBottom: '12px',
                }}
            >
                <span style={{ font: '400 14px/1 var(--font-sans)', color: 'var(--color-text-2)' }}>
                    {state === 'idle' && 'Tap to start'}
                    {state === 'waiting' && 'Wait for green...'}
                    {state === 'ready' && '⚡ Tap now!'}
                    {state === 'done' && `${ms} ms`}
                </span>
                {state === 'done' && ms && (
                    <span style={{ font: '400 12px/1 var(--font-sans)', color: 'var(--color-text-3)', marginTop: '8px' }}>
                        {ms < 200 ? '🔥 Excellent' : ms < 300 ? '✓ Good' : 'Keep training'}
                    </span>
                )}
            </div>
            {state === 'done' && (
                <button onClick={reset} style={{ padding: '8px 20px', background: 'var(--color-accent)', color: '#fff', border: 'none', borderRadius: '8px', font: '400 13px/1 var(--font-sans)', cursor: 'pointer' }}>
                    Try Again
                </button>
            )}
        </Card>
    );
};

const DECISIONS = [
    { q: 'You have 2 hrs free. What matters most?', opts: ['Study DSA', 'Build a side project', 'Rest and recover', 'Social media catch-up'] },
    { q: 'Feature is 80% done but deadline is tomorrow. What do you do?', opts: ['Ship the 80%', 'Pull an all-nighter', 'Ask for extension', 'Cut scope further'] },
    { q: 'You feel mentally drained. Best next action?', opts: ['Push through', '20-min walk', 'Power nap', 'Switch task type'] },
];

const DecisionCard = () => {
    const [chosen, setChosen] = useState(null);
    const [idx, setIdx] = useState(0);
    const d = DECISIONS[idx % DECISIONS.length];

    const pick = (i) => { setChosen(i); };
    const next = () => { setChosen(null); setIdx(p => p + 1); };

    return (
        <Card>
            <Label>Decision Scenarios</Label>
            <p style={{ font: '400 15px/1.5 var(--font-sans)', color: 'var(--color-text-1)', marginBottom: '20px' }}>
                {d.q}
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '16px' }}>
                {d.opts.map((opt, i) => (
                    <button
                        key={i}
                        onClick={() => pick(i)}
                        style={{
                            padding: '12px',
                            textAlign: 'left',
                            font: '400 13px/1.4 var(--font-sans)',
                            color: chosen === i ? '#fff' : 'var(--color-text-1)',
                            background: chosen === i ? 'var(--color-accent)' : 'var(--color-elevated)',
                            border: `1px solid ${chosen === i ? 'var(--color-accent)' : 'var(--color-border)'}`,
                            borderRadius: '10px',
                            cursor: 'pointer',
                            transition: 'all 150ms ease',
                        }}
                    >
                        {opt}
                    </button>
                ))}
            </div>
            {chosen !== null && (
                <button onClick={next} style={{ padding: '8px 20px', background: 'var(--color-accent)', color: '#fff', border: 'none', borderRadius: '8px', font: '400 13px/1 var(--font-sans)', cursor: 'pointer' }}>
                    Next Scenario →
                </button>
            )}
        </Card>
    );
};

const Skills = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div style={{ paddingBottom: '4px' }}>
            <div style={{ font: '400 13px/1 var(--font-sans)', color: 'var(--color-text-2)', marginBottom: '8px' }}>
                Mental performance
            </div>
            <h1 style={{ font: '500 clamp(28px,3.5vw,44px)/1.1 var(--font-sans)', color: 'var(--color-text-1)', letterSpacing: '-0.02em' }}>
                Skills
            </h1>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <TypingTest />
            <ReactionTest />
        </div>
        <DecisionCard />
    </div>
);

export default Skills;
