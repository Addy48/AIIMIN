import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, RotateCcw, Globe, Code, Heart, Coffee, Zap, MessageSquare, BrainCircuit, Mic2, AlertCircle } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { supabase } from '../../utils/supabase';
import { useThemeContext } from '../../context/ThemeContext';
import { DEBATE_TOPICS, CATEGORIZED_PROMPTS } from '../../data/SpeakingTopics';
import { proxyGeminiGenerate } from '../../utils/serverAi';

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

export default function VocalMastery({ onComplete, onClose }) {
    const { isDark } = useThemeContext();
    const { user } = useAuth();
    
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
    const [messages, setMessages] = useState([]);
    const [isThinking, setIsThinking] = useState(false);
    
    const mediaRecorderRef = useRef(null);
    const audioChunksRef = useRef([]);
    const timerRef = useRef(null);

    const activeTopic = TOPICS.find(t => t.label === selectedTopic) || TOPICS[0];
    const prompts = CATEGORIZED_PROMPTS[selectedTopic] || CATEGORIZED_PROMPTS['Technology'];

    const text1 = 'var(--color-text-1)';
    const text2 = 'var(--color-text-2)';
    const text3 = 'var(--color-text-3)';
    const border = 'var(--color-border)';
    const surface = 'var(--color-surface)';
    const elevated = 'var(--color-elevated)';

    // --- Voice Initialization ---
    useEffect(() => {
        const loadVoices = () => { window.speechSynthesis.getVoices(); };
        loadVoices();
        if (window.speechSynthesis.onvoiceschanged !== undefined) {
            window.speechSynthesis.onvoiceschanged = loadVoices;
        }
    }, []);

    const getBestVoice = () => {
        const voices = window.speechSynthesis.getVoices();
        return voices.find(v => v.name.includes('Google US English') || v.name.includes('Samantha') || v.name.includes('Daniel') || v.name.includes('Premium')) || voices[0];
    };

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
            if (user?.id) {
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
    const startDebate = () => {
        setDebatePhase('active');
        const initialText = `Let's begin. The topic is: "${debateTopic}". Please state your opening argument.`;
        setMessages([]); // Start empty so user audio is the first message
        
        const u = new SpeechSynthesisUtterance(initialText);
        const bestVoice = getBestVoice();
        if (bestVoice) u.voice = bestVoice;
        u.rate = 1.05;
        
        u.onstart = () => setIsAiSpeaking(true);
        u.onend = () => setIsAiSpeaking(false);
        window.speechSynthesis.speak(u);
    };

    const startVoiceRecording = async () => {
        if (isAiSpeaking) {
            window.speechSynthesis.cancel();
            setIsAiSpeaking(false);
        }
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            
            // Fallback for Safari which might not support audio/webm
            let options = { mimeType: 'audio/webm' };
            if (!MediaRecorder.isTypeSupported('audio/webm')) {
                options = { mimeType: 'audio/mp4' };
            }
            
            const mediaRecorder = new MediaRecorder(stream, options);
            mediaRecorderRef.current = mediaRecorder;
            audioChunksRef.current = [];

            mediaRecorder.ondataavailable = (event) => {
                if (event.data.size > 0) audioChunksRef.current.push(event.data);
            };

            mediaRecorder.onstop = async () => {
                const audioBlob = new Blob(audioChunksRef.current, { type: options.mimeType });
                stream.getTracks().forEach(track => track.stop());
                await processUserAudio(audioBlob, options.mimeType);
            };

            mediaRecorder.start();
            setPhase('recording');
        } catch (err) {
            console.error('Mic error:', err);
            alert("Microphone access is required or unsupported on this browser.");
        }
    };

    const stopVoiceRecording = () => {
        if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
            mediaRecorderRef.current.stop();
            setPhase('ready');
        }
    };

    const processUserAudio = async (audioBlob, mimeType) => {
        setIsThinking(true);
        const base64Audio = await new Promise((resolve) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result.split(',')[1]);
            reader.readAsDataURL(audioBlob);
        });

        const newContents = [...messages, {
            role: "user",
            parts: [
                { inlineData: { mimeType: mimeType, data: base64Audio } }
            ]
        }];
        setMessages(newContents);

        try {
            const data = await proxyGeminiGenerate({
                model: 'gemini-2.0-flash',
                systemInstruction: {
                    parts: [{ text: `You are an expert sparring partner for the topic: "${debateTopic}". Keep your response concise (under 3 sentences).` }]
                },
                contents: newContents,
            });

            const responseText = data.text || "I couldn't process that.";
            
            setMessages([...newContents, { role: "model", parts: [{ text: responseText }] }]);
            
            const u = new SpeechSynthesisUtterance(responseText);
            const bestVoice = getBestVoice();
            if (bestVoice) u.voice = bestVoice;
            u.rate = 1.05;
            
            u.onstart = () => setIsAiSpeaking(true);
            u.onend = () => setIsAiSpeaking(false);
            window.speechSynthesis.speak(u);
        } catch (err) {
            console.error("Audio processing failed:", err);
            const errorMsg = "Sorry, I had trouble hearing that. Could you try again?";
            setMessages([...newContents, { role: "model", parts: [{ text: `[Error] ${err.message}` }] }]);
            
            const u = new SpeechSynthesisUtterance(errorMsg);
            u.onstart = () => setIsAiSpeaking(true);
            u.onend = () => setIsAiSpeaking(false);
            window.speechSynthesis.speak(u);
        } finally {
            setIsThinking(false);
        }
    };

    // Spacebar toggling
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.code === 'Space') {
                if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
                e.preventDefault();
                
                if (mode === 'monologue') {
                    if (phase === 'ready') {
                        startRecording();
                    } else if (phase === 'recording') {
                        stopRecording();
                    }
                } else if (mode === 'debate') {
                    if (debatePhase === 'active' && !isThinking && !isAiSpeaking) {
                        if (phase !== 'recording') {
                            startVoiceRecording();
                        } else {
                            stopVoiceRecording();
                        }
                    }
                }
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [mode, phase, debatePhase, isThinking, isAiSpeaking]);

    return (
        <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '20px 0', position: 'relative' }}>

            
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
                                padding: '12px 32px', borderRadius: '100px', border: 'none',
                                background: mode === 'monologue' ? (isDark ? '#fff' : '#111') : 'transparent',
                                color: mode === 'monologue' ? (isDark ? '#111' : '#fff') : text2,
                                fontWeight: 700, fontSize: '15px', cursor: 'pointer',
                                transition: 'all 0.2s', display: 'flex', alignItems: 'center', gap: '8px'
                            }}
                        >
                            <Mic2 size={18} /> Monologue
                        </button>
                        <button 
                            onClick={() => setMode('debate')}
                            style={{
                                padding: '12px 32px', borderRadius: '100px', border: 'none',
                                background: mode === 'debate' ? (isDark ? '#fff' : '#111') : 'transparent',
                                color: mode === 'debate' ? (isDark ? '#111' : '#fff') : text2,
                                fontWeight: 700, fontSize: '15px', cursor: 'pointer',
                                transition: 'all 0.2s', display: 'flex', alignItems: 'center', gap: '8px'
                            }}
                        >
                            <BrainCircuit size={18} /> Sparring Partner
                        </button>
                    </div>
                </div>
            )}

            <AnimatePresence mode="wait">
                {/* ── MONOLOGUE MODE ── */}
                {mode === 'monologue' && phase === 'ready' && (
                    <motion.div key="mono-ready" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                            <h1 style={{ fontSize: '56px', fontWeight: 900, color: text1, marginBottom: '16px', fontFamily: 'var(--font-serif)', letterSpacing: '-0.02em' }}>
                                Vocal Mastery
                            </h1>
                            <p style={{ color: text3, fontSize: '18px', maxWidth: '600px', margin: '0 auto', lineHeight: 1.5 }}>
                                Refine your delivery and articulation. Spin for a prompt, speak for 60 seconds, and reflect.
                            </p>
                        </div>

                        <div style={{ display: 'flex', gap: '40px', alignItems: 'flex-start', maxWidth: '1100px', margin: '0 auto' }}>
                            {/* LEFT SIDE: TOPICS */}
                            <div style={{ width: '300px', display: 'flex', flexDirection: 'column', gap: '16px', flexShrink: 0 }}>
                                {TOPICS.map(t => (
                                    <button
                                        key={t.label}
                                        onClick={() => {
                                            setSelectedTopic(t.label);
                                            setPromptIndex(getUnseenPromptIndex(t.label));
                                        }}
                                        style={{
                                            padding: '20px', borderRadius: '16px', border: `2px solid ${selectedTopic === t.label ? t.color : border}`,
                                            background: selectedTopic === t.label ? (isDark ? t.bg : `${t.color}20`) : surface,
                                            color: selectedTopic === t.label ? t.color : text2,
                                            fontSize: '16px', fontWeight: 700, cursor: 'pointer',
                                            display: 'flex', alignItems: 'center', justifyContent: 'flex-start', gap: '16px',
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
                                    background: elevated, borderRadius: '24px', padding: '80px 40px', 
                                    border: `1px solid ${border}`, minHeight: '400px',
                                    display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center',
                                    textAlign: 'center'
                                }}>
                                    <div style={{ fontSize: '14px', color: activeTopic.color, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: '24px' }}>
                                        {selectedTopic}
                                    </div>
                                    <h2 style={{ fontSize: '36px', fontWeight: 600, color: text1, lineHeight: 1.4, fontFamily: 'var(--font-serif)', maxWidth: '700px' }}>
                                        {isSpinning ? 'Selecting...' : `"${prompts[promptIndex]}"`}
                                    </h2>
                                </div>

                                <div style={{ display: 'flex', justifyContent: 'center', gap: '24px' }}>
                                    <button onClick={spinTopic} disabled={isSpinning} style={{ background: surface, color: text1, border: `2px solid ${border}`, padding: '20px 40px', borderRadius: '16px', fontSize: '18px', fontWeight: 700, cursor: 'pointer', display: 'flex', gap: '12px', alignItems: 'center' }}>
                                        <RotateCcw size={20} /> Randomize
                                    </button>
                                    <button onClick={startRecording} style={{ background: activeTopic.color, color: '#fff', border: 'none', padding: '20px 48px', borderRadius: '16px', fontSize: '18px', fontWeight: 700, cursor: 'pointer', display: 'flex', gap: '12px', alignItems: 'center' }}>
                                        <Mic size={20} /> Start (Press Space)
                                    </button>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* ── RECORDING STATE (Monologue) ── */}
                {mode === 'monologue' && phase === 'recording' && (
                    <motion.div key="mono-rec" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} style={{ background: elevated, border: `1px solid ${border}`, borderRadius: '24px', padding: '80px 40px', textAlign: 'center' }}>
                        <div style={{ fontSize: '14px', color: text3, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: '24px' }}>Capturing Audio...</div>
                        <div style={{ fontSize: '96px', fontWeight: 900, color: activeTopic.color, marginBottom: '32px', fontFamily: 'var(--font-mono)' }}>
                            0:{timeLeft < 10 ? `0${timeLeft}` : timeLeft}
                        </div>
                        <WaveformVisualizer isRecording={true} color={activeTopic.color} />
                        <div style={{ fontSize: '28px', color: text1, fontStyle: 'italic', marginBottom: '40px', fontFamily: 'var(--font-serif)' }}>"{prompts[promptIndex]}"</div>
                        <button onClick={stopRecording} style={{ background: '#ef4444', color: '#fff', border: 'none', padding: '20px 48px', borderRadius: '16px', fontSize: '18px', fontWeight: 700, cursor: 'pointer' }}>Complete Early (Press Space)</button>
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
                        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                            <h1 style={{ fontSize: '56px', fontWeight: 900, color: text1, marginBottom: '16px', fontFamily: 'var(--font-serif)', letterSpacing: '-0.02em' }}>
                                Sparring Partner
                            </h1>
                            <p style={{ color: text3, fontSize: '18px', maxWidth: '600px', margin: '0 auto', lineHeight: 1.5 }}>
                                Engage in a real-time vocal debate. Practice responding to counters and maintaining your composure.
                            </p>
                        </div>
                        
                        <div style={{ display: 'flex', gap: '40px', alignItems: 'flex-start', maxWidth: '1100px', margin: '0 auto' }}>
                            {/* LEFT SIDE: TOPICS LIST */}
                            <div style={{ width: '350px', display: 'flex', flexDirection: 'column', gap: '16px', flexShrink: 0 }}>
                                <div style={{ fontSize: '12px', fontWeight: 700, color: text2, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '4px' }}>Select Topic</div>
                                
                                <div style={{ maxHeight: '400px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '10px', paddingRight: '8px' }}>
                                    {DEBATE_TOPICS.map(topic => (
                                        <button 
                                            key={topic}
                                            onClick={() => setDebateTopic(topic)}
                                            style={{
                                                textAlign: 'left', padding: '20px', borderRadius: '16px',
                                                background: debateTopic === topic ? (isDark ? 'rgba(99, 102, 241, 0.15)' : '#eef2ff') : surface,
                                                border: `2px solid ${debateTopic === topic ? '#6366f1' : border}`,
                                                color: debateTopic === topic ? (isDark ? '#a5b4fc' : '#4f46e5') : text1,
                                                fontWeight: debateTopic === topic ? 700 : 500, fontSize: '16px', lineHeight: 1.4,
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
                                    padding: '80px 40px', minHeight: '400px', display: 'flex', flexDirection: 'column',
                                    justifyContent: 'center', alignItems: 'center', textAlign: 'center' 
                                }}>
                                    <div style={{ fontSize: '14px', color: '#6366f1', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: '24px' }}>Current Topic</div>
                                    <div style={{ fontSize: '36px', fontWeight: 700, color: text1, lineHeight: 1.4, fontFamily: 'var(--font-serif)', maxWidth: '700px' }}>
                                        "{debateTopic}"
                                    </div>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'center', gap: '24px' }}>
                                    <button 
                                        onClick={() => setDebateTopic(getUnseenDebateTopic())} 
                                        style={{ background: surface, color: text1, border: `2px solid ${border}`, padding: '20px 40px', borderRadius: '16px', fontSize: '18px', fontWeight: 700, cursor: 'pointer', display: 'flex', gap: '12px', alignItems: 'center' }}
                                    >
                                        <RotateCcw size={20} /> Randomize
                                    </button>
                                    <button 
                                        onClick={startDebate}
                                        style={{ background: '#6366f1', color: '#fff', border: 'none', padding: '20px 48px', borderRadius: '16px', fontSize: '18px', fontWeight: 700, cursor: 'pointer', display: 'flex', gap: '12px', alignItems: 'center' }}
                                    >
                                        <BrainCircuit size={20} /> Initialize Session
                                    </button>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* ── DEBATE MODE: WAITING FOR KEY ── */}
                {mode === 'debate' && debatePhase === 'waiting_key' && (
                    <motion.div key="deb-wait" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} style={{ background: elevated, border: `1px dashed ${border}`, borderRadius: '24px', padding: '60px 40px', textAlign: 'center' }}>
                        <div style={{ backgroundColor: surface, padding: '40px', borderRadius: '16px', border: `1px solid ${border}`, textAlign: 'center' }}>
                            <h2 style={{ fontSize: '24px', fontWeight: 800, color: text1, marginBottom: '12px' }}>Voice API Key Required</h2>
                            <p style={{ color: text2, lineHeight: 1.6, marginBottom: '24px', maxWidth: '400px', margin: '0 auto 24px auto' }}>
                                To power the real-time bidirectional voice debate, AIIMIN requires a Gemini API key. Ensure REACT_APP_GEMINI_API_KEY is set in your .env file.
                            </p>
                            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
                                <button onClick={() => setDebatePhase('setup')} style={{ background: surface, color: text1, border: `1px solid ${border}`, padding: '12px 24px', borderRadius: '10px', fontWeight: 600, cursor: 'pointer' }}>Back to Setup</button>
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* ── DEBATE MODE: ACTIVE ── */}
                {mode === 'debate' && debatePhase === 'active' && (
                    <motion.div key="deb-active" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} style={{ background: elevated, border: `1px solid ${border}`, borderRadius: '24px', padding: '60px', display: 'flex', flexDirection: 'column', gap: '40px', maxWidth: '900px', margin: '0 auto' }}>
                        <div style={{ textAlign: 'center' }}>
                            <div style={{ fontSize: '14px', color: '#6366f1', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: '8px' }}>Active Debate</div>
                            <h2 style={{ fontSize: '28px', fontWeight: 700, color: text1, margin: 0, fontFamily: 'var(--font-serif)' }}>"{debateTopic}"</h2>
                        </div>
                        
                        <div style={{ flex: 1, background: surface, border: `1px solid ${border}`, borderRadius: '16px', padding: '32px', minHeight: '400px', maxHeight: '500px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
                            {messages.map((msg, idx) => (
                                <div key={idx} style={{ alignSelf: msg.role === 'model' ? 'flex-start' : 'flex-end', maxWidth: '80%' }}>
                                    <div style={{ fontSize: '13px', fontWeight: 700, color: text3, marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.05em', textAlign: msg.role === 'model' ? 'left' : 'right' }}>
                                        {msg.role === 'model' ? 'AI Sparring Partner' : 'You'}
                                    </div>
                                    <div style={{
                                        background: msg.role === 'model' ? (isDark ? 'rgba(99, 102, 241, 0.15)' : '#eef2ff') : (isDark ? '#2a2a2a' : '#f3f4f6'),
                                        color: msg.role === 'model' ? (isDark ? '#a5b4fc' : '#4f46e5') : text1,
                                        padding: '16px 24px', borderRadius: '16px', fontSize: '16px', lineHeight: 1.6,
                                        border: msg.role === 'model' ? `1px solid rgba(99, 102, 241, 0.3)` : `1px solid ${border}`
                                    }}>
                                        {msg.parts[0].text || "🎙️ Audio Segment Sent"}
                                    </div>
                                </div>
                            ))}
                            {isThinking && (
                                <div style={{ alignSelf: 'flex-start', color: text3, fontSize: '15px', display: 'flex', alignItems: 'center', gap: '8px', padding: '0 8px' }}>
                                    <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1 }}>Thinking & Evaluating...</motion.div>
                                </div>
                            )}
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
                            {phase === 'recording' || isAiSpeaking ? (
                                <WaveformVisualizer isRecording={true} color="#6366f1" isAi={isAiSpeaking} />
                            ) : (
                                <div style={{ height: '160px', display: 'flex', alignItems: 'center', color: text3, fontSize: '15px', fontWeight: 600 }}>Click mic button or press Space to respond</div>
                            )}

                            <button 
                                onClick={() => {
                                    if (phase !== 'recording') startVoiceRecording();
                                    else stopVoiceRecording();
                                }}
                                disabled={isThinking}
                                style={{ 
                                    background: isThinking ? surface : (phase === 'recording' ? '#ef4444' : '#6366f1'), 
                                    color: isThinking ? text3 : '#fff', 
                                    border: isThinking ? `1px solid ${border}` : 'none', 
                                    padding: '24px 56px', borderRadius: '100px', fontWeight: 800, fontSize: '18px', 
                                    cursor: isThinking ? 'not-allowed' : 'pointer', display: 'flex', gap: '12px', alignItems: 'center', 
                                    boxShadow: phase === 'recording' ? '0 0 0 12px rgba(239, 68, 68, 0.2)' : '0 12px 32px rgba(99,102,241,0.3)',
                                    transition: 'all 0.2s', userSelect: 'none'
                                }}
                            >
                                <Mic size={24} /> {phase === 'recording' ? 'Recording... Press Space to Send' : 'Press Space to Speak'}
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
