import React, { useEffect, useState } from 'react';
import BrandLockup from '../brand/BrandLockup';
import { useAuth } from '../../hooks/useAuth';
import { useLifeScore } from '../../hooks/useLifeScore';
import { getRankProgress } from '../../utils/xpEngine';
import supabase from '../../utils/supabase';
import { useMobilePlanGlance } from './useMobilePlanGlance';
import '../../styles/mobileCapture.css';
import '../../styles/mobileScore.css';

function deltaLabel(delta, score) {
  if (!score || score === 0) return 'Log today to start your score';
  if (delta > 0) return `Up ${delta} from yesterday`;
  if (delta < 0) return `Down ${Math.abs(delta)} from yesterday`;
  return 'No change from yesterday';
}

export default function MobileScorePage() {
  const { user } = useAuth();
  const { lifeScore, loading } = useLifeScore(user);
  const planGlance = useMobilePlanGlance(user?.id);
  const [xpData, setXpData] = useState(null);
  const [habitWeek, setHabitWeek] = useState({ done: 0, total: 0 });
  const [journalWeek, setJournalWeek] = useState(0);

  useEffect(() => {
    if (!user?.id) return;
    supabase
      .from('user_xp')
      .select('total_xp, current_rank, clean_streak, longest_streak')
      .eq('user_id', user.id)
      .maybeSingle()
      .then(({ data }) => { if (data) setXpData(data); });

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
      });

    supabase
      .from('journal_entries')
      .select('id')
      .eq('user_id', user.id)
      .gte('created_at', weekAgo.toISOString())
      .then(({ data }) => setJournalWeek((data || []).length));
  }, [user?.id]);

  const score = lifeScore?.score ?? 0;
  const delta = lifeScore?.delta ?? 0;
  const hasScore = score > 0;
  const streak = xpData?.clean_streak || xpData?.longest_streak || 0;
  const progress = getRankProgress(xpData?.total_xp || 0);
  const xpToNext = progress.next ? Math.max(0, progress.next.minXP - (xpData?.total_xp || 0)) : 0;

  return (
    <div className="mobile-capture mobile-score">
      <header className="mobile-capture__header">
        <BrandLockup />
        <p className="mobile-capture__eyebrow">Score</p>
      </header>

      <main className="mobile-capture__main">
        <section className="mobile-score__hero" aria-label="Life Score">
          <div className="mobile-score__ring" aria-hidden>
            <svg viewBox="0 0 36 36" className="mobile-score__ring-svg">
              <path
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="#3a3a3a"
                strokeWidth="2"
              />
              <path
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="#ff6b35"
                strokeWidth="2"
                strokeDasharray={`${score}, 100`}
              />
            </svg>
            <span className="mobile-score__number">{loading ? '—' : score}</span>
          </div>
          <p className={`mobile-score__delta${
            !hasScore
              ? ' mobile-score__delta--neutral'
              : delta >= 0
                ? ' mobile-score__delta--up'
                : ' mobile-score__delta--down'
          }`}
          >
            {deltaLabel(delta, score)}
          </p>
          {streak > 0 && (
            <span className="mobile-score__streak-badge">{streak}-day log streak</span>
          )}
          <p className="mobile-score__label">Life Score</p>
        </section>

        <section className="mobile-score__grid" aria-label="Weekly glance">
          <article className="mobile-score__card mobile-score__card--habits">
            <span className="mobile-score__card-label">Habits</span>
            <strong>{habitWeek.done} / {habitWeek.total || '—'}</strong>
            <span className="mobile-score__card-sub">this week</span>
          </article>
          <article className="mobile-score__card mobile-score__card--streak">
            <span className="mobile-score__card-label">Discipline</span>
            <strong>{streak} days</strong>
            <span className="mobile-score__card-sub">active streak</span>
          </article>
          <article className="mobile-score__card mobile-score__card--journal">
            <span className="mobile-score__card-label">Journal</span>
            <strong>{journalWeek} entries</strong>
            <span className="mobile-score__card-sub">this week</span>
          </article>
          <article className="mobile-score__card mobile-score__card--finance">
            <span className="mobile-score__card-label">Plan</span>
            <strong>{planGlance.loading ? '—' : planGlance.financeTitle}</strong>
            <span className="mobile-score__card-sub">{planGlance.financeSub}</span>
          </article>
        </section>

        {progress.current && (
          <section className="mobile-score__rank" aria-label="Rank">
            <div>
              <span className="mobile-score__card-label">Rank {progress.current.rank} of 10</span>
              <strong>{progress.current.name}</strong>
            </div>
            <span className="mobile-score__card-sub">
              {xpToNext > 0 ? `${xpToNext.toLocaleString()} XP to ${progress.next?.name || 'next'}` : 'Top rank'}
            </span>
            <div className="mobile-score__rank-bar">
              <div style={{ width: `${Math.round((progress.progress || 0) * 100)}%` }} />
            </div>
          </section>
        )}

        <section className="mobile-score__nudge">
          <p>See full insights, habits, and finance on desktop or iPad.</p>
          <a href="https://aiimin.in/overview" target="_blank" rel="noopener noreferrer">
            Open on desktop →
          </a>
        </section>
      </main>
    </div>
  );
}
