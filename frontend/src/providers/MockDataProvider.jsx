import React, { createContext, useContext, useState, useEffect } from 'react';

const MockDataContext = createContext(null);

export const MockDataProvider = ({ children }) => {
    const [mockData, setMockData] = useState(null);
    const useMock = process.env.REACT_APP_USE_MOCK_DATA === 'true';

    useEffect(() => {
        if (!useMock) {
            return;
        }

        const loadMockData = () => {
            try {
                const dlData = require('../mockData/dailyLogs.json');
                const hlData = require('../mockData/habitLogs.json');
                const psData = require('../mockData/pomodoroSessions.json');
                const ftData = require('../mockData/financialTransactions.json');
                const gpData = require('../mockData/goalProgress.json').catch ? [] : require('../mockData/goalProgress.json');
                const rlData = require('../mockData/reflectionLogs.json');
                const ceData = require('../mockData/calendarEvents.json');

                const dailyLogs = Array.isArray(dlData) ? dlData : dlData.default || [];
                const habitLogs = Array.isArray(hlData) ? hlData : hlData.default || [];
                const pomodoroSessions = Array.isArray(psData) ? psData : psData.default || [];
                const financialTransactions = Array.isArray(ftData) ? ftData : ftData.default || [];
                const goalProgress = gpData.default ? gpData.default : Array.isArray(gpData) ? gpData : [];
                const reflectionLogs = Array.isArray(rlData) ? rlData : rlData.default || [];
                const calendarEvents = Array.isArray(ceData) ? ceData : ceData.default || [];

                setMockData({
                    dailyLogs,
                    habitLogs,
                    pomodoroSessions,
                    financialTransactions,
                    goalProgress,
                    reflectionLogs,
                    calendarEvents
                });
            } catch (err) {
                console.error("Failed to load mock data:", err);
            }
        };

        loadMockData();
    }, [useMock]);

    return (
        <MockDataContext.Provider value={{ isUsingMock: useMock, mockData }}>
            {children}
        </MockDataContext.Provider>
    );
};

export const useMockData = () => useContext(MockDataContext);
