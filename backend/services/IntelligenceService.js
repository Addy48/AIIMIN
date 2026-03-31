// backend/services/IntelligenceService.js

/**
 * Core mathematical engine for AIIMIN V3 Intelligence Layer.
 */
export class IntelligenceService {

    // Calculates a 0-100 score for a single day based on actual metrics
    static calculateDailyLHS(log, sessionCycles, transactions) {
        // Fallbacks
        const sleepHours = parseFloat(log?.sleep_hours) || 0;
        const steps = log?.steps || 0;
        const gym = log?.gym_done ? 100 : 0;
        const mood = log?.mood || 3; // 1-5 scale

        // Level 1: Base Metrics
        const sleepScore = Math.max(0, 100 - Math.abs(7.5 - sleepHours) * 20); // 7.5h = 100, 6.5h = 80
        const activityScore = (gym * 0.7) + (Math.min(steps / 10000, 1) * 100) * 0.3;
        const focusScore = Math.min((sessionCycles / 4) * 100, 100); // dynamic target later

        // Discipline & Emotion
        const routineAdherence = log?.breakfast_done && log?.learning_done ? 100 : 50;
        const emotionalScore = (mood / 5) * 100;

        // Level 2: Systems
        const Physical = (sleepScore * 0.4) + (activityScore * 0.4) + 20; // +20 assumes base nutrition
        const Cognitive = (focusScore * 0.7) + (log?.learning_done ? 30 : 0);
        const Discipline = routineAdherence;
        const Financial = 80; // Placeholder until transaction processing
        const Emotional = emotionalScore;

        // Level 3: Global LHS
        const LHS = (Physical * 0.25) + (Cognitive * 0.20) + (Discipline * 0.25) + (Financial * 0.15) + (Emotional * 0.15);
        return LHS;
    }

    // Calculate Standard Deviation
    static stdDev(array) {
        if (array.length < 2) return 0;
        const n = array.length;
        const mean = array.reduce((a, b) => a + b) / n;
        const variance = array.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / (n - 1);
        return Math.sqrt(variance);
    }

    // Calculate Linear Regression Slope (Momentum)
    static calculateSlope(yValues) {
        if (yValues.length < 2) return 0;
        const n = yValues.length;
        let sumX = 0, sumY = 0, sumXY = 0, sumXX = 0;
        for (let i = 0; i < n; i++) {
            const x = i; // Time axis
            const y = yValues[i];
            sumX += x;
            sumY += y;
            sumXY += x * y;
            sumXX += x * x;
        }
        const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
        return slope;
    }

    // Calculates Behavioral Stability Score (100 - volatility)
    static calculateStabilityScore(lhsHistory) {
        if (lhsHistory.length < 3) return 100;
        const volatility = this.stdDev(lhsHistory);
        // Scale factor: A stdDev of 15 points in LHS is highly unstable (0 score).
        const scale = 6.66;
        return Math.max(0, 100 - (volatility * scale));
    }

    // Identifies Habit Decay (Week 1 vs Week 4)
    static analyzeHabitDecay(logs) {
        // Needs 28 days of logs sorted oldest to newest
        if (logs.length < 28) return null;

        const w1 = logs.slice(0, 7);
        const w4 = logs.slice(-7);

        const w1Gym = w1.filter(l => l.gym_done).length / 7;
        const w4Gym = w4.filter(l => l.gym_done).length / 7;

        if (w1Gym > 0.5 && w4Gym < (w1Gym * 0.6)) {
            return {
                habit: 'Gym',
                severeDecay: true,
                insight: `Gym adherence declining for 21+ days from ${(w1Gym * 100).toFixed(0)}% to ${(w4Gym * 100).toFixed(0)}%.`
            };
        }
        return null;
    }

    // Weekly System Diagnosis (AI narrative builder)
    static generateWeeklyDiagnosis(curr, prev) {
        const diagnosis = [];

        // Sleep
        const sleepDelta = curr.avgSleep - prev.avgSleep;
        if (Math.abs(sleepDelta) >= 0.2) {
            diagnosis.push(`Sleep recovery ${sleepDelta > 0 ? 'improved' : 'declined'} by ${Math.abs(sleepDelta).toFixed(1)}h.`);
        }

        // Focus (cycles)
        const focusDelta = prev.avgFocus > 0 ? (curr.avgFocus - prev.avgFocus) / prev.avgFocus : 0;
        if (Math.abs(focusDelta) >= 0.1) {
            diagnosis.push(`Focus output ${focusDelta > 0 ? 'increased' : 'decreased'} ${(Math.abs(focusDelta) * 100).toFixed(0)}%.`);
        }

        // Steps
        const stepsDelta = prev.avgSteps > 0 ? (curr.avgSteps - prev.avgSteps) / prev.avgSteps : 0;
        if (Math.abs(stepsDelta) >= 0.15) {
            diagnosis.push(`Movement volume ${stepsDelta > 0 ? 'grew' : 'contracted'} by ${(Math.abs(stepsDelta) * 100).toFixed(0)}%.`);
        }

        // Consistency (gym)
        const gymDelta = curr.gymFreq - prev.gymFreq;
        if (Math.abs(gymDelta) >= 0.1) {
            diagnosis.push(`Physical discipline is ${gymDelta > 0 ? 'strengthening' : 'wavering'}.`);
        }

        return diagnosis.length > 0 ? diagnosis : ["System stability achieved. No significant deltas this week."];
    }

    // Calculates health scores (0-100) for all 5 major life systems based on trailing data
    static calculateSystemScores(logs, sessions, transactions) {
        const avg = (arr, key) => arr.length > 0 ? arr.reduce((s, x) => s + (parseFloat(x[key]) || 0), 0) / arr.length : 0;

        // Physical: Sleep + Steps + Gym
        const avgSleep = avg(logs, 'sleep_hours');
        const sleepScore = Math.min(100, (avgSleep / 7.5) * 100);
        const gymScore = (logs.filter(l => l.gym_done).length / (logs.length || 1)) * 100;
        const physical = Math.round((sleepScore * 0.5) + (gymScore * 0.5));

        // Cognitive: Focus cycles + Learning
        const totalCycles = sessions.reduce((s, x) => s + (x.cycles_completed || 0), 0);
        const avgCycles = totalCycles / (logs.length || 1);
        const focusScore = Math.min(100, (avgCycles / 4) * 100);
        const learningScore = (logs.filter(l => l.learning_done).length / (logs.length || 1)) * 100;
        const cognitive = Math.round((focusScore * 0.7) + (learningScore * 0.3));

        // discipline: Habit consistency + Morning routines
        const habits = ['breakfast_done', 'gym_done', 'learning_done'];
        let habitSum = 0;
        logs.forEach(l => {
            habits.forEach(h => { if (l[h]) habitSum++; });
        });
        const discipline = Math.round((habitSum / ((logs.length || 1) * habits.length)) * 100);

        // financial: Placeholder for now
        const financial = 78;

        // Emotional: Avg mood
        const avgMood = avg(logs, 'mood');
        const emotional = Math.round((avgMood / 5) * 100);

        return { physical, cognitive, discipline, financial, emotional };
    }
}
