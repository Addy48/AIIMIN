import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const COMMON_WORDS = [
    "the", "be", "to", "of", "and", "a", "in", "that", "have", "i", "it", "for", "not", "on", "with", "he", "as", "you", "do", "at", 
    "this", "but", "his", "by", "from", "they", "we", "say", "her", "she", "or", "an", "will", "my", "one", "all", "would", "there", "their", "what",
    "so", "up", "out", "if", "about", "who", "get", "which", "go", "me", "when", "make", "can", "like", "time", "no", "just", "him", "know", "take",
    "people", "into", "year", "your", "good", "some", "could", "them", "see", "other", "than", "then", "now", "look", "only", "come", "its", "over", "think", "also",
    "back", "after", "use", "two", "how", "our", "work", "first", "well", "way", "even", "new", "want", "because", "any", "these", "give", "day", "most", "us"
];

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5001';

const generateWords = (count = 100) => {
    let result = [];
    for (let i = 0; i < count; i++) {
        result.push(COMMON_WORDS[Math.floor(Math.random() * COMMON_WORDS.length)]);
    }
    return result.join(' ');
};

export default function TypingTest({ onComplete }) {
    const [phase, setPhase] = useState('ready'); // ready | running | done
    const [config, setConfig] = useState({ time: 30 }); // 15 | 30 | 60
    const [text, setText] = useState('');
    const [input, setInput] = useState('');
    const [timeLeft, setTimeLeft] = useState(30);
    const [wpm, setWpm] = useState(0);
    const [accuracy, setAccuracy] = useState(100);
    const [isFocused, setIsFocused] = useState(true);
    const [saving, setSaving] = useState(false);
    const [result, setResult] = useState(null);

    const inputRef = useRef(null);
    const timerRef = useRef(null);
    const startTimeRef = useRef(null);

    const resetTest = useCallback(() => {
        setText(generateWords(80));
        setPhase('ready');
        setInput('');
        setTimeLeft(config.time);
        setWpm(0);
        setAccuracy(100);
        setResult(null);
        startTimeRef.current = null;
        if (timerRef.current) clearInterval(timerRef.current);
    }, [config.time]);

    useEffect(() => {
        resetTest();
    }, [resetTest]);

    const startTest = useCallback(() => {
        setPhase('running');
        setInput('');
        setTimeLeft(config.time);
        startTimeRef.current = Date.now();
        setTimeout(() => inputRef.current?.focus(), 10);
    }, [config.time]);

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
        if (phase === 'ready') {
            startTest();
        }
        if (phase !== 'running' && phase !== 'ready') return;

        setInput(val);

        // Calculate Stats
        const correctChars = val.split('').filter((c, i) => c === text[i]).length;
        const calcAccuracy = val.length > 0 ? (correctChars / val.length) * 100 : 100;
        setAccuracy(Math.round(calcAccuracy));

        const elapsedSeconds = (Date.now() - startTimeRef.current) / 1000;
        if (elapsedSeconds > 0) {
            // WPM formula: (chars / 5) / (seconds / 60)
            const currentWpm = Math.round((correctChars / 5) / (elapsedSeconds / 60));
            setWpm(currentWpm);
        }

        if (val.length >= text.length) {
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
                body: JSON.stringify({ wpm, accuracy_pct: accuracy, duration_sec: config.time - timeLeft }),
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
    const errorColor = '#ca4754';

    return (
        <div style={{ padding: '20px', maxWidth: '900px', margin: '0 auto' }}>
            {/* Monkeytype Style Toolbar */}
            {phase !== 'done' && (
                <div style={{ 
                    display: 'flex', 
                    justifyContent: 'center', 
                    gap: '24px', 
                    marginBottom: '40px',
                    background: 'rgba(0,0,0,0.03)',
                    padding: '8px 24px',
                    borderRadius: '12px',
                    width: 'fit-content',
                    margin: '0 auto 40px'
                }}>
                    <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                        {[15, 30, 60].map(t => (
                            <button
                                key={t}
                                onClick={() => setConfig({ ...config, time: t })}
                                style={{
                                    background: 'none',
                                    border: 'none',
                                    color: config.time === t ? accent : text3,
                                    fontSize: '12px',
                                    fontWeight: 700,
                                    cursor: 'pointer',
                                    transition: 'color 0.2s'
                                }}
                            >
                                {t}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            <div style={{ position: 'relative' }}>
                <AnimatePresence mode="wait">
                    {phase === 'done' ? (
                        <motion.div
                            key="done"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            style={{ textAlign: 'center', padding: '40px 0' }}
                        >
                            <div style={{ display: 'flex', justifyContent: 'center', gap: '60px', marginBottom: '40px' }}>
                                <div>
                                    <div style={{ fontSize: '14px', color: text3, marginBottom: '8px' }}>wpm</div>
                                    <div style={{ fontSize: '64px', fontWeight: 800, color: accent, lineHeight: 1 }}>{wpm}</div>
                                </div>
                                <div>
                                    <div style={{ fontSize: '14px', color: text3, marginBottom: '8px' }}>acc</div>
                                    <div style={{ fontSize: '64px', fontWeight: 800, color: accent, lineHeight: 1 }}>{accuracy}%</div>
                                </div>
                            </div>
                            
                            <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
                                <button onClick={handleSave} disabled={saving} className="lab-retry-btn" style={{ padding: '14px 32px' }}>
                                    {saving ? 'Saving...' : 'Sync Session'}
                                </button>
                                <button onClick={resetTest} style={{ 
                                    background: 'none', 
                                    border: '1px solid var(--color-border)', 
                                    padding: '14px 32px', 
                                    borderRadius: '12px', 
                                    color: text2, 
                                    fontWeight: 600,
                                    cursor: 'pointer'
                                }}>
                                    Restart
                                </button>
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="test"
                            style={{ 
                                position: 'relative', 
                                cursor: 'text',
                                filter: isFocused ? 'none' : 'blur(4px)',
                                transition: 'filter 0.3s ease'
                            }}
                            onClick={() => inputRef.current?.focus()}
                        >
                            <input
                                ref={inputRef}
                                type="text"
                                value={input}
                                onChange={handleInput}
                                onFocus={() => setIsFocused(true)}
                                onBlur={() => setIsFocused(false)}
                                style={{ position: 'absolute', opacity: 0, pointerEvents: 'none' }}
                                autoFocus
                            />

                            {/* Live Timer (Monkeytype style) */}
                            <div style={{ 
                                position: 'absolute', 
                                top: '-30px', 
                                left: '0', 
                                fontSize: '24px', 
                                fontWeight: 700, 
                                color: accent,
                                opacity: phase === 'running' ? 1 : 0,
                                transition: 'opacity 0.3s'
                            }}>
                                {timeLeft}
                            </div>

                            <div style={{ 
                                fontSize: '24px', 
                                lineHeight: '1.5', 
                                fontFamily: 'var(--font-mono)', 
                                color: text3, 
                                whiteSpace: 'pre-wrap',
                                letterSpacing: '0.02em',
                                wordBreak: 'break-word',
                                textAlign: 'left'
                            }}>
                                {text.split('').map((char, i) => {
                                    let color = text3;
                                    if (i < input.length) {
                                        color = input[i] === char ? text1 : errorColor;
                                    }
                                    
                                    const isCurrent = i === input.length;

                                    return (
                                        <span key={i} style={{ 
                                            color, 
                                            position: 'relative',
                                            transition: 'color 0.1s'
                                        }}>
                                            {isCurrent && phase !== 'done' && (
                                                <motion.div
                                                    layoutId="caret"
                                                    style={{
                                                        position: 'absolute',
                                                        left: '-1px',
                                                        top: '15%',
                                                        width: '2px',
                                                        height: '70%',
                                                        background: accent,
                                                        boxShadow: `0 0 10px ${accent}`
                                                    }}
                                                    animate={{ opacity: [1, 0, 1] }}
                                                    transition={{ repeat: Infinity, duration: 0.8 }}
                                                />
                                            )}
                                            {char}
                                        </span>
                                    );
                                })}
                            </div>

                            {!isFocused && phase === 'running' && (
                                <div style={{
                                    position: 'absolute',
                                    inset: 0,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    zIndex: 10,
                                    color: text2,
                                    fontWeight: 600,
                                    pointerEvents: 'none'
                                }}>
                                    Click here to resume focus
                                </div>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
