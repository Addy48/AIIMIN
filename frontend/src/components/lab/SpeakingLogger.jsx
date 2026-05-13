import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import supabase from '../../utils/supabase';

const SLIDERS = [
    { key: 'confidence_score', label: 'Confidence', desc: 'Self-perceived delivery strength' },
    { key: 'clarity_score', label: 'Clarity', desc: 'Articulation and structure' },
    { key: 'pace_score', label: 'Pace', desc: 'Rhythm and flow control' },
];

const SPEAKING_PROMPTS = [
    "Explain your primary career objective as if you were talking to a 50-year-old mentor.",
    "Describe a complex technical concept you recently learned to a non-technical friend.",
    "Walk through your decision process for your most significant purchase recently.",
    "What is the single most important habit you've formed in 2026? Why?",
    "Pitch AIIMIN's core value proposition to a high-performer in 60 seconds.",
    "Describe a time you failed to communicate clearly. What was the impact?"
];

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
    const [promptIndex, setPromptIndex] = useState(0);
    const [scores, setScores] = useState({ confidence_score: 50, clarity_score: 50, pace_score: 50 });
    const [notes, setNotes] = useState('');
    const [phase, setPhase] = useState('ready'); // ready | recording | scoring | done
    const [timeLeft, setTimeLeft] = useState(60);
    const [saving, setSaving] = useState(false);
    const [result, setResult] = useState(null);
    const timerRef = useRef(null);

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
        <div style={{ maxWidth: '600px', margin: '0 auto', padding: '40px 0' }}>
            <AnimatePresence mode="wait">
                {phase === 'ready' && (
                    <motion.div 
                        key="ready" 
                        initial={{ opacity: 0, scale: 0.98 }} 
                        animate={{ opacity: 1, scale: 1 }} 
                        exit={{ opacity: 0, scale: 1.02 }}
                        style={{ textAlign: 'center' }}
                    >
                        <div style={{ 
                            background: 'var(--color-surface)', 
                            borderRadius: '24px', 
                            padding: '40px', 
                            border: `1px solid ${border}`, 
                            marginBottom: '40px',
                            boxShadow: 'var(--shadow-sm)'
                        }}>
                            <div style={{ 
                                fontSize: '11px', 
                                color: accent, 
                                fontWeight: 700, 
                                textTransform: 'uppercase', 
                                letterSpacing: '0.15em',
                                marginBottom: '20px' 
                            }}>Active Prompt</div>
                            <h2 style={{ 
                                fontSize: '24px', 
                                fontWeight: 600, 
                                color: text1, 
                                lineHeight: 1.4, 
                                fontStyle: 'italic', 
                                margin: 0,
                                fontFamily: 'var(--font-sans)'
                            }}>
                                "{SPEAKING_PROMPTS[promptIndex]}"
                            </h2>
                            <button 
                                onClick={() => setPromptIndex(prev => (prev + 1) % SPEAKING_PROMPTS.length)} 
                                style={{ 
                                    background: 'none', 
                                    border: 'none', 
                                    color: text3, 
                                    cursor: 'pointer', 
                                    fontSize: '11px', 
                                    fontWeight: 700, 
                                    marginTop: '24px', 
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.05em'
                                }}
                            >
                                Next Prompt →
                            </button>
                        </div>
                        <button 
                            onClick={startRecording} 
                            style={{ 
                                background: accent,
                                color: '#fff',
                                border: 'none',
                                padding: '16px 48px',
                                borderRadius: '12px',
                                fontSize: '15px',
                                fontWeight: 700,
                                cursor: 'pointer',
                                transition: 'all 0.2s var(--ease)',
                                boxShadow: 'var(--shadow-md)'
                            }}
                        >
                            Begin Session
                        </button>
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
                            "{SPEAKING_PROMPTS[promptIndex]}"
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
