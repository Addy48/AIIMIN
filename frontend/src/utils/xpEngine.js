/**
 * xpEngine.js — Gamification XP system
 *
 * Ranks: Apprentice → Adept → Warrior → Master → Sage → Champion → Legend → Mythic → Ascendant → Grandmaster
 * XP thresholds: 0, 500, 1500, 3500, 7000, 12500, 20000, 30000, 42500, 57500
 */

const RANKS = [
    { rank: 1, name: 'Apprentice',  minXP: 0,     emoji: '🌱' },
    { rank: 2, name: 'Adept',       minXP: 500,   emoji: '⚡' },
    { rank: 3, name: 'Warrior',     minXP: 1500,  emoji: '⚔️' },
    { rank: 4, name: 'Master',      minXP: 3500,  emoji: '🏆' },
    { rank: 5, name: 'Sage',        minXP: 7000,  emoji: '📚' },
    { rank: 6, name: 'Champion',    minXP: 12500, emoji: '👑' },
    { rank: 7, name: 'Legend',      minXP: 20000, emoji: '⭐' },
    { rank: 8, name: 'Mythic',      minXP: 30000, emoji: '🌟' },
    { rank: 9, name: 'Ascendant',   minXP: 42500, emoji: '✨' },
    { rank: 10, name: 'Grandmaster', minXP: 57500, emoji: '👼' },
];

export const MONEY_XP = 15;
export const MONEY_XP_CAP = 3; // max transactions that earn XP per day
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
    clarity: 10,
    cleanDay: 20,
    perfectDay: 50,
};

const QUESTS = [
    { id: 1, name: 'Sleep 8+ hours', metric: 'sleep_hours', target: 8 },
    { id: 2, name: '10K steps', metric: 'steps', target: 10000 },
    { id: 3, name: 'Gym session', metric: 'gym_done', target: 1 },
    { id: 4, name: 'Learn something new', metric: 'learning_done', target: 1 },
    { id: 5, name: 'Write journal entry', metric: 'journal_entry', target: 1 },
    { id: 6, name: 'Drink 5 bottles water', metric: 'water_bottles', target: 5 },
    { id: 7, name: 'Perfect day (8/8)', metric: 'perfect_day', target: 1 },
    { id: 8, name: 'No reset counter', metric: 'rc_count', target: 0 },
    { id: 9, name: 'Mood 7+', metric: 'mood', target: 7 },
    { id: 10, name: 'Energy high (4-5)', metric: 'energy_level', target: 4 },
    { id: 11, name: 'No brain fog', metric: 'brain_fog', target: 3 },
    { id: 12, name: 'No headache', metric: 'headache', target: 0 },
    { id: 13, name: 'Clean day streak', metric: 'clean_streak', target: 3 },
    { id: 14, name: 'Solve DSA problem', metric: 'dsa_problems', target: 1 },
    { id: 15, name: 'Log money transaction', metric: 'transactions', target: 1 },
    { id: 16, name: 'Log win', metric: 'win_text', target: 1 },
];

const ACHIEVEMENTS = [
    { id: 1, name: 'First Steps', description: 'Complete your first daily log', xpReward: 50 },
    { id: 2, name: 'Week Warrior', description: 'Complete 7 consecutive days', xpReward: 100 },
    { id: 3, name: 'Sleep Master', description: 'Sleep 8+ hours for 14 days', xpReward: 150 },
    { id: 4, name: 'Gym Rat', description: 'Gym 20 times in a month', xpReward: 150 },
    { id: 5, name: 'Bookworm', description: 'Log learning 30 days', xpReward: 100 },
    { id: 6, name: 'Hydration Hero', description: '5+ water bottles daily for 7 days', xpReward: 75 },
    { id: 7, name: 'Step Counter', description: '10K+ steps for 10 days', xpReward: 100 },
    { id: 8, name: 'Mood Tracker', description: 'Log mood for 30 consecutive days', xpReward: 150 },
    { id: 9, name: 'Perfect Day', description: 'Log all 8 metrics in one day', xpReward: 75 },
    { id: 10, name: 'Streak Master', description: 'Reach 30-day overall streak', xpReward: 200 },
    { id: 11, name: 'Journal Keeper', description: 'Write 50 journal entries', xpReward: 100 },
    { id: 12, name: 'Money Manager', description: 'Log 50 transactions', xpReward: 100 },
    { id: 13, name: 'DSA Champion', description: 'Solve 100 DSA problems', xpReward: 200 },
    { id: 14, name: 'Clean Streak', description: '30-day clean day streak', xpReward: 150 },
    { id: 15, name: 'Rank Up', description: 'Reach Rank 5 (Sage)', xpReward: 250 },
    { id: 16, name: 'Legend', description: 'Reach Rank 10 (Grandmaster)', xpReward: 500 },
];

const RANK_UP_LINES = {
    1: 'Welcome, Apprentice. Your journey begins.',
    2: 'Rising as Adept. You\'re catching momentum.',
    3: 'Warrior risen. Battle the day!',
    4: 'Master achieved. Command your time.',
    5: 'Sage unlocked. Wisdom flows.',
    6: 'Champion crowned. Lead the way.',
    7: 'Legend emerges. History notices.',
    8: 'Mythic power awakens. Feel the surge.',
    9: 'Ascendant realm. You transcend.',
    10: 'Grandmaster. The journey completes.',
};

/**
 * Calculate daily XP based on logged metrics
 * @param {Object} dailyLog - daily_logs row
 * @param {number} streakLength - current streak length
 * @returns {number} XP earned
 */
export function calculateDailyXP(dailyLog, streakLength = 1) {
    let xp = 0;

    // Base XP per logged metric
    if (dailyLog.sleep_hours >= 7) xp += DAILY_XP.sleep;
    if (dailyLog.gym_done) xp += DAILY_XP.gym;
    if (dailyLog.breakfast_done) xp += DAILY_XP.breakfast;
    if (dailyLog.steps >= 5000) xp += DAILY_XP.steps;
    if (dailyLog.water_bottles >= 5) xp += DAILY_XP.water;
    if (dailyLog.learning_done) xp += DAILY_XP.learning;
    if (dailyLog.journal_entry?.trim()) xp += DAILY_XP.journal;

    // Check if perfect day (8/8 metrics logged)
    const metricsLogged = [
        dailyLog.sleep_hours >= 7,
        dailyLog.gym_done,
        dailyLog.breakfast_done,
        dailyLog.steps >= 5000,
        dailyLog.water_bottles >= 5,
        dailyLog.learning_done,
        dailyLog.journal_entry?.trim(),
        dailyLog.mood >= 1,
    ].filter(Boolean).length;

    if (metricsLogged === 8) {
        xp += DAILY_XP.perfectDay;
    }

    // Streak multiplier: 1.0× → 2.5×
    const multiplier = Math.min(2.5, 1 + (streakLength * 0.1));
    xp = Math.round(xp * multiplier);

    return Math.max(0, xp);
}

/**
 * Get rank info from total XP
 * @param {number} totalXP
 * @returns {Object} { rank, name, emoji, nextRankXP, progressToNext }
 */
export function getRank(totalXP) {
    let current = RANKS[0];
    let nextRank = RANKS[1];

    for (let i = RANKS.length - 1; i >= 0; i--) {
        if (totalXP >= RANKS[i].minXP) {
            current = RANKS[i];
            nextRank = RANKS[i + 1] || null;
            break;
        }
    }

    const xpIntoRank = totalXP - current.minXP;
    const xpForRank = nextRank ? nextRank.minXP - current.minXP : 57500;
    const progressToNext = nextRank ? Math.round((xpIntoRank / xpForRank) * 100) : 100;

    return {
        rank: current.rank,
        name: current.name,
        emoji: current.emoji,
        nextRankXP: nextRank?.minXP || null,
        progressToNext,
    };
}

/**
 * Get daily quests (deterministic: same 3 per day)
 * @param {Date} date
 * @returns {Array} 3 quest objects
 */
export function getDailyQuests(date = new Date()) {
    // Deterministic seed from day
    const dayOfYear = Math.floor(
        (date - new Date(date.getFullYear(), 0, 0)) / (24 * 60 * 60 * 1000)
    );

    const indices = [
        dayOfYear % QUESTS.length,
        (dayOfYear + 1) % QUESTS.length,
        (dayOfYear + 2) % QUESTS.length,
    ].sort((a, b) => a - b);

    return indices.map(i => QUESTS[i]);
}

/**
 * Check which quests are completed
 * @param {Array} quests - quest objects from getDailyQuests
 * @param {Object} dailyLog - daily_logs row
 * @returns {Object} { questId: boolean, ... }
 */
export function checkQuests(quests, dailyLog) {
    const completed = {};

    quests.forEach(quest => {
        let isComplete = false;
        const value = dailyLog[quest.metric];

        if (quest.metric === 'perfect_day') {
            isComplete = dailyLog.sleep_hours >= 7 &&
                         dailyLog.gym_done &&
                         dailyLog.breakfast_done &&
                         dailyLog.steps >= 5000 &&
                         dailyLog.water_bottles >= 5 &&
                         dailyLog.learning_done &&
                         dailyLog.journal_entry?.trim() &&
                         dailyLog.mood >= 1;
        } else if (quest.metric === 'rc_count') {
            isComplete = (value || 0) === quest.target;
        } else if (quest.metric === 'headache') {
            isComplete = value === !quest.target;
        } else if (typeof value === 'number') {
            isComplete = value >= quest.target;
        } else if (typeof value === 'boolean') {
            isComplete = value === (quest.target === 1);
        } else if (typeof value === 'string') {
            isComplete = value?.trim().length > 0 && quest.target > 0;
        }

        completed[quest.id] = isComplete;
    });

    return completed;
}

/**
 * Check unlocked achievements
 * @param {Object} userData - user row with stats
 * @param {Array} existingAchievements - already unlocked achievement IDs
 * @returns {Array} newly unlocked achievement objects
 */
export function checkAchievements(userData, existingAchievements = []) {
    const newAchievements = [];

    ACHIEVEMENTS.forEach(achievement => {
        if (existingAchievements.includes(achievement.id)) return; // already unlocked

        let unlocked = false;

        switch (achievement.id) {
            case 1: // First Steps
                unlocked = userData.total_xp >= 10;
                break;
            case 2: // Week Warrior
                unlocked = userData.longest_streak >= 7;
                break;
            case 3: // Sleep Master
                unlocked = (userData.stats?.sleep_days_8h || 0) >= 14;
                break;
            case 4: // Gym Rat
                unlocked = (userData.stats?.gym_count || 0) >= 20;
                break;
            case 5: // Bookworm
                unlocked = (userData.stats?.learning_days || 0) >= 30;
                break;
            case 6: // Hydration Hero
                unlocked = (userData.stats?.hydration_streak || 0) >= 7;
                break;
            case 7: // Step Counter
                unlocked = (userData.stats?.steps_10k_days || 0) >= 10;
                break;
            case 8: // Mood Tracker
                unlocked = (userData.stats?.mood_logged_days || 0) >= 30;
                break;
            case 9: // Perfect Day
                unlocked = (userData.stats?.perfect_days || 0) >= 1;
                break;
            case 10: // Streak Master
                unlocked = userData.longest_streak >= 30;
                break;
            case 11: // Journal Keeper
                unlocked = (userData.stats?.journal_entries || 0) >= 50;
                break;
            case 12: // Money Manager
                unlocked = (userData.stats?.transactions_logged || 0) >= 50;
                break;
            case 13: // DSA Champion
                unlocked = (userData.stats?.dsa_problems || 0) >= 100;
                break;
            case 14: // Clean Streak
                unlocked = userData.clean_streak >= 30;
                break;
            case 15: // Rank Up
                unlocked = userData.current_rank >= 5;
                break;
            case 16: // Legend
                unlocked = userData.current_rank >= 10;
                break;
            default:
                break;
        }

        if (unlocked) {
            newAchievements.push(achievement);
        }
    });

    return newAchievements;
}

/** Alias for backwards-compat with AchievementsGallery */
export const ACHIEVEMENT_DEFS = ACHIEVEMENTS;

/**
 * Get rank progress details (used by MobileHeader)
 * @param {number} totalXP
 * @returns {{ name, emoji, rank, progressPct, xpToNext }}
 */
export function getRankProgress(totalXP) {
    const info = getRank(totalXP);
    return {
        name: info.name,
        emoji: info.emoji,
        rank: info.rank,
        progressPct: info.progressToNext,
        xpToNext: info.nextRankXP ? info.nextRankXP - totalXP : 0,
    };
}

/**
 * Get XP multiplier based on streak length (used by MobileStreaks)
 * @param {number} streakLength
 * @returns {number} multiplier 1.0 – 2.5
 */
export function getStreakMultiplier(streakLength) {
    return Math.min(2.5, 1 + (streakLength * 0.1));
}

const QUOTES = {
    after_reset: [
        'Every master was once a beginner. Reset. Rebuild.',
        'The only failure is not getting back up.',
        'Today is day one. Again.',
    ],
    perfect_day: [
        'Perfection is a practice, not a destination.',
        'You showed up fully today. That matters.',
        'Flawless execution. Keep the streak alive.',
    ],
    morning_empty: [
        'The blank page is potential. Fill it.',
        'Small actions compound into large results.',
        'Start before you feel ready.',
    ],
    default: [
        'Progress over perfection.',
        'Discipline is choosing between what you want now and what you want most.',
        'The system builds the person.',
        'One metric at a time.',
    ],
};

/**
 * Get a contextual motivational quote (used by DailyQuote)
 * @param {string} context - 'after_reset' | 'perfect_day' | 'morning_empty' | 'default'
 * @returns {string}
 */
export function getContextualQuote(context = 'default') {
    const pool = QUOTES[context] || QUOTES.default;
    const dayOfYear = Math.floor(
        (new Date() - new Date(new Date().getFullYear(), 0, 0)) / 86400000
    );
    return pool[dayOfYear % pool.length];
}

export { RANKS, QUESTS, ACHIEVEMENTS, RANK_UP_LINES };
