export function computeClusters(data) {
    const { dailyLogs = [] } = data;
    if (!dailyLogs.length) throw new Error("Dataset is empty");

    let clusters = {
        'Peak Day': 0,
        'Recovery Day': 0,
        'Low Energy': 0,
        'Chaotic Day': 0,
        'Financial Risk': 0,
        'Flow State': 0,
        'Balanced Day': 0
    };

    dailyLogs.forEach(l => {
        const sleep = Number(l.sleep_hours) || 0;
        const gym = l.gym_done;
        const focus = (Number(l.pomodoro_minutes) || 0) / 25;
        const mood = Number(l.mood) || 0;
        const spend = Number(l.daily_spend) || 0;

        if (sleep >= 7 && gym && focus >= 4) clusters['Peak Day']++;
        else if (sleep >= 8 && focus <= 2) clusters['Recovery Day']++;
        else if (sleep < 6) clusters['Low Energy']++;
        else if (mood < 4 && focus < 2 && !gym) clusters['Chaotic Day']++;
        else if (spend > 100) clusters['Financial Risk']++;
        else if (focus >= 6) clusters['Flow State']++;
        else clusters['Balanced Day']++;
    });

    return Object.entries(clusters)
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count);
}
