export function classifyDay(day) {
    const spendRatio = (day.daily_spend || 0) / Math.max(1, day.burn_target || 1500);

    if (spendRatio > 1.4) return 'Financial Risk Day';
    if (day.sleep_hours >= 7 && day.focus_cycles >= 4 && day.mood >= 7 && day.habit_completion_pct >= 70) return 'Peak Performance Day';
    if (day.sleep_hours >= 8 && day.focus_cycles <= 2 && day.daily_spend <= (day.burn_target || 1500)) return 'Recovery Day';
    if (day.sleep_hours < 6 || day.mood <= 4) return 'Low Energy Day';
    if (day.habit_completion_pct < 40 && day.routine_adherence_pct < 40 && day.focus_cycles < 2) return 'Chaotic Day';
    return 'Recovery Day';
}

export function classifyDays(records = []) {
    return {
        archetypes: records.map((day) => ({
            date: day.date,
            archetype: classifyDay(day),
            globalScore: day.globalScore || 0,
        })),
    };
}
