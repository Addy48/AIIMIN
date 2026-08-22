const DOMAIN_ORDER = ['physical', 'cognitive', 'discipline', 'financial', 'emotional'];
const METRICS = [
  ['sleep_hours', 'Sleep duration', 'physical', 'hours', 'Sleep duration', 7.5],
  ['steps', 'Steps', 'physical', 'count', 'Steps', 9000],
  ['gym_done', 'Training logged', 'physical', 'boolean', 'Training logged', true],
  ['water_bottles', 'Water bottles', 'physical', 'count', 'Water bottles', 4],
  ['focus_minutes', 'Focused minutes', 'cognitive', 'minutes', 'Focused minutes', 90],
  ['focus_cycles', 'Focus cycles', 'cognitive', 'count', 'Focus cycles', 3],
  ['learning_done', 'Learning logged', 'cognitive', 'boolean', 'Learning logged', true],
  ['habit_completion_pct', 'Habit completion', 'discipline', 'percentage', 'Habit completion', 86],
  ['routine_adherence_pct', 'Routine adherence', 'discipline', 'percentage', 'Routine adherence', 79],
  ['commitment_pct', 'Commitment completion', 'discipline', 'percentage', 'Commitment completion', 88],
  ['daily_spend', 'Money out', 'financial', 'INR', 'Money out', 950],
  ['daily_income', 'Money in', 'financial', 'INR', 'Money in', 2200],
  ['budget_adherence', 'Budget adherence', 'financial', 'percentage', 'Budget adherence', 82],
  ['savings_rate', 'Savings rate', 'financial', 'ratio', 'Savings rate', 0.42],
  ['mood', 'Mood check-in', 'emotional', '0–10 score', 'Mood check-in', 7.5],
  ['journal_entry', 'Journal entry', 'emotional', 'boolean', 'Journal entry', true],
];

const wave = [74, 78, 71, 63, 68, 76, 81, 79, 70, 66, 72, 84, 87, 80, 73, 69, 77, 82, 86, 75, 67, 71, 79, 83, 88, 85, 76, 73, 81, 89];
const mood = [7, 8, 7, 6, 6.5, 8, 8.5, 8, 7, 6.5, 7.5, 8.5, 9, 8, 7.5, 7, 8, 8.5, 9, 7.5, 6.5, 7, 8, 8.5, 9, 8.5, 7.5, 7, 8, 9];
const journal = [1, 1, 0, 0, 1, 1, 1, 0, 0, 1, 1, 1, 1, 0, 1, 0, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1];
const sleep = [7.5, 8, 6.5, 5.5, 7, 8, 8.5, 7.5, 6, 6.5, 7.5, 8, 8.5, 7, 6.5, 6, 7.5, 8, 8.5, 7.5, 6, 6.5, 7.5, 8, 8.5, 8, 7, 6.5, 7.5, 8.5];

function isoDay(index) {
  const date = new Date(Date.UTC(2026, 7, 23));
  date.setUTCDate(date.getUTCDate() - (29 - index));
  return date.toISOString().slice(0, 10);
}

function valueFor(metricId, index) {
  const score = wave[index];
  if (metricId === 'sleep_hours') return sleep[index];
  if (metricId === 'steps') return Math.round(6500 + (score * 45) + ((index % 3) * 500));
  if (metricId === 'gym_done') return index % 4 !== 3;
  if (metricId === 'water_bottles') return Math.max(1, Math.round(score / 22));
  if (metricId === 'focus_minutes') return Math.round(score * 1.05) * (index % 5 === 3 ? 0.55 : 1);
  if (metricId === 'focus_cycles') return Math.min(5, Math.round(score / 22));
  if (metricId === 'learning_done') return index % 6 !== 3;
  if (metricId === 'habit_completion_pct') return Math.max(30, Math.min(100, score + (index % 3) * 3));
  if (metricId === 'routine_adherence_pct') return Math.max(25, Math.min(100, score - 4 + (index % 4) * 2));
  if (metricId === 'commitment_pct') return Math.max(25, Math.min(100, score + (index % 5) - 2));
  if (metricId === 'daily_spend') return Math.round(620 + ((index * 137) % 650));
  if (metricId === 'daily_income') return index % 7 === 0 ? 4200 : 0;
  if (metricId === 'budget_adherence') return Math.max(40, Math.min(100, score + 5));
  if (metricId === 'savings_rate') return index % 7 === 0 ? 0.72 : 0.22 + ((score % 25) / 100);
  if (metricId === 'mood') return mood[index];
  if (metricId === 'journal_entry') return journal[index] ? 'Reflection logged' : '';
  return null;
}

function metricScore(metricId, value) {
  if (metricId === 'sleep_hours') return Math.max(0, Math.min(100, 100 - Math.abs(7.8 - value) * 16));
  if (metricId === 'steps') return Math.round(Math.min(100, (value / 10000) * 100));
  if (metricId === 'gym_done' || metricId === 'learning_done' || metricId === 'journal_entry') return value ? 100 : 0;
  if (metricId === 'water_bottles') return Math.round(Math.min(100, (value / 4) * 100));
  if (metricId === 'focus_minutes') return Math.round(Math.min(100, (value / 120) * 100));
  if (metricId === 'focus_cycles') return Math.round(Math.min(100, (value / 4) * 100));
  if (metricId.endsWith('_pct') || metricId === 'mood') return Math.round(metricId === 'mood' ? value * 10 : value);
  if (metricId === 'savings_rate') return Math.round(Math.max(0, Math.min(100, ((value + 1) / 2) * 100)));
  return null;
}

function buildTimeline() {
  return wave.map((globalScore, index) => {
    const date = isoDay(index);
    const metricScores = {};
    METRICS.forEach(([metricId, displayName, domain, unit]) => {
      const value = valueFor(metricId, index);
      if (value === null || value === undefined) return;
      const score = metricScore(metricId, value);
      metricScores[metricId] = { metricId, value, unit, score, objectiveScore: score, source: `demo.${metricId}`, model: 'deterministic visual QA fixture' };
    });
    const systemScores = {
      physical: Math.round(globalScore * 0.96),
      cognitive: Math.round(globalScore * 0.92),
      discipline: Math.round(globalScore * 1.03),
      financial: Math.round(Math.min(100, globalScore * 0.98 + 4)),
      emotional: Math.round(globalScore * 0.94),
    };
    return {
      date,
      globalScore,
      systemScores,
      metricScores,
      scoreMeta: {
        calculationVersion: 'lhs-v3.0.0-calibrated',
        confidence: index < 7 ? 'exploratory' : index < 14 ? 'moderate' : 'strong',
        uncertaintyBand: index < 7 ? 13 : index < 14 ? 9 : 5,
        observedMetricCount: index % 6 === 3 ? 11 : 16,
        sourceRecordIds: [`demo:daily:${date}`],
      },
    };
  });
}

const timeline = buildTimeline();
const latest = timeline[timeline.length - 1];
const metrics = METRICS.map(([metricId, displayName, domain, unit]) => {
  const point = latest.metricScores[metricId];
  const values = timeline.map((day) => day.metricScores[metricId]?.value).filter((value) => value !== undefined && value !== null && value !== '');
  return {
    metricId,
    displayName,
    domain,
    unit,
    currentValue: point?.value ?? null,
    observedPoints: values.length,
    expectedPoints: timeline.length,
    coverage: values.length / timeline.length,
    status: values.length === 0 ? 'missing' : values.length < timeline.length ? 'partial' : 'observed',
    sourceRecordIds: latest.scoreMeta.sourceRecordIds,
  };
});

export const DEMO_REPORT = {
  tier: 'elite',
  canonicalReport: {
    contractVersion: 'report-contract-v1',
    generatedAt: '2026-08-23T08:30:00.000Z',
    calculationVersion: 'lhs-v3.0.0-calibrated',
    window: { label: 'Last 30 days · demo fixture', timezone: 'Asia/Kolkata', start: timeline[0].date, end: timeline.at(-1).date },
    globalScore: 78,
    scoreConfidence: 'strong',
    uncertaintyBand: 5,
    coverage: { overall: 0.93, scoreDays: 30, observedDays: 30, missingDays: 0 },
    metrics,
    findings: [
      { id: 'finding_sleep_focus', title: 'Sleep and focus move together', domain: 'physical', claim: 'Focus minutes were higher on days with longer sleep in this fixture.', claimType: 'associational', confidence: 'moderate', sampleSize: 22, effect: { value: 0.41, unit: 'association', direction: 'positive' }, method: 'Spearman rank association over observed day pairs.', supportingRecordIds: ['demo:daily:2026-08-18', 'demo:daily:2026-08-19'], limitations: ['Association is not causation.', 'The fixture is for visual QA only.'] },
      { id: 'finding_journal_mood', title: 'Reflection days are steadier', domain: 'emotional', claim: 'Mood variation was lower on days with a journal entry.', claimType: 'associational', confidence: 'exploratory', sampleSize: 17, effect: { value: -0.28, unit: 'variation', direction: 'negative' }, method: 'Group comparison using observed journal presence and mood values.', supportingRecordIds: ['demo:daily:2026-08-20'], limitations: ['Self-report signal.', 'No causal claim.'] },
      { id: 'finding_discipline_bottleneck', title: 'Discipline is the current lever', domain: 'discipline', claim: 'Completion signals explain the largest observed domain spread in this window.', claimType: 'descriptive', confidence: 'strong', sampleSize: 30, effect: { value: 18, unit: 'points', direction: 'positive' }, method: 'Domain score dispersion over the selected window.', supportingRecordIds: ['demo:daily:2026-08-21', 'demo:daily:2026-08-22'], limitations: ['Ranked by observed data, not importance to your identity.'] },
    ],
    methodology: 'Deterministic 30-day visual QA fixture. Production reports use authenticated source records and the calibrated server Life Score model.',
    limitations: ['This demo fixture never represents a real person.', 'The score is an operating signal, not a diagnosis or moral judgement.'],
  },
  lhs: {
    globalScore: 78,
    scoreMeta: { confidence: 'strong', coverage: 0.93, uncertaintyBand: 5, effectiveSampleSize: 22.8, trend: { direction: 'improving', delta: 6.2 } },
    timeline,
  },
};

export const DEMO_REPORT_GEN = { deep_report: { remaining: 2, used: 1, limit: 3, resetAt: '2026-09-01' } };
