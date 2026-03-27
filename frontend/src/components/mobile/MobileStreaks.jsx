import React, { useState, useEffect } from 'react';
import supabase from '../../utils/supabase';
import { getStreakMultiplier } from '../../utils/xpEngine';

const MobileStreaks = ({ user }) => {
    const [streaks, setStreaks] = useState({ gym: 0, learning: 0, clean: 0, walking: 0, overall: 0 });
    const [loading, setLoading] = useState(true);
    const [expanded, setExpanded] = useState(false);

    useEffect(() => {
        if (!user) return;
        (async () => {
            setLoading(true);
            const { data: logs } = await supabase.from('daily_logs')
                .select('date, gym_done, learning_done, rc_count, steps')
                .eq('user_id', user.id)
                .order('date', { ascending: false })
                .limit(120);

            if (!logs || logs.length === 0) { setLoading(false); return; }

            const logMap = {};
            for (const l of logs) logMap[l.date] = l;

            const pad = n => String(n).padStart(2, '0');
            const countStreak = (predicate, allowMissing = false) => {
                let s = 0;
                const d = new Date();
                while (true) {
                    const dStr = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
                    const log = logMap[dStr];
                    if (log && predicate(log)) s++;
                    else if (allowMissing && !log) { /* missing = still ok */ }
                    else break;
                    d.setDate(d.getDate() - 1);
                    if (s > logs.length + 500) break;
                }
                return s;
            };

            // Overall streak = consecutive days with ANY log entry
            const overall = countStreak(() => true);
            const gym = countStreak(l => l.gym_done);
            const learning = countStreak(l => l.learning_done);
            const walking = countStreak(l => (l.steps || 0) >= 10000);
            const clean = countStreak(l => !l.rc_count || l.rc_count === 0, true);

            setStreaks({ gym, learning, clean: Math.min(clean, logs.length + 365), walking, overall });
            setLoading(false);
        })();
    }, [user]);

    if (loading) return null;

    const multiplier = getStreakMultiplier(streaks.overall);
    const items = [
        { icon: '🔥', label: 'Overall', days: streaks.overall, color: '#ff6b35' },
        { icon: '💪', label: 'Gym', days: streaks.gym, color: '#f59e0b' },
        { icon: '📚', label: 'Learning', days: streaks.learning, color: '#22c55e' },
        { icon: '🛡️', label: 'Clean', days: streaks.clean, color: '#8b5cf6' },
        { icon: '👟', label: '10K Steps', days: streaks.walking, color: '#3b82f6' },
    ];

    return (
        <div style={{
            background: 'var(--bg-card)', borderRadius: '14px', padding: '16px',
            border: '1px solid var(--border)', margin: '0 16px',
        }}>
            <div
                onClick={() => setExpanded(!expanded)}
                style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}
            >
                <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-2)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    🔗 Streaks
                </span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    {multiplier > 1 && (
                        <span style={{
                            fontSize: '10px', fontWeight: 800, color: '#ff6b35',
                            background: 'rgba(255,107,53,0.12)', padding: '2px 8px',
                            borderRadius: '6px',
                        }}>{multiplier}× XP</span>
                    )}
                    <span style={{ fontSize: '12px', color: 'var(--text-3)' }}>{expanded ? '▴' : '▾'}</span>
                </div>
            </div>

            {/* Compact view — always visible */}
            <div style={{ display: 'flex', gap: '8px', marginTop: '10px', flexWrap: 'wrap' }}>
                {items.map(item => (
                    <div key={item.label} style={{
                        display: 'flex', alignItems: 'center', gap: '4px',
                        padding: '4px 10px', borderRadius: '8px',
                        background: item.days > 0 ? `${item.color}15` : 'var(--bg-elevated)',
                        border: item.days > 0 ? `1px solid ${item.color}30` : '1px solid var(--border)',
                    }}>
                        <span style={{ fontSize: '12px' }}>{item.icon}</span>
                        <span style={{
                            fontSize: '12px', fontWeight: 800,
                            color: item.days > 0 ? item.color : 'var(--text-3)',
                        }}>{item.days}</span>
                    </div>
                ))}
            </div>

            {expanded && (
                <div style={{ marginTop: '14px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {items.map(item => (
                        <div key={item.label} style={{
                            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                            padding: '10px 12px', borderRadius: '10px',
                            background: item.days > 0 ? `${item.color}08` : 'var(--bg-elevated)',
                            border: `1px solid ${item.days > 0 ? `${item.color}25` : 'var(--border)'}`,
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <span style={{ fontSize: '20px' }}>{item.icon}</span>
                                <div>
                                    <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-1)' }}>{item.label}</div>
                                    {item.days > 0 && (
                                        <div style={{ fontSize: '10px', color: 'var(--success)', marginTop: '1px' }}>Active</div>
                                    )}
                                </div>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                                <div style={{ fontSize: '22px', fontWeight: 900, color: item.days > 0 ? item.color : 'var(--text-3)' }}>
                                    {item.days}
                                </div>
                                <div style={{ fontSize: '9px', color: 'var(--text-3)', fontWeight: 600 }}>days</div>
                            </div>
                        </div>
                    ))}

                    {/* Multiplier info */}
                    <div style={{
                        padding: '12px', borderRadius: '10px',
                        background: 'rgba(255,107,53,0.06)', border: '1px solid rgba(255,107,53,0.15)',
                        textAlign: 'center',
                    }}>
                        <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-3)', marginBottom: '4px' }}>
                            STREAK MULTIPLIER
                        </div>
                        <div style={{ fontSize: '24px', fontWeight: 900, color: '#ff6b35' }}>
                            {multiplier}×
                        </div>
                        <div style={{ fontSize: '10px', color: 'var(--text-3)', marginTop: '2px' }}>
                            {multiplier < 2.5
                                ? `Next: ${getNextMultiplierInfo(streaks.overall)}`
                                : 'Maximum multiplier reached!'
                            }
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

function getNextMultiplierInfo(streak) {
    if (streak < 3) return `${3 - streak} days to 1.1×`;
    if (streak < 7) return `${7 - streak} days to 1.25×`;
    if (streak < 14) return `${14 - streak} days to 1.5×`;
    if (streak < 30) return `${30 - streak} days to 1.75×`;
    if (streak < 60) return `${60 - streak} days to 2.0×`;
    if (streak < 90) return `${90 - streak} days to 2.5×`;
    return 'Max reached!';
}

export default MobileStreaks;
