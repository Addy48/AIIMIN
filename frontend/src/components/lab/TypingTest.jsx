import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const SAMPLE_TEXTS = [
    "The mind is not a vessel to be filled, but a fire to be kindled. Every small discipline compounds into something greater than the sum of its parts.",
    "Clarity comes from engagement, not from thought. The person who waits for perfect conditions will never begin. Start before you are ready.",
    "Discipline is choosing between what you want now and what you want most. The gap between knowing and doing is where character lives.",
    "Your habits are the architecture of your daily life. Each routine is a brick, each decision is mortar. Build with intention.",
    "Focus is not about saying yes to the right thing. It is about saying no to the hundred other good ideas. Guard your attention fiercely.",
];

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5001';

export default function TypingTest({ onComplete }) {
    const [phase, setPhase] = useState('ready'); // ready | running | done
    const [text, setText] = useState('');
    const [input, setInput] = useState('');
    const [timeLeft, setTimeLeft] = useState(60);
    const [wpm, setWpm] = useState(0);
    const [accuracy, setAccuracy] = useState(100);
    const [saving, setSaving] = useState(false);
    const [result, setResult] = useState(null);
    const inputRef = useRef(null);
    const timerRef = useRef(null);
    const startTimeRef = useRef(null);

    const resetTest = useCallback(() => {
        setText(SAMPLE_TEXTS[Math.floor(Math.random() * SAMPLE_TEXTS.length)]);
        setPhase('ready');
        setInput('');
        setTimeLeft(60);
        setWpm(0);
        setAccuracy(100);
        setResult(null);
        startTimeRef.current = null;
    }, []);

    useEffect(() => {
        resetTest();
    }, [resetTest]);

    const startTest = useCallback(() => {
        setPhase('running');
        setInput('');
        setTimeLeft(60);
        startTimeRef.current = Date.now();
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

    const handleInput = (e) => {
        const val = e.target.value;
        if (phase !== 'running') return;

        setInput(val);

        // Calculate Accuracy
        const textChars = text.slice(0, val.length).split('');
        const inputChars = val.split('');
        let correct = 0;
        inputChars.forEach((c, i) => { if (c === textChars[i]) correct++; });
        const calcAccuracy = val.length > 0 ? (correct / val.length) * 100 : 100;
        setAccuracy(Number(calcAccuracy.toFixed(1)));

        // Calculate WPM
        const elapsed = (Date.now() - startTimeRef.current) / 60000;
        if (elapsed > 0) {
            setWpm(Math.round((val.length / 5) / elapsed));
        }

        if (val.length === text.length) {
            setPhase('done');
            clearInterval(timerRef.current);
        }
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            const token = localStorage.getItem('access_token');
            const res = await fetch(`${API_BASE}/lab/practice/typing`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
                body: JSON.stringify({ wpm, accuracy_pct: accuracy, duration_sec: 60 - timeLeft }),
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

    const text1 = 'var(--color-text-1)';
    const text2 = 'var(--color-text-2)';
    const text3 = 'var(--color-text-3)';
    const accent = 'var(--color-accent)';
    const border = 'var(--color-border)';

    return (
        <div style={{ padding: '24px' }}>
            {/* Header Metrics */}
            <div style={{ display: 'flex', gap: '40px', marginBottom: '40px', fontFamily: 'var(--font-mono)', alignItems: 'flex-end' }}>
                <div>
                    <div style={{ fontSize: '10px', color: text3, textTransform: 'uppercase', marginBottom: '4px', letterSpacing: '0.1em' }}>Time</div>
                    <div style={{ fontSize: '32px', fontWeight: 800, color: timeLeft <= 10 ? '#EF4444' : accent }}>{timeLeft}s</div>
                </div>
                <div>
                    <div style={{ fontSize: '10px', color: text3, textTransform: 'uppercase', marginBottom: '4px', letterSpacing: '0.1em' }}>WPM</div>
                    <div style={{ fontSize: '32px', fontWeight: 800, color: text1 }}>{wpm}</div>
                </div>
                <div>
                    <div style={{ fontSize: '10px', color: text3, textTransform: 'uppercase', marginBottom: '4px', letterSpacing: '0.1em' }}>Accuracy</div>
                    <div style={{ fontSize: '32px', fontWeight: 800, color: accuracy >= 95 ? '#10B981' : '#F59E0B' }}>{accuracy}%</div>
                </div>
                <button 
                    onClick={resetTest}
                    style={{ marginLeft: 'auto', background: 'none', border: 'none', color: text3, cursor: 'pointer', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}
                >
                    Restart
                </button>
            </div>

            {/* Test Area */}
            <div style={{ position: 'relative', minHeight: '180px' }}>
                <AnimatePresence mode="wait">
                    {phase === 'ready' ? (
                        <motion.div
                            key="ready"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            style={{ textAlign: 'center', padding: '40px 0' }}
                        >
                            <p style={{ color: text2, marginBottom: '24px', fontSize: '15px' }}>
                                A 60-second test to measure your focus and speed.
                            </p>
                            <button onClick={startTest} className="lab-retry-btn" style={{ padding: '12px 32px' }}>
                                Start Session
                            </button>
                        </motion.div>
                    ) : phase === 'running' ? (
                        <motion.div
                            key="running"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            style={{ position: 'relative' }}
                            onClick={() => inputRef.current?.focus()}
                        >
                            <input
                                ref={inputRef}
                                type="text"
                                value={input}
                                onChange={handleInput}
                                style={{ position: 'absolute', opacity: 0, pointerEvents: 'none' }}
                                autoFocus
                            />
                            <div style={{ 
                                fontSize: '24px', 
                                lineHeight: '1.6', 
                                fontFamily: 'var(--font-mono)', 
                                color: text3, 
                                whiteSpace: 'pre-wrap',
                                letterSpacing: '-0.01em'
                            }}>
                                {text.split('').map((char, i) => {
                                    let color = text3;
                                    let background = 'transparent';
                                    if (i < input.length) {
                                        if (input[i] === char) {
                                            color = text1;
                                        } else {
                                            color = '#EF4444';
                                            background = 'rgba(239, 68, 68, 0.1)';
                                        }
                                    }
                                    return (
                                        <span key={i} style={{ color, background, position: 'relative', borderRadius: '2px' }}>
                                            {i === input.length && (
                                                <motion.div
                                                    animate={{ opacity: [1, 0, 1] }}
                                                    transition={{ repeat: Infinity, duration: 1 }}
                                                    style={{
                                                        position: 'absolute', left: 0, top: '10%', width: '2px', height: '80%', background: accent
                                                    }}
                                                />
                                            )}
                                            {char}
                                        </span>
                                    );
                                })}
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="done"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            style={{ textAlign: 'center', padding: '20px 0' }}
                        >
                            <h3 style={{ fontSize: '24px', fontWeight: 800, color: text1, marginBottom: '8px' }}>Test Complete</h3>
                            <p style={{ color: text2, marginBottom: '32px' }}>
                                You achieved {wpm} WPM with {accuracy}% accuracy.
                            </p>
                            
                            {result ? (
                                <div style={{ padding: '20px', background: 'var(--color-surface)', borderRadius: '16px', border: `1px solid ${border}`, display: 'inline-block' }}>
                                    <span style={{ fontSize: '14px', color: accent, fontWeight: 700 }}>
                                        {result.mastery_change ? `🏅 ${result.mastery_change.toUpperCase()} earned!` : `Result synchronized.`}
                                    </span>
                                </div>
                            ) : (
                                <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
                                    <button onClick={handleSave} disabled={saving} className="lab-retry-btn">
                                        {saving ? 'Saving...' : 'Sync Result'}
                                    </button>
                                    <button 
                                        onClick={resetTest}
                                        style={{ background: 'none', border: `1px solid ${border}`, padding: '12px 24px', borderRadius: '12px', color: text2, cursor: 'pointer', fontWeight: 600 }}
                                    >
                                        Try Again
                                    </button>
                                </div>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
