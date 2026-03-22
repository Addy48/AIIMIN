export function aggregateMetrics(data) {
    const { dailyLogs = [], habitLogs = [] } = data;
    if (!dailyLogs.length) throw new Error("Dataset is empty");

    let sumSleep = 0, sumFocus = 0, sumSteps = 0, sumMood = 0, sumSpend = 0;
    let gymDays = 0, deepWorkDays = 0;

    dailyLogs.forEach(log => {
        sumSleep += Number(log.sleep_hours) || 0;
        sumFocus += (Number(log.pomodoro_minutes) || 0) / 25;
        sumSteps += Number(log.steps) || 0;
        sumMood += Number(log.mood) || 0;
        sumSpend += Number(log.daily_spend) || 0;
        if (log.gym_done) gymDays++;
        if (log.deep_work_done) deepWorkDays++;
    });

    const days = dailyLogs.length;

    return {
        sleepAvg: parseFloat((sumSleep / days).toFixed(2)),
        focusAvg: parseFloat((sumFocus / days).toFixed(2)),
        stepsAvg: parseFloat((sumSteps / days).toFixed(2)),
        moodAvg: parseFloat((sumMood / days).toFixed(2)),
        spendingAvg: parseFloat((sumSpend / days).toFixed(2)),
        gymConsistency: parseFloat(((gymDays / days) * 100).toFixed(2)),
        deepWorkRate: parseFloat(((deepWorkDays / days) * 100).toFixed(2)),
        habitCompletion: habitLogs.length > 0 ? parseFloat(((habitLogs.length / (days * 3)) * 100).toFixed(2)) : 0
    };
}
