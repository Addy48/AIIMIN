import {
    LIFE_SCORE_CALCULATION_VERSION,
    LIFE_SCORE_METRIC_DEFS,
} from './lifeHealthEngine.js';

const DOMAIN_ORDER = ['physical', 'cognitive', 'discipline', 'financial', 'emotional'];
const finite = (value) => Number.isFinite(Number(value)) ? Number(value) : null;
const mean = (values) => values.length ? values.reduce((sum, value) => sum + value, 0) / values.length : null;
const round = (value, places = 1) => {
    if (!Number.isFinite(Number(value))) return null;
    const factor = 10 ** places;
    return Math.round(Number(value) * factor) / factor;
};

function findExtremes(timeline) {
    const scored = timeline.filter((day) => day.globalScore != null);
    const bestDay = scored.reduce((best, day) => (!best || day.globalScore > best.globalScore ? day : best), null);
    const worstDay = scored.reduce((worst, day) => (!worst || day.globalScore < worst.globalScore ? day : worst), null);
    return { bestDay, worstDay };
}

function confidenceFor(samples, coverage) {
    if (samples < 5 || coverage < 0.25) return 'insufficient';
    if (samples < 7 || coverage < 0.5) return 'exploratory';
    if (samples < 14 || coverage < 0.7) return 'moderate';
    return 'strong';
}

function metricIndex(timeline) {
    return LIFE_SCORE_METRIC_DEFS.map((definition) => {
        const points = timeline
            .map((day) => day.metricScores?.[definition.id])
            .filter(Boolean);
        const rawValues = points.map((point) => point.value);
        const values = rawValues.map((value) => definition.id === 'journal_entry' ? (String(value || '').trim() ? 1 : 0) : (typeof value === 'boolean' ? (value ? 1 : 0) : finite(value))).filter((value) => value != null);
        const currentValue = definition.id === 'journal_entry'
            ? (rawValues.length ? Boolean(String(rawValues[rawValues.length - 1] || '').trim()) : null)
            : (rawValues.length ? rawValues[rawValues.length - 1] : null);
        const sourceRecordIds = timeline.flatMap((day) => day.metricScores?.[definition.id]
            ? (day.scoreMeta?.sourceRecordIds || [])
            : []);
        const uniqueSourceIds = [...new Set(sourceRecordIds)];
        return {
            metricId: definition.id,
            displayName: definition.label,
            domain: definition.domain,
            unit: definition.unit,
            source: definition.source,
            currentValue,
            averageValue: round(mean(values)),
            observedPoints: points.length,
            coverage: round(timeline.length ? points.length / timeline.length : 0, 4),
            isMissing: points.length === 0,
            sourceRecordIds: uniqueSourceIds,
            status: points.length === 0 ? 'missing' : points.length < Math.max(3, timeline.length * 0.5) ? 'partial' : 'observed',
        };
    });
}

function domainIndex(lhs) {
    return Object.fromEntries(DOMAIN_ORDER.map((domain) => {
        const item = {
            domain,
            ...((lhs?.dimensions || {})[domain] || {
                score: null,
                observedDays: 0,
                coverage: 0,
                confidence: 'insufficient',
                weight: null,
                metricIds: [],
            }),
        };
        return [domain, item];
    }));
}

function buildFindings({ tier, timeline, drivers, drift, signalCorrelations, weeklyReview }) {
    const findings = [];
    const { bestDay, worstDay } = findExtremes(timeline);

    if (bestDay && worstDay) {
        findings.push({
            id: 'finding_peak_trough',
            domain: 'composite',
            title: 'Peak and trough',
            claim: `Your highest observed day was ${bestDay.date} at ${Math.round(bestDay.globalScore)}/100; your lowest was ${worstDay.date} at ${Math.round(worstDay.globalScore)}/100.`,
            claimType: 'comparative',
            confidence: timeline.length >= 7 ? 'moderate' : 'exploratory',
            sampleSize: timeline.length,
            effect: { value: round(bestDay.globalScore - worstDay.globalScore), unit: 'score points', direction: 'mixed' },
            lag: null,
            supportingRecordIds: bestDay.scoreMeta?.sourceRecordIds || [`daily:${bestDay.date}`],
            counterRecordIds: worstDay.scoreMeta?.sourceRecordIds || [`daily:${worstDay.date}`],
            limitations: ['This compares observed days only; days with no records are not scored as zero.'],
            method: 'Observed daily Life Score comparison',
            calculationVersion: LIFE_SCORE_CALCULATION_VERSION,
        });
    }

    if (tier === 'pro' || tier === 'elite') {
        (drivers?.rankedDrivers || []).forEach((driver, index) => {
            const matching = timeline.filter((day) => day[driver.metric] != null || day[driver.behaviorLabel]);
            findings.push({
                id: `finding_driver_${index + 1}`,
                domain: LIFE_SCORE_METRIC_DEFS.find((metric) => metric.id === driver.metric)?.domain || 'composite',
                title: driver.behaviorLabel,
                claim: `${driver.label} was associated with the user's observed Life Score in this window.`,
                claimType: 'associational',
                confidence: confidenceFor(driver.samples, driver.samples / Math.max(1, timeline.length)),
                sampleSize: driver.samples,
                effect: { value: driver.rho, unit: 'Pearson r', direction: driver.rho >= 0 ? 'positive' : 'negative' },
                lag: null,
                supportingRecordIds: matching.map((day) => `daily:${day.date}`),
                counterRecordIds: [],
                limitations: ['Association is not causation.', 'The analysis is observational and may be affected by unmeasured context.'],
                method: 'Pearson correlation against the personalized daily Life Score',
                calculationVersion: LIFE_SCORE_CALCULATION_VERSION,
            });
        });
        (signalCorrelations || []).slice(0, 8).forEach((correlation, index) => {
            findings.push({
                id: `finding_signal_${index + 1}`,
                domain: 'composite',
                title: `${correlation.signalALabel} and ${correlation.signalBLabel}`,
                claim: correlation.headline || 'Two observed signals moved together in this window.',
                claimType: 'associational',
                confidence: confidenceFor(correlation.n, correlation.bhPassed ? 0.8 : 0.5),
                sampleSize: correlation.n,
                effect: { value: correlation.rho, unit: 'Spearman rho', direction: correlation.rho >= 0 ? 'positive' : 'negative' },
                lag: null,
                supportingRecordIds: correlation.sourceRecordIds || (correlation.sourceDates || []).map((date) => `daily:${date}`),
                counterRecordIds: [],
                limitations: ['Association is not causation.', 'Only days with both signals observed are included.'],
                method: 'Spearman rank correlation with Benjamini–Hochberg correction where available',
                calculationVersion: LIFE_SCORE_CALCULATION_VERSION,
            });
        });
    }

    if (tier === 'elite' && weeklyReview?.recommendations?.length) {
        findings.push({
            id: 'finding_next_test',
            domain: 'composite',
            title: 'Next reversible test',
            claim: weeklyReview.recommendations[0],
            claimType: 'experiment',
            confidence: 'exploratory',
            sampleSize: timeline.length,
            effect: { value: null, unit: 'not yet tested', direction: 'none' },
            lag: null,
            supportingRecordIds: worstDay?.scoreMeta?.sourceRecordIds || (worstDay ? [`daily:${worstDay.date}`] : []),
            counterRecordIds: [],
            limitations: ['This is a proposed test, not a forecast or causal conclusion.'],
            method: 'Rule-based recommendation from the weakest observed domain',
            calculationVersion: LIFE_SCORE_CALCULATION_VERSION,
        });
    }

    return findings;
}

export function buildCanonicalReport({
    tier = 'explore',
    window = {},
    lhs,
    drivers,
    drift,
    forecast,
    signalCorrelations = [],
    weeklyReview,
}) {
    const timeline = Array.isArray(lhs?.timeline) ? lhs.timeline : [];
    const scoreDays = timeline.filter((day) => day.globalScore != null).length;
    const entitlements = {
        explore: ['daily_values', 'seven_day_pulse'],
        core: ['daily_values', 'seven_day_pulse', 'weekly_comparison', 'commitments'],
        pro: ['daily_values', 'seven_day_pulse', 'weekly_comparison', 'commitments', 'pattern_analysis', 'evidence_drawer', 'standard_pdf'],
        elite: ['daily_values', 'seven_day_pulse', 'weekly_comparison', 'commitments', 'pattern_analysis', 'evidence_drawer', 'standard_pdf', 'investigation_workspace', 'forecast_assumptions', 'deep_report'],
    }[tier] || ['daily_values', 'seven_day_pulse'];
    const advanced = tier === 'pro' || tier === 'elite';

    return {
        contractVersion: 'report-contract-v1',
        tier,
        window,
        generatedAt: new Date().toISOString(),
        dataCutoff: window?.end || new Date().toISOString(),
        calculationVersion: LIFE_SCORE_CALCULATION_VERSION,
        globalScore: finite(lhs?.globalScore),
        scoreConfidence: lhs?.scoreMeta?.confidence || 'insufficient',
        confidenceScore: finite(lhs?.scoreMeta?.confidenceScore) ?? 0,
        uncertaintyBand: finite(lhs?.scoreMeta?.uncertaintyBand),
        effectiveSampleSize: finite(lhs?.scoreMeta?.effectiveSampleSize) ?? 0,
        trend: lhs?.scoreMeta?.trend || null,
        profileVersion: lhs?.scoreMeta?.profileVersion || null,
        referenceDatasetVersion: lhs?.scoreMeta?.referenceDatasetVersion || null,
        entitlements,
        coverage: {
            overall: lhs?.scoreMeta?.coverage ?? 0,
            scoreDays,
            observedDays: timeline.length,
            missingDays: Math.max(0, Number(window.days || 0) - timeline.length),
            byDomain: Object.fromEntries(Object.entries(lhs?.dimensions || {}).map(([domain, data]) => [domain, data?.coverage ?? 0])),
        },
        metrics: metricIndex(timeline),
        domains: domainIndex(lhs),
        findings: buildFindings({ tier, timeline, drivers, drift, signalCorrelations: advanced ? signalCorrelations : [], weeklyReview }),
        evidence: advanced ? {
            supporting: signalCorrelations.slice(0, 8),
            counterEvidence: [],
        } : null,
        forecast: tier === 'elite' ? forecast?.horizons || null : null,
        methodology: lhs?.scoreMeta?.methodology,
        limitations: [
            'Life Score describes logged operating signals; it is not a diagnosis, moral judgment, or guarantee of future outcomes.',
            'Missing signals and missing days are excluded from the numerator and shown through coverage.',
            'Personal-baseline fit begins after seven observations for a metric; before that, the operating-range score is used.',
        ],
    };
}

/**
 * Backward-compatible payload assembler for existing clients.
 */
export function generateReportPayload({ lhs, drivers, drift, forecast, clusters, archetypes, momentum, weeklyReview }) {
    const timeline = Array.isArray(lhs?.timeline) ? lhs.timeline : [];
    const { bestDay, worstDay } = findExtremes(timeline);

    return {
        executiveSummary: {
            globalScore: lhs.globalScore,
            topBehavior: momentum.topBehavior,
            recommendations: weeklyReview.recommendations,
        },
        lifeHealthRadar: lhs.systemScores,
        systemDiagnostics: weeklyReview.systemChanges,
        trendAnalysis: {
            drift: drift.alerts,
            forecast: forecast.horizons,
        },
        behaviorDrivers: drivers.rankedDrivers,
        bestVsWorstDay: { bestDay, worstDay },
        behaviorClusters: clusters.clusters,
        financialPosture: {
            financialScore: lhs.systemScores.financial,
            spendDrift: drift.alerts.find((alert) => alert.metric === 'daily_spend') || null,
        },
        stabilityAndDrift: drift.alerts,
        predictions: forecast.horizons,
        momentumMultiplier: momentum,
        actionPlan: weeklyReview.recommendations,
        archetypes: archetypes.archetypes,
    };
}
