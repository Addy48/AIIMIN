import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { RefreshCw, Wifi } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { apiPost } from '../utils/api';
import { sportsService } from '../services/sportsService';

const Sports = () => {
  const navigate = useNavigate();
  const { user: authUser } = useAuth();
  const user = React.useMemo(() => authUser || { id: 'guest', full_name: 'Guest', username: 'GUEST', role: 'guest', isGuest: true }, [authUser]);
  const [activeTab, setActiveTab] = useState('Cricket'); // 'Cricket' | 'Football' | 'Formula 1'
  const [refreshing, setRefreshing] = useState(false);

  const [feed, setFeed] = useState(null);

  const fetchScores = async (isRefresh = false) => {
    setRefreshing(true);
    try {
      if (isRefresh) {
        try {
          const res = await apiPost('/sports/refresh', {});
          setFeed(res.data || res);
        } catch (err) {
          console.warn('Server refresh failed, fetching local aggregated sports feed:', err);
          const localData = await sportsService.getAggregatedSports();
          setFeed(localData);
        }
      } else {
        const localData = await sportsService.getAggregatedSports();
        setFeed(localData);
      }
    } catch (err) {
      console.error('Failed to sync sports:', err);
    } finally {
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    fetchScores(true);
  };

  useEffect(() => {
    // Initial sync
    fetchScores();
    // 5-minute interval sync
    const interval = setInterval(() => {
      fetchScores(true);
    }, 5 * 60 * 1000);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, navigate]);


  // Recent Balls data (Cricket tab)
  const recentBalls = [
    { type: 'run', val: '1', color: '#1E5C3A' },
    { type: 'wicket', val: 'W', color: '#B33A3A' },
    { type: 'boundary', val: '4', color: '#2B6CB0' },
    { type: 'dot', val: '0', color: '#718096' },
    { type: 'run', val: '2', color: '#1E5C3A' },
    { type: 'six', val: '6', color: '#805AD5' },
    { type: 'run', val: '1', color: '#1E5C3A' },
    { type: 'run', val: '2', color: '#1E5C3A' },
    { type: 'boundary', val: '4', color: '#2B6CB0' },
    { type: 'dot', val: '0', color: '#718096' },
    { type: 'run', val: '1', color: '#1E5C3A' },
    { type: 'run', val: '1', color: '#1E5C3A' },
    { type: 'run', val: '3', color: '#1E5C3A' }
  ];

  return (
    <div style={{
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '40px 24px',
      paddingBottom: '80px'
    }}>
      {/* Header section */}
      <div style={{
        marginBottom: '32px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        <div>
          <div style={{
            fontSize: '11px',
            fontWeight: 800,
            textTransform: 'uppercase',
            letterSpacing: '0.2em',
            color: 'var(--color-accent)',
            marginBottom: '6px'
          }}>
            AIIMIN Sports Intelligence
          </div>
          <h1 style={{
            fontSize: '36px',
            fontWeight: 900,
            color: 'var(--color-text-1)',
            margin: 0,
            letterSpacing: '-0.03em',
            fontFamily: 'var(--font-serif)'
          }}>
            The Arena.
          </h1>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '8px 16px',
            background: 'var(--bg-elevated)',
            border: '1px solid var(--border)',
            borderRadius: '12px',
            fontSize: '11px',
            fontWeight: 800,
            color: 'var(--color-accent)'
          }}>
            <Wifi size={13} style={{ strokeWidth: 2.5 }} /> Live Score Feed
          </div>
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            style={{
              background: 'var(--color-surface)',
              border: '1px solid var(--border)',
              borderRadius: '12px',
              padding: '10px 18px',
              fontSize: '12px',
              fontWeight: 800,
              color: 'var(--color-text-2)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
              transition: 'all 0.2s ease'
            }}
          >
            <RefreshCw size={13} className={refreshing ? 'spin-anim' : ''} style={{ transition: 'transform 0.5s' }} />
            {refreshing ? 'Syncing...' : 'Sync Scores'}
          </button>
        </div>
      </div>

      {/* Main Tabs Navigation */}
      <div style={{
        marginBottom: '32px',
        display: 'flex',
        gap: '12px',
        borderBottom: '1px solid var(--border)',
        paddingBottom: '16px'
      }}>
        {['Cricket', 'Football', 'Formula 1'].map((tab) => {
          const isActive = activeTab === tab;
          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                padding: '10px 24px',
                borderRadius: '99px',
                border: `1px solid ${isActive ? 'var(--color-accent)' : 'var(--border)'}`,
                background: isActive ? 'var(--color-accent)' : 'var(--color-surface)',
                color: isActive ? 'var(--color-base)' : 'var(--color-text-2)',
                fontSize: '13px',
                fontWeight: 800,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: isActive ? '0 4px 12px rgba(0,0,0,0.1)' : 'none'
              }}
            >
              {tab === 'Cricket' && '🏏'}
              {tab === 'Football' && '⚽'}
              {tab === 'Formula 1' && '🏎️'}
              {tab}
            </button>
          );
        })}
      </div>

      {/* Tab Panels */}
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <AnimatePresence mode="wait">
          {activeTab === 'Cricket' && (
            <motion.div
              key="cricket"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '24px' }}
            >
              {/* If we have real cricket events from cricapi/ESPN, render them dynamically! */}
              {feed?.cricket?.[0]?.events?.length > 0 ? (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '24px' }}>
                  {feed.cricket[0].events.map((match) => (
                    <div key={match.id} style={{
                      background: 'var(--color-surface)',
                      border: '1px solid var(--border)',
                      borderRadius: '24px',
                      padding: '28px',
                      boxShadow: '0 4px 20px rgba(0,0,0,0.02)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '20px'
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          background: match.isLive ? 'rgba(239,68,68,0.1)' : 'var(--bg-elevated)',
                          padding: '4px 10px',
                          borderRadius: '8px',
                        }}>
                          {match.isLive && <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#EF4444', display: 'inline-block', animation: 'pulse 1.5s infinite' }} />}
                          <span style={{ fontSize: '10px', fontWeight: 900, color: match.isLive ? '#EF4444' : 'var(--color-accent)', letterSpacing: '0.05em' }}>
                            {match.isLive ? 'LIVE' : match.isFinished ? 'FINISHED' : 'UPCOMING'}
                          </span>
                        </div>
                        <span style={{ fontSize: '11px', color: 'var(--color-text-3)', fontWeight: 600 }}>{match.notes?.[0] || 'Match'}</span>
                      </div>
                      
                      <h3 style={{ fontSize: '18px', fontWeight: 800, margin: 0, fontFamily: 'var(--font-serif)', color: 'var(--color-text-1)' }}>
                        {match.name}
                      </h3>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ fontSize: '14px', fontWeight: 700 }}>{match.home.name}</span>
                          <span style={{ fontSize: '18px', fontWeight: 900, fontFamily: 'monospace' }}>{match.home.score || '—'}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ fontSize: '14px', fontWeight: 700 }}>{match.away.name}</span>
                          <span style={{ fontSize: '18px', fontWeight: 900, fontFamily: 'monospace' }}>{match.away.score || '—'}</span>
                        </div>
                      </div>

                      <div style={{
                        background: 'var(--bg-elevated)',
                        border: '1px solid var(--border)',
                        borderRadius: '16px',
                        padding: '12px 16px',
                        fontSize: '12px',
                        fontWeight: 800,
                        color: 'var(--color-accent)',
                        textAlign: 'center'
                      }}>
                        {match.status}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ padding: '40px', textAlign: 'center', background: 'var(--color-surface)', borderRadius: '24px', border: '1px solid var(--border)' }}>
                  <h3 style={{ fontSize: '18px', color: 'var(--color-text-3)' }}>No live or upcoming cricket matches found at this time.</h3>
                </div>
              )}
            </motion.div>
          )}

          {activeTab === 'Football' && (
            <motion.div
              key="football"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '24px' }}
            >
              {/* If we have real football events from the live feed, render them dynamically! */}
              {feed?.football?.length > 0 ? (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '24px' }}>
                  {feed.football.flatMap(league => 
                    league.events.map(match => (
                      <div key={match.id} style={{
                        background: 'var(--color-surface)',
                        border: '1px solid var(--border)',
                        borderRadius: '24px',
                        padding: '28px',
                        boxShadow: '0 4px 20px rgba(0,0,0,0.02)',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '20px'
                      }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ fontSize: '10px', fontWeight: 800, color: 'var(--color-text-3)', textTransform: 'uppercase' }}>
                            {league.league.flag} {league.league.name}
                          </span>
                          <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            background: match.isLive ? 'rgba(239,68,68,0.1)' : 'var(--bg-elevated)',
                            padding: '4px 10px',
                            borderRadius: '8px'
                          }}>
                            {match.isLive && <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#EF4444', display: 'inline-block', animation: 'pulse 1.5s infinite' }} />}
                            <span style={{ fontSize: '10px', fontWeight: 900, color: match.isLive ? '#EF4444' : 'var(--color-accent)' }}>
                              {match.isLive ? `LIVE ${match.clock || ''}` : match.isFinished ? 'FINISHED' : 'SCHEDULED'}
                            </span>
                          </div>
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', flex: 1 }}>
                            {match.home.logo ? <img src={match.home.logo} alt="" style={{ width: '32px', height: '32px', objectFit: 'contain' }} /> : <span style={{ fontSize: '24px' }}>🛡️</span>}
                            <span style={{ fontSize: '13px', fontWeight: 800, textAlign: 'center' }}>{match.home.name}</span>
                          </div>

                          <div style={{ display: 'flex', gap: '12px', alignItems: 'center', justifyContent: 'center', flex: 1 }}>
                            <span style={{ fontSize: '28px', fontWeight: 900, fontFamily: 'monospace' }}>{match.home.score ?? '—'}</span>
                            <span style={{ fontSize: '16px', color: '#A0AEC0', fontWeight: 700 }}>:</span>
                            <span style={{ fontSize: '28px', fontWeight: 900, fontFamily: 'monospace' }}>{match.away.score ?? '—'}</span>
                          </div>

                          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', flex: 1 }}>
                            {match.away.logo ? <img src={match.away.logo} alt="" style={{ width: '32px', height: '32px', objectFit: 'contain' }} /> : <span style={{ fontSize: '24px' }}>🛡️</span>}
                            <span style={{ fontSize: '13px', fontWeight: 800, textAlign: 'center' }}>{match.away.name}</span>
                          </div>
                        </div>

                        <div style={{ fontSize: '12px', color: 'var(--color-text-3)', textAlign: 'center', fontWeight: 600 }}>
                          {match.statusDetail || match.status}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              ) : (
                <div style={{ padding: '40px', textAlign: 'center', background: 'var(--color-surface)', borderRadius: '24px', border: '1px solid var(--border)' }}>
                  <h3 style={{ fontSize: '18px', color: 'var(--color-text-3)' }}>No live or upcoming football matches found at this time.</h3>
                </div>
              )}
            </motion.div>
          )}

          {activeTab === 'Formula 1' && (
            <motion.div
              key="f1"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '24px' }}
            >
              {feed?.f1?.upcoming?.length > 0 || feed?.f1?.standings?.length > 0 ? (
                <>
                  {/* Formula 1 Header */}
                  <div style={{
                    display: 'flex',
                    gap: '16px',
                    borderBottom: '2px solid var(--color-accent)',
                    paddingBottom: '8px',
                    marginBottom: '8px'
                  }}>
                    <span style={{ fontSize: '13px', fontWeight: 800, color: 'var(--color-accent)', borderBottom: '3px solid var(--color-accent)', paddingBottom: '8px', marginBottom: '-10px' }}>GRID STANDINGS</span>
                    <span style={{ fontSize: '13px', fontWeight: 800, color: 'var(--color-text-3)' }}>UPCOMING GP</span>
                  </div>

                  {/* Grid split */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px', alignItems: 'start' }}>
                    
                    {/* Left Column: Next Grand Prix & Constructors */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                      
                      {/* Upcoming Race Card */}
                      {feed?.f1?.upcoming?.[0] && (
                        <div style={{
                          background: 'var(--color-accent)',
                          borderRadius: '24px',
                          padding: '32px',
                          color: '#FFFFFF',
                          boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '24px'
                        }}>
                          <div>
                            <div style={{ fontSize: '11px', fontWeight: 800, opacity: 0.8, textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: '8px' }}>
                              🏎️ NEXT GRAND PRIX
                            </div>
                            <h2 style={{ fontSize: '26px', fontWeight: 900, margin: '0 0 6px 0', fontFamily: 'var(--font-serif)' }}>
                              {feed.f1.upcoming[0].raceName}
                            </h2>
                            <span style={{ fontSize: '13px', opacity: 0.8, fontWeight: 500 }}>
                              {feed.f1.upcoming[0].Circuit?.circuitName}, {feed.f1.upcoming[0].Circuit?.Location?.locality}
                            </span>
                          </div>

                          <div style={{
                            height: '1px',
                            background: 'rgba(255,255,255,0.15)'
                          }} />
                          
                          <div style={{ fontSize: '16px', fontWeight: 800 }}>
                            Date: {feed.f1.upcoming[0].date} {feed.f1.upcoming[0].time}
                          </div>
                        </div>
                      )}

                      {/* Constructor Championship Standings */}
                      {feed?.f1?.constructors?.length > 0 && (
                        <div style={{
                          background: 'var(--color-surface)',
                          border: '1px solid var(--border)',
                          borderRadius: '24px',
                          padding: '24px',
                          boxShadow: '0 4px 20px rgba(0,0,0,0.02)'
                        }}>
                          <h3 style={{ fontSize: '10px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--color-text-3)', marginBottom: '16px', margin: 0 }}>
                            CONSTRUCTOR STANDINGS
                          </h3>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                            {feed.f1.constructors.slice(0, 5).map((team, idx) => (
                              <div key={idx} style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                paddingBottom: idx < 4 ? '12px' : '0',
                                borderBottom: idx < 4 ? '1px solid var(--border)' : 'none'
                              }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                  <span style={{ fontSize: '13px', fontWeight: 800, color: 'var(--color-text-3)', minWidth: '16px' }}>{team.position}</span>
                                  <div>
                                    <div style={{ fontSize: '13px', fontWeight: 800, color: 'var(--color-text-1)' }}>{team.Constructor.name}</div>
                                    <div style={{ fontSize: '10px', color: 'var(--color-text-3)', fontWeight: 600 }}>{team.wins} Wins</div>
                                  </div>
                                </div>
                                <span style={{ fontSize: '16px', fontWeight: 900, fontFamily: 'monospace', color: 'var(--color-accent)' }}>{team.points}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Right Column: Driver Standings */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                      {feed?.f1?.standings?.length > 0 && (
                        <div style={{
                          background: 'var(--color-surface)',
                          border: '1px solid var(--border)',
                          borderRadius: '24px',
                          padding: '24px',
                          boxShadow: '0 4px 20px rgba(0,0,0,0.02)'
                        }}>
                          <h3 style={{ fontSize: '10px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--color-text-3)', marginBottom: '20px', margin: 0 }}>
                            DRIVER CHAMPIONSHIP
                          </h3>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            {feed.f1.standings.slice(0, 10).map((driver, idx) => {
                              const maxPoints = parseInt(feed.f1.standings[0].points) || 400;
                              return (
                              <div key={idx} style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', fontSize: '12px' }}>
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <span style={{ fontSize: '11px', fontWeight: 900, color: idx === 0 ? 'var(--color-accent)' : 'var(--color-text-3)' }}>P{driver.position}</span>
                                    <span style={{ fontWeight: 800, color: 'var(--color-text-1)' }}>{driver.Driver.givenName} {driver.Driver.familyName}</span>
                                    <span style={{ fontSize: '10px', color: 'var(--color-text-3)', fontWeight: 600 }}>{driver.Constructors[0]?.name}</span>
                                  </div>
                                  <span style={{ fontSize: '14px', fontWeight: 900, color: 'var(--color-accent)', fontFamily: 'monospace' }}>{driver.points} PTS</span>
                                </div>
                                <div style={{ height: '6px', background: 'var(--border)', borderRadius: '3px', overflow: 'hidden' }}>
                                  <div style={{
                                    width: `${(driver.points / maxPoints) * 100}%`,
                                    height: '100%',
                                    background: 'var(--color-accent)',
                                    borderRadius: '3px'
                                  }} />
                                </div>
                              </div>
                            )})}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </>
              ) : (
                <div style={{ padding: '40px', textAlign: 'center', background: 'var(--color-surface)', borderRadius: '24px', border: '1px solid var(--border)' }}>
                  <h3 style={{ fontSize: '18px', color: 'var(--color-text-3)' }}>No Formula 1 standings or upcoming races available.</h3>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Global CSS for Animations */}
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        .spin-anim {
          animation: spin 0.8s linear infinite;
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
      `}</style>
    </div>
  );
};

export default Sports;
