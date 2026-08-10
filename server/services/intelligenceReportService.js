/**
 * intelligenceReportService.js
 * Computes report sections from real analytics data — no hardcoded placeholders.
 */
import { avg } from './analyticsData.js';
import { calculateLifeHealthForRecord } from './lifeHealthEngine.js';

const MIN_SAMPLES = 5;
const DRIFT_THRESHOLD_PCT = 12;

const METRIC_DEFS = [
    { key: 'sleep_hours', label: 'Sleep Hours', target: 'Global LHS' },
    { key: 'habit_completion_pct', label: 'Habit Completion', target: 'Discipline' },
    { key: 'focus_minutes', label: 'Focus Minutes', target: 'Cognitive' },
    { key: 'water_bottles', label: 'Hydration', target: 'Physical' },
    { key: 'mood', label: 'Mood', target: 'Emotional' },
    { key: 'daily_spend', label: 'Daily Spend', target: 'Financial' },
    { key: 'steps', label: 'Steps', target: 'Physical' },
];

function pearson(xs, ys) {
    const n = Math.min(xs.length, ys.length);
    if (n < MIN_SAMPLES) return null;
    const xMean = avg(xs);
    const yMean = avg(ys);
    let num = 0;
    let denX = 0;
    let denY = 0;
    for (let i = 0; i < n; i += 1) {
        const dx = xs[i] - xMean;
        const dy = ys[i] - yMean;
        num += dx * dy;
        denX += dx * dx;
        denY += dy * dy;
    }
    const den = Math.sqrt(denX * denY);
    if (!den) return null;
    return num / den;
}

function enrichTimeline(records) {
    return records.map((record) => {
        const scored = calculateLifeHealthForRecord(record);
        return { ...record, ...scored };
    });
}

function trendLabel(current, previous, threshold = 2) {
    const diff = current - previous;
    if (!Number.isFinite(diff) || Math.abs(diff) < threshold) return 'stable';
    return diff > 0 ? 'improving' : 'declining';
}

export function computeBehaviorDrivers(timeline = []) {
    const scored = timeline.filter((d) => d.globalScore != null);
    if (scored.length < MIN_SAMPLES) {
        return { rankedDrivers: [], insufficientData: true };
    }

    const rankedDrivers = METRIC_DEFS.map((def) => {
        const pairs = scored.filter((d) => d[def.key] != null && d[def.key] !== '');
        if (pairs.length < MIN_SAMPLES) return null;
        const xs = pairs.map((d) => Number(d[def.key]) || 0);
        const ys = pairs.map((d) => Number(d.globalScore) || 0);
        const rho = pearson(xs, ys);
        if (rho == null || Math.abs(rho) < 0.15) return null;
        return {
            behaviorLabel: def.label,
            label: `${def.label} → ${def.target}`,
            impact: Number((Math.abs(rho) * 10).toFixed(1)),
            rho: Number(rho.toFixed(3)),
            samples: pairs.length,
        };
    })
        .filter(Boolean)
        .sort((a, b) => b.impact - a.impact)
        .slice(0, 5);

    return { rankedDrivers, insufficientData: rankedDrivers.length === 0 };
}

export function computeDriftAlerts(dataset) {
    const { windows } = dataset;
    const recent = windows?.last7 || [];
    const baseline = windows?.baseline?.length ? windows.baseline : windows?.last14?.slice(0, 7) || [];

    if (recent.length < 3 || baseline.length < 3) {
        return { alerts: [], insufficientData: true };
    }

    const driftMetrics = [
        { metric: 'sleep_hours', label: 'Sleep', suffix: 'h' },
        { metric: 'daily_spend', label: 'Daily spend', suffix: '' },
        { metric: 'mood', label: 'Mood', suffix: '/10' },
        { metric: 'habit_completion_pct', label: 'Habit completion', suffix: '%' },
        { metric: 'focus_minutes', label: 'Focus', suffix: ' min' },
    ];

    const alerts = driftMetrics.map(({ metric, label, suffix }) => {
        const recentAvg = avg(recent.map((d) => Number(d[metric]) || 0));
        const baseAvg = avg(baseline.map((d) => Number(d[metric]) || 0));
        if (!baseAvg && !recentAvg) return null;
        const driftPct = baseAvg ? ((recentAvg - baseAvg) / Math.abs(baseAvg)) * 100 : 0;
        if (Math.abs(driftPct) < DRIFT_THRESHOLD_PCT) return null;
        return {
            metric,
            label,
            severity: Math.abs(driftPct) >= 25 ? 'warning' : 'info',
            drift: Number(driftPct.toFixed(1)),
            recent: Number(recentAvg.toFixed(2)),
            baseline: Number(baseAvg.toFixed(2)),
            summary: `${label} ${driftPct > 0 ? 'up' : 'down'} ${Math.abs(driftPct).toFixed(0)}% vs baseline (${recentAvg.toFixed(1)}${suffix} vs ${baseAvg.toFixed(1)}${suffix}).`,
        };
    }).filter(Boolean);

    return { alerts, insufficientData: false };
}

export function computeForecast(timeline = []) {
    const scored = enrichTimeline(timeline);
    const recent = scored.slice(-7);
    const previous = scored.slice(-14, -7);

    if (recent.length < 3) {
        return {
            horizons: { sevenDays: null },
            insufficientData: true,
        };
    }

    const systemKeys = ['physical', 'cognitive', 'discipline', 'financial', 'emotional'];
    const sevenDays = {};

    systemKeys.forEach((key) => {
        const recentAvg = avg(recent.map((d) => d.systemScores?.[key] || 0));
        const prevAvg = previous.length
            ? avg(previous.map((d) => d.systemScores?.[key] || 0))
            : recentAvg;
        sevenDays[key] = trendLabel(recentAvg, prevAvg);
    });

    return { horizons: { sevenDays }, insufficientData: false };
}

export function computeBehaviorClusters(timeline = []) {
    const scored = enrichTimeline(timeline);
    if (scored.length < MIN_SAMPLES) {
        return { clusters: [], insufficientData: true };
    }

    const scores = scored.map((d) => d.globalScore);
    const median = [...scores].sort((a, b) => a - b)[Math.floor(scores.length / 2)];
    const high = scored.filter((d) => d.globalScore >= median);
    const low = scored.filter((d) => d.globalScore < median);

    const highAvg = avg(high.map((d) => d.globalScore));
    const lowAvg = avg(low.map((d) => d.globalScore));

    const traitFor = (days, key) => avg(days.map((d) => d.systemScores?.[key] || 0));

    const clusters = [
        {
            label: 'High LHS days',
            count: high.length,
            deltas: { lhs: Number((highAvg - lowAvg).toFixed(1)) },
            traits: {
                sleep: Number(traitFor(high, 'physical').toFixed(1)),
                focus: Number(traitFor(high, 'cognitive').toFixed(1)),
            },
        },
        {
            label: 'Low LHS days',
            count: low.length,
            deltas: { lhs: Number((lowAvg - highAvg).toFixed(1)) },
            traits: {
                sleep: Number(traitFor(low, 'physical').toFixed(1)),
                focus: Number(traitFor(low, 'cognitive').toFixed(1)),
            },
        },
    ];

    return { clusters, insufficientData: false };
}

export function computeArchetypes(timeline = []) {
    const scored = enrichTimeline(timeline);
    if (scored.length < MIN_SAMPLES) {
        return { archetypes: [], insufficientData: true };
    }

    const topQuartile = [...scored]
        .sort((a, b) => b.globalScore - a.globalScore)
        .slice(0, Math.max(1, Math.ceil(scored.length * 0.25)));

    const representation = topQuartile.length / scored.length;
    const dominant = Object.entries(
        topQuartile.reduce((acc, day) => {
            Object.entries(day.systemScores || {}).forEach(([k, v]) => {
                acc[k] = (acc[k] || 0) + v;
            });
            return acc;
        }, {})
    )
        .map(([key, total]) => [key, total / topQuartile.length])
        .sort((a, b) => b[1] - a[1]);

    const traits = dominant.slice(0, 3).map(([k]) => k.replace(/_/g, ' '));
    const nameMap = {
        physical: 'Recovery Builder',
        cognitive: 'Deep Focus',
        discipline: 'Habit Machine',
        financial: 'Steward',
        emotional: 'Grounded',
    };
    const topKey = dominant[0]?.[0] || 'discipline';

    return {
        archetypes: [{
            name: nameMap[topKey] || 'Balanced Operator',
            representation: Number(representation.toFixed(2)),
            traits,
            samples: topQuartile.length,
        }],
        insufficientData: false,
    };
}

export function buildMomentumInput(dataset) {
    const logs = (dataset.windows?.last7 || []).map((d) => ({
        sleep_hours: d.sleep_hours,
        mood_before: d.mood,
        mood_after: d.mood,
        gym_done: d.gym_done,
        steps: d.steps,
        habit_completion_pct: d.habit_completion_pct,
        commitment_pct: d.commitment_pct,
    }));

    const sessions = (dataset.windows?.last7 || [])
        .filter((d) => (d.focus_cycles || 0) > 0 || (d.focus_minutes || 0) > 0)
        .map((d) => ({
            started_at: `${d.date}T12:00:00.000Z`,
            cycles: d.focus_cycles,
            minutes: d.focus_minutes,
        }));

    const commitments = (dataset.windows?.last7 || [])
        .filter((d) => d.commitment_pct != null)
        .map((d) => ({ fulfillment_pct: d.commitment_pct }));

    const recentScores = (dataset.windows?.last7 || []).map((d) => d.habit_completion_pct || 0);
    const driftScore = recentScores.length
        ? Math.max(0, 100 - (avg(recentScores) < 50 ? 30 : 0))
        : 100;

    return { logs, sessions, commitments, driftScore };
}

/**
 * Assemble all report sections from a dataset + LHS summary.
 */
export function buildIntelligenceReportSections(dataset, lhs) {
    const timeline = lhs?.timeline || [];
    const drivers = computeBehaviorDrivers(timeline);
    const drift = computeDriftAlerts(dataset);
    const forecast = computeForecast(timeline);
    const clusters = computeBehaviorClusters(timeline);
    const archetypes = computeArchetypes(timeline);
    const momentumInput = buildMomentumInput(dataset);

    const hasRealData = timeline.length >= MIN_SAMPLES;

    return {
        drivers,
        drift,
        forecast,
        clusters,
        archetypes,
        momentumInput,
        meta: {
            computedFromData: hasRealData,
            daysWithData: timeline.length,
            insufficientData: !hasRealData,
        },
    };
}
