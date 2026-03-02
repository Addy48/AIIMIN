import React, { useState } from 'react';
import supabase from '../utils/supabase';
import TimePicker from './TimePicker';

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

/* ─── Mood dot colors for RC ─── */
const RC_MOOD_COLORS = { 1: '#ef4444', 2: '#f97316', 3: '#eab308', 4: '#22c55e', 5: '#6366f1' };
const RC_MOOD_LABELS = { 1: 'Terrible', 2: 'Low', 3: 'Neutral', 4: 'Good', 5: 'Great' };

/* ─── DailyLogForm ─── */
const DailyLogForm = ({ user }) => {
    const [formData, setFormData] = useState({
        sleepStart: '',
        sleepEnd: '',
        gymDone: false,
        gymDuration: 0,
        breakfastDone: false,
        steps: 0,
        proteinGrams: 0,
        learningDone: false,
        learningTopic: '',
        journalEntry: '',
        mood: null,
    });

    const [loading, setLoading] = useState(false);
    const [toast, setToast] = useState({ show: false, message: '', type: '' });

    const [isDirty, setIsDirty] = useState(false);

    const showToast = (message, type) => {
        setToast({ show: true, message, type });
        setTimeout(() => setToast({ show: false, message: '', type: '' }), 3000);
    };

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
            const today = new Date().toISOString().split('T')[0];
            const userId = user?.id || 'demo-user-id';

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
                protein_grams: typeof formData.proteinGrams === 'number' ? formData.proteinGrams : 0,
                learning_done: formData.learningDone || false,
                learning_topic: formData.learningTopic || null,
                journal_entry: formData.journalEntry || null,
                mood: formData.mood,
            };

            const { error } = await supabase
                .from('daily_logs')
                .upsert(payload, { onConflict: 'user_id,date' })
                .select();

            if (error) throw error;

            showToast('Session saved. Want to reflect?', 'success');

            setTimeout(() => {
                setFormData({
                    sleepStart: '', sleepEnd: '',
                    gymDone: false, gymDuration: 0,
                    breakfastDone: false, steps: 0, proteinGrams: 0,
                    learningDone: false, learningTopic: '',
                    journalEntry: '', mood: null,
                });
                setIsDirty(false);
            }, 500);
        } catch (error) {
            console.error(error);
            showToast('Save failed — check connection and try again.', 'error');
        } finally {
            setLoading(false);
        }
    };

    const todayDisplay = new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });

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
                        <div className={`${sectionClasses} mt-0`}>Sleep</div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                            <TimePicker label="Bedtime" placeholder="Select bedtime" value={formData.sleepStart} onChange={(val) => handleTimeChange('sleepStart', val)} />
                            <TimePicker label="Wake Time" placeholder="Select wake time" value={formData.sleepEnd} onChange={(val) => handleTimeChange('sleepEnd', val)} />
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
                            <ToggleCard active={formData.gymDone} onClick={() => handleToggle('gymDone')} icon="🏋️" text="Hit the gym today" />
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
                                    <label style={labelStyle}>Protein (g)</label>
                                    <input type="number" name="proteinGrams" value={formData.proteinGrams} onChange={handleChange} placeholder="0" style={inputStyle} />
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
                    bottom: '30px',
                    right: '30px',
                    zIndex: 9999,
                    animation: 'slideUp 0.3s ease forwards'
                }}>
                    <button
                        onClick={handleSubmit}
                        disabled={loading}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px',
                            padding: '12px 20px',
                            background: 'var(--bg-elevated)',
                            border: '1px solid var(--border-accent)',
                            borderRadius: '30px',
                            boxShadow: '0 8px 30px rgba(0,0,0,0.15), 0 0 0 1px rgba(245,166,35,0.2)',
                            color: 'var(--text-1)',
                            fontWeight: 700,
                            fontSize: '14px',
                            cursor: 'pointer',
                            transition: 'all 0.2s',
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
