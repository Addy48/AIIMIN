import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, RotateCcw, Play, Check, ChevronRight, BarChart3, Info, Globe, Code, Heart, Coffee, Zap, MessageSquare, X } from 'lucide-react';
import supabase from '../../utils/supabase';
import { useThemeContext } from '../../context/ThemeContext';

const TOPICS = [
    { label: 'HR Topics', icon: <MessageSquare size={16} />, color: '#3b82f6', bg: 'rgba(59, 130, 246, 0.1)' },
    { label: 'Technical English', icon: <Code size={16} />, color: '#8b5cf6', bg: 'rgba(139, 92, 246, 0.1)' },
    { label: 'Daily Practice', icon: <Coffee size={16} />, color: '#10b981', bg: 'rgba(16, 185, 129, 0.1)' },
    { label: 'Placement Prep', icon: <Zap size={16} />, color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.1)' },
    { label: 'Technology', icon: <Globe size={16} />, color: '#6366f1', bg: 'rgba(99, 102, 241, 0.1)' },
    { label: 'Philosophy', icon: <Heart size={16} />, color: '#ec4899', bg: 'rgba(236, 72, 153, 0.1)' },
];

const SLIDERS = [
    { key: 'confidence_score', label: 'Confidence', desc: 'Self-perceived delivery strength' },
    { key: 'clarity_score', label: 'Clarity', desc: 'Articulation and structure' },
    { key: 'pace_score', label: 'Pace', desc: 'Rhythm and flow control' },
];

const CATEGORIZED_PROMPTS = {
    'HR Topics': [
        "Tell me about yourself — give a 60-second professional introduction.",
        "What is your greatest weakness and how are you working on it?",
        "Why do you want to work at this company specifically?",
        "Describe a challenge you faced and how you overcame it.",
        "Where do you see yourself in 5 years?"
    ],
    'Technical English': [
        "Explain what REST APIs are to a non-technical person in simple terms.",
        "Describe Object-Oriented Programming — give a real-world analogy.",
        "Explain cloud computing and why companies are moving to it.",
        "What is machine learning? Describe it like you're talking to your grandmother.",
        "Explain the concept of databases and why they are important."
    ],
    'Daily Practice': [
        "Summarize what you read or watched today in 60 seconds.",
        "Describe your morning routine and why it matters to you.",
        "Talk about one thing you learned this week and how it helped you.",
        "Give your opinion on a current news story you followed recently.",
        "Describe your goals for this week."
    ],
    'Placement Prep': [
        "Walk me through a project you built — what problem it solved and what you learned.",
        "Introduce yourself as if it's the first 60 seconds of a placement interview.",
        "How do you handle pressure? Give a specific example.",
        "Describe your technical skills and which ones you're most proud of.",
        "Why should we hire you over other candidates?"
    ],
    'Technology': [
        "Explain your primary career objective as if you were talking to a senior mentor.",
        "Describe a complex technical concept you recently learned to a non-technical friend.",
        "What is the most exciting technology trend you're following right now?"
    ],
    'Philosophy': [
        "What is the single most important habit you've built? Why?",
        "Is it better to be a generalist or a specialist in 2026?",
        "What does success mean to you personally?"
    ]
};

const WaveformVisualizer = ({ isRecording, color }) => {
    const canvasRef = useRef(null);
    const requestRef = useRef();

    useEffect(() => {
        if (!isRecording) return;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        let phase = 0;

        const render = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            const centerY = canvas.height / 2;
            const width = canvas.width;
            
            // Premium Siri-like multi-layered organic waves
            const waves = [
                { amp: 40, freq: 0.01, speed: 0.05, opacity: 0.8, lineWidth: 4 },
                { amp: 30, freq: 0.015, speed: -0.04, opacity: 0.5, lineWidth: 3 },
                { amp: 20, freq: 0.02, speed: 0.08, opacity: 0.3, lineWidth: 2 },
                { amp: 15, freq: 0.025, speed: -0.06, opacity: 0.2, lineWidth: 2 },
                { amp: 50, freq: 0.005, speed: 0.02, opacity: 0.1, lineWidth: 1 },
            ];

            waves.forEach((wave, idx) => {
                ctx.beginPath();
                ctx.strokeStyle = color;
                ctx.globalAlpha = wave.opacity * (0.5 + Math.sin(phase * 0.02 + idx) * 0.5);
                ctx.lineWidth = wave.lineWidth;
                ctx.lineCap = 'round';

                for (let x = 0; x < width; x += 1) {
                    // Complex noise-like wave using multiple sine frequencies
                    const noise = Math.sin(x * 0.005 + phase * 0.01) * 10;
                    const y = centerY + Math.sin(x * wave.freq + phase * wave.speed) * (wave.amp + noise) * Math.sin(phase * 0.03 + idx);
                    if (x === 0) ctx.moveTo(x, y);
                    else ctx.lineTo(x, y);
                }
                ctx.stroke();
            });

            phase += 1;
            requestRef.current = requestAnimationFrame(render);
        };

        render();
        return () => cancelAnimationFrame(requestRef.current);
    }, [isRecording, color]);

    return (
        <div style={{ position: 'relative', height: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '40px' }}>
            {!isRecording ? (
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    {[...Array(16)].map((_, i) => (
                        <motion.div 
                            key={i} 
                            animate={{ 
                                height: [8, 12, 8],
                                opacity: [0.1, 0.2, 0.1]
                            }}
                            transition={{
                                duration: 1.5,
                                repeat: Infinity,
                                delay: i * 0.1
                            }}
                            style={{ width: '4px', background: color, borderRadius: '2px' }} 
                        />
                    ))}
                </div>
            ) : (
                <div style={{ position: 'relative', width: '100%', height: '100%' }}>
                    <canvas 
                        ref={canvasRef} 
                        width={800} 
                        height={200} 
                        style={{ width: '100%', height: '100%', filter: 'blur(1px) drop-shadow(0 0 15px ' + color + '40)' }} 
                    />
                    <div style={{
                        position: 'absolute', inset: 0,
                        background: `radial-gradient(circle at center, transparent 30%, rgba(0,0,0,0.1) 100%)`,
                        pointerEvents: 'none'
                    }} />
                </div>
            )}
        </div>
    );
};

export default function SpeakingLogger({ onComplete, onClose }) {
    const { theme } = useThemeContext();
    const isDark = theme === 'dark';
    const [selectedTopic, setSelectedTopic] = useState('Technology');
    const [promptIndex, setPromptIndex] = useState(0);
    const [scores, setScores] = useState({ confidence_score: 50, clarity_score: 50, pace_score: 50 });
    const [notes, setNotes] = useState('');
    const [phase, setPhase] = useState('ready'); // ready | recording | scoring | done
    const [timeLeft, setTimeLeft] = useState(60);
    const [saving, setSaving] = useState(false);
    const [result, setResult] = useState(null);
    const [isSpinning, setIsSpinning] = useState(false);
    const timerRef = useRef(null);

    const activeTopic = TOPICS.find(t => t.label === selectedTopic) || TOPICS[0];
    const prompts = CATEGORIZED_PROMPTS[selectedTopic] || CATEGORIZED_PROMPTS['Technology'];

    const spinTopic = () => {
        setIsSpinning(true);
        const duration = 1200;
        const interval = 80;
        let elapsed = 0;
        
        const spinInt = setInterval(() => {
            const randomTopic = TOPICS[Math.floor(Math.random() * TOPICS.length)].label;
            setSelectedTopic(randomTopic);
            setPromptIndex(Math.floor(Math.random() * (CATEGORIZED_PROMPTS[randomTopic]?.length || 1)));
            elapsed += interval;
            if (elapsed >= duration) {
                clearInterval(spinInt);
                setIsSpinning(false);
            }
        }, interval);
    };

    const startRecording = () => {
        setPhase('recording');
        setTimeLeft(60);
        timerRef.current = setInterval(() => {
            setTimeLeft(t => {
                if (t <= 1) {
                    stopRecording();
                    return 0;
                }
                return t - 1;
            });
        }, 1000);
    };

    const stopRecording = () => {
        clearInterval(timerRef.current);
        setPhase('scoring');
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error('Not authenticated');

            const { data, error } = await supabase
                .from('lab_speaking_logs')
                .insert({
                    user_id: user.id,
                    ...scores,
                    topic: selectedTopic,
                    prompt: prompts[promptIndex] || null,
                    notes: notes || null,
                    logged_at: new Date().toISOString()
                })
                .select()
                .single();

            if (error) throw error;
            
            setResult(data);
            onComplete?.(data);
            setPhase('done');
        } catch (err) {
            console.error('[SpeakingLogger] Save error:', err);
        } finally {
            setSaving(false);
        }
    };

    const text1 = 'var(--color-text-1)';
    const text2 = 'var(--color-text-2)';
    const text3 = 'var(--color-text-3)';
    const accent = 'var(--color-accent)';
    const border = 'var(--color-border)';
    const surface = 'var(--color-surface)';

    return (
        <div style={{ maxWidth: '900px', margin: '0 auto', padding: '40px 0', position: 'relative' }}>
            <AnimatePresence mode="wait">
                {phase === 'ready' && (
                    <motion.div 
                        key="ready" 
                        initial={{ opacity: 0, scale: 0.98 }} 
                        animate={{ opacity: 1, scale: 1 }} 
                        exit={{ opacity: 0, scale: 0.95 }}
                        style={{ textAlign: 'center', position: 'relative' }}
                    >
                        <motion.div 
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            style={{ marginBottom: '64px' }}
                        >
                            <h1 style={{ 
                                fontSize: '56px', 
                                fontWeight: 900, 
                                color: text1, 
                                marginBottom: '16px',
                                fontFamily: 'var(--font-serif)',
                                letterSpacing: '-0.03em'
                            }}>
                                Vocal <span style={{ color: activeTopic.color }}>Mastery</span>
                            </h1>
                            <p style={{ color: text3, fontSize: '15px', maxWidth: '500px', margin: '0 auto', lineHeight: 1.6, fontWeight: 500 }}>
                                Refine your delivery, articulation, and confidence. Spin for a prompt, speak for 60 seconds, and reflect.
                            </p>
                        </motion.div>

                        <div style={{ 
                            display: 'grid', 
                            gridTemplateColumns: 'repeat(3, 1fr)', 
                            gap: '12px', 
                            marginBottom: '48px', 
                            maxWidth: '700px', 
                            margin: '0 auto 48px' 
                        }}>
                            {TOPICS.map(t => (
                                <button
                                    key={t.label}
                                    onClick={() => setSelectedTopic(t.label)}
                                    style={{
                                        padding: '16px',
                                        borderRadius: '20px',
                                        border: `1px solid ${selectedTopic === t.label ? t.color : border}`,
                                        background: selectedTopic === t.label 
                                            ? (isDark ? t.bg : `${t.color}25`) 
                                            : 'var(--color-surface)',
                                        color: selectedTopic === t.label ? t.color : text2,
                                        fontSize: '13px',
                                        fontWeight: 700,
                                        cursor: 'pointer',
                                        transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        gap: '10px'
                                    }}
                                    onMouseEnter={e => {
                                        if (selectedTopic !== t.label) {
                                            e.currentTarget.style.background = 'var(--color-elevated)';
                                            e.currentTarget.style.borderColor = 'var(--color-text-3)';
                                        }
                                    }}
                                    onMouseLeave={e => {
                                        if (selectedTopic !== t.label) {
                                            e.currentTarget.style.background = 'var(--color-surface)';
                                            e.currentTarget.style.borderColor = border;
                                        }
                                    }}
                                >
                                    {t.icon} {t.label}
                                </button>
                            ))}
                        </div>

                        <div style={{ 
                            background: isDark ? 'var(--color-surface)' : 'var(--color-elevated)', 
                            backdropFilter: 'blur(30px)',
                            borderRadius: '32px', 
                            padding: '80px 48px', 
                            border: `1px solid ${border}`, 
                            marginBottom: '48px',
                            minHeight: '240px',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            position: 'relative',
                            overflow: 'hidden',
                            boxShadow: isDark ? '0 32px 64px rgba(0,0,0,0.4)' : '0 16px 48px rgba(0,0,0,0.06)'
                        }}>
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={selectedTopic + promptIndex}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                >
                                    <div style={{ 
                                        fontSize: '12px', 
                                        color: activeTopic.color, 
                                        fontWeight: 800, 
                                        textTransform: 'uppercase', 
                                        letterSpacing: '0.2em',
                                        marginBottom: '24px'
                                    }}>
                                        {selectedTopic}
                                    </div>
                                    <h2 style={{ 
                                        fontSize: '32px', 
                                        fontWeight: 600, 
                                        color: text1, 
                                        lineHeight: 1.4, 
                                        margin: 0,
                                        fontFamily: 'var(--font-serif)',
                                        maxWidth: '600px',
                                        margin: '0 auto'
                                    }}>
                                        {isSpinning ? 'Selecting...' : `"${prompts[promptIndex]}"`}
                                    </h2>
                                </motion.div>
                            </AnimatePresence>
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'center', gap: '20px' }}>
                            <button 
                                onClick={spinTopic}
                                disabled={isSpinning}
                                style={{ 
                                    background: 'var(--color-elevated)',
                                    color: text2,
                                    border: `1px solid ${border}`,
                                    padding: '16px 32px',
                                    borderRadius: '16px',
                                    fontSize: '14px',
                                    fontWeight: 700,
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '10px',
                                    transition: 'all 0.2s'
                                }}
                            >
                                <RotateCcw size={16} className={isSpinning ? 'spin-anim' : ''} /> Randomize
                            </button>
                            <button 
                                onClick={startRecording} 
                                style={{ 
                                    background: activeTopic.color,
                                    color: '#fff',
                                    border: 'none',
                                    padding: '16px 48px',
                                    borderRadius: '16px',
                                    fontSize: '15px',
                                    fontWeight: 800,
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '12px',
                                    boxShadow: `0 8px 32px ${activeTopic.color}40`,
                                    transition: 'all 0.2s'
                                }}
                            >
                                <Mic size={20} /> Begin Session
                            </button>
                        </div>
                    </motion.div>
                )}

                {phase === 'recording' && (
                    <motion.div 
                        key="recording" 
                        initial={{ opacity: 0 }} 
                        animate={{ opacity: 1 }} 
                        exit={{ opacity: 0 }}
                        style={{
                            background: 'var(--color-elevated)',
                            border: `1px solid ${border}`,
                            borderRadius: '32px',
                            padding: '60px 40px',
                            textAlign: 'center',
                            boxShadow: isDark ? '0 24px 64px rgba(0,0,0,0.4)' : '0 12px 40px rgba(0,0,0,0.08)',
                            position: 'relative'
                        }}
                    >
                        {/* Cancel recording X */}
                        <button
                            onClick={() => { clearInterval(timerRef.current); setPhase('ready'); }}
                            style={{
                                position: 'absolute', top: '20px', right: '20px',
                                background: 'var(--color-surface)', border: `1px solid ${border}`,
                                borderRadius: '10px', padding: '8px', color: text3,
                                cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                transition: 'all 0.2s'
                            }}
                            title="Cancel session"
                        >
                            <X size={16} />
                        </button>
                        <div style={{ 
                            fontSize: '12px', 
                            color: text3, 
                            fontWeight: 800,
                            textTransform: 'uppercase', 
                            letterSpacing: '0.2em',
                            marginBottom: '16px' 
                        }}>Capturing Audio...</div>
                        <div style={{ 
                            fontSize: '96px', 
                            fontWeight: 900, 
                            color: activeTopic.color, 
                            marginBottom: '32px', 
                            fontFamily: 'var(--font-mono)',
                            letterSpacing: '-0.06em',
                            textShadow: `0 0 40px ${activeTopic.color}40`
                        }}>
                            0:{timeLeft < 10 ? `0${timeLeft}` : timeLeft}
                        </div>
                        <WaveformVisualizer isRecording={true} color={activeTopic.color} />
                        <div style={{ 
                            fontSize: '22px', 
                            color: text1, 
                            fontStyle: 'italic', 
                            marginBottom: '40px',
                            maxWidth: '500px',
                            margin: '24px auto 40px',
                            lineHeight: 1.5,
                            fontFamily: 'var(--font-serif)'
                        }}>
                            "{prompts[promptIndex]}"
                        </div>
                        <button 
                            onClick={stopRecording} 
                            style={{ 
                                background: '#ef4444', 
                                color: '#fff', 
                                border: 'none', 
                                padding: '16px 48px', 
                                borderRadius: '16px', 
                                fontWeight: 800, 
                                cursor: 'pointer',
                                fontSize: '15px',
                                boxShadow: '0 8px 32px rgba(239, 68, 68, 0.3)'
                            }}
                        >
                            Complete Early
                        </button>
                    </motion.div>
                )}

                {(phase === 'scoring' || phase === 'done') && (
                    <motion.div 
                        key="scoring" 
                        initial={{ opacity: 0, y: 40 }} 
                        animate={{ opacity: 1, y: 0 }}
                        style={{ 
                            background: surface, 
                            backdropFilter: 'blur(40px)',
                            borderRadius: '32px', 
                            padding: '48px', 
                            border: `1px solid ${border}`,
                            boxShadow: '0 48px 96px rgba(0,0,0,0.4)',
                            maxWidth: '700px',
                            margin: '0 auto',
                            position: 'relative'
                        }}
                    >
                        <button 
                            onClick={() => setPhase('ready')}
                            style={{ 
                                position: 'absolute', top: '24px', right: '24px', 
                                background: 'none', border: 'none', color: text3, 
                                cursor: 'pointer', padding: '8px' 
                            }}
                        >
                            <X size={20} />
                        </button>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '40px' }}>
                            <div style={{ background: activeTopic.bg, color: activeTopic.color, padding: '12px', borderRadius: '16px' }}>
                                <BarChart3 size={24} />
                            </div>
                            <div>
                                <h3 style={{ fontSize: '24px', fontWeight: 800, color: text1, margin: 0 }}>Self Assessment</h3>
                                <div style={{ fontSize: '13px', color: text3, fontWeight: 500 }}>Review your performance against key metrics</div>
                            </div>
                        </div>
                        
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', marginBottom: '48px' }}>
                            {SLIDERS.map(({ key, label, desc }) => (
                                <div key={key}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px', alignItems: 'flex-end' }}>
                                        <div>
                                            <span style={{ fontSize: '15px', fontWeight: 700, color: text1 }}>{label}</span>
                                            <div style={{ fontSize: '12px', color: text3, marginTop: '2px', fontWeight: 500 }}>{desc}</div>
                                        </div>
                                        <span style={{ fontSize: '20px', fontWeight: 900, color: activeTopic.color, fontFamily: 'var(--font-mono)' }}>{scores[key]}</span>
                                    </div>
                                    <div style={{ position: 'relative', height: '6px' }}>
                                        <input 
                                            type="range" min="1" max="100" value={scores[key]}
                                            disabled={phase === 'done'}
                                            onChange={e => setScores(s => ({ ...s, [key]: parseInt(e.target.value) }))}
                                            style={{ 
                                                width: '100%', 
                                                accentColor: activeTopic.color,
                                                cursor: phase === 'done' ? 'default' : 'pointer',
                                                appearance: 'none',
                                                background: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)',
                                                borderRadius: '3px',
                                                height: '6px',
                                                outline: 'none'
                                            }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div style={{ position: 'relative', marginBottom: '40px' }}>
                            <textarea 
                                value={notes} 
                                onChange={e => setNotes(e.target.value)} 
                                disabled={phase === 'done'}
                                placeholder="What felt strong? Where did you stumble? Write your key takeaways..."
                                style={{ 
                                    width: '100%', 
                                    minHeight: '120px', 
                                    background: 'var(--color-surface)', 
                                    border: `1px solid ${border}`, 
                                    borderRadius: '20px', 
                                    padding: '24px', 
                                    color: text1, 
                                    outline: 'none',
                                    fontSize: '15px',
                                    fontFamily: 'inherit',
                                    lineHeight: 1.6,
                                    resize: 'none',
                                    transition: 'all 0.2s',
                                    boxSizing: 'border-box'
                                }}
                            />
                        </div>

                        {phase === 'scoring' ? (
                            <button 
                                onClick={handleSave} 
                                disabled={saving} 
                                style={{ 
                                    width: '100%', 
                                    background: activeTopic.color,
                                    color: '#fff',
                                    border: 'none',
                                    padding: '20px',
                                    borderRadius: '16px',
                                    fontWeight: 800,
                                    fontSize: '16px',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '12px',
                                    boxShadow: `0 12px 32px ${activeTopic.color}40`,
                                    transition: 'all 0.2s'
                                }}
                            >
                                {saving ? 'Finalizing...' : <><Check size={20} /> Sync Practice Log</>}
                            </button>
                        ) : (
                            <div style={{ textAlign: 'center' }}>
                                <motion.div 
                                    initial={{ scale: 0.9, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    style={{ 
                                        background: 'rgba(16, 185, 129, 0.1)', 
                                        color: '#10b981',
                                        padding: '16px',
                                        borderRadius: '16px',
                                        fontSize: '14px',
                                        fontWeight: 700,
                                        marginBottom: '32px',
                                        border: '1px solid rgba(16, 185, 129, 0.2)'
                                    }}
                                >
                                    ✨ Session finalized successfully
                                </motion.div>
                                <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
                                    <button 
                                        onClick={() => setPhase('ready')} 
                                        style={{ 
                                            background: 'var(--color-elevated)', 
                                            border: `1px solid ${border}`, 
                                            padding: '14px 32px', 
                                            borderRadius: '12px', 
                                            color: text2, 
                                            cursor: 'pointer', 
                                            fontWeight: 700,
                                            fontSize: '14px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '8px'
                                        }}
                                    >
                                        <Play size={14} /> New Session
                                    </button>
                                </div>
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
            <style>{`
                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
                .spin-anim {
                    animation: spin 0.4s linear infinite;
                }
                input[type=range]::-webkit-slider-thumb {
                    appearance: none;
                    height: 18px;
                    width: 18px;
                    border-radius: 50%;
                    background: #fff;
                    cursor: pointer;
                    box-shadow: 0 4px 12px rgba(0,0,0,0.3);
                    border: 2px solid currentColor;
                }
            `}</style>
        </div>
    );
}
