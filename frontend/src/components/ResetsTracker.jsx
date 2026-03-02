import React, { useState, useEffect } from 'react';
import supabase from '../utils/supabase';

const RC_MOOD_COLORS = { 1: '#ef4444', 2: '#f97316', 3: '#eab308', 4: '#22c55e', 5: '#6366f1' };
const RC_MOOD_LABELS = { 1: 'Terrible', 2: 'Low', 3: 'Neutral', 4: 'Good', 5: 'Great' };

const ResetsTracker = ({ user }) => {
    const [entries, setEntries] = useState([]);
    const [activeForm, setActiveForm] = useState(null); // 'reset' or 'urge'

    // Form State
    const [website, setWebsite] = useState('');
    const [contentType, setContentType] = useState('Video');
    const [momentMood, setMomentMood] = useState(null);
    const [notes, setNotes] = useState('');

    const [loading, setLoading] = useState(false);
    const [toast, setToast] = useState({ show: false, message: '', type: '' });

    const showToast = (message, type) => {
        setToast({ show: true, message, type });
        setTimeout(() => setToast({ show: false, message: '', type: '' }), 3000);
    };

    const resetForm = () => {
        setActiveForm(null);
        setWebsite('');
        setContentType('Video');
        setMomentMood(null);
        setNotes('');
    };

    useEffect(() => {
        if (!user) return;
        const fetchTodayRC = async () => {
            const today = new Date().toISOString().split('T')[0];
            const { data, error } = await supabase
                .from('daily_logs')
                .select('rc_entries')
                .eq('user_id', user.id)
                .eq('date', today)
                .single();

            if (data && data.rc_entries) {
                try {
                    setEntries(typeof data.rc_entries === 'string' ? JSON.parse(data.rc_entries) : data.rc_entries);
                } catch (e) {
                    console.error('Failed to parse rc_entries', e);
                }
            }
        };
        fetchTodayRC();
    }, [user]);

    const handleLog = async () => {
        if (activeForm === 'urge' && !notes.trim()) {
            showToast('Note is mandatory for Urges', 'error');
            return;
        }

        setLoading(true);
        try {
            const entry = {
                type: activeForm, // 'reset' | 'urge'
                website,
                contentType,
                momentMood,
                notes,
                timestamp: new Date().toISOString(),
            };

            const newEntries = [...entries, entry];
            const today = new Date().toISOString().split('T')[0];
            const userId = user?.id;

            // Only count 'reset' type entries for streaks, ignoring 'urge' type
            const resetCount = newEntries.filter(e => e.type !== 'urge').length;

            const payload = {
                user_id: userId,
                date: today,
                rc_count: resetCount,
                rc_entries: JSON.stringify(newEntries)
            };

            const { error } = await supabase
                .from('daily_logs')
                .upsert(payload, { onConflict: 'user_id,date' });

            if (error) throw error;

            setEntries(newEntries);
            showToast(`${activeForm === 'reset' ? 'Reset' : 'Urge'} logged`, 'success');
            resetForm();

        } catch (error) {
            console.error(error);
            showToast('Failed to save log', 'error');
        } finally {
            setLoading(false);
        }
    };

    const inputStyle = {
        width: '100%',
        background: 'var(--bg-secondary)',
        border: '1px solid var(--border)',
        borderRadius: '8px',
        padding: '10px 14px',
        fontSize: '14px',
        color: 'var(--text-1)',
        outline: 'none',
        transition: 'all 0.12s ease',
    };
    const labelStyle = { fontSize: '12px', fontWeight: 500, color: 'var(--text-2)', marginBottom: '7px', display: 'block' };

    const resetCount = entries.filter(e => e.type !== 'urge').length;
    const urgeCount = entries.filter(e => e.type === 'urge').length;

    return (
        <div style={{
            background: 'var(--bg-card)', border: '1px solid var(--border)',
            borderRadius: '20px', padding: '24px 28px',
            boxShadow: 'var(--shadow-md)',
            animation: 'slideUp 0.3s ease forwards'
        }}>
            <h3 style={{ fontSize: '17px', fontWeight: 700, color: 'var(--text-1)', marginBottom: '16px' }}>Resets & Urges</h3>

            <div style={{ display: 'flex', gap: '16px', marginBottom: '16px' }}>
                <div style={{ flex: 1, padding: '12px', background: 'var(--bg-elevated)', borderRadius: '12px', border: '1px solid var(--border)' }}>
                    <div style={{ fontSize: '11px', textTransform: 'uppercase', color: 'var(--text-3)', fontWeight: 700 }}>Resets</div>
                    <div style={{ fontSize: '24px', fontWeight: 800, color: 'var(--danger)' }}>{resetCount}</div>
                </div>
                <div style={{ flex: 1, padding: '12px', background: 'var(--bg-elevated)', borderRadius: '12px', border: '1px solid var(--border)' }}>
                    <div style={{ fontSize: '11px', textTransform: 'uppercase', color: 'var(--text-3)', fontWeight: 700 }}>Urges</div>
                    <div style={{ fontSize: '24px', fontWeight: 800, color: 'var(--warning)' }}>{urgeCount}</div>
                </div>
            </div>

            <div style={{ display: 'flex', gap: '10px', marginBottom: activeForm ? '16px' : '0' }}>
                <button
                    onClick={() => setActiveForm(activeForm === 'reset' ? null : 'reset')}
                    style={{
                        flex: 1, padding: '10px', borderRadius: '10px', fontWeight: 600, fontSize: '13px', cursor: 'pointer', transition: 'all 0.2s',
                        background: activeForm === 'reset' ? 'var(--danger)' : 'var(--danger-dim)',
                        color: activeForm === 'reset' ? 'white' : 'var(--danger)',
                        border: `1px solid ${activeForm === 'reset' ? 'transparent' : 'rgba(255,68,102,0.2)'}`
                    }}
                >
                    + Log a Reset
                </button>
                <button
                    onClick={() => setActiveForm(activeForm === 'urge' ? null : 'urge')}
                    style={{
                        flex: 1, padding: '10px', borderRadius: '10px', fontWeight: 600, fontSize: '13px', cursor: 'pointer', transition: 'all 0.2s',
                        background: activeForm === 'urge' ? 'var(--warning)' : 'var(--warning-dim)',
                        color: activeForm === 'urge' ? 'white' : 'var(--warning)',
                        border: `1px solid ${activeForm === 'urge' ? 'transparent' : 'rgba(255,170,0,0.2)'}`
                    }}
                >
                    + Log an Urge
                </button>
            </div>

            {activeForm && (
                <div style={{
                    background: 'var(--bg-elevated)', border: '1px solid var(--border)',
                    borderRadius: '12px', padding: '16px', marginBottom: '16px',
                    animation: 'slideDown 0.2s ease forwards'
                }}>
                    <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-1)', marginBottom: '14px' }}>
                        Logging {activeForm === 'reset' ? 'a Reset' : 'an Urge'}
                    </div>

                    <div style={{ marginBottom: '14px' }}>
                        <label style={labelStyle}>Platform / Website (optional)</label>
                        <input type="text" value={website} onChange={e => setWebsite(e.target.value)} placeholder="e.g. Instagram, Reddit..." style={inputStyle} />
                    </div>

                    <div style={{ marginBottom: '14px' }}>
                        <label style={labelStyle}>Content type</label>
                        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                            {['Social', 'Video', 'Image', 'Text', 'Other'].map(ct => (
                                <button
                                    key={ct} type="button" onClick={() => setContentType(ct)}
                                    style={{
                                        padding: '6px 14px', borderRadius: '6px', fontSize: '12px', fontWeight: 500, cursor: 'pointer',
                                        background: contentType === ct ? 'var(--text-1)' : 'var(--bg-secondary)',
                                        color: contentType === ct ? 'var(--bg-primary)' : 'var(--text-2)',
                                        border: contentType === ct ? '1px solid var(--text-1)' : '1px solid var(--border)',
                                    }}
                                >
                                    {ct}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div style={{ marginBottom: '14px' }}>
                        <label style={labelStyle}>Mood at the moment</label>
                        <div style={{ display: 'flex', gap: '8px', marginBottom: '6px' }}>
                            {[1, 2, 3, 4, 5].map(n => {
                                const color = RC_MOOD_COLORS[n];
                                const isSelected = momentMood === n;
                                return (
                                    <button
                                        key={n} type="button" onClick={() => setMomentMood(n)}
                                        style={{
                                            width: '32px', height: '32px', borderRadius: '50%', border: 'none',
                                            cursor: 'pointer', fontSize: '13px', fontWeight: 700, transition: 'all 0.15s',
                                            background: isSelected ? color : `${color}22`,
                                            color: isSelected ? 'white' : color,
                                        }}
                                    >
                                        {n}
                                    </button>
                                );
                            })}
                        </div>
                        {momentMood && <div style={{ fontSize: '12px', color: 'var(--text-2)' }}>{RC_MOOD_LABELS[momentMood]}</div>}
                    </div>

                    <div style={{ marginBottom: '16px' }}>
                        <label style={labelStyle}>Notes {activeForm === 'urge' && <span style={{ color: 'var(--danger)' }}>*</span>}</label>
                        <textarea
                            rows={3} value={notes} onChange={e => setNotes(e.target.value)}
                            placeholder={activeForm === 'urge' ? "Why are you facing this urge? What triggered it?" : "What were you thinking? Any trigger? Context..."}
                            style={{ ...inputStyle, resize: 'vertical', lineHeight: 1.6, border: (activeForm === 'urge' && !notes.trim()) ? '1px solid rgba(255,68,102,0.5)' : inputStyle.border }}
                        />
                    </div>

                    <div style={{ display: 'flex', gap: '8px' }}>
                        <button
                            type="button" onClick={resetForm}
                            style={{ flex: 1, height: '38px', justifySelf: 'flex-end', borderRadius: '8px', fontWeight: 600, fontSize: '13px', cursor: 'pointer', background: 'transparent', border: '1px solid var(--border)', color: 'var(--text-2)' }}
                        >
                            Cancel
                        </button>
                        <button
                            type="button" onClick={handleLog} disabled={loading || (activeForm === 'urge' && !notes.trim())}
                            style={{ flex: 1, height: '38px', borderRadius: '8px', fontWeight: 600, fontSize: '13px', cursor: 'pointer', background: activeForm === 'reset' ? 'var(--danger)' : 'var(--warning)', border: 'none', color: 'white', opacity: (loading || (activeForm === 'urge' && !notes.trim())) ? 0.5 : 1 }}
                        >
                            {loading ? 'Saving...' : 'Save Entry'}
                        </button>
                    </div>
                </div>
            )}

            {entries.length > 0 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {entries.slice().reverse().map((entry, i) => {
                        const moodColor = entry.momentMood ? RC_MOOD_COLORS[entry.momentMood] : 'var(--text-3)';
                        const time = new Date(entry.timestamp).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
                        const isUrge = entry.type === 'urge';

                        return (
                            <div key={i} style={{
                                padding: '12px', background: 'var(--bg-secondary)', borderRadius: '10px',
                                borderLeft: `3px solid ${isUrge ? 'var(--warning)' : 'var(--danger)'}`, display: 'flex', flexDirection: 'column', gap: '6px'
                            }}>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <span style={{ fontSize: '11px', fontWeight: 800, padding: '2px 6px', borderRadius: '4px', background: isUrge ? 'var(--warning-dim)' : 'var(--danger-dim)', color: isUrge ? 'var(--warning)' : 'var(--danger)', textTransform: 'uppercase' }}>
                                            {isUrge ? 'Urge' : 'Reset'}
                                        </span>
                                        <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-1)' }}>{entry.contentType} {entry.website && `· ${entry.website}`}</span>
                                    </div>
                                    <span style={{ fontSize: '11px', color: 'var(--text-3)' }}>{time}</span>
                                </div>
                                {entry.notes && (
                                    <div style={{ fontSize: '12px', color: 'var(--text-2)', background: 'var(--bg-card)', padding: '8px', borderRadius: '6px', border: '1px solid var(--border)' }}>
                                        "{entry.notes}"
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}

            {toast.show && (
                <div style={{
                    marginTop: '14px', padding: '10px 14px', borderRadius: '8px',
                    display: 'flex', alignItems: 'center', gap: '10px',
                    background: toast.type === 'success' ? 'var(--success-dim)' : 'var(--danger-dim)',
                    border: `1px solid ${toast.type === 'success' ? 'rgba(0,217,126,0.2)' : 'rgba(255,68,102,0.2)'}`,
                    color: toast.type === 'success' ? 'var(--success)' : 'var(--danger)',
                    fontSize: '12px', fontWeight: 600
                }}>
                    {toast.message}
                </div>
            )}
        </div>
    );
};

export default ResetsTracker;
