const clampForecast = (value) => Number.isFinite(value) ? Number(value.toFixed(2)) : 0;

function linearRegression(values = []) {
    if (values.length < 2) return { slope: 0, intercept: values[0] || 0 };

    const n = values.length;
    let sumX = 0;
    let sumY = 0;
    let sumXY = 0;
    let sumXX = 0;

    values.forEach((value, index) => {
        sumX += index;
        sumY += value;
        sumXY += index * value;
        sumXX += index * index;
    });

    const slope = (n * sumXY - sumX * sumY) / Math.max(1, (n * sumXX - (sumX * sumX)));
    const intercept = (sumY - (slope * sumX)) / n;
    return { slope, intercept };
}

function projectValues(values, horizon) {
    const { slope, intercept } = linearRegression(values);
    const startIndex = values.length;

    return {
        slope: clampForecast(slope),
        projectedChange: clampForecast(slope * horizon),
        projectedValue: clampForecast((slope * (startIndex + horizon - 1)) + intercept),
    };
}

export function generateForecast(records = []) {
    const metricMap = {
        lhs: records.map((day) => day.globalScore || 0),
        focus_cycles: records.map((day) => day.focus_cycles || 0),
        mood: records.map((day) => day.mood || 0),
        spending: records.map((day) => day.daily_spend || 0),
    };

    return {
        horizons: {
            sevenDays: Object.fromEntries(Object.entries(metricMap).map(([key, values]) => [key, projectValues(values.slice(-30), 7)])),
            thirtyDays: Object.fromEntries(Object.entries(metricMap).map(([key, values]) => [key, projectValues(values.slice(-30), 30)])),
        },
    };
}
