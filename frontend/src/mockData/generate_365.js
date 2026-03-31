const fs = require('fs');
const path = require('path');

const NUM_DAYS = 365;
const START_DATE = new Date('2025-01-01T00:00:00Z');

const dailyLogs = [];
const habitLogs = [];
const pomodoroSessions = [];
const financialTransactions = [];
const reflectionLogs = [];
const calendarEvents = [];

let currentMoney = 15000;

for (let i = 0; i < NUM_DAYS; i++) {
    const d = new Date(START_DATE.getTime() + i * 86400000);
    const dateStr = d.toISOString().split('T')[0];
    const isWeekend = d.getDay() === 0 || d.getDay() === 6;

    // Core Variabilities
    const baseSleep = 6 + (Math.random() * 3);
    const isGymDay = Math.random() > 0.6;
    const isFocusDay = Math.random() > 0.5 && !isWeekend;

    // Correlations
    let sleep_hours = baseSleep;
    let mood = Math.floor(Math.random() * 5) + 5; // 5-9
    let steps = 4000 + Math.random() * 4000; // 4000-8000

    if (sleep_hours >= 7) mood += 1;
    if (sleep_hours < 6) mood -= 2;
    if (isGymDay) steps = 8000 + Math.random() * 4000; // 8000-12000

    const focus_cycles = isFocusDay ? Math.floor(Math.random() * 4) + 4 : Math.floor(Math.random() * 3); // 4-7 or 0-2

    dailyLogs.push({
        id: `day_${i}`,
        user_id: 'mock_user',
        date: dateStr,
        sleep_hours: sleep_hours.toFixed(1),
        mood: Math.min(10, Math.max(1, mood)),
        energy_level: Math.min(10, Math.max(1, mood + (sleep_hours - 7))),
        stress_level: Math.floor(Math.random() * 5) + 1,
        steps: Math.floor(steps),
        gym_done: isGymDay,
        learning_done: Math.random() > 0.7,
        deep_work_done: focus_cycles >= 4,
        pomodoro_minutes: focus_cycles * 25,
        daily_spend: 0, // Computed later
        globalScore: Math.floor(60 + (sleep_hours * 2) + (mood * 2) + (isGymDay ? 5 : 0)),
        created_at: d.toISOString()
    });

    // Habits
    if (isGymDay) habitLogs.push({ id: `hab_gym_${i}`, user_id: 'mock_user', habit_id: 'gym', completed_at: new Date(d.getTime() + 8 * 3600000).toISOString() });
    if (focus_cycles >= 4) habitLogs.push({ id: `hab_focus_${i}`, user_id: 'mock_user', habit_id: 'deep_work', completed_at: new Date(d.getTime() + 10 * 3600000).toISOString() });
    if (sleep_hours >= 7.5) habitLogs.push({ id: `hab_sleep_${i}`, user_id: 'mock_user', habit_id: 'sleep_hygiene', completed_at: new Date(d.getTime() + 6 * 3600000).toISOString() });

    // Pomodoros
    for (let p = 0; p < focus_cycles; p++) {
        pomodoroSessions.push({
            id: `pomo_${i}_${p}`,
            user_id: 'mock_user',
            start_time: new Date(d.getTime() + (9 + p) * 3600000).toISOString(),
            end_time: new Date(d.getTime() + (9 + p) * 3600000 + 25 * 60000).toISOString(),
            task_tag: isFocusDay ? 'deep_work' : 'admin',
            duration_minutes: 25,
            completed: true
        });
    }

    // Finances
    let dailySpendCount = 0;
    // Base expenses
    if (d.getDate() === 1) {
        financialTransactions.push({ id: `tx_rent_${i}`, user_id: 'mock_user', amount: 2000, type: 'expense', category: 'housing', date: dateStr });
        dailySpendCount += 2000;
    }
    if (d.getDate() === 15) {
        financialTransactions.push({ id: `tx_sal_${i}`, user_id: 'mock_user', amount: 5000, type: 'income', category: 'salary', date: dateStr });
    }

    // Correlated expenses: Low sleep -> junk food +30%
    const junkProb = sleep_hours < 6 ? 0.7 : 0.3;
    if (Math.random() < junkProb) {
        const amt = 15 + Math.random() * 20;
        financialTransactions.push({ id: `tx_junk_${i}`, user_id: 'mock_user', amount: parseFloat(amt.toFixed(2)), type: 'expense', category: 'food', date: dateStr });
        dailySpendCount += amt;
    }

    // Correlated expenses: Weekend -> higher social
    if (isWeekend && Math.random() > 0.4) {
        const amt = 50 + Math.random() * 150;
        financialTransactions.push({ id: `tx_soc_${i}`, user_id: 'mock_user', amount: parseFloat(amt.toFixed(2)), type: 'expense', category: 'social', date: dateStr });
        dailySpendCount += amt;
    }

    dailyLogs[i].daily_spend = parseFloat(dailySpendCount.toFixed(2));

    // Reflections
    if (d.getDay() === 0) {
        reflectionLogs.push({
            id: `refl_${i}`,
            user_id: 'mock_user',
            date: dateStr,
            content: "Weekly review: " + (mood > 7 ? "Great week, very focused." : "Tough week, need more sleep."),
            tags: mood > 7 ? ["productive", "high_energy"] : ["fatigue", "recovery"]
        });
    }

    // Calendar Events
    if (isGymDay) {
        calendarEvents.push({
            id: `cal_gym_${i}`, user_id: 'mock_user', title: 'Workout',
            start_time: new Date(d.getTime() + 18 * 3600000).toISOString(),
            end_time: new Date(d.getTime() + 19.5 * 3600000).toISOString(),
            system_type: 'physical'
        });
    }
    if (isFocusDay) {
        calendarEvents.push({
            id: `cal_fw_${i}`, user_id: 'mock_user', title: 'Focus Block',
            start_time: new Date(d.getTime() + 9 * 3600000).toISOString(),
            end_time: new Date(d.getTime() + 12 * 3600000).toISOString(),
            system_type: 'cognitive'
        });
    }
}

const dir = path.join(__dirname);
fs.writeFileSync(path.join(dir, 'dailyLogs.json'), JSON.stringify(dailyLogs, null, 2));
fs.writeFileSync(path.join(dir, 'habitLogs.json'), JSON.stringify(habitLogs, null, 2));
fs.writeFileSync(path.join(dir, 'pomodoroSessions.json'), JSON.stringify(pomodoroSessions, null, 2));
fs.writeFileSync(path.join(dir, 'financialTransactions.json'), JSON.stringify(financialTransactions, null, 2));
fs.writeFileSync(path.join(dir, 'reflectionLogs.json'), JSON.stringify(reflectionLogs, null, 2));
fs.writeFileSync(path.join(dir, 'calendarEvents.json'), JSON.stringify(calendarEvents, null, 2));

console.log("✅ Successfully generated 365 days of synthetic data for 2025!");
