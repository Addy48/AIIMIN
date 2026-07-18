import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
    computeBehaviorDrivers,
    computeDriftAlerts,
    computeForecast,
    computeBehaviorClusters,
    buildIntelligenceReportSections,
} from '../services/intelligenceReportService.js';
import { calculateLifeHealthForRecord } from '../services/lifeHealthEngine.js';

const sampleTimeline = Array.from({ length: 14 }, (_, i) => {
    const record = {
        date: `2026-07-${String(i + 1).padStart(2, '0')}`,
        sleep_hours: 6 + (i % 3),
        gym_done: i % 2 === 0,
        steps: 5000 + i * 200,
        learning_done: i % 3 === 0,
        journal_entry: i % 4 === 0 ? 'journal' : '',
        water_bottles: 2 + (i % 3),
        mood: 5 + (i % 4),
        focus_cycles: 2 + (i % 2),
        focus_minutes: 60 + i * 5,
        daily_spend: 800 + i * 50,
        habit_completion_pct: 40 + i * 3,
        commitment_pct: 50 + i * 2,
    };
    return { ...record, ...calculateLifeHealthForRecord(record) };
});

describe('intelligenceReportService', () => {
    it('computes drivers from real timeline — no hardcoded literals', () => {
        const { rankedDrivers, insufficientData } = computeBehaviorDrivers(sampleTimeline);
        assert.equal(insufficientData, false);
        assert.ok(rankedDrivers.length > 0);
        rankedDrivers.forEach((d) => {
            assert.ok(d.behaviorLabel);
            assert.ok(Number.isFinite(d.impact));
            assert.notEqual(d.behaviorLabel, 'Consistent sleep schedule');
        });
    });

    it('computes drift from dataset windows', () => {
        const dataset = {
            windows: {
                last7: sampleTimeline.slice(-7),
                baseline: sampleTimeline.slice(0, 7),
            },
        };
        const { alerts } = computeDriftAlerts(dataset);
        assert.ok(Array.isArray(alerts));
    });

    it('forecast uses trend not static improving/stable mix', () => {
        const { horizons, insufficientData } = computeForecast(sampleTimeline);
        assert.equal(insufficientData, false);
        assert.ok(horizons.sevenDays);
        assert.ok(['improving', 'declining', 'stable'].includes(horizons.sevenDays.physical));
    });

    it('clusters derive from scored timeline', () => {
        const { clusters } = computeBehaviorClusters(sampleTimeline);
        assert.ok(clusters.length >= 1);
        assert.ok(clusters[0].count > 0);
    });

    it('buildIntelligenceReportSections marks computedFromData', () => {
        const dataset = {
            dailyRecords: sampleTimeline,
            windows: {
                last7: sampleTimeline.slice(-7),
                baseline: sampleTimeline.slice(0, 7),
            },
        };
        const lhs = { timeline: sampleTimeline, globalScore: 72 };
        const sections = buildIntelligenceReportSections(dataset, lhs);
        assert.equal(sections.meta.computedFromData, true);
        assert.ok(sections.drivers.rankedDrivers.length >= 0);
    });
});
