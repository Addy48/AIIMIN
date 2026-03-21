// ============================================================
// AIIMIN XP Engine — Ranks, XP calculation, quests, achievements
// Pure logic, no React dependency
// ============================================================

// ── RANKS ──────────────────────────────────────────────────
export const RANKS = [
    { rank: 1,  name: 'Dormant',       xpRequired: 0,       color: '#6b7280' },
    { rank: 2,  name: 'Awakened',      xpRequired: 2000,    color: '#94a3b8' },
    { rank: 3,  name: 'Rising',        xpRequired: 7000,    color: '#22c55e' },
    { rank: 4,  name: 'Ascendant',     xpRequired: 20000,   color: '#3b82f6' },
    { rank: 5,  name: 'Unleashed',     xpRequired: 50000,   color: '#8b5cf6' },
    { rank: 6,  name: 'Sovereign',     xpRequired: 120000,  color: '#f59e0b' },
    { rank: 7,  name: 'Transcendent',  xpRequired: 250000,  color: '#ef4444' },
    { rank: 8,  name: 'Boundless',     xpRequired: 500000,  color: '#ec4899' },
    { rank: 9,  name: 'Eternal',       xpRequired: 1000000, color: '#ff6b35' },
    { rank: 10, name: 'AIIMIN',        xpRequired: Infinity, color: '#ffd700' },
];

export function getRank(totalXp) {
    for (let i = RANKS.length - 1; i >= 0; i--) {
        if (totalXp >= RANKS[i].xpRequired) return RANKS[i];
    }
    return RANKS[0];
}

export function getNextRank(totalXp) {
    const current = getRank(totalXp);
    if (current.rank >= 9) return null; // rank 10 is infinite
    return RANKS[current.rank]; // next index = current.rank (0-based +1 -1)
}

export function getRankProgress(totalXp) {
    const current = getRank(totalXp);
    const next = getNextRank(totalXp);
    if (!next) return { current, next: null, progress: 1, xpInRank: 0, xpNeeded: 0 };
    const xpInRank = totalXp - current.xpRequired;
    const xpNeeded = next.xpRequired - current.xpRequired;
    return { current, next, progress: Math.min(xpInRank / xpNeeded, 1), xpInRank, xpNeeded };
}

// ── STREAK MULTIPLIER ──────────────────────────────────────
export function getStreakMultiplier(streak) {
    if (streak >= 90) return 2.5;
    if (streak >= 60) return 2.0;
    if (streak >= 30) return 1.75;
    if (streak >= 14) return 1.5;
    if (streak >= 7)  return 1.25;
    if (streak >= 3)  return 1.1;
    return 1.0;
}

// ── XP CALCULATION ─────────────────────────────────────────
export function calculateDailyXP(logData, streak = 0, cleanStreak = 0) {
    const breakdown = {};
    let base = 0;

    // Sleep
    const sleepHours = logData.sleep_hours || 0;
    if (sleepHours >= 7 && sleepHours <= 9) {
        breakdown.sleep = 50;
    } else if (logData.sleep_start && logData.sleep_end) {
        breakdown.sleep = 25;
    }

    // Gym
    if (logData.gym_done) {
        breakdown.gym = 60;
        if ((logData.gym_duration || 0) >= 60) breakdown.gym_bonus = 25;
    }

    // Breakfast
    if (logData.breakfast_done) breakdown.breakfast = 20;

    // Steps
    const steps = logData.steps || 0;
    if (steps >= 10000)      breakdown.steps = 60;
    else if (steps >= 5000)  breakdown.steps = 35;
    else if (steps >= 1000)  breakdown.steps = 15;

    // Water
    const water = logData.water_bottles || 0;
    if (water >= 4)      breakdown.water = 40;
    else if (water >= 2) breakdown.water = 20;

    // Learning
    if (logData.learning_done) breakdown.learning = 50;

    // Journal
    if (logData.journal_entry?.trim()) breakdown.journal = 35;

    // Win
    if (logData.win_logged) breakdown.win = 40;

    // Brain clarity bonus
    if (logData.brain_fog === 3) breakdown.clarity = 15; // sharp day bonus

    // Clean day bonus (no reset)
    if (cleanStreak > 0) {
        breakdown.clean_day = 25;
        if (cleanStreak >= 30) breakdown.clean_milestone = 50;
        else if (cleanStreak >= 14) breakdown.clean_milestone = 25;
        else if (cleanStreak >= 7) breakdown.clean_milestone = 15;
    }

    // Perfect day bonus (8/8 metrics)
    const metricsCompleted = [
        logData.sleep_start && logData.sleep_end,
        logData.gym_done,
        logData.breakfast_done,
        steps >= 1000,
        water >= 2,
        (logData.mood || 0) > 0,
        logData.learning_done,
        logData.journal_entry?.trim(),
    ].filter(Boolean).length;
    if (metricsCompleted === 8) breakdown.perfect_day = 150;

    // Sum base XP
    base = Object.values(breakdown).reduce((s, v) => s + v, 0);

    // Apply streak multiplier
    const multiplier = getStreakMultiplier(streak);
    const totalXP = Math.round(base * multiplier);

    return { base, multiplier, totalXP, breakdown, metricsCompleted };
}

// ── POMODORO XP ────────────────────────────────────────────
export const POMODORO_XP = 30;

// ── MONEY LOG XP (capped 3/day) ────────────────────────────
export const MONEY_XP = 15;
export const MONEY_XP_CAP = 3;

// ── POWER LEVEL ────────────────────────────────────────────
export function calculatePowerLevel(totalXp, streak, achievementCount) {
    return Math.round(totalXp * getStreakMultiplier(streak) * (1 + achievementCount * 0.03));
}

// ── DAILY QUESTS ───────────────────────────────────────────
const QUEST_POOL = [
    { id: 'gym',         text: 'Complete a gym session',              xp: 80,  check: d => d.gym_done },
    { id: 'journal50',   text: 'Write a journal entry (50+ words)',   xp: 60,  check: d => (d.journal_entry || '').trim().split(/\s+/).length >= 50 },
    { id: 'journal',     text: 'Write a journal entry',               xp: 40,  check: d => !!(d.journal_entry?.trim()) },
    { id: 'sleep7',      text: 'Log 7+ hours of sleep',              xp: 50,  check: d => (d.sleep_hours || 0) >= 7 },
    { id: 'steps5k',     text: 'Walk 5,000+ steps',                  xp: 50,  check: d => (d.steps || 0) >= 5000 },
    { id: 'steps10k',    text: 'Walk 10,000+ steps',                 xp: 70,  check: d => (d.steps || 0) >= 10000 },
    { id: 'water4',      text: 'Drink 4+ bottles of water',          xp: 40,  check: d => (d.water_bottles || 0) >= 4 },
    { id: 'water3',      text: 'Drink 3+ bottles of water',          xp: 30,  check: d => (d.water_bottles || 0) >= 3 },
    { id: 'breakfast',   text: 'Have breakfast',                      xp: 25,  check: d => d.breakfast_done },
    { id: 'learn',       text: 'Learn something today',              xp: 50,  check: d => d.learning_done },
    { id: 'win',         text: 'Log a win today',                    xp: 40,  check: d => d.win_logged },
    { id: 'clarity',     text: 'Report sharp brain clarity',         xp: 30,  check: d => d.brain_fog === 3 },
    { id: 'gym60',       text: 'Gym session 60+ min',                xp: 80,  check: d => d.gym_done && (d.gym_duration || 0) >= 60 },
    { id: 'mood8',       text: 'Reach mood 8+',                      xp: 35,  check: d => (d.mood || 0) >= 8 },
    { id: 'energy4',     text: 'Reach energy level 4+',              xp: 30,  check: d => (d.energy_level || 0) >= 4 },
];

// Deterministic daily quest selection — same 3 quests for the same date
export function getDailyQuests(dateStr) {
    // Simple hash from date string for deterministic pseudo-random selection
    let hash = 0;
    for (let i = 0; i < dateStr.length; i++) {
        hash = ((hash << 5) - hash) + dateStr.charCodeAt(i);
        hash |= 0;
    }
    hash = Math.abs(hash);

    // Shuffle pool deterministically
    const pool = [...QUEST_POOL];
    for (let i = pool.length - 1; i > 0; i--) {
        const j = (hash + i * 7 + i * i * 3) % (i + 1);
        [pool[i], pool[j]] = [pool[j], pool[i]];
    }

    // Pick 3 non-overlapping quests (avoid duplicates like journal + journal50)
    const selected = [];
    const usedIds = new Set();
    for (const quest of pool) {
        if (selected.length >= 3) break;
        const baseId = quest.id.replace(/\d+/g, '');
        if (usedIds.has(baseId)) continue;
        usedIds.add(baseId);
        selected.push(quest);
    }

    return selected;
}

export function checkQuests(quests, logData) {
    return quests.map(q => ({ ...q, completed: q.check(logData) }));
}

// ── ACHIEVEMENTS — 5 TIERS × 15 BADGES = 75 TOTAL ─────────
// Tier 5 = easiest (Bronze) → Tier 1 = hardest (Diamond)
export const ACHIEVEMENT_DEFS = [
    // ── TIER 5: BRONZE — Entry level ────────────────────────
    { id: 'first_log',        tier: 5, name: 'First Entry',       icon: '🌱', xp: 50,    desc: 'Log your first daily entry' },
    { id: 'gym_first',        tier: 5, name: 'First Rep',         icon: '🏋️', xp: 50,    desc: 'Complete your first gym session' },
    { id: 'breakfast_3',      tier: 5, name: 'Fuel Up',           icon: '🍳', xp: 50,    desc: 'Have breakfast 3 days' },
    { id: 'hydrated_3',       tier: 5, name: 'Hydrated',          icon: '💧', xp: 50,    desc: 'Drink 2+ bottles for 3 days' },
    { id: 'steps_3k',         tier: 5, name: 'On the Move',       icon: '👟', xp: 50,    desc: 'Walk 3,000+ steps once' },
    { id: 'learn_first',      tier: 5, name: 'Brain On',          icon: '📖', xp: 50,    desc: 'Learn something once' },
    { id: 'journal_first',    tier: 5, name: 'Memory',            icon: '📝', xp: 50,    desc: 'Write your first journal entry' },
    { id: 'pomo_first',       tier: 5, name: 'Focus Init',        icon: '🍅', xp: 50,    desc: 'Complete your first Pomodoro' },
    { id: 'mood_good',        tier: 5, name: 'Good Vibes',        icon: '😊', xp: 50,    desc: 'Log mood 7+ once' },
    { id: 'money_first',      tier: 5, name: 'Money Move',        icon: '💵', xp: 50,    desc: 'Log your first transaction' },
    { id: 'win_first',        tier: 5, name: 'First Win',         icon: '🏅', xp: 50,    desc: 'Log your first win' },
    { id: 'streak_3',         tier: 5, name: 'Hat Trick',         icon: '📅', xp: 100,   desc: '3-day streak' },
    { id: 'clean_first',      tier: 5, name: 'Clean Start',       icon: '🛡️', xp: 100,   desc: 'Your first clean day' },
    { id: 'dsa_first',        tier: 5, name: 'Code Init',         icon: '💻', xp: 50,    desc: 'Solve your first DSA problem' },
    { id: 'perfect_day_1',    tier: 5, name: 'Perfect Day',       icon: '✨', xp: 150,   desc: 'Log a perfect day (all 8 metrics)' },

    // ── TIER 4: SILVER — Building patterns ──────────────────
    { id: 'sleep_7d',         tier: 4, name: 'Sleep Consistent',  icon: '🌙', xp: 250,   desc: '7 days of 7h+ sleep' },
    { id: 'gym_8_30',         tier: 4, name: 'Gym Regular',       icon: '💪', xp: 300,   desc: '8 gym sessions in 30 days' },
    { id: 'breakfast_14',     tier: 4, name: 'Breakfast Club',    icon: '🥗', xp: 200,   desc: '14 breakfasts in 30 days' },
    { id: 'hydration_7',      tier: 4, name: 'Hydration Habit',   icon: '🌊', xp: 200,   desc: '7 days of 3+ bottles' },
    { id: 'steps_5k_7d',      tier: 4, name: 'Step Builder',      icon: '🦶', xp: 250,   desc: '7 days of 5k+ steps' },
    { id: 'learn_14',         tier: 4, name: 'Learner',           icon: '📚', xp: 300,   desc: '14 learning days' },
    { id: 'journal_14',       tier: 4, name: 'Journaler',         icon: '📓', xp: 250,   desc: '14 journal entries' },
    { id: 'pomo_20',          tier: 4, name: 'Focused',           icon: '⏱️', xp: 200,   desc: '20 Pomodoro sessions' },
    { id: 'mood_7d',          tier: 4, name: 'Stable Vibes',      icon: '🙂', xp: 200,   desc: '7 days of mood 7+' },
    { id: 'streak_14',        tier: 4, name: 'Biweekly Grind',    icon: '🔗', xp: 300,   desc: '14-day streak' },
    { id: 'money_20',         tier: 4, name: 'Money Tracker',     icon: '💰', xp: 200,   desc: '20 transactions logged' },
    { id: 'wins_10',          tier: 4, name: 'Win Collector',     icon: '🏆', xp: 200,   desc: '10 wins logged' },
    { id: 'first_week_clean', tier: 4, name: 'First Week Clean',  icon: '🔒', xp: 200,   desc: '7-day clean streak' },
    { id: 'dsa_10',           tier: 4, name: 'DSA Starter',       icon: '🖥️', xp: 200,   desc: 'Solve 10 DSA problems' },
    { id: 'perfect_day_3',    tier: 4, name: 'Triple Perfect',    icon: '🌟', xp: 400,   desc: '3 perfect days total' },

    // ── TIER 3: GOLD — Growth patterns ──────────────────────
    { id: 'night_owl_fixed',  tier: 3, name: 'Night Owl Fixed',   icon: '🌙', xp: 600,   desc: '21 consecutive days 7h+ sleep' },
    { id: 'hydration_king',   tier: 3, name: 'Hydration King',    icon: '💧', xp: 600,   desc: '14 consecutive days 4+ bottles' },
    { id: 'knowledge_seeker', tier: 3, name: 'Knowledge Seeker',  icon: '📚', xp: 800,   desc: '30 days of learning' },
    { id: 'the_chronicler',   tier: 3, name: 'The Chronicler',    icon: '✍️', xp: 600,   desc: '30 journal entries' },
    { id: 'focus_machine',    tier: 3, name: 'Focus Machine',     icon: '🍅', xp: 800,   desc: '50 total Pomodoro cycles' },
    { id: 'iron_commitment',  tier: 3, name: 'Iron Commitment',   icon: '⛓️', xp: 700,   desc: '21-day streak' },
    { id: 'gym_16_30',        tier: 3, name: 'Iron Regular',      icon: '🏋️', xp: 700,   desc: '16 gym sessions in 30 days' },
    { id: 'steps_8k_14d',     tier: 3, name: 'Step Master',       icon: '🏃', xp: 600,   desc: '14 days of 8k+ steps' },
    { id: 'perfect_5_week',   tier: 3, name: 'Relentless',        icon: '⭐', xp: 1000,  desc: '5 perfect days in 7 days' },
    { id: 'accountable',      tier: 3, name: 'Accountable',       icon: '💰', xp: 500,   desc: '60 money transactions logged' },
    { id: 'wins_30',          tier: 3, name: 'Win Machine',       icon: '🌟', xp: 600,   desc: '30 wins logged' },
    { id: 'two_weeks_clean',  tier: 3, name: 'Two Weeks Clean',   icon: '🔒', xp: 500,   desc: '14-day clean streak' },
    { id: 'dsa_30',           tier: 3, name: 'DSA Grinder',       icon: '💻', xp: 700,   desc: '30 DSA problems solved' },
    { id: 'unstoppable',      tier: 3, name: 'Unstoppable',       icon: '⚡', xp: 1000,  desc: '30-day streak' },
    { id: 'iron_body_lite',   tier: 3, name: 'Body Builder',      icon: '💪', xp: 800,   desc: '12 gym sessions in 30 days' },

    // ── TIER 2: PLATINUM — Elite ─────────────────────────────
    { id: 'iron_body',        tier: 2, name: 'Iron Body',         icon: '💪', xp: 1500,  desc: '20 gym sessions in 30 days' },
    { id: '10k_club',         tier: 2, name: '10K Club',          icon: '🔥', xp: 1500,  desc: '30 days of 10,000+ steps' },
    { id: 'monk_mode_3',      tier: 2, name: "Monk's Trial",      icon: '🧘', xp: 1500,  desc: '3 consecutive perfect days' },
    { id: 'focus_machine_100',tier: 2, name: 'Focus Pro',         icon: '🍅', xp: 1500,  desc: '100 total Pomodoro cycles' },
    { id: 'clear_mind',       tier: 2, name: 'Clear Mind',        icon: '🧠', xp: 1500,  desc: '30-day clean streak' },
    { id: 'first_ascension',  tier: 2, name: 'First Ascension',   icon: '🏆', xp: 3000,  desc: 'Reach Rank 5 (Unleashed)' },
    { id: 'legendary_run_45', tier: 2, name: 'Legendary',         icon: '🌟', xp: 3000,  desc: '45-day streak' },
    { id: 'gym_daily_14',     tier: 2, name: 'Gym Streak',        icon: '💪', xp: 2000,  desc: '14 consecutive gym days' },
    { id: 'sleep_perfect_30', tier: 2, name: 'Sleep Master',      icon: '🌙', xp: 2000,  desc: '30 consecutive days 7h+ sleep' },
    { id: 'dsa_100',          tier: 2, name: 'Algorithm Expert',  icon: '💻', xp: 2500,  desc: '100 DSA problems solved' },
    { id: 'journal_60',       tier: 2, name: 'Deep Chronicler',   icon: '✍️', xp: 1500,  desc: '60 journal entries' },
    { id: 'money_master',     tier: 2, name: 'Money Master',      icon: '💰', xp: 1500,  desc: '80 transactions logged' },
    { id: 'clean_60',         tier: 2, name: '2 Months Clean',    icon: '🔒', xp: 2500,  desc: '60-day clean streak' },
    { id: 'wins_50',          tier: 2, name: 'Win Legend',        icon: '🏅', xp: 2000,  desc: '50 wins logged' },
    { id: 'sovereign',        tier: 2, name: 'Sovereign Achieved',icon: '👑', xp: 5000,  desc: 'Reach Rank 6' },

    // ── TIER 1: DIAMOND — Legendary ──────────────────────────
    { id: 'monk_mode',        tier: 1, name: 'Monk Mode',         icon: '🧘', xp: 5000,  desc: '7 perfect days in a row' },
    { id: 'legendary_run',    tier: 1, name: 'Legendary Run',     icon: '🌟', xp: 7500,  desc: '60-day streak' },
    { id: 'sovereign_elite',  tier: 1, name: 'True Sovereign',    icon: '👑', xp: 10000, desc: 'Reach Rank 7 (Transcendent)' },
    { id: 'eternal_sleeper',  tier: 1, name: 'Sleep Elite',       icon: '🌙', xp: 8000,  desc: '60 consecutive days 7h+ sleep' },
    { id: 'discipline_god',   tier: 1, name: 'Discipline God',    icon: '⚡', xp: 15000, desc: '90-day streak' },
    { id: 'focus_legend',     tier: 1, name: 'Focus Legend',      icon: '🍅', xp: 10000, desc: '200 total Pomodoro cycles' },
    { id: 'dsa_master',       tier: 1, name: 'DSA Master',        icon: '💻', xp: 12000, desc: '250 DSA problems solved' },
    { id: 'iron_will',        tier: 1, name: 'Iron Will',         icon: '💪', xp: 12000, desc: '30 consecutive gym days' },
    { id: 'clean_90',         tier: 1, name: '90 Days Clean',     icon: '🔒', xp: 15000, desc: '90-day clean streak' },
    { id: 'journal_legend',   tier: 1, name: 'Journal Legend',    icon: '✍️', xp: 15000, desc: '365 journal entries' },
    { id: 'apex',             tier: 1, name: 'APEX',              icon: '🌐', xp: 20000, desc: 'Reach Rank 8' },
    { id: 'steps_legend',     tier: 1, name: 'Steps Legend',      icon: '🔥', xp: 8000,  desc: '60 days of 10k+ steps' },
    { id: '10k_club_pro',     tier: 1, name: '10K Club Pro',      icon: '🏃', xp: 12000, desc: '90 days of 10k+ steps' },
    { id: 'aiimin_touch',     tier: 1, name: 'AIIMIN Touched',    icon: '⭐', xp: 50000, desc: 'Reach Rank 9' },
    { id: 'the_aiimin',       tier: 1, name: 'THE AIIMIN',        icon: '👁️', xp: 100000,desc: 'Reach Rank 10' },
];

// Check which achievements should be unlocked based on aggregate stats
// stats = { streak, longestStreak, cleanStreak, totalXp, rank, pomoCycles, txCount, dsaCount, logs[] }
// alreadyUnlocked = Set of achievement IDs already earned
export function checkAchievements(stats, alreadyUnlocked = new Set()) {
    const L = stats.logs || [];
    const checks = {
        // Tier 5
        first_log:        () => L.length >= 1,
        gym_first:        () => countInWindow(L, 365, l => l.gym_done) >= 1,
        breakfast_3:      () => countInWindow(L, 90,  l => l.breakfast_done) >= 3,
        hydrated_3:       () => countInWindow(L, 90,  l => (l.water_bottles||0) >= 2) >= 3,
        steps_3k:         () => countInWindow(L, 90,  l => (l.steps||0) >= 3000) >= 1,
        learn_first:      () => countInWindow(L, 365, l => l.learning_done) >= 1,
        journal_first:    () => countInWindow(L, 365, l => !!(l.journal_entry?.trim())) >= 1,
        pomo_first:       () => (stats.pomoCycles || 0) >= 1,
        mood_good:        () => countInWindow(L, 90,  l => (l.mood||0) >= 7) >= 1,
        money_first:      () => (stats.txCount || 0) >= 1,
        win_first:        () => countInWindow(L, 365, l => l.win_logged) >= 1,
        streak_3:         () => (stats.streak||0) >= 3 || (stats.longestStreak||0) >= 3,
        clean_first:      () => (stats.cleanStreak||0) >= 1,
        dsa_first:        () => (stats.dsaCount || 0) >= 1,
        perfect_day_1:    () => countInWindow(L, 365, l => countMetrics(l) === 8) >= 1,
        // Tier 4
        sleep_7d:         () => countInWindow(L, 30,  l => (l.sleep_hours||0) >= 7) >= 7,
        gym_8_30:         () => countInWindow(L, 30,  l => l.gym_done) >= 8,
        breakfast_14:     () => countInWindow(L, 30,  l => l.breakfast_done) >= 14,
        hydration_7:      () => countConsecutive(L, l => (l.water_bottles||0) >= 3) >= 7,
        steps_5k_7d:      () => countInWindow(L, 30,  l => (l.steps||0) >= 5000) >= 7,
        learn_14:         () => countInWindow(L, 60,  l => l.learning_done) >= 14,
        journal_14:       () => countInWindow(L, 60,  l => !!(l.journal_entry?.trim())) >= 14,
        pomo_20:          () => (stats.pomoCycles || 0) >= 20,
        mood_7d:          () => countInWindow(L, 30,  l => (l.mood||0) >= 7) >= 7,
        streak_14:        () => (stats.streak||0) >= 14 || (stats.longestStreak||0) >= 14,
        money_20:         () => (stats.txCount || 0) >= 20,
        wins_10:          () => countInWindow(L, 90,  l => l.win_logged) >= 10,
        first_week_clean: () => (stats.cleanStreak || 0) >= 7,
        dsa_10:           () => (stats.dsaCount || 0) >= 10,
        perfect_day_3:    () => countInWindow(L, 90,  l => countMetrics(l) === 8) >= 3,
        // Tier 3
        night_owl_fixed:  () => countConsecutive(L, l => (l.sleep_hours||0) >= 7) >= 21,
        hydration_king:   () => countConsecutive(L, l => (l.water_bottles||0) >= 4) >= 14,
        knowledge_seeker: () => countInWindow(L, 90,  l => l.learning_done) >= 30,
        the_chronicler:   () => countInWindow(L, 90,  l => !!(l.journal_entry?.trim())) >= 30,
        focus_machine:    () => (stats.pomoCycles || 0) >= 50,
        iron_commitment:  () => (stats.streak||0) >= 21 || (stats.longestStreak||0) >= 21,
        gym_16_30:        () => countInWindow(L, 30,  l => l.gym_done) >= 16,
        steps_8k_14d:     () => countInWindow(L, 30,  l => (l.steps||0) >= 8000) >= 14,
        perfect_5_week:   () => countInWindow(L, 7,   l => countMetrics(l) === 8) >= 5,
        accountable:      () => (stats.txCount || 0) >= 60,
        wins_30:          () => countInWindow(L, 180, l => l.win_logged) >= 30,
        two_weeks_clean:  () => (stats.cleanStreak || 0) >= 14,
        dsa_30:           () => (stats.dsaCount || 0) >= 30,
        unstoppable:      () => (stats.streak || 0) >= 30,
        iron_body_lite:   () => countInWindow(L, 30,  l => l.gym_done) >= 12,
        // Tier 2
        iron_body:          () => countInWindow(L, 30,  l => l.gym_done) >= 20,
        '10k_club':         () => countInWindow(L, 90,  l => (l.steps||0) >= 10000) >= 30,
        monk_mode_3:        () => countConsecutive(L, l => countMetrics(l) === 8) >= 3,
        focus_machine_100:  () => (stats.pomoCycles || 0) >= 100,
        clear_mind:         () => (stats.cleanStreak || 0) >= 30,
        first_ascension:    () => (stats.rank || 1) >= 5,
        legendary_run_45:   () => (stats.streak||0) >= 45 || (stats.longestStreak||0) >= 45,
        gym_daily_14:       () => countConsecutive(L, l => l.gym_done) >= 14,
        sleep_perfect_30:   () => countConsecutive(L, l => (l.sleep_hours||0) >= 7) >= 30,
        dsa_100:            () => (stats.dsaCount || 0) >= 100,
        journal_60:         () => countInWindow(L, 180, l => !!(l.journal_entry?.trim())) >= 60,
        money_master:       () => (stats.txCount || 0) >= 80,
        clean_60:           () => (stats.cleanStreak || 0) >= 60,
        wins_50:            () => countInWindow(L, 365, l => l.win_logged) >= 50,
        sovereign:          () => (stats.rank || 1) >= 6,
        // Tier 1
        monk_mode:          () => countConsecutive(L, l => countMetrics(l) === 8) >= 7,
        legendary_run:      () => (stats.streak || 0) >= 60,
        sovereign_elite:    () => (stats.rank || 1) >= 7,
        eternal_sleeper:    () => countConsecutive(L, l => (l.sleep_hours||0) >= 7) >= 60,
        discipline_god:     () => (stats.streak || 0) >= 90,
        focus_legend:       () => (stats.pomoCycles || 0) >= 200,
        dsa_master:         () => (stats.dsaCount || 0) >= 250,
        iron_will:          () => countConsecutive(L, l => l.gym_done) >= 30,
        clean_90:           () => (stats.cleanStreak || 0) >= 90,
        journal_legend:     () => countInWindow(L, 365, l => !!(l.journal_entry?.trim())) >= 365,
        apex:               () => (stats.rank || 1) >= 8,
        steps_legend:       () => countInWindow(L, 90,  l => (l.steps||0) >= 10000) >= 60,
        '10k_club_pro':     () => countInWindow(L, 120, l => (l.steps||0) >= 10000) >= 90,
        aiimin_touch:       () => (stats.rank || 1) >= 9,
        the_aiimin:         () => (stats.rank || 1) >= 10,
    };

    const newlyUnlocked = [];
    for (const def of ACHIEVEMENT_DEFS) {
        if (alreadyUnlocked.has(def.id)) continue;
        const check = checks[def.id];
        if (check && check()) newlyUnlocked.push(def);
    }
    return newlyUnlocked;
}

// Helper: count consecutive days from most recent where predicate holds
function countConsecutive(logs, predicate) {
    if (!logs?.length) return 0;
    // Assumes logs sorted by date desc
    let count = 0;
    for (const log of logs) {
        if (predicate(log)) count++;
        else break;
    }
    return count;
}

// Helper: count days in last N entries where predicate holds
function countInWindow(logs, windowSize, predicate) {
    if (!logs?.length) return 0;
    return logs.slice(0, windowSize).filter(predicate).length;
}

// Helper: count completed metrics for a log entry (8 possible)
function countMetrics(log) {
    return [
        log.sleep_start && log.sleep_end,
        log.gym_done,
        log.breakfast_done,
        (log.steps || 0) >= 1000,
        (log.water_bottles || 0) >= 2,
        (log.mood || 0) > 0,
        log.learning_done,
        log.journal_entry?.trim(),
    ].filter(Boolean).length;
}

// ── CONTEXTUAL QUOTES ──────────────────────────────────────
const QUOTES = {
    after_reset: [
        "Fall seven times, stand up eight.",
        "The comeback is always stronger than the setback.",
        "You're not starting over. You're starting from experience.",
    ],
    clean_streak_7: [
        "Discipline is choosing between what you want now and what you want most.",
        "Small disciplines repeated with consistency lead to great achievements.",
    ],
    perfect_day: [
        "Hard work beats talent when talent doesn't work hard.",
        "Today you proved what you're capable of.",
        "Excellence is not an act, but a habit.",
    ],
    streak_broken: [
        "Everything negative is an opportunity to rise.",
        "The only way to fail is to quit. Reset and restart.",
        "Yesterday's failure is today's fuel.",
    ],
    morning_empty: [
        "The day you plant the seed is not the day you eat the fruit.",
        "Control the controllables. Start now.",
        "Every expert was once a beginner.",
    ],
    milestone_30: [
        "You didn't get here by wishing. You got here by working.",
        "30 days. The proof is in the pattern now.",
    ],
    rank_up: [
        "The best view comes after the hardest climb.",
        "New level. New challenges. Same discipline.",
        "You earned this. Now earn the next one.",
    ],
};

export function getContextualQuote(context) {
    const pool = QUOTES[context] || QUOTES.morning_empty;
    // Use current date for deterministic daily rotation
    const day = new Date().getDate();
    return pool[day % pool.length];
}

// ── RANK-UP LINES ──────────────────────────────────────────
export const RANK_UP_LINES = {
    2: "You've woken up. The hardest step is done.",
    3: "The momentum is real. Keep building.",
    4: "You see things differently now. Others haven't started.",
    5: "You've crossed the threshold most people never reach.",
    6: "You don't follow systems. You are the system.",
    7: "Transcendence isn't given. It's taken. Day by day.",
    8: "No boundaries. No ceiling. Just growth.",
    9: "Eternal. The work never stops. Neither do you.",
    10: "You are AIIMIN.",
};
