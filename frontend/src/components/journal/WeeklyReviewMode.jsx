import React, { useEffect, useState } from 'react';
import useThemeColors from '../../hooks/useThemeColors';
import { getWeeklyWindowStatus } from './journalUtils';
import { apiGet } from '../../utils/api';
import JournalMoodStrip from './JournalMoodStrip';

export default function WeeklyReviewMode({
  onSave,
  initialBody = '',
  initialStats = null,
  readOnly = false,
  initialMood = 6,
}) {
  const c = useThemeColors();
  const [body, setBody] = useState(initialBody);
  const [stats, setStats] = useState(initialStats);
  const [mood, setMood] = useState(initialMood);
  const [loading, setLoading] = useState(true);
  const windowStatus = getWeeklyWindowStatus();

  useEffect(() => {
    if (readOnly && initialStats) {
      setLoading(false);
      return;
    }
    apiGet('/dashboard')
      .then((d) => {
        setStats({
          habitPct: d?.habits?.completionRate ?? '—',
          focusHours: d?.focus?.hoursThisWeek ?? '—',
          streak: d?.discipline?.streak ?? d?.streaks?.overall ?? '—',
        });
      })
      .catch(() => setStats({ habitPct: '—', focusHours: '—', streak: '—' }))
      .finally(() => setLoading(false));
  }, [initialStats, readOnly]);

  return (
    <div style={{ padding: 24, maxWidth: 720, margin: '0 auto' }}>
      <h2 className="text-h2" style={{ color: c.text1, marginBottom: 20 }}>Weekly Review</h2>
      {windowStatus === 'nudge' ? (
        <div className="journal-studio__nudge" style={{ marginBottom: 16 }}>
          Weekly review usually lands best on Sunday evening, but you can reflect anytime.
        </div>
      ) : null}

      {!loading && stats && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 24 }}>
          {[
            { label: 'Habits', value: `${stats.habitPct}%` },
            { label: 'Focus hrs', value: stats.focusHours },
            { label: 'Streak', value: stats.streak },
          ].map((s) => (
            <div key={s.label} className="card" style={{ padding: 16, textAlign: 'center', background: c.cardBg, border: `1px solid ${c.border}`, borderRadius: 12 }}>
              <div className="text-caption">{s.label}</div>
              <div className="text-stat tabular-nums" style={{ fontSize: 24, color: c.accent }}>{s.value}</div>
            </div>
          ))}
        </div>
      )}

      <label className="text-label" style={{ color: c.text3 }}>Reflection</label>
      <textarea
        value={body}
        onChange={(e) => setBody(e.target.value)}
        readOnly={readOnly}
        className="prose-area"
        placeholder="What worked this week? What didn't? What changes next week?"
        rows={12}
        style={{ width: '100%', marginTop: 8, padding: 16, borderRadius: 12, border: `1px solid ${c.border}`, background: c.inputBg, color: c.text1, fontSize: 15 }}
      />
      <div style={{ marginTop: 12 }}>
        <JournalMoodStrip value={mood} onChange={setMood} disabled={readOnly} />
      </div>
      <button
        type="button"
        className="btn-action"
        onClick={() => onSave?.({ body, stats, mood })}
        disabled={readOnly || !body.trim()}
        style={{
          marginTop: 16,
          width: '100%',
          padding: 14,
          background: c.accent,
          color: '#fff',
          border: 'none',
          borderRadius: 12,
          fontWeight: 800,
          cursor: readOnly || !body.trim() ? 'not-allowed' : 'pointer',
          opacity: readOnly || !body.trim() ? 0.5 : 1,
        }}
      >
        Save weekly review
      </button>
    </div>
  );
}
