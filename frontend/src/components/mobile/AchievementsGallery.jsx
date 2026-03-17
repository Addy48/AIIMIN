import React, { useState, useEffect } from 'react';
import supabase from '../../utils/supabase';
import { ACHIEVEMENT_DEFS } from '../../utils/xpEngine';

const TIERS = [
    { tier: 1, name: 'Diamond', color: 'var(--tier-diamond)', bg: 'var(--tier-diamond-bg)', label: '💎 Diamond' },
    { tier: 2, name: 'Platinum', color: 'var(--tier-platinum)', bg: 'var(--tier-platinum-bg)', label: '⬡ Platinum' },
    { tier: 3, name: 'Gold', color: 'var(--tier-gold)', bg: 'var(--tier-gold-bg)', label: '🥇 Gold' },
    { tier: 4, name: 'Silver', color: 'var(--tier-silver)', bg: 'var(--tier-silver-bg)', label: '🥈 Silver' },
    { tier: 5, name: 'Bronze', color: 'var(--tier-bronze)', bg: 'var(--tier-bronze-bg)', label: '🥉 Bronze' },
];

const AchievementsGallery = ({ user, compact = false }) => {
    const [unlocked, setUnlocked] = useState(new Set());
    const [openTier, setOpenTier] = useState(null);

    useEffect(() => {
        if (!user) return;
        (async () => {
            const { data } = await supabase.from('achievements')
                .select('achievement_id').eq('user_id', user.id);
            if (data) setUnlocked(new Set(data.map(a => a.achievement_id)));
        })();
    }, [user]);

    const totalUnlocked = unlocked.size;
    const totalBadges = ACHIEVEMENT_DEFS.length;

    // Group badges by tier
    const byTier = {};
    for (const t of TIERS) byTier[t.tier] = ACHIEVEMENT_DEFS.filter(a => a.tier === t.tier);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>

            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <div style={{ fontSize: compact ? '13px' : '15px', fontWeight: 700, color: 'var(--text-1)' }}>
                        🏅 Achievement Vault
                    </div>
                    <div style={{ fontSize: '11px', color: 'var(--text-3)', marginTop: '2px' }}>
                        {totalUnlocked} of {totalBadges} unlocked
                    </div>
                </div>
                <div style={{
                    fontSize: '12px', fontWeight: 800,
                    color: 'var(--accent)', background: 'var(--accent-dim)',
                    border: '1px solid var(--border-accent)',
                    padding: '4px 10px', borderRadius: '99px',
                }}>
                    {Math.round((totalUnlocked / totalBadges) * 100)}% Complete
                </div>
            </div>

            {/* Global progress */}
            <div style={{ height: '5px', borderRadius: '3px', background: 'var(--bg-elevated)', overflow: 'hidden' }}>
                <div style={{
                    height: '100%', borderRadius: '3px', transition: 'width 0.6s ease',
                    width: `${(totalUnlocked / totalBadges) * 100}%`,
                    background: 'linear-gradient(90deg, var(--tier-bronze), var(--tier-silver), var(--tier-gold), var(--tier-platinum), var(--tier-diamond))',
                }} />
            </div>

            {/* Tier sections */}
            {TIERS.map(tierInfo => {
                const badges = byTier[tierInfo.tier] || [];
                const tierUnlocked = badges.filter(b => unlocked.has(b.id)).length;
                const isOpen = openTier === tierInfo.tier;

                return (
                    <div key={tierInfo.tier} style={{
                        borderRadius: '12px', overflow: 'hidden',
                        border: `1px solid ${tierUnlocked === badges.length && badges.length > 0 ? 'var(--border-accent)' : 'var(--border)'}`,
                    }}>
                        {/* Tier header */}
                        <button
                            onClick={() => setOpenTier(isOpen ? null : tierInfo.tier)}
                            style={{
                                width: '100%', display: 'flex', justifyContent: 'space-between',
                                alignItems: 'center', padding: '10px 14px',
                                background: isOpen ? tierInfo.bg : 'var(--bg-elevated)',
                                border: 'none', cursor: 'pointer', transition: 'background 0.2s',
                            }}
                        >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <span style={{ fontSize: compact ? '13px' : '14px', fontWeight: 700, color: tierInfo.color }}>
                                    {tierInfo.label}
                                </span>
                                <span style={{
                                    fontSize: '10px', fontWeight: 700,
                                    color: tierUnlocked > 0 ? tierInfo.color : 'var(--text-3)',
                                    background: tierUnlocked > 0 ? 'var(--accent-dim)' : 'transparent',
                                    padding: '2px 7px', borderRadius: '99px',
                                    border: tierUnlocked > 0 ? `1px solid var(--border-accent)` : '1px solid transparent',
                                }}>
                                    {tierUnlocked}/{badges.length}
                                </span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                {/* Mini progress bar */}
                                <div style={{ width: '60px', height: '4px', borderRadius: '2px', background: 'var(--bg-card)', overflow: 'hidden' }}>
                                    <div style={{
                                        height: '100%', background: tierInfo.color, borderRadius: '2px',
                                        width: `${(tierUnlocked / badges.length) * 100}%`,
                                        transition: 'width 0.4s',
                                    }} />
                                </div>
                                <span style={{ fontSize: '11px', color: 'var(--text-3)' }}>{isOpen ? '▴' : '▾'}</span>
                            </div>
                        </button>

                        {/* Badge grid */}
                        {isOpen && (
                            <div style={{
                                padding: '12px', background: 'var(--bg-card)',
                                display: 'grid',
                                gridTemplateColumns: compact ? 'repeat(5, 1fr)' : 'repeat(5, 1fr)',
                                gap: '8px',
                            }}>
                                {badges.map(ach => {
                                    const isUnlocked = unlocked.has(ach.id);
                                    return (
                                        <div
                                            key={ach.id}
                                            title={`${ach.name}: ${ach.desc}${isUnlocked ? ` (+${ach.xp} XP)` : ''}`}
                                            style={{
                                                display: 'flex', flexDirection: 'column', alignItems: 'center',
                                                padding: '10px 4px', borderRadius: '10px',
                                                background: isUnlocked ? tierInfo.bg : 'var(--bg-elevated)',
                                                border: isUnlocked ? `1px solid var(--border-accent)` : '1px solid var(--border)',
                                                opacity: isUnlocked ? 1 : 0.45,
                                                transition: 'all 0.25s',
                                                boxShadow: isUnlocked ? `0 0 10px var(--accent-dim)` : 'none',
                                                cursor: 'default',
                                            }}
                                        >
                                            <span style={{
                                                fontSize: compact ? '20px' : '22px',
                                                filter: isUnlocked ? 'none' : 'grayscale(1)',
                                            }}>
                                                {ach.icon}
                                            </span>
                                            <span style={{
                                                fontSize: '8px', fontWeight: 700, marginTop: '5px',
                                                color: isUnlocked ? tierInfo.color : 'var(--text-3)',
                                                textAlign: 'center', lineHeight: 1.3,
                                            }}>
                                                {ach.name}
                                            </span>
                                            {isUnlocked ? (
                                                <span style={{ fontSize: '7px', color: 'var(--accent)', marginTop: '2px', fontWeight: 700 }}>
                                                    +{ach.xp.toLocaleString()} XP
                                                </span>
                                            ) : (
                                                <span style={{
                                                    fontSize: '7px', color: 'var(--text-3)', marginTop: '2px',
                                                    textAlign: 'center', lineHeight: 1.3,
                                                }}>
                                                    {ach.desc}
                                                </span>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                );
            })}

        </div>
    );
};

export default AchievementsGallery;

