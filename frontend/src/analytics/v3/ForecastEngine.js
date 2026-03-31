export function computeForecasts(data) {
    const { dailyLogs = [] } = data;
    if (dailyLogs.length < 7) throw new Error("Need at least 7 days of data to forecast");

    // Simple linear regression forecast
    const calculateProjection = (dataList, key, daysAhead) => {
        let sumX = 0, sumY = 0, sumXY = 0, sumX2 = 0;
        const n = dataList.length;

        dataList.forEach((point, i) => {
            const x = i;
            let val = Number(point[key]) || 0;
            if (key === 'focus') val = (Number(point.pomodoro_minutes) || 0) / 25;

            sumX += x;
            sumY += val;
            sumXY += x * val;
            sumX2 += x * x;
        });

        const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX) || 0;
        const intercept = (sumY - slope * sumX) / n || 0;

        const currentAvg = sumY / n;
        const projectedValue = parseFloat((slope * (n + daysAhead) + intercept).toFixed(2));
        const projectedChange = parseFloat((projectedValue - currentAvg).toFixed(2));

        return { slope: parseFloat(slope.toFixed(3)), projectedValue, projectedChange };
    };

    const sorted = [...dailyLogs].sort((a, b) => new Date(a.date) - new Date(b.date));

    return {
        sevenDays: {
            lhs: calculateProjection(sorted, 'globalScore', 7),
            focus: calculateProjection(sorted, 'focus', 7),
            mood: calculateProjection(sorted, 'mood', 7),
            spending: calculateProjection(sorted, 'daily_spend', 7)
        },
        thirtyDays: {
            lhs: calculateProjection(sorted, 'globalScore', 30),
            focus: calculateProjection(sorted, 'focus', 30),
            mood: calculateProjection(sorted, 'mood', 30),
            spending: calculateProjection(sorted, 'daily_spend', 30)
        }
    };
}
