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

const Visualizer = () => (
    <div style={{ display: 'flex', gap: '3px', height: '60px', alignItems: 'center', justifyContent: 'center', marginBottom: '32px' }}>
        {[...Array(24)].map((_, i) => (
            <motion.div
                key={i}
                animate={{ 
                    height: [15, 60, 20, 45, 15],
                    opacity: [0.3, 1, 0.5, 0.8, 0.3]
                }}
                transition={{ 
                    repeat: Infinity, 
                    duration: 0.6 + (i * 0.05), 
                    ease: "easeInOut" 
                }}
                style={{ width: '3px', background: 'var(--color-accent)', borderRadius: '4px' }}
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
        <div style={{ padding: '24px' }}>
            <AnimatePresence mode="wait">
                {phase === 'ready' && (
                    <motion.div key="ready" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                        <div style={{ background: 'var(--color-surface)', borderRadius: '16px', padding: '24px', border: `1px solid ${border}`, marginBottom: '32px' }}>
                            <div style={{ fontSize: '10px', color: accent, fontWeight: 700, textTransform: 'uppercase', marginBottom: '12px' }}>Prompt</div>
                            <p style={{ fontSize: '18px', fontWeight: 600, color: text1, lineHeight: 1.5, fontStyle: 'italic', margin: 0 }}>
                                "{SPEAKING_PROMPTS[promptIndex]}"
                            </p>
                            <button onClick={() => setPromptIndex(prev => (prev + 1) % SPEAKING_PROMPTS.length)} style={{ background: 'none', border: 'none', color: text3, cursor: 'pointer', fontSize: '11px', fontWeight: 700, marginTop: '16px', textTransform: 'uppercase' }}>
                                Next Prompt →
                            </button>
                        </div>
                        <button onClick={startRecording} className="lab-retry-btn" style={{ width: '100%', padding: '16px' }}>
                            Start Speaking
                        </button>
                    </motion.div>
                )}

                {phase === 'recording' && (
                    <motion.div key="recording" initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '12px', color: text3, textTransform: 'uppercase', marginBottom: '8px' }}>Now Recording</div>
                        <div style={{ fontSize: '48px', fontWeight: 800, color: accent, marginBottom: '24px', fontFamily: 'var(--font-mono)' }}>0:{timeLeft < 10 ? `0${timeLeft}` : timeLeft}</div>
                        <Visualizer />
                        <button onClick={stopRecording} style={{ background: '#EF4444', color: '#fff', border: 'none', padding: '12px 32px', borderRadius: '12px', fontWeight: 700, cursor: 'pointer' }}>
                            Stop Early
                        </button>
                    </motion.div>
                )}

                {(phase === 'scoring' || phase === 'done') && (
                    <motion.div key="scoring" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                        <h3 style={{ fontSize: '18px', fontWeight: 800, color: text1, marginBottom: '24px' }}>Self-Evaluation</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '32px' }}>
                            {SLIDERS.map(({ key, label, desc }) => (
                                <div key={key}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                        <span style={{ fontSize: '13px', fontWeight: 700, color: text1 }}>{label}</span>
                                        <span style={{ fontSize: '13px', fontWeight: 800, color: accent }}>{scores[key]}%</span>
                                    </div>
                                    <input 
                                        type="range" min="1" max="100" value={scores[key]}
                                        disabled={phase === 'done'}
                                        onChange={e => setScores(s => ({ ...s, [key]: parseInt(e.target.value) }))}
                                        style={{ width: '100%', accentColor: accent }}
                                    />
                                    <div style={{ fontSize: '11px', color: text3, marginTop: '4px' }}>{desc}</div>
                                </div>
                            ))}
                        </div>
                        <textarea 
                            value={notes} onChange={e => setNotes(e.target.value)} 
                            disabled={phase === 'done'}
                            placeholder="Add reflection notes..."
                            style={{ width: '100%', minHeight: '80px', background: 'var(--color-surface)', border: `1px solid ${border}`, borderRadius: '12px', padding: '16px', color: text1, outline: 'none' }}
                        />
                        {phase === 'scoring' ? (
                            <button onClick={handleSave} disabled={saving} className="lab-retry-btn" style={{ width: '100%', marginTop: '24px' }}>
                                {saving ? 'Syncing...' : 'Log Session'}
                            </button>
                        ) : (
                            <div style={{ marginTop: '24px', textAlign: 'center' }}>
                                <p style={{ color: accent, fontWeight: 700 }}>
                                    {result?.mastery_change ? `🏅 ${result.mastery_change.toUpperCase()} earned!` : `Session logged successfully.`}
                                </p>
                                <button onClick={() => setPhase('ready')} style={{ background: 'none', border: `1px solid ${border}`, padding: '12px 24px', borderRadius: '12px', color: text2, cursor: 'pointer', fontWeight: 600 }}>Try Again</button>
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
