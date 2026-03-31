import { avg } from './analyticsData.js';

const DRIVER_DEFS = [
    { key: 'sleep_to_mood', label: 'Sleep → Mood', behaviorLabel: 'Sleep ≥ 7h', whenTrue: (day) => day.sleep_hours >= 7, outcome: (day) => day.mood || 0 },
    { key: 'sleep_to_focus', label: 'Sleep → Focus', behaviorLabel: 'Sleep ≥ 7h', whenTrue: (day) => day.sleep_hours >= 7, outcome: (day) => day.focus_cycles || 0 },
    { key: 'gym_to_mood', label: 'Gym → Mood', behaviorLabel: 'Gym completed', whenTrue: (day) => Boolean(day.gym_done), outcome: (day) => day.mood || 0 },
    { key: 'steps_to_sleep', label: 'Steps → Sleep', behaviorLabel: 'Steps ≥ 8000', whenTrue: (day) => day.steps >= 8000, outcome: (day) => day.sleep_hours || 0 },
    { key: 'focus_to_spending', label: 'Focus → Spending', behaviorLabel: 'Focus ≥ 4 cycles', whenTrue: (day) => day.focus_cycles >= 4, outcome: (day) => -(day.daily_spend || 0) },
];

export function analyzeBehaviorDrivers(records = []) {
    const rankedDrivers = DRIVER_DEFS.map((driver) => {
        const whenTrue = records.filter(driver.whenTrue);
        const whenFalse = records.filter((day) => !driver.whenTrue(day));
        const trueAverage = avg(whenTrue.map(driver.outcome));
        const falseAverage = avg(whenFalse.map(driver.outcome));
        const impact = trueAverage - falseAverage;

        return {
            key: driver.key,
            label: driver.label,
            behaviorLabel: driver.behaviorLabel,
            sampleSizeTrue: whenTrue.length,
            sampleSizeFalse: whenFalse.length,
            avgWhenTrue: Number(trueAverage.toFixed(2)),
            avgWhenFalse: Number(falseAverage.toFixed(2)),
            impact: Number(impact.toFixed(2)),
        };
    })
        .filter((driver) => driver.sampleSizeTrue > 0 && driver.sampleSizeFalse > 0)
        .sort((a, b) => Math.abs(b.impact) - Math.abs(a.impact));

    return { rankedDrivers };
}
