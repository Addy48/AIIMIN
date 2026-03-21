import React, { useState, useEffect } from 'react';
import supabase from '../../utils/supabase';
import { RANKS } from '../../utils/xpEngine';

const LifeChronicle = ({ user }) => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) return;
        (async () => {
            const [{ data: achData }, { data: xpLog }] = await Promise.all([
                supabase.from('achievements').select('*').eq('user_id', user.id).order('created_at', { ascending: false }),
                supabase.from('xp_log').select('log_date, total_xp').eq('user_id', user.id).order('log_date', { ascending: true }).limit(365),
            ]);

            const ev = [];

            // Achievements
            if (achData) {
                achData.forEach(a => {
                    ev.push({
                        type: 'achievement',
                        date: a.created_at?.split('T')[0] || null,
                        title: a.achievement_name || a.achievement_id,
                        icon: '🏅', color: '#ffd700',
                        detail: `+${a.xp_granted || 0} XP`,
                    });
                });
            }

            // Rank-ups from XP log
            if (xpLog && xpLog.length > 0) {
                let runningXP = 0;
                let lastRankIndex = 0;
                xpLog.forEach(entry => {
                    runningXP += entry.total_xp || 0;
                    const rankIndex = RANKS.filter(r => runningXP >= r.xpRequired).length - 1;
                    if (rankIndex > lastRankIndex) {
                        const rank = RANKS[rankIndex];
                        ev.push({
                            type: 'rankup',
                            date: entry.log_date,
                            title: `Ranked up to ${rank.name}`,
                            icon: '⚡', color: rank.color,
                            detail: `Rank ${rank.rank}`,
                        });
                        lastRankIndex = rankIndex;
                    }
                });

                // Streak milestones
                let streak = 0, maxStreak = 0;
                xpLog.forEach(entry => {
                    if ((entry.total_xp || 0) > 0) {
                        streak++;
                        if (streak > maxStreak) {
                            maxStreak = streak;
                            if ([7, 14, 21, 30, 60, 90].includes(streak)) {
                                ev.push({
                                    type: 'streak',
                                    date: entry.log_date,
                                    title: `${streak}-Day Streak`,
                                    icon: '🔥', color: '#f59e0b',
                                    detail: `${streak} days straight`,
                                });
                            }
                        }
                    } else {
                        streak = 0;
                    }
                });

                // XP milestones
                let accXP = 0;
                const xpMilestones = [1000, 5000, 10000, 25000, 50000, 100000];
                let nextMilestoneIdx = 0;
                xpLog.forEach(entry => {
                    accXP += entry.total_xp || 0;
                    while (nextMilestoneIdx < xpMilestones.length && accXP >= xpMilestones[nextMilestoneIdx]) {
                        ev.push({
                            type: 'xp_milestone',
                            date: entry.log_date,
                            title: `${xpMilestones[nextMilestoneIdx].toLocaleString()} XP reached`,
                            icon: '💎', color: '#8b5cf6',
                            detail: `${accXP.toLocaleString()} total XP`,
                        });
                        nextMilestoneIdx++;
                    }
                });
            }

            ev.sort((a, b) => ((a.date || '') < (b.date || '') ? 1 : -1));
            setEvents(ev.slice(0, 60));
            setLoading(false);
        })();
    }, [user]);

    if (loading) {
        return <div style={{ padding: '24px', textAlign: 'center', color: 'var(--text-3)', fontSize: '13px' }}>Building your chronicle…</div>;
    }

    if (!events.length) {
        return (
            <div style={{ padding: '36px', textAlign: 'center', background: 'var(--bg-elevated)', borderRadius: '14px', border: '1px solid var(--border)' }}>
                <div style={{ fontSize: '28px', marginBottom: '12px' }}>📜</div>
                <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-1)', marginBottom: '6px' }}>Your chronicle is empty</div>
                <div style={{ fontSize: '12px', color: 'var(--text-3)' }}>Start earning achievements, hitting streaks, and ranking up to write your story.</div>
            </div>
        );
    }

    return (
        <div style={{ position: 'relative', paddingLeft: '28px' }}>
            {/* Vertical spine */}
            <div style={{ position: 'absolute', left: '9px', top: '10px', bottom: '10px', width: '2px', background: 'var(--border)', borderRadius: '1px' }} />

            <div style={{ display: 'flex', flexDirection: 'column' }}>
                {events.map((ev, i) => (
                    <div key={i} style={{ position: 'relative', paddingBottom: i < events.length - 1 ? '20px' : '0' }}>
                        {/* Node */}
                        <div style={{
                            position: 'absolute', left: '-23px', top: '3px',
                            width: '14px', height: '14px', borderRadius: '50%',
                            background: ev.color, border: '2px solid var(--bg-card)',
                            boxShadow: `0 0 8px ${ev.color}55`,
                        }} />

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <span style={{ fontSize: '16px' }}>{ev.icon}</span>
                                <div>
                                    <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-1)' }}>{ev.title}</div>
                                    <div style={{ fontSize: '11px', color: ev.color, fontWeight: 600, marginTop: '1px' }}>{ev.detail}</div>
                                </div>
                            </div>
                            <div style={{ fontSize: '11px', color: 'var(--text-3)', flexShrink: 0 }}>
                                {ev.date ? new Date(ev.date + 'T12:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : '—'}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default LifeChronicle;
