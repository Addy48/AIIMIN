import { avg } from './analyticsData.js';

const BEHAVIORS = [
    { key: 'sleep_7h', label: 'Sleep ≥ 7 hours', test: (day) => day.sleep_hours >= 7 },
    { key: 'gym_done', label: 'Gym completed', test: (day) => Boolean(day.gym_done) },
    { key: 'steps_8k', label: 'Steps ≥ 8000', test: (day) => day.steps >= 8000 },
    { key: 'focus_4_cycles', label: 'Focus ≥ 4 cycles', test: (day) => day.focus_cycles >= 4 },
    { key: 'journaled', label: 'Journal entry logged', test: (day) => Boolean(day.journal_entry?.trim()) },
];

export function calculateMomentumMultiplier(lhsTimeline = []) {
    const behaviors = BEHAVIORS.map((behavior) => {
        const whenTrue = lhsTimeline.filter(behavior.test);
        const whenFalse = lhsTimeline.filter((day) => !behavior.test(day));
        const delta = avg(whenTrue.map((day) => day.globalScore)) - avg(whenFalse.map((day) => day.globalScore));

        return {
            key: behavior.key,
            label: behavior.label,
            multiplierValue: Number(delta.toFixed(2)),
            sampleSizeTrue: whenTrue.length,
            sampleSizeFalse: whenFalse.length,
        };
    }).filter((item) => item.sampleSizeTrue > 0 && item.sampleSizeFalse > 0);

    const topBehavior = behaviors.sort((a, b) => b.multiplierValue - a.multiplierValue)[0] || null;

    return {
        topBehavior: topBehavior?.label || null,
        multiplierValue: topBehavior?.multiplierValue || 0,
        explanation: topBehavior
            ? `${topBehavior.label} increases your system efficiency by ${Math.abs(topBehavior.multiplierValue).toFixed(1)} points.`
            : 'Not enough data to compute a momentum multiplier yet.',
        behaviors,
    };
}
