import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { RANKS, RANK_UP_LINES, getRankProgress, getStreakMultiplier, POMODORO_XP, MONEY_XP } from '../../utils/xpEngine';
import { useAuth } from '../../hooks/useAuth';
import supabase from '../../utils/supabase';
import { motion } from 'framer-motion';
import { staggerContainer, staggerItem } from '../../utils/motionPresets';

const RANK_UNLOCK_HINTS = {
  2: 'Streak multipliers start climbing with consistent daily logs.',
  3: 'Warrior tier — stronger quest rewards and achievement checks.',
  4: 'Master — analytics depth and rank badge on your profile.',
  5: 'Sage — “Rank Up” achievement becomes reachable.',
  6: 'Champion — leaderboard-ready identity.',
  7: 'Legend — long-horizon streak bonuses.',
  8: 'Mythic — elite quest weighting in the daily pool.',
  9: 'Ascendant — up to 2.5× streak multiplier.',
  10: 'Grandmaster — top rank, Legend achievement unlocks.',
};

const EARN_TODAY = [
  { label: 'Log your day', xp: 'up to ~200', to: '/overview' },
  { label: 'Focus session', xp: `+${POMODORO_XP}`, to: '/focus' },
  { label: 'Money entry', xp: `+${MONEY_XP}`, to: '/finance' },
];

const RANK_TIERS = [
  { label: 'Foundation', ranks: [1, 2, 3] },
  { label: 'Ascension', ranks: [4, 5, 6] },
  { label: 'Elite', ranks: [7, 8, 9, 10] },
];

export default function RankLadder({ compact = false }) {
  const { user } = useAuth();
  const [xpData, setXpData] = useState(null);

  useEffect(() => {
    if (!user?.id) return;
    supabase
      .from('user_xp')
      .select('total_xp, current_rank, longest_streak, clean_streak')
      .eq('user_id', user.id)
      .maybeSingle()
      .then(({ data }) => { if (data) setXpData(data); });
  }, [user?.id]);

  const totalXP = xpData?.total_xp || 0;
  const streak = xpData?.longest_streak || xpData?.clean_streak || 0;
  const multiplier = getStreakMultiplier(streak);
  const progress = getRankProgress(totalXP);
  const current = progress.current;
  const next = progress.next;
  const xpToNext = next ? Math.max(0, next.minXP - totalXP) : 0;
  const progressPct = Math.round((progress.progress || 0) * 100);

  return (
    <div className="rank-ladder" style={{ marginTop: compact ? 14 : 16 }}>
      <div
        className="rank-ladder__current"
        style={{
          padding: '14px 16px',
          borderRadius: 14,
          border: '1px solid var(--color-border)',
          background: 'var(--color-surface-1)',
          marginBottom: compact ? 0 : 16,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 14, flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, minWidth: 0 }}>
            <span
              style={{
                fontSize: 26,
                lineHeight: 1,
                width: 44,
                height: 44,
                display: 'grid',
                placeItems: 'center',
                borderRadius: 12,
                background: 'var(--color-surface-2)',
                border: '1px solid var(--color-border)',
                flexShrink: 0,
              }}
            >
              {current.emoji}
            </span>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--color-text-3)' }}>
                Rank {current.rank} of {RANKS.length}
              </div>
              <div style={{ fontSize: 17, fontWeight: 800, color: 'var(--color-text-1)', letterSpacing: '-0.02em' }}>
                {current.name}
              </div>
              {next && compact && (
                <div style={{ marginTop: 4, fontSize: 12, color: 'var(--color-text-2)' }}>
                  {xpToNext.toLocaleString()} XP to {next.name}
                </div>
              )}
            </div>
          </div>
          <div style={{ textAlign: 'right', flexShrink: 0 }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 18, fontWeight: 800, color: 'var(--color-text-1)' }}>
              {totalXP.toLocaleString()}
            </div>
            <div style={{ fontSize: 11, color: 'var(--color-text-3)', fontWeight: 600 }}>total XP</div>
            {streak > 0 && (
              <div style={{ marginTop: 4, fontSize: 11, color: 'var(--color-accent)', fontWeight: 700 }}>
                {multiplier.toFixed(1)}× streak
              </div>
            )}
          </div>
        </div>

        {next && (
          <>
            <div style={{ marginTop: 12, height: 6, borderRadius: 999, background: 'var(--color-surface-4)', overflow: 'hidden' }}>
              <div
                style={{
                  width: `${progressPct}%`,
                  height: '100%',
                  borderRadius: 999,
                  background: 'var(--color-accent)',
                  transition: 'width 0.4s ease',
                }}
              />
            </div>
            {!compact && (
              <>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, marginTop: 6, fontSize: 12, color: 'var(--color-text-2)' }}>
                  <span>{xpToNext.toLocaleString()} XP to {next.emoji} {next.name}</span>
                  <span style={{ color: 'var(--color-text-3)' }}>{progressPct}%</span>
                </div>
                <p style={{ margin: '10px 0 0', fontSize: 12, lineHeight: 1.5, color: 'var(--color-text-3)' }}>
                  <span style={{ color: 'var(--color-text-2)', fontWeight: 600 }}>Next: </span>
                  {RANK_UNLOCK_HINTS[next.rank] || RANK_UP_LINES[next.rank]}
                </p>
              </>
            )}
          </>
        )}

        {!next && (
          <p style={{ margin: '10px 0 0', fontSize: 12, color: 'var(--color-success)', fontWeight: 600 }}>
            Grandmaster — ladder complete.
          </p>
        )}
      </div>

      {!compact && (
        <>
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 8,
              marginBottom: 16,
            }}
          >
            {EARN_TODAY.map((item) => (
              <Link
                key={item.label}
                to={item.to}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '8px 12px',
                  borderRadius: 10,
                  border: '1px solid var(--color-border)',
                  background: 'var(--color-surface-1)',
                  color: 'var(--color-text-2)',
                  fontSize: 12,
                  fontWeight: 600,
                  textDecoration: 'none',
                  transition: 'border-color 0.15s ease',
                }}
              >
                <span>{item.label}</span>
                <span style={{ color: 'var(--color-accent)', fontFamily: 'var(--font-mono)', fontSize: 11 }}>{item.xp}</span>
              </Link>
            ))}
          </div>

          {RANK_TIERS.map((tier) => {
            const tierRanks = RANKS.filter((r) => tier.ranks.includes(r.rank));
            return (
              <div key={tier.label} style={{ marginBottom: 16 }}>
                <div
                  style={{
                    fontSize: 10,
                    fontWeight: 800,
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    color: 'var(--color-text-3)',
                    marginBottom: 8,
                    paddingLeft: 2,
                  }}
                >
                  {tier.label}
                </div>
                <motion.ul
                  className="rank-ladder__list"
                  variants={staggerContainer}
                  initial="hidden"
                  animate="show"
                  style={{ margin: 0 }}
                >
                  {tierRanks.map((r) => {
                    const isCurrent = r.rank === current.rank;
                    const isPast = totalXP >= r.minXP && !isCurrent;
                    const isLocked = totalXP < r.minXP && !isCurrent;
                    return (
                      <motion.li
                        key={r.rank}
                        className="rank-ladder__item"
                        variants={staggerItem}
                        style={{
                          borderColor: isCurrent ? 'var(--color-border)' : undefined,
                          borderLeftWidth: isCurrent ? 3 : 1,
                          borderLeftColor: isCurrent ? 'var(--color-accent)' : undefined,
                          background: isCurrent ? 'var(--color-surface-1)' : isPast ? 'transparent' : undefined,
                          opacity: isLocked ? 0.55 : 1,
                        }}
                      >
                        <span className="rank-ladder__emoji">{r.emoji}</span>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, flexWrap: 'wrap' }}>
                            <strong style={{ color: 'var(--color-text-1)' }}>{r.name}</strong>
                            {isCurrent && (
                              <span style={{ fontSize: 10, color: 'var(--color-accent)', fontWeight: 700, textTransform: 'uppercase' }}>
                                Current
                              </span>
                            )}
                            {isPast && (
                              <span style={{ fontSize: 10, color: 'var(--color-success)', fontWeight: 600 }}>Unlocked</span>
                            )}
                            <span className="rank-ladder__xp">{r.minXP.toLocaleString()} XP</span>
                          </div>
                          <p style={{ margin: '4px 0 0', fontSize: 12, lineHeight: 1.45, color: 'var(--color-text-3)' }}>
                            {RANK_UP_LINES[r.rank]}
                          </p>
                        </div>
                      </motion.li>
                    );
                  })}
                </motion.ul>
              </div>
            );
          })}
        </>
      )}
    </div>
  );
}
