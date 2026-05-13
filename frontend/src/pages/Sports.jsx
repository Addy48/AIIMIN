import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useThemeContext } from '../context/ThemeContext';
import { sportsService } from '../services/sportsService';
import { motion, AnimatePresence } from 'framer-motion';

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
    background: isDark ? 'var(--color-surface)' : '#FFFFFF',
    border: `1px solid var(--color-border)`,
    borderRadius: '16px',
    padding: '24px',
    borderTop: `4px solid ${color}`,
    boxShadow: 'var(--shadow-sm)',
  }}>
    <div style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--color-text-3)', marginBottom: '12px', fontFamily: 'var(--font-sans)' }}>
      {label}
    </div>
    <div style={{ fontSize: '32px', fontWeight: 700, color: 'var(--color-text-1)', fontFamily: 'var(--font-sans)', letterSpacing: '-0.02em', lineHeight: 1 }}>
      {value}
    </div>
    {sub && <div style={{ fontSize: '12px', color: 'var(--color-text-3)', marginTop: '8px', fontFamily: 'var(--font-sans)' }}>{sub}</div>}
  </div>
);

const SportsPage = () => {
  const { user } = useAuth();
  const { theme } = useThemeContext();
  const isDark = theme === 'dark';
  const [activeTab, setActiveTab] = useState('activity'); // activity | live
  const [activeSport, setActiveSport] = useState('all');
  const [logOpen, setLogOpen] = useState(false);
  const [form, setForm] = useState({ sport: 'cricket', duration: '', note: '', rating: 4 });

  // Live Data State
  const [footballLive, setFootballLive] = useState([]);
  const [f1Standings, setF1Standings] = useState([]);
  const [cricketLive, setCricketLive] = useState([]);
  const [loadingLive, setLoadingLive] = useState(false);

  useEffect(() => {
    if (activeTab === 'live') {
      fetchLiveData();
      const interval = setInterval(fetchLiveData, 60000); // Refresh every minute
      return () => clearInterval(interval);
    }
  }, [activeTab]);

  const fetchLiveData = async () => {
    setLoadingLive(true);
    try {
      const [fb, f1, cr] = await Promise.all([
        sportsService.fetchFootballLive(),
        sportsService.fetchF1Standings(),
        sportsService.fetchCricketLive()
      ]);
      setFootballLive(fb.slice(0, 5)); // Limit to top 5 live matches
      setF1Standings(f1.slice(0, 10)); // Top 10 drivers
      setCricketLive(cr.slice(0, 5));
    } catch (err) {
      console.error('Failed to fetch live sports:', err);
    } finally {
      setLoadingLive(false);
    }
  };

  if (!user) return null;

  const border = 'var(--color-border)';
  const text1 = 'var(--color-text-1)';
  const text2 = 'var(--color-text-2)';
  const text3 = 'var(--color-text-3)';

  const filtered = activeSport === 'all' ? MOCK_SESSIONS : MOCK_SESSIONS.filter(s => s.sport === activeSport);
  const totalMin = MOCK_SESSIONS.reduce((a, b) => a + b.duration, 0);

  return (
    <div style={{ flex: 1, paddingBottom: '80px' }}>
      {/* Header */}
      <div style={{ marginBottom: '40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--color-accent)', fontFamily: 'var(--font-mono)', marginBottom: '8px' }}>
            Sports · Arena
          </div>
          <h1 style={{ font: 'var(--text-hero)', color: text1, margin: 0, letterSpacing: '-0.03em' }}>
            {activeTab === 'activity' ? 'Move every day.' : 'Live from the field.'}
          </h1>
        </div>
        
        {/* Tab Switcher */}
        <div style={{ display: 'flex', background: 'var(--color-surface)', padding: '4px', borderRadius: '12px', border: `1px solid ${border}` }}>
          {['activity', 'live'].map(t => (
            <button
              key={t}
              onClick={() => setActiveTab(t)}
              style={{
                padding: '8px 20px', borderRadius: '8px', border: 'none',
                background: activeTab === t ? 'var(--color-accent)' : 'transparent',
                color: activeTab === t ? '#fff' : text3,
                fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', cursor: 'pointer',
                transition: 'all 200ms var(--ease)',
              }}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'activity' ? (
          <motion.div
            key="activity"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            {/* Stats row */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '40px' }}>
              <StatCard label="This Week" value={`${Math.round(totalMin / 60)}h ${totalMin % 60}m`} sub="5 sessions logged" color="#10B981" isDark={isDark} />
              <StatCard label="Active Streak" value={`3 days`} sub="Personal best: 12" color="#3B82F6" isDark={isDark} />
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
                  }}
                >
                  <span>{s.emoji}</span>
                  <span>{s.label}</span>
                </button>
              ))}
              <button
                onClick={() => setLogOpen(true)}
                style={{
                  marginLeft: 'auto', padding: '10px 24px', borderRadius: '12px',
                  background: 'var(--color-accent)', border: 'none', color: '#fff',
                  fontSize: '13px', fontWeight: 700, cursor: 'pointer', fontFamily: 'var(--font-sans)',
                  boxShadow: 'var(--shadow-md)', transition: 'all 200ms var(--ease)',
                }}
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
                  }}>
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
                        {sport.label} · {s.duration} min · {new Date(s.date).toLocaleDateString()}
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '3px', background: 'var(--color-surface)', padding: '6px 12px', borderRadius: '99px', border: `1px solid ${border}` }}>
                      {[1,2,3,4,5].map(star => (
                        <span key={star} style={{ fontSize: '12px', color: star <= s.rating ? 'var(--color-accent)' : border }}>★</span>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="live"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '32px' }}
          >
            {/* Left: Football & Cricket Live */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
              {/* Football Live */}
              <section>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                  <h3 style={{ fontSize: '14px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: text1 }}>⚽ Live Football</h3>
                  {loadingLive && <span style={{ fontSize: '10px', color: 'var(--color-accent)' }}>Updating...</span>}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {footballLive.length > 0 ? footballLive.map((match, i) => (
                    <div key={i} className="glass-panel" style={{ padding: '20px', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div style={{ flex: 1, textAlign: 'right', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '12px' }}>
                        <span style={{ fontSize: '14px', fontWeight: 600 }}>{match.teams.home.name}</span>
                        <img src={match.teams.home.logo} alt="" style={{ width: '24px', height: '24px' }} />
                      </div>
                      <div style={{ width: '100px', textAlign: 'center' }}>
                        <div style={{ fontSize: '20px', fontWeight: 800, fontFamily: 'var(--font-mono)' }}>
                          {match.goals.home} - {match.goals.away}
                        </div>
                        <div style={{ fontSize: '10px', color: 'var(--color-accent)', fontWeight: 700 }}>{match.fixture.status.elapsed}'</div>
                      </div>
                      <div style={{ flex: 1, textAlign: 'left', display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <img src={match.teams.away.logo} alt="" style={{ width: '24px', height: '24px' }} />
                        <span style={{ fontSize: '14px', fontWeight: 600 }}>{match.teams.away.name}</span>
                      </div>
                    </div>
                  )) : (
                    <div className="glass-panel" style={{ padding: '40px', textAlign: 'center', color: text3 }}>No matches live currently.</div>
                  )}
                </div>
              </section>

              {/* Cricket Live */}
              <section>
                <h3 style={{ fontSize: '14px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: text1, marginBottom: '20px' }}>🏏 Cricket Matches</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {cricketLive.length > 0 ? cricketLive.map((match, i) => (
                    <div key={i} className="glass-panel" style={{ padding: '20px', borderRadius: '16px' }}>
                      <div style={{ fontSize: '12px', color: 'var(--color-accent)', fontWeight: 700, marginBottom: '8px' }}>{match.status}</div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ fontSize: '15px', fontWeight: 600 }}>{match.name}</div>
                        <div style={{ fontSize: '12px', color: text3 }}>{match.matchType.toUpperCase()}</div>
                      </div>
                    </div>
                  )) : (
                    <div className="glass-panel" style={{ padding: '40px', textAlign: 'center', color: text3 }}>No active cricket matches.</div>
                  )}
                </div>
              </section>
            </div>

            {/* Right: F1 Standings */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
              <section className="glass-panel" style={{ padding: '24px', borderRadius: '24px' }}>
                <h3 style={{ fontSize: '14px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: text1, marginBottom: '24px' }}>🏎️ F1 Standings</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {f1Standings.map((driver, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <span style={{ fontSize: '12px', fontWeight: 800, color: text3, width: '20px' }}>{driver.position}</span>
                      <img src={driver.driver.image} alt="" style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--bg-elevated)' }} />
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: '13px', fontWeight: 700 }}>{driver.driver.name}</div>
                        <div style={{ fontSize: '10px', color: text3 }}>{driver.team.name}</div>
                      </div>
                      <div style={{ fontSize: '13px', fontWeight: 800, color: 'var(--color-accent)' }}>{driver.points} pts</div>
                    </div>
                  ))}
                  {f1Standings.length === 0 && <div style={{ textAlign: 'center', padding: '20px', color: text3 }}>No F1 data available.</div>}
                </div>
              </section>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Log modal */}
      {logOpen && (
        <div onClick={() => setLogOpen(false)} style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 2000,
          display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(8px)',
        }}>
          <div onClick={e => e.stopPropagation()} className="glass-panel" style={{
            background: 'var(--color-base)', border: `1px solid ${border}`, borderRadius: '24px',
            padding: '40px', width: '440px', maxWidth: '95vw',
          }}>
            <h2 style={{ font: 'var(--text-hero)', fontSize: '24px', color: text1, margin: '0 0 32px' }}>Log Activity</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div>
                <label style={{ fontSize: '11px', fontWeight: 700, color: text3, fontFamily: 'var(--font-mono)', textTransform: 'uppercase', marginBottom: '8px', display: 'block' }}>Category</label>
                <select value={form.sport} onChange={e => setForm(f => ({ ...f, sport: e.target.value }))} style={{
                  width: '100%', padding: '12px 16px', borderRadius: '12px', border: `1px solid ${border}`,
                  background: 'var(--color-surface)', color: text1, fontSize: '14px', outline: 'none',
                }}>
                  {SPORTS.map(s => <option key={s.key} value={s.key}>{s.emoji} {s.label}</option>)}
                </select>
              </div>
              
              <div>
                <label style={{ fontSize: '11px', fontWeight: 700, color: text3, fontFamily: 'var(--font-mono)', textTransform: 'uppercase', marginBottom: '8px', display: 'block' }}>Duration (min)</label>
                <input
                  type="number" placeholder="45"
                  value={form.duration} onChange={e => setForm(f => ({ ...f, duration: e.target.value }))}
                  style={{
                    width: '100%', padding: '12px 16px', borderRadius: '12px', border: `1px solid ${border}`,
                    background: 'var(--color-surface)', color: text1, fontSize: '14px', outline: 'none',
                  }}
                />
              </div>

              <div>
                <label style={{ fontSize: '11px', fontWeight: 700, color: text3, fontFamily: 'var(--font-mono)', textTransform: 'uppercase', marginBottom: '8px', display: 'block' }}>Activity Note</label>
                <input
                  type="text" placeholder="What did you accomplish?"
                  value={form.note} onChange={e => setForm(f => ({ ...f, note: e.target.value }))}
                  style={{
                    width: '100%', padding: '12px 16px', borderRadius: '12px', border: `1px solid ${border}`,
                    background: 'var(--color-surface)', color: text1, fontSize: '14px', outline: 'none',
                  }}
                />
              </div>

              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '12px' }}>
                <button onClick={() => setLogOpen(false)} style={{
                  padding: '12px 24px', borderRadius: '12px', border: `1px solid ${border}`,
                  background: 'transparent', color: text2, fontSize: '14px', fontWeight: 600, cursor: 'pointer',
                }}>Cancel</button>
                <button onClick={() => setLogOpen(false)} style={{
                  padding: '12px 28px', borderRadius: '12px', border: 'none',
                  background: 'var(--color-accent)', color: '#fff', fontSize: '14px', fontWeight: 700, cursor: 'pointer',
                  boxShadow: 'var(--shadow-md)',
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
