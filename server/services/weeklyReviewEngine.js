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

    const ranked = Array.isArray(drivers?.rankedDrivers) ? drivers.rankedDrivers : [];
    const clusterList = Array.isArray(clusters?.clusters) ? clusters.clusters : [];
    const alerts = Array.isArray(drift?.alerts) ? drift.alerts : [];

    const behavioralInsights = [
        ...ranked.slice(0, 2).map((driver) => {
            const label = String(driver.label || '');
            const arrowPart = label.includes('→') ? label.split('→')[1].trim() : label || 'outcome';
            const impact = Number(driver.impact);
            const impactText = Number.isFinite(impact) ? impact.toFixed(2) : '—';
            return `${driver.behaviorLabel || 'Behavior'} changes ${arrowPart} by ${impactText}.`;
        }),
        ...(clusterList[0]
            ? [`Best cluster: ${clusterList[0].label} raises LHS by ${Number(clusterList[0].deltas?.lhs || 0).toFixed(2)}.`]
            : []),
        ...(momentum?.topBehavior && momentum?.explanation ? [momentum.explanation] : []),
    ];

    const warnings = alerts.filter((alert) => alert.severity === 'warning').map((alert) => (
        `${alert.label} drifted by ${Number(alert.drift || 0).toFixed(2)} from baseline.`
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
