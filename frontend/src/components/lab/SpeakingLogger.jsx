import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import supabase from '../../utils/supabase';

const TOPICS = [
    { label: 'Technology', color: 'rgba(139, 92, 246, 0.2)' },
    { label: 'Business', color: 'rgba(59, 130, 246, 0.2)' },
    { label: 'Education', color: 'rgba(16, 185, 129, 0.2)' },
    { label: 'Culture', color: 'rgba(245, 158, 11, 0.2)' },
    { label: 'Sports', color: 'rgba(239, 68, 68, 0.2)' },
    { label: 'Philosophy', color: 'rgba(107, 114, 128, 0.2)' },
    { label: 'Politics', color: 'rgba(75, 85, 99, 0.2)' },
    { label: 'Health', color: 'rgba(236, 72, 153, 0.2)' },
    { label: 'Environment', color: 'rgba(34, 197, 94, 0.2)' },
];

const SLIDERS = [
    { key: 'confidence_score', label: 'Confidence', desc: 'Self-perceived delivery strength' },
    { key: 'clarity_score', label: 'Clarity', desc: 'Articulation and structure' },
    { key: 'pace_score', label: 'Pace', desc: 'Rhythm and flow control' },
];

const CATEGORIZED_PROMPTS = {
    'Technology': [
        "Explain your primary career objective as if you were talking to a 50-year-old mentor.",
        "Describe a complex technical concept you recently learned to a non-technical friend.",
        "Pitch AIIMIN's core value proposition to a high-performer in 60 seconds."
    ],
    'Business': [
        "Walk through your decision process for your most significant purchase recently.",
        "Describe a time you failed to communicate clearly. What was the impact?",
        "How would you handle a conflict between two high-performing team members?"
    ],
    'Philosophy': [
        "What is the single most important habit you've formed in 2026? Why?",
        "If you could have a 30-minute conversation with any historical figure, who would it be and why?",
        "Is it better to be a master of one or a jack of all trades in 2026?"
    ]
};

const Visualizer = ({ isRecording }) => (
    <div style={{ display: 'flex', gap: '4px', height: '80px', alignItems: 'center', justifyContent: 'center', marginBottom: '40px' }}>
        {[...Array(32)].map((_, i) => (
            <motion.div
                key={i}
                animate={isRecording ? { 
                    height: [20, 80, 30, 60, 20],
                    opacity: [0.3, 1, 0.5, 0.9, 0.3]
                } : {
                    height: 8,
                    opacity: 0.1
                }}
                transition={{ 
                    repeat: Infinity, 
                    duration: 0.5 + (i * 0.03), 
                    ease: "easeInOut" 
                }}
                style={{ width: '4px', background: 'var(--color-accent)', borderRadius: '99px' }}
            />
        ))}
    </div>
);

export default function SpeakingLogger({ onComplete }) {
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

    const prompts = CATEGORIZED_PROMPTS[selectedTopic] || CATEGORIZED_PROMPTS['Technology'];

    const spinTopic = () => {
        setIsSpinning(true);
        setTimeout(() => {
            const randomTopic = TOPICS[Math.floor(Math.random() * TOPICS.length)].label;
            setSelectedTopic(randomTopic);
            setPromptIndex(Math.floor(Math.random() * (CATEGORIZED_PROMPTS[randomTopic]?.length || 1)));
            setIsSpinning(false);
        }, 800);
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

    return (
        <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px 0' }}>
            <AnimatePresence mode="wait">
                {phase === 'ready' && (
                    <motion.div 
                        key="ready" 
                        initial={{ opacity: 0, y: 20 }} 
                        animate={{ opacity: 1, y: 0 }} 
                        exit={{ opacity: 0, scale: 0.95 }}
                        style={{ textAlign: 'center' }}
                    >
                        <h1 style={{ 
                            fontSize: '48px', 
                            fontWeight: 400, 
                            color: text1, 
                            marginBottom: '16px',
                            fontFamily: 'var(--font-serif)',
                            letterSpacing: '-0.02em'
                        }}>
                            Spin for a <i style={{ color: 'var(--color-accent)' }}>topic</i>
                        </h1>
                        <p style={{ color: text3, fontSize: '14px', marginBottom: '40px', maxWidth: '500px', margin: '0 auto 40px', lineHeight: 1.6 }}>
                            Every day of the challenge starts like this — pick categories, spin, and you've got sixty seconds to speak.
                        </p>

                        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '8px', marginBottom: '48px', maxWidth: '600px', margin: '0 auto 48px' }}>
                            {TOPICS.map(t => (
                                <button
                                    key={t.label}
                                    onClick={() => setSelectedTopic(t.label)}
                                    style={{
                                        padding: '8px 20px',
                                        borderRadius: '99px',
                                        border: `1px solid ${selectedTopic === t.label ? accent : 'rgba(255,255,255,0.1)'}`,
                                        background: selectedTopic === t.label ? 'rgba(255,255,255,0.05)' : 'transparent',
                                        color: selectedTopic === t.label ? text1 : text3,
                                        fontSize: '13px',
                                        cursor: 'pointer',
                                        transition: 'all 0.2s ease',
                                        fontFamily: 'var(--font-sans)'
                                    }}
                                >
                                    {t.label}
                                </button>
                            ))}
                        </div>

                        <div style={{ 
                            background: 'rgba(255,255,255,0.03)', 
                            backdropFilter: 'blur(10px)',
                            borderRadius: '32px', 
                            padding: '64px 40px', 
                            border: `1px solid rgba(255,255,255,0.05)`, 
                            marginBottom: '40px',
                            minHeight: '200px',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            position: 'relative',
                            overflow: 'hidden'
                        }}>
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={selectedTopic + promptIndex}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                >
                                    <h2 style={{ 
                                        fontSize: '28px', 
                                        fontWeight: 500, 
                                        color: text1, 
                                        lineHeight: 1.4, 
                                        margin: 0,
                                        fontFamily: 'var(--font-serif)',
                                        maxWidth: '500px',
                                        margin: '0 auto'
                                    }}>
                                        {isSpinning ? '...' : `"${prompts[promptIndex] || 'Choose a topic to begin'}"`}
                                    </h2>
                                </motion.div>
                            </AnimatePresence>
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'center', gap: '16px' }}>
                            <button 
                                onClick={spinTopic}
                                disabled={isSpinning}
                                style={{ 
                                    background: 'rgba(167, 139, 250, 0.3)',
                                    color: '#fff',
                                    border: '1px solid rgba(167, 139, 250, 0.5)',
                                    padding: '12px 32px',
                                    borderRadius: '99px',
                                    fontSize: '14px',
                                    fontWeight: 600,
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px'
                                }}
                            >
                                <span style={{ fontSize: '18px' }}>✨</span> Spin
                            </button>
                            <button 
                                onClick={startRecording} 
                                style={{ 
                                    background: accent,
                                    color: '#fff',
                                    border: 'none',
                                    padding: '12px 40px',
                                    borderRadius: '99px',
                                    fontSize: '14px',
                                    fontWeight: 700,
                                    cursor: 'pointer'
                                }}
                            >
                                Start Speaking
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
                        style={{ textAlign: 'center' }}
                    >
                        <div style={{ 
                            fontSize: '11px', 
                            color: text3, 
                            textTransform: 'uppercase', 
                            letterSpacing: '0.15em',
                            marginBottom: '12px' 
                        }}>Now Recording</div>
                        <div style={{ 
                            fontSize: '64px', 
                            fontWeight: 700, 
                            color: accent, 
                            marginBottom: '40px', 
                            fontFamily: 'var(--font-mono)',
                            letterSpacing: '-0.05em'
                        }}>
                            0:{timeLeft < 10 ? `0${timeLeft}` : timeLeft}
                        </div>
                        <Visualizer isRecording={true} />
                        <p style={{ 
                            fontSize: '18px', 
                            color: text2, 
                            fontStyle: 'italic', 
                            marginBottom: '40px',
                            maxWidth: '400px',
                            margin: '0 auto 40px'
                        }}>
                            "{prompts[promptIndex]}"
                        </p>
                        <button 
                            onClick={stopRecording} 
                            style={{ 
                                background: '#EF4444', 
                                color: '#fff', 
                                border: 'none', 
                                padding: '12px 32px', 
                                borderRadius: '12px', 
                                fontWeight: 700, 
                                cursor: 'pointer',
                                transition: 'all 0.2s var(--ease)'
                            }}
                        >
                            Finish Early
                        </button>
                    </motion.div>
                )}

                {(phase === 'scoring' || phase === 'done') && (
                    <motion.div 
                        key="scoring" 
                        initial={{ opacity: 0, y: 20 }} 
                        animate={{ opacity: 1, y: 0 }}
                        style={{ 
                            background: 'var(--color-surface)', 
                            borderRadius: '24px', 
                            padding: '40px', 
                            border: `1px solid ${border}`,
                            boxShadow: 'var(--shadow-lg)'
                        }}
                    >
                        <h3 style={{ 
                            fontSize: '20px', 
                            fontWeight: 700, 
                            color: text1, 
                            marginBottom: '32px',
                            fontFamily: 'var(--font-sans)'
                        }}>Reflect & Evaluate</h3>
                        
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '28px', marginBottom: '40px' }}>
                            {SLIDERS.map(({ key, label, desc }) => (
                                <div key={key}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                                        <div>
                                            <span style={{ fontSize: '14px', fontWeight: 700, color: text1 }}>{label}</span>
                                            <div style={{ fontSize: '11px', color: text3, marginTop: '2px' }}>{desc}</div>
                                        </div>
                                        <span style={{ fontSize: '16px', fontWeight: 700, color: accent, fontFamily: 'var(--font-mono)' }}>{scores[key]}</span>
                                    </div>
                                    <input 
                                        type="range" min="1" max="100" value={scores[key]}
                                        disabled={phase === 'done'}
                                        onChange={e => setScores(s => ({ ...s, [key]: parseInt(e.target.value) }))}
                                        style={{ 
                                            width: '100%', 
                                            accentColor: accent,
                                            cursor: phase === 'done' ? 'default' : 'pointer'
                                        }}
                                    />
                                </div>
                            ))}
                        </div>

                        <textarea 
                            value={notes} 
                            onChange={e => setNotes(e.target.value)} 
                            disabled={phase === 'done'}
                            placeholder="Key takeaways from this delivery..."
                            style={{ 
                                width: '100%', 
                                minHeight: '100px', 
                                background: 'transparent', 
                                border: `1px solid ${border}`, 
                                borderRadius: '16px', 
                                padding: '20px', 
                                color: text1, 
                                outline: 'none',
                                fontSize: '14px',
                                fontFamily: 'var(--font-sans)',
                                resize: 'none',
                                transition: 'border-color 0.2s var(--ease)'
                            }}
                        />

                        {phase === 'scoring' ? (
                            <button 
                                onClick={handleSave} 
                                disabled={saving} 
                                style={{ 
                                    width: '100%', 
                                    marginTop: '32px',
                                    background: accent,
                                    color: '#fff',
                                    border: 'none',
                                    padding: '16px',
                                    borderRadius: '12px',
                                    fontWeight: 700,
                                    cursor: 'pointer',
                                    boxShadow: 'var(--shadow-md)'
                                }}
                            >
                                {saving ? 'Syncing...' : 'Log Session'}
                            </button>
                        ) : (
                            <div style={{ marginTop: '32px', textAlign: 'center' }}>
                                <p style={{ color: accent, fontWeight: 700, fontSize: '15px', marginBottom: '24px' }}>
                                    {result?.mastery_change ? `🏅 Mastery +${result.mastery_change} earned!` : `Session synced successfully.`}
                                </p>
                                <button 
                                    onClick={() => setPhase('ready')} 
                                    style={{ 
                                        background: 'none', 
                                        border: `1px solid ${border}`, 
                                        padding: '12px 32px', 
                                        borderRadius: '12px', 
                                        color: text2, 
                                        cursor: 'pointer', 
                                        fontWeight: 600,
                                        fontSize: '14px'
                                    }}
                                >
                                    New Session
                                </button>
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
