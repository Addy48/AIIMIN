import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { sportsService } from '../services/sportsService';

/* ── Components ── */

const ArenaCard = ({ type, title, subtitle, status, score, time, logo }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    style={{ 
      background: 'var(--color-surface)', 
      border: '1px solid var(--color-border)', 
      borderRadius: '24px', 
      padding: '24px',
      position: 'relative',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
      gap: '16px',
      boxShadow: '0 4px 20px rgba(0,0,0,0.02)'
    }}
  >
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
      <div style={{ padding: '6px 12px', background: 'var(--color-accent-dim)', color: 'var(--color-accent)', borderRadius: '100px', fontSize: '10px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em' }}>{type}</div>
      <div style={{ fontSize: '11px', fontWeight: 800, color: status === 'Live' ? '#ef4444' : 'var(--color-text-3)', display: 'flex', alignItems: 'center', gap: '6px' }}>
        {status === 'Live' && <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#ef4444', animation: 'pulse 1.5s infinite' }} />}
        {status}
      </div>
    </div>

    <div>
      <h3 style={{ fontSize: '20px', fontWeight: 800, color: 'var(--color-text-1)', margin: 0 }}>{title}</h3>
      <p style={{ fontSize: '13px', color: 'var(--color-text-3)', margin: '4px 0 0' }}>{subtitle}</p>
    </div>

    <div style={{ background: 'var(--color-bg)', borderRadius: '16px', padding: '16px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '20px' }}>
      {score ? (
        <div style={{ fontSize: '28px', fontWeight: 900, letterSpacing: '0.1em', fontFamily: 'monospace' }}>{score}</div>
      ) : (
        <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--color-text-3)' }}>TBD</div>
      )}
    </div>

    {time && <div style={{ fontSize: '11px', fontWeight: 700, textAlign: 'center', color: 'var(--color-text-3)' }}>{time}</div>}
  </motion.div>
);

const TrainingPanel = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
    <div style={{ fontSize: '14px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--color-text-1)' }}>Daily Drill</div>
    <div style={{ background: 'linear-gradient(135deg, #23503B 0%, #166534 100%)', borderRadius: '24px', padding: '32px', color: '#fff', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', right: '-20px', bottom: '-20px', fontSize: '120px', opacity: 0.1 }}>👟</div>
      <div style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', opacity: 0.8, marginBottom: '8px' }}>Active Session</div>
      <div style={{ fontSize: '24px', fontWeight: 900, marginBottom: '20px' }}>High Intensity Interval</div>
      <div style={{ display: 'flex', gap: '24px' }}>
        <div>
          <div style={{ fontSize: '10px', opacity: 0.7, fontWeight: 700 }}>DURATION</div>
          <div style={{ fontSize: '18px', fontWeight: 900 }}>45m</div>
        </div>
        <div>
          <div style={{ fontSize: '10px', opacity: 0.7, fontWeight: 700 }}>INTENSITY</div>
          <div style={{ fontSize: '18px', fontWeight: 900 }}>8/10</div>
        </div>
      </div>
      <button style={{ marginTop: '24px', width: '100%', padding: '12px', borderRadius: '12px', background: '#fff', color: '#23503B', border: 'none', fontWeight: 900, fontSize: '13px', cursor: 'pointer' }}>START TRACKING</button>
    </div>
  </div>
);

const Sports = () => {
  const [data, setData] = useState({ football: [], f1: [], cricket: [] });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('Arena');

  useEffect(() => {
    const load = async () => {
      try {
        const res = await sportsService.getAggregatedSports();
        setData(res);
      } catch (err) {
        console.error("Sports fetch failed", err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <div style={{ maxWidth: 'var(--content-max)', margin: '0 auto', padding: '0 var(--content-pad)' }}>
      
      {/* Header */}
      <div style={{ marginBottom: '40px' }}>
        <div style={{ fontSize: '12px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.2em', color: 'var(--color-accent)', marginBottom: '8px' }}>Performance Monitoring</div>
        <h1 style={{ fontSize: '40px', fontWeight: 800, color: 'var(--color-text-1)', margin: 0, letterSpacing: '-0.02em' }}>Arena.</h1>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '40px' }}>
        
        {/* Main Feed */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          
          {/* Tabs */}
          <div style={{ display: 'flex', gap: '24px', borderBottom: '1px solid var(--color-border)' }}>
            {['Arena', 'Schedule', 'Training'].map(t => (
              <button 
                key={t}
                onClick={() => setActiveTab(t)}
                style={{ 
                  padding: '16px 0', 
                  background: 'none', 
                  border: 'none', 
                  fontSize: '14px', 
                  fontWeight: 800, 
                  color: activeTab === t ? 'var(--color-accent)' : 'var(--color-text-3)',
                  borderBottom: activeTab === t ? '2px solid var(--color-accent)' : '2px solid transparent',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                {t}
              </button>
            ))}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
            {loading ? (
              <div style={{ gridColumn: '1/-1', padding: '100px', textAlign: 'center', color: 'var(--color-text-3)', fontWeight: 700 }}>INITIALIZING FEEDS...</div>
            ) : activeTab === 'Arena' ? (
              <>
                {/* Football Matches */}
                {(data.football || []).map((m, i) => (
                  <ArenaCard 
                    key={`fb-${i}`}
                    type="Football"
                    title={`${m.teams?.home?.name || 'Home'} vs ${m.teams?.away?.name || 'Away'}`}
                    subtitle={m.league?.name || 'Match'}
                    status={m.fixture?.status?.short === 'FT' ? 'Finished' : 'Live'}
                    score={`${m.goals?.home ?? 0} - ${m.goals?.away ?? 0}`}
                    time={m.fixture?.status?.elapsed ? `${m.fixture.status.elapsed}'` : null}
                  />
                ))}
                {/* Cricket Matches */}
                {(data.cricket || []).map((c, i) => (
                  <ArenaCard 
                    key={`cr-${i}`}
                    type="Cricket"
                    title={c.title}
                    subtitle={c.status}
                    status={c.live ? 'Live' : 'Match'}
                    score={c.score}
                    time={c.description}
                  />
                ))}
                {/* F1 Events */}
                {(data.f1 || []).map((f, i) => (
                  <ArenaCard 
                    key={`f1-${i}`}
                    type="F1"
                    title={f.competition?.name || 'Grand Prix'}
                    subtitle={f.circuit?.name || 'Circuit'}
                    status={f.status || 'Scheduled'}
                    score={f.type || 'Race'}
                    time={f.date || 'TBD'}
                  />
                ))}
                {(data.football?.length === 0 && data.f1?.length === 0 && data.cricket?.length === 0) && (
                   <div style={{ gridColumn: '1/-1', textAlign:'center', padding:'40px', color:'var(--color-text-3)' }}>No live events detected. System in standby.</div>
                )}
              </>
            ) : (
               <div style={{ gridColumn: '1/-1', textAlign:'center', padding:'100px', color:'var(--color-text-3)', fontWeight:700 }}>{activeTab} CONTENT LOADED.</div>
            )}
          </div>

        </div>

        {/* Sidebar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          <TrainingPanel />
          
          <div style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: '24px', padding: '24px' }}>
            <div style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', color: 'var(--color-text-3)', marginBottom: '20px' }}>Athlete Profile</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {[
                { label: 'Stamina', val: 78 },
                { label: 'Strength', val: 64 },
                { label: 'Agility', val: 82 },
                { label: 'Recovery', val: 91 },
              ].map(s => (
                <div key={s.label}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '11px', fontWeight: 800 }}>
                    <span style={{ color: 'var(--color-text-2)' }}>{s.label}</span>
                    <span style={{ color: 'var(--color-accent)' }}>{s.val}%</span>
                  </div>
                  <div style={{ height: '4px', background: 'var(--color-border)', borderRadius: '2px' }}>
                    <div style={{ height: '100%', width: `${s.val}%`, background: 'var(--color-accent)', borderRadius: '2px' }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>

      <style>{`
        @keyframes pulse {
          0% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.5); opacity: 0.5; }
          100% { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default Sports;
