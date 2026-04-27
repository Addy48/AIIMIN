import React, { useState, useCallback, useRef, useEffect } from 'react';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000';

export default function ReactionTest({ onComplete }) {
    const [phase, setPhase] = useState('ready'); // ready | waiting | green | done
    const [trials, setTrials] = useState([]);
    const [startTime, setStartTime] = useState(null);
    const [saving, setSaving] = useState(false);
    const [result, setResult] = useState(null);
    const timeoutRef = useRef(null);
    const trialNum = trials.length + 1;

    const startTrial = useCallback(() => {
        setPhase('waiting');
        const delay = 1500 + Math.random() * 3000; // 1.5–4.5s random delay
        timeoutRef.current = setTimeout(() => {
            setPhase('green');
            setStartTime(Date.now());
        }, delay);
    }, []);

    const handleClick = useCallback(() => {
        if (phase === 'waiting') {
            // Clicked too early
            clearTimeout(timeoutRef.current);
            setPhase('ready');
            return;
        }
        if (phase === 'green') {
            const reactionMs = Date.now() - startTime;
            const newTrials = [...trials, reactionMs];
            setTrials(newTrials);
            if (newTrials.length >= 5) {
                setPhase('done');
            } else {
                setPhase('ready');
            }
        }
        if (phase === 'ready' && trials.length < 5) {
            startTrial();
        }
    }, [phase, startTime, trials, startTrial]);

    useEffect(() => {
        return () => clearTimeout(timeoutRef.current);
    }, []);

    const meanMs = trials.length > 0 ? Math.round(trials.reduce((a, b) => a + b, 0) / trials.length) : null;

    const handleSave = async () => {
        setSaving(true);
        try {
            const token = localStorage.getItem('access_token');
            const res = await fetch(`${API_BASE}/lab/practice/reaction`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
                body: JSON.stringify({ trial_ms: trials }),
            });
            const data = await res.json();
            setResult(data);
            onComplete?.(data);
        } catch (err) {
            console.error('[ReactionTest] Save error:', err);
        } finally {
            setSaving(false);
        }
    };

    const bgColor = phase === 'waiting' ? 'var(--color-alert-red)' :
        phase === 'green' ? 'var(--color-success)' :
            'var(--color-elevated)';

    return (
        <div className="lab-metric-card" style={{ padding: 'var(--space-5)' }}>
            <div className="lab-metric-header">
                <span className="lab-metric-title">Reaction Time</span>
                <span style={{ font: 'var(--text-label)', color: 'var(--color-text-3)' }}>
                    {trials.length}/5 trials
                </span>
            </div>

            {phase !== 'done' ? (
                <div
                    onClick={handleClick}
                    style={{
                        background: bgColor, borderRadius: 'var(--r-md)',
                        minHeight: '160px', display: 'flex', alignItems: 'center',
                        justifyContent: 'center', cursor: 'pointer',
                        transition: 'background 0.15s ease',
                        userSelect: 'none', marginTop: 'var(--space-3)',
                    }}
                >
                    <span style={{ font: '300 18px/1.4 var(--font-sans)', color: 'white', textAlign: 'center', padding: 'var(--space-4)' }}>
                        {phase === 'ready' && (trials.length === 0 ? 'Tap to start' : `Trial ${trialNum} — Tap to start`)}
                        {phase === 'waiting' && 'Wait for green...'}
                        {phase === 'green' && 'TAP NOW!'}
                    </span>
                </div>
            ) : (
                <div style={{ textAlign: 'center', padding: 'var(--space-4) 0' }}>
                    <div style={{ font: '300 36px/1 var(--font-sans)', color: 'var(--color-hero)', marginBottom: 'var(--space-2)' }}>
                        {result?.mean_ms || meanMs} MS
                    </div>
                    <div style={{ font: 'var(--text-label)', color: 'var(--color-text-3)', marginBottom: 'var(--space-3)' }}>
                        MEAN REACTION TIME
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-4)' }}>
                        {trials.map((t, i) => (
                            <span key={i} style={{ font: '400 12px var(--font-mono)', color: 'var(--color-text-2)', background: 'var(--color-elevated)', borderRadius: 'var(--r-sm)', padding: '4px 8px' }}>
                                {t}ms
                            </span>
                        ))}
                    </div>
                    {result ? (
                        <p style={{ font: 'var(--text-subtext)', color: 'var(--color-accent)' }}>
                            Saved. {result.mastery_change ? `🏅 ${result.mastery_change.toUpperCase()} earned!` : `${result.streak_days} day streak.`}
                        </p>
                    ) : (
                        <div style={{ display: 'flex', gap: 'var(--space-3)', justifyContent: 'center' }}>
                            <button onClick={handleSave} disabled={saving} className="lab-retry-btn">
                                {saving ? 'Saving...' : 'Save Result'}
                            </button>
                            <button onClick={() => { setPhase('ready'); setTrials([]); setResult(null); }}
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
