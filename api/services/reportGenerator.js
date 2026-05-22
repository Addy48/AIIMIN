export function generateReportPayload({ lhs, drivers, drift, forecast, clusters, archetypes, momentum, weeklyReview }) {
    const bestDay = lhs.timeline.reduce((best, day) => (!best || day.globalScore > best.globalScore ? day : best), null);
    const worstDay = lhs.timeline.reduce((worst, day) => (!worst || day.globalScore < worst.globalScore ? day : worst), null);

    return {
        executiveSummary: {
            globalScore: lhs.globalScore,
            topBehavior: momentum.topBehavior,
            recommendations: weeklyReview.recommendations,
        },
        lifeHealthRadar: lhs.systemScores,
        systemDiagnostics: weeklyReview.systemChanges,
        trendAnalysis: {
            drift: drift.alerts,
            forecast: forecast.horizons,
        },
        behaviorDrivers: drivers.rankedDrivers,
        bestVsWorstDay: { bestDay, worstDay },
        behaviorClusters: clusters.clusters,
        financialPosture: {
            financialScore: lhs.systemScores.financial,
            spendDrift: drift.alerts.find((alert) => alert.metric === 'daily_spend') || null,
        },
        stabilityAndDrift: drift.alerts,
        predictions: forecast.horizons,
        momentumMultiplier: momentum,
        actionPlan: weeklyReview.recommendations,
        archetypes: archetypes.archetypes,
    };
}
