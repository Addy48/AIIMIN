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
            background: active ? '#f5a623' : 'var(--bg-secondary)',
            position: 'relative', transition: 'background 0.2s', cursor: 'pointer',
        }}>
            <div style={{
                position: 'absolute', width: '18px', height: '18px', borderRadius: '50%',
                background: 'white', top: '3px', left: active ? '23px' : '3px',
                transition: 'left 0.2s, transform 0.2s',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transform: active ? 'rotate(45deg)' : 'rotate(0deg)'
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

    // RC sub-logger state
    const [rcEntries, setRcEntries] = useState([]);
    const [showRCForm, setShowRCForm] = useState(false);
    const [rcWebsite, setRcWebsite] = useState('');
    const [rcContentType, setRcContentType] = useState('Video');
    const [rcMomentMood, setRcMomentMood] = useState(null);
    const [rcNotes, setRcNotes] = useState('');

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
    };

    const handleTimeChange = (name, value) => setFormData(prev => ({ ...prev, [name]: value }));
    const handleToggle = (name) => setFormData(prev => ({ ...prev, [name]: !prev[name] }));

    const handleRCLog = () => {
        const entry = {
            website: rcWebsite,
            contentType: rcContentType,
            momentMood: rcMomentMood,
            notes: rcNotes,
            timestamp: new Date().toISOString(),
        };
        setRcEntries(prev => [...prev, entry]);
        setShowRCForm(false);
        setRcWebsite('');
        setRcContentType('Video');
        setRcMomentMood(null);
        setRcNotes('');
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
                rc_count: rcEntries.length,
                rc_entries: rcEntries.length > 0 ? JSON.stringify(rcEntries) : null,
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

            showToast(`Log saved for ${new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}`, 'success');

            setTimeout(() => {
                setFormData({
                    sleepStart: '', sleepEnd: '',
                    gymDone: false, gymDuration: 0,
                    breakfastDone: false, steps: 0, proteinGrams: 0,
                    learningDone: false, learningTopic: '',
                    journalEntry: '', mood: null,
                });
                setRcEntries([]);
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
                    </div>
                </div>

                {/* FOCUS SECTION */}
                <div>
                    <div className={sectionClasses}>Focus</div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 14px', borderRadius: '8px', cursor: 'pointer', background: 'transparent', color: 'var(--text-1)', border: 'none' }}>
                                <input type="checkbox" name="learningDone" checked={formData.learningDone} onChange={handleChange} style={{ width: '16px', height: '16px', accentColor: '#f5a623', cursor: 'pointer' }} />
                                <span style={{ fontSize: '14px', color: 'var(--text-1)' }}>Learned something?</span>
                            </label>
                            {formData.learningDone && (
                                <input type="text" name="learningTopic" value={formData.learningTopic} onChange={handleChange} placeholder="Topic" style={inputStyle} />
                            )}
                        </div>
                    </div>
                </div>

                {/* RC SECTION */}
                <div>
                    <div className={sectionClasses}>RC</div>

                    {/* Count row */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                        <span style={{ fontSize: '13px', color: 'var(--text-2)' }}>Resets today</span>
                        <span style={{ fontSize: '20px', fontWeight: 800, color: 'var(--text-1)' }}>{rcEntries.length}</span>
                    </div>

                    {/* Log Reset button */}
                    <button
                        type="button"
                        onClick={() => setShowRCForm(true)}
                        style={{
                            display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 16px',
                            borderRadius: '10px', background: 'var(--danger-dim)',
                            border: '1px solid rgba(255,68,102,0.2)', color: 'var(--danger)',
                            fontSize: '13px', fontWeight: 600, cursor: 'pointer', width: '100%',
                            justifyContent: 'center', transition: 'all 0.2s',
                        }}
                        onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,68,102,0.15)'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
                        onMouseLeave={e => { e.currentTarget.style.background = 'var(--danger-dim)'; e.currentTarget.style.transform = 'none'; }}
                    >
                        + Log a Reset
                    </button>

                    {/* RC entry form */}
                    {showRCForm && (
                        <div style={{
                            background: 'var(--bg-elevated)', border: '1px solid var(--border)',
                            borderRadius: '12px', padding: '20px', marginTop: '12px',
                        }}>
                            {/* Platform */}
                            <div style={{ marginBottom: '14px' }}>
                                <label style={labelStyle}>Platform / Website (optional)</label>
                                <input
                                    type="text"
                                    value={rcWebsite}
                                    onChange={e => setRcWebsite(e.target.value)}
                                    placeholder="e.g. Instagram, YouTube, Reddit..."
                                    style={inputStyle}
                                />
                            </div>

                            {/* Content type */}
                            <div style={{ marginBottom: '14px' }}>
                                <label style={labelStyle}>Content type</label>
                                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                                    {['Social', 'Video', 'Image', 'Text', 'Other'].map(ct => (
                                        <button
                                            key={ct}
                                            type="button"
                                            onClick={() => setRcContentType(ct)}
                                            style={{
                                                padding: '6px 14px', borderRadius: '6px', fontSize: '12px',
                                                fontWeight: 500, cursor: 'pointer',
                                                background: rcContentType === ct ? 'var(--danger-dim)' : 'var(--bg-secondary)',
                                                color: rcContentType === ct ? 'var(--danger)' : 'var(--text-2)',
                                                border: rcContentType === ct ? '1px solid rgba(255,68,102,0.3)' : '1px solid var(--border)',
                                            }}
                                        >
                                            {ct}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Moment mood 1-5 */}
                            <div style={{ marginBottom: '14px' }}>
                                <label style={labelStyle}>Mood at the moment</label>
                                <div style={{ display: 'flex', gap: '8px', marginBottom: '6px' }}>
                                    {[1, 2, 3, 4, 5].map(n => {
                                        const color = RC_MOOD_COLORS[n];
                                        const isSelected = rcMomentMood === n;
                                        return (
                                            <button
                                                key={n}
                                                type="button"
                                                onClick={() => setRcMomentMood(n)}
                                                style={{
                                                    width: '36px', height: '36px', borderRadius: '50%', border: 'none',
                                                    cursor: 'pointer', fontSize: '14px', fontWeight: 700,
                                                    background: isSelected ? color : `${color}22`,
                                                    color: isSelected ? 'white' : color,
                                                    transition: 'all 0.15s',
                                                }}
                                            >
                                                {n}
                                            </button>
                                        );
                                    })}
                                </div>
                                {rcMomentMood && (
                                    <div style={{ fontSize: '12px', color: 'var(--text-2)' }}>{RC_MOOD_LABELS[rcMomentMood]}</div>
                                )}
                            </div>

                            {/* Notes */}
                            <div style={{ marginBottom: '16px' }}>
                                <label style={labelStyle}>Notes (optional)</label>
                                <textarea
                                    rows={3}
                                    value={rcNotes}
                                    onChange={e => setRcNotes(e.target.value)}
                                    placeholder="What were you thinking? Any trigger? Context..."
                                    style={{ ...inputStyle, resize: 'vertical', lineHeight: 1.6 }}
                                />
                            </div>

                            {/* Cancel / Log buttons */}
                            <div style={{ display: 'flex', gap: '8px' }}>
                                <button
                                    type="button"
                                    onClick={() => { setShowRCForm(false); setRcWebsite(''); setRcContentType('Video'); setRcMomentMood(null); setRcNotes(''); }}
                                    style={{
                                        flex: 1, height: '38px', borderRadius: '8px', fontWeight: 600,
                                        fontSize: '13px', cursor: 'pointer',
                                        background: 'transparent', border: '1px solid var(--border)', color: 'var(--text-2)',
                                    }}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="button"
                                    onClick={handleRCLog}
                                    style={{
                                        flex: 1, height: '38px', borderRadius: '8px', fontWeight: 600,
                                        fontSize: '13px', cursor: 'pointer',
                                        background: 'var(--danger)', border: 'none', color: 'white',
                                    }}
                                >
                                    Log Entry
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Logged entries list */}
                    {rcEntries.length > 0 && (
                        <div style={{ marginTop: '10px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                            {rcEntries.map((entry, i) => {
                                const moodColor = entry.momentMood ? RC_MOOD_COLORS[entry.momentMood] : 'var(--text-3)';
                                const time = new Date(entry.timestamp).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
                                return (
                                    <div key={i} style={{
                                        display: 'flex', alignItems: 'center', gap: '10px',
                                        padding: '8px 12px', background: 'var(--bg-secondary)',
                                        borderRadius: '8px', border: '1px solid var(--border)',
                                    }}>
                                        <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: moodColor, flexShrink: 0 }} />
                                        <div style={{ flex: 1, fontSize: '12px', color: 'var(--text-2)' }}>
                                            <span style={{ fontWeight: 600 }}>{entry.contentType}</span>
                                            {entry.website && <span style={{ color: 'var(--text-3)', marginLeft: '6px' }}>· {entry.website}</span>}
                                        </div>
                                        <span style={{ fontSize: '11px', color: 'var(--text-3)', flexShrink: 0 }}>{time}</span>
                                    </div>
                                );
                            })}
                        </div>
                    )}
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
                        {loading ? 'Saving...' : "Save Today's Log"}
                    </button>

                    {toast.show && (
                        <div style={{
                            marginTop: '14px', padding: '14px 18px', borderRadius: '12px',
                            display: 'flex', alignItems: 'center', gap: '12px',
                            background: toast.type === 'success' ? 'var(--success-dim)' : 'var(--danger-dim)',
                            border: `1px solid ${toast.type === 'success' ? 'rgba(0,217,126,0.2)' : 'rgba(255,68,102,0.2)'}`,
                        }}>
                            <div style={{
                                width: '20px', height: '20px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px',
                                background: toast.type === 'success' ? 'rgba(0,217,126,0.15)' : 'rgba(255,68,102,0.15)',
                                color: toast.type === 'success' ? 'var(--success)' : 'var(--danger)',
                            }}>
                                {toast.type === 'success' ? '✓' : '✕'}
                            </div>
                            <span style={{ fontSize: '13px', fontWeight: 500, color: toast.type === 'success' ? 'var(--success)' : 'var(--danger)' }}>
                                {toast.message}
                            </span>
                        </div>
                    )}
                </div>
            </div>
        </form>
    );
};

export default DailyLogForm;
