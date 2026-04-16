import { apiGet } from './api';

/**
 * exportUserData()
 * 
 * Fetches all machine-readable structured raw data for the current user and downloads it as a JSON file.
 * This is distinct from Reports (which generate human-readable PDFs).
 */
export async function exportUserData(session, isUsingMock, mockData) {
    let payload = {};

    if (isUsingMock && mockData) {
        payload = {
            export_timestamp: new Date().toISOString(),
            daily_logs: mockData.dailyLogs || [],
            habit_logs: mockData.habitLogs || [],
            pomodoro_sessions: mockData.pomodoroSessions || [],
            financial_transactions: mockData.financialTransactions || [],
            reflection_logs: mockData.reflectionLogs || [],
            goal_progress: mockData.goalProgress || [],
            calendar_events: mockData.calendarEvents || []
        };
    } else {
        // In a real environment, you might hit a dedicated /export endpoint or fetch individually.
        // For this dashboard, we will fetch standard datasets to dump them.
        try {
            const [daily, habit, pomo, finance, reflect, calendar] = await Promise.all([
                apiGet('/daily-log/all', { session }).catch(() => []),
                apiGet('/habits/logs/all', { session }).catch(() => []),
                apiGet('/pomodoro/sessions', { session }).catch(() => []),
                apiGet('/money/transactions', { session }).catch(() => []),
                apiGet('/reflections/all', { session }).catch(() => []),
                apiGet('/calendar/events', { session }).catch(() => [])
            ]);

            payload = {
                export_timestamp: new Date().toISOString(),
                daily_logs: daily,
                habit_logs: habit,
                pomodoro_sessions: pomo,
                financial_transactions: finance,
                reflection_logs: reflect,
                calendar_events: calendar
            };
        } catch (err) {
            console.error('Failed to dump data from remote:', err);
            throw new Error('Data export failed from server');
        }
    }

    const payloadString = JSON.stringify(payload, null, 2);
    const blob = new Blob([payloadString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    // AIIMIN_DATA_EXPORT_YYYY_MM_DD.json
    const dateObj = new Date();
    const yyyy = dateObj.getFullYear();
    const mm = String(dateObj.getMonth() + 1).padStart(2, '0');
    const dd = String(dateObj.getDate()).padStart(2, '0');
    const filename = `AIIMIN_DATA_EXPORT_${yyyy}_${mm}_${dd}.json`;

    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", url);
    downloadAnchorNode.setAttribute("download", filename);
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
    URL.revokeObjectURL(url);
}
