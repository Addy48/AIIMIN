/**
 * BehavioralEngine.js v1.0
 * 
 * Core intelligence layer for AIIMIN.
 * Calculates Momentum, Drift, and Stability based on weighted behavioral signals.
 */

const ENGINE_VERSION = 1;

const WEIGHTS = {
    COMMITMENT: 0.30,
    SESSION: 0.25,
    SLEEP: 0.15,
    MOOD: 0.15,
    DRIFT: 0.15
};

const THRESHOLDS = {
    STREAK: 3,
    TREND: 7,
    DRIFT: 14,
    SUMMARY: 7
};

export class BehavioralEngine {
    /**
     * Calculate Momentum Score (0-100)
     * @param {Object} data - Cleaned behavioral data for the period
     * @returns {Object} { score, sufficiency, version }
     */
    static calculateMomentum(data) {
        const { logs = [], sessions = [], commitments = [], driftScore = 100 } = data;

        // 1. Data Sufficiency Check
        if (logs.length < THRESHOLDS.STREAK) {
            return { score: null, sufficiency: 'LOW', message: 'Not enough data yet (minimum 3 days).' };
        }

        // 2. Component Scores
        const commitmentScore = this._calcCommitmentScore(commitments);
        const sessionScore = this._calcSessionScore(sessions);
        const sleepScore = this._calcSleepScore(logs);
        const moodScore = this._calcMoodScore(logs);

        // 3. Weighted total
        let rawScore = (
            (commitmentScore * WEIGHTS.COMMITMENT) +
            (sessionScore * WEIGHTS.SESSION) +
            (sleepScore * WEIGHTS.SLEEP) +
            (moodScore * WEIGHTS.MOOD) +
            (driftScore * WEIGHTS.DRIFT)
        );

        // 4. Recovery Reward
        // If they had a drift period and the last 2 days are high performance, add a boost
        const recoveryBoost = this._calculateRecoveryReward(logs);
        rawScore = Math.min(100, rawScore + recoveryBoost);

        return {
            score: Math.round(rawScore),
            version: ENGINE_VERSION,
            sufficiency: logs.length >= THRESHOLDS.TREND ? 'HIGH' : 'MEDIUM',
            breakdown: { commitmentScore, sessionScore, sleepScore, moodScore, driftScore, recoveryBoost }
        };
    }

    static _calcCommitmentScore(commitments) {
        if (!commitments.length) return 0;
        const avg = commitments.reduce((acc, c) => acc + (c.fulfillment_pct || 0), 0) / commitments.length;
        return Math.min(100, avg);
    }

    static _calcSessionScore(sessions) {
        if (!sessions.length) return 0;
        // Cap sessions per day at 6 for scoring to prevent gaming the system
        const sessionsByDay = {};
        sessions.forEach(s => {
            const d = new Date(s.started_at).toISOString().split('T')[0];
            sessionsByDay[d] = (sessionsByDay[d] || 0) + 1;
        });
        const days = Object.keys(sessionsByDay).length;
        const avgSessions = sessions.length / days;
        const cappedAvg = Math.min(4, avgSessions); // Target is 4 high-quality sessions
        return (cappedAvg / 4) * 100;
    }

    static _calcSleepScore(logs) {
        const validLogs = logs.filter(l => l.sleep_hours >= 3 && l.sleep_hours <= 12);
        if (!validLogs.length) return 0;

        const avg = validLogs.reduce((acc, l) => acc + l.sleep_hours, 0) / validLogs.length;
        const variance = validLogs.reduce((acc, l) => acc + Math.pow(l.sleep_hours - avg, 2), 0) / validLogs.length;

        // Score based on 7-8h target and low variance
        const targetCloseness = Math.max(0, 100 - Math.abs(7.5 - avg) * 20);
        const consistencyScore = Math.max(0, 100 - variance * 30);

        return (targetCloseness * 0.6) + (consistencyScore * 0.4);
    }

    static _calcMoodScore(logs) {
        if (!logs.length) return 0;
        const moods = logs.map(l => l.mood_after || l.mood_before).filter(Boolean);
        if (!moods.length) return 50; // Neutral start

        const avg = moods.reduce((acc, m) => acc + m, 0) / moods.length;
        // Mood stability delta: penalize high volatility
        let volatility = 0;
        for (let i = 1; i < moods.length; i++) {
            volatility += Math.abs(moods[i] - moods[i - 1]);
        }
        const avgVolatility = volatility / (moods.length - 1 || 1);

        const stabilityScore = Math.max(0, 100 - (avgVolatility * 25));
        const positivityScore = (avg / 5) * 100;

        return (positivityScore * 0.5) + (stabilityScore * 0.5);
    }

    static _calculateRecoveryReward(logs) {
        if (logs.length < 5) return 0;

        // Deep analysis of the last 48 hours vs previous 72 hours
        const recent = logs.slice(0, 2);
        const previous = logs.slice(2, 5);

        const recentAvgMood = recent.reduce((acc, l) => acc + (l.mood_after || l.mood_before || 3), 0) / 2;
        const prevAvgMood = previous.reduce((acc, l) => acc + (l.mood_after || l.mood_before || 3), 0) / 3;

        // If mood improved by 15% and they are tracking gym/steps consistently
        if (recentAvgMood > prevAvgMood * 1.15) {
            const hasActivity = recent.every(l => l.gym_done || l.steps > 8000);
            return hasActivity ? 8 : 4; // Bouncing back!
        }

        return 0;
    }

    /**
     * Determine the correct onboarding stage for a user based on their data history
     */
    static determineOnboardingStage(data) {
        const { totalLogs = 0, consecutiveDays = 0, totalSessions = 0 } = data;

        if (totalLogs === 0) return 0; // Stage 0: New
        if (totalLogs >= 1 && totalLogs < 3) return 1; // Stage 1: First sign of life
        if (consecutiveDays >= 3 && totalLogs < 7) return 2; // Stage 2: Streak building
        if (totalLogs >= 7 && totalLogs < 14) return 3; // Stage 3: Baseline established
        if (totalLogs >= 14) return 4; // Stage 4: Full OS unlocked

        // Fallback: stay at current if not enough consistency
        if (totalLogs >= 3) return 2;
        return 1;
    }

    static getSufficiencyMessage(level, type) {
        const messages = {
            'STREAK': '3 entries required for streak calculation.',
            'TREND': '7 entries required for reliable trend analysis.',
            'DRIFT': '14 entries required for behavioral drift detection.',
            'SUMMARY': '7 days of data required for weekly executive summary.'
        };
        return messages[type] || 'Not enough data yet.';
    }
}
