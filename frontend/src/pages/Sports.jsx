import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { sportsService } from '../services/sportsService';

/* ── Components ── */

const ArenaCard = ({ type, title, subtitle, status, score, time }) => (
  <motion.div 
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    style={{ 
      background: 'var(--color-surface)', 
      border: '1px solid var(--color-border)', 
      borderRadius: '20px', 
      padding: '20px',
      display: 'flex',
      flexDirection: 'column',
      gap: '12px',
      transition: 'all 0.2s ease',
    }}
    whileHover={{ translateY: -4, boxShadow: '0 12px 30px rgba(0,0,0,0.1)' }}
  >
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <div style={{ fontSize: '10px', fontWeight: 800, color: 'var(--color-accent)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{type}</div>
      <div style={{ padding: '4px 8px', background: status === 'Live' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(0,0,0,0.05)', borderRadius: '6px', color: status === 'Live' ? '#ef4444' : 'var(--color-text-3)', fontSize: '9px', fontWeight: 900 }}>{status}</div>
    </div>

    <div>
      <div style={{ fontSize: '14px', fontWeight: 800, color: 'var(--color-text-1)', marginBottom: '4px', letterSpacing: '-0.01em' }}>{title}</div>
      <div style={{ fontSize: '11px', color: 'var(--color-text-3)', fontWeight: 600 }}>{subtitle}</div>
    </div>

    <div style={{ background: 'var(--color-bg)', borderRadius: '12px', padding: '16px', textAlign: 'center', border: '1px solid var(--color-border)' }}>
      <div style={{ fontSize: '24px', fontWeight: 900, letterSpacing: '0.05em', color: 'var(--color-text-1)' }}>{score || '—'}</div>
    </div>

    {time && <div style={{ fontSize: '10px', fontWeight: 700, color: 'var(--color-text-3)', textAlign: 'center' }}>{time}</div>}
  </motion.div>
);

const TrainingPanel = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
    <div style={{ fontSize: '12px', fontWeight: 800, textTransform: 'uppercase', color: 'var(--color-text-1)' }}>Daily Drill</div>
    <div style={{ background: 'linear-gradient(135deg, #23503B 0%, #166534 100%)', borderRadius: '16px', padding: '24px', color: '#fff' }}>
      <div style={{ fontSize: '10px', fontWeight: 800, opacity: 0.8, marginBottom: '4px' }}>Active Session</div>
      <div style={{ fontSize: '18px', fontWeight: 900, marginBottom: '16px' }}>HIIT Training</div>
      <div style={{ display: 'flex', gap: '16px' }}>
        <div>
          <div style={{ fontSize: '9px', opacity: 0.7 }}>DURATION</div>
          <div style={{ fontSize: '14px', fontWeight: 900 }}>45m</div>
        </div>
        <div>
          <div style={{ fontSize: '9px', opacity: 0.7 }}>INTENSITY</div>
          <div style={{ fontSize: '14px', fontWeight: 900 }}>8/10</div>
        </div>
      </div>
    </div>
  </div>
);

const Sports = () => {
  const [data, setData] = useState({ football: [], f1: [], cricket: [] });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('Arena');
  const [refreshing, setRefreshing] = useState(false);

  const loadData = useCallback(async () => {
    setRefreshing(true);
    try {
      const res = await sportsService.getAggregatedSports();
      setData(res);
    } catch (err) {
      console.error("Sports fetch failed", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 60000); // Auto-refresh every minute
    return () => clearInterval(interval);
  }, [loadData]);

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '32px' }}>
        <div>
          <div style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.15em', color: 'var(--color-text-3)', marginBottom: '8px' }}>Sports Intelligence</div>
          <h1 style={{ font: 'var(--text-hero)', margin: 0, color: 'var(--color-text-1)' }}>The Arena.</h1>
        </div>
        <button 
          onClick={loadData} 
          disabled={refreshing}
          style={{ 
            background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: '12px', padding: '10px 16px', 
            fontSize: '11px', fontWeight: 800, color: 'var(--color-text-2)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' 
          }}
        >
          {refreshing ? 'REFRESHING...' : 'LIVE REFRESH'}
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '32px' }}>
        {/* Main Feed */}
        <div>
          <div style={{ display: 'flex', gap: '24px', marginBottom: '24px', borderBottom: '1px solid var(--color-border)' }}>
            {['Arena', 'Training', 'Insights'].map(t => (
              <button 
                key={t}
                onClick={() => setActiveTab(t)}
                style={{ 
                  padding: '12px 4px', background: 'none', border: 'none', fontSize: '12px', fontWeight: 800, 
                  color: activeTab === t ? 'var(--color-accent)' : 'var(--color-text-3)',
                  borderBottom: activeTab === t ? '2px solid var(--color-accent)' : '2px solid transparent',
                  cursor: 'pointer'
                }}
              >
                {t}
              </button>
            ))}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
            {loading ? (
              <div style={{ gridColumn: '1/-1', padding: '100px 0', textAlign: 'center', color: 'var(--color-text-3)', fontSize: '13px', fontWeight: 700 }}>TUNING FEEDS...</div>
            ) : activeTab === 'Arena' ? (
              <>
                {(data.football || []).map((m, i) => (
                  <ArenaCard 
                    key={`fb-${i}`}
                    type="Football"
                    title={`${m.teams?.home?.name || 'Home'} vs ${m.teams?.away?.name || 'Away'}`}
                    subtitle={m.league?.name || 'Match'}
                    status={m.fixture?.status?.short === 'FT' ? 'Finished' : (m.fixture?.status?.short === 'NS' ? 'Scheduled' : 'Live')}
                    score={m.score || (m.goals ? `${m.goals.home ?? 0} - ${m.goals.away ?? 0}` : '—')}
                    time={m.fixture?.status?.elapsed ? `${m.fixture.status.elapsed}'` : null}
                  />
                ))}
                {(data.cricket || []).map((c, i) => (
                  <ArenaCard 
                    key={`cr-${i}`}
                    type="Cricket"
                    title={c.name || c.title}
                    subtitle={c.status}
                    status={c.live ? 'Live' : 'Match'}
                    score={c.score || '—'}
                    time={c.description}
                  />
                ))}
                {(data.f1 || []).map((f, i) => (
                  <ArenaCard 
                    key={`f1-${i}`}
                    type="F1"
                    title={f.competition?.name || f.name || 'Grand Prix'}
                    subtitle={f.circuit?.name || 'Circuit'}
                    status={f.status || 'Scheduled'}
                    score={f.type || 'Race'}
                    time={f.date || 'TBD'}
                  />
                ))}
              </>
            ) : activeTab === 'Training' ? (
              <div style={{ gridColumn: '1/-1' }}>
                <TrainingPanel />
              </div>
            ) : (
              <div style={{ gridColumn: '1/-1', padding: '60px', textAlign: 'center', color: 'var(--color-text-3)', border: '1px dashed var(--color-border)', borderRadius: '20px' }}>
                Analytical models converging. Insights available post-session.
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: '20px', padding: '24px' }}>
            <div style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', color: 'var(--color-text-3)', marginBottom: '16px' }}>Quick Scores</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {(data.recentMatches || []).map((m, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: i < (data.recentMatches.length - 1) ? '1px solid var(--color-border)' : 'none' }}>
                  <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--color-text-1)' }}>{m.title}</div>
                  <div style={{ fontSize: '12px', fontWeight: 900, color: 'var(--color-accent)' }}>{m.score}</div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: '20px', padding: '24px' }}>
            <div style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', color: 'var(--color-text-3)', marginBottom: '16px' }}>Sports Intel</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {(data.news || []).map((n, i) => (
                <div key={i}>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--color-text-1)', marginBottom: '4px', lineHeight: 1.4 }}>{n.title}</div>
                  <div style={{ display: 'flex', gap: '8px', fontSize: '10px', color: 'var(--color-text-3)', fontWeight: 600 }}>
                    <span>{n.time}</span>
                    <span>·</span>
                    <span>{n.source}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sports;
