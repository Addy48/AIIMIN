import React, { useState, useEffect, useMemo } from 'react';
import { Brain, CalendarClock, FlaskConical, Target, Wallet, X } from 'lucide-react';
import { motion } from 'framer-motion';
import { apiGet } from '../../utils/api';
import { generateWeeklyInsight } from '../../services/aiService';
import { fetchOverviewWeekSignals } from '../../hooks/useOverviewWeekSignals';

function formatINR(amount) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(Number(amount) || 0);
}

/**
 * Monday Morning Insight — cross-sectional AI synthesis (implementation intentions, Gollwitzer).
 * Also surfaces on Saturday as week-end review when ?insight=true or Saturday flag.
 */
export default function MondayInsight({ user }) {
  const [insight, setInsight] = useState('');
  const [signals, setSignals] = useState(null);
  const [loading, setLoading] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  const latestMonday = useMemo(() => {
    const d = new Date();
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1);
    const monday = new Date(d.setDate(diff));
    return monday.toISOString().split('T')[0];
  }, []);

  const forceShow = useMemo(() => new URLSearchParams(window.location.search).get('insight') === 'true', []);

  const dayOfWeek = new Date().getDay();
  const isMonday = dayOfWeek === 1;
  const isSaturday = dayOfWeek === 6;
  const isSunday = dayOfWeek === 0;
  const isWeekendReview = isSaturday || isSunday;
  const showDay = isMonday || isWeekendReview || forceShow;

  useEffect(() => {
    if (localStorage.getItem('aiimin_dismissed_weekly_insight') === latestMonday) {
      setDismissed(true);
    }
  }, [latestMonday]);

  useEffect(() => {
    if (dismissed || !showDay) return;

    const cacheKey = isWeekendReview
      ? `aiimin_saturday_insight_v3_${latestMonday}`
      : `aiimin_weekly_insight_v3_${latestMonday}`;
    const signalKey = `${cacheKey}_signals`;
    // Drop legacy prompt-polluted caches from earlier keys
    try {
      localStorage.removeItem(`aiimin_saturday_insight_inr_${latestMonday}`);
      localStorage.removeItem(`aiimin_weekly_insight_inr_${latestMonday}`);
    } catch { /* ignore */ }
    const cached = localStorage.getItem(cacheKey);
    if (cached && !isPromptLeak(cached)) {
      setInsight(cached);
      try {
        setSignals(JSON.parse(localStorage.getItem(signalKey) || 'null'));
      } catch {
        setSignals(null);
      }
      setLoading(false);
      return;
    }
    if (cached) localStorage.removeItem(cacheKey);

    const loadInsight = async () => {
      setLoading(true);
      try {
        let habitsData = {};
        let habitCompletions = 0;
        let habitTarget = 0;
        let moodTrend = 'No mood logs this week';
        let financeData = { income: formatINR(0), expenses: formatINR(0), count: 0, period: 'last 7 days' };
        let expenseTotal = 0;
        let incomeTotal = 0;
        let labSessions = 0;
        let disciplineStreak = 0;
        let disciplineLine = null;

        if (user && !user.isGuest) {
          try {
            const signals = await fetchOverviewWeekSignals(user);
            habitsData = signals.habitsData;
            habitCompletions = signals.habitCompletions;
            habitTarget = signals.habitTarget;
            moodTrend = signals.moodTrend;
            expenseTotal = signals.finance.expenses;
            incomeTotal = signals.finance.income;
            financeData = {
              income: formatINR(incomeTotal),
              expenses: formatINR(expenseTotal),
              count: signals.finance.count,
              period: 'last 7 days',
            };
            labSessions = signals.labSessions;
            disciplineStreak = signals.disciplineStreak;
            disciplineLine = signals.disciplineLine;
          } catch {
            /* fall through to local below */
          }
        }

        if (!habitTarget) {
          const habitsList = JSON.parse(localStorage.getItem('aiimin_habits_v3') || '[]');
          const habitLogs = JSON.parse(localStorage.getItem('aiimin_habits_logs_v3') || '{}');
          habitTarget = habitsList.length * 7;
          const last7Days = [];
          for (let i = 0; i < 7; i++) {
            const d = new Date();
            d.setDate(d.getDate() - i);
            last7Days.push(d.toISOString().split('T')[0]);
          }
          habitsList.forEach((h) => {
            let count = 0;
            last7Days.forEach((date) => { if (habitLogs[date]?.[h.id]) count++; });
            habitCompletions += count;
            habitsData[h.name] = `${count}/7 days`;
          });
        }

        if (!disciplineLine && disciplineStreak === 0) {
          try {
            const disc = JSON.parse(localStorage.getItem('aiimin_discipline_v3') || 'null');
            if (disc?.streak != null) disciplineStreak = disc.streak;
          } catch { /* ignore */ }
        }

        const res = await generateWeeklyInsight({
          habits: habitsData,
          journal: { moodTrend },
          finance: financeData,
          lab: { sessions: labSessions },
          discipline: { streak: disciplineStreak },
        });

        const nextSignals = {
          habits: habitTarget ? `${habitCompletions}/${habitTarget}` : 'No habits',
          habitRate: habitTarget ? `${Math.round((habitCompletions / habitTarget) * 100)}%` : 'No target',
          mood: moodTrend,
          finance: `${formatINR(expenseTotal)} spent`,
          financeMeta: `${financeData.count} tx · ${formatINR(incomeTotal)} income`,
          lab: `${labSessions} sessions`,
          discipline: disciplineLine || `${disciplineStreak} day streak`,
        };

        let finalText = '';
        if (res && !isPromptLeak(res)) {
          const parsed = parseInsight(res);
          if (parsed.bullets.length >= 2) {
            finalText = [
              ...parsed.bullets.map((b) => `- ${b}`),
              `Next move: ${parsed.nextMove || 'Pick one metric to improve before tomorrow night.'}`,
            ].join('\n');
          }
        }
        if (!finalText) {
          finalText = buildLocalInsight({
            habitCompletions,
            habitTarget,
            moodTrend,
            expenseTotal,
            incomeTotal,
            txCount: financeData.count,
            labSessions,
            disciplineStreak,
            disciplineLine,
          });
        }

        localStorage.setItem(cacheKey, finalText);
        localStorage.setItem(signalKey, JSON.stringify(nextSignals));
        setInsight(finalText);
        setSignals(nextSignals);
      } catch (err) {
        console.error('[MondayInsight]', err);
      } finally {
        setLoading(false);
      }
    };

    loadInsight();
  }, [user, dismissed, showDay, latestMonday, isWeekendReview]);

  const handleDismiss = () => {
    localStorage.setItem('aiimin_dismissed_weekly_insight', latestMonday);
    setDismissed(true);
  };

  if (dismissed || !showDay) return null;

  const title = isWeekendReview ? 'Weekend Review' : 'Monday Morning Insight';
  const parsed = parseInsight(insight);
  const visibleUntil = isWeekendReview ? 'Visible through Sunday.' : 'Visible today.';
  const dismissCopy = 'Dismiss hides it until next Monday.';
  const signalItems = [
    { label: 'Habits', value: signals?.habits || 'Loading', meta: signals?.habitRate || '7 day rate', icon: Target, color: 'var(--color-accent)' },
    { label: 'Money', value: signals?.finance || 'Loading', meta: signals?.financeMeta || 'last 7 days', icon: Wallet, color: 'var(--color-accent)' },
    { label: 'Mood', value: signals?.mood || 'Loading', meta: '7-day journal avg', icon: Brain, color: 'var(--color-accent)' },
    { label: 'Lab', value: signals?.lab || 'Loading', meta: signals?.discipline || 'discipline', icon: FlaskConical, color: 'var(--color-accent)' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="weekly-review-card"
      style={{
        background: 'var(--color-surface)',
        border: '1px solid color-mix(in srgb, var(--color-accent) 18%, var(--color-border))',
        borderRadius: '24px',
        padding: 0,
        position: 'relative',
        overflow: 'visible',
        boxShadow: '0 18px 45px rgba(20, 61, 42, 0.08)',
      }}
    >
      <button
        type="button"
        onClick={handleDismiss}
        aria-label="Dismiss insight"
        title={dismissCopy}
        style={{ position: 'absolute', top: '16px', right: '16px', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.14)', color: 'rgba(255,255,255,0.72)', cursor: 'pointer', padding: '6px', borderRadius: '10px', display: 'flex', zIndex: 2 }}
      >
        <X size={16} />
      </button>

      <div className="weekly-review-hero">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#ff9b73', fontSize: '10px', fontWeight: 950, textTransform: 'uppercase', letterSpacing: '0.14em', marginBottom: '8px' }}>
            <CalendarClock size={13} /> {title}
          </div>
          <div style={{ fontSize: '22px', fontWeight: 950, color: '#fff7ed', letterSpacing: '-0.04em', lineHeight: 1.08 }}>
            {isWeekendReview ? 'Your week, in numbers.' : 'Set the week from your real signals.'}
          </div>
        </div>
        <div style={{ fontSize: '10px', fontWeight: 750, color: 'rgba(255,247,237,0.62)', textAlign: 'right', lineHeight: 1.5 }}>
          {visibleUntil}<br />
          {dismissCopy}
        </div>
      </div>

      <div className="weekly-review-content">
        {loading ? (
          <div className="weekly-review-loading" aria-live="polite">
            <span />
            Reading your last 7 days...
          </div>
        ) : (
          <>
          <div className="weekly-review-signals">
            {signalItems.map(({ label, value, meta, icon: Icon }) => (
              <div key={label} className="weekly-review-signal">
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--color-accent)', fontSize: 10, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                  <Icon size={12} /> {label}
                </div>
                <div style={{ fontSize: '15px', fontWeight: 900, color: 'var(--color-text-1)', marginTop: 8, lineHeight: 1.15 }}>{value}</div>
                <div style={{ fontSize: '11px', color: 'var(--color-text-2)', marginTop: 4, lineHeight: 1.35 }}>{meta}</div>
              </div>
            ))}
          </div>

          {parsed.bullets.length > 0 ? (
            <div className="weekly-review-body">
              {parsed.bullets.map((line, index) => (
                <div key={`${line}-${index}`} className="weekly-review-point">
                  <span>{index + 1}</span>
                  <p>{line}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="weekly-review-empty">Log habits, journal, and finance this week to unlock a sharper review.</div>
          )}

          <div className="weekly-review-next">
            <span>Next move</span>
            <p>{parsed.nextMove || 'Pick one metric to improve before tomorrow night.'}</p>
          </div>
          </>
        )}
      </div>
      <style>{`
        .weekly-review-card::before {
          content: "";
          position: absolute;
          inset: 0;
          pointer-events: none;
          background:
            radial-gradient(circle at 8% 0%, rgba(255, 107, 53, 0.22), transparent 28%),
            radial-gradient(circle at 92% 4%, rgba(16, 185, 129, 0.13), transparent 30%);
          opacity: .9;
        }
        .weekly-review-hero {
          position: relative;
          display: grid;
          grid-template-columns: minmax(0, 1fr) auto;
          gap: 18px;
          align-items: start;
          padding: 22px 56px 22px 22px;
          background:
            linear-gradient(135deg, #123322 0%, #183f2b 54%, #0f251b 100%);
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
        }
        .weekly-review-hero::after {
          content: "";
          position: absolute;
          left: 22px;
          right: 22px;
          bottom: 0;
          height: 1px;
          background: linear-gradient(90deg, rgba(255, 107, 53, .75), transparent);
        }
        .weekly-review-content {
          position: relative;
          padding: 16px 18px 18px;
          background:
            linear-gradient(180deg, rgba(255, 107, 53, 0.035), transparent 34%),
            var(--color-surface);
        }
        .weekly-review-loading {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 14px;
          color: var(--color-text-2);
          font-size: 13px;
          font-weight: 750;
          background: var(--color-elevated);
          border: 1px solid var(--color-border);
          border-radius: 16px;
        }
        .weekly-review-loading span {
          width: 8px;
          height: 8px;
          border-radius: 999px;
          background: var(--color-accent);
          animation: weeklyReviewPulse 1.4s ease-in-out infinite;
        }
        @keyframes weeklyReviewPulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: .35; transform: scale(.72); }
        }
        .weekly-review-signals {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 10px;
          margin-bottom: 18px;
        }
        .weekly-review-signal {
          background:
            linear-gradient(180deg, color-mix(in srgb, #fff7ed 18%, var(--color-surface)), var(--color-elevated));
          border: 1px solid color-mix(in srgb, var(--color-accent) 16%, var(--color-border));
          border-radius: 16px;
          padding: 12px;
          min-width: 0;
          box-shadow: inset 0 1px 0 rgba(255,255,255,0.5);
        }
        .weekly-review-body {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 10px;
          margin-bottom: 12px;
        }
        .weekly-review-point {
          display: grid;
          grid-template-columns: 24px minmax(0, 1fr);
          gap: 10px;
          align-items: start;
          background: var(--color-elevated);
          border: 1px solid color-mix(in srgb, var(--color-accent) 10%, var(--color-border));
          border-radius: 16px;
          padding: 12px;
        }
        .weekly-review-point span {
          width: 24px;
          height: 24px;
          border-radius: 999px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          background: var(--color-accent-dim);
          color: var(--color-accent);
          font-size: 11px;
          font-weight: 950;
        }
        .weekly-review-point p {
          margin: 0;
          max-width: none;
          font-size: 12px;
          line-height: 1.55;
          font-weight: 650;
          color: var(--color-text-2);
        }
        .weekly-review-next {
          display: grid;
          grid-template-columns: 92px minmax(0, 1fr);
          gap: 12px;
          align-items: center;
          background: linear-gradient(90deg, rgba(255, 107, 53, 0.12), rgba(20, 61, 42, 0.045));
          border: 1px solid color-mix(in srgb, var(--color-accent) 24%, var(--color-border));
          border-radius: 16px;
          padding: 12px 14px;
        }
        .weekly-review-next span {
          color: var(--color-accent);
          font-size: 10px;
          font-weight: 950;
          text-transform: uppercase;
          letter-spacing: 0.1em;
        }
        .weekly-review-next p,
        .weekly-review-empty {
          margin: 0;
          max-width: none;
          color: var(--color-text-1);
          font-size: 13px;
          line-height: 1.45;
          font-weight: 750;
          overflow-wrap: anywhere;
          white-space: normal;
          overflow: visible;
          text-overflow: unset;
        }
        .weekly-review-empty {
          padding: 14px;
          border-radius: 16px;
          background: var(--color-elevated);
          border: 1px dashed var(--color-border);
        }
        @media (max-width: 900px) {
          .weekly-review-signals,
          .weekly-review-body {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }
        @media (max-width: 560px) {
          .weekly-review-signals,
          .weekly-review-body,
          .weekly-review-next {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </motion.div>
  );
}

function isPromptLeak(text) {
  if (!text?.trim()) return false;
  const lower = text.toLowerCase();
  const hits = [
    /write\s+\d+\s+short/,
    /under\s+\d+\s+words/,
    /warm,\s*practical,\s*calm/,
    /must\s+(be|not)/,
    /passive voice/,
    /no dollar|dollar signs|rupee symbol/,
    /do not apolog|don't apolog|forbid/,
    /categories to reference/,
    /exactly 4 short bullet/,
    /speak directly to ["']you["']/,
    /never use \$/,
    /evidence-led/,
  ].filter((re) => re.test(lower)).length;
  return hits >= 1;
}

function looksLikeInstructionLine(cleaned) {
  const lower = cleaned.toLowerCase();
  return (
    /^(write|do not|don't|forbid|avoid|use |reference|example|tone:|word count|bullet|must\b|provide exactly)/i.test(cleaned)
    || /under \d+ words|passive voice|dollar signs|rupee symbol|you\/your|categories to/i.test(lower)
    || /unfortunately/.test(lower)
    || cleaned.length > 140
  );
}

function buildLocalInsight({
  habitCompletions = 0,
  habitTarget = 0,
  moodTrend = '',
  expenseTotal = 0,
  incomeTotal = 0,
  txCount = 0,
  labSessions = 0,
  disciplineStreak = 0,
  disciplineLine = '',
}) {
  const bullets = [];
  if (habitTarget > 0) {
    const pct = Math.round((habitCompletions / habitTarget) * 100);
    bullets.push(`Habits landed ${habitCompletions}/${habitTarget} checks this week (${pct}%).`);
  } else {
    bullets.push('No habit targets yet — add one habit you can keep tomorrow.');
  }
  bullets.push(moodTrend && !/^no mood/i.test(moodTrend)
    ? `Mood read: ${moodTrend}.`
    : 'Mood has few journal entries — one line tonight still counts.');
  bullets.push(
    expenseTotal > 0 || incomeTotal > 0
      ? `Money moved ${formatINR(expenseTotal)} out and ${formatINR(incomeTotal)} in across ${txCount} transactions.`
      : 'No finance transactions logged this week.',
  );
  if (disciplineLine) bullets.push(disciplineLine);
  else if (disciplineStreak > 0) bullets.push(`Discipline streak holds at ${disciplineStreak} day${disciplineStreak === 1 ? '' : 's'}.`);
  else if (labSessions > 0) bullets.push(`Lab logged ${labSessions} session${labSessions === 1 ? '' : 's'} this week.`);
  else bullets.push('Discipline and Lab were quiet — one urge surf or short Lab block resets the week.');

  return `${bullets.slice(0, 4).map((b) => `- ${b}`).join('\n')}\nNext move: Pick one metric to improve before tomorrow night.`;
}

function parseInsight(text) {
  if (!text?.trim() || isPromptLeak(text)) return { bullets: [], nextMove: '' };
  const lines = text
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean);
  const bullets = [];
  let nextMove = '';

  lines.forEach((line) => {
    const cleaned = line.replace(/^[-*•]\s*/, '').replace(/^\d+[.)]\s*/, '').trim();
    if (/^next move:/i.test(cleaned)) {
      nextMove = cleaned.replace(/^next move:\s*/i, '').trim();
      return;
    }
    if (!cleaned || looksLikeInstructionLine(cleaned)) return;
    bullets.push(cleaned);
  });

  return { bullets: bullets.slice(0, 4), nextMove };
}
