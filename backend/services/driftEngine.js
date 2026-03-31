import { avg } from './analyticsData.js';

const METRICS = [
    { key: 'sleep_hours', label: 'Sleep', unit: 'h' },
    { key: 'focus_cycles', label: 'Focus', unit: 'cycles' },
    { key: 'mood', label: 'Mood', unit: '/10' },
    { key: 'daily_spend', label: 'Spending', unit: 'currency' },
    { key: 'steps', label: 'Steps', unit: 'steps' },
];

export function detectDrift(records = []) {
    const recent = records.slice(-14);
    const baseline = records.slice(0, Math.max(0, records.length - 14));

    const alerts = METRICS.map((metric) => {
        const recentAvg = avg(recent.map((day) => Number(day[metric.key] || 0)));
        const baselineAvg = avg((baseline.length ? baseline : records).map((day) => Number(day[metric.key] || 0)));
        const drift = recentAvg - baselineAvg;

        return {
            metric: metric.key,
            label: metric.label,
            baseline: Number(baselineAvg.toFixed(2)),
            recent: Number(recentAvg.toFixed(2)),
            drift: Number(drift.toFixed(2)),
            severity: Math.abs(drift) >= (metric.key === 'steps' ? 1500 : metric.key === 'daily_spend' ? 250 : 0.5) ? 'warning' : 'stable',
        };
    }).filter((item) => item.recent || item.baseline);

    return { alerts };
}
