import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useThemeContext } from '../context/ThemeContext';

/* ── Sports dashboard ────────────────────────────────────────── */
const SPORTS = [
  { key: 'cricket', label: 'Cricket', emoji: '🏏', color: '#10B981' },
  { key: 'football', label: 'Football', emoji: '⚽', color: '#3B82F6' },
  { key: 'basketball', label: 'Basketball', emoji: '🏀', color: '#F59E0B' },
  { key: 'chess', label: 'Chess', emoji: '♟', color: '#8B5CF6' },
  { key: 'running', label: 'Running', emoji: '🏃', color: '#EF4444' },
  { key: 'gym', label: 'Gym', emoji: '🏋️', color: '#EC4899' },
];

const MOCK_SESSIONS = [
  { sport: 'cricket', note: 'Net practice – 45 min', date: '2026-05-03', duration: 45, rating: 4 },
  { sport: 'gym', note: 'Chest & triceps', date: '2026-05-03', duration: 60, rating: 5 },
  { sport: 'running', note: '5K morning run', date: '2026-05-02', duration: 28, rating: 4 },
  { sport: 'chess', note: 'Blitz session – 10 games', date: '2026-05-01', duration: 40, rating: 3 },
  { sport: 'football', note: '5-a-side pickup game', date: '2026-04-30', duration: 60, rating: 5 },
];

const StatCard = ({ label, value, sub, color, isDark }) => (
  <div style={{
    background: isDark ? '#111111' : '#FFFFFF',
    border: `1px solid ${isDark ? '#222' : '#E5E7EB'}`,
    borderRadius: '10px',
    padding: '20px',
    borderTop: `3px solid ${color}`,
  }}>
    <div style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: isDark ? '#52525B' : '#9CA3AF', marginBottom: '10px', fontFamily: 'var(--font-sans)' }}>
      {label}
    </div>
    <div style={{ fontSize: '28px', fontWeight: 700, color: isDark ? '#EDEDED' : '#111111', fontFamily: 'var(--font-sans)', letterSpacing: '-0.02em', lineHeight: 1 }}>
      {value}
    </div>
    {sub && <div style={{ fontSize: '11px', color: isDark ? '#71717A' : '#9CA3AF', marginTop: '6px', fontFamily: 'var(--font-sans)' }}>{sub}</div>}
  </div>
);

const SportsPage = () => {
  const { user } = useAuth();
  const { theme } = useThemeContext();
  const isDark = theme === 'dark';
  const [activeSport, setActiveSport] = useState('all');
  const [logOpen, setLogOpen] = useState(false);
  const [form, setForm] = useState({ sport: 'cricket', duration: '', note: '', rating: 4 });

  if (!user) return null;

  const filtered = activeSport === 'all' ? MOCK_SESSIONS : MOCK_SESSIONS.filter(s => s.sport === activeSport);
  const totalMin = MOCK_SESSIONS.reduce((a, b) => a + b.duration, 0);
  const streak = 3;

  const bg = isDark ? '#0A0A0A' : '#F9FAFB';
  const cardBg = isDark ? '#111111' : '#FFFFFF';
  const border = isDark ? '#222222' : '#E5E7EB';
  const text1 = isDark ? '#EDEDED' : '#111111';
  const text2 = isDark ? '#A1A1AA' : '#6B7280';
  const text3 = isDark ? '#52525B' : '#9CA3AF';

  return (
    <div style={{ minHeight: '100vh' }}>
      {/* Header */}
      <div style={{ marginBottom: '40px' }}>
        <div style={{ fontSize: '10px', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: text3, fontFamily: 'var(--font-sans)', marginBottom: '8px' }}>
          Sports · Activity Log
        </div>
        <h1 style={{ font: 'var(--text-hero)', color: text1, margin: 0, letterSpacing: '-0.02em' }}>
          Move every day.
        </h1>
      </div>

      {/* Stats row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '32px' }}>
        <StatCard label="This Week" value={`${Math.round(totalMin / 60)}h ${totalMin % 60}m`} sub="5 sessions" color="#10B981" isDark={isDark} />
        <StatCard label="Active Streak" value={`${streak} days`} sub="Personal best: 12" color="#3B82F6" isDark={isDark} />
        <StatCard label="Sessions" value={MOCK_SESSIONS.length} sub="This month" color="#8B5CF6" isDark={isDark} />
        <StatCard label="Top Sport" value="Gym" sub="3 sessions / week" color="#F59E0B" isDark={isDark} />
      </div>

      {/* Sport filter pills */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', flexWrap: 'wrap' }}>
        {[{ key: 'all', label: 'All', emoji: '⚡' }, ...SPORTS].map(s => (
          <button
            key={s.key}
            onClick={() => setActiveSport(s.key)}
            style={{
              padding: '6px 14px',
              borderRadius: '9999px',
              border: `1px solid ${activeSport === s.key ? s.color || '#22C55E' : border}`,
              background: activeSport === s.key ? (s.color ? `${s.color}18` : 'rgba(34,197,94,0.1)') : 'transparent',
              color: activeSport === s.key ? (s.color || '#22C55E') : text2,
              fontSize: '12px', fontWeight: 500, cursor: 'pointer',
              fontFamily: 'var(--font-sans)', display: 'flex', alignItems: 'center', gap: '5px',
              transition: 'all 150ms ease',
            }}
          >
            {s.emoji} {s.label}
          </button>
        ))}
        <button
          onClick={() => setLogOpen(true)}
          style={{
            marginLeft: 'auto', padding: '6px 16px', borderRadius: '9999px',
            background: '#10B981', border: 'none', color: '#fff',
            fontSize: '12px', fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font-sans)',
          }}
        >
          + Log Session
        </button>
      </div>

      {/* Session list */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {filtered.map((s, i) => {
          const sport = SPORTS.find(sp => sp.key === s.sport) || { emoji: '🏃', label: s.sport, color: '#10B981' };
          return (
            <div key={i} style={{
              background: cardBg, border: `1px solid ${border}`, borderRadius: '10px',
              padding: '16px 20px', display: 'flex', alignItems: 'center', gap: '16px',
              transition: 'border-color 150ms ease',
            }}
              onMouseEnter={e => e.currentTarget.style.borderColor = sport.color + '55'}
              onMouseLeave={e => e.currentTarget.style.borderColor = border}
            >
              <div style={{
                width: '40px', height: '40px', borderRadius: '10px', flexShrink: 0,
                background: `${sport.color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px',
              }}>
                {sport.emoji}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '14px', fontWeight: 600, color: text1, fontFamily: 'var(--font-sans)', marginBottom: '3px' }}>
                  {s.note}
                </div>
                <div style={{ fontSize: '12px', color: text2, fontFamily: 'var(--font-sans)' }}>
                  {sport.label} · {s.duration} min · {new Date(s.date).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}
                </div>
              </div>
              <div style={{ display: 'flex', gap: '2px' }}>
                {[1,2,3,4,5].map(star => (
                  <span key={star} style={{ fontSize: '12px', color: star <= s.rating ? '#F59E0B' : text3 }}>★</span>
                ))}
              </div>
            </div>
          );
        })}

        {filtered.length === 0 && (
          <div style={{
            background: cardBg, border: `1px solid ${border}`, borderRadius: '10px',
            padding: '48px 24px', textAlign: 'center',
          }}>
            <div style={{ fontSize: '32px', marginBottom: '12px' }}>🏃</div>
            <div style={{ fontSize: '14px', fontWeight: 600, color: text1, fontFamily: 'var(--font-sans)', marginBottom: '4px' }}>No sessions logged</div>
            <div style={{ fontSize: '12px', color: text2, fontFamily: 'var(--font-sans)' }}>Log your first session to start tracking</div>
          </div>
        )}
      </div>

      {/* Log modal */}
      {logOpen && (
        <div onClick={() => setLogOpen(false)} style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 2000,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <div onClick={e => e.stopPropagation()} style={{
            background: cardBg, border: `1px solid ${border}`, borderRadius: '16px',
            padding: '32px', width: '400px', maxWidth: '90vw',
          }}>
            <h2 style={{ font: '600 18px var(--font-sans)', color: text1, margin: '0 0 24px' }}>Log a Session</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <select value={form.sport} onChange={e => setForm(f => ({ ...f, sport: e.target.value }))} style={{
                padding: '10px 14px', borderRadius: '8px', border: `1px solid ${border}`,
                background: isDark ? '#161616' : '#F9FAFB', color: text1, fontFamily: 'var(--font-sans)', fontSize: '14px',
              }}>
                {SPORTS.map(s => <option key={s.key} value={s.key}>{s.emoji} {s.label}</option>)}
              </select>
              <input
                type="number" placeholder="Duration (minutes)"
                value={form.duration} onChange={e => setForm(f => ({ ...f, duration: e.target.value }))}
                style={{
                  padding: '10px 14px', borderRadius: '8px', border: `1px solid ${border}`,
                  background: isDark ? '#161616' : '#F9FAFB', color: text1, fontFamily: 'var(--font-sans)', fontSize: '14px',
                }}
              />
              <input
                type="text" placeholder="Note (optional)"
                value={form.note} onChange={e => setForm(f => ({ ...f, note: e.target.value }))}
                style={{
                  padding: '10px 14px', borderRadius: '8px', border: `1px solid ${border}`,
                  background: isDark ? '#161616' : '#F9FAFB', color: text1, fontFamily: 'var(--font-sans)', fontSize: '14px',
                }}
              />
              <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                <button onClick={() => setLogOpen(false)} style={{
                  padding: '10px 20px', borderRadius: '8px', border: `1px solid ${border}`,
                  background: 'transparent', color: text2, fontFamily: 'var(--font-sans)', fontSize: '13px', cursor: 'pointer',
                }}>Cancel</button>
                <button onClick={() => setLogOpen(false)} style={{
                  padding: '10px 20px', borderRadius: '8px', border: 'none',
                  background: '#10B981', color: '#fff', fontFamily: 'var(--font-sans)', fontSize: '13px', fontWeight: 600, cursor: 'pointer',
                }}>Log it</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SportsPage;
