import { avg } from './analyticsData.js';

export function generateWeeklyReview({ lhsTimeline = [], drift = { alerts: [] }, drivers = { rankedDrivers: [] }, clusters = { clusters: [] }, momentum = {} }) {
    const currentWeek = lhsTimeline.slice(-7);
    const previousWeek = lhsTimeline.slice(-14, -7);

    const metrics = {
        avgSleep: { current: avg(currentWeek.map((day) => day.sleep_hours || 0)), previous: avg(previousWeek.map((day) => day.sleep_hours || 0)), suffix: 'h' },
        avgFocus: { current: avg(currentWeek.map((day) => day.focus_cycles || 0)), previous: avg(previousWeek.map((day) => day.focus_cycles || 0)), suffix: ' cycles' },
        avgMood: { current: avg(currentWeek.map((day) => day.mood || 0)), previous: avg(previousWeek.map((day) => day.mood || 0)), suffix: '/10' },
        avgSpend: { current: avg(currentWeek.map((day) => day.daily_spend || 0)), previous: avg(previousWeek.map((day) => day.daily_spend || 0)), suffix: '' },
    };

    const systemChanges = Object.entries(metrics).map(([key, value]) => ({
        metric: key,
        current: Number(value.current.toFixed(2)),
        previous: Number(value.previous.toFixed(2)),
        delta: Number((value.current - value.previous).toFixed(2)),
        summary: `${key} ${value.current >= value.previous ? 'improved' : 'declined'} by ${Math.abs(value.current - value.previous).toFixed(2)}${value.suffix}.`,
    }));

    const behavioralInsights = [
        ...drivers.rankedDrivers.slice(0, 2).map((driver) => `${driver.behaviorLabel} changes ${driver.label.split('→')[1].trim()} by ${driver.impact.toFixed(2)}.`),
        ...(clusters.clusters[0] ? [`Best cluster: ${clusters.clusters[0].label} raises LHS by ${clusters.clusters[0].deltas.lhs.toFixed(2)}.`] : []),
        ...(momentum.topBehavior ? [momentum.explanation] : []),
    ];

    const warnings = drift.alerts.filter((alert) => alert.severity === 'warning').map((alert) => (
        `${alert.label} drifted by ${alert.drift.toFixed(2)} from baseline.`
    ));

    const lowestSystem = currentWeek.reduce((acc, day) => {
        if (!day.systemScores) return acc;
        Object.entries(day.systemScores).forEach(([key, value]) => {
            acc[key] = (acc[key] || 0) + value;
        });
        return acc;
    }, {});

    const weakest = Object.entries(lowestSystem)
        .map(([key, value]) => [key, value / Math.max(1, currentWeek.length)])
        .sort((a, b) => a[1] - b[1])[0];

    const recommendations = [];
    if (weakest) recommendations.push(`Prioritize ${weakest[0]} system recovery; it is your current bottleneck.`);
    if (warnings.length === 0) recommendations.push('Maintain current system stability and keep reinforcing the highest-impact habits.');

    return {
        systemChanges,
        behavioralInsights,
        warnings,
        recommendations,
    };
}
