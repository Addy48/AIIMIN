import { useState, useEffect } from 'react';
import { apiGet } from '../utils/api';
import { useMockData } from '../providers/MockDataProvider';

import { computeMovementScore, computeCognitiveScore, computeDisciplineScore, computeFinancialHealth, computeMoodScore, computeSleepConsistency, computeFocusScore } from '../analytics/computeMetrics';
import { AnalyticsEngine } from '../analytics/v3/AnalyticsEngine';

/**
 * useLHSData hook
 * 
 * Centralized hook to fetch LHS (Life Health System) scores and Report data.
 * Consolidates calls to /intelligence/lhs and /intelligence/report.
 */
export function useLHSData(session) {
    const { isUsingMock, mockData } = useMockData() || {};
    const [lhsData, setLhsData] = useState(null);
    const [reportData, setReportData] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!session) return;

        if (isUsingMock && mockData) {
            setLoading(true);
            const logs = mockData.dailyLogs || [];
            const txs = mockData.financialTransactions || [];

            if (!logs.length || !txs.length) {
                console.warn('Analytics Warning: Received empty datasets for logs or transactions. Aborting computations.');
                setLhsData(null);
                setReportData(null);
                setLoading(false);
                return;
            }

            const engineData = AnalyticsEngine.processPayload({
                dailyLogs: logs,
                financialTransactions: txs,
                habitLogs: mockData.habitLogs || [],
                pomodoroSessions: mockData.pomodoroSessions || [],
                reflectionLogs: mockData.reflectionLogs || [],
                calendarEvents: mockData.calendarEvents || []
            });

            const clamp = (score) => Math.min(100, Math.max(0, score || 0));
            const physical = clamp(computeMovementScore(logs));
            const cognitive = clamp(computeCognitiveScore(logs));
            const discipline = clamp(computeDisciplineScore(logs));
            const financial = clamp(computeFinancialHealth(txs));
            const emotional = clamp(Math.round((computeMoodScore(logs) / 5) * 100));

            const lhs = {
                systemScores: { physical, cognitive, discipline, financial, emotional },
                baseMetrics: {
                    sleepScore: computeSleepConsistency(logs),
                    gymConsistency: physical,
                    focusScore: computeFocusScore(logs)
                }
            };

            const report = {
                stabilityAndDrift: [],
                behaviorDrivers: { rankedDrivers: engineData.drivers },
                archetypes: engineData.clusters,
                bestVsWorstDay: { bestDay: engineData.bestDay, worstDay: engineData.worstDay },
                actionPlan: ["Maintain sleep schedule consistency above 7h", "Reduce junk food to increase afternoon focus"],
                systemDiagnostics: [],
                trendAnalysis: {
                    forecast: engineData.forecast
                }
            };

            setLhsData(lhs);
            setReportData(report);
            setLoading(false);
            return;
        }

        Promise.all([
            apiGet('/intelligence/lhs', { session }),
            apiGet('/intelligence/report', { session }),
        ])
            .then(([lhs, report]) => {
                setLhsData(lhs);
                setReportData(report);
            })
            .catch((err) => {
                console.error("Pipeline failure in useLHSData:", err);
                setError(err);
            })
            .finally(() => setLoading(false));

    }, [session, isUsingMock, mockData]);

    return {
        lhsData,
        reportData,
        loading,
        error
    };
}
