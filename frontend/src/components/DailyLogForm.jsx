import React, { useState, useEffect } from 'react';
import { upsertRow } from '../services/dbService';
import TimePicker from './TimePicker';
import MomentumBar from './MomentumBar';
import { useDevContext } from '../context/DevContext';
import { devLogger } from '../utils/devLogger';
import toast from '../utils/toast';
import DumbbellIcon from './icons/DumbbellIcon';

/* ─── Theme-aware Toggle Card ─── */
const ToggleCard = ({ active, onClick, icon, text }) => (
    <div
        onClick={onClick}
        style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '14px 16px', borderRadius: '10px',
            border: active ? '1px solid rgba(245,166,35,0.25)' : '1px solid var(--border)',
            background: active ? 'rgba(245,166,35,0.08)' : 'var(--bg-elevated)',
            cursor: 'pointer', marginBottom: '10px', transition: 'all 0.2s',
        }}
    >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px', color: 'var(--text-1)' }}>
            <span style={{ fontSize: '18px' }}>{icon}</span>
            <span>{text}</span>
        </div>
        <div style={{
            width: '44px', height: '24px', borderRadius: '12px',
            background: active ? '#f5a623' : 'var(--border-hover)',
            position: 'relative', transition: 'background 0.2s', cursor: 'pointer',
        }}>
            <div style={{
                position: 'absolute', width: '18px', height: '18px', borderRadius: '50%',
                background: 'white', top: '3px', left: active ? '23px' : '3px',
                transition: 'left 0.2s, transform 0.2s',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transform: active ? 'rotate(45deg)' : 'rotate(0deg)',
                boxShadow: '0 1px 3px rgba(0,0,0,0.2)'
            }}>
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke={active ? '#f5a623' : 'var(--text-3)'} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{ transition: 'stroke 0.2s' }}>
                    <line x1="12" y1="5" x2="12" y2="19"></line>
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                </svg>
            </div>
        </div>
    </div>
);



/* ─── DailyLogForm ─── */
const DailyLogForm = ({ user, externalMood }) => {
    const [formData, setFormData] = useState({
        sleepStart: '',
        sleepEnd: '',
        gymDone: false,
        gymDuration: 0,
        breakfastDone: false,
        steps: 0,
        waterBottles: 0,
        learningDone: false,
        learningTopic: '',
        journalEntry: '',
        mood: null,
    });

    // Sync mood from MoodTracker whenever it changes
    useEffect(() => {
        if (externalMood !== null && externalMood !== undefined) {
            setFormData(prev => ({ ...prev, mood: externalMood }));
            setIsDirty(true);
        }
    }, [externalMood]);

    const [loading, setLoading] = useState(false);
    const { testDate } = useDevContext();

    const [isDirty, setIsDirty] = useState(false);
    const [justSaved, setJustSaved] = useState(false);
    const [showCheckmark, setShowCheckmark] = useState(false);

    const calculateSleepHours = () => {
        if (!formData.sleepStart || !formData.sleepEnd) return 0;
        const start = formData.sleepStart.split(':').map(Number);
        const end = formData.sleepEnd.split(':').map(Number);
        let startMins = start[0] * 60 + start[1];
        let endMins = end[0] * 60 + end[1];
        if (endMins <= startMins) endMins += 24 * 60;
        return Number(((endMins - startMins) / 60).toFixed(1));
    };

    const sleepHours = calculateSleepHours();

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : (type === 'number' ? (value ? Number(value) : '') : value),
        }));
        setIsDirty(true);
    };

    const handleTimeChange = (name, value) => {
        setFormData(prev => ({ ...prev, [name]: value }));
        setIsDirty(true);
    };

    const handleToggle = (name) => {
        setFormData(prev => ({ ...prev, [name]: !prev[name] }));
        setIsDirty(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            if (!user?.id) {
                toast.error('Not logged in — please refresh.');
                setLoading(false);
                return;
            }
            const dateObj = testDate ? new Date(testDate) : new Date();
            const today = dateObj.toISOString().split('T')[0];
            const userId = user.id;

            const payload = {
                user_id: userId,
                date: today,
                sleep_start: formData.sleepStart || null,
                sleep_end: formData.sleepEnd || null,
                sleep_hours: sleepHours || null,
                gym_done: formData.gymDone || false,
                gym_duration: typeof formData.gymDuration === 'number' ? formData.gymDuration : null,
                breakfast_done: formData.breakfastDone || false,
                steps: typeof formData.steps === 'number' ? formData.steps : 0,
                water_bottles: typeof formData.waterBottles === 'number' ? formData.waterBottles : 0,
                learning_done: formData.learningDone || false,
                learning_topic: formData.learningTopic || null,
                journal_entry: formData.journalEntry || null,
                mood: formData.mood,
            };

            const data = await upsertRow('daily_logs', payload, 'user_id,date');

            if (process.env.NODE_ENV === 'development') {
                devLogger.logOperation(payload, data);
            }

            toast.success(`Log saved at ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`);
            setJustSaved(true);
            setShowCheckmark(true);
            setTimeout(() => setShowCheckmark(false), 2000);
            setTimeout(() => setJustSaved(false), 3000);

            setTimeout(() => {
                setFormData({
                    sleepStart: '', sleepEnd: '',
                    gymDone: false, gymDuration: 0,
                    breakfastDone: false, steps: 0, waterBottles: 0,
                    learningDone: false, learningTopic: '',
                    journalEntry: '', mood: null,
                });
                setIsDirty(false);
            }, 500);
        } catch (error) {
            toast.error('Save failed — check connection and try again.');
        } finally {
            setLoading(false);
        }
    };

    const displayDateObj = testDate ? new Date(testDate) : new Date();
    const todayDisplay = displayDateObj.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });

    const inputStyle = {
        width: '100%',
        background: 'var(--bg-secondary)',
        border: '1px solid var(--border)',
        borderRadius: '8px',
        padding: '10px 14px',
        fontSize: '14px',
        color: 'var(--text-1)',
        outline: 'none',
        transition: 'border-color 0.12s ease, box-shadow 0.12s ease',
    };
    const labelStyle = { fontSize: '12px', fontWeight: 500, color: 'var(--text-2)', marginBottom: '7px', display: 'block' };
    const sectionClasses = "text-[10px] font-bold text-[var(--text-3)] uppercase tracking-[0.12em] mt-7 mb-4 pb-2.5 border-b border-[var(--border)]";

    return (
        <div style={{ position: 'relative' }}>
            {/* Momentum Bar */}
            <div style={{ marginBottom: '20px' }}>
                <MomentumBar user={user} justSaved={justSaved} />
            </div>

            {/* Checkmark Overlay */}
            {showCheckmark && (
                <div className="completion-burst" style={{
                    position: 'absolute', top: '80px', left: 0, right: 0,
                    display: 'flex', flexDirection: 'column', alignItems: 'center',
                    justifyContent: 'center', zIndex: 20, pointerEvents: 'none',
                }}>
                    <div className="check-pop" style={{
                        width: '64px', height: '64px', borderRadius: '50%',
                        background: 'var(--success)', display: 'flex',
                        alignItems: 'center', justifyContent: 'center',
                        fontSize: '32px', color: 'white', fontWeight: 900,
                        boxShadow: '0 8px 32px rgba(93, 184, 122, 0.4)'
                    }}>✓</div>
                    <div style={{ marginTop: '8px', fontSize: '13px', fontWeight: 700, color: 'var(--success)' }}>Logged!</div>
                </div>
            )}

            <form onSubmit={handleSubmit} style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--border)',
                borderRadius: '20px',
                overflow: 'hidden',
                boxShadow: 'var(--shadow-md)',
            }}>

                {/* Form Header */}
                <div style={{ padding: '24px 28px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                    <h3 style={{ fontSize: '17px', fontWeight: 700, color: 'var(--text-1)' }}>Today's Log</h3>
                    <div style={{ padding: '3px 12px', background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: '9999px', fontSize: '12px', color: 'var(--text-3)', fontWeight: 500 }}>
                        {todayDisplay}
                    </div>
                </div>

                {/* Form Body */}
                <div style={{ padding: '0 28px 28px', display: 'flex', flexDirection: 'column', gap: 0 }}>

                    {/* SLEEP SECTION */}
                    <div>
                        <div className={`${sectionClasses} mt-0`}>Last Night's Sleep</div>
                        <div style={{ fontSize: '11px', color: 'var(--text-3)', fontWeight: 500, marginBottom: '10px', marginTop: '-4px' }}>
                            When did you fall asleep and wake up this morning?
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                            <TimePicker label="Fell Asleep" placeholder="e.g. 11:00 PM" value={formData.sleepStart} onChange={(val) => handleTimeChange('sleepStart', val)} />
                            <TimePicker label="Woke Up" placeholder="e.g. 7:00 AM" value={formData.sleepEnd} onChange={(val) => handleTimeChange('sleepEnd', val)} />
                        </div>
                        {formData.sleepStart && formData.sleepEnd && (
                            <div style={{
                                marginTop: '10px', display: 'inline-flex', alignItems: 'center', gap: '8px',
                                padding: '7px 14px', borderRadius: '9999px', fontSize: '13px', fontWeight: 600,
                                background: sleepHours >= 7 ? 'var(--success-dim)' : sleepHours >= 5 ? 'var(--warning-dim)' : 'var(--danger-dim)',
                                color: sleepHours >= 7 ? 'var(--success)' : sleepHours >= 5 ? 'var(--warning)' : 'var(--danger)',
                                border: `1px solid ${sleepHours >= 7 ? 'rgba(0,217,126,0.2)' : sleepHours >= 5 ? 'rgba(255,170,0,0.2)' : 'rgba(255,68,102,0.2)'}`,
                            }}>
                                {sleepHours >= 7 && `✓ ${sleepHours}h · Good sleep`}
                                {sleepHours >= 5 && sleepHours < 7 && `⚠ ${sleepHours}h · Below target`}
                                {sleepHours < 5 && `✗ ${sleepHours}h · Poor sleep`}
                            </div>
                        )}
                    </div>

                    {/* BODY SECTION */}
                    <div>
                        <div className={sectionClasses}>Body</div>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <ToggleCard active={formData.gymDone} onClick={() => handleToggle('gymDone')} icon={<DumbbellIcon size={18} color="var(--text-2)" />} text="Hit the gym today" />
                            {formData.gymDone && (
                                <div style={{ marginBottom: '10px' }}>
                                    <label style={labelStyle}>Duration (min)</label>
                                    <input type="number" name="gymDuration" value={formData.gymDuration} onChange={handleChange} placeholder="45" style={inputStyle} />
                                </div>
                            )}
                            <ToggleCard active={formData.breakfastDone} onClick={() => handleToggle('breakfastDone')} icon="🍳" text="Had breakfast" />
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginTop: '4px' }}>
                                <div>
                                    <label style={labelStyle}>Steps</label>
                                    <input type="number" name="steps" value={formData.steps} onChange={handleChange} placeholder="0" style={inputStyle} />
                                </div>
                                <div>
                                    <label style={labelStyle}>💧 Water (bottles)</label>
                                    <div style={{ display: 'flex', gap: '4px', marginTop: '4px' }}>
                                        {[0, 1, 2, 3, 4].map(v => (
                                            <button
                                                key={v}
                                                type="button"
                                                onClick={() => { setFormData(prev => ({ ...prev, waterBottles: v })); setIsDirty(true); }}
                                                style={{
                                                    flex: 1, padding: '8px 2px', borderRadius: '8px',
                                                    border: '1px solid ' + (formData.waterBottles === v ? 'var(--accent)' : 'var(--border)'),
                                                    background: formData.waterBottles === v ? 'var(--accent-dim)' : 'var(--bg-elevated)',
                                                    color: formData.waterBottles === v ? 'var(--accent)' : 'var(--text-3)',
                                                    fontSize: '12px', fontWeight: 700, cursor: 'pointer',
                                                }}>
                                                {v === 4 ? '4+' : v}
                                            </button>
                                        ))}
                                    </div>
                                    <div style={{ fontSize: '10px', color: 'var(--text-3)', marginTop: '4px' }}>× 1.5L · Goal: 3</div>
                                </div>
                            </div>
                            {formData.steps > 0 && (
                                <div style={{
                                    marginTop: '10px', display: 'inline-flex', alignItems: 'center', gap: '8px',
                                    padding: '7px 14px', borderRadius: '9999px', fontSize: '13px', fontWeight: 600,
                                    background: formData.steps >= 10000 ? 'var(--success-dim)' : 'var(--bg-elevated)',
                                    color: formData.steps >= 10000 ? 'var(--success)' : 'var(--text-3)',
                                    border: `1px solid ${formData.steps >= 10000 ? 'rgba(0,217,126,0.2)' : 'var(--border)'}`,
                                }}>
                                    {formData.steps >= 10000 ? `🔥 ${Number(formData.steps).toLocaleString()} · Daily Goal Crushed!` : `👟 ${Number(formData.steps).toLocaleString()} · Keep Walking (>10k)`}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* FOCUS SECTION */}
                    <div>
                        <div className={sectionClasses}>Focus</div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                            <ToggleCard active={formData.learningDone} onClick={() => handleToggle('learningDone')} icon="📚" text="Learned something today?" />
                            {formData.learningDone && (
                                <div style={{ marginBottom: '10px' }}>
                                    <label style={labelStyle}>What topic?</label>
                                    <input type="text" name="learningTopic" value={formData.learningTopic} onChange={handleChange} placeholder="e.g. System design, Guitar, Spanish..." style={inputStyle} />
                                </div>
                            )}
                        </div>
                    </div>

                    {/* JOURNAL SECTION */}
                    <div>
                        <div className={sectionClasses}>Journal</div>
                        <textarea
                            name="journalEntry"
                            value={formData.journalEntry}
                            onChange={handleChange}
                            placeholder="Wins, struggles, thoughts..."
                            style={{ ...inputStyle, resize: 'vertical', minHeight: '110px', lineHeight: 1.6 }}
                        />
                    </div>

                    {/* SUBMIT AREA */}
                    <div style={{ marginTop: '28px', paddingTop: '20px', borderTop: '1px solid var(--border)' }}>
                        <button
                            type="submit"
                            disabled={loading}
                            onMouseEnter={e => {
                                if (!loading) {
                                    e.currentTarget.style.background = '#f7b84a';
                                    e.currentTarget.style.boxShadow = '0 4px 16px rgba(245,166,35,0.3)';
                                }
                            }}
                            onMouseLeave={e => {
                                if (!loading) {
                                    e.currentTarget.style.background = '#f5a623';
                                    e.currentTarget.style.boxShadow = 'none';
                                }
                            }}
                            style={{
                                width: '100%', height: '46px', background: '#f5a623', border: 'none',
                                borderRadius: '12px', fontSize: '14px', fontWeight: 700, color: 'white',
                                cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.45 : 1,
                                transition: 'all 0.2s', letterSpacing: '0.02em',
                            }}
                        >
                            {loading ? 'Saving...' : "Save Session & Reflect"}
                        </button>

                        {toast.show && (
                            <div style={{
                                marginTop: '14px', padding: '14px 18px', borderRadius: '12px',
                                display: 'flex', alignItems: 'center', gap: '12px',
                                background: toast.type === 'success' ? 'var(--success-dim)' : 'var(--danger-dim)',
                                border: `1px solid ${toast.type === 'success' ? 'rgba(0,217,126,0.2)' : 'rgba(255,68,102,0.2)'}`,
                            }}>
                                <div style={{
                                    width: '20px', height: '20px', borderRadius: '50%',
                                    background: toast.type === 'success' ? '#00d97e' : '#ff4466',
                                    color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    fontSize: '11px', fontWeight: 800,
                                }}>
                                    {toast.type === 'success' ? '✓' : '!'}
                                </div>
                                <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-1)' }}>
                                    {toast.message}
                                </span>
                            </div>
                        )}
                    </div>
                </div>
            </form>

            {/* Floating Sticky Save Button */}
            {isDirty && (
                <div style={{
                    position: 'fixed',
                    bottom: '32px',
                    right: 'max(32px, calc((100vw - var(--max-width)) / 2 + 32px))',
                    zIndex: 9999,
                    animation: 'slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards'
                }}>
                    <button
                        onClick={handleSubmit}
                        disabled={loading}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px',
                            padding: '12px 22px',
                            background: 'var(--bg-card)',
                            border: '1px solid var(--border-accent)',
                            borderRadius: '30px',
                            boxShadow: '0 8px 18px rgba(0,0,0,0.2), 0 0 0 1px rgba(245,166,35,0.15)',
                            color: 'var(--text-1)',
                            fontWeight: 700,
                            fontSize: '13px',
                            cursor: 'pointer',
                            transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
                            opacity: loading ? 0.7 : 1
                        }}
                        onMouseEnter={e => {
                            if (!loading) e.currentTarget.style.transform = 'translateY(-2px)';
                        }}
                        onMouseLeave={e => {
                            if (!loading) e.currentTarget.style.transform = 'none';
                        }}
                    >
                        <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <div className="animate-ping" style={{ position: 'absolute', width: '8px', height: '8px', borderRadius: '50%', background: '#f5a623', opacity: 0.7 }}></div>
                            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#f5a623', position: 'relative' }}></div>
                        </div>
                        {loading ? 'Saving...' : 'Save Log'}
                    </button>
                    <style>{`
                        @keyframes slideUp {
                            from { transform: translateY(20px); opacity: 0; }
                            to { transform: translateY(0); opacity: 1; }
                        }
                    `}</style>
                </div>
            )}
        </div>
    );
};

export default DailyLogForm;
