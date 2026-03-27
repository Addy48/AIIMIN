import React, { useEffect, useState } from 'react';
import { getRankProgress } from '../../utils/xpEngine';
import supabase from '../../utils/supabase';

const DesktopXPBar = ({ user }) => {
    const [xpData, setXpData] = useState(null);
    const [todayXP, setTodayXP] = useState(0);

    useEffect(() => {
        if (!user) return;
        const today = new Date().toLocaleDateString('en-CA');

        supabase.from('user_xp').select('*').eq('user_id', user.id).maybeSingle()
            .then(({ data }) => { if (data) setXpData(data); });

        supabase.from('xp_log').select('xp_earned').eq('user_id', user.id).eq('date', today).maybeSingle()
            .then(({ data }) => { if (data) setTodayXP(data.xp_earned || 0); });
    }, [user]);

    if (!xpData) return null;

    const rp = getRankProgress(xpData.total_xp || 0);
    const { current, next, progress } = rp;
    const rankColor = current.color;

    return (
        <div style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border)',
            borderRadius: '14px',
            padding: '12px 20px',
            display: 'flex',
            alignItems: 'center',
            gap: '20px',
        }}>
            {/* Rank badge */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', minWidth: '80px' }}>
                <span style={{ fontSize: '9px', fontWeight: 700, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Rank</span>
                <span style={{ fontSize: '14px', fontWeight: 800, color: rankColor, letterSpacing: '-0.01em' }}>
                    ⚡ {current.name}
                </span>
            </div>

            {/* XP bar */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '5px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '10px', fontWeight: 600, color: 'var(--text-3)' }}>
                        {(xpData.total_xp || 0).toLocaleString()} XP
                        {todayXP > 0 && (
                            <span style={{ color: 'var(--success)', marginLeft: '6px' }}>+{todayXP} today</span>
                        )}
                    </span>
                    {next && (
                        <span style={{ fontSize: '10px', fontWeight: 600, color: 'var(--text-3)' }}>
                            {next.name} → {next.xpRequired.toLocaleString()}
                        </span>
                    )}
                </div>
                <div style={{ height: '6px', borderRadius: '3px', background: 'var(--bg-elevated)', overflow: 'hidden' }}>
                    <div style={{
                        height: '100%', borderRadius: '3px',
                        background: `linear-gradient(90deg, ${rankColor}, ${rankColor}bb)`,
                        width: `${(progress * 100).toFixed(1)}%`,
                        transition: 'width 0.6s ease',
                        boxShadow: `0 0 8px ${rankColor}40`,
                    }} />
                </div>
            </div>

            {/* Streak */}
            {(xpData.longest_streak || 0) > 0 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', alignItems: 'center', minWidth: '52px' }}>
                    <span style={{ fontSize: '9px', fontWeight: 700, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Streak</span>
                    <span style={{ fontSize: '14px', fontWeight: 800, color: 'var(--accent)' }}>
                        🔥 {xpData.longest_streak}
                    </span>
                </div>
            )}

            {/* Clean streak */}
            {(xpData.clean_streak || 0) > 0 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', alignItems: 'center', minWidth: '52px' }}>
                    <span style={{ fontSize: '9px', fontWeight: 700, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Clean</span>
                    <span style={{ fontSize: '14px', fontWeight: 800, color: 'var(--success)' }}>
                        ✨ {xpData.clean_streak}d
                    </span>
                </div>
            )}
        </div>
    );
};

export default DesktopXPBar;
