import { aggregateMetrics } from './MetricAggregator';
import { computeTrends } from './TrendEngine';
import { computeBehaviors } from './BehaviorEngine';
import { computeClusters } from './ClusterEngine';
import { computeForecasts } from './ForecastEngine';

export class AnalyticsEngine {
    static processPayload(payload) {
        const { dailyLogs = [], habitLogs = [], pomodoroSessions = [], financialTransactions = [], reflectionLogs = [], calendarEvents = [] } = payload;

        if (!dailyLogs || !dailyLogs.length) {
            throw new Error("AnalyticsEngine V3 critical failure: No daily logs provided in payload.");
        }

        const metrics = aggregateMetrics(payload);
        const trends = computeTrends(payload);
        const drivers = computeBehaviors(payload);
        const clusters = computeClusters(payload);
        const forecast = computeForecasts(payload);

        // Core logic:
        const sortedLogs = [...dailyLogs].sort((a, b) => (b.globalScore || 0) - (a.globalScore || 0));
        const bestDay = sortedLogs[0] || null;
        const worstDay = sortedLogs[sortedLogs.length - 1] || null;

        // System Scores Matrix
        let physical = 0, cognitive = 0, discipline = 0, financial = 0, emotional = 0;
        dailyLogs.forEach(log => {
            physical += (Number(log.steps) > 8000 ? 20 : 10) + (log.gym_done ? 30 : 0);
            cognitive += ((Number(log.pomodoro_minutes) || 0) / 25) * 5;
            emotional += (Number(log.mood) || 5) * 4;
        });

        const days = dailyLogs.length;
        const systemScores = {
            physical: Math.min(100, Math.round(physical / days) + 40),
            cognitive: Math.min(100, Math.round(cognitive / days) + 50),
            discipline: Math.min(100, Math.round(metrics.habitCompletion) + 20),
            financial: Math.min(100, Math.max(0, 100 - (metrics.spendingAvg / 50))),
            emotional: Math.min(100, Math.round(emotional / days) + 30)
        };

        const lhsScore = Math.round((systemScores.physical + systemScores.cognitive + systemScores.discipline + systemScores.financial + systemScores.emotional) / 5);

        let income = 0, spend = 0;
        financialTransactions.forEach(tx => {
            if (tx.type === 'expense') spend += Number(tx.amount) || 0;
            if (tx.type === 'income') income += Number(tx.amount) || 0;
        });

        const financialHealth = {
            spend,
            income,
            spendDrift: { drift: trends.spendingTrend.value }
        };

        return {
            lhsScore,
            systemScores,
            metrics,
            trends,
            drivers,
            clusters,
            forecast,
            bestDay,
            worstDay,
            financialHealth,
            momentum: { topBehavior: drivers[0]?.label || 'None', baseMetrics: { focusScore: metrics.focusAvg } }
        };
    }
}
