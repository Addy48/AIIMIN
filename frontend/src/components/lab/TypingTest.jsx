import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RefreshCw, Clock, AlertCircle, Zap } from 'lucide-react';
import { useThemeContext } from '../../context/ThemeContext';

const COMMON_WORDS = [
    "the", "be", "to", "of", "and", "a", "in", "that", "have", "i", "it", "for", "not", "on", "with", "he", "as", "you", "do", "at", 
    "this", "but", "his", "by", "from", "they", "we", "say", "her", "she", "or", "an", "will", "my", "one", "all", "would", "there", "their", "what",
    "so", "up", "out", "if", "about", "who", "get", "which", "go", "me", "when", "make", "can", "like", "time", "no", "just", "him", "know", "take",
    "people", "into", "year", "your", "good", "some", "could", "them", "see", "other", "than", "then", "now", "look", "only", "come", "its", "over", "think", "also",
    "back", "after", "use", "two", "how", "our", "work", "first", "well", "way", "even", "new", "want", "because", "any", "these", "give", "day", "most", "us"
];

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5001';

const generateWords = (count = 120) => {
    let result = [];
    for (let i = 0; i < count; i++) {
        result.push(COMMON_WORDS[Math.floor(Math.random() * COMMON_WORDS.length)]);
    }
    return result.join(' ');
};

export default function TypingTest({ onComplete, onClose }) {
    const { theme } = useThemeContext();
    const isDark = theme === 'dark';
    
    const [phase, setPhase] = useState('ready'); // ready | running | done
    const [config, setConfig] = useState({ time: 30, isCustom: false });
    const [customTime, setCustomTime] = useState(30);
    const [text, setText] = useState('');
    const [input, setInput] = useState('');
    const [timeLeft, setTimeLeft] = useState(30);
    const [wpm, setWpm] = useState(0);
    const [accuracy, setAccuracy] = useState(100);
    const [isFocused, setIsFocused] = useState(true);
    const [saving, setSaving] = useState(false);

    const inputRef = useRef(null);
    const timerRef = useRef(null);
    const startTimeRef = useRef(null);

    const resetTest = useCallback(() => {
        setText(generateWords(150));
        setPhase('ready');
        setInput('');
        setTimeLeft(config.isCustom ? customTime : config.time);
        setWpm(0);
        setAccuracy(100);
        startTimeRef.current = null;
        if (timerRef.current) clearInterval(timerRef.current);
    }, [config.time, config.isCustom, customTime]);

    useEffect(() => {
        resetTest();
    }, [resetTest]);

    const startTest = useCallback(() => {
        setPhase('running');
        setInput('');
        setTimeLeft(config.isCustom ? customTime : config.time);
        startTimeRef.current = Date.now();
        setTimeout(() => inputRef.current?.focus(), 10);
    }, [config.time, config.isCustom, customTime]);

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
        if (phase === 'ready' && val.length > 0) {
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
                body: JSON.stringify({ 
                    wpm, 
                    accuracy_pct: accuracy, 
                    duration_sec: (config.isCustom ? customTime : config.time) - timeLeft 
                }),
            });
            const data = await res.json();
            onComplete?.(data);
        } catch (err) {
            console.error('[TypingTest] Save error:', err);
        } finally {
            setSaving(false);
        }
    };

    const text1 = 'var(--color-text-1)';
    const text3 = 'var(--color-text-3)';
    const accent = 'var(--color-accent)';
    const surface = 'var(--color-surface)';
    const border = 'var(--color-border)';
    const errorColor = '#ff4d4d';

    return (
        <div style={{ 
            padding: '40px 20px', 
            maxWidth: '1000px', 
            margin: '0 auto',
            minHeight: '400px',
            display: 'flex',
            flexDirection: 'column',
            gap: '40px'
        }}>

            {/* Heat Indicator Background */}
            {phase === 'running' && (
                <motion.div 
                    animate={{ 
                        opacity: [0.02, 0.05 + (wpm / 200) * 0.1, 0.02],
                        scale: [1, 1.05, 1]
                    }}
                    transition={{
                        duration: Math.max(0.5, 2 - (wpm / 50)),
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                    style={{
                        position: 'absolute',
                        inset: 0,
                        background: `radial-gradient(circle at center, ${accent} 0%, transparent 70%)`,
                        pointerEvents: 'none',
                        zIndex: -1
                    }}
                />
            )}

            {/* Main Split Layout */}
            <div style={{ display: 'flex', gap: '32px', alignItems: 'flex-start', maxWidth: '1100px', margin: '0 auto', width: '100%' }}>
                
                {/* LEFT SIDE: CONTROLS */}
                <AnimatePresence>
                    {phase !== 'done' && (
                        <motion.div 
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            style={{ 
                                display: 'flex', 
                                flexDirection: 'column',
                                gap: '24px', 
                                background: surface,
                                backdropFilter: 'blur(20px)',
                                padding: '32px 24px',
                                borderRadius: '24px',
                                border: `1px solid ${border}`,
                                width: '220px',
                                flexShrink: 0
                            }}
                        >
                            <div style={{ fontSize: '12px', fontWeight: 800, color: text3, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Settings</div>
                            
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                <div style={{ display: 'flex', gap: '8px', color: text1, fontSize: '14px', fontWeight: 700, alignItems: 'center' }}>
                                    <Clock size={16} /> Time Limit
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                    {[15, 30, 60].map(t => (
                                        <button
                                            key={t}
                                            onClick={() => setConfig({ time: t, isCustom: false })}
                                            style={{
                                                background: !config.isCustom && config.time === t ? `${accent}15` : 'transparent',
                                                border: `1px solid ${!config.isCustom && config.time === t ? accent : 'transparent'}`,
                                                color: !config.isCustom && config.time === t ? accent : text3,
                                                padding: '10px 16px',
                                                borderRadius: '8px',
                                                fontSize: '14px',
                                                fontWeight: 700,
                                                cursor: 'pointer',
                                                textAlign: 'left',
                                                transition: 'all 0.2s',
                                            }}
                                        >
                                            {t} seconds
                                        </button>
                                    ))}
                                    
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '8px' }}>
                                        <button
                                            onClick={() => setConfig({ ...config, isCustom: true })}
                                            style={{
                                                background: 'transparent',
                                                border: 'none',
                                                color: config.isCustom ? accent : text3,
                                                fontSize: '14px',
                                                fontWeight: 700,
                                                cursor: 'pointer',
                                                padding: '0'
                                            }}
                                        >
                                            Custom:
                                        </button>
                                        {config.isCustom && (
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                <input 
                                                    type="number"
                                                    value={customTime}
                                                    onChange={(e) => setCustomTime(Math.max(5, parseInt(e.target.value) || 5))}
                                                    style={{
                                                        width: '50px', background: 'transparent', border: `1px solid ${accent}`,
                                                        borderRadius: '6px', color: accent, fontSize: '13px', textAlign: 'center',
                                                        padding: '4px', outline: 'none'
                                                    }}
                                                />
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div style={{ width: '100%', height: '1px', background: border, margin: '8px 0' }} />

                            <button onClick={resetTest} style={{ background: elevated, border: `1px solid ${border}`, color: text1, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontSize: '13px', fontWeight: 700, padding: '12px 16px', borderRadius: '12px', transition: 'all 0.2s' }}>
                                <RefreshCw size={14} /> Restart Test
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>

            <div style={{ position: 'relative', flex: 1 }}>
                <AnimatePresence mode="wait">
                    {phase === 'done' ? (
                        <motion.div
                            key="done"
                            initial={{ opacity: 0, scale: 0.98 }}
                            animate={{ opacity: 1, scale: 1 }}
                            style={{ 
                                background: surface,
                                backdropFilter: 'blur(30px)',
                                borderRadius: '32px',
                                border: `1px solid ${border}`,
                                padding: '64px',
                                textAlign: 'center',
                                boxShadow: '0 24px 64px rgba(0,0,0,0.4)'
                            }}
                        >
                            <div style={{ display: 'flex', justifyContent: 'center', gap: '80px', marginBottom: '48px' }}>
                                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                                    <div style={{ fontSize: '14px', color: text3, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '12px' }}>WPM</div>
                                    <div style={{ fontSize: '84px', fontWeight: 900, color: accent, lineHeight: 1, letterSpacing: '-0.04em' }}>{wpm}</div>
                                </motion.div>
                                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                                    <div style={{ fontSize: '14px', color: text3, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '12px' }}>Accuracy</div>
                                    <div style={{ fontSize: '84px', fontWeight: 900, color: text1, lineHeight: 1, letterSpacing: '-0.04em' }}>{accuracy}<span style={{ fontSize: '32px', color: text3 }}>%</span></div>
                                </motion.div>
                            </div>
                            
                            <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
                                <button 
                                    onClick={handleSave} 
                                    disabled={saving}
                                    style={{ 
                                        background: accent,
                                        color: '#fff',
                                        border: 'none',
                                        padding: '16px 40px',
                                        borderRadius: '16px',
                                        fontWeight: 800,
                                        fontSize: '15px',
                                        cursor: 'pointer',
                                        boxShadow: `0 8px 24px ${accent}40`,
                                        transition: 'all 0.2s'
                                    }}
                                >
                                    {saving ? 'Syncing...' : 'Log Practice'}
                                </button>
                                <button onClick={resetTest} style={{ 
                                    background: 'var(--color-elevated)', 
                                    border: `1px solid ${border}`, 
                                    padding: '16px 40px', 
                                    borderRadius: '16px', 
                                    color: text1, 
                                    fontWeight: 700,
                                    cursor: 'pointer',
                                    fontSize: '15px'
                                }}>
                                    Try Again
                                </button>
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="test"
                            style={{ 
                                position: 'relative', 
                                cursor: 'text',
                                background: 'var(--color-elevated)',
                                border: `1px solid ${border}`,
                                borderRadius: '24px',
                                padding: '40px 48px',
                                boxShadow: isDark ? '0 8px 32px rgba(0,0,0,0.3)' : '0 4px 24px rgba(0,0,0,0.06)',
                                filter: (phase === 'running' && !isFocused) ? 'blur(4px)' : 'none',
                                transition: 'filter 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
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

                            {/* Live Metrics Float */}
                            <div style={{ 
                                display: 'flex',
                                gap: '32px',
                                marginBottom: '32px',
                                opacity: phase === 'running' ? 1 : 0,
                                transition: 'opacity 0.5s',
                                height: phase === 'running' ? 'auto' : 0,
                                overflow: 'hidden'
                            }}>
                                <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                                    <span style={{ fontSize: '32px', fontWeight: 800, color: accent, fontFamily: 'var(--font-mono)' }}>{timeLeft}</span>
                                    <span style={{ fontSize: '12px', color: text3, fontWeight: 700 }}>SEC</span>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                                    <span style={{ fontSize: '32px', fontWeight: 800, color: accuracy < 95 ? errorColor : '#10b981', fontFamily: 'var(--font-mono)' }}>{accuracy}%</span>
                                    <span style={{ fontSize: '12px', color: text3, fontWeight: 700 }}>ACC</span>
                                </div>
                                {wpm > 80 && (
                                    <motion.div 
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#f59e0b', fontSize: '12px', fontWeight: 900, textTransform: 'uppercase' }}
                                    >
                                        <Zap size={14} fill="#f59e0b" /> Heat Streak
                                    </motion.div>
                                )}
                            </div>

                            {/* Ready state — click to start overlay */}
                            {phase === 'ready' && (
                                <div style={{
                                    position: 'absolute',
                                    inset: 0,
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    borderRadius: '24px',
                                    background: isDark ? 'rgba(0,0,0,0.45)' : 'rgba(255,255,255,0.6)',
                                    backdropFilter: 'blur(2px)',
                                    zIndex: 5,
                                    gap: '12px',
                                    pointerEvents: 'none'
                                }}>
                                    <div style={{ fontSize: '32px' }}>⌨️</div>
                                    <div style={{ fontSize: '18px', fontWeight: 800, color: text1 }}>Start typing to begin</div>
                                    <div style={{ fontSize: '13px', color: text3, fontWeight: 600 }}>The timer starts with your first keystroke</div>
                                </div>
                            )}

                            <div style={{ 
                                fontSize: '22px', 
                                lineHeight: '2.0', 
                                fontFamily: '"Fira Code", "Roboto Mono", monospace', 
                                color: isDark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.35)', 
                                whiteSpace: 'pre-wrap',
                                letterSpacing: '0.01em',
                                wordBreak: 'break-word',
                                textAlign: 'left',
                                maxWidth: '100%',
                                userSelect: 'none'
                            }}>
                                {text.split('').map((char, i) => {
                                    let color = isDark ? 'rgba(255,255,255,0.35)' : 'rgba(0,0,0,0.5)';
                                    let decoration = 'none';
                                    
                                    if (i < input.length) {
                                        if (input[i] === char) {
                                            color = isDark ? '#ffffff' : 'var(--color-text-1)';
                                        } else {
                                            color = errorColor;
                                            decoration = 'underline';
                                        }
                                    }
                                    
                                    const isCurrent = i === input.length;

                                    return (
                                        <span key={i} style={{ 
                                            color, 
                                            position: 'relative',
                                            transition: 'color 0.1s',
                                            textDecoration: decoration
                                        }}>
                                            {isCurrent && phase !== 'done' && (
                                                <motion.div
                                                    layoutId="caret"
                                                    style={{
                                                        position: 'absolute',
                                                        left: '-1px',
                                                        top: '10%',
                                                        width: '2.5px',
                                                        height: '80%',
                                                        background: accent,
                                                        boxShadow: `0 0 15px ${accent}`,
                                                        borderRadius: '2px'
                                                    }}
                                                    animate={{ opacity: [1, 0, 1] }}
                                                    transition={{ repeat: Infinity, duration: 0.8, ease: "linear" }}
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
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    zIndex: 10,
                                    color: 'var(--color-text-1)',
                                    background: isDark ? 'rgba(0,0,0,0.5)' : 'rgba(255,255,255,0.75)',
                                    borderRadius: '24px',
                                    backdropFilter: 'blur(4px)',
                                    pointerEvents: 'none'
                                }}>
                                    <AlertCircle size={32} style={{ marginBottom: '16px', color: accent }} />
                                    <div style={{ fontSize: '18px', fontWeight: 700 }}>Paused</div>
                                    <div style={{ fontSize: '14px', color: text3, marginTop: '4px' }}>Click to resume</div>
                                </div>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            </div> {/* End Main Split Layout */}

            {/* Bottom Tip */}
            {phase === 'ready' && (
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    style={{ textAlign: 'center', color: text3, fontSize: '12px', fontWeight: 600, letterSpacing: '0.05em', position: 'absolute', bottom: '20px', width: '100%' }}
                >
                    TYPE TO START
                </motion.div>
            )}
        </div>
    );
}
