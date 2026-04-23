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

  const border = 'var(--color-border)';
  const text1 = 'var(--color-text-1)';
  const text2 = 'var(--color-text-2)';
  const text3 = 'var(--color-text-3)';

  const filtered = activeSport === 'all' ? MOCK_SESSIONS : MOCK_SESSIONS.filter(s => s.sport === activeSport);
  const totalMin = MOCK_SESSIONS.reduce((a, b) => a + b.duration, 0);
  const streak = 3;

  return (
    <div style={{ flex: 1, paddingBottom: '80px' }}>
      {/* Header */}
      <div style={{ marginBottom: '40px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <div style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--color-accent)', fontFamily: 'var(--font-mono)', marginBottom: '8px' }}>
            Sports · Activity Log
          </div>
          <h1 style={{ font: 'var(--text-hero)', color: text1, margin: 0, letterSpacing: '-0.03em' }}>
            Move every day.
          </h1>
        </div>
        <div style={{ textAlign: 'right' }}>
          <span style={{ fontSize: '12px', color: text3, fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Active Mode
          </span>
        </div>
      </div>

      {/* Stats row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '40px' }}>
        <StatCard label="This Week" value={`${Math.round(totalMin / 60)}h ${totalMin % 60}m`} sub="5 sessions logged" color="#10B981" isDark={isDark} />
        <StatCard label="Active Streak" value={`${streak} days`} sub="Personal best: 12" color="#3B82F6" isDark={isDark} />
        <StatCard label="Sessions" value={MOCK_SESSIONS.length} sub="This month" color="#8B5CF6" isDark={isDark} />
        <StatCard label="Top Category" value="Gym" sub="3 sessions / week" color="#F59E0B" isDark={isDark} />
      </div>

      {/* Sport filter pills */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '32px', flexWrap: 'wrap', alignItems: 'center' }}>
        {[{ key: 'all', label: 'All', emoji: '⚡' }, ...SPORTS].map(s => (
          <button
            key={s.key}
            onClick={() => setActiveSport(s.key)}
            className="glass-panel"
            style={{
              padding: '8px 16px',
              borderRadius: '12px',
              border: `1px solid ${activeSport === s.key ? s.color || 'var(--color-accent)' : border}`,
              background: activeSport === s.key ? (s.color ? `${s.color}15` : 'var(--color-accent-dim)') : 'var(--glass-bg)',
              color: activeSport === s.key ? (s.color || 'var(--color-accent)') : text2,
              fontSize: '13px', fontWeight: 600, cursor: 'pointer',
              fontFamily: 'var(--font-sans)', display: 'flex', alignItems: 'center', gap: '6px',
              transition: 'all 200ms var(--ease)',
              boxShadow: activeSport === s.key ? 'var(--glass-shadow-sm)' : 'none',
            }}
          >
            <span>{s.emoji}</span>
            <span>{s.label}</span>
          </button>
        ))}
        <button
          onClick={() => setLogOpen(true)}
          style={{
            marginLeft: 'auto', padding: '10px 20px', borderRadius: '12px',
            background: 'var(--color-accent)', border: 'none', color: '#fff',
            fontSize: '13px', fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font-sans)',
            boxShadow: 'var(--shadow-md)', transition: 'all 200ms var(--ease)',
          }}
          onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-1px)'}
          onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
        >
          + Log Session
        </button>
      </div>

      {/* Session list */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {filtered.map((s, i) => {
          const sport = SPORTS.find(sp => sp.key === s.sport) || { emoji: '🏃', label: s.sport, color: '#10B981' };
          return (
            <div key={i} className="glass-panel" style={{
              background: 'var(--glass-bg)', border: `1px solid ${border}`, borderRadius: '16px',
              padding: '20px 24px', display: 'flex', alignItems: 'center', gap: '20px',
              transition: 'all 200ms var(--ease)',
              boxShadow: 'var(--glass-shadow-sm)',
            }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = sport.color;
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = border;
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <div style={{
                width: '48px', height: '48px', borderRadius: '14px', flexShrink: 0,
                background: `${sport.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', 
                fontSize: '24px', border: `1px solid ${sport.color}30`,
              }}>
                {sport.emoji}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '15px', fontWeight: 700, color: text1, fontFamily: 'var(--font-sans)', marginBottom: '4px' }}>
                  {s.note}
                </div>
                <div style={{ fontSize: '12px', color: text3, fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  {sport.label} · {s.duration} min · {new Date(s.date).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}
                </div>
              </div>
              <div style={{ display: 'flex', gap: '3px', background: 'var(--color-surface)', padding: '6px 12px', borderRadius: '99px', border: `1px solid ${border}` }}>
                {[1,2,3,4,5].map(star => (
                  <span key={star} style={{ fontSize: '12px', color: star <= s.rating ? 'var(--color-accent)' : 'var(--color-border)' }}>★</span>
                ))}
              </div>
            </div>
          );
        })}

        {filtered.length === 0 && (
          <div className="glass-panel" style={{
            background: 'var(--glass-bg)', border: `1px solid ${border}`, borderRadius: '20px',
            padding: '60px 24px', textAlign: 'center',
          }}>
            <div style={{ fontSize: '48px', marginBottom: '16px', opacity: 0.6 }}>🏃</div>
            <div style={{ fontSize: '16px', fontWeight: 600, color: text1, fontFamily: 'var(--font-sans)', marginBottom: '6px' }}>No sessions found</div>
            <div style={{ fontSize: '13px', color: text3, fontFamily: 'var(--font-sans)' }}>Start tracking your movement to see data here.</div>
          </div>
        )}
      </div>

      {/* Log modal */}
      {logOpen && (
        <div onClick={() => setLogOpen(false)} style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 2000,
          display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)',
        }}>
          <div onClick={e => e.stopPropagation()} className="glass-panel" style={{
            background: 'var(--color-base)', border: `1px solid ${border}`, borderRadius: '24px',
            padding: '40px', width: '440px', maxWidth: '95vw', boxShadow: 'var(--shadow-xl)',
          }}>
            <h2 style={{ font: 'var(--text-hero)', fontSize: '24px', color: text1, margin: '0 0 32px', letterSpacing: '-0.02em' }}>Log Activity</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div>
                <label style={{ fontSize: '11px', fontWeight: 700, color: text3, fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '8px', display: 'block' }}>Category</label>
                <select value={form.sport} onChange={e => setForm(f => ({ ...f, sport: e.target.value }))} style={{
                  width: '100%', padding: '12px 16px', borderRadius: '12px', border: `1px solid ${border}`,
                  background: 'var(--color-surface)', color: text1, fontFamily: 'var(--font-sans)', fontSize: '14px', outline: 'none',
                }}>
                  {SPORTS.map(s => <option key={s.key} value={s.key}>{s.emoji} {s.label}</option>)}
                </select>
              </div>
              
              <div>
                <label style={{ fontSize: '11px', fontWeight: 700, color: text3, fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '8px', display: 'block' }}>Duration (min)</label>
                <input
                  type="number" placeholder="45"
                  value={form.duration} onChange={e => setForm(f => ({ ...f, duration: e.target.value }))}
                  style={{
                    width: '100%', padding: '12px 16px', borderRadius: '12px', border: `1px solid ${border}`,
                    background: 'var(--color-surface)', color: text1, fontFamily: 'var(--font-sans)', fontSize: '14px', outline: 'none',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              <div>
                <label style={{ fontSize: '11px', fontWeight: 700, color: text3, fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '8px', display: 'block' }}>Activity Note</label>
                <input
                  type="text" placeholder="What did you accomplish?"
                  value={form.note} onChange={e => setForm(f => ({ ...f, note: e.target.value }))}
                  style={{
                    width: '100%', padding: '12px 16px', borderRadius: '12px', border: `1px solid ${border}`,
                    background: 'var(--color-surface)', color: text1, fontFamily: 'var(--font-sans)', fontSize: '14px', outline: 'none',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '12px' }}>
                <button onClick={() => setLogOpen(false)} style={{
                  padding: '12px 24px', borderRadius: '12px', border: `1px solid ${border}`,
                  background: 'transparent', color: text2, fontFamily: 'var(--font-sans)', fontSize: '14px', fontWeight: 600, cursor: 'pointer',
                  transition: 'all 200ms var(--ease)',
                }}>Cancel</button>
                <button onClick={() => setLogOpen(false)} style={{
                  padding: '12px 28px', borderRadius: '12px', border: 'none',
                  background: 'var(--color-accent)', color: '#fff', fontFamily: 'var(--font-sans)', fontSize: '14px', fontWeight: 700, cursor: 'pointer',
                  transition: 'all 200ms var(--ease)', boxShadow: 'var(--shadow-md)',
                }}>Log Activity</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SportsPage;
