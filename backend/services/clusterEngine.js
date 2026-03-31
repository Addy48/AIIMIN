import { avg } from './analyticsData.js';

const CLUSTERS = [
    {
        key: 'sleep_gym_steps',
        label: 'Sleep ≥ 7 + Gym + Steps ≥ 8000',
        test: (day) => day.sleep_hours >= 7 && day.gym_done && day.steps >= 8000,
    },
    {
        key: 'sleep_focus_journal',
        label: 'Sleep ≥ 7 + Focus ≥ 4 + Journal',
        test: (day) => day.sleep_hours >= 7 && day.focus_cycles >= 4 && Boolean(day.journal_entry?.trim()),
    },
    {
        key: 'focus_budget_control',
        label: 'Focus ≥ 4 + Spend within burn target',
        test: (day) => day.focus_cycles >= 4 && day.daily_spend <= (day.burn_target || 1500),
    },
];

export function analyzeBehaviorClusters(records = []) {
    const clusters = CLUSTERS.map((cluster) => {
        const included = records.filter(cluster.test);
        const excluded = records.filter((day) => !cluster.test(day));

        if (!included.length || !excluded.length) return null;

        return {
            key: cluster.key,
            label: cluster.label,
            sampleSize: included.length,
            deltas: {
                mood: Number((avg(included.map((day) => day.mood || 0)) - avg(excluded.map((day) => day.mood || 0))).toFixed(2)),
                focus: Number((avg(included.map((day) => day.focus_cycles || 0)) - avg(excluded.map((day) => day.focus_cycles || 0))).toFixed(2)),
                lhs: Number((avg(included.map((day) => day.globalScore || 0)) - avg(excluded.map((day) => day.globalScore || 0))).toFixed(2)),
            },
        };
    }).filter(Boolean).sort((a, b) => b.deltas.lhs - a.deltas.lhs);

    return { clusters };
}
