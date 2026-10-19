/**
 * MockDataProvider.js
 * Returns mock data for development/testing when real API is unavailable.
 */

const IS_MOCK = process.env.REACT_APP_USE_MOCK === 'true';

const mockDailyLogs = Array.from({ length: 14 }, (_, i) => ({
    id: `mock-log-${i}`,
    date: new Date(Date.now() - i * 86400000).toLocaleDateString('en-CA'),
    sleep_hours: 6.5 + Math.random() * 1.5,
    gym_done: Math.random() > 0.4,
    breakfast_done: Math.random() > 0.3,
    steps: 4000 + Math.floor(Math.random() * 7000),
    water_bottles: 2 + Math.floor(Math.random() * 5),
    mood: 5 + Math.floor(Math.random() * 5),
    energy_level: 2 + Math.floor(Math.random() * 3),
    learning_done: Math.random() > 0.5,
    learning_topic: 'System Design',
    journal_entry: i % 2 === 0 ? 'Good day.' : '',
    brain_fog: Math.floor(Math.random() * 3) + 1,
    headache: Math.random() > 0.8,
    rc_count: 0,
}));

const MOCK_DATA = {
    dailyLogs: mockDailyLogs,
    financialTransactions: [],
    habitLogs: [],
    pomodoroSessions: [],
    reflectionLogs: [],
    calendarEvents: [],
    todayLog: mockDailyLogs[0],
    weekTrend: mockDailyLogs.slice(0, 7),
    thirtyDayTrend: mockDailyLogs,
};

/**
 * Returns mock state object compatible with all hooks.
 * Each hook destructures: { isUsingMock, mockData }
 */
export function useMockData() {
    return {
        isUsingMock: IS_MOCK,
        mockData: IS_MOCK ? MOCK_DATA : null,
    };
}

export { MOCK_DATA as mockDailyLog };
