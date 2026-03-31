export function computeTrends(data) {
    const { dailyLogs = [] } = data;
    if (dailyLogs.length < 2) throw new Error("Insufficient data for trends");

    const sorted = [...dailyLogs].sort((a, b) => new Date(b.date) - new Date(a.date));

    const recent7 = sorted.slice(0, 7);
    const recent30 = sorted.slice(0, 30);

    const avg = (arr, key) => arr.reduce((sum, item) => sum + (Number(item[key]) || 0), 0) / arr.length;

    const sleep7 = avg(recent7, 'sleep_hours');
    const sleep30 = avg(recent30, 'sleep_hours');

    const spend7 = avg(recent7, 'daily_spend');
    const spend30 = avg(recent30, 'daily_spend');

    const mood7 = avg(recent7, 'mood');
    const mood30 = avg(recent30, 'mood');

    const focus7 = recent7.reduce((sum, d) => sum + (Number(d.pomodoro_minutes) || 0) / 25, 0) / recent7.length;
    const focus30 = recent30.reduce((sum, d) => sum + (Number(d.pomodoro_minutes) || 0) / 25, 0) / recent30.length;

    const lhs7 = avg(recent7, 'globalScore');
    const lhs30 = avg(recent30, 'globalScore');

    return {
        lhsTrend: { value: lhs7 - lhs30, label: 'LHS Trend' },
        focusTrend: { value: focus7 - focus30, label: 'Focus Trend' },
        sleepTrend: { value: sleep7 - sleep30, label: 'Sleep Trend' },
        spendingTrend: { value: spend7 - spend30, label: 'Spending Trend' },
        rolling7: { sleep: sleep7, spend: spend7, mood: mood7, focus: focus7, lhs: lhs7 },
        rolling30: { sleep: sleep30, spend: spend30, mood: mood30, focus: focus30, lhs: lhs30 }
    };
}
