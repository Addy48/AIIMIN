/**
 * Server-side XP engine — keep in sync with frontend/src/utils/xpEngine.js
 */

export const RANKS = [
  { rank: 1, name: 'Drifter', minXP: 0, emoji: '🌅', tagline: 'Show up. That is the whole game today.' },
  { rank: 2, name: 'Builder', minXP: 150, emoji: '🔨', tagline: 'Small wins are stacking.' },
  { rank: 3, name: 'Grinder', minXP: 400, emoji: '⚡', tagline: 'Consistency is becoming identity.' },
  { rank: 4, name: 'Machine', minXP: 900, emoji: '⚙️', tagline: 'Your systems are kicking in.' },
  { rank: 5, name: 'Operator', minXP: 1800, emoji: '🎯', tagline: 'You run the day — not the other way.' },
  { rank: 6, name: 'Architect', minXP: 3200, emoji: '🏛️', tagline: 'You design the life you want.' },
  { rank: 7, name: 'Vanguard', minXP: 5500, emoji: '🛡️', tagline: 'Discipline is visible now.' },
  { rank: 8, name: 'Titan', minXP: 9000, emoji: '🔥', tagline: 'Rare focus. Rare results.' },
  { rank: 9, name: 'Oracle', minXP: 14000, emoji: '✨', tagline: 'You see patterns others miss.' },
  { rank: 10, name: 'Legend', minXP: 20000, emoji: '👑', tagline: 'Living proof that days compound.' },
];

export const MONEY_XP = 15;
export const MONEY_XP_CAP = 3;
export const POMODORO_XP = 30;

const DAILY_XP = {
  sleep: 30,
  gym: 25,
  breakfast: 15,
  steps: 20,
  water: 10,
  learning: 20,
  journal: 15,
  win: 10,
  perfectDay: 50,
};

export function getStreakMultiplier(streakLength = 1) {
  return Math.min(2.5, 1 + streakLength * 0.1);
}

export function calculateDailyXPBreakdown(dailyLog, streakLength = 1) {
  const breakdown = [];
  let base = 0;

  if (dailyLog.sleep_hours >= 7) {
    base += DAILY_XP.sleep;
    breakdown.push({ key: 'sleep', label: 'Solid sleep', xp: DAILY_XP.sleep });
  }
  if (dailyLog.gym_done) {
    base += DAILY_XP.gym;
    breakdown.push({ key: 'gym', label: 'Gym', xp: DAILY_XP.gym });
  }
  if (dailyLog.breakfast_done) {
    base += DAILY_XP.breakfast;
    breakdown.push({ key: 'breakfast', label: 'Breakfast', xp: DAILY_XP.breakfast });
  }
  if ((dailyLog.steps || 0) >= 5000) {
    base += DAILY_XP.steps;
    breakdown.push({ key: 'steps', label: 'Steps', xp: DAILY_XP.steps });
  }
  if ((dailyLog.water_bottles || 0) >= 5) {
    base += DAILY_XP.water;
    breakdown.push({ key: 'water', label: 'Hydration', xp: DAILY_XP.water });
  }
  if (dailyLog.learning_done) {
    base += DAILY_XP.learning;
    breakdown.push({ key: 'learning', label: 'Learning', xp: DAILY_XP.learning });
  }
  if (dailyLog.journal_entry?.trim()) {
    base += DAILY_XP.journal;
    breakdown.push({ key: 'journal', label: 'Journal', xp: DAILY_XP.journal });
  }

  const metricsLogged = [
    dailyLog.sleep_hours >= 7,
    dailyLog.gym_done,
    dailyLog.breakfast_done,
    (dailyLog.steps || 0) >= 5000,
    (dailyLog.water_bottles || 0) >= 5,
    dailyLog.learning_done,
    Boolean(dailyLog.journal_entry?.trim()),
    (dailyLog.mood || 0) >= 1,
  ].filter(Boolean).length;

  if (metricsLogged === 8) {
    base += DAILY_XP.perfectDay;
    breakdown.push({ key: 'perfect_day', label: 'Perfect day', xp: DAILY_XP.perfectDay });
  }

  const multiplier = getStreakMultiplier(streakLength);
  const total = Math.max(0, Math.round(base * multiplier));

  return { base, multiplier, total, breakdown, metricsLogged };
}

export function getRankFromXP(totalXP) {
  let current = RANKS[0];
  let next = RANKS[1] || null;

  for (let i = RANKS.length - 1; i >= 0; i--) {
    if (totalXP >= RANKS[i].minXP) {
      current = RANKS[i];
      next = RANKS[i + 1] || null;
      break;
    }
  }

  const xpIntoRank = totalXP - current.minXP;
  const xpForRank = next ? next.minXP - current.minXP : 1;
  const progressPct = next ? Math.round((xpIntoRank / xpForRank) * 100) : 100;

  return {
    rank: current.rank,
    name: current.name,
    emoji: current.emoji,
    tagline: current.tagline,
    minXP: current.minXP,
    nextRank: next ? { name: next.name, minXP: next.minXP, emoji: next.emoji } : null,
    progressPct,
    xpToNext: next ? next.minXP - totalXP : 0,
  };
}

export function resolveRankName(totalXP) {
  return getRankFromXP(totalXP).name;
}
