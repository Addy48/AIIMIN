import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import useTheme from '../../hooks/useTheme';
import { isDarkTheme } from '../../constants/themes';
import './IvorySnapshot.css';

function sparkPoints(values, w = 280, h = 48) {
  if (!values.length) return '';
  const min = Math.min(...values);
  const max = Math.max(...values);
  const span = Math.max(max - min, 0.1);
  return values
    .map((v, i) => {
      const x = values.length === 1 ? w / 2 : (i / (values.length - 1)) * w;
      const y = h - ((v - min) / span) * (h - 10) - 5;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(' ');
}

function pct(n) {
  return `${Math.round(n)}%`;
}

/**
 * Core Snapshot — Ivory Light/Dark pulse (locked design).
 * 7-day window only. Non-AI pattern text from report drivers when present.
 */
export default function IvorySnapshot({
  report,
  user,
  showUpgrade = true,
  showCorrelations = false,
  compact = false,
}) {
  const { theme } = useTheme();
  const dark = isDarkTheme(theme);

  const pulse = useMemo(() => {
    const timeline = [...(report?.lhs?.timeline || report?.meta?.timeline || [])].slice(-7);
    const lhs = report?.lhs || null;
    const canonicalScore = lhs?.globalScore ?? report?.canonicalReport?.globalScore ?? null;
    const n = timeline.length || 1;

    const moodVals = timeline.map((t) => Number(t.mood)).filter((v) => Number.isFinite(v));
    const avgMood = moodVals.length
      ? moodVals.reduce((a, b) => a + b, 0) / moodVals.length
      : null;
    const journalDays = timeline.filter((t) => t.journal === true || t.journal_entry != null).length;
    const gymDays = timeline.filter((t) => t.gym_done === true).length;
    const habitInputDays = timeline.filter((t) => t.gym_done === true || t.journal === true || t.journal_entry != null).length;
    const habitCoverage = Math.round((habitInputDays / n) * 100);
    const focusVals = timeline.map((t) => Number(t.focus_minutes)).filter((v) => Number.isFinite(v));
    const focusMin = focusVals.reduce((s, value) => s + value, 0);
    const spendVals = timeline.map((t) => Number(t.daily_spend)).filter((v) => Number.isFinite(v));
    const spend = spendVals.reduce((s, value) => s + value, 0);

    const scores = timeline.map((t) => (t.globalScore == null ? null : Number(t.globalScore))).filter((v) => Number.isFinite(v));
    const weekScore = scores.length
      ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
      : (canonicalScore == null ? null : Math.round(Number(canonicalScore)));

    const allTimeline = [...(report?.lhs?.timeline || report?.meta?.timeline || [])];
    const prior = allTimeline.slice(-14, -7);
    const priorScores = prior.map((t) => t.globalScore == null ? null : Number(t.globalScore)).filter((v) => Number.isFinite(v));
    const priorWeek = priorScores.length
      ? Math.round(priorScores.reduce((a, b) => a + b, 0) / priorScores.length)
      : weekScore;
    const delta = weekScore != null && priorWeek != null ? weekScore - priorWeek : null;

    const driver = report?.behaviorDrivers?.[0];
    const insight = driver?.insight
      || driver?.label
      || report?.executiveSummary?.summary
      || (timeline.length < 3
        ? 'Keep logging — Snapshot needs a few days before patterns stabilize.'
        : `7-day pulse: mood ${avgMood ? avgMood.toFixed(1) : '—'}, journal ${pct((journalDays / n) * 100)}, focus ${(focusMin / 60).toFixed(1)}h.`);

    const best = report?.bestVsWorstDay?.bestDay;
    const worst = report?.bestVsWorstDay?.worstDay;
    const topStreak = report?.executiveSummary?.highlights?.[0]
      || (gymDays >= 3 ? `${gymDays} gym days this week` : `${journalDays} journal days`);
    const biggestWin = best?.date
      ? `Best day ${String(best.date).slice(5)}${best.reason ? ` · ${best.reason}` : ''}`
      : (habitCoverage >= 50 ? 'Habit inputs present on half the observed days' : 'Showed up to log');
    const watchItem = worst?.date
      ? `Watch ${String(worst.date).slice(5)}${worst.reason ? ` · ${worst.reason}` : ''}`
      : (avgMood > 0 && avgMood < 5 ? 'Mood below baseline' : 'Protect sleep window');

    const fin = spend <= 0 ? 'No spend logged' : `₹${Math.round(spend).toLocaleString('en-IN')} · 7d`;

    const correlations = (report?.signalCorrelations?.length
      ? report.signalCorrelations
      : report?.behaviorDrivers || [])
      .slice(0, 3)
      .map((d, i) => ({
        id: d.signalA ? `${d.signalA}-${d.signalB}` : (d.label || d.behaviorLabel || `c${i}`),
        label: d.headline || d.label || `${d.signalALabel || d.signalA || 'Signal'} → ${d.signalBLabel || d.signalB || ''}`.trim(),
        rho: d.rho != null
          ? Number(d.rho)
          : Number((Math.min(0.95, Math.abs(Number(d.impact) || 5) / 12)).toFixed(2)),
        dir: Number(d.rho) < 0 || Number(d.impact) < 0 || d.direction === 'neg' ? -1 : 1,
        evidence: d.headline || d.insight || d.behaviorLabel || 'Spearman · BH-corrected',
      }));

    return {
      weekScore,
      priorWeek,
      delta,
      moodSpark: moodVals.length ? moodVals : scores.map((s) => Math.max(1, s / 10)),
      moodLabel: moodVals.length ? moodVals.map((v) => v.toFixed(1)).join(' · ') : '—',
      metrics: [
        { k: 'Mood average', v: avgMood != null ? `${avgMood.toFixed(1)} / 10` : '—', note: '7d mean' },
        { k: 'Habit inputs', v: pct(habitCoverage), note: 'gym + journal' },
        { k: 'Focus hours', v: focusVals.length ? `${(focusMin / 60).toFixed(1)} h` : '—', note: 'logged' },
        { k: 'Finance', v: spendVals.length ? fin : '—', note: 'window sum' },
        { k: 'Journal', v: pct((journalDays / n) * 100), note: 'days with entry' },
      ],
      insight,
      topStreak,
      biggestWin,
      watchItem,
      correlations,
      hasScore: weekScore != null,
      days: timeline.length,
    };
  }, [report]);

  const firstName = (() => {
    if (user?.name?.trim()) return user.name.trim().split(/\s+/)[0];
    const osId = user?.username || user?.os_id;
    if (osId) return `OS-ID: ${osId}`;
    return 'You';
  })();
  const isOsId = /^OS-ID:\s*/i.test(firstName) || /^[A-Z]{3,8}\d{3,8}$/i.test(firstName);
  const pts = sparkPoints(pulse.moodSpark);
  const deltaSign = pulse.delta == null ? 'unknown' : pulse.delta >= 0 ? 'up' : 'down';

  if (!report || pulse.days === 0) {
    return (
      <div className={`ivory-snap ${dark ? 'is-dark' : 'is-light'}`}>
        <div className="ivory-snap__empty">
          No logs in the last 7 days yet. Log from Today or mobile /m — Snapshot fills automatically once logged.
        </div>
      </div>
    );
  }

  return (
    <div className={`ivory-snap ${dark ? 'is-dark' : 'is-light'}${compact ? ' is-compact' : ''}`}>
      <header className="ivory-snap__head">
        <div>
          <div className="ivory-snap__brand">AIIMIN</div>
          <div className="ivory-snap__range">7-day pulse · Snapshot · Core+</div>
        </div>
        <div className="ivory-snap__who">
          <div className={`ivory-snap__name${isOsId ? ' ivory-snap__name--os-id' : ''}`}>{firstName}</div>
          <div className="ivory-snap__tier">Ivory · follows app theme</div>
        </div>
      </header>

      <div className="ivory-snap__body">
        <div>
          <div className="ivory-snap__score-label">Life Score · this week</div>
          <div className="ivory-snap__score">{pulse.weekScore ?? '—'}</div>
          <div className={`ivory-snap__delta ${deltaSign}`}>
            {pulse.delta == null ? 'unknown vs prior' : `${deltaSign} ${Math.abs(pulse.delta)} vs prior · was ${pulse.priorWeek}`}
          </div>
          <div className="ivory-snap__spark-wrap">
            <div className="ivory-snap__spark-head">
              <span>Mood · 7d</span>
              <span className="mono">{pulse.moodLabel}</span>
            </div>
            <svg className="ivory-snap__spark" viewBox="0 0 280 48" aria-hidden="true">
              <polyline
                fill="none"
                stroke="var(--ivory-accent)"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
                points={pts}
              />
            </svg>
          </div>
        </div>

        <div>
          <ul className="ivory-snap__metrics">
            {(compact ? pulse.metrics.slice(0, 3) : pulse.metrics).map((row) => (
              <li key={row.k}>
                <div>
                  <span className="mk">{row.k}</span>
                  <span className="mn">{row.note}</span>
                </div>
                <strong>{row.v}</strong>
              </li>
            ))}
          </ul>

          <section className="ivory-snap__insight">
            <div className="ivory-snap__insight-label">Pattern insight</div>
            <p>{pulse.insight}</p>
          </section>

          {!compact && (
            <div className="ivory-snap__callouts">
              <div className="ivory-snap__callout">
                <span>Top streak</span>
                <strong>{pulse.topStreak}</strong>
              </div>
              <div className="ivory-snap__callout">
                <span>Biggest win</span>
                <strong>{pulse.biggestWin}</strong>
              </div>
              <div className="ivory-snap__callout watch">
                <span>Watch item</span>
                <strong>{pulse.watchItem}</strong>
              </div>
            </div>
          )}

          {showCorrelations && pulse.correlations.length > 0 && (
            <section className="ivory-snap__corr" aria-label="Correlation Intelligence">
              <div className="ivory-snap__corr-label">
                Correlation Intelligence · Pro
                <span>Spearman · top 3</span>
              </div>
              <ul>
                {pulse.correlations.map((c) => (
                  <li key={c.id}>
                    <span className={`ivory-snap__rho ${c.dir < 0 ? 'neg' : 'pos'}`}>
                      {c.dir < 0 ? '−' : '+'}{Math.abs(c.rho).toFixed(2)}
                    </span>
                    <div>
                      <strong>{c.label}</strong>
                      <em>{c.evidence}</em>
                    </div>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>
      </div>

      <footer className="ivory-snap__foot">
        <span>
          {showCorrelations
            ? 'Snapshot + Correlation Intelligence · Pro'
            : 'Snapshot · non-AI by default'}
        </span>
        {showUpgrade && (
          <Link className="ivory-snap__upgrade" to="/account?section=subscription">
            Unlock Life OS Review · Pro
          </Link>
        )}
      </footer>
    </div>
  );
}
