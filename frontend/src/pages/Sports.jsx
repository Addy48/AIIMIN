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
  const [footballRecent, setFootballRecent] = useState([]);
  const [footballUpcoming, setFootballUpcoming] = useState([]);
  const [f1Standings, setF1Standings] = useState([]);
  const [f1Races, setF1Races] = useState([]);
  const [cricketLive, setCricketLive] = useState([]);
  const [loadingLive, setLoadingLive] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);

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
      const [fb, f1S, f1R, cr] = await Promise.all([
        sportsService.fetchFootballLive(),
        sportsService.fetchF1Standings(),
        sportsService.fetchF1Races(),
        sportsService.fetchCricketLive()
      ]);
      setFootballLive(fb.slice(0, 5));
      setF1Standings(f1S.slice(0, 10));
      setF1Races(f1R);
      setCricketLive(cr.slice(0, 5));
      setLastUpdated(new Date());

      // If no live football, fetch recent results and upcoming fixtures
      if (fb.length === 0) {
        const [recent, upcoming] = await Promise.all([
          sportsService.fetchFootballRecent(),
          sportsService.fetchFootballUpcoming()
        ]);
        setFootballRecent(recent.slice(0, 5));
        setFootballUpcoming(upcoming.slice(0, 5));
      } else {
        setFootballRecent([]);
        setFootballUpcoming([]);
      }
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
    <div style={{ flex: 1, paddingBottom: '80px', maxWidth: '1200px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: '40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ 
            fontSize: '11px', 
            fontWeight: 800, 
            letterSpacing: '0.2em', 
            textTransform: 'uppercase', 
            color: 'var(--color-accent)', 
            marginBottom: '12px' 
          }}>
            Performance · Arena
          </div>
          <h1 style={{ 
            fontSize: '42px', 
            fontWeight: 800, 
            color: text1, 
            margin: 0, 
            letterSpacing: '-0.04em',
            fontFamily: 'var(--font-serif)'
          }}>
            {activeTab === 'activity' ? 'The daily pursuit.' : 'Live competition.'}
          </h1>
        </div>
        
        {/* Tab Switcher */}
        <div style={{ 
            display: 'flex', 
            background: 'var(--glass-bg)', 
            padding: '4px', 
            borderRadius: '16px', 
            border: `1px solid ${border}`,
            backdropFilter: 'blur(10px)'
        }}>
          {['activity', 'live'].map(t => (
            <button
              key={t}
              onClick={() => setActiveTab(t)}
              style={{
                padding: '10px 24px', 
                borderRadius: '12px', 
                border: 'none',
                background: activeTab === t ? 'var(--color-text-1)' : 'transparent',
                color: activeTab === t ? 'var(--color-base)' : text3,
                fontSize: '12px', 
                fontWeight: 800, 
                textTransform: 'uppercase', 
                cursor: 'pointer',
                letterSpacing: '0.05em',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
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
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '40px' }}>
              <StatCard label="Volume" value={`${Math.round(totalMin / 60)}h ${totalMin % 60}m`} sub="Active this week" color="var(--color-accent)" isDark={isDark} />
              <StatCard label="Momentum" value={`3 days`} sub="Current active streak" color="#3B82F6" isDark={isDark} />
              <StatCard label="Consistency" value={MOCK_SESSIONS.length} sub="Sessions completed" color="#8B5CF6" isDark={isDark} />
              <StatCard label="Top Focus" value="Gym" sub="Power & Endurance" color="#F59E0B" isDark={isDark} />
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
              <section className="glass-panel" style={{ padding: '24px', borderRadius: '24px', border: `1px solid ${border}`, background: 'var(--bg-card)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <h3 style={{ fontSize: '13px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.15em', color: text1, margin: 0 }}>⚽ Pitch Overview</h3>
                    {lastUpdated && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10B981', boxShadow: '0 0 8px #10B981' }} />
                        <span style={{ fontSize: '10px', color: text3, fontFamily: 'var(--font-mono)', fontWeight: 600 }}>
                          LIVE · {lastUpdated.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    )}
                  </div>
                  <button 
                    onClick={fetchLiveData} 
                    disabled={loadingLive}
                    style={{
                      background: 'var(--bg-elevated)', border: `1px solid ${border}`, color: text2, 
                      fontSize: '11px', fontWeight: 700, cursor: 'pointer', padding: '6px 12px', borderRadius: '8px',
                      display: 'flex', alignItems: 'center', gap: '6px'
                    }}
                  >
                    {loadingLive ? '...' : 'Refresh'}
                  </button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {footballLive.length > 0 ? (
                    footballLive.map((match, i) => (
                      <div key={i} style={{ 
                        padding: '20px', borderRadius: '16px', display: 'flex', alignItems: 'center', 
                        justifyContent: 'space-between', background: 'var(--bg-elevated)', border: `1px solid ${border}`,
                        position: 'relative', overflow: 'hidden'
                      }}>
                        <div style={{ position: 'absolute', top: 0, left: 0, bottom: 0, width: '4px', background: 'var(--color-accent)' }} />
                        <div style={{ flex: 1, textAlign: 'right', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '12px' }}>
                          <span style={{ fontSize: '14px', fontWeight: 700 }}>{match.teams.home.name}</span>
                          <img src={match.teams.home.logo} alt="" style={{ width: '32px', height: '32px', objectFit: 'contain' }} />
                        </div>
                        <div style={{ width: '120px', textAlign: 'center' }}>
                          <div style={{ fontSize: '28px', fontWeight: 800, fontFamily: 'var(--font-mono)', letterSpacing: '4px', color: 'var(--color-accent)' }}>
                            {match.goals.home} - {match.goals.away}
                          </div>
                          <div style={{ fontSize: '10px', color: text3, fontWeight: 800, textTransform: 'uppercase', marginTop: '4px' }}>
                            {match.fixture.status.short === '1H' || match.fixture.status.short === '2H' 
                              ? `${match.fixture.status.elapsed}'` 
                              : match.fixture.status.short}
                          </div>
                        </div>
                        <div style={{ flex: 1, textAlign: 'left', display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <img src={match.teams.away.logo} alt="" style={{ width: '32px', height: '32px', objectFit: 'contain' }} />
                          <span style={{ fontSize: '14px', fontWeight: 700 }}>{match.teams.away.name}</span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <>
                      {/* Recent Results */}
                      {footballRecent.length > 0 && (
                        <div style={{ marginBottom: '16px' }}>
                          <div style={{ fontSize: '11px', fontWeight: 800, color: text3, marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.1em', display: 'flex', alignItems: 'center', gap: '8px' }}>
                             <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: text3 }}></span> Recent Results
                          </div>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            {footballRecent.map((match, i) => (
                              <div key={i} style={{ 
                                padding: '14px 20px', borderRadius: '14px', display: 'flex', alignItems: 'center', 
                                justifyContent: 'space-between', background: 'rgba(255,255,255,0.02)', border: `1px solid ${border}` 
                              }}>
                                <div style={{ flex: 1, textAlign: 'right', fontSize: '13px', fontWeight: 600, color: text2 }}>{match.teams.home.name}</div>
                                <div style={{ width: '80px', textAlign: 'center', fontSize: '16px', fontWeight: 800, color: text1, fontFamily: 'var(--font-mono)' }}>
                                  {match.goals.home} - {match.goals.away}
                                </div>
                                <div style={{ flex: 1, textAlign: 'left', fontSize: '13px', fontWeight: 600, color: text2 }}>{match.teams.away.name}</div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {/* Upcoming Fixtures */}
                      {footballUpcoming.length > 0 && (
                        <div>
                          <div style={{ fontSize: '11px', fontWeight: 800, color: 'var(--color-accent)', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.1em', display: 'flex', alignItems: 'center', gap: '8px' }}>
                             <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--color-accent)' }}></span> Upcoming Fixtures
                          </div>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            {footballUpcoming.map((match, i) => {
                              const matchDate = new Date(match.fixture.date);
                              const now = new Date();
                              const diffMs = matchDate - now;
                              const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
                              const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
                              
                              return (
                                <div key={i} style={{ 
                                  padding: '16px 24px', 
                                  borderRadius: '20px', 
                                  display: 'flex', 
                                  alignItems: 'center', 
                                  justifyContent: 'space-between', 
                                  background: 'var(--bg-elevated)', 
                                  border: `1px solid ${border}`,
                                  position: 'relative',
                                  overflow: 'hidden'
                                }}>
                                  <div style={{ flex: 1, textAlign: 'right', fontSize: '14px', fontWeight: 700, color: text1 }}>{match.teams.home.name}</div>
                                  <div style={{ width: '160px', textAlign: 'center', position: 'relative' }}>
                                    <div style={{ 
                                        fontSize: '10px', 
                                        fontWeight: 900, 
                                        color: 'var(--color-accent)', 
                                        textTransform: 'uppercase', 
                                        letterSpacing: '0.1em',
                                        background: 'var(--color-accent-dim)',
                                        padding: '2px 8px',
                                        borderRadius: '99px',
                                        display: 'inline-block',
                                        marginBottom: '6px'
                                    }}>
                                      {diffHrs > 0 ? `Starts in ${diffHrs}h ${diffMins}m` : `Imminent`}
                                    </div>
                                    <div style={{ fontSize: '12px', color: text3, fontWeight: 600, fontFamily: 'var(--font-mono)' }}>
                                      {matchDate.toLocaleDateString([], { month: 'short', day: 'numeric' })} · {matchDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </div>
                                  </div>
                                  <div style={{ flex: 1, textAlign: 'left', fontSize: '14px', fontWeight: 700, color: text1 }}>{match.teams.away.name}</div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}
                      
                      {footballRecent.length === 0 && footballUpcoming.length === 0 && (
                        <div style={{ padding: '60px 40px', textAlign: 'center', color: text3, fontSize: '13px', fontStyle: 'italic', background: 'rgba(255,255,255,0.01)', borderRadius: '16px', border: `1px dashed ${border}` }}>
                          No football data currently available. Check back soon.
                        </div>
                      )}
                    </>
                  )}
                </div>

              </section>

              {/* Cricket Live */}
              <section className="glass-panel" style={{ padding: '24px', borderRadius: '24px', border: `1px solid ${border}`, background: 'var(--bg-card)' }}>
                <h3 style={{ fontSize: '13px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', color: text1, marginBottom: '24px' }}>🏏 Cricket Matches</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {cricketLive.length > 0 ? cricketLive.map((match, i) => (
                    <div key={i} style={{ 
                      padding: '20px', borderRadius: '16px', background: 'var(--bg-elevated)', 
                      border: `1px solid ${border}`, transition: 'all 200ms ease'
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: '11px', color: 'var(--color-accent)', fontWeight: 800, textTransform: 'uppercase', marginBottom: '4px' }}>{match.status}</div>
                          <div style={{ fontSize: '15px', fontWeight: 700, color: text1, lineHeight: 1.4 }}>{match.name}</div>
                        </div>
                        <div style={{ fontSize: '10px', padding: '4px 8px', borderRadius: '6px', background: border, color: text2, fontWeight: 700 }}>{match.matchType.toUpperCase()}</div>
                      </div>
                      
                      {match.score && match.score.length > 0 && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', borderTop: `1px solid ${border}`, paddingTop: '16px' }}>
                          {match.score.map((s, idx) => (
                            <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <div style={{ fontSize: '13px', fontWeight: 600, color: text2 }}>{s.inning}</div>
                              <div style={{ fontSize: '15px', fontWeight: 800, color: 'var(--color-accent)', fontFamily: 'var(--font-mono)' }}>
                                {s.r}/{s.w} <span style={{ fontSize: '11px', fontWeight: 500, color: text3, marginLeft: '4px' }}>({s.o})</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )) : (
                    <div style={{ padding: '40px', textAlign: 'center', color: text3, fontSize: '13px', fontStyle: 'italic' }}>No active cricket matches found.</div>
                  )}
                </div>
              </section>
            </div>

            {/* Right: F1 & Stats */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
              {/* F1 Races */}
              <section className="glass-panel" style={{ padding: '24px', borderRadius: '24px', border: `1px solid ${border}`, background: 'var(--bg-card)' }}>
                <h3 style={{ fontSize: '13px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', color: text1, marginBottom: '24px' }}>🏎️ F1 Schedule</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {f1Races.map((race, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '16px', paddingBottom: '16px', borderBottom: i < f1Races.length - 1 ? `1px solid ${border}` : 'none' }}>
                      <div style={{ 
                        width: '50px', height: '50px', borderRadius: '12px', background: 'var(--bg-elevated)', 
                        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', border: `1px solid ${border}`
                      }}>
                        <div style={{ fontSize: '10px', fontWeight: 800, color: 'var(--color-accent)', textTransform: 'uppercase' }}>{new Date(race.date).toLocaleDateString('en-US', { month: 'short' })}</div>
                        <div style={{ fontSize: '18px', fontWeight: 800 }}>{new Date(race.date).getDate()}</div>
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: '14px', fontWeight: 700, color: text1 }}>{race.competition.name}</div>
                        <div style={{ fontSize: '11px', color: text3, marginTop: '2px' }}>{race.circuit.name} · {race.competition.location.city}</div>
                      </div>
                    </div>
                  ))}
                  {f1Races.length === 0 && <div style={{ textAlign: 'center', padding: '20px', color: text3, fontSize: '13px' }}>No upcoming races.</div>}
                </div>
              </section>

              {/* F1 Standings */}
              <section className="glass-panel" style={{ padding: '24px', borderRadius: '24px', border: `1px solid ${border}`, background: 'var(--bg-card)' }}>
                <h3 style={{ fontSize: '13px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', color: text1, marginBottom: '24px' }}>🏆 F1 Standings</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {f1Standings.map((driver, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '8px', borderRadius: '12px', background: i < 3 ? 'rgba(226,183,20,0.05)' : 'transparent' }}>
                      <span style={{ fontSize: '11px', fontWeight: 800, color: text3, width: '24px' }}>{driver.position}</span>
                      <img src={driver.driver.image} alt="" style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'var(--bg-elevated)', objectFit: 'contain', border: `1px solid ${border}` }} />
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: '13px', fontWeight: 700, color: text1 }}>{driver.driver.name}</div>
                        <div style={{ fontSize: '10px', color: text3 }}>{driver.team.name}</div>
                      </div>
                      <div style={{ fontSize: '14px', fontWeight: 800, color: 'var(--color-accent)', fontFamily: 'var(--font-mono)' }}>{driver.points}</div>
                    </div>
                  ))}
                  {f1Standings.length === 0 && <div style={{ textAlign: 'center', padding: '20px', color: text3, fontSize: '13px' }}>Standings unavailable.</div>}
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
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
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
                  <label style={{ fontSize: '11px', fontWeight: 700, color: text3, fontFamily: 'var(--font-mono)', textTransform: 'uppercase', marginBottom: '8px', display: 'block' }}>Rating (1-5)</label>
                  <div style={{ display: 'flex', gap: '8px', padding: '8px 0' }}>
                    {[1, 2, 3, 4, 5].map(star => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setForm(f => ({ ...f, rating: star }))}
                        style={{
                          background: 'none', border: 'none', cursor: 'pointer',
                          fontSize: '20px', color: star <= form.rating ? 'var(--color-accent)' : border,
                          padding: 0, transition: 'all 0.2s'
                        }}
                      >
                        ★
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <label style={{ fontSize: '11px', fontWeight: 700, color: text3, fontFamily: 'var(--font-mono)', textTransform: 'uppercase', marginBottom: '8px', display: 'block' }}>Date</label>
                <input
                  type="date"
                  value={form.date || new Date().toISOString().split('T')[0]}
                  onChange={e => setForm(f => ({ ...f, date: e.target.value }))}
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
