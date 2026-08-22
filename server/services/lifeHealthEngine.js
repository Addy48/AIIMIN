import { LIFE_SCORE_REFERENCE_DATASET } from './lifeScoreReferenceData.js';

export const LIFE_SCORE_CALCULATION_VERSION = 'lhs-v3.0.0-calibrated';
export const LIFE_SCORE_SCALE = { min: 0, max: 100 };

const DOMAIN_ORDER = ['physical', 'cognitive', 'discipline', 'financial', 'emotional'];
const PROFILE_MIN_DAYS = 7;
const RECENCY_HALF_LIFE_DAYS = 21;
const RECENCY_LAMBDA = Math.log(2) / RECENCY_HALF_LIFE_DAYS;

const DEFAULT_DOMAIN_WEIGHTS = {
    physical: 0.25,
    cognitive: 0.20,
    discipline: 0.25,
    financial: 0.15,
    emotional: 0.15,
};

const clamp = (value, min = 0, max = 1) => Math.min(max, Math.max(min, value));
const clampScore = (value) => clamp(Number.isFinite(Number(value)) ? Number(value) : 0, 0, 100);
const finite = (value) => value === null || value === undefined || value === '' ? null : (Number.isFinite(Number(value)) ? Number(value) : null);
const hasValue = (value, key) => value !== null && value !== undefined && (value !== '' || key === 'journal_entry');
const mean = (values) => values.length ? values.reduce((sum, value) => sum + value, 0) / values.length : null;
const median = (values) => {
    if (!values.length) return null;
    const sorted = [...values].sort((a, b) => a - b);
    const middle = Math.floor(sorted.length / 2);
    return sorted.length % 2 ? sorted[middle] : (sorted[middle - 1] + sorted[middle]) / 2;
};
const medianAbsoluteDeviation = (values, center = median(values)) => {
    if (!values.length || center == null) return null;
    return median(values.map((value) => Math.abs(value - center)));
};
const standardDeviation = (values) => {
    if (values.length < 2) return 0;
    const center = mean(values);
    return Math.sqrt(mean(values.map((value) => (value - center) ** 2)) || 0);
};
const round = (value, places = 1) => {
    if (value === null || value === undefined || value === '' || !Number.isFinite(Number(value))) return null;
    const factor = 10 ** places;
    return Math.round(Number(value) * factor) / factor;
};
const safeDate = (date) => {
    const parsed = date ? new Date(`${date}T12:00:00Z`) : null;
    return parsed && !Number.isNaN(parsed.getTime()) ? parsed : null;
};

const operatingBandScore = (value, low, high, softLow, softHigh) => {
    const numeric = finite(value);
    if (numeric == null) return null;
    if (numeric >= low && numeric <= high) return 100;
    if (numeric < low) return clampScore(((numeric - softLow) / Math.max(0.001, low - softLow)) * 100);
    return clampScore(100 - (((numeric - high) / Math.max(0.001, softHigh - high)) * 65));
};
const diminishingReturnsScore = (value, saturation) => {
    const numeric = finite(value);
    if (numeric == null || numeric <= 0) return numeric === 0 ? 0 : null;
    const normalized = 1 - Math.exp(-numeric / Math.max(1, saturation));
    const atSaturation = 1 - Math.exp(-1);
    return clampScore((normalized / atSaturation) * 100);
};
const percentageScore = (value) => finite(value) == null ? null : clampScore(value);
const booleanScore = (value) => value === true || value === 1 || value === 'true' ? 100 : 0;
const sleepScore = (value) => operatingBandScore(value, 7, 9, 4, 12);
const stepsScore = (value) => diminishingReturnsScore(value, 8000);
const waterScore = (value) => diminishingReturnsScore(value, 4);
const focusMinutesScore = (value) => diminishingReturnsScore(value, 120);
const focusCyclesScore = (value, record) => diminishingReturnsScore(value, finite(record?.target_cycles) || 4);
const savingsScore = (value) => {
    const numeric = finite(value);
    if (numeric == null) return null;
    return clampScore(((Math.tanh(numeric * 2) + 1) / 2) * 100);
};
const moodScore = (value) => {
    const numeric = finite(value);
    return numeric == null ? null : clampScore((numeric / 10) * 100);
};
const journalScore = (value) => String(value || '').trim() ? 100 : 0;

/**
 * Registry for observed user signals. `weight` is the within-domain declared
 * importance; raw financial flows are visible context and deliberately do not
 * become a moral score by themselves.
 */
export const LIFE_SCORE_METRIC_DEFS = [
    { id: 'sleep_hours', label: 'Sleep duration', domain: 'physical', unit: 'hours', source: 'daily_logs.sleep_hours', weight: 0.40, scale: 2, score: sleepScore, model: 'reference-anchored operating band' },
    { id: 'steps', label: 'Steps', domain: 'physical', unit: 'count', source: 'daily_logs.steps', weight: 0.25, scale: 5000, score: stepsScore, model: 'diminishing-returns activity proxy' },
    { id: 'gym_done', label: 'Training logged', domain: 'physical', unit: 'boolean', source: 'daily_logs.gym_done', weight: 0.20, scale: 1, score: booleanScore, model: 'observed activity completion' },
    { id: 'water_bottles', label: 'Water bottles', domain: 'physical', unit: 'count', source: 'daily_logs.water_bottles', weight: 0.15, scale: 2, score: waterScore, model: 'diminishing-returns product anchor' },
    { id: 'focus_minutes', label: 'Focused minutes', domain: 'cognitive', unit: 'minutes', source: 'pomodoro_sessions.total_focus_minutes', weight: 0.45, scale: 90, score: focusMinutesScore, model: 'diminishing-returns focus capacity proxy' },
    { id: 'focus_cycles', label: 'Focus cycles', domain: 'cognitive', unit: 'count', source: 'pomodoro_sessions.cycles_completed', weight: 0.25, scale: 3, score: focusCyclesScore, model: 'target-relative cycle completion' },
    { id: 'learning_done', label: 'Learning logged', domain: 'cognitive', unit: 'boolean', source: 'daily_logs.learning_done', weight: 0.30, scale: 1, score: booleanScore, model: 'observed learning completion' },
    { id: 'habit_completion_pct', label: 'Habit completion', domain: 'discipline', unit: 'percentage', source: 'daily_commitments.fulfillment_pct|habit_logs', weight: 0.40, scale: 35, score: percentageScore, model: 'denominator-aware completion rate' },
    { id: 'routine_adherence_pct', label: 'Routine adherence', domain: 'discipline', unit: 'percentage', source: 'routine_runs', weight: 0.30, scale: 35, score: percentageScore, model: 'denominator-aware completion rate' },
    { id: 'commitment_pct', label: 'Commitment completion', domain: 'discipline', unit: 'percentage', source: 'daily_commitments.fulfillment_pct', weight: 0.30, scale: 35, score: percentageScore, model: 'denominator-aware completion rate' },
    { id: 'daily_spend', label: 'Money out', domain: 'financial', unit: 'INR', source: 'money_transactions', weight: 0, scale: 1500, scoring: false, model: 'raw transaction context' },
    { id: 'daily_income', label: 'Money in', domain: 'financial', unit: 'INR', source: 'money_transactions', weight: 0, scale: 2000, scoring: false, model: 'raw transaction context' },
    { id: 'budget_adherence', label: 'Budget adherence', domain: 'financial', unit: 'percentage', source: 'money_transactions', weight: 0.70, scale: 25, score: percentageScore, model: 'user-budget-relative adherence' },
    { id: 'savings_rate', label: 'Savings rate', domain: 'financial', unit: 'ratio', source: 'money_transactions', weight: 0.30, scale: 0.4, score: savingsScore, model: 'income/expense-derived ratio' },
    { id: 'mood', label: 'Mood check-in', domain: 'emotional', unit: '0–10 score', source: 'daily_logs.mood', weight: 0.60, scale: 2, score: moodScore, model: 'self-report signal' },
    { id: 'journal_entry', label: 'Journal entry', domain: 'emotional', unit: 'boolean/text presence', source: 'daily_logs.journal_entry|journal_entries', weight: 0.40, scale: 1, score: journalScore, model: 'reflection presence only' },
];

const METRIC_BY_ID = Object.fromEntries(LIFE_SCORE_METRIC_DEFS.map((metric) => [metric.id, metric]));
const SCORING_METRICS = LIFE_SCORE_METRIC_DEFS.filter((metric) => metric.scoring !== false);

function deriveMetricValue(record, metricId) {
    if (!record) return null;
    const raw = record[metricId];
    if (hasValue(raw, metricId)) return metricId === 'journal_entry' ? String(raw) : (metricId === 'gym_done' || metricId === 'learning_done' ? Boolean(raw) : finite(raw));

    const spend = finite(record.daily_spend);
    const income = finite(record.daily_income);
    if (metricId === 'budget_adherence' && spend != null) {
        const target = finite(record.burn_target) || 1500;
        return clamp((1 - Math.max(0, spend - target) / Math.max(target, 1)) * 100, 0, 100);
    }
    if (metricId === 'savings_rate' && income != null && spend != null) {
        return income > 0 ? (income - spend) / income : (spend > 0 ? -1 : 0);
    }
    return null;
}

function numericObservation(value, metricId) {
    if (metricId === 'journal_entry') return String(value || '').trim() ? 1 : 0;
    if (typeof value === 'boolean') return value ? 1 : 0;
    return finite(value);
}

function personalFit(value, definition, profileEntry) {
    if (!profileEntry || profileEntry.sampleSize < PROFILE_MIN_DAYS || ['gym_done', 'learning_done', 'journal_entry'].includes(definition.id)) return null;
    const numeric = numericObservation(value, definition.id);
    const baseline = finite(profileEntry.baseline);
    if (numeric == null || baseline == null) return null;
    const robustSpread = Math.max(1.4826 * (finite(profileEntry.mad) || 0), finite(profileEntry.standardDeviation) || 0, Math.abs(definition.scale || 1) * 0.08, 0.25);
    const robustZ = Math.abs(numeric - baseline) / robustSpread;
    return clampScore(Math.exp(-0.5 * (robustZ / 2) ** 2) * 100);
}

function scoreOneMetric(definition, value, record, profile) {
    if (definition.scoring === false) {
        return {
            metricId: definition.id,
            value,
            unit: definition.unit,
            objectiveScore: null,
            personalFit: null,
            score: null,
            source: definition.source,
            model: definition.model,
            rawOnly: true,
        };
    }
    const objective = clampScore(definition.score(value, record));
    const profileEntry = profile?.metrics?.[definition.id];
    const consistency = personalFit(value, definition, profileEntry);
    const personalized = consistency == null ? objective : clampScore((objective * 0.65) + (consistency * 0.35));
    return {
        metricId: definition.id,
        value,
        unit: definition.unit,
        objectiveScore: round(objective),
        personalFit: consistency == null ? null : round(consistency),
        score: round(personalized),
        source: definition.source,
        model: definition.model,
        baseline: profileEntry?.baseline ?? null,
        variability: profileEntry?.variability ?? null,
        profileSampleSize: profileEntry?.sampleSize || 0,
    };
}

function baseMetricAliases(metricScores) {
    const values = (ids) => ids.map((id) => metricScores[id]?.score).filter((value) => Number.isFinite(Number(value))).map(Number);
    const average = (ids) => round(mean(values(ids)));
    return {
        sleepScore: metricScores.sleep_hours?.score ?? null,
        activityScore: average(['gym_done', 'steps']),
        focusScore: average(['focus_minutes', 'focus_cycles']),
        financialScore: average(['budget_adherence', 'savings_rate']),
        nutritionWaterScore: metricScores.water_bottles?.score ?? null,
        learningScore: metricScores.learning_done?.score ?? null,
        habitCompletionScore: metricScores.habit_completion_pct?.score ?? null,
        routineAdherenceScore: metricScores.routine_adherence_pct?.score ?? null,
        budgetAdherenceScore: metricScores.budget_adherence?.score ?? null,
        savingsRateScore: metricScores.savings_rate?.score ?? null,
        moodStabilityScore: metricScores.mood?.score ?? null,
        journalConsistencyScore: metricScores.journal_entry?.score ?? null,
    };
}

function normalizedDomainWeights(profile) {
    const raw = DOMAIN_ORDER.reduce((result, domain) => {
        const base = DEFAULT_DOMAIN_WEIGHTS[domain];
        const domainProfile = profile?.domains?.[domain] || {};
        const coverage = clamp(Number(domainProfile.coverage) || 0);
        const volatility = clamp(Number(domainProfile.volatility) || 0);
        const informationQuality = 0.65 + (coverage * 0.35);
        const stabilityAdjustment = 1 - Math.min(0.20, volatility * 0.20);
        result[domain] = base * informationQuality * stabilityAdjustment;
        return result;
    }, {});
    const total = Object.values(raw).reduce((sum, value) => sum + value, 0) || 1;
    return Object.fromEntries(DOMAIN_ORDER.map((domain) => [domain, round(raw[domain] / total, 4)]));
}

export function buildPersonalProfile(records = []) {
    const uniqueDays = [...new Set(records.map((record) => record?.date).filter(Boolean))];
    const expectedDays = Math.max(1, uniqueDays.length || records.length);
    const metrics = {};
    LIFE_SCORE_METRIC_DEFS.forEach((definition) => {
        const values = records
            .map((record) => numericObservation(deriveMetricValue(record, definition.id), definition.id))
            .filter((value) => Number.isFinite(value));
        const baseline = median(values);
        metrics[definition.id] = {
            baseline: round(baseline),
            mean: round(mean(values)),
            variability: round(standardDeviation(values)),
            mad: round(medianAbsoluteDeviation(values, baseline)),
            sampleSize: values.length,
            coverage: round(values.length / expectedDays, 4),
        };
    });

    const domains = Object.fromEntries(DOMAIN_ORDER.map((domain) => {
        const definitions = SCORING_METRICS.filter((metric) => metric.domain === domain);
        const observed = definitions.reduce((sum, definition) => sum + (metrics[definition.id]?.sampleSize || 0), 0);
        const expected = expectedDays * definitions.length;
        const normalizedVariability = definitions
            .map((definition) => {
                const value = metrics[definition.id]?.variability;
                const scale = Math.max(Number(definition.scale) || 1, 1);
                return value == null ? null : clamp(value / scale, 0, 1);
            })
            .filter((value) => value != null);
        return [domain, {
            coverage: round(expected ? observed / expected : 0, 4),
            observedPoints: observed,
            expectedPoints: expected,
            volatility: round(mean(normalizedVariability) || 0, 4),
        }];
    }));

    const profile = {
        profileVersion: 'personal-baseline-v2-median-mad',
        windowDays: expectedDays,
        sampleDays: expectedDays,
        metrics,
        domains,
        referenceDatasetVersion: LIFE_SCORE_REFERENCE_DATASET.datasetVersion,
        minimumPersonalizationDays: PROFILE_MIN_DAYS,
    };
    profile.domainWeights = normalizedDomainWeights(profile);
    return profile;
}

function confidenceForRecord({ observedMetricCount, scoringMetricCount, profileDays }) {
    const coverage = scoringMetricCount ? observedMetricCount / scoringMetricCount : 0;
    if (observedMetricCount === 0) return { label: 'unavailable', score: 0 };
    if (coverage < 0.25 || profileDays < 3) return { label: 'insufficient', score: round(coverage * 0.45) };
    if (coverage < 0.5 || profileDays < 7) return { label: 'exploratory', score: round(0.35 + coverage * 0.35) };
    if (coverage < 0.75 || profileDays < 30) return { label: 'moderate', score: round(0.62 + coverage * 0.25) };
    return { label: 'strong', score: round(0.82 + Math.min(0.18, coverage * 0.18)) };
}

function weightedMean(items) {
    const observed = items.filter((item) => item.value != null && Number.isFinite(Number(item.weight)) && item.weight > 0);
    const total = observed.reduce((sum, item) => sum + item.weight, 0);
    return total ? observed.reduce((sum, item) => sum + (Number(item.value) * item.weight), 0) / total : null;
}

export function calculateLifeHealthForRecord(record = {}, options = {}) {
    const profile = options.profile || buildPersonalProfile(options.historyRecords || [record]);
    const metricScores = {};
    const observedMetrics = [];

    LIFE_SCORE_METRIC_DEFS.forEach((definition) => {
        const value = deriveMetricValue(record, definition.id);
        if (value === null || value === undefined) return;
        metricScores[definition.id] = scoreOneMetric(definition, value, record, profile);
        observedMetrics.push(definition.id);
    });

    const domainScores = {};
    const domainCoverage = {};
    const domainConfidence = {};
    DOMAIN_ORDER.forEach((domain) => {
        const definitions = SCORING_METRICS.filter((metric) => metric.domain === domain);
        const scored = definitions
            .map((definition) => ({ value: metricScores[definition.id]?.score, weight: definition.weight }))
            .filter((item) => item.value != null);
        domainScores[domain] = scored.length ? round(weightedMean(scored)) : null;
        domainCoverage[domain] = round(scored.length / Math.max(1, definitions.length), 4);
        domainConfidence[domain] = confidenceForRecord({ observedMetricCount: scored.length, scoringMetricCount: definitions.length, profileDays: profile.sampleDays || 0 });
    });

    const weightedDomains = DOMAIN_ORDER
        .map((domain) => ({ domain, value: domainScores[domain], weight: profile.domainWeights?.[domain] || DEFAULT_DOMAIN_WEIGHTS[domain] }))
        .filter((item) => item.value != null);
    const globalScore = round(weightedMean(weightedDomains));
    const scoredMetrics = Object.values(metricScores).filter((metric) => metric.score != null).map((metric) => metric.metricId);
    const sourceRecordIds = Array.isArray(record.sourceRecordIds) && record.sourceRecordIds.length
        ? [...new Set(record.sourceRecordIds)]
        : (record.date ? [`daily:${record.date}`] : []);
    const confidence = confidenceForRecord({ observedMetricCount: scoredMetrics.length, scoringMetricCount: SCORING_METRICS.length, profileDays: profile.sampleDays || 0 });
    const uncertaintyBand = globalScore == null ? null : round(Math.max(3, 18 * (1 - confidence.score) + (1 - (scoredMetrics.length / SCORING_METRICS.length)) * 8));

    return {
        date: record?.date,
        globalScore,
        systemScores: domainScores,
        baseMetrics: baseMetricAliases(metricScores),
        metricScores,
        scoreMeta: {
            calculationVersion: LIFE_SCORE_CALCULATION_VERSION,
            profileVersion: profile.profileVersion,
            referenceDatasetVersion: profile.referenceDatasetVersion,
            observedMetrics,
            observedMetricCount: observedMetrics.length,
            scoredMetrics,
            scoredMetricCount: scoredMetrics.length,
            sourceRecordIds,
            coverage: round(scoredMetrics.length / SCORING_METRICS.length, 4),
            domainCoverage,
            domainConfidence,
            confidence: confidence.label,
            confidenceScore: confidence.score,
            uncertaintyBand,
            personalized: Boolean(profile.sampleDays >= PROFILE_MIN_DAYS),
            missingDataIsExcluded: true,
            methodology: 'Observed daily signals are scored against conservative operating anchors, then blended with a robust personal median/MAD fit after seven observations. Domain means use within-domain weights; global score uses calibrated domain weights and recency only at window aggregation.',
        },
    };
}

function dateDistanceInDays(start, end) {
    const a = safeDate(start);
    const b = safeDate(end);
    if (!a || !b) return 0;
    return Math.max(0, Math.round((b.getTime() - a.getTime()) / 86400000));
}

export function calculateLifeHealthTimeline(records = [], options = {}) {
    const ordered = [...records].sort((a, b) => String(a?.date || '').localeCompare(String(b?.date || '')));
    return ordered.map((record, index) => {
        const historyRecords = ordered.slice(Math.max(0, index - 90), index);
        const profile = options.profile || buildPersonalProfile(historyRecords);
        return {
            ...record,
            ...calculateLifeHealthForRecord(record, { ...options, profile, historyRecords }),
        };
    });
}

function recencyWeight(date, latestDate) {
    const gap = dateDistanceInDays(date, latestDate);
    return Math.exp(-RECENCY_LAMBDA * gap);
}

function summarizeSeries(timeline, selector) {
    const latestDate = timeline[timeline.length - 1]?.date;
    return weightedMean(timeline.map((item) => ({ value: selector(item), weight: latestDate ? recencyWeight(item.date, latestDate) : 1 })));
}

function scoreTrend(timeline) {
    const scores = timeline.map((item) => item.globalScore).filter((value) => value != null).map(Number);
    if (scores.length < 2) return { direction: 'unknown', delta: null, volatility: null, recentScore: scores.at(-1) ?? null };
    const recent = scores.slice(-7);
    const prior = scores.slice(-14, -7);
    const recentMean = mean(recent);
    const priorMean = prior.length ? mean(prior) : null;
    const delta = recentMean != null && priorMean != null ? recentMean - priorMean : null;
    return {
        direction: delta == null ? 'unknown' : delta > 2 ? 'improving' : delta < -2 ? 'declining' : 'stable',
        delta: round(delta),
        volatility: round(standardDeviation(scores)),
        recentScore: round(recentMean),
        priorScore: round(priorMean),
    };
}

function effectiveSampleSize(timeline) {
    const latestDate = timeline[timeline.length - 1]?.date;
    const weights = timeline.filter((item) => item.globalScore != null).map((item) => recencyWeight(item.date, latestDate));
    const sum = weights.reduce((total, value) => total + value, 0);
    const squared = weights.reduce((total, value) => total + (value ** 2), 0);
    return squared ? round((sum ** 2) / squared, 2) : 0;
}

export function summarizeLifeHealth(records = [], options = {}) {
    const profile = options.profile || buildPersonalProfile(records);
    const timeline = calculateLifeHealthTimeline(records, { ...options, profile: options.profile });
    const validGlobalScores = timeline.map((item) => item.globalScore).filter((value) => value != null).map(Number);
    const scoreDays = validGlobalScores.length;
    const latestDate = timeline[timeline.length - 1]?.date;
    const systemScores = Object.fromEntries(DOMAIN_ORDER.map((domain) => {
        const values = timeline.map((item) => ({ value: item.systemScores?.[domain], weight: latestDate ? recencyWeight(item.date, latestDate) : 1 }));
        const score = weightedMean(values);
        const definitionCount = SCORING_METRICS.filter((metric) => metric.domain === domain).length;
        const observedPoints = timeline.reduce((sum, item) => sum + SCORING_METRICS.filter((metric) => metric.domain === domain && item.metricScores?.[metric.id]?.score != null).length, 0);
        const expectedPoints = Math.max(1, timeline.length * definitionCount);
        const coverage = observedPoints / expectedPoints;
        const domainScoreDays = timeline.filter((item) => item.systemScores?.[domain] != null).length;
        return [domain, {
            score: round(score),
            observedDays: domainScoreDays,
            coverage: round(coverage, 4),
            confidence: confidenceForRecord({ observedMetricCount: observedPoints, scoringMetricCount: expectedPoints, profileDays: profile.sampleDays || 0 }).label,
            weight: profile.domainWeights?.[domain] || DEFAULT_DOMAIN_WEIGHTS[domain],
            metricIds: SCORING_METRICS.filter((metric) => metric.domain === domain).map((metric) => metric.id),
        }];
    }));
    const trend = scoreTrend(timeline);
    const coverage = SCORING_METRICS.length && timeline.length
        ? timeline.reduce((sum, item) => sum + (item.scoreMeta?.scoredMetricCount || 0), 0) / (timeline.length * SCORING_METRICS.length)
        : 0;
    const confidence = confidenceForRecord({ observedMetricCount: timeline.reduce((sum, item) => sum + (item.scoreMeta?.scoredMetricCount || 0), 0), scoringMetricCount: Math.max(1, timeline.length * SCORING_METRICS.length), profileDays: profile.sampleDays || 0 });
    const uncertaintyBand = validGlobalScores.length
        ? round(Math.max(3, 18 * (1 - confidence.score) + (1 - coverage) * 8))
        : null;

    return {
        globalScore: validGlobalScores.length ? round(summarizeSeries(timeline, (item) => item.globalScore)) : null,
        systemScores: Object.fromEntries(DOMAIN_ORDER.map((domain) => [domain, systemScores[domain].score])),
        dimensions: systemScores,
        baseMetrics: timeline.at(-1)?.baseMetrics || baseMetricAliases({}),
        timeline,
        profile,
        scoreMeta: {
            calculationVersion: LIFE_SCORE_CALCULATION_VERSION,
            profileVersion: profile.profileVersion,
            referenceDatasetVersion: profile.referenceDatasetVersion,
            scoreDays,
            windowDays: timeline.length,
            coverage: round(coverage, 4),
            confidence: confidence.label,
            confidenceScore: confidence.score,
            uncertaintyBand,
            effectiveSampleSize: effectiveSampleSize(timeline),
            trend,
            sourceRecordCount: timeline.reduce((sum, item) => sum + (item.scoreMeta?.sourceRecordIds?.length || 0), 0),
            missingDataIsExcluded: true,
            personalized: Boolean(profile.sampleDays >= PROFILE_MIN_DAYS),
            domainWeights: profile.domainWeights,
            methodology: 'Observed daily signals are scored against conservative operating anchors, then blended with a robust personal median/MAD fit after seven observations. Domain means use within-domain weights; global score uses calibrated domain weights and recency only at window aggregation. Missing data is excluded from denominators and widens uncertainty instead of lowering the score.',
            modelCard: {
                type: 'personal-operating-model',
                version: LIFE_SCORE_CALCULATION_VERSION,
                referenceDatasetVersion: LIFE_SCORE_REFERENCE_DATASET.datasetVersion,
                personalization: 'median + MAD robust fit after seven observed days',
                aggregation: 'within-domain weighted means, coverage/stability-adjusted domain weights, exponentially recency-weighted window summary',
                uncertainty: 'coverage, profile maturity, and effective sample size',
                limitations: ['Signals are self-tracking proxies, not diagnoses.', 'No causal claim is made from the score.', 'A missing day is unknown, not zero.', 'Population references constrain defaults but do not rank the user against a population.'],
                sources: LIFE_SCORE_REFERENCE_DATASET.sources.map((source) => ({ id: source.id, title: source.title, url: source.url })),
            },
        },
        calculationVersion: LIFE_SCORE_CALCULATION_VERSION,
    };
}
