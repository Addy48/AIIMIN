import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { useAuth } from '../hooks/useAuth';
import { apiGet } from '../utils/api';
import PDFReportGenerator from '../components/PDFReportGenerator';

const RANGE_PRESETS = [
  { id: '7', label: '7 days', days: 7 },
  { id: '15', label: '15 days', days: 15 },
  { id: '30', label: '30 days', days: 30 },
  { id: '90', label: '90 days', days: 90 },
  { id: 'ytd', label: 'Year to date', days: null },
  { id: 'custom', label: 'Custom range', days: null },
];

function ytdStart() {
  const d = new Date();
  return `${d.getFullYear()}-01-01`;
}

function todayKey() {
  return new Date().toISOString().slice(0, 10);
}

function daysBetween(start, end) {
  const a = new Date(`${start}T00:00:00Z`).getTime();
  const b = new Date(`${end}T00:00:00Z`).getTime();
  return Math.max(1, Math.round((b - a) / 86400000) + 1);
}

const card = {
  padding: '24px',
  borderRadius: '20px',
  background: 'var(--bg-card)',
  border: '1px solid var(--border)',
};

export default function Reports() {
  const { user } = useAuth();
  const [preset, setPreset] = useState('30');
  const [customStart, setCustomStart] = useState(() => {
    const d = new Date(Date.now() - 29 * 86400000);
    return d.toISOString().slice(0, 10);
  });
  const [customEnd, setCustomEnd] = useState(todayKey);
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const query = useMemo(() => {
    const end = todayKey();
    if (preset === 'ytd') {
      const start = ytdStart();
      return { days: daysBetween(start, end), start, end, label: `YTD ${start} → ${end}` };
    }
    if (preset === 'custom') {
      const start = customStart <= customEnd ? customStart : customEnd;
      const endD = customStart <= customEnd ? customEnd : customStart;
      return { days: daysBetween(start, endD), start, end: endD, label: `${start} → ${endD}` };
    }
    const days = RANGE_PRESETS.find((p) => p.id === preset)?.days || 30;
    return { days, start: null, end: null, label: `Last ${days} days` };
  }, [preset, customStart, customEnd]);

  useEffect(() => {
    if (!user || user.isGuest) {
      setLoading(false);
      return undefined;
    }
    let cancelled = false;
    const run = async () => {
      setLoading(true);
      setError('');
      try {
        const params = new URLSearchParams({ days: String(query.days) });
        if (query.start) params.set('start', query.start);
        if (query.end) params.set('end', query.end);
        const data = await apiGet(`/intelligence/report?${params.toString()}`);
        if (!cancelled) setReport(data);
      } catch (err) {
        if (!cancelled) {
          setError(err.message || 'Failed to load report');
          setReport(null);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    run();
    return () => { cancelled = true; };
  }, [user, query.days, query.start, query.end]);

  const timeline = report?.meta?.timeline || [];
  const lhs = report?.lhs || null;
  const scores = lhs?.systemScores || report?.lifeHealthRadar || {};

  const chartData = useMemo(() => (
    [...timeline].map((item) => ({
      ...item,
      shortDate: String(item.date || '').slice(5),
      score: (item.gym_done ? 1 : 0)
        + (item.learning_done ? 1 : 0)
        + (item.journal ? 1 : 0)
        + (Number(item.mood) >= 6 ? 1 : 0),
      lhs: item.globalScore != null ? Math.round(item.globalScore) : null,
    }))
  ), [timeline]);

  const kpis = useMemo(() => {
    const n = timeline.length || 1;
    const sleepVals = timeline.map((t) => Number(t.sleep_hours) || 0).filter((v) => v > 0);
    const moodVals = timeline.map((t) => Number(t.mood) || 0).filter((v) => v > 0);
    const gymDays = timeline.filter((t) => t.gym_done).length;
    const learnDays = timeline.filter((t) => t.learning_done).length;
    const journalDays = timeline.filter((t) => t.journal).length;
    const spend = timeline.reduce((s, t) => s + (Number(t.daily_spend) || 0), 0);
    const focusMin = timeline.reduce((s, t) => s + (Number(t.focus_minutes) || 0), 0);
    return {
      daysWithData: timeline.length,
      avgSleep: sleepVals.length ? (sleepVals.reduce((a, b) => a + b, 0) / sleepVals.length).toFixed(1) : '—',
      avgMood: moodVals.length ? (moodVals.reduce((a, b) => a + b, 0) / moodVals.length).toFixed(1) : '—',
      gymPct: Math.round((gymDays / n) * 100),
      learnPct: Math.round((learnDays / n) * 100),
      journalPct: Math.round((journalDays / n) * 100),
      spend: Math.round(spend),
      focusHours: (focusMin / 60).toFixed(1),
      global: Math.round(lhs?.globalScore || 0),
    };
  }, [timeline, lhs]);

  const pieData = [
    { name: 'Gym days', value: timeline.filter((t) => t.gym_done).length, color: 'var(--color-accent)' },
    { name: 'Learning', value: timeline.filter((t) => t.learning_done).length, color: '#10B981' },
    { name: 'Journal', value: timeline.filter((t) => t.journal).length, color: '#3B82F6' },
  ].filter((d) => d.value > 0);

  const best = report?.bestVsWorstDay?.bestDay;
  const worst = report?.bestVsWorstDay?.worstDay;
  const actions = report?.actionPlan || report?.executiveSummary?.recommendations || [];
  const drivers = report?.behaviorDrivers || [];

  if (!user) {
    return <div style={{ padding: 40, color: 'var(--color-text-3)' }}>Sign in to view reports.</div>;
  }

  return (
    <div style={{ paddingBottom: 100 }}>
      <div style={{ marginBottom: 28 }}>
        <div style={{
          fontSize: 10, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase',
          color: 'var(--color-text-3)', marginBottom: 8,
        }}>
          Reports · Real telemetry
        </div>
        <h1 style={{ font: 'var(--text-hero)', color: 'var(--color-text-1)', margin: 0, letterSpacing: '-0.02em' }}>
          Period report
        </h1>
        <p style={{ color: 'var(--color-text-2)', fontSize: 14, maxWidth: 640, marginTop: 12 }}>
          Wired to live logs, habits, focus, and money for the range you pick. Past ranges use past data — not the current week alone.
        </p>
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 16 }}>
        {RANGE_PRESETS.map((p) => (
          <button
            key={p.id}
            type="button"
            onClick={() => setPreset(p.id)}
            style={{
              padding: '8px 14px',
              borderRadius: 999,
              border: `1px solid ${preset === p.id ? 'var(--color-accent)' : 'var(--border)'}`,
              background: preset === p.id ? 'color-mix(in srgb, var(--color-accent) 14%, transparent)' : 'var(--bg-elevated)',
              color: 'var(--color-text-1)',
              fontSize: 12,
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            {p.label}
          </button>
        ))}
      </div>

      {preset === 'custom' && (
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 20 }}>
          <label style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: 12, color: 'var(--color-text-3)' }}>
            Start
            <input
              type="date"
              value={customStart}
              max={customEnd}
              onChange={(e) => setCustomStart(e.target.value)}
              style={{ padding: '10px 12px', borderRadius: 12, border: '1px solid var(--border)', background: 'var(--bg-elevated)', color: 'var(--color-text-1)' }}
            />
          </label>
          <label style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: 12, color: 'var(--color-text-3)' }}>
            End
            <input
              type="date"
              value={customEnd}
              min={customStart}
              max={todayKey()}
              onChange={(e) => setCustomEnd(e.target.value)}
              style={{ padding: '10px 12px', borderRadius: 12, border: '1px solid var(--border)', background: 'var(--bg-elevated)', color: 'var(--color-text-1)' }}
            />
          </label>
        </div>
      )}

      <p style={{ fontSize: 13, color: 'var(--color-text-3)', marginBottom: 24 }}>
        Window: <strong style={{ color: 'var(--color-text-1)' }}>{query.label}</strong>
        {report?.meta?.daysWithData != null && ` · ${report.meta.daysWithData} days with data`}
      </p>

      {loading && <div style={{ padding: 32, color: 'var(--color-text-3)' }}>Loading report for this period…</div>}
      {error && !loading && <div style={{ padding: 24, color: '#ef4444', border: '1px solid #ef4444', borderRadius: 16 }}>{error}</div>}

      {!loading && !error && (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 16, marginBottom: 28 }}>
            {[
              { label: 'LHS score', val: kpis.global, desc: 'Period average' },
              { label: 'Days logged', val: kpis.daysWithData, desc: 'With any signal' },
              { label: 'Avg sleep', val: `${kpis.avgSleep}h`, desc: 'Logged nights' },
              { label: 'Avg mood', val: kpis.avgMood, desc: 'When logged' },
              { label: 'Gym rate', val: `${kpis.gymPct}%`, desc: 'Of days in range' },
              { label: 'Focus hours', val: kpis.focusHours, desc: 'Pomodoro sum' },
              { label: 'Spend', val: `₹${kpis.spend.toLocaleString()}`, desc: 'Money out' },
              { label: 'Journal rate', val: `${kpis.journalPct}%`, desc: 'Of days in range' },
            ].map((stat, i) => (
              <motion.div key={stat.label} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }} style={card}>
                <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--color-text-3)', marginBottom: 6 }}>{stat.label}</div>
                <div style={{ fontSize: 26, fontWeight: 800, color: 'var(--color-text-1)' }}>{stat.val}</div>
                <div style={{ fontSize: 11, color: 'var(--color-accent)', marginTop: 6 }}>{stat.desc}</div>
              </motion.div>
            ))}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 2fr) minmax(0, 1fr)', gap: 20, marginBottom: 24 }}>
            <div style={{ ...card, padding: 28 }}>
              <h3 style={{ margin: '0 0 4px', fontSize: 16, color: 'var(--color-text-1)' }}>Daily discipline score</h3>
              <p style={{ margin: '0 0 16px', fontSize: 12, color: 'var(--color-text-3)' }}>Core signals (gym / learn / journal / mood) for this period.</p>
              <div style={{ height: 280 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData}>
                    <defs>
                      <linearGradient id="scoreGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="var(--color-accent)" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="var(--color-accent)" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                    <XAxis dataKey="shortDate" stroke="var(--color-text-3)" fontSize={11} tickLine={false} axisLine={false} />
                    <YAxis stroke="var(--color-text-3)" fontSize={11} tickLine={false} axisLine={false} />
                    <Tooltip contentStyle={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: 12 }} />
                    <Area type="monotone" dataKey="score" stroke="var(--color-accent)" strokeWidth={3} fill="url(#scoreGradient)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div style={{ ...card, padding: 28 }}>
              <h3 style={{ margin: '0 0 4px', fontSize: 16, color: 'var(--color-text-1)' }}>Activity mix</h3>
              <p style={{ margin: '0 0 16px', fontSize: 12, color: 'var(--color-text-3)' }}>Counts inside this window.</p>
              <div style={{ height: 180 }}>
                {pieData.length === 0 ? (
                  <div style={{ color: 'var(--color-text-3)', fontSize: 13, paddingTop: 48, textAlign: 'center' }}>No activity flagged in range.</div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={pieData} cx="50%" cy="50%" innerRadius={50} outerRadius={70} paddingAngle={4} dataKey="value" stroke="none">
                        {pieData.map((entry, index) => (
                          <Cell key={entry.name} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip contentStyle={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: 12 }} />
                    </PieChart>
                  </ResponsiveContainer>
                )}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 8 }}>
                {pieData.map((item) => (
                  <div key={item.name} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
                    <span style={{ color: 'var(--color-text-2)' }}>{item.name}</span>
                    <strong style={{ color: 'var(--color-text-1)' }}>{item.value}</strong>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Life domains from intelligence report */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 12, marginBottom: 24 }}>
            {['physical', 'cognitive', 'discipline', 'financial', 'emotional'].map((key) => (
              <div key={key} style={{ ...card, padding: 18 }}>
                <div style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--color-text-3)' }}>{key}</div>
                <div style={{ fontSize: 28, fontWeight: 800, color: 'var(--color-text-1)', marginTop: 6 }}>
                  {Math.round(Number(scores[key]) || 0)}
                </div>
              </div>
            ))}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 16, marginBottom: 24 }}>
            <div style={card}>
              <h3 style={{ margin: '0 0 12px', fontSize: 15 }}>Peak vs trough</h3>
              <p style={{ margin: 0, fontSize: 13, color: 'var(--color-text-2)', lineHeight: 1.5 }}>
                Best: <strong>{best?.date || '—'}</strong> ({Math.round(best?.globalScore || 0)})
                <br />
                Worst: <strong>{worst?.date || '—'}</strong> ({Math.round(worst?.globalScore || 0)})
              </p>
            </div>
            <div style={card}>
              <h3 style={{ margin: '0 0 12px', fontSize: 15 }}>Drivers</h3>
              <ul style={{ margin: 0, paddingLeft: 18, color: 'var(--color-text-2)', fontSize: 13, lineHeight: 1.55 }}>
                {(Array.isArray(drivers) ? drivers : []).slice(0, 4).map((d) => (
                  <li key={d.label || d.behaviorLabel}>{d.label || d.behaviorLabel}</li>
                ))}
                {!drivers?.length && <li>Not enough signal yet for this window.</li>}
              </ul>
            </div>
            <div style={card}>
              <h3 style={{ margin: '0 0 12px', fontSize: 15 }}>Action plan</h3>
              <ul style={{ margin: 0, paddingLeft: 18, color: 'var(--color-text-2)', fontSize: 13, lineHeight: 1.55 }}>
                {(Array.isArray(actions) ? actions : []).slice(0, 5).map((a) => (
                  <li key={typeof a === 'string' ? a : a?.text || JSON.stringify(a)}>
                    {typeof a === 'string' ? a : (a?.text || a?.summary || 'Review')}
                  </li>
                ))}
                {!actions?.length && <li>Keep logging — plan fills as data densifies.</li>}
              </ul>
            </div>
          </div>

          <div style={{ marginBottom: 12 }}>
            <h3 style={{ margin: '0 0 12px', fontSize: 16, color: 'var(--color-text-1)' }}>PDF export</h3>
            <PDFReportGenerator
              user={user}
              rangeLabel={query.label}
              startDate={query.start || report?.meta?.start}
              endDate={query.end || report?.meta?.end}
              days={query.days}
            />
          </div>
        </>
      )}
    </div>
  );
}
