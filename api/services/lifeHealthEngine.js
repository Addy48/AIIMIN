import { avg, clamp } from './analyticsData.js';

const pct = (value) => clamp(value, 0, 100);

export function calculateBaseMetrics(record) {
    const sleepHours = Number(record?.sleep_hours || 0);
    const steps = Number(record?.steps || 0);
    const focusCycles = Number(record?.focus_cycles || 0);
    const targetCycles = Number(record?.target_cycles || 4) || 4;
    const focusMinutes = Number(record?.focus_minutes || 0);
    const dailySpend = Number(record?.daily_spend || 0);
    const burnTarget = Number(record?.burn_target || 1500) || 1500;
    const mood = Number(record?.mood || 0);
    const water = Number(record?.water_bottles || 0);

    const sleepScore = pct(100 - (Math.abs(7.5 - sleepHours) * 20));
    const activityScore = pct((record?.gym_done ? 100 : 0) * 0.7 + (Math.min(steps / 10000, 1) * 100) * 0.3);
    const focusMinutesScore = pct(Math.min((focusMinutes / 120) * 100, 100));
    const focusScore = pct((Math.min((focusCycles / targetCycles) * 100, 100) * 0.4) + (focusMinutesScore * 0.6));
    const financialScore = pct(Math.max(0, 100 - (((dailySpend / burnTarget) - 1) * 50)));
    const nutritionWaterScore = pct(Math.min((water / 4) * 100, 100));
    const learningScore = record?.learning_done ? 100 : 0;
    const habitCompletionScore = pct(record?.habit_completion_pct || 0);
    const routineAdherenceScore = pct(record?.routine_adherence_pct || 0);
    const budgetAdherenceScore = pct(record?.budget_adherence || financialScore);
    const savingsRateScore = pct(((Number(record?.savings_rate || 0) + 1) / 2) * 100);
    const moodStabilityScore = pct((mood / 10) * 100);
    const journalConsistencyScore = record?.journal_entry?.trim() ? 100 : 0;

    return {
        sleepScore,
        activityScore,
        focusScore,
        financialScore,
        nutritionWaterScore,
        learningScore,
        habitCompletionScore,
        routineAdherenceScore,
        budgetAdherenceScore,
        savingsRateScore,
        moodStabilityScore,
        journalConsistencyScore,
    };
}

export function calculateLifeHealthForRecord(record) {
    const baseMetrics = calculateBaseMetrics(record);

    const systemScores = {
        physical: pct((baseMetrics.sleepScore * 0.4) + (baseMetrics.activityScore * 0.4) + (baseMetrics.nutritionWaterScore * 0.2)),
        cognitive: pct((baseMetrics.focusScore * 0.7) + (baseMetrics.learningScore * 0.3)),
        discipline: pct((baseMetrics.habitCompletionScore * 0.5) + (baseMetrics.routineAdherenceScore * 0.3) + (baseMetrics.focusScore * 0.2)),
        financial: pct((baseMetrics.budgetAdherenceScore * 0.7) + (baseMetrics.savingsRateScore * 0.3)),
        emotional: pct((baseMetrics.moodStabilityScore * 0.5) + (baseMetrics.journalConsistencyScore * 0.5)),
    };

    const globalScore = pct(
        (systemScores.physical * 0.25) +
        (systemScores.cognitive * 0.20) +
        (systemScores.discipline * 0.25) +
        (systemScores.financial * 0.15) +
        (systemScores.emotional * 0.15)
    );

    return {
        date: record?.date,
        globalScore,
        systemScores,
        baseMetrics,
    };
}

export function calculateLifeHealthTimeline(records = []) {
    return records.map((record) => ({
        ...record,
        ...calculateLifeHealthForRecord(record),
    }));
}

export function summarizeLifeHealth(records = []) {
    const timeline = calculateLifeHealthTimeline(records);
    const latest = timeline[timeline.length - 1] || null;

    if (!latest) {
        return {
            globalScore: 0,
            systemScores: { physical: 0, cognitive: 0, discipline: 0, financial: 0, emotional: 0 },
            baseMetrics: calculateBaseMetrics({}),
            timeline: [],
        };
    }

    const systemScores = {
        physical: avg(timeline.map((item) => item.systemScores.physical)),
        cognitive: avg(timeline.map((item) => item.systemScores.cognitive)),
        discipline: avg(timeline.map((item) => item.systemScores.discipline)),
        financial: avg(timeline.map((item) => item.systemScores.financial)),
        emotional: avg(timeline.map((item) => item.systemScores.emotional)),
    };

    return {
        globalScore: Number(avg(timeline.map((item) => item.globalScore)).toFixed(1)),
        systemScores: Object.fromEntries(Object.entries(systemScores).map(([key, value]) => [key, Number(value.toFixed(1))])),
        baseMetrics: latest.baseMetrics,
        timeline,
    };
}
