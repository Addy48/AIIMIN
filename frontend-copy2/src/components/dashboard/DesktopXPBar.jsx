import React, { useEffect, useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { getRankProgress } from '../../utils/xpEngine';
import supabase from '../../utils/supabase';

const DesktopXPBar = () => {
    const { user } = useAuth();
    const [xpData, setXpData] = useState(null);

    useEffect(() => {
        if (!user?.id) return;
        supabase
            .from('user_xp')
            .select('total_xp, current_rank')
            .eq('user_id', user.id)
            .single()
            .then(({ data }) => { if (data) setXpData(data); });
    }, [user?.id]);

    if (!xpData) return null;

    const progress = getRankProgress(xpData.total_xp);

    return (
        <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            padding: '8px 14px',
            background: 'var(--bg-card)',
            border: '1px solid var(--border)',
            borderRadius: '999px',
            fontSize: '12px',
        }}>
            <span>{progress.emoji}</span>
            <span style={{ color: 'var(--text-2)', fontWeight: 700 }}>{progress.name}</span>
            <div style={{
                width: '80px', height: '4px',
                background: 'var(--border)',
                borderRadius: '2px',
                overflow: 'hidden',
            }}>
                <div style={{
                    width: `${progress.progressPct}%`,
                    height: '100%',
                    background: 'var(--accent)',
                    borderRadius: '2px',
                    transition: 'width 0.4s ease',
                }} />
            </div>
            <span style={{ color: 'var(--text-3)' }}>{xpData.total_xp} XP</span>
        </div>
    );
};

export default DesktopXPBar;
