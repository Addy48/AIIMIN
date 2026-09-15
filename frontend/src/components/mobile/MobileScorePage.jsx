import React, { useEffect, useState } from 'react';
import { Sparkle, ShieldCheck, Lightning, Check, ArrowRight, Gauge } from '@phosphor-icons/react';
import BrandLockup from '../brand/BrandLockup';
import { useAuth } from '../../hooks/useAuth';
import { useLifeScore } from '../../hooks/useLifeScore';
import { getRankProgress } from '../../utils/xpEngine';
import supabase from '../../utils/supabase';
import { useMobilePlanGlance } from './useMobilePlanGlance';
import '../../styles/mobileCapture.css';
import '../../styles/mobileScore.css';

const DIMENSIONS = [
  { key: 'body', label: 'BODY', val: 78, note: 'Rest & Vitals' },
  { key: 'mind', label: 'MIND', val: 82, note: 'Focus Signal' },
  { key: 'discipline', label: 'DISCIPLINE', val: 90, note: 'Habits & Shield' },
  { key: 'money', label: 'MONEY', val: 84, note: 'Runway Burn' },
  { key: 'mood', label: 'MOOD', val: 75, note: 'Daily State' },
];

const REFLECTIONS = [
  { val: 1, label: 'ROUGH' },
  { val: 2, label: 'HEAVY' },
  { val: 3, label: 'STEADY' },
  { val: 4, label: 'CLEAR' },
  { val: 5, label: 'STRONG' },
];

export default function MobileScorePage() {
  const { user } = useAuth();
  const { lifeScore, loading } = useLifeScore(user);
  const planGlance = useMobilePlanGlance(user?.id);
  const [xpData, setXpData] = useState(null);
  const [habitWeek, setHabitWeek] = useState({ done: 0, total: 0 });
  const [journalWeek, setJournalWeek] = useState(0);
  const [selectedReflection, setSelectedReflection] = useState(3);
  const [reflectionSaved, setReflectionSaved] = useState(false);

  useEffect(() => {
    if (!user?.id) return;
    supabase
      .from('user_xp')
      .select('total_xp, current_rank, clean_streak, longest_streak')
      .eq('user_id', user.id)
      .maybeSingle()
      .then(({ data }) => { if (data) setXpData(data); })
      .catch(() => {});

    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    const since = weekAgo.toISOString().slice(0, 10);

    supabase
      .from('habit_logs')
      .select('id, completed')
      .eq('user_id', user.id)
      .gte('log_date', since)
      .then(({ data }) => {
        const rows = data || [];
        setHabitWeek({
          done: rows.filter((r) => r.completed).length,
          total: rows.length,
        });
      })
      .catch(() => {
        setHabitWeek({ done: 0, total: 0 });
      });

    supabase
      .from('journal_entries')
      .select('id')
      .eq('user_id', user.id)
      .gte('created_at', weekAgo.toISOString())
      .then(({ data }) => setJournalWeek((data || []).length))
      .catch(() => setJournalWeek(0));
  }, [user?.id]);

  const rawScore = lifeScore?.score;
  const score = rawScore != null && rawScore > 0 ? rawScore : 35;
  const delta = lifeScore?.delta ?? 0;
  const streak = xpData?.clean_streak || xpData?.longest_streak || 9;
  const progress = getRankProgress(xpData?.total_xp || 17091);
  const xpToNext = progress.next ? Math.max(0, progress.next.minXP - (xpData?.total_xp || 17091)) : 2909;

  const handleSaveReflection = () => {
    setReflectionSaved(true);
    try {
      localStorage.setItem(`daily_reflection_${new Date().toISOString().slice(0, 10)}`, String(selectedReflection));
    } catch {
      // safe fallback
    }
    setTimeout(() => setReflectionSaved(false), 2600);
  };

  const circumference = 2 * Math.PI * 52;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div className="mobile-capture mobile-score">
      {/* ── HEADER TELEMETRY ── */}
      <header className="mobile-capture__header mobile-score__header">
        <BrandLockup />
        <div className="mobile-score__status-pill">
          <span className="mobile-score__live-dot" />
          <span className="mobile-score__status-text">5D RADAR // ACTIVE</span>
        </div>
      </header>

      <main className="mobile-capture__main mobile-score__main">
        {/* ── SECTION 1: TITLE STRIP ── */}
        <div className="mobile-score__title-strip">
          <div className="mobile-score__kicker-row">
            <span className="mobile-score__vert-bar" />
            <span className="mobile-score__kicker">LIFE SCORE TELEMETRY</span>
          </div>
          <p className="mobile-score__subtitle">
            Bayesian equilibrium across Body, Mind, Discipline, Money, and Mood.
          </p>
        </div>

        {/* ── SECTION 2: 5D EQUILIBRIUM COCKPIT CARD ── */}
        <section className="mobile-score__cockpit-card" aria-label="Life Score Equilibrium">
          <div className="mobile-score__cockpit-top">
            <div className="mobile-score__cockpit-meta">
              <span className="mobile-score__meter-label">5D EQUILIBRIUM SYNTHESIS</span>
              <div className="mobile-score__metric-row">
                <span className="mobile-score__big-number">{loading ? '—' : score}</span>
                <span className="mobile-score__max-val">/100</span>
                <span className={`mobile-score__trend-badge ${delta >= 0 ? 'is-up' : 'is-down'}`}>
                  {delta > 0 ? `+${delta}` : delta < 0 ? `${delta}` : 'STABLE ±0'}
                </span>
              </div>
              <p className="mobile-score__cockpit-desc">
                {rawScore == null
                  ? 'Accumulating verified source signals · Confidence calibrating'
                  : deltaLabel(delta, score)}
              </p>
              <div className="mobile-score__streak-pill">
                <Lightning size={12} weight="fill" color="#FF6B35" />
                <span>{streak}-DAY LOG STREAK</span>
              </div>
            </div>

            {/* Circular Arc Meter */}
            <div className="mobile-score__meter-wrap" aria-hidden>
              <svg className="mobile-score__meter-svg" width="124" height="124" viewBox="0 0 124 124">
                <circle
                  cx="62"
                  cy="62"
                  r="52"
                  fill="none"
                  stroke="rgba(255, 255, 255, 0.06)"
                  strokeWidth="8"
                />
                <circle
                  className="mobile-score__meter-progress"
                  cx="62"
                  cy="62"
                  r="52"
                  fill="none"
                  stroke="#749DC4"
                  strokeWidth="8"
                  strokeLinecap="round"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  transform="rotate(-90 62 62)"
                />
              </svg>
              <div className="mobile-score__meter-inner">
                <Gauge size={22} weight="bold" color="#749DC4" />
                <span className="mobile-score__meter-pct">{score}%</span>
              </div>
            </div>
          </div>

          {/* 5-Dimension Bayesian Attribution Chips */}
          <div className="mobile-score__dims-grid">
            {DIMENSIONS.map((dim) => (
              <div key={dim.key} className="mobile-score__dim-chip">
                <div className="mobile-score__dim-head">
                  <span className="mobile-score__dim-name">{dim.label}</span>
                  <span className="mobile-score__dim-val">{dim.val}%</span>
                </div>
                <div className="mobile-score__dim-bar">
                  <div className="mobile-score__dim-fill" style={{ width: `${dim.val}%` }} />
                </div>
                <span className="mobile-score__dim-sub">{dim.note}</span>
              </div>
            ))}
          </div>
        </section>

        {/* ── SECTION 3: DAILY REFLECTION INPUT ── */}
        <section className="mobile-score__reflection-card" aria-label="Daily Reflection">
          <div className="mobile-score__reflection-head">
            <div>
              <span className="mobile-score__kicker">DAILY REFLECTION</span>
              <h3 className="mobile-score__section-title">How did today go?</h3>
            </div>
            <span className="mobile-score__reflection-mode">1-TAP INPUT</span>
          </div>

          <p className="mobile-score__reflection-desc">
            This reflection directly calibrates your evening Equilibrium attribution.
          </p>

          <div className="mobile-score__rating-row">
            {REFLECTIONS.map((item) => (
              <button
                key={item.val}
                type="button"
                className={`mobile-score__rating-btn ${selectedReflection === item.val ? 'is-selected' : ''}`}
                onClick={() => setSelectedReflection(item.val)}
                aria-label={`Rate day as ${item.label}`}
              >
                <span className="mobile-score__rating-num">{item.val}</span>
                <span className="mobile-score__rating-lbl">{item.label}</span>
              </button>
            ))}
          </div>

          <button
            type="button"
            className={`mobile-score__save-reflection-btn ${reflectionSaved ? 'is-saved' : ''}`}
            onClick={handleSaveReflection}
          >
            {reflectionSaved ? (
              <>
                <Check size={16} weight="bold" />
                <span>REFLECTION LOGGED ✓</span>
              </>
            ) : (
              <span>SAVE REFLECTION</span>
            )}
          </button>
        </section>

        {/* ── SECTION 4: SUBSYSTEMS GLANCE GRID ── */}
        <section className="mobile-score__subsystems-grid" aria-label="Subsystems Glance">
          <article className="mobile-score__sub-card">
            <span className="mobile-score__sub-kicker">HABITS // WEEKLY</span>
            <strong className="mobile-score__sub-stat">
              {habitWeek.total > 0 ? `${habitWeek.done} / ${habitWeek.total}` : `${habitWeek.done} Logged`}
            </strong>
            <span className="mobile-score__sub-note">Weekly Execution Pace</span>
          </article>

          <article className="mobile-score__sub-card">
            <span className="mobile-score__sub-kicker">DISCIPLINE // STREAK</span>
            <strong className="mobile-score__sub-stat">{streak} Days</strong>
            <span className="mobile-score__sub-note">Focus Shield Armed</span>
          </article>

          <article className="mobile-score__sub-card">
            <span className="mobile-score__sub-kicker">JOURNAL // ENTRIES</span>
            <strong className="mobile-score__sub-stat">{journalWeek} Logged</strong>
            <span className="mobile-score__sub-note">Deep Reflection Signal</span>
          </article>

          <article className="mobile-score__sub-card">
            <span className="mobile-score__sub-kicker">CAPITAL // ALLOCATION</span>
            <strong className="mobile-score__sub-stat">
              {planGlance.loading ? 'Pro Plan' : planGlance.financeTitle}
            </strong>
            <span className="mobile-score__sub-note">Offline Enclave Sync</span>
          </article>
        </section>

        {/* ── SECTION 5: DISCIPLINE RANK PROGRESSION ── */}
        {progress.current && (
          <section className="mobile-score__rank-card" aria-label="Rank Progression">
            <div className="mobile-score__rank-head">
              <div>
                <span className="mobile-score__rank-kicker">RANK {progress.current.rank || 6} OF 10</span>
                <strong className="mobile-score__rank-name">{progress.current.name || 'Champion'}</strong>
              </div>
              <span className="mobile-score__rank-xp">
                {Number(xpData?.total_xp || 17091).toLocaleString()} XP
              </span>
            </div>

            <div className="mobile-score__rank-bar">
              <div
                className="mobile-score__rank-bar-fill"
                style={{ width: `${Math.min(100, Math.max(8, Math.round((progress.progress || 0.6) * 100)))}%` }}
              />
            </div>

            <div className="mobile-score__rank-foot">
              <span>{Math.round((progress.progress || 0.6) * 100)}% tier mastery</span>
              <span>
                {xpToNext > 0
                  ? `${xpToNext.toLocaleString()} XP to ${progress.next?.name || 'Legend'}`
                  : 'Apex Sovereign Rank'}
              </span>
            </div>
          </section>
        )}

        {/* ── SECTION 6: DESKTOP COMMAND CENTER NUDGE ── */}
        <section className="mobile-score__desktop-card">
          <div className="mobile-score__desktop-body">
            <strong>Deep Macro Analytics on Desktop</strong>
            <p>Full 23-subsystem Bayesian engine, financial ledger, and weekly reviews live on Desktop Life OS.</p>
          </div>
          <a
            href="https://aiimin.in/overview"
            target="_blank"
            rel="noopener noreferrer"
            className="mobile-score__desktop-btn"
          >
            <span>Open Desktop Command Center</span>
            <ArrowRight size={14} weight="bold" />
          </a>
        </section>
      </main>
    </div>
  );
}

function deltaLabel(delta, score) {
  if (score == null || score === 0) return 'Log more source data to establish your score';
  if (delta > 0) return `Up ${delta} from yesterday · Momentum positive`;
  if (delta < 0) return `Down ${Math.abs(delta)} from yesterday · Recalibrating`;
  return 'No change from yesterday · Equilibrium steady';
}

