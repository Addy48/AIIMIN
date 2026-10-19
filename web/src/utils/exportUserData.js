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
        // This used to fan out to six endpoints, none of which exist:
        //   /daily-log/all  /habits/logs/all  /pomodoro/sessions
        //   /money/transactions  /reflections/all  /calendar/events
        // The first five 404 and the sixth 400s without start/end params. Every
        // call was wrapped in .catch(() => []), so the export silently wrote a
        // file full of empty arrays instead of failing — users got nothing and
        // were told it worked.
        //
        // The server already has a real exporter at GET /api/account/export.
        try {
            const data = await apiGet('/account/export', { session });
            if (!data || typeof data !== 'object') {
                throw new Error('Export endpoint returned no data');
            }
            payload = { export_timestamp: new Date().toISOString(), ...data };
        } catch (err) {
            // Never hand the user an empty file and call it an export.
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
