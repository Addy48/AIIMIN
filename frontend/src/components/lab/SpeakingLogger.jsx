import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, RotateCcw, Play, Check, BarChart3, Globe, Code, Heart, Coffee, Zap, MessageSquare, X, BrainCircuit, Mic2, AlertCircle, Volume2 } from 'lucide-react';
import { supabase } from '../../utils/supabase';
import { useThemeContext } from '../../context/ThemeContext';
import { DEBATE_TOPICS, CATEGORIZED_PROMPTS } from '../../data/SpeakingTopics';

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

const WaveformVisualizer = ({ isRecording, color, isAi = false }) => {
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
            
            const waves = isAi ? [
                { amp: 60, freq: 0.02, speed: 0.08, opacity: 0.8, lineWidth: 4 },
                { amp: 40, freq: 0.03, speed: -0.06, opacity: 0.5, lineWidth: 3 },
            ] : [
                { amp: 40, freq: 0.01, speed: 0.05, opacity: 0.8, lineWidth: 4 },
                { amp: 30, freq: 0.015, speed: -0.04, opacity: 0.5, lineWidth: 3 },
                { amp: 20, freq: 0.02, speed: 0.08, opacity: 0.3, lineWidth: 2 },
            ];

            waves.forEach((wave, idx) => {
                ctx.beginPath();
                ctx.strokeStyle = color;
                ctx.globalAlpha = wave.opacity * (0.5 + Math.sin(phase * 0.02 + idx) * 0.5);
                ctx.lineWidth = wave.lineWidth;
                ctx.lineCap = 'round';

                for (let x = 0; x < width; x += 1) {
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
    }, [isRecording, color, isAi]);

    return (
        <div style={{ position: 'relative', height: '160px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px' }}>
            {!isRecording ? (
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    {[...Array(12)].map((_, i) => (
                        <motion.div 
                            key={i} 
                            animate={{ height: [8, 16, 8], opacity: [0.1, 0.4, 0.1] }}
                            transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.1 }}
                            style={{ width: '4px', background: color, borderRadius: '2px' }} 
                        />
                    ))}
                </div>
            ) : (
                <div style={{ position: 'relative', width: '100%', height: '100%' }}>
                    <canvas 
                        ref={canvasRef} 
                        width={800} 
                        height={160} 
                        style={{ width: '100%', height: '100%', filter: `blur(1px) drop-shadow(0 0 15px ${color}40)` }} 
                    />
                </div>
            )}
        </div>
    );
};

export default function SpeakingLogger({ onComplete, onClose }) {
    const { theme } = useThemeContext();
    const isDark = theme === 'dark';
    
    const getUnseenPromptIndex = (category) => {
        try {
            const stored = JSON.parse(localStorage.getItem('aiimin_seen_prompts') || '{}');
            const seenIndices = stored[category] || [];
            const max = CATEGORIZED_PROMPTS[category]?.length || 1;
            
            let available = [];
            for(let i=0; i<max; i++) {
                if(!seenIndices.includes(i)) available.push(i);
            }
            
            if (available.length === 0) {
                stored[category] = [];
                localStorage.setItem('aiimin_seen_prompts', JSON.stringify(stored));
                return Math.floor(Math.random() * max);
            }
            
            const chosen = available[Math.floor(Math.random() * available.length)];
            stored[category] = [...seenIndices, chosen];
            localStorage.setItem('aiimin_seen_prompts', JSON.stringify(stored));
            return chosen;
        } catch {
            return Math.floor(Math.random() * (CATEGORIZED_PROMPTS[category]?.length || 1));
        }
    };

    const getUnseenDebateTopic = () => {
        try {
            let seen = JSON.parse(localStorage.getItem('aiimin_seen_debates') || '[]');
            let available = DEBATE_TOPICS.filter(t => !seen.includes(t));
            
            if (available.length === 0) {
                seen = [];
                available = DEBATE_TOPICS;
            }
            
            const chosen = available[Math.floor(Math.random() * available.length)];
            seen.push(chosen);
            localStorage.setItem('aiimin_seen_debates', JSON.stringify(seen));
            return chosen;
        } catch {
            return DEBATE_TOPICS[Math.floor(Math.random() * DEBATE_TOPICS.length)];
        }
    };

    // Modes: 'monologue' | 'debate'
    const [mode, setMode] = useState('monologue');
    
    // Monologue State
    const [selectedTopic, setSelectedTopic] = useState('Technology');
    const [promptIndex, setPromptIndex] = useState(() => getUnseenPromptIndex('Technology'));
    const [scores, setScores] = useState({ confidence_score: 50, clarity_score: 50, pace_score: 50 });
    const [notes, setNotes] = useState('');
    const [phase, setPhase] = useState('ready'); // ready | recording | scoring | done
    const [timeLeft, setTimeLeft] = useState(60);
    const [saving, setSaving] = useState(false);
    const [isSpinning, setIsSpinning] = useState(false);
    
    // Debate State
    const [debateTopic, setDebateTopic] = useState(() => getUnseenDebateTopic());
    const [debatePhase, setDebatePhase] = useState('setup'); // setup | waiting_key | active
    const [isAiSpeaking, setIsAiSpeaking] = useState(false);

    const timerRef = useRef(null);

    const activeTopic = TOPICS.find(t => t.label === selectedTopic) || TOPICS[0];
    const prompts = CATEGORIZED_PROMPTS[selectedTopic] || CATEGORIZED_PROMPTS['Technology'];

    const text1 = 'var(--color-text-1)';
    const text2 = 'var(--color-text-2)';
    const text3 = 'var(--color-text-3)';
    const border = 'var(--color-border)';
    const surface = 'var(--color-surface)';
    const elevated = 'var(--color-elevated)';
    const accent = 'var(--color-accent)';

    // --- Monologue Handlers ---
    const spinTopic = () => {
        setIsSpinning(true);
        let elapsed = 0;
        const spinInt = setInterval(() => {
            const randomTopic = TOPICS[Math.floor(Math.random() * TOPICS.length)].label;
            setSelectedTopic(randomTopic);
            setPromptIndex(Math.floor(Math.random() * (CATEGORIZED_PROMPTS[randomTopic]?.length || 1)));
            elapsed += 80;
            if (elapsed >= 1200) {
                clearInterval(spinInt);
                // Final selection
                const finalTopic = TOPICS[Math.floor(Math.random() * TOPICS.length)].label;
                setSelectedTopic(finalTopic);
                setPromptIndex(getUnseenPromptIndex(finalTopic));
                setIsSpinning(false);
            }
        }, 80);
    };

    const startRecording = () => {
        setPhase('recording');
        setTimeLeft(60);
        timerRef.current = setInterval(() => {
            setTimeLeft(t => {
                if (t <= 1) { stopRecording(); return 0; }
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
            if (user) {
                await supabase.from('lab_speaking_logs').insert({
                    user_id: user.id,
                    ...scores,
                    topic: selectedTopic,
                    prompt: prompts[promptIndex] || null,
                    notes: notes || null,
                    logged_at: new Date().toISOString()
                });
            }
            onComplete?.();
            setPhase('done');
        } catch (err) {
            console.error(err);
        } finally {
            setSaving(false);
        }
    };

    // --- Debate Handlers ---
    const [messages, setMessages] = useState([]);
    const [isDebating, setIsDebating] = useState(false);
    const mediaRecorderRef = useRef(null);
    const audioChunksRef = useRef([]);

    const GEMINI_API_KEY = process.env.REACT_APP_GEMINI_API_KEY;

    const startDebate = () => {
        if (!GEMINI_API_KEY) {
            setDebatePhase('waiting_key');
            return;
        }
        setDebatePhase('active');
        const initialText = `Let's begin. The topic is: "${debateTopic}". Please state your opening argument.`;
        setMessages([{ role: "model", parts: [{ text: initialText }] }]);
        
        const u = new SpeechSynthesisUtterance(initialText);
        u.onstart = () => setIsAiSpeaking(true);
        u.onend = () => setIsAiSpeaking(false);
        window.speechSynthesis.speak(u);
    };

    const handleHoldToSpeakStart = async () => {
        if (isAiSpeaking) {
            window.speechSynthesis.cancel();
            setIsAiSpeaking(false);
        }
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const mediaRecorder = new MediaRecorder(stream, { mimeType: 'audio/webm' });
            mediaRecorderRef.current = mediaRecorder;
            audioChunksRef.current = [];

            mediaRecorder.ondataavailable = (event) => {
                if (event.data.size > 0) audioChunksRef.current.push(event.data);
            };

            mediaRecorder.onstop = async () => {
                const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
                stream.getTracks().forEach(track => track.stop());
                await processUserAudio(audioBlob);
            };

            mediaRecorder.start();
            setPhase('recording');
        } catch (err) {
            console.error('Mic error:', err);
            alert("Microphone access is required.");
        }
    };

    const handleHoldToSpeakStop = () => {
        if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
            mediaRecorderRef.current.stop();
            setPhase('ready');
        }
    };

    const processUserAudio = async (audioBlob) => {
        setIsDebating(true);
        const base64Audio = await new Promise((resolve) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result.split(',')[1]);
            reader.readAsDataURL(audioBlob);
        });

        const newContents = [...messages, {
            role: "user",
            parts: [
                { inlineData: { mimeType: "audio/webm", data: base64Audio } }
            ]
        }];
        setMessages(newContents);

        try {
            const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    systemInstruction: {
                        parts: [{ text: `You are an expert debater. The user is practicing their vocal delivery. The topic is: "${debateTopic}". Keep your responses under 60 seconds, concise, and challenging. Always end by asking a question back to keep the debate going.` }]
                    },
                    contents: newContents
                })
            });
            
            const data = await res.json();
            const aiText = data.candidates?.[0]?.content?.parts?.[0]?.text || "I couldn't process that.";
            
            setMessages([...newContents, { role: "model", parts: [{ text: aiText }] }]);
            
            const u = new SpeechSynthesisUtterance(aiText);
            u.onstart = () => setIsAiSpeaking(true);
            u.onend = () => setIsAiSpeaking(false);
            window.speechSynthesis.speak(u);
        } catch (err) {
            console.error(err);
        } finally {
            setIsDebating(false);
        }
    };

    return (
        <div style={{ maxWidth: '900px', margin: '0 auto', padding: '10px 0', position: 'relative' }}>
            
            {/* Mode Switcher */}
            {(phase === 'ready' && debatePhase === 'setup') && (
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '32px' }}>
                    <div style={{ 
                        display: 'flex', background: elevated, borderRadius: '100px', 
                        padding: '4px', border: `1px solid ${border}` 
                    }}>
                        <button 
                            onClick={() => setMode('monologue')}
                            style={{
                                padding: '8px 24px', borderRadius: '100px', border: 'none',
                                background: mode === 'monologue' ? (isDark ? '#fff' : '#111') : 'transparent',
                                color: mode === 'monologue' ? (isDark ? '#111' : '#fff') : text2,
                                fontWeight: 700, fontSize: '13px', cursor: 'pointer',
                                transition: 'all 0.2s', display: 'flex', alignItems: 'center', gap: '8px'
                            }}
                        >
                            <Mic2 size={16} /> Monologue
                        </button>
                        <button 
                            onClick={() => setMode('debate')}
                            style={{
                                padding: '8px 24px', borderRadius: '100px', border: 'none',
                                background: mode === 'debate' ? (isDark ? '#fff' : '#111') : 'transparent',
                                color: mode === 'debate' ? (isDark ? '#111' : '#fff') : text2,
                                fontWeight: 700, fontSize: '13px', cursor: 'pointer',
                                transition: 'all 0.2s', display: 'flex', alignItems: 'center', gap: '8px'
                            }}
                        >
                            <BrainCircuit size={16} /> AI Debate
                        </button>
                    </div>
                </div>
            )}

            <AnimatePresence mode="wait">
                {/* ── MONOLOGUE MODE ── */}
                {mode === 'monologue' && phase === 'ready' && (
                    <motion.div key="mono-ready" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                            <h1 style={{ fontSize: '42px', fontWeight: 900, color: text1, marginBottom: '12px', fontFamily: 'var(--font-serif)', letterSpacing: '-0.02em' }}>
                                Vocal Mastery
                            </h1>
                            <p style={{ color: text3, fontSize: '14px', maxWidth: '500px', margin: '0 auto', lineHeight: 1.5 }}>
                                Refine your delivery and articulation. Spin for a prompt, speak for 60 seconds, and reflect.
                            </p>
                        </div>

                        <div style={{ display: 'flex', gap: '32px', alignItems: 'flex-start', maxWidth: '1000px', margin: '0 auto' }}>
                            {/* LEFT SIDE: TOPICS */}
                            <div style={{ width: '250px', display: 'flex', flexDirection: 'column', gap: '12px', flexShrink: 0 }}>
                                {TOPICS.map(t => (
                                    <button
                                        key={t.label}
                                        onClick={() => {
                                            setSelectedTopic(t.label);
                                            setPromptIndex(getUnseenPromptIndex(t.label));
                                        }}
                                        style={{
                                            padding: '16px', borderRadius: '16px', border: `1px solid ${selectedTopic === t.label ? t.color : border}`,
                                            background: selectedTopic === t.label ? (isDark ? t.bg : `${t.color}20`) : surface,
                                            color: selectedTopic === t.label ? t.color : text2,
                                            fontSize: '13px', fontWeight: 700, cursor: 'pointer',
                                            display: 'flex', alignItems: 'center', justifyContent: 'flex-start', gap: '12px',
                                            transition: 'all 0.2s', textAlign: 'left'
                                        }}
                                    >
                                        {t.icon} {t.label}
                                    </button>
                                ))}
                            </div>

                            {/* RIGHT SIDE: PROMPT UI & CONTROLS */}
                            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '32px' }}>
                                <div style={{ 
                                    background: elevated, borderRadius: '24px', padding: '60px 40px', 
                                    border: `1px solid ${border}`, minHeight: '300px',
                                    display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center',
                                    textAlign: 'center'
                                }}>
                                    <div style={{ fontSize: '11px', color: activeTopic.color, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: '16px' }}>
                                        {selectedTopic}
                                    </div>
                                    <h2 style={{ fontSize: '26px', fontWeight: 600, color: text1, lineHeight: 1.4, fontFamily: 'var(--font-serif)', maxWidth: '600px' }}>
                                        {isSpinning ? 'Selecting...' : `"${prompts[promptIndex]}"`}
                                    </h2>
                                </div>

                                <div style={{ display: 'flex', justifyContent: 'center', gap: '16px' }}>
                                    <button onClick={spinTopic} disabled={isSpinning} style={{ background: surface, color: text1, border: `1px solid ${border}`, padding: '14px 28px', borderRadius: '12px', fontWeight: 700, cursor: 'pointer', display: 'flex', gap: '8px', alignItems: 'center' }}>
                                        <RotateCcw size={16} /> Randomize
                                    </button>
                                    <button onClick={startRecording} style={{ background: activeTopic.color, color: '#fff', border: 'none', padding: '14px 40px', borderRadius: '12px', fontWeight: 700, cursor: 'pointer', display: 'flex', gap: '8px', alignItems: 'center' }}>
                                        <Mic size={18} /> Start 60s Session
                                    </button>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* ── RECORDING STATE (Monologue) ── */}
                {mode === 'monologue' && phase === 'recording' && (
                    <motion.div key="mono-rec" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} style={{ background: elevated, border: `1px solid ${border}`, borderRadius: '24px', padding: '60px 40px', textAlign: 'center' }}>
                        <div style={{ fontSize: '11px', color: text3, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: '16px' }}>Capturing Audio...</div>
                        <div style={{ fontSize: '72px', fontWeight: 900, color: activeTopic.color, marginBottom: '24px', fontFamily: 'var(--font-mono)' }}>
                            0:{timeLeft < 10 ? `0${timeLeft}` : timeLeft}
                        </div>
                        <WaveformVisualizer isRecording={true} color={activeTopic.color} />
                        <div style={{ fontSize: '20px', color: text1, fontStyle: 'italic', marginBottom: '40px', fontFamily: 'var(--font-serif)' }}>"{prompts[promptIndex]}"</div>
                        <button onClick={stopRecording} style={{ background: '#ef4444', color: '#fff', border: 'none', padding: '14px 40px', borderRadius: '12px', fontWeight: 700, cursor: 'pointer' }}>Complete Early</button>
                    </motion.div>
                )}

                {/* ── SCORING STATE (Monologue) ── */}
                {mode === 'monologue' && (phase === 'scoring' || phase === 'done') && (
                    <motion.div key="mono-score" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ background: surface, borderRadius: '24px', padding: '40px', border: `1px solid ${border}` }}>
                        <h3 style={{ fontSize: '20px', fontWeight: 800, color: text1, marginBottom: '32px' }}>Self Assessment</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', marginBottom: '32px' }}>
                            {SLIDERS.map(({ key, label, desc }) => (
                                <div key={key}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                        <span style={{ fontSize: '14px', fontWeight: 700, color: text1 }}>{label}</span>
                                        <span style={{ fontSize: '16px', fontWeight: 800, color: activeTopic.color }}>{scores[key]}</span>
                                    </div>
                                    <input type="range" min="1" max="100" value={scores[key]} disabled={phase === 'done'} onChange={e => setScores(s => ({ ...s, [key]: parseInt(e.target.value) }))} style={{ width: '100%', accentColor: activeTopic.color }} />
                                </div>
                            ))}
                        </div>
                        <textarea value={notes} onChange={e => setNotes(e.target.value)} disabled={phase === 'done'} placeholder="Key takeaways..." style={{ width: '100%', minHeight: '100px', background: elevated, border: `1px solid ${border}`, borderRadius: '12px', padding: '16px', color: text1, marginBottom: '24px', resize: 'none' }} />
                        {phase === 'scoring' ? (
                            <button onClick={handleSave} disabled={saving} style={{ width: '100%', background: activeTopic.color, color: '#fff', border: 'none', padding: '16px', borderRadius: '12px', fontWeight: 700, cursor: 'pointer' }}>
                                {saving ? 'Finalizing...' : 'Save Session'}
                            </button>
                        ) : (
                            <button onClick={() => setPhase('ready')} style={{ width: '100%', background: elevated, color: text1, border: `1px solid ${border}`, padding: '16px', borderRadius: '12px', fontWeight: 700, cursor: 'pointer' }}>New Session</button>
                        )}
                    </motion.div>
                )}

                {/* ── DEBATE MODE ── */}
                {mode === 'debate' && debatePhase === 'setup' && (
                    <motion.div key="deb-setup" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                            <h1 style={{ fontSize: '42px', fontWeight: 900, color: text1, marginBottom: '12px', fontFamily: 'var(--font-serif)', letterSpacing: '-0.02em' }}>
                                AI Sparring Partner
                            </h1>
                            <p style={{ color: text3, fontSize: '14px', maxWidth: '500px', margin: '0 auto', lineHeight: 1.5 }}>
                                Engage in a real-time vocal debate with an AI. It will listen to your arguments, counter them, and grade your rhetoric.
                            </p>
                        </div>
                        
                        <div style={{ display: 'flex', gap: '32px', alignItems: 'flex-start', maxWidth: '1000px', margin: '0 auto' }}>
                            {/* LEFT SIDE: TOPICS LIST */}
                            <div style={{ width: '300px', display: 'flex', flexDirection: 'column', gap: '12px', flexShrink: 0 }}>
                                <div style={{ fontSize: '12px', fontWeight: 700, color: text2, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '4px' }}>Select Topic</div>
                                
                                <div style={{ maxHeight: '400px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '10px', paddingRight: '8px' }}>
                                    {DEBATE_TOPICS.map(topic => (
                                        <button 
                                            key={topic}
                                            onClick={() => setDebateTopic(topic)}
                                            style={{
                                                textAlign: 'left', padding: '16px', borderRadius: '12px',
                                                background: debateTopic === topic ? (isDark ? 'rgba(99, 102, 241, 0.15)' : '#eef2ff') : surface,
                                                border: `1px solid ${debateTopic === topic ? '#6366f1' : border}`,
                                                color: debateTopic === topic ? (isDark ? '#a5b4fc' : '#4f46e5') : text1,
                                                fontWeight: debateTopic === topic ? 700 : 500, fontSize: '13px', lineHeight: 1.4,
                                                cursor: 'pointer', transition: 'all 0.2s'
                                            }}
                                        >
                                            {topic}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            
                            {/* RIGHT SIDE: SELECTED TOPIC & START */}
                            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '32px' }}>
                                <div style={{ 
                                    background: elevated, border: `1px solid ${border}`, borderRadius: '24px', 
                                    padding: '60px 40px', minHeight: '300px', display: 'flex', flexDirection: 'column',
                                    justifyContent: 'center', alignItems: 'center', textAlign: 'center' 
                                }}>
                                    <div style={{ fontSize: '11px', color: '#6366f1', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: '16px' }}>Current Debate Topic</div>
                                    <div style={{ fontSize: '26px', fontWeight: 700, color: text1, lineHeight: 1.4, fontFamily: 'var(--font-serif)', maxWidth: '600px' }}>
                                        "{debateTopic}"
                                    </div>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'center', gap: '16px' }}>
                                    <button 
                                        onClick={() => setDebateTopic(getUnseenDebateTopic())} 
                                        style={{ background: surface, color: text1, border: `1px solid ${border}`, padding: '14px 28px', borderRadius: '12px', fontWeight: 700, cursor: 'pointer', display: 'flex', gap: '8px', alignItems: 'center' }}
                                    >
                                        <RotateCcw size={16} /> Randomize
                                    </button>
                                    <button 
                                        onClick={startDebate}
                                        style={{ background: '#6366f1', color: '#fff', border: 'none', padding: '14px 40px', borderRadius: '12px', fontWeight: 700, cursor: 'pointer', display: 'flex', gap: '8px', alignItems: 'center' }}
                                    >
                                        <BrainCircuit size={18} /> Connect to AI
                                    </button>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* ── DEBATE MODE: WAITING FOR KEY ── */}
                {mode === 'debate' && debatePhase === 'waiting_key' && (
                    <motion.div key="deb-wait" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} style={{ background: elevated, border: `1px dashed ${border}`, borderRadius: '24px', padding: '60px 40px', textAlign: 'center' }}>
                        <div style={{ display: 'inline-flex', background: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b', padding: '16px', borderRadius: '50%', marginBottom: '24px' }}>
                            <AlertCircle size={32} />
                        </div>
                        <h2 style={{ fontSize: '24px', fontWeight: 800, color: text1, marginBottom: '12px' }}>Gemini API Key Required</h2>
                        <p style={{ color: text2, fontSize: '14px', maxWidth: '400px', margin: '0 auto 32px', lineHeight: 1.6 }}>
                            To power the real-time bidirectional voice debate, AIIMIN requires a Gemini API key. Ensure REACT_APP_GEMINI_API_KEY is set in your .env file.
                        </p>
                        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
                            <button onClick={() => setDebatePhase('setup')} style={{ background: surface, color: text1, border: `1px solid ${border}`, padding: '12px 24px', borderRadius: '10px', fontWeight: 600, cursor: 'pointer' }}>Back to Setup</button>
                        </div>
                    </motion.div>
                )}

                {/* ── DEBATE MODE: ACTIVE ── */}
                {mode === 'debate' && debatePhase === 'active' && (
                    <motion.div key="deb-active" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} style={{ background: elevated, border: `1px solid ${border}`, borderRadius: '24px', padding: '40px', display: 'flex', flexDirection: 'column', gap: '32px' }}>
                        <div style={{ textAlign: 'center' }}>
                            <div style={{ fontSize: '11px', color: '#6366f1', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: '8px' }}>Active Debate</div>
                            <h2 style={{ fontSize: '20px', fontWeight: 700, color: text1, margin: 0 }}>"{debateTopic}"</h2>
                        </div>
                        
                        <div style={{ flex: 1, background: surface, border: `1px solid ${border}`, borderRadius: '16px', padding: '24px', minHeight: '300px', maxHeight: '400px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            {messages.map((msg, idx) => (
                                <div key={idx} style={{ alignSelf: msg.role === 'model' ? 'flex-start' : 'flex-end', maxWidth: '80%' }}>
                                    <div style={{ fontSize: '11px', fontWeight: 700, color: text3, marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.05em', textAlign: msg.role === 'model' ? 'left' : 'right' }}>
                                        {msg.role === 'model' ? 'AI Sparring Partner' : 'You'}
                                    </div>
                                    <div style={{
                                        background: msg.role === 'model' ? (isDark ? 'rgba(99, 102, 241, 0.15)' : '#eef2ff') : (isDark ? '#2a2a2a' : '#f3f4f6'),
                                        color: msg.role === 'model' ? (isDark ? '#a5b4fc' : '#4f46e5') : text1,
                                        padding: '12px 16px', borderRadius: '12px', fontSize: '14px', lineHeight: 1.5,
                                        border: msg.role === 'model' ? `1px solid rgba(99, 102, 241, 0.3)` : `1px solid ${border}`
                                    }}>
                                        {msg.parts[0].text || "🎙️ Audio Segment Sent"}
                                    </div>
                                </div>
                            ))}
                            {isDebating && (
                                <div style={{ alignSelf: 'flex-start', color: text3, fontSize: '13px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1 }}>Thinking & Evaluating...</motion.div>
                                </div>
                            )}
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
                            {phase === 'recording' || isAiSpeaking ? (
                                <WaveformVisualizer isRecording={true} color="#6366f1" isAi={isAiSpeaking} />
                            ) : (
                                <div style={{ height: '160px', display: 'flex', alignItems: 'center', color: text3, fontSize: '13px' }}>Hold mic button below to respond</div>
                            )}

                            <button 
                                onMouseDown={handleHoldToSpeakStart} 
                                onMouseUp={handleHoldToSpeakStop}
                                onMouseLeave={handleHoldToSpeakStop}
                                disabled={isDebating}
                                style={{ 
                                    background: isDebating ? surface : (phase === 'recording' ? '#ef4444' : '#6366f1'), 
                                    color: isDebating ? text3 : '#fff', 
                                    border: isDebating ? `1px solid ${border}` : 'none', 
                                    padding: '20px 48px', borderRadius: '100px', fontWeight: 800, fontSize: '15px', 
                                    cursor: isDebating ? 'not-allowed' : 'pointer', display: 'flex', gap: '10px', alignItems: 'center', 
                                    boxShadow: phase === 'recording' ? '0 0 0 8px rgba(239, 68, 68, 0.2)' : '0 8px 24px rgba(99,102,241,0.3)',
                                    transition: 'all 0.2s', userSelect: 'none'
                                }}
                            >
                                <Mic size={20} /> {phase === 'recording' ? 'Recording... Release to send' : 'Hold to Speak'}
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
