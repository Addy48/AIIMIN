import express from 'express';
import { requireAuth } from '../middleware/auth.js';
import { cacheMiddleware } from '../lib/cache.js';
import { getAnalyticsDataset } from '../services/analyticsData.js';
import { summarizeLifeHealth } from '../services/lifeHealthEngine.js';
import { analyzeBehaviorDrivers } from '../services/behaviorDriverEngine.js';
import { calculateMomentumMultiplier } from '../services/momentumMultiplier.js';
import { detectDrift } from '../services/driftEngine.js';
import { generateForecast } from '../services/forecastEngine.js';
import { analyzeBehaviorClusters } from '../services/clusterEngine.js';
import { classifyDays } from '../services/dayClassifier.js';
import { generateWeeklyReview } from '../services/weeklyReviewEngine.js';
import { generateReportPayload } from '../services/reportGenerator.js';

const router = express.Router();
const cache = (suffix) => cacheMiddleware(60_000, (req) => `intelligence:${suffix}:${req.userId}`);
const asyncHandler = (fn) => async (req, res) => {
    try {
        await fn(req, res);
    } catch (error) {
        console.error(`[intelligence${req.path}]`, error);
        res.status(500).json({ error: error.message || 'Analytics engine failure' });
    }
};

async function buildAnalytics(userId) {
    const dataset = await getAnalyticsDataset(userId, 120);
    const lhs = summarizeLifeHealth(dataset.dailyRecords);
    const timeline = lhs.timeline;
    const drivers = analyzeBehaviorDrivers(timeline);
    const drift = detectDrift(timeline);
    const forecast = generateForecast(timeline);
    const clusters = analyzeBehaviorClusters(timeline);
    const archetypes = classifyDays(timeline);
    const momentum = calculateMomentumMultiplier(timeline);
    const weeklyReview = generateWeeklyReview({ lhsTimeline: timeline, drift, drivers, clusters, momentum });
    const report = generateReportPayload({ lhs, drivers, drift, forecast, clusters, archetypes, momentum, weeklyReview });

    return { dataset, lhs, drivers, drift, forecast, clusters, archetypes, momentum, weeklyReview, report };
}

router.get('/lhs', requireAuth, cache('lhs'), asyncHandler(async (req, res) => {
    const analytics = await buildAnalytics(req.userId);
    res.json(analytics.lhs);
}));

router.get('/drivers', requireAuth, cache('drivers'), asyncHandler(async (req, res) => {
    const analytics = await buildAnalytics(req.userId);
    res.json(analytics.drivers);
}));

router.get('/drift', requireAuth, cache('drift'), asyncHandler(async (req, res) => {
    const analytics = await buildAnalytics(req.userId);
    res.json(analytics.drift);
}));

router.get('/forecast', requireAuth, cache('forecast'), asyncHandler(async (req, res) => {
    const analytics = await buildAnalytics(req.userId);
    res.json(analytics.forecast);
}));

router.get('/clusters', requireAuth, cache('clusters'), asyncHandler(async (req, res) => {
    const analytics = await buildAnalytics(req.userId);
    res.json(analytics.clusters);
}));

router.get('/archetypes', requireAuth, cache('archetypes'), asyncHandler(async (req, res) => {
    const analytics = await buildAnalytics(req.userId);
    res.json(analytics.archetypes);
}));

router.get('/momentum', requireAuth, cache('momentum'), asyncHandler(async (req, res) => {
    const analytics = await buildAnalytics(req.userId);
    res.json(analytics.momentum);
}));

router.get('/report', requireAuth, cache('report'), asyncHandler(async (req, res) => {
    const analytics = await buildAnalytics(req.userId);
    res.json(analytics.report);
}));

// Backward-compatible endpoints used by the current dashboard.
router.get('/status', requireAuth, cache('status'), asyncHandler(async (req, res) => {
    const analytics = await buildAnalytics(req.userId);
    const recent = analytics.lhs.timeline.slice(-7);
    const past = analytics.lhs.timeline.slice(-14, -7);
    const momentum = recent.length && past.length
        ? (recent.reduce((sum, day) => sum + day.globalScore, 0) / recent.length) - (past.reduce((sum, day) => sum + day.globalScore, 0) / past.length)
        : 0;

    res.json({
        globalScore: analytics.lhs.globalScore,
        systemScores: analytics.lhs.systemScores,
        baseMetrics: analytics.lhs.baseMetrics,
        momentum: Number(momentum.toFixed(2)),
        weakestSystem: analytics.report.actionPlan[0] || null,
    });
}));

router.get('/weekly-review', requireAuth, cache('weekly-review'), asyncHandler(async (req, res) => {
    const analytics = await buildAnalytics(req.userId);
    const currentWeek = analytics.lhs.timeline.slice(-7);
    const previousWeek = analytics.lhs.timeline.slice(-14, -7);

    const average = (records, key) => records.length
        ? records.reduce((sum, day) => sum + Number(day[key] || 0), 0) / records.length
        : 0;

    res.json({
        currentWeek: {
            avgSleep: average(currentWeek, 'sleep_hours'),
            avgFocus: average(currentWeek, 'focus_cycles'),
            avgSteps: average(currentWeek, 'steps'),
        },
        previousWeek: {
            avgSleep: average(previousWeek, 'sleep_hours'),
            avgFocus: average(previousWeek, 'focus_cycles'),
            avgSteps: average(previousWeek, 'steps'),
        },
        diagnosis: analytics.weeklyReview.systemChanges.map((item) => item.summary),
        recommendations: analytics.weeklyReview.recommendations,
    });
}));

router.get('/core', requireAuth, cache('core'), asyncHandler(async (req, res) => {
    const analytics = await buildAnalytics(req.userId);
    res.json({
        baselines: analytics.lhs.baseMetrics,
        adaptiveGoals: {
            sleepTarget: 7.5,
            focusCyclesTarget: 4,
        },
        energyBudget: {
            energyIn: Number((analytics.lhs.baseMetrics.sleepScore + analytics.lhs.baseMetrics.nutritionWaterScore).toFixed(1)),
            energyOut: Number((analytics.lhs.baseMetrics.activityScore + analytics.lhs.baseMetrics.focusScore).toFixed(1)),
            status: analytics.lhs.globalScore >= 70 ? 'Balanced' : 'Needs Intervention',
            insight: analytics.weeklyReview.recommendations[0] || 'Maintain system balance.',
        },
    });
}));

router.get('/dynamics', requireAuth, cache('dynamics'), asyncHandler(async (req, res) => {
    const analytics = await buildAnalytics(req.userId);
    const volatility = analytics.drift.alerts.reduce((sum, alert) => sum + Math.abs(alert.drift), 0) / Math.max(1, analytics.drift.alerts.length);

    res.json({
        stability: {
            score: Number(Math.max(0, 100 - (volatility * 10)).toFixed(1)),
            volatility: Number(volatility.toFixed(2)),
        },
        momentum: {
            score: analytics.momentum.multiplierValue,
            insight: analytics.momentum.explanation,
        },
        drift: analytics.drift,
        decay: analytics.weeklyReview.warnings[0] || 'No severe habit decay detected.',
    });
}));

router.get('/impact', requireAuth, cache('impact'), asyncHandler(async (req, res) => {
    const analytics = await buildAnalytics(req.userId);
    res.json({
        confidenceScore: Math.min(100, analytics.dataset.dailyRecords.length * 3),
        clusterInsight: analytics.clusters.clusters[0] || null,
        drivers: analytics.drivers.rankedDrivers,
    });
}));

export default router;
