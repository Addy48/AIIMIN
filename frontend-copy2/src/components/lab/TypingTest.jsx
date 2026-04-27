import React, { useState, useEffect, useRef, useCallback } from 'react';

const SAMPLE_TEXTS = [
    "The mind is not a vessel to be filled, but a fire to be kindled. Every small discipline compounds into something greater than the sum of its parts.",
    "Clarity comes from engagement, not from thought. The person who waits for perfect conditions will never begin. Start before you are ready.",
    "Discipline is choosing between what you want now and what you want most. The gap between knowing and doing is where character lives.",
    "Your habits are the architecture of your daily life. Each routine is a brick, each decision is mortar. Build with intention.",
    "Focus is not about saying yes to the right thing. It is about saying no to the hundred other good ideas. Guard your attention fiercely.",
];

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000';

export default function TypingTest({ onComplete }) {
    const [phase, setPhase] = useState('ready'); // ready | running | done
    const [text] = useState(() => SAMPLE_TEXTS[Math.floor(Math.random() * SAMPLE_TEXTS.length)]);
    const [input, setInput] = useState('');
    const [timeLeft, setTimeLeft] = useState(60);
    const [wpm, setWpm] = useState(null);
    const [accuracy, setAccuracy] = useState(null);
    const [saving, setSaving] = useState(false);
    const [result, setResult] = useState(null);
    const inputRef = useRef(null);
    const timerRef = useRef(null);

    const startTest = useCallback(() => {
        setPhase('running');
        setInput('');
        setTimeLeft(60);
        setTimeout(() => inputRef.current?.focus(), 100);
    }, []);

    useEffect(() => {
        if (phase !== 'running') return;
        timerRef.current = setInterval(() => {
            setTimeLeft(t => {
                if (t <= 1) {
                    clearInterval(timerRef.current);
                    setPhase('done');
                    return 0;
                }
                return t - 1;
            });
        }, 1000);
        return () => clearInterval(timerRef.current);
    }, [phase]);

    useEffect(() => {
        if (phase !== 'done') return;
        // Calculate WPM and accuracy
        const words = input.trim().split(/\s+/).filter(Boolean);
        const wordCount = words.length;
        const elapsed = 60 - timeLeft || 60;
        const calcWpm = Math.round((wordCount / elapsed) * 60);

        const textChars = text.slice(0, input.length).split('');
        const inputChars = input.split('');
        let correct = 0;
        inputChars.forEach((c, i) => { if (c === textChars[i]) correct++; });
        const calcAccuracy = inputChars.length > 0 ? (correct / inputChars.length) * 100 : 0;

        setWpm(calcWpm);
        setAccuracy(Number(calcAccuracy.toFixed(1)));
    }, [phase, input, text, timeLeft]);

    const handleSave = async () => {
        setSaving(true);
        try {
            const token = localStorage.getItem('access_token');
            const res = await fetch(`${API_BASE}/lab/practice/typing`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
                body: JSON.stringify({ wpm, accuracy_pct: accuracy, duration_sec: 60 }),
            });
            const data = await res.json();
            setResult(data);
            onComplete?.(data);
        } catch (err) {
            console.error('[TypingTest] Save error:', err);
        } finally {
            setSaving(false);
        }
    };

    const getCharClass = (i) => {
        if (i >= input.length) return 'tt-char-pending';
        return input[i] === text[i] ? 'tt-char-correct' : 'tt-char-wrong';
    };

    return (
        <div className="lab-metric-card" style={{ padding: 'var(--space-5)' }}>
            <div className="lab-metric-header">
                <span className="lab-metric-title">Typing Test</span>
                {phase === 'running' && (
                    <span style={{ font: '500 16px var(--font-mono)', color: timeLeft <= 10 ? 'var(--color-alert-red)' : 'var(--color-text-2)' }}>
                        {timeLeft}s
                    </span>
                )}
            </div>

            {phase === 'ready' && (
                <div style={{ textAlign: 'center', padding: 'var(--space-5) 0' }}>
                    <p style={{ font: 'var(--text-body)', color: 'var(--color-text-2)', marginBottom: 'var(--space-4)' }}>
                        60-second test. Type the text as accurately as possible.
                    </p>
                    <button onClick={startTest} className="lab-retry-btn">Start Test</button>
                </div>
            )}

            {phase === 'running' && (
                <>
                    <div style={{
                        font: '300 15px/1.8 var(--font-sans)', color: 'var(--color-text-3)',
                        background: 'var(--color-elevated)', borderRadius: 'var(--r-sm)',
                        padding: 'var(--space-4)', marginBottom: 'var(--space-3)',
                        userSelect: 'none', letterSpacing: '0.02em',
                    }}>
                        {text.split('').map((ch, i) => (
                            <span key={i} className={getCharClass(i)}>{ch}</span>
                        ))}
                    </div>
                    <textarea
                        ref={inputRef}
                        value={input}
                        onChange={e => setInput(e.target.value)}
                        placeholder="Start typing here..."
                        autoFocus
                        style={{
                            width: '100%', minHeight: '80px', resize: 'none',
                            font: '400 15px/1.8 var(--font-sans)', color: 'var(--color-text-1)',
                            background: 'var(--color-surface)', border: '1px solid var(--color-border)',
                            borderRadius: 'var(--r-sm)', padding: 'var(--space-3)',
                            outline: 'none',
                        }}
                        onFocus={e => e.currentTarget.style.borderColor = 'var(--color-accent)'}
                        onBlur={e => e.currentTarget.style.borderColor = 'var(--color-border)'}
                    />
                </>
            )}

            {phase === 'done' && (
                <div style={{ textAlign: 'center', padding: 'var(--space-4) 0' }}>
                    <div style={{ display: 'flex', gap: 'var(--space-6)', justifyContent: 'center', marginBottom: 'var(--space-4)' }}>
                        <div>
                            <div style={{ font: '300 36px/1 var(--font-sans)', color: 'var(--color-hero)' }}>{wpm}</div>
                            <div style={{ font: 'var(--text-label)', color: 'var(--color-text-3)', marginTop: '4px' }}>WPM</div>
                        </div>
                        <div>
                            <div style={{ font: '300 36px/1 var(--font-sans)', color: accuracy >= 95 ? 'var(--color-success)' : 'var(--color-warning)' }}>{accuracy}%</div>
                            <div style={{ font: 'var(--text-label)', color: 'var(--color-text-3)', marginTop: '4px' }}>ACCURACY</div>
                        </div>
                    </div>
                    {accuracy < 95 && (
                        <p style={{ font: 'var(--text-subtext)', color: 'var(--color-warning)', marginBottom: 'var(--space-3)' }}>
                            Below 95% accuracy — test marked as invalid for ranking.
                        </p>
                    )}
                    {result ? (
                        <p style={{ font: 'var(--text-subtext)', color: 'var(--color-accent)' }}>
                            Saved. {result.mastery_change ? `🏅 ${result.mastery_change.toUpperCase()} earned!` : `${result.streak_days} day streak.`}
                        </p>
                    ) : (
                        <div style={{ display: 'flex', gap: 'var(--space-3)', justifyContent: 'center' }}>
                            <button onClick={handleSave} disabled={saving} className="lab-retry-btn">
                                {saving ? 'Saving...' : 'Save Result'}
                            </button>
                            <button onClick={() => { setPhase('ready'); setInput(''); setResult(null); }}
                                style={{ background: 'none', border: '1px solid var(--color-border)', borderRadius: 'var(--r-sm)', padding: 'var(--space-2) var(--space-4)', color: 'var(--color-text-2)', cursor: 'pointer', font: 'var(--text-label)' }}>
                                Retry
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
