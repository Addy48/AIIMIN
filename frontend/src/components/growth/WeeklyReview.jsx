import React, { useState, useEffect } from 'react';
import supabase from '../../utils/supabase';

const STORAGE_KEY = 'aiimin_weekly_reviews';

const WeeklyReview = ({ user, onClose }) => {
    const [weekLogs, setWeekLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [rating, setRating] = useState(0);
    const [bigWin, setBigWin] = useState('');
    const [nextWeekIntent, setNextWeekIntent] = useState('');
    const [saved, setSaved] = useState(false);

    useEffect(() => {
        if (!user) return;
        const weekAgo = new Date(Date.now() - 6 * 86400000).toLocaleDateString('en-CA');
        supabase.from('daily_logs').select('*').eq('user_id', user.id).gte('date', weekAgo)
            .order('date', { ascending: false })
            .then(({ data }) => { if (data) setWeekLogs(data); setLoading(false); });
    }, [user]);

    const gymDays = weekLogs.filter(l => l.gym_done).length;
    const learnDays = weekLogs.filter(l => l.learning_done).length;

    const totalXP = weekLogs.reduce((s, l) => s + ((l.gym_done ? 60 : 0) + ((l.sleep_hours || 0) >= 7 ? 50 : 0) + (l.learning_done ? 50 : 0) + (l.journal_entry?.trim() ? 35 : 0)), 0);

    const bestDay = weekLogs.reduce((best, l) => {
        const m = [l.gym_done, l.breakfast_done, (l.sleep_hours || 0) >= 7, (l.steps || 0) >= 5000, l.learning_done].filter(Boolean).length;
        return m > (best.score || 0) ? { date: l.date, score: m } : best;
    }, {});

    const saveReview = () => {
        const reviews = (() => { try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'); } catch { return []; } })();
        reviews.unshift({ rating, bigWin, nextWeekIntent, weekOf: new Date().toLocaleDateString('en-CA') });
        localStorage.setItem(STORAGE_KEY, JSON.stringify(reviews.slice(0, 52)));
        setSaved(true);
        setTimeout(onClose, 1500);
    };

    return (
        <div
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.78)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 99999 }}
            onClick={e => { if (e.target === e.currentTarget) onClose(); }}
        >
            <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '20px', width: '520px', maxWidth: '92vw', maxHeight: '90vh', overflow: 'auto', padding: '28px' }}>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                    <div>
                        <div style={{ fontSize: '18px', fontWeight: 900, color: 'var(--text-1)' }}>Weekly Review</div>
                        <div style={{ fontSize: '12px', color: 'var(--text-3)', marginTop: '3px' }}>
                            Week ending {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                        </div>
                    </div>
                    <button onClick={onClose} style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: '99px', width: '34px', height: '34px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--text-2)', fontSize: '16px' }}>
                        ✕
                    </button>
                </div>

                {/* Stats */}
                {!loading && (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px', marginBottom: '22px' }}>
                        {[
                            { label: 'Logged', value: weekLogs.length + 'd', icon: '📅' },
                            { label: 'Est. XP', value: '+' + totalXP, icon: '⚡' },
                            { label: 'Gym', value: gymDays + 'x', icon: '💪' },
                            { label: 'Learning', value: learnDays + 'd', icon: '📚' },
                        ].map(s => (
                            <div key={s.label} style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: '10px', padding: '14px 8px', textAlign: 'center' }}>
                                <div style={{ fontSize: '18px', marginBottom: '5px' }}>{s.icon}</div>
                                <div style={{ fontSize: '16px', fontWeight: 900, color: 'var(--text-1)' }}>{s.value}</div>
                                <div style={{ fontSize: '9px', color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.05em', marginTop: '3px' }}>{s.label}</div>
                            </div>
                        ))}
                    </div>
                )}

                {bestDay.date && (
                    <div style={{ padding: '12px 16px', background: 'var(--accent-dim)', border: '1px solid var(--border-accent)', borderRadius: '10px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span style={{ fontSize: '18px' }}>⭐</span>
                        <div>
                            <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--accent)' }}>
                                Best Day: {new Date(bestDay.date + 'T12:00:00').toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
                            </div>
                            <div style={{ fontSize: '11px', color: 'var(--text-3)' }}>{bestDay.score}/5 key metrics hit</div>
                        </div>
                    </div>
                )}

                {/* Rating */}
                <div style={{ marginBottom: '20px' }}>
                    <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-2)', marginBottom: '10px' }}>Rate your week:</div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                        {[1, 2, 3, 4, 5].map(n => (
                            <button key={n} onClick={() => setRating(n)} style={{ flex: 1, padding: '10px', borderRadius: '8px', fontSize: '20px', border: rating >= n ? '1px solid var(--accent)' : '1px solid var(--border)', background: rating >= n ? 'var(--accent-dim)' : 'var(--bg-elevated)', cursor: 'pointer', transition: 'all 0.15s' }}>
                                ⭐
                            </button>
                        ))}
                    </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '22px' }}>
                    <input type="text" value={bigWin} onChange={e => setBigWin(e.target.value)} placeholder="Biggest win this week…" style={{ width: '100%', padding: '10px 14px', background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--text-1)', fontSize: '13px', outline: 'none', boxSizing: 'border-box' }} />
                    <input type="text" value={nextWeekIntent} onChange={e => setNextWeekIntent(e.target.value)} placeholder="One priority for next week…" style={{ width: '100%', padding: '10px 14px', background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--text-1)', fontSize: '13px', outline: 'none', boxSizing: 'border-box' }} />
                </div>

                <button onClick={saveReview} style={{ width: '100%', padding: '13px', borderRadius: '10px', border: 'none', background: saved ? 'var(--success)' : 'var(--accent)', color: '#fff', fontSize: '14px', fontWeight: 800, cursor: 'pointer', transition: 'background 0.2s' }}>
                    {saved ? '✓ Review Saved' : 'Submit Weekly Review'}
                </button>
            </div>
        </div>
    );
};

export default WeeklyReview;
