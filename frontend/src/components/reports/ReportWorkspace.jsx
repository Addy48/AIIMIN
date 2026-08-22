import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import './ReportWorkspace.css';

const DOMAIN_LABELS = {
  physical: 'Body',
  cognitive: 'Mind',
  discipline: 'Discipline',
  financial: 'Money',
  emotional: 'Mood',
};

const DOMAIN_ORDER = Object.keys(DOMAIN_LABELS);

const TIER_COPY = {
  explore: { eyebrow: 'Explore · Daily Signal', title: 'See what happened today.', subtitle: 'A truthful read of your logged day. Missing is not the same as zero.' },
  core: { eyebrow: 'Core · Weekly Loop Review', title: 'See how your week operated.', subtitle: 'Review the loop, compare the week, and choose three reversible commitments.' },
  pro: { eyebrow: 'Pro · Performance Dossier', title: 'Find the signals that repeat.', subtitle: 'A deeper window across your captured data, with methods, coverage, and evidence attached.' },
  elite: { eyebrow: 'Elite · Intelligence Room', title: 'Investigate your personal system.', subtitle: 'Move from a finding to a question, an alternative explanation, and a test.' },
};

const SCORE_STATUS = {
  insufficient: 'Needs more observations',
  exploratory: 'Exploratory',
  moderate: 'Moderate confidence',
  strong: 'Strong coverage',
};

function number(value, digits = 0) {
  if (value == null || Number.isNaN(Number(value))) return '—';
  return Number(value).toLocaleString('en-IN', { maximumFractionDigits: digits, minimumFractionDigits: digits });
}

function percent(value) {
  if (value == null || Number.isNaN(Number(value))) return '—';
  return `${Math.round(Number(value) * 100)}%`;
}

function dateLabel(value, options = {}) {
  if (!value) return '—';
  const date = new Date(`${String(value).slice(0, 10)}T12:00:00`);
  return Number.isNaN(date.getTime()) ? String(value).slice(0, 10) : date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', ...options });
}

function metricValue(metricId, value, unit) {
  if (value == null) return 'Not logged';
  if (unit === 'percentage') return `${number(value)}%`;
  if (unit === '0–10 score') return `${number(value, 1)} / 10`;
  if (unit === 'hours') return `${number(value, 1)} h`;
  if (unit === 'minutes') return `${number(value)} min`;
  if (unit === 'ratio') return `${number(Number(value) * 100)}%`;
  if (unit === 'INR') return `₹${number(Math.abs(value))}`;
  if (unit === 'boolean') return value ? 'Logged' : 'Not logged';
  return number(value, typeof value === 'number' && !Number.isInteger(value) ? 1 : 0);
}

function ScoreMark({ value, confidence, uncertainty }) {
  const score = value == null ? null : Math.round(Number(value));
  const progress = score == null ? 0 : Math.max(0, Math.min(100, score));
  return (
    <div className="report-score-mark" aria-label={score == null ? 'Life Score not available' : `Life Score ${score} out of 100`}>
      <div className="report-score-mark__ring" style={{ '--score-pct': `${progress}%` }}>
        <div className="report-score-mark__ring-inner">
          <div className="report-score-mark__value">{score == null ? '—' : score}</div>
          <div className="report-score-mark__denom">/ 100</div>
        </div>
      </div>
      <div className="report-score-mark__label">Life Score</div>
      {uncertainty != null && <div className="report-score-mark__uncertainty">uncertainty ±{Math.round(Number(uncertainty))}</div>}
      <div className={`report-confidence report-confidence--${confidence || 'insufficient'}`}>{SCORE_STATUS[confidence] || 'Insufficient data'}</div>
    </div>
  );
}

function Coverage({ report }) {
  const coverage = report?.coverage?.overall ?? 0;
  const scoreDays = report?.coverage?.scoreDays ?? 0;
  const observedDays = report?.coverage?.observedDays ?? 0;
  const missingDays = report?.coverage?.missingDays ?? 0;
  return (
    <div className="report-coverage">
      <div className="report-coverage__top"><span>Coverage</span><strong>{percent(coverage)}</strong></div>
      <div className="report-coverage__track"><span style={{ width: `${Math.min(100, Math.max(0, coverage * 100))}%` }} /></div>
      <div className="report-coverage__meta">{scoreDays} scored days · {observedDays} observed days · {missingDays} missing days</div>
    </div>
  );
}

function MetricRow({ metric, compact = false }) {
  return (
    <div className={`report-metric-row${compact ? ' report-metric-row--compact' : ''}`}>
      <div>
        <strong>{metric.displayName}</strong>
        <span className="report-mono">{metric.metricId}</span>
        <span className="report-mono report-source-ids">{metric.sourceRecordIds?.length ? metric.sourceRecordIds.slice(0, 2).join(' · ') : 'source unavailable'}</span>
      </div>
      <div className="report-metric-row__right">
        <strong>{metricValue(metric.metricId, metric.currentValue, metric.unit)}</strong>
        <span className={`report-data-status report-data-status--${metric.status}`}>{metric.status === 'missing' ? 'Missing' : metric.status === 'partial' ? `${percent(metric.coverage)} covered` : 'Observed'}</span>
      </div>
    </div>
  );
}

function DomainGrid({ report, timeline }) {
  const domains = report?.domains || {};
  return (
    <div className="report-domain-grid">
      {DOMAIN_ORDER.map((domain) => {
        const item = domains[domain] || {};
        const daily = timeline.map((day) => day.systemScores?.[domain]).filter((value) => value != null);
        const value = item.score ?? (daily.length ? daily.reduce((sum, value) => sum + Number(value), 0) / daily.length : null);
        const observedDays = item.observedDays ?? daily.length;
        const coverage = item.coverage ?? (timeline.length ? daily.length / timeline.length : 0);
        return (
          <div className="report-domain-card" key={domain}>
            <div className="report-domain-card__label">{DOMAIN_LABELS[domain]}</div>
            <div className="report-domain-card__score">{value == null ? '—' : Math.round(value)}</div>
            <div className="report-domain-card__meta">{percent(coverage)} coverage · {observedDays} days</div>
            <div className="report-domain-card__bar"><span style={{ width: `${Math.min(100, Math.max(0, Number(value) || 0))}%` }} /></div>
          </div>
        );
      })}
    </div>
  );
}

function PulseStrip({ timeline, windowDays = 7, endDate = null }) {
  const slots = useMemo(() => {
    const dates = [];
    const end = endDate ? new Date(`${String(endDate).slice(0, 10)}T12:00:00`) : (timeline.length ? new Date(`${timeline[timeline.length - 1].date}T12:00:00`) : new Date());
    for (let i = windowDays - 1; i >= 0; i -= 1) {
      const d = new Date(end);
      d.setDate(end.getDate() - i);
      const key = d.toISOString().slice(0, 10);
      const day = timeline.find((item) => String(item.date).slice(0, 10) === key);
      dates.push({ key, day });
    }
    return dates;
  }, [endDate, timeline, windowDays]);
  return (
    <div className="report-pulse" aria-label={`${windowDays}-day score pulse`}>
      {slots.map(({ key, day }) => (
        <div className={`report-pulse__day ${day ? 'is-observed' : 'is-missing'}`} key={key} title={day ? `${key}: ${day.globalScore == null ? 'insufficient data' : `${Math.round(day.globalScore)}/100`}` : `${key}: no record`}>
          <span style={{ height: day?.globalScore == null ? '18%' : `${Math.max(12, Number(day.globalScore))}%` }} />
          <small>{key.slice(8)}</small>
        </div>
      ))}
    </div>
  );
}

function dailyObservation(day) {
  if (!day) return { title: 'No observation yet', text: 'Log today before the report describes a pattern.' };
  const observed = Object.values(day.metricScores || {})
    .filter((point) => point?.score != null && point?.value != null)
    .sort((a, b) => Number(b.score) - Number(a.score));
  const strongest = observed[0];
  if (!strongest) return { title: 'Nothing scored today', text: 'The day has a record, but no scored signal is complete enough to describe.' };
  const label = (reportMetricId) => (reportMetricId || '').replace(/_/g, ' ');
  return {
    title: `Observed signal: ${label(strongest.metricId)}`,
    text: `${Math.round(Number(strongest.score))}/100 from one observed input. This is descriptive only; it does not explain why the day happened this way.`,
  };
}

function DailySignal({ report, timeline }) {
  const dayKey = String(report?.window?.end || '').slice(0, 10);
  const latest = timeline.find((day) => String(day.date).slice(0, 10) === dayKey) || null;
  const latestObserved = timeline[timeline.length - 1] || null;
  const metrics = (report?.metrics || []).map((metric) => {
    const point = latest?.metricScores?.[metric.metricId];
    return {
      ...metric,
      currentValue: point ? point.value : null,
      observedPoints: point ? 1 : 0,
      coverage: point ? 1 : 0,
      status: point ? 'observed' : 'missing',
    };
  });
  const grouped = DOMAIN_ORDER.map((domain) => ({ domain, metrics: metrics.filter((metric) => metric.domain === domain) })).filter((group) => group.metrics.length);
  const observation = dailyObservation(latest);
  return (
    <>
      <section className="report-hero report-hero--daily">
        <div><div className="report-eyebrow">{TIER_COPY.explore.eyebrow}</div><h1>{TIER_COPY.explore.title}</h1><p>{TIER_COPY.explore.subtitle}</p></div>
        <ScoreMark value={latest?.globalScore} confidence={latest?.scoreMeta?.confidence || 'insufficient'} uncertainty={latest?.scoreMeta?.uncertaintyBand} />
      </section>
      <section className="report-meta-grid"><Coverage report={report} /><div className="report-meta-note"><span className="report-mono">DAY · {dateLabel(report?.window?.end)}</span><strong>{latest ? `${latest.scoreMeta?.observedMetricCount || 0} signals captured today` : 'No signals captured today'}</strong><p>{latest ? `${report?.window?.timezone || 'Asia/Kolkata'} day boundary. Zero is shown only when a source recorded zero.` : `Most recent observed day: ${dateLabel(latestObserved?.date)}. Today remains unknown until logged.`}</p></div></section>
      <section className="report-observation"><div className="report-observation__mark">01</div><div><span className="report-mono">ONE DESCRIPTIVE OBSERVATION</span><h2>{observation.title}</h2><p>{observation.text}</p></div></section>
      <section className="report-panel"><div className="report-panel__head"><div><span className="report-mono">7-DAY CONTEXT</span><h2>Pulse, not a verdict</h2></div><span className="report-panel__hint">Missing days stay visible</span></div><PulseStrip timeline={timeline} endDate={report?.window?.end} /><div className="report-panel__legend"><span><i className="is-observed" /> Observed day</span><span><i className="is-missing" /> Missing day</span></div></section>
      <section className="report-panel"><div className="report-panel__head"><div><span className="report-mono">ALL CAPTURED SIGNALS</span><h2>What was logged</h2></div><span className="report-panel__hint">{metrics.length} metrics in index</span></div><div className="report-metric-groups">{grouped.map((group) => <div className="report-metric-group" key={group.domain}><h3>{DOMAIN_LABELS[group.domain]}</h3>{group.metrics.map((metric) => <MetricRow key={metric.metricId} metric={metric} />)}</div>)}</div></section>
      <section className="report-upgrade"><div><span className="report-mono">NEXT LAYER · CORE</span><h2>See the week behind today.</h2><p>Core adds a seven-day comparison, strongest and weakest days, and a reset loop without hiding your raw signals.</p></div><Link to="/account?section=subscription">View Core</Link></section>
    </>
  );
}

function weeklyWindow(timeline) {
  const current = timeline.slice(-7);
  const prior = timeline.slice(-14, -7);
  const average = (days) => {
    const values = days.map((day) => day.globalScore).filter((value) => value != null).map(Number);
    return values.length ? values.reduce((sum, value) => sum + value, 0) / values.length : null;
  };
  const best = current.filter((day) => day.globalScore != null).sort((a, b) => b.globalScore - a.globalScore)[0];
  const worst = current.filter((day) => day.globalScore != null).sort((a, b) => a.globalScore - b.globalScore)[0];
  return { current, prior, currentAvg: average(current), priorAvg: average(prior), best, worst };
}

function domainAverage(days, domain) {
  const values = days.map((day) => day.systemScores?.[domain]).filter((value) => value != null).map(Number);
  return values.length ? values.reduce((sum, value) => sum + value, 0) / values.length : null;
}

function CoreChanges({ current, prior }) {
  const hasPrior = prior.some((day) => day.globalScore != null);
  return <section className="report-panel report-changes"><div className="report-panel__head"><div><span className="report-mono">WHAT CHANGED</span><h2>Week-over-week, without guessing</h2></div><span className="report-panel__hint">{hasPrior ? 'Observed days only' : 'Prior week required'}</span></div>{hasPrior ? <div className="report-change-grid">{DOMAIN_ORDER.map((domain) => { const now = domainAverage(current, domain); const before = domainAverage(prior, domain); const delta = now != null && before != null ? now - before : null; return <div className="report-change-card" key={domain}><span>{DOMAIN_LABELS[domain]}</span><strong>{delta == null ? '—' : `${delta >= 0 ? '+' : ''}${Math.round(delta)}`}</strong><small>{now == null ? 'No current observation' : `Now ${Math.round(now)} · prior ${before == null ? '—' : Math.round(before)}`}</small></div>; })}</div> : <div className="report-empty">The weekly review is honest until the prior window is loaded. Keep logging; no change is inferred from a missing comparison.</div>}</section>;
}

function CoreReview({ report, timeline }) {
  const week = weeklyWindow(timeline);
  const [commitments, setCommitments] = useState(['Protect one recovery window', 'Complete one important focus block', 'Close the loop on one habit']);
  const delta = week.currentAvg != null && week.priorAvg != null ? week.currentAvg - week.priorAvg : null;
  return (
    <>
      <section className="report-hero report-hero--core"><div><div className="report-eyebrow">{TIER_COPY.core.eyebrow}</div><h1>{TIER_COPY.core.title}</h1><p>{TIER_COPY.core.subtitle}</p></div><ScoreMark value={week.currentAvg} confidence={report?.scoreConfidence} uncertainty={report?.uncertaintyBand} /></section>
      <section className="report-meta-grid"><Coverage report={report} /><div className="report-compare"><span className="report-mono">THIS WEEK VS PRIOR WEEK</span><strong>{delta == null ? 'Not enough overlap' : `${delta >= 0 ? '+' : ''}${Math.round(delta)} points`}</strong><p>{week.currentAvg == null ? 'Keep logging for a comparable review.' : `Current ${Math.round(week.currentAvg)} · prior ${week.priorAvg == null ? '—' : Math.round(week.priorAvg)}`}</p></div></section>
      <CoreChanges current={week.current} prior={week.prior} />
      <section className="report-panel"><div className="report-panel__head"><div><span className="report-mono">THE WEEKLY LOOP</span><h2>Strongest and difficult days</h2></div></div><div className="report-day-pair"><div><span>Strongest observed day</span><strong>{dateLabel(week.best?.date)}</strong><p>{week.best?.globalScore == null ? 'No scored day yet.' : `${Math.round(week.best.globalScore)}/100 · ${week.best.scoreMeta?.observedMetricCount || 0} signals`}</p></div><div><span>Lowest observed day</span><strong>{dateLabel(week.worst?.date)}</strong><p>{week.worst?.globalScore == null ? 'No scored day yet.' : `${Math.round(week.worst.globalScore)}/100 · ${week.worst.scoreMeta?.observedMetricCount || 0} signals`}</p></div></div><PulseStrip timeline={timeline} endDate={report?.window?.end} /></section>
      <section className="report-panel"><div className="report-panel__head"><div><span className="report-mono">DOMAIN REVIEW</span><h2>Every domain, same denominator</h2></div></div><DomainGrid report={report} timeline={week.current} /></section>
      <section className="report-panel report-commitments"><div className="report-panel__head"><div><span className="report-mono">RESET LOOP</span><h2>Three reversible commitments</h2></div><span className="report-panel__hint">Edit before you keep</span></div>{commitments.map((item, index) => <label key={index}><span>{index + 1}</span><input value={item} onChange={(event) => setCommitments((items) => items.map((value, i) => i === index ? event.target.value : value))} /></label>)}</section>
      <section className="report-upgrade"><div><span className="report-mono">NEXT LAYER · PRO</span><h2>See what separates strong days.</h2><p>Pro opens longer windows, ranked signals, method notes, and evidence attached to every finding.</p></div><Link to="/account?section=subscription">View Pro</Link></section>
    </>
  );
}

function Finding({ finding, expanded, onToggle }) {
  return (
    <article className={`report-finding ${expanded ? 'is-expanded' : ''}`}>
      <button type="button" onClick={onToggle} aria-expanded={expanded}><span className="report-finding__index">{finding.id?.replace('finding_', '').replace(/_/g, ' ')}</span><strong>{finding.title}</strong><span className="report-finding__confidence">{finding.confidence} · n={finding.sampleSize}</span><span>{expanded ? '−' : '+'}</span></button>
      <div className="report-finding__claim">{finding.claim}</div>
      {expanded && <div className="report-finding__detail"><div><span>Effect</span><strong>{finding.effect?.value == null ? 'Not tested' : `${finding.effect.value} ${finding.effect.unit}`}</strong></div><div><span>Method</span><strong>{finding.method}</strong></div><div><span>Source records</span><strong>{finding.supportingRecordIds?.length ? finding.supportingRecordIds.join(' · ') : 'No source-day links available for this finding'}</strong></div><div><span>Limits</span><strong>{(finding.limitations || []).join(' ')}</strong></div></div>}
    </article>
  );
}

function ProDossier({ report, timeline, tier }) {
  const [expanded, setExpanded] = useState(null);
  const [domainFilter, setDomainFilter] = useState('all');
  const [confidenceFilter, setConfidenceFilter] = useState('all');
  const [directionFilter, setDirectionFilter] = useState('all');
  const [minSample, setMinSample] = useState('0');
  const [metricSearch, setMetricSearch] = useState('');
  const [experiment, setExperiment] = useState({ intervention: '', success: 'Life Score', review: '' });
  const metrics = report?.metrics || [];
  const findings = report?.findings || [];
  const filteredFindings = useMemo(() => findings.filter((finding) => {
    const domainMatch = domainFilter === 'all' || finding.domain === domainFilter;
    const confidenceMatch = confidenceFilter === 'all' || finding.confidence === confidenceFilter;
    const directionMatch = directionFilter === 'all' || finding.effect?.direction === directionFilter;
    const sampleMatch = Number(finding.sampleSize || 0) >= Number(minSample);
    return domainMatch && confidenceMatch && directionMatch && sampleMatch;
  }), [confidenceFilter, directionFilter, domainFilter, findings, minSample]);
  const filteredMetrics = useMemo(() => metrics.filter((metric) => `${metric.displayName} ${metric.metricId}`.toLowerCase().includes(metricSearch.toLowerCase())), [metricSearch, metrics]);
  return (
    <>
      <section className="report-hero report-hero--pro"><div><div className="report-eyebrow">{TIER_COPY.pro.eyebrow}</div><h1>{TIER_COPY.pro.title}</h1><p>{TIER_COPY.pro.subtitle}</p><div className="report-chip-row"><span>{report?.window?.label || 'Selected window'}</span><span>{report?.calculationVersion}</span><span>{report?.scoreConfidence || 'insufficient'} confidence</span></div></div><ScoreMark value={report?.globalScore} confidence={report?.scoreConfidence} uncertainty={report?.uncertaintyBand} /></section>
      <section className="report-meta-grid"><Coverage report={report} /><div className="report-meta-note"><span className="report-mono">REPORT RUN</span><strong>{report?.contractVersion || 'report-contract-v1'}</strong><p>Every finding below carries a method, sample, limitations, and stable source references.</p></div></section>
      <section className="report-panel"><div className="report-panel__head"><div><span className="report-mono">SYSTEM BALANCE</span><h2>The five dimensions, with coverage</h2></div></div><DomainGrid report={report} timeline={timeline} /></section>
      <section className="report-panel"><div className="report-panel__head"><div><span className="report-mono">RANKED FINDINGS</span><h2>Signals worth inspecting</h2></div><span className="report-panel__hint">{filteredFindings.length} of {findings.length} findings</span></div><div className="report-filters"><label>Domain<select value={domainFilter} onChange={(event) => setDomainFilter(event.target.value)}><option value="all">All domains</option>{DOMAIN_ORDER.map((domain) => <option value={domain} key={domain}>{DOMAIN_LABELS[domain]}</option>)}</select></label><label>Confidence<select value={confidenceFilter} onChange={(event) => setConfidenceFilter(event.target.value)}><option value="all">All confidence</option><option value="insufficient">Insufficient</option><option value="exploratory">Exploratory</option><option value="moderate">Moderate</option><option value="strong">Strong</option></select></label><label>Direction<select value={directionFilter} onChange={(event) => setDirectionFilter(event.target.value)}><option value="all">Any direction</option><option value="positive">Positive</option><option value="negative">Negative</option><option value="mixed">Mixed</option></select></label><label>Minimum n<select value={minSample} onChange={(event) => setMinSample(event.target.value)}><option value="0">Any sample</option><option value="5">n ≥ 5</option><option value="7">n ≥ 7</option><option value="14">n ≥ 14</option></select></label></div>{filteredFindings.length ? <div className="report-findings">{filteredFindings.map((finding, index) => <Finding key={finding.id || index} finding={finding} expanded={expanded === (finding.id || index)} onToggle={() => setExpanded(expanded === (finding.id || index) ? null : (finding.id || index))} />)}</div> : <div className="report-empty">No finding meets the current filters and sample thresholds. The correct result is not to invent a pattern.</div>}</section>
      <section className="report-panel"><div className="report-panel__head"><div><span className="report-mono">METRIC INDEX</span><h2>Nothing disappears behind cards</h2></div><span className="report-panel__hint">{filteredMetrics.length} of {metrics.length} metrics</span></div><input className="report-metric-search" value={metricSearch} onChange={(event) => setMetricSearch(event.target.value)} placeholder="Search metric name or stable ID" aria-label="Search metric index" /><div className="report-metric-index">{filteredMetrics.map((metric) => <MetricRow key={metric.metricId} metric={metric} compact />)}</div></section>
      <section className="report-panel report-experiment"><div className="report-panel__head"><div><span className="report-mono">ONE REVERSIBLE EXPERIMENT</span><h2>Turn a signal into a test</h2></div><span className="report-panel__hint">Not proof until reviewed</span></div><label>Intervention<input value={experiment.intervention} onChange={(event) => setExperiment({ ...experiment, intervention: event.target.value })} placeholder="For example: start one focus block before noon" /></label><label>Success metric<select value={experiment.success} onChange={(event) => setExperiment({ ...experiment, success: event.target.value })}><option>Life Score</option><option>Focus minutes</option><option>Sleep duration</option><option>Mood</option></select></label><label>Review date<input type="date" value={experiment.review} onChange={(event) => setExperiment({ ...experiment, review: event.target.value })} /></label><button type="button" className="report-primary-action" onClick={() => setExperiment({ ...experiment, intervention: experiment.intervention || 'Untitled test' })}>Save draft experiment</button><div className="report-empty">A draft records an intervention, success metric, review date, and confounders. It does not change your Life Score.</div></section>
      <section className="report-upgrade report-upgrade--elite"><div><span className="report-mono">NEXT LAYER · ELITE</span><h2>Interrogate the signal.</h2><p>Elite adds a question builder, alternative explanations, counter-evidence, scenarios, and experiments.</p></div><Link to="/account?section=subscription">View Elite</Link></section>
    </>
  );
}

function ReportFooter({ report, tier }) {
  const nextTier = tier === 'explore' ? 'Core' : tier === 'core' ? 'Pro' : tier === 'pro' ? 'Elite' : null;
  const nextDescription = tier === 'explore'
    ? 'A weekly comparison adds context without hiding the raw signal.'
    : tier === 'core'
      ? 'Longer windows and ranked signals show what repeats.'
      : tier === 'pro'
        ? 'Questions, alternatives, scenarios, and experiments deepen the readout.'
        : 'This room stays descriptive: evidence first, uncertainty visible.';
  return (
    <footer className="report-footer">
      <div className="report-footer__lead">
        <span className="report-mono">{tier.toUpperCase()} · EVIDENCE TRAIL</span>
        <h2>{nextTier ? `Next: ${nextTier} when you need more context.` : 'Keep the signal honest.'}</h2>
        <p>{nextTier ? nextDescription : 'Your score is an operating read of logged inputs, not a diagnosis or a verdict. Revisit the source records before turning a pattern into a decision.'}</p>
      </div>
      <div className="report-footer__meta" aria-label="Report provenance summary">
        <div><span>MODEL</span><strong>{report?.calculationVersion || '—'}</strong></div>
        <div><span>WINDOW</span><strong>{report?.window?.label || '—'}</strong></div>
        <div><span>OBSERVED</span><strong>{report?.coverage?.observedDays ?? '—'} days</strong></div>
        <div><span>CONFIDENCE</span><strong>{report?.scoreConfidence || 'Insufficient data'}</strong></div>
      </div>
    </footer>
  );
}

function EliteRoom({ report, timeline, reportGen }) {
  const [chapter, setChapter] = useState('Situation');
  const [outcome, setOutcome] = useState('Life Score');
  const [signal, setSignal] = useState('Sleep duration');
  const [experiment, setExperiment] = useState({ intervention: '', success: 'Life Score', review: '' });
  const chapters = ['Situation', 'Systems', 'Patterns', 'Investigate', 'Forecast', 'Action'];
  const findings = report?.findings || [];
  const graph = findings.filter((finding) => finding.claimType === 'associational').slice(0, 6);
  return (
    <>
      <div className="elite-room"><aside className="elite-room__rail"><div className="report-eyebrow">{TIER_COPY.elite.eyebrow}</div>{chapters.map((item, index) => <button type="button" className={chapter === item ? 'is-active' : ''} key={item} onClick={() => setChapter(item)}><span className="elite-room__rail-index">{String(index + 1).padStart(2, '0')}</span><span>{item}</span></button>)}<div className="elite-room__rail-foot"><span className="report-mono">WINDOW</span><strong>{report?.window?.label}</strong><span className="report-mono">VERSION</span><strong>{report?.calculationVersion}</strong><span className="report-mono">DEEP REPORTS</span><strong>{reportGen?.deep_report?.remaining == null ? 'Status unavailable' : `${reportGen.deep_report.remaining} remaining this month`}</strong></div></aside><main className="elite-room__main"><header className="elite-room__head"><div><span className="report-mono">{chapter.toUpperCase()}</span><h1>{TIER_COPY.elite.title}</h1><p>{TIER_COPY.elite.subtitle}</p></div><ScoreMark value={report?.globalScore} confidence={report?.scoreConfidence} uncertainty={report?.uncertaintyBand} /></header>{chapter === 'Situation' && <><Coverage report={report} /><DomainGrid report={report} timeline={timeline} /></>}{chapter === 'Systems' && <><div className="elite-canvas-title"><span>SELECTABLE SYSTEM MAP</span><strong>Choose a domain to inspect its observed inputs.</strong></div><DomainGrid report={report} timeline={timeline} /><div className="elite-evidence-rail"><span className="report-mono">SOURCE-DAY DRILLDOWN</span>{timeline.slice(-7).map((day) => <div key={day.date}><strong>{dateLabel(day.date)}</strong><span>{day.scoreMeta?.sourceRecordIds?.join(' · ') || 'No source record'}</span></div>)}</div></>}{chapter === 'Patterns' && <div className="elite-graph">{graph.length ? graph.map((finding) => <div className="elite-graph__node" key={finding.id}><span>{finding.effect?.direction || 'mixed'}</span><strong>{finding.title}</strong><p>{finding.claim}</p><small>{finding.effect?.value} · n={finding.sampleSize} · {finding.confidence}</small></div>) : <div className="report-empty">The signal graph stays empty until enough paired observations exist.</div>}</div>}{chapter === 'Investigate' && <div className="elite-investigate"><div className="elite-question"><span className="report-mono">QUESTION BUILDER</span><h2>What do you want to compare?</h2><label>Outcome<select value={outcome} onChange={(event) => setOutcome(event.target.value)}><option>Life Score</option><option>Discipline</option><option>Mood</option><option>Focus</option></select></label><label>Signal<select value={signal} onChange={(event) => setSignal(event.target.value)}><option>Sleep duration</option><option>Focused minutes</option><option>Steps</option><option>Habit completion</option></select></label><div className="elite-question__preview">When <strong>{signal.toLowerCase()}</strong> changes, compare observed <strong>{outcome}</strong> across the selected window. This is an association question, not a causal claim.</div></div><div className="elite-alternatives"><span className="report-mono">ALTERNATIVE EXPLANATIONS</span><h2>What else could be in the room?</h2><label><input type="checkbox" defaultChecked /> Weekday differences</label><label><input type="checkbox" /> Travel or schedule disruption</label><label><input type="checkbox" /> Deadlines and workload</label><label><input type="checkbox" /> Illness or recovery context</label><div className="report-empty">Only variables present in the data can be tested. Unobserved context remains a limitation.</div></div></div>}{chapter === 'Forecast' && <div className="elite-forecast"><span className="report-mono">SCENARIO VIEW</span><h2>Range with assumptions, not certainty.</h2><p>Current trend labels are descriptive. A numeric forecast should only appear after a scenario supplies assumptions, horizon, and coverage.</p><div className="elite-forecast__assumptions"><strong>Assumptions</strong><span>Recent observed window remains representative</span><span>No major schedule or health disruption is added</span><span>Missing days remain unknown, not zero</span></div><div className="report-empty">{report?.forecast ? JSON.stringify(report.forecast) : 'No numeric forecast is presented for this run.'}</div></div>}{chapter === 'Action' && <div className="elite-experiment"><span className="report-mono">EXPERIMENT BUILDER</span><h2>Turn one observation into a reversible test.</h2><label>Intervention<input value={experiment.intervention} onChange={(event) => setExperiment({ ...experiment, intervention: event.target.value })} placeholder="For example: start one focus block before noon" /></label><label>Success metric<select value={experiment.success} onChange={(event) => setExperiment({ ...experiment, success: event.target.value })}><option>Life Score</option><option>Focus minutes</option><option>Sleep duration</option><option>Mood</option></select></label><label>Review date<input type="date" value={experiment.review} onChange={(event) => setExperiment({ ...experiment, review: event.target.value })} /></label><button type="button" className="report-primary-action" onClick={() => setExperiment({ ...experiment, intervention: experiment.intervention || 'Untitled test' })}>Save draft experiment</button><div className="report-empty">Drafts stay reversible and are not treated as proof until the review date.</div></div>}</main></div>
      <section className="report-panel report-method"><div className="report-panel__head"><div><span className="report-mono">METHOD</span><h2>What this score means</h2></div></div><p>{report?.methodology}</p>{(report?.limitations || []).map((item) => <p key={item} className="report-method__limit">{item}</p>)}</section>
    </>
  );
}

export default function ReportWorkspace({ report, reportGen, tier, loading, error, onRetry }) {
  const canonical = report?.canonicalReport || {};
  const timeline = report?.lhs?.timeline || [];
  const copy = TIER_COPY[tier] || TIER_COPY.explore;
  if (loading) return <div className="report-loading"><div className="report-loading__line" /><div className="report-loading__line report-loading__line--short" /><div className="report-loading__block" /><div className="report-loading__block" /></div>;
  if (error) return <div className="report-error"><h2>Report could not be loaded.</h2><p>{error}</p><button type="button" onClick={onRetry}>Try again</button></div>;
  if (!report) return <div className="report-empty"><h2>{copy.title}</h2><p>There is no report run yet. Start logging and the report will fill from source records.</p></div>;
  return <div className={`report-workspace report-workspace--${tier}`}><header className="report-page-head"><div><span className="report-eyebrow">{copy.eyebrow}</span><div className="report-page-head__window">{canonical.window?.label || report.meta?.start} · {canonical.window?.timezone || 'Asia/Kolkata'}</div></div><div className="report-page-head__status"><span className="report-mono">RUN {canonical.generatedAt ? new Date(canonical.generatedAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) : '—'}</span><span className="report-mono">{canonical.calculationVersion || report.meta?.calculationVersion || 'lhs-v2'}</span></div></header>{tier === 'explore' && <DailySignal report={{ ...canonical, score: report.lhs?.globalScore, scoreConfidence: report.lhs?.scoreMeta?.confidence, window: canonical.window, coverage: canonical.coverage, metrics: canonical.metrics }} timeline={timeline} />}{tier === 'core' && <CoreReview report={{ ...canonical, scoreConfidence: report.lhs?.scoreMeta?.confidence }} timeline={timeline} />}{tier === 'pro' && <ProDossier report={{ ...canonical, globalScore: report.lhs?.globalScore, scoreConfidence: report.lhs?.scoreMeta?.confidence }} timeline={timeline} tier={tier} />}{tier === 'elite' && <EliteRoom report={{ ...canonical, globalScore: report.lhs?.globalScore, scoreConfidence: report.lhs?.scoreMeta?.confidence }} timeline={timeline} reportGen={reportGen} />}<ReportFooter report={canonical} tier={tier} /></div>;
}
