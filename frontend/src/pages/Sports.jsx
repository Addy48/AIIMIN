import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { RefreshCw, Wifi, AlertTriangle, Calendar, Trophy, ChevronRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { sportsService } from '../services/sportsService';
import PageHeader from '../components/layout/PageHeader';
import { formatDate } from '../utils/formatDate';

const MatchCard = ({ match, isF1 = false }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  if (isF1) {
    return (
      <div className="hover-border-accent" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', background: 'rgba(255,255,255,0.03)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.08)', backdropFilter: 'blur(10px)', transition: 'all 0.3s ease', cursor: 'pointer' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: '48px', height: '48px', background: 'rgba(255,255,255,0.05)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-text-2)', fontWeight: 800, flexShrink: 0 }}>
            🏎️
          </div>
          <div>
            <div style={{ fontSize: '15px', fontWeight: 800, color: 'var(--color-text-1)' }}>{match.name}</div>
            <div style={{ fontSize: '12px', color: 'var(--color-text-3)', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Calendar size={12} /> {match.statusShort}</span>
              {match.venue && <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>• {match.venue}</span>}
              {match.period && <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>• Session: {match.period}</span>}
              {match.statusDetail && match.statusDetail !== match.statusShort && <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>• {match.statusDetail}</span>}
            </div>
            {match.drivers && match.drivers.length > 0 && (
              <div style={{ display: 'flex', gap: '8px', marginTop: '10px', flexWrap: 'wrap' }}>
                {match.drivers.map((d, i) => (
                  <span key={i} style={{ fontSize: '11px', fontWeight: 700, padding: '4px 8px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)', borderRadius: '6px', color: 'var(--color-text-2)', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                    <span style={{ color: 'var(--color-text-4)' }}>P{d.position}</span> {d.name} {d.time && <span style={{ color: 'var(--color-text-3)' }}>({d.time})</span>}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ padding: '6px 12px', borderRadius: '20px', fontSize: '11px', fontWeight: 800, background: match.isLive ? 'rgba(239,68,68,0.15)' : match.isFinished ? 'rgba(255,255,255,0.05)' : 'rgba(255,107,53,0.15)', color: match.isLive ? '#EF4444' : match.isFinished ? 'var(--color-text-3)' : '#ff6b35' }}>
            {match.isLive ? 'LIVE' : match.isFinished ? 'FINISHED' : 'UPCOMING'}
          </span>
          <ChevronRight size={18} color="var(--color-text-4)" />
        </div>
      </div>
    );
  }

  return (
    <div className="hover-border-accent" onClick={() => setIsExpanded(!isExpanded)} style={{ display: 'flex', flexDirection: 'column', padding: '16px 20px', background: 'rgba(255,255,255,0.03)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.08)', backdropFilter: 'blur(10px)', transition: 'all 0.3s ease', cursor: 'pointer', position: 'relative', overflow: 'hidden' }}>
      {match.isLive && <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '2px', background: 'linear-gradient(90deg, #EF4444, transparent)' }} />}
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <div style={{ fontSize: '11px', color: 'var(--color-text-3)', fontWeight: 700, letterSpacing: '0.5px' }}>
          {match.statusShort}
        </div>
        <span style={{ padding: '4px 10px', borderRadius: '20px', fontSize: '10px', fontWeight: 800, background: match.isLive ? 'rgba(239,68,68,0.15)' : match.isFinished ? 'rgba(255,255,255,0.05)' : 'rgba(255,107,53,0.15)', color: match.isLive ? '#EF4444' : match.isFinished ? 'var(--color-text-3)' : '#ff6b35', letterSpacing: '0.5px' }}>
          {match.isLive ? 'LIVE' : match.isFinished ? 'FT' : 'UPCOMING'}
        </span>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '16px' }}>
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '12px' }}>
          {match.home.logo ? <img src={match.home.logo} alt="" style={{ width: '28px', height: '28px', objectFit: 'contain' }} onError={(e) => e.target.style.display='none'} /> : <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'rgba(255,255,255,0.1)' }} />}
          <div style={{ fontSize: '15px', fontWeight: match.home.winner ? 900 : 700, color: match.home.winner ? 'var(--color-text-1)' : 'var(--color-text-2)' }}>{match.home.name}</div>
        </div>
        <div style={{ fontSize: '18px', fontWeight: 900, color: 'var(--color-text-1)' }}>{match.home.score}</div>
      </div>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '16px', marginTop: '12px' }}>
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '12px' }}>
          {match.away.logo ? <img src={match.away.logo} alt="" style={{ width: '28px', height: '28px', objectFit: 'contain' }} onError={(e) => e.target.style.display='none'} /> : <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'rgba(255,255,255,0.1)' }} />}
          <div style={{ fontSize: '15px', fontWeight: match.away.winner ? 900 : 700, color: match.away.winner ? 'var(--color-text-1)' : 'var(--color-text-2)' }}>{match.away.name}</div>
        </div>
        <div style={{ fontSize: '18px', fontWeight: 900, color: 'var(--color-text-1)' }}>{match.away.score}</div>
      </div>

      <AnimatePresence>
        {isExpanded && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }} 
            animate={{ opacity: 1, height: 'auto' }} 
            exit={{ opacity: 0, height: 0 }}
            style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid rgba(255,255,255,0.05)', display: 'flex', flexDirection: 'column', gap: '8px', overflow: 'hidden' }}
          >
            {match.venue && <div style={{ fontSize: '13px', color: 'var(--color-text-3)' }}><strong style={{ color: 'var(--color-text-2)' }}>Venue:</strong> {match.venue}</div>}
            {match.league && <div style={{ fontSize: '13px', color: 'var(--color-text-3)' }}><strong style={{ color: 'var(--color-text-2)' }}>League:</strong> {match.league}</div>}
            {match.notes && match.notes.length > 0 && (
              <div style={{ fontSize: '13px', color: 'var(--color-text-3)', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <strong style={{ color: 'var(--color-text-2)' }}>Notes:</strong>
                <ul style={{ margin: 0, paddingLeft: '20px' }}>
                  {match.notes.map((n, i) => <li key={i}>{n}</li>)}
                </ul>
              </div>
            )}
            {!match.isLive && !match.isFinished && (
               <div style={{ fontSize: '13px', color: 'var(--color-text-3)', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                 <strong style={{ color: 'var(--color-text-2)' }}>Status:</strong>
                 <span>Match yet to start</span>
                 {match.date && (
                   <div style={{ marginTop: '4px' }}>
                     <strong style={{ color: 'var(--color-text-2)' }}>Starts At:</strong> {new Date(match.date).toLocaleString('en-US', { timeZone: 'Asia/Kolkata', weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })} IST
                   </div>
                 )}
               </div>
            )}
            {match.isLive && (
               <div style={{ fontSize: '13px', color: 'var(--color-text-3)', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                 <strong style={{ color: 'var(--color-text-2)' }}>Status:</strong>
                 <span>Ongoing ({match.statusDetail || 'In Progress'})</span>
                 {match.clock && <div><strong style={{ color: 'var(--color-text-2)' }}>Clock:</strong> {match.clock}</div>}
                 {match.period && <div><strong style={{ color: 'var(--color-text-2)' }}>Period:</strong> {match.period}</div>}
               </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const Sports = () => {
  const navigate = useNavigate();
  const { user: authUser } = useAuth();
  const user = React.useMemo(() => authUser || { id: 'guest', full_name: 'Guest', username: 'GUEST', role: 'guest', isGuest: true }, [authUser]);
  const [activeTab, setActiveTab] = useState('Cricket'); 
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [feed, setFeed] = useState(null);

  const fetchScores = async () => {
    if (refreshing) return;
    setRefreshing(true);
    setError(null);
    try {
      const newFeed = await sportsService.getAggregatedSports();
      setFeed(newFeed);
    } catch (err) {
      console.error('Failed to sync sports:', err);
      setError('Could not sync sports data right now. Please try again later.');
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchScores();
    const interval = setInterval(() => {
      fetchScores();
    }, 2 * 60 * 1000); // Poll every 2 minutes
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, navigate]);

  const tabs = ['Cricket', 'Football', 'Basketball', 'F1'];

  const renderLeagueSection = (leagueItem) => {
    if (!leagueItem.events || leagueItem.events.length === 0) return null;
    return (
      <div key={leagueItem.league.name} style={{ marginBottom: '40px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
          <span style={{ fontSize: '20px' }}>{leagueItem.league.flag}</span>
          <h2 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--color-text-1)', letterSpacing: '-0.5px' }}>{leagueItem.league.name}</h2>
          <div style={{ flex: 1, height: '1px', background: 'var(--border)', marginLeft: '16px' }} />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '16px' }}>
          {leagueItem.events.map(match => (
            <MatchCard key={match.id} match={match} />
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="page-container" style={{ paddingBottom: '100px' }}>
      <PageHeader 
        title="The Arena."
        subtitle="Live Global Sports Intelligence"
        rightContent={
          <>
            <div style={{
              display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 16px', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)', borderRadius: '12px', fontSize: '12px', fontWeight: 800, color: 'var(--color-text-2)'
            }}>
              <Wifi size={14} style={{ strokeWidth: 2.5, color: '#10B981' }} /> Live ESPN Feed
            </div>
            <button
              onClick={fetchScores}
              disabled={refreshing}
              style={{
                background: 'var(--color-text-1)', color: 'var(--color-base)', border: 'none', borderRadius: '12px', padding: '10px 20px', fontSize: '12px', fontWeight: 800, cursor: refreshing ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', gap: '8px', transition: 'all 0.2s ease', opacity: refreshing ? 0.7 : 1
              }}
            >
              <RefreshCw size={14} className={refreshing ? 'spin-anim' : ''} style={{ transition: 'transform 0.5s' }} />
              {refreshing ? 'Syncing...' : 'Sync Scores'}
            </button>
          </>
        }
      />

      {error && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} style={{ padding: '16px 20px', background: 'rgba(239, 68, 68, 0.1)', color: '#EF4444', border: '1px solid rgba(239, 68, 68, 0.2)', borderRadius: '16px', marginBottom: '32px', display: 'flex', alignItems: 'center', gap: '12px', fontSize: '14px', fontWeight: 600 }}>
          <AlertTriangle size={18} /> {error}
        </motion.div>
      )}

      {/* Tabs */}
      <div style={{
        display: 'flex', gap: '12px', marginBottom: '40px', overflowX: 'auto', paddingBottom: '8px', WebkitOverflowScrolling: 'touch'
      }}>
        {tabs.map((tab) => {
          const isActive = activeTab === tab;
          const emojis = { 'Cricket': '🏏', 'Football': '⚽', 'Basketball': '🏀', 'F1': '🏎️' };
          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                padding: '12px 28px',
                borderRadius: '100px',
                border: `1px solid ${isActive ? 'var(--color-accent)' : 'var(--border)'}`,
                background: isActive ? 'var(--color-accent)' : 'rgba(255,255,255,0.02)',
                color: isActive ? '#000' : 'var(--color-text-2)',
                fontSize: '14px',
                fontWeight: 800,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                whiteSpace: 'nowrap'
              }}
            >
              {emojis[tab]} {tab}
            </button>
          );
        })}
      </div>

      {/* Panels */}
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        <AnimatePresence mode="wait">
          {activeTab === 'Cricket' && (
            <motion.div key="cricket" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }} transition={{ duration: 0.3 }}>
              {feed?.cricket?.length > 0 ? (
                feed.cricket.map(renderLeagueSection)
              ) : (
                <EmptyState icon="🏏" message="No cricket matches found right now." refreshing={refreshing} nextMoment={collectNextMoment(feed, 'Cricket')} />
              )}
            </motion.div>
          )}

          {activeTab === 'Football' && (
            <motion.div key="football" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }} transition={{ duration: 0.3 }}>
              {feed?.football?.length > 0 ? (
                feed.football.map(renderLeagueSection)
              ) : (
                <EmptyState icon="⚽" message="No football matches tracked right now." refreshing={refreshing} nextMoment={collectNextMoment(feed, 'Football')} />
              )}
            </motion.div>
          )}

          {activeTab === 'Basketball' && (
            <motion.div key="basketball" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }} transition={{ duration: 0.3 }}>
              {feed?.basketball?.length > 0 ? (
                feed.basketball.map(renderLeagueSection)
              ) : (
                <EmptyState
                  icon="🏀"
                  message="No upcoming Basketball games. Your followed teams have no matches this week."
                  refreshing={refreshing}
                  nextMoment={collectNextMoment(feed, 'Basketball')}
                />
              )}
            </motion.div>
          )}

          {activeTab === 'F1' && (
            <motion.div key="f1" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }} transition={{ duration: 0.3 }}>
              {feed?.f1?.upcoming?.length > 0 ? (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '16px' }}>
                  {feed.f1.upcoming.map(race => (
                    <MatchCard key={race.id} match={race} isF1={true} />
                  ))}
                </div>
              ) : (
                <EmptyState
                  icon="🏎️"
                  message="F1 race data isn't live right now. Check back during race weekends."
                  refreshing={refreshing}
                  nextMoment={collectNextMoment(feed, 'F1')}
                />
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        .spin-anim { animation: spin 0.8s linear infinite; }
        .hover-border-accent:hover { border-color: var(--color-accent) !important; transform: translateY(-2px); box-shadow: 0 8px 24px rgba(0,0,0,0.12); }
      `}</style>
    </div>
  );
};

const EmptyState = ({ icon, message, refreshing, nextMoment }) => (
  <div style={{
    padding: '40px 32px',
    textAlign: 'center',
    background: 'rgba(255,255,255,0.02)',
    borderRadius: 24,
    border: '1px dashed var(--border)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    minHeight: 200,
    maxHeight: 320,
    justifyContent: 'center',
  }}>
    <div style={{ fontSize: 40, marginBottom: 12, opacity: 0.5 }}>{icon}</div>
    <h3 style={{ fontSize: 15, fontWeight: 700, color: 'var(--color-text-2)', margin: 0, lineHeight: 1.45, maxWidth: 440 }}>
      {refreshing ? 'Syncing global feeds...' : message}
    </h3>
    {!refreshing && nextMoment && (
      <p style={{ margin: '14px 0 0', fontSize: 13, color: 'var(--color-text-3)', lineHeight: 1.5, maxWidth: 420 }}>
        Your next sports moment: <strong style={{ color: 'var(--color-text-1)' }}>{nextMoment.title}</strong>
        {nextMoment.sport ? ` (${nextMoment.sport})` : ''}
        {nextMoment.when ? ` · ${nextMoment.when}` : ''}
      </p>
    )}
  </div>
);

function collectNextMoment(feed, excludeTab) {
  const out = [];
  const pushEvents = (sport, leagues) => {
    if (sport === excludeTab) return;
    (leagues || []).forEach((league) => {
      (league.events || []).forEach((m) => {
        if (m.isFinished) return;
        const title = m.home?.name && m.away?.name
          ? `${m.home.name} vs ${m.away.name}`
          : (m.name || 'Upcoming match');
        let when = '';
        if (m.date) {
          try {
            when = formatDate(m.date);
          } catch { when = ''; }
        } else if (m.statusShort) when = m.statusShort;
        out.push({ sport, title, when });
      });
    });
  };
  pushEvents('Cricket', feed?.cricket);
  pushEvents('Football', feed?.football);
  pushEvents('Basketball', feed?.basketball);
  if (excludeTab !== 'F1') {
    (feed?.f1?.upcoming || []).forEach((race) => {
      out.push({
        sport: 'F1',
        title: race.name || 'Race weekend',
        when: race.statusShort || '',
      });
    });
  }
  return out[0] || null;
}

export default Sports;
