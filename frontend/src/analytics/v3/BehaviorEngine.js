export function computeBehaviors(data) {
    const { dailyLogs = [] } = data;
    if (!dailyLogs.length) throw new Error("Dataset is empty");

    let sleepMoodTrue = { sum: 0, count: 0 };
    let sleepMoodFalse = { sum: 0, count: 0 };

    let gymFocusTrue = { sum: 0, count: 0 };
    let gymFocusFalse = { sum: 0, count: 0 };

    let junkFocusTrue = { sum: 0, count: 0 };
    let junkFocusFalse = { sum: 0, count: 0 };

    dailyLogs.forEach(d => {
        const mood = Number(d.mood) || 0;
        const sleep = Number(d.sleep_hours) || 0;
        const isGym = d.gym_done;
        const focus = (Number(d.pomodoro_minutes) || 0) / 25;
        // In our generate_365, junk food correlated with sleep_hours < 6 
        // We'll use high daily_spend > 50 as proxy for junk/social
        const isJunk = Number(d.daily_spend) > 30 && sleep < 7;

        if (sleep >= 7) { sleepMoodTrue.sum += mood; sleepMoodTrue.count++; }
        else { sleepMoodFalse.sum += mood; sleepMoodFalse.count++; }

        if (isGym) { gymFocusTrue.sum += focus; gymFocusTrue.count++; }
        else { gymFocusFalse.sum += focus; gymFocusFalse.count++; }

        if (isJunk) { junkFocusTrue.sum += focus; junkFocusTrue.count++; }
        else { junkFocusFalse.sum += focus; junkFocusFalse.count++; }
    });

    const safeAvg = (obj) => obj.count > 0 ? parseFloat((obj.sum / obj.count).toFixed(2)) : 0;

    const sleepAvgT = safeAvg(sleepMoodTrue);
    const sleepAvgF = safeAvg(sleepMoodFalse);

    const gymAvgT = safeAvg(gymFocusTrue);
    const gymAvgF = safeAvg(gymFocusFalse);

    const junkAvgT = safeAvg(junkFocusTrue);
    const junkAvgF = safeAvg(junkFocusFalse);

    return [
        { label: "sleep >= 7h → mood delta", avgWhenTrue: sleepAvgT, avgWhenFalse: sleepAvgF, impact: parseFloat((sleepAvgT - sleepAvgF).toFixed(2)) },
        { label: "gym → focus delta", avgWhenTrue: gymAvgT, avgWhenFalse: gymAvgF, impact: parseFloat((gymAvgT - gymAvgF).toFixed(2)) },
        { label: "junk food → focus penalty", avgWhenTrue: junkAvgT, avgWhenFalse: junkAvgF, impact: parseFloat((junkAvgT - junkAvgF).toFixed(2)) }
    ];
}
