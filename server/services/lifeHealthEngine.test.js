import assert from 'node:assert/strict';
import test from 'node:test';
import {
    LIFE_SCORE_CALCULATION_VERSION,
    buildPersonalProfile,
    calculateLifeHealthForRecord,
    summarizeLifeHealth,
} from './lifeHealthEngine.js';

function record(date, overrides = {}) {
    return {
        date,
        sleep_hours: 7.5,
        gym_done: true,
        steps: 9000,
        learning_done: true,
        journal_entry: 'logged',
        water_bottles: 4,
        mood: 8,
        focus_cycles: 4,
        focus_minutes: 120,
        target_cycles: 4,
        daily_spend: 800,
        daily_income: 2000,
        burn_target: 1500,
        savings_rate: 0.6,
        budget_adherence: 100,
        commitment_pct: 90,
        habit_completion_pct: 90,
        routine_adherence_pct: 90,
        ...overrides,
    };
}

test('Life Score v2 is reproducible and exposes calculation metadata', () => {
    const records = Array.from({ length: 14 }, (_, index) => record(`2026-08-${String(index + 1).padStart(2, '0')}`));
    const first = summarizeLifeHealth(records);
    const second = summarizeLifeHealth(records);
    assert.equal(first.globalScore, second.globalScore);
    assert.equal(first.calculationVersion, LIFE_SCORE_CALCULATION_VERSION);
    assert.equal(first.scoreMeta.missingDataIsExcluded, true);
    assert.equal(first.scoreMeta.confidence, 'moderate');
    assert.equal(first.timeline[0].scoreMeta.sourceRecordIds[0], 'daily:2026-08-01');
});

test('missing signals are not treated as zero and do not create a false score penalty', () => {
    const complete = record('2026-08-01');
    const partial = record('2026-08-02', {
        sleep_hours: null,
        gym_done: null,
        steps: null,
        learning_done: null,
        journal_entry: null,
        water_bottles: null,
        mood: null,
        focus_cycles: null,
        focus_minutes: null,
        target_cycles: null,
        daily_spend: null,
        daily_income: null,
        savings_rate: null,
        budget_adherence: null,
        commitment_pct: null,
        habit_completion_pct: null,
        routine_adherence_pct: null,
    });
    const scored = calculateLifeHealthForRecord(partial);
    assert.equal(scored.globalScore, null);
    assert.equal(scored.scoreMeta.observedMetricCount, 0);
    const summary = summarizeLifeHealth([complete, partial]);
    assert.equal(summary.scoreMeta.coverage, 0.5);
    assert.equal(summary.scoreMeta.scoreDays, 1);
});

test('personal baseline fit makes the same raw value mean something different for different people', () => {
    const steady = Array.from({ length: 14 }, (_, index) => record(`2026-08-${String(index + 1).padStart(2, '0')}`, { sleep_hours: 6.5 }));
    const longSleeper = Array.from({ length: 14 }, (_, index) => record(`2026-08-${String(index + 1).padStart(2, '0')}`, { sleep_hours: 9 }));
    const steadyProfile = buildPersonalProfile(steady);
    const longProfile = buildPersonalProfile(longSleeper);
    const sameDay = record('2026-08-15', { sleep_hours: 6.5 });
    const forSteady = calculateLifeHealthForRecord(sameDay, { profile: steadyProfile });
    const forLong = calculateLifeHealthForRecord(sameDay, { profile: longProfile });
    assert.ok(forSteady.metricScores.sleep_hours.personalFit > forLong.metricScores.sleep_hours.personalFit);
    assert.notEqual(forSteady.systemScores.physical, forLong.systemScores.physical);
});


test('calibrated model exposes reference data, recency, and uncertainty metadata', () => {
    const records = Array.from({ length: 30 }, (_, index) => record(`2026-07-${String(index + 1).padStart(2, '0')}`));
    const summary = summarizeLifeHealth(records);
    assert.equal(summary.scoreMeta.modelCard.type, 'personal-operating-model');
    assert.equal(summary.scoreMeta.referenceDatasetVersion, 'lhs-reference-2026-08-22');
    assert.equal(summary.scoreMeta.trend.direction, 'stable');
    assert.ok(summary.scoreMeta.effectiveSampleSize < summary.scoreMeta.scoreDays);
    assert.ok(summary.timeline.at(-1).metricScores.sleep_hours.model.includes('operating band'));
});

test('reference-anchored operating bands respond to the observed input, not a fixed checklist constant', () => {
    const wellRested = calculateLifeHealthForRecord(record('2026-08-01', { sleep_hours: 8 }));
    const shortRest = calculateLifeHealthForRecord(record('2026-08-01', { sleep_hours: 5 }));
    assert.ok(wellRested.metricScores.sleep_hours.objectiveScore > shortRest.metricScores.sleep_hours.objectiveScore);
    assert.ok(wellRested.scoreMeta.sourceRecordIds.includes('daily:2026-08-01'));
    assert.equal(wellRested.scoreMeta.missingDataIsExcluded, true);
});
