import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Loader2, ChevronRight, Star } from 'lucide-react';
import { supabase } from '../utils/supabase';

/* ─── helpers ──────────────────────────────────────────────── */
const PIN_DIGITS  = 6;

const slide = (dir = 1) => ({
    initial:   { opacity: 0, x: dir * 48 },
    animate:   { opacity: 1, x: 0,        transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] } },
    exit:      { opacity: 0, x: dir * -48, transition: { duration: 0.22 } },
});

/* ─── Numpad ────────────────────────────────────────────────── */
const KEYS = ['1','2','3','4','5','6','7','8','9','','0','⌫'];

function Numpad({ value, onChange, disabled }) {
    const tap = (k) => {
        if (disabled) return;
        if (k === '⌫') return onChange(value.slice(0, -1));
        if (k === '')  return;
        if (value.length >= PIN_DIGITS) return;
        onChange(value + k);
    };

    return (
        <div style={{ width: '100%', maxWidth: '280px', margin: '0 auto' }}>
            {/* Dots */}
            <div style={{ display: 'flex', gap: '14px', justifyContent: 'center', marginBottom: '32px' }}>
                {Array.from({ length: PIN_DIGITS }).map((_, i) => (
                    <motion.div
                        key={i}
                        animate={{ scale: i < value.length ? 1.1 : 1 }}
                        style={{
                            width: '14px', height: '14px', borderRadius: '50%',
                            background: i < value.length ? 'var(--color-accent)' : 'var(--border)',
                            transition: 'background 0.15s',
                        }}
                    />
                ))}
            </div>
            {/* Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
                {KEYS.map((k, idx) => (
                    <motion.button
                        key={idx}
                        whileTap={k ? { scale: 0.91 } : {}}
                        onClick={() => tap(k)}
                        disabled={disabled || k === ''}
                        style={{
                            height: '64px', borderRadius: '14px',
                            border: '1px solid var(--border)',
                            background: k === '' ? 'transparent' : 'var(--bg-card)',
                            color: k === '⌫' ? 'var(--text-2)' : 'var(--text-1)',
                            fontSize: k === '⌫' ? '20px' : '22px',
                            fontWeight: 600, cursor: k === '' ? 'default' : 'pointer',
                            transition: 'background 0.15s, border-color 0.15s',
                            fontFamily: 'var(--font-sans)',
                            boxShadow: 'none',
                            outline: 'none',
                        }}
                        onMouseEnter={e => { if (k && k !== '') e.currentTarget.style.background = 'var(--bg-elevated)'; }}
                        onMouseLeave={e => { if (k && k !== '') e.currentTarget.style.background = 'var(--bg-card)'; }}
                    >
                        {k}
                    </motion.button>
                ))}
            </div>
        </div>
    );
}

/* ─── StepIndicator ─────────────────────────────────────────── */
function StepIndicator({ current, total }) {
    return (
        <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', marginBottom: '40px' }}>
            {Array.from({ length: total }).map((_, i) => (
                <motion.div
                    key={i}
                    animate={{
                        width: i === current ? '28px' : '8px',
                        background: i <= current ? 'var(--color-accent)' : 'var(--border)',
                    }}
                    transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                    style={{ height: '8px', borderRadius: '100px' }}
                />
            ))}
        </div>
    );
}

const GOAL_OPTIONS = [
    { id: 'career', label: 'Land a Top Job', icon: '💼' },
    { id: 'health', label: 'Get in Shape', icon: '🏃‍♂️' },
    { id: 'finance', label: 'Financial Freedom', icon: '💰' },
    { id: 'skills', label: 'Master New Skills', icon: '🧠' },
    { id: 'peace', label: 'Mental Peace', icon: '🧘‍♂️' }
];

const HABIT_OPTIONS = [
    { id: 'workout', label: 'Morning Workout', icon: '💪' },
    { id: 'read', label: 'Read 10 Pages', icon: '📚' },
    { id: 'code', label: 'Code / DSA', icon: '💻' },
    { id: 'journal', label: 'Journaling', icon: '📓' },
    { id: 'meditate', label: 'Meditation', icon: '🧘' },
    { id: 'water', label: 'Drink Water', icon: '💧' }
];

/* ─── Main Onboarding Component ─────────────────────────────── */
export default function Onboarding() {
    const navigate = useNavigate();

    const [step,       setStep]       = useState(0);
    const [dir,        setDir]        = useState(1);
    const [fullName,   setFullName]   = useState('');
    const [username,   setUsername]   = useState('');
    const [pin,        setPin]        = useState('');
    const [confirmPin, setConfirmPin] = useState('');
    
    // New Onboarding fields
    const [selectedGoals, setSelectedGoals] = useState([]);
    const [selectedHabits, setSelectedHabits] = useState([]);
    const [wakeTime, setWakeTime] = useState('07:00');

    const [loading,    setLoading]    = useState(false);
    const [error,      setError]      = useState('');
    const [usernameStatus, setUsernameStatus] = useState('idle'); // idle | checking | available | taken

    const TOTAL_STEPS = 8; // 0 to 7. Step 8 is success

    // Pre-fill name from Google metadata
    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            if (!session) { navigate('/login', { replace: true }); return; }
            const meta = session.user?.user_metadata;
            if (meta?.full_name) setFullName(meta.full_name);
            else if (meta?.name) setFullName(meta.name);
        });
    }, [navigate]);

    // Username availability check (debounced)
    useEffect(() => {
        if (!username || username.length < 3) { setUsernameStatus('idle'); return; }
        const upper = username.toUpperCase();
        if (!/^[A-Z0-9@,._\-=+*^$#!]{8}$/i.test(upper)) { setUsernameStatus('idle'); return; }

        setUsernameStatus('checking');
        const timer = setTimeout(async () => {
            try {
                const res = await fetch(`/api/auth/resolve?identifier=${encodeURIComponent(upper)}`);
                setUsernameStatus(res.status === 404 ? 'available' : 'taken');
            } catch {
                setUsernameStatus('idle');
            }
        }, 500);
        return () => clearTimeout(timer);
    }, [username]);

    const next = useCallback(() => {
        setError('');
        setDir(1);
        setStep(s => s + 1);
    }, []);

    const back = useCallback(() => {
        setError('');
        setDir(-1);
        setStep(s => s - 1);
    }, []);

    /* ── Step 0: Name ── */
    const submitName = () => {
        if (!fullName.trim()) { setError('Please enter your name'); return; }
        next();
    };

    /* ── Step 1: Username ── */
    const submitUsername = () => {
        const upper = username.trim().toUpperCase();
        if (!upper) { setError('OS-ID cannot be empty.'); return; }
        if (upper.length !== 8) { setError('OS-ID must be exactly 8 characters long.'); return; }
        if (!/^[A-Z0-9@,._\-=+*^$#!]+$/.test(upper)) { setError('Only letters, numbers, and @,._-=+*^$#! are allowed.'); return; }
        if ((upper.match(/[0-9]/g) || []).length > 4) { setError('Maximum 4 digits allowed.'); return; }
        if (usernameStatus === 'taken') { setError('That OS-ID is taken'); return; }
        if (usernameStatus === 'checking') { setError('Still checking availability…'); return; }
        next();
    };

    /* ── Step 2: PIN ── */
    const submitPin = () => {
        if (pin.length < PIN_DIGITS) { setError(`Enter all ${PIN_DIGITS} digits`); return; }
        next();
    };

    /* ── Step 3: Confirm PIN ── */
    const submitConfirmPin = () => {
        if (confirmPin !== pin) { setError('PINs do not match'); setConfirmPin(''); return; }
        next();
    };

    /* ── Step 4: Goals ── */
    const toggleGoal = (id) => {
        setSelectedGoals(prev => prev.includes(id) ? prev.filter(g => g !== id) : [...prev, id]);
    };
    const submitGoals = () => {
        if (selectedGoals.length === 0) { setError('Please select at least one goal'); return; }
        next();
    }

    /* ── Step 5: Habits ── */
    const toggleHabit = (id) => {
        setSelectedHabits(prev => prev.includes(id) ? prev.filter(habitId => habitId !== id) : [...prev, id]);
    };
    const submitHabits = () => {
        if (selectedHabits.length === 0) { setError('Please select at least one habit'); return; }
        next();
    }

    /* ── Step 6: Wake Up ── */
    const submitWakeUp = () => {
        if (!wakeTime) { setError('Please set your wake-up time'); return; }
        next();
    }

    /* ── Step 7: Life Score / Final Submission ── */
    const submitAll = async () => {
        setLoading(true);
        setError('');
        try {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) throw new Error('No session');

            // 1. Complete profile
            const res = await fetch('/api/auth/complete-google-profile', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${session.access_token}`,
                },
                body: JSON.stringify({
                    username: username.trim().toUpperCase(),
                    pin,
                    full_name: fullName.trim(),
                }),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Setup failed');

            // 2. We can save Wake Time to user settings
            await fetch('/api/account/profile', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${session.access_token}` },
                body: JSON.stringify({ timezone: Intl.DateTimeFormat().resolvedOptions().timeZone })
            });

            // Wait, we can save habits.
            for (const hId of selectedHabits) {
                const habitName = HABIT_OPTIONS.find(h => h.id === hId)?.label;
                await fetch('/api/habits', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${session.access_token}` },
                    body: JSON.stringify({ title: habitName, frequency: 'daily', category: 'health' })
                });
            }

            // 3. Save goals
            for (const gId of selectedGoals) {
                const goalName = GOAL_OPTIONS.find(g => g.id === gId)?.label;
                await fetch('/api/goals', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${session.access_token}` },
                    body: JSON.stringify({ title: goalName, category: 'life', status: 'in_progress', progress: 0 })
                });
            }

            // Move to success (step 8 = done screen)
            setDir(1);
            setStep(8);
            await new Promise(r => setTimeout(r, 2400));
            navigate('/overview', { replace: true });
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    /* ── Render ── */
    const stepContent = [
        /* Step 0 — Name */
        <motion.div key="name" {...slide(dir)}>
            <h2 style={s.heading}>What's your name?</h2>
            <p style={s.sub}>This appears on your dashboard and profile.</p>
            <input
                autoFocus
                value={fullName}
                onChange={e => setFullName(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && submitName()}
                placeholder="Your full name"
                style={s.input}
            />
            {error && <p style={s.err}>{error}</p>}
            <button onClick={submitName} style={s.primaryBtn}>
                Continue <ChevronRight size={16} />
            </button>
        </motion.div>,

        /* Step 1 — Username */
        <motion.div key="username" {...slide(dir)}>
            <h2 style={s.heading}>Choose your OS-ID</h2>
            <p style={s.sub}>This is your unique AIIMIN handle. You use it to log in.</p>
            <div style={{ position: 'relative' }}>
                <input
                    autoFocus
                    value={username}
                    onChange={e => { setUsername(e.target.value.toUpperCase().replace(/[^A-Z0-9@,._\-=+*^$#!]/g, '')); setError(''); }}
                    onKeyDown={e => e.key === 'Enter' && submitUsername()}
                    placeholder="e.g. HASMAT99"
                    maxLength={8}
                    style={{ ...s.input, textTransform: 'uppercase', paddingRight: '44px' }}
                />
                {usernameStatus !== 'idle' && (
                    <div style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)' }}>
                        {usernameStatus === 'checking' && <Loader2 size={16} color="var(--text-3)" style={{ animation: 'spin 0.8s linear infinite' }} />}
                        {usernameStatus === 'available' && <Check size={16} color="var(--color-accent)" />}
                        {usernameStatus === 'taken' && <span style={{ color: '#ef4444', fontSize: '12px', fontWeight: 700 }}>Taken</span>}
                    </div>
                )}
            </div>
            <p style={{ fontSize: '12px', color: 'var(--text-3)', marginTop: '8px' }}>
                Exactly 8 characters, max 4 numbers · allowed special characters: @,._-=+*^$#!
            </p>
            {error && <p style={s.err}>{error}</p>}
            <div style={{ display: 'flex', gap: '10px' }}>
                <button onClick={back} style={s.ghostBtn}>Back</button>
                <button onClick={submitUsername} style={{ ...s.primaryBtn, flex: 1 }}
                    disabled={usernameStatus === 'taken' || usernameStatus === 'checking'}>
                    Continue <ChevronRight size={16} />
                </button>
            </div>
        </motion.div>,

        /* Step 2 — Set PIN */
        <motion.div key="pin" {...slide(dir)}>
            <h2 style={s.heading}>Set your PIN</h2>
            <p style={s.sub}>A 6-digit PIN to log in without a password.</p>
            <Numpad value={pin} onChange={v => { setPin(v); setError(''); }} disabled={loading} />
            {error && <p style={{ ...s.err, marginTop: '16px' }}>{error}</p>}
            <div style={{ display: 'flex', gap: '10px', marginTop: '24px' }}>
                <button onClick={back} style={s.ghostBtn}>Back</button>
                <button
                    onClick={submitPin}
                    disabled={pin.length < PIN_DIGITS}
                    style={{ ...s.primaryBtn, flex: 1, opacity: pin.length < PIN_DIGITS ? 0.5 : 1 }}
                >
                    Continue <ChevronRight size={16} />
                </button>
            </div>
        </motion.div>,

        /* Step 3 — Confirm PIN */
        <motion.div key="confirm" {...slide(dir)}>
            <h2 style={s.heading}>Confirm your PIN</h2>
            <p style={s.sub}>Enter the same 6-digit PIN again to verify.</p>
            <Numpad value={confirmPin} onChange={v => { setConfirmPin(v); setError(''); }} disabled={loading} />
            {error && <p style={{ ...s.err, marginTop: '16px' }}>{error}</p>}
            <div style={{ display: 'flex', gap: '10px', marginTop: '24px' }}>
                <button onClick={back} style={s.ghostBtn} disabled={loading}>Back</button>
                <button
                    onClick={submitConfirmPin}
                    disabled={confirmPin.length < PIN_DIGITS || loading}
                    style={{ ...s.primaryBtn, flex: 1, opacity: (confirmPin.length < PIN_DIGITS || loading) ? 0.6 : 1 }}
                >
                    Continue <ChevronRight size={16} />
                </button>
            </div>
        </motion.div>,

        /* Step 4 — Goals */
        <motion.div key="goals" {...slide(dir)}>
            <h2 style={s.heading}>What are you working toward?</h2>
            <p style={s.sub}>Select the goals that matter most to you right now.</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '10px' }}>
                {GOAL_OPTIONS.map(g => {
                    const selected = selectedGoals.includes(g.id);
                    return (
                        <div
                            key={g.id}
                            onClick={() => toggleGoal(g.id)}
                            style={{
                                ...s.optionCard,
                                border: selected ? '1.5px solid var(--color-accent)' : '1.5px solid var(--border)',
                                background: selected ? 'color-mix(in srgb, var(--color-accent) 10%, transparent)' : 'var(--bg-elevated)',
                            }}
                        >
                            <span style={{ fontSize: '20px' }}>{g.icon}</span>
                            <span style={{ fontSize: '15px', fontWeight: selected ? 600 : 500, color: 'var(--text-1)' }}>{g.label}</span>
                            {selected && <Check size={18} color="var(--color-accent)" style={{ marginLeft: 'auto' }} />}
                        </div>
                    )
                })}
            </div>
            {error && <p style={s.err}>{error}</p>}
            <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                <button onClick={back} style={s.ghostBtn} disabled={loading}>Back</button>
                <button onClick={submitGoals} style={{ ...s.primaryBtn, flex: 1 }}>Continue <ChevronRight size={16} /></button>
            </div>
        </motion.div>,

        /* Step 5 — Habits */
        <motion.div key="habits" {...slide(dir)}>
            <h2 style={s.heading}>Which habits matter to you?</h2>
            <p style={s.sub}>Select a few to start your streak.</p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginTop: '10px' }}>
                {HABIT_OPTIONS.map(h => {
                    const selected = selectedHabits.includes(h.id);
                    return (
                        <div
                            key={h.id}
                            onClick={() => toggleHabit(h.id)}
                            style={{
                                ...s.optionCard,
                                flexDirection: 'column',
                                alignItems: 'center',
                                textAlign: 'center',
                                padding: '16px 12px',
                                border: selected ? '1.5px solid var(--color-accent)' : '1.5px solid var(--border)',
                                background: selected ? 'color-mix(in srgb, var(--color-accent) 10%, transparent)' : 'var(--bg-elevated)',
                            }}
                        >
                            <span style={{ fontSize: '24px', marginBottom: '8px' }}>{h.icon}</span>
                            <span style={{ fontSize: '14px', fontWeight: selected ? 600 : 500, color: 'var(--text-1)' }}>{h.label}</span>
                        </div>
                    )
                })}
            </div>
            {error && <p style={s.err}>{error}</p>}
            <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                <button onClick={back} style={s.ghostBtn} disabled={loading}>Back</button>
                <button onClick={submitHabits} style={{ ...s.primaryBtn, flex: 1 }}>Continue <ChevronRight size={16} /></button>
            </div>
        </motion.div>,

        /* Step 6 — Wake-up Time */
        <motion.div key="wakeup" {...slide(dir)}>
            <h2 style={s.heading}>Set your wake-up time</h2>
            <p style={s.sub}>We'll use this to prepare your morning brief and daily intelligence.</p>
            
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '30px', marginBottom: '30px' }}>
                <input 
                    type="time" 
                    value={wakeTime}
                    onChange={(e) => { setWakeTime(e.target.value); setError(''); }}
                    style={{
                        padding: '16px 24px',
                        fontSize: '32px',
                        fontFamily: 'var(--font-sans)',
                        fontWeight: 700,
                        background: 'var(--bg-elevated)',
                        border: '1.5px solid var(--color-accent)',
                        borderRadius: '16px',
                        color: 'var(--text-1)',
                        outline: 'none',
                        textAlign: 'center'
                    }}
                />
            </div>

            {error && <p style={s.err}>{error}</p>}
            <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                <button onClick={back} style={s.ghostBtn} disabled={loading}>Back</button>
                <button onClick={submitWakeUp} style={{ ...s.primaryBtn, flex: 1 }}>Continue <ChevronRight size={16} /></button>
            </div>
        </motion.div>,

        /* Step 7 — Life Score Baseline */
        <motion.div key="lifescore" {...slide(dir)} style={{ textAlign: 'center' }}>
            <motion.div 
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: 'spring', delay: 0.2 }}
                style={{
                    width: '120px', height: '120px', 
                    borderRadius: '50%',
                    background: 'conic-gradient(var(--color-accent) 50%, var(--bg-elevated) 50%)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    margin: '0 auto 24px', position: 'relative'
                }}
            >
                <div style={{
                    width: '100px', height: '100px', borderRadius: '50%',
                    background: 'var(--bg-card)', display: 'flex', flexDirection: 'column',
                    alignItems: 'center', justifyContent: 'center'
                }}>
                    <span style={{ fontSize: '32px', fontWeight: 800, color: 'var(--text-1)' }}>50</span>
                    <span style={{ fontSize: '10px', color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '1px' }}>Score</span>
                </div>
            </motion.div>

            <h2 style={s.heading}>Your starting baseline</h2>
            <p style={s.sub}>
                Your Life Score is 50. As you track your {selectedHabits.length} habits and work towards your goals, this score will evolve.
            </p>

            {error && <p style={s.err}>{error}</p>}
            <div style={{ display: 'flex', gap: '10px', marginTop: '30px' }}>
                <button onClick={back} style={s.ghostBtn} disabled={loading}>Back</button>
                <button
                    onClick={submitAll}
                    disabled={loading}
                    style={{ ...s.primaryBtn, flex: 1 }}
                >
                    {loading ? <><Loader2 size={16} style={{ animation: 'spin 0.8s linear infinite' }} /> Preparing OS…</> : <>Start My Journey <ChevronRight size={16} /></>}
                </button>
            </div>
        </motion.div>,

        /* Step 8 — Success (Animated Intro) */
        <motion.div key="success" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} style={{ textAlign: 'center', padding: '40px 0' }}>
            <motion.div
                initial={{ scale: 0 }} animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20, delay: 0.1 }}
                style={{
                    width: '80px', height: '80px', borderRadius: '50%',
                    background: 'color-mix(in srgb, var(--color-accent) 15%, var(--bg-card))',
                    border: '2px solid var(--color-accent)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    margin: '0 auto 24px',
                }}
            >
                <Star size={36} color="var(--color-accent)" fill="var(--color-accent)" strokeWidth={1.5} />
            </motion.div>
            <h2 style={{ ...s.heading, textAlign: 'center', fontSize: '28px' }}>Your journey starts now</h2>
            <p style={{ ...s.sub, textAlign: 'center', fontSize: '16px' }}>Entering Mission Control…</p>
            <Loader2 size={24} color="var(--color-accent)" style={{ animation: 'spin 1.5s linear infinite', margin: '0 auto', opacity: 0.7 }} />
        </motion.div>,
    ];

    return (
        <div style={{
            minHeight: '100vh', background: 'var(--color-base)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: 'var(--font-sans)', padding: '24px',
        }}>
            <style>{`
                @keyframes spin { to { transform: rotate(360deg); } }
                .ob-input:focus { border-color: var(--color-accent) !important; outline: none; }
                input[type="time"]::-webkit-calendar-picker-indicator {
                    filter: invert(1);
                    cursor: pointer;
                    opacity: 0.6;
                }
                input[type="time"]::-webkit-calendar-picker-indicator:hover {
                    opacity: 1;
                }
            `}</style>

            <div style={{ width: '100%', maxWidth: '440px' }}>
                {/* Logo */}
                <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                    <div style={{ fontFamily: 'var(--font-serif)', fontSize: '26px', fontWeight: 900, letterSpacing: '-0.04em', color: 'var(--text-1)' }}>
                        AIIMIN
                    </div>
                    <p style={{ fontSize: '12px', color: 'var(--text-3)', marginTop: '4px', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                        Profile Setup
                    </p>
                </div>

                {/* Card */}
                <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{
                        background: 'var(--bg-card)', border: '1px solid var(--border)',
                        borderRadius: '28px', padding: '40px 36px',
                        boxShadow: '0 32px 80px rgba(0,0,0,0.06)',
                    }}
                >
                    {/* Step indicator — only for steps 0–7 */}
                    {step < 8 && <StepIndicator current={step} total={TOTAL_STEPS} />}

                    <AnimatePresence mode="wait">
                        {stepContent[step]}
                    </AnimatePresence>
                </motion.div>

                {/* Footer */}
                {step < 8 && (
                    <p style={{ textAlign: 'center', fontSize: '12px', color: 'var(--text-3)', marginTop: '20px' }}>
                        Step {step + 1} of {TOTAL_STEPS} · Your data is always private.
                    </p>
                )}
            </div>
        </div>
    );
}

/* ─── Styles ────────────────────────────────────────────────── */
const s = {
    heading: {
        fontFamily: 'var(--font-serif)', fontSize: '24px', fontWeight: 800,
        color: 'var(--text-1)', margin: '0 0 8px', letterSpacing: '-0.02em',
    },
    sub: {
        fontSize: '14px', color: 'var(--text-2)', margin: '0 0 28px', lineHeight: 1.6,
    },
    input: {
        width: '100%', padding: '14px 16px',
        background: 'var(--bg-elevated)', border: '1.5px solid var(--border)',
        borderRadius: '14px', fontSize: '16px', color: 'var(--text-1)',
        fontFamily: 'var(--font-sans)', boxSizing: 'border-box',
        transition: 'border-color 0.2s', outline: 'none',
        marginBottom: '0',
    },
    primaryBtn: {
        width: '100%', padding: '15px', marginTop: '20px',
        background: 'var(--color-accent)', color: '#fff',
        border: 'none', borderRadius: '14px',
        fontSize: '15px', fontWeight: 700, cursor: 'pointer',
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
        fontFamily: 'var(--font-sans)', transition: 'opacity 0.2s, transform 0.15s',
        boxShadow: '0 8px 24px color-mix(in srgb, var(--color-accent) 35%, transparent)',
    },
    ghostBtn: {
        padding: '15px 24px', marginTop: '20px',
        background: 'var(--bg-elevated)', color: 'var(--text-1)',
        border: '1px solid var(--border)', borderRadius: '14px',
        fontSize: '15px', fontWeight: 600, cursor: 'pointer',
        fontFamily: 'var(--font-sans)', transition: 'border-color 0.2s',
        whiteSpace: 'nowrap',
    },
    err: {
        fontSize: '13px', color: '#ef4444', margin: '10px 0 0',
        fontWeight: 500,
    },
    optionCard: {
        display: 'flex',
        alignItems: 'center',
        padding: '14px 16px',
        borderRadius: '12px',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        gap: '12px'
    }
};
