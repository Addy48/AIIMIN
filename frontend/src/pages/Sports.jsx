import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { RefreshCw, Wifi } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Sports = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('Cricket'); // 'Cricket' | 'Football' | 'Formula 1'
  const [refreshing, setRefreshing] = useState(false);

  const [feed, setFeed] = useState(null);

  const fetchScores = async (isRefresh = false) => {
    setRefreshing(true);
    try {
      const endpoint = isRefresh ? '/sports/refresh' : '/sports';
      const method = isRefresh ? 'POST' : 'GET';
      const response = await fetch('/api' + endpoint, {
        method,
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('aiimin_session_fallback') || ''}`,
          'Content-Type': 'application/json'
        }
      });
      if (response.ok) {
        const data = await response.json();
        setFeed(data.data || data); // handle both direct feed or wrapped data
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
    if (user?.isGuest) {
      navigate('/overview');
      return;
    }
    // Initial sync
    fetchScores();
    // 5-minute interval sync
    const interval = setInterval(() => {
      fetchScores(true);
    }, 5 * 60 * 1000);
    return () => clearInterval(interval);
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
      background: '#F5F2EB',
      minHeight: '100vh',
      padding: '40px 24px',
      fontFamily: '"Outfit", "Inter", sans-serif',
      color: '#2B2A24',
      transition: 'all 0.3s ease'
    }}>
      {/* Header section */}
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto 32px auto',
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
            color: '#1E5C3A',
            marginBottom: '6px'
          }}>
            AIIMIN Sports Intelligence
          </div>
          <h1 style={{
            fontSize: '36px',
            fontWeight: 900,
            color: '#1E5C3A',
            margin: 0,
            letterSpacing: '-0.03em',
            fontFamily: '"Playfair Display", "Georgia", serif'
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
            background: 'rgba(30, 92, 58, 0.08)',
            border: '1px solid rgba(30, 92, 58, 0.15)',
            borderRadius: '12px',
            fontSize: '11px',
            fontWeight: 800,
            color: '#1E5C3A'
          }}>
            <Wifi size={13} style={{ strokeWidth: 2.5 }} /> Live Score Feed
          </div>
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            style={{
              background: '#FFFFFF',
              border: '1px solid #E3DEC3',
              borderRadius: '12px',
              padding: '10px 18px',
              fontSize: '12px',
              fontWeight: 800,
              color: '#5C5A52',
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
        maxWidth: '1200px',
        margin: '0 auto 32px auto',
        display: 'flex',
        gap: '12px',
        borderBottom: '1px solid #E3DEC3',
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
                border: `1px solid ${isActive ? '#1E5C3A' : '#E3DEC3'}`,
                background: isActive ? '#1E5C3A' : '#FFFFFF',
                color: isActive ? '#FFFFFF' : '#5C5A52',
                fontSize: '13px',
                fontWeight: 800,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: isActive ? '0 4px 12px rgba(30,92,58,0.2)' : 'none'
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
              {/* Cricket Live Header */}
              <div style={{
                display: 'flex',
                gap: '16px',
                borderBottom: '2px solid #1E5C3A',
                paddingBottom: '8px',
                marginBottom: '8px'
              }}>
                <span style={{ fontSize: '13px', fontWeight: 800, color: '#1E5C3A', borderBottom: '3px solid #1E5C3A', paddingBottom: '8px', marginBottom: '-10px' }}>LIVE TEST</span>
                <span style={{ fontSize: '13px', fontWeight: 800, color: '#7E7C74' }}>IPL 2026</span>
              </div>

              {/* Main Cricket Scoreboard & Statistics Split */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px', alignItems: 'start' }}>
                
                {/* Left Column: Live Scorecard */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                  
                  {/* ICC Test Main Card */}
                  <div style={{
                    background: '#FFFFFF',
                    border: '1px solid #E3DEC3',
                    borderRadius: '24px',
                    padding: '28px',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.02)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '24px'
                  }}>
                    {/* Live Match Info */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div>
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          background: 'rgba(239,68,68,0.1)',
                          padding: '4px 10px',
                          borderRadius: '8px',
                          width: 'fit-content',
                          marginBottom: '12px'
                        }}>
                          <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#EF4444', display: 'inline-block', animation: 'pulse 1.5s infinite' }} />
                          <span style={{ fontSize: '10px', fontWeight: 900, color: '#EF4444', letterSpacing: '0.05em' }}>LIVE · Day 3 of 5</span>
                        </div>
                        <h2 style={{ fontSize: '20px', fontWeight: 800, margin: '0 0 4px 0', fontFamily: '"Playfair Display", "Georgia", serif' }}>
                          ICC Test · England vs India - 1st Test
                        </h2>
                        <span style={{ fontSize: '12px', color: '#7E7C74', fontWeight: 600 }}>Lord's Cricket Ground, London</span>
                      </div>
                    </div>

                    {/* Scores rows */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                      {/* England Score Row */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <span style={{ fontSize: '20px' }}>🏴󠁧󠁢󠁥󠁮󠁧󠁿</span>
                          <span style={{ fontSize: '15px', fontWeight: 800 }}>England</span>
                          <span style={{ fontSize: '11px', color: '#7E7C74', fontWeight: 600 }}>INNINGS 1 & 2</span>
                        </div>
                        <div style={{ display: 'flex', gap: '16px', alignItems: 'baseline' }}>
                          <span style={{ fontSize: '24px', fontWeight: 900, fontFamily: 'monospace' }}>342</span>
                          <span style={{ fontSize: '18px', fontWeight: 600, color: '#7E7C74', fontFamily: 'monospace' }}>—</span>
                        </div>
                      </div>

                      {/* India Score Row */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <span style={{ fontSize: '20px' }}>🇮🇳</span>
                          <span style={{ fontSize: '15px', fontWeight: 800 }}>India</span>
                          <span style={{ fontSize: '11px', color: '#7E7C74', fontWeight: 600 }}>INNINGS 1 & 2</span>
                        </div>
                        <div style={{ display: 'flex', gap: '16px', alignItems: 'baseline' }}>
                          <span style={{ fontSize: '24px', fontWeight: 600, color: '#7E7C74', fontFamily: 'monospace' }}>289</span>
                          <span style={{ fontSize: '24px', fontWeight: 900, color: '#1E5C3A', fontFamily: 'monospace' }}>87/2</span>
                        </div>
                      </div>
                    </div>

                    {/* Monospace banner */}
                    <div style={{
                      background: 'rgba(30, 92, 58, 0.08)',
                      border: '1px solid rgba(30, 92, 58, 0.15)',
                      borderRadius: '16px',
                      padding: '14px 20px',
                      textAlign: 'center',
                      fontSize: '13px',
                      fontWeight: 800,
                      color: '#1E5C3A',
                      fontFamily: '"Courier New", Courier, monospace',
                      letterSpacing: '0.05em'
                    }}>
                      IND NEED 147 off 228 balls
                    </div>
                  </div>

                  {/* Recent Balls Bubbles */}
                  <div style={{
                    background: '#FFFFFF',
                    border: '1px solid #E3DEC3',
                    borderRadius: '24px',
                    padding: '24px',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.02)'
                  }}>
                    <h3 style={{ fontSize: '10px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#7E7C74', marginBottom: '14px', margin: 0 }}>
                      RECENT BALLS
                    </h3>
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                      {recentBalls.map((ball, i) => (
                        <div
                          key={i}
                          style={{
                            width: '28px',
                            height: '28px',
                            borderRadius: '50%',
                            background: ball.val === 'W' ? '#B33A3A' : ball.val === '4' ? '#2B6CB0' : ball.val === '6' ? '#805AD5' : ball.val === '0' ? '#E2E8F0' : '#E2F0E7',
                            color: ball.val === 'W' || ball.val === '4' || ball.val === '6' ? '#FFFFFF' : ball.val === '0' ? '#718096' : '#1E5C3A',
                            border: `1px solid ${ball.val === 'W' ? '#B33A3A' : ball.val === '4' ? '#2B6CB0' : ball.val === '6' ? '#805AD5' : ball.val === '0' ? '#CBD5E0' : '#A2D4B6'}`,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '11px',
                            fontWeight: 900,
                            fontFamily: 'monospace'
                          }}
                        >
                          {ball.val}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Fall of Wickets Card */}
                  <div style={{
                    background: '#FFFFFF',
                    border: '1px solid #E3DEC3',
                    borderRadius: '24px',
                    padding: '24px',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.02)'
                  }}>
                    <h3 style={{ fontSize: '10px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#7E7C74', marginBottom: '16px', margin: 0 }}>
                      FALL OF WICKETS - IND INN 2
                    </h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #F0EDE8', paddingBottom: '8px' }}>
                        <span style={{ fontSize: '13px', fontWeight: 800 }}>WKT 1</span>
                        <span style={{ fontSize: '13px', fontWeight: 700 }}>Shubman Gill</span>
                        <span style={{ fontSize: '13px', fontWeight: 700, fontFamily: 'monospace', color: '#7E7C74' }}>48 · Ov 12.4</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ fontSize: '13px', fontWeight: 800 }}>WKT 2</span>
                        <span style={{ fontSize: '13px', fontWeight: 700 }}>KL Rahul</span>
                        <span style={{ fontSize: '13px', fontWeight: 700, fontFamily: 'monospace', color: '#7E7C74' }}>87 · Ov 22.3</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Column: Player Stats & Over Summary */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                  
                  {/* Batting Crease Card */}
                  <div style={{
                    background: '#FFFFFF',
                    border: '1px solid #E3DEC3',
                    borderRadius: '24px',
                    padding: '24px',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.02)'
                  }}>
                    <h3 style={{ fontSize: '10px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#7E7C74', marginBottom: '16px', margin: 0 }}>
                      BATTING · AT CREASE
                    </h3>
                    <div style={{ overflowX: 'auto' }}>
                      <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                        <thead>
                          <tr style={{ borderBottom: '1px solid #E3DEC3', fontSize: '9px', fontWeight: 800, color: '#7E7C74' }}>
                            <th style={{ paddingBottom: '10px' }}>BATTER</th>
                            <th style={{ paddingBottom: '10px', textAlign: 'center' }}>R</th>
                            <th style={{ paddingBottom: '10px', textAlign: 'center' }}>B</th>
                            <th style={{ paddingBottom: '10px', textAlign: 'center' }}>4s</th>
                            <th style={{ paddingBottom: '10px', textAlign: 'center' }}>6s</th>
                            <th style={{ paddingBottom: '10px', textAlign: 'right' }}>SR</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr style={{ borderBottom: '1px solid #F0EDE8', fontSize: '13px' }}>
                            <td style={{ padding: '12px 0', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '6px' }}>
                              Rohit Sharma <span style={{ color: '#1E5C3A', fontSize: '10px' }}>⚡</span>
                            </td>
                            <td style={{ padding: '12px 0', textAlign: 'center', fontWeight: 900, color: '#1E5C3A', fontFamily: 'monospace' }}>42</td>
                            <td style={{ padding: '12px 0', textAlign: 'center', fontFamily: 'monospace', color: '#5C5A52' }}>68</td>
                            <td style={{ padding: '12px 0', textAlign: 'center', fontFamily: 'monospace', color: '#5C5A52' }}>5</td>
                            <td style={{ padding: '12px 0', textAlign: 'center', fontFamily: 'monospace', color: '#5C5A52' }}>0</td>
                            <td style={{ padding: '12px 0', textAlign: 'right', fontWeight: 700, fontFamily: 'monospace' }}>61.7</td>
                          </tr>
                          <tr style={{ fontSize: '13px' }}>
                            <td style={{ padding: '12px 0', fontWeight: 800 }}>Virat Kohli</td>
                            <td style={{ padding: '12px 0', textAlign: 'center', fontWeight: 900, color: '#1E5C3A', fontFamily: 'monospace' }}>28</td>
                            <td style={{ padding: '12px 0', textAlign: 'center', fontFamily: 'monospace', color: '#5C5A52' }}>41</td>
                            <td style={{ padding: '12px 0', textAlign: 'center', fontFamily: 'monospace', color: '#5C5A52' }}>3</td>
                            <td style={{ padding: '12px 0', textAlign: 'center', fontFamily: 'monospace', color: '#5C5A52' }}>0</td>
                            <td style={{ padding: '12px 0', textAlign: 'right', fontWeight: 700, fontFamily: 'monospace' }}>68.2</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Bowling Crease Card */}
                  <div style={{
                    background: '#FFFFFF',
                    border: '1px solid #E3DEC3',
                    borderRadius: '24px',
                    padding: '24px',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.02)'
                  }}>
                    <h3 style={{ fontSize: '10px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#7E7C74', marginBottom: '16px', margin: 0 }}>
                      BOWLING
                    </h3>
                    <div style={{ overflowX: 'auto' }}>
                      <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                        <thead>
                          <tr style={{ borderBottom: '1px solid #E3DEC3', fontSize: '9px', fontWeight: 800, color: '#7E7C74' }}>
                            <th style={{ paddingBottom: '10px' }}>BOWLER</th>
                            <th style={{ paddingBottom: '10px', textAlign: 'center' }}>O</th>
                            <th style={{ paddingBottom: '10px', textAlign: 'center' }}>R</th>
                            <th style={{ paddingBottom: '10px', textAlign: 'center' }}>W</th>
                            <th style={{ paddingBottom: '10px', textAlign: 'right' }}>ECO</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr style={{ borderBottom: '1px solid #F0EDE8', fontSize: '13px' }}>
                            <td style={{ padding: '12px 0', fontWeight: 800 }}>James Anderson</td>
                            <td style={{ padding: '12px 0', textAlign: 'center', fontFamily: 'monospace', color: '#5C5A52' }}>8</td>
                            <td style={{ padding: '12px 0', textAlign: 'center', fontFamily: 'monospace', color: '#5C5A52' }}>22</td>
                            <td style={{ padding: '12px 0', textAlign: 'center', fontWeight: 900, color: '#B33A3A', fontFamily: 'monospace' }}>1</td>
                            <td style={{ padding: '12px 0', textAlign: 'right', fontWeight: 700, fontFamily: 'monospace' }}>2.75</td>
                          </tr>
                          <tr style={{ fontSize: '13px' }}>
                            <td style={{ padding: '12px 0', fontWeight: 800 }}>Stuart Broad</td>
                            <td style={{ padding: '12px 0', textAlign: 'center', fontFamily: 'monospace', color: '#5C5A52' }}>7</td>
                            <td style={{ padding: '12px 0', textAlign: 'center', fontFamily: 'monospace', color: '#5C5A52' }}>31</td>
                            <td style={{ padding: '12px 0', textAlign: 'center', fontWeight: 900, color: '#B33A3A', fontFamily: 'monospace' }}>1</td>
                            <td style={{ padding: '12px 0', textAlign: 'right', fontWeight: 700, fontFamily: 'monospace' }}>4.42</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Over-by-Over Summary */}
                  <div style={{
                    background: '#FFFFFF',
                    border: '1px solid #E3DEC3',
                    borderRadius: '24px',
                    padding: '24px',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.02)'
                  }}>
                    <h3 style={{ fontSize: '10px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#7E7C74', marginBottom: '16px', margin: 0 }}>
                      OVER-BY-OVER SUMMARY
                    </h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      {[
                        { ov: '1', balls: ['1', '2', '0', '1', '4', '0'], runs: '8' },
                        { ov: '2', balls: ['1', '0', 'W', '0', '1', '1'], runs: '3', hasWkt: true },
                        { ov: '3', balls: ['4', '1', '2', '0', '6', 'W'], runs: '12', hasWkt: true },
                        { ov: '4', balls: ['1', '1', '0', '2', '1', '0'], runs: '5' },
                        { ov: '5', balls: ['1', '4', '0', '0', '1', '1'], runs: '7' }
                      ].map((o, idx) => (
                        <div key={idx} style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          paddingBottom: idx < 4 ? '12px' : '0',
                          borderBottom: idx < 4 ? '1px solid #F0EDE8' : 'none'
                        }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                            <span style={{ fontSize: '13px', fontWeight: 800, color: '#7E7C74', width: '20px' }}>{o.ov}</span>
                            <div style={{ display: 'flex', gap: '6px' }}>
                              {o.balls.map((b, bi) => (
                                <span
                                  key={bi}
                                  style={{
                                    width: '20px',
                                    height: '20px',
                                    borderRadius: '50%',
                                    background: b === 'W' ? '#B33A3A' : b === '4' ? '#2B6CB0' : b === '6' ? '#805AD5' : b === '0' ? '#E2E8F0' : '#E2F0E7',
                                    color: b === 'W' || b === '4' || b === '6' ? '#FFFFFF' : b === '0' ? '#718096' : '#1E5C3A',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '9px',
                                    fontWeight: 900,
                                    fontFamily: 'monospace'
                                  }}
                                >
                                  {b}
                                </span>
                              ))}
                            </div>
                          </div>
                          <span style={{ fontSize: '13px', fontWeight: 900, fontFamily: 'monospace', color: o.hasWkt ? '#B33A3A' : '#1E5C3A' }}>
                            {o.runs} Runs
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>
              </div>
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
              {/* Football Live Header */}
              <div style={{
                display: 'flex',
                gap: '16px',
                borderBottom: '2px solid #1E5C3A',
                paddingBottom: '8px',
                marginBottom: '8px'
              }}>
                <span style={{ fontSize: '13px', fontWeight: 800, color: '#1E5C3A', borderBottom: '3px solid #1E5C3A', paddingBottom: '8px', marginBottom: '-10px' }}>EL CLÁSICO LIVE</span>
                <span style={{ fontSize: '13px', fontWeight: 800, color: '#7E7C74' }}>PREMIER LEAGUE</span>
                <span style={{ fontSize: '13px', fontWeight: 800, color: '#7E7C74' }}>UEFA CHAMPIONS LEAGUE</span>
              </div>

              {/* El Clásico Main Stats & Radial split */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px', alignItems: 'start' }}>
                
                {/* Football Match Card with Radial Possession */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                  
                  {/* Real Madrid vs Barcelona Match Card */}
                  <div style={{
                    background: '#FFFFFF',
                    border: '1px solid #E3DEC3',
                    borderRadius: '24px',
                    padding: '28px',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.02)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '24px'
                  }}>
                    {/* Live indicator and competition */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '10px', fontWeight: 800, color: '#7E7C74', textTransform: 'uppercase', letterSpacing: '0.1em' }}>🇪🇸 LA LIGA · MATCHDAY 32</span>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        background: 'rgba(239,68,68,0.1)',
                        padding: '4px 10px',
                        borderRadius: '8px'
                      }}>
                        <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#EF4444', display: 'inline-block', animation: 'pulse 1.5s infinite' }} />
                        <span style={{ fontSize: '10px', fontWeight: 900, color: '#EF4444', letterSpacing: '0.05em' }}>LIVE 89:12</span>
                      </div>
                    </div>

                    {/* Team Logos & Scores */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0' }}>
                      {/* Real Madrid */}
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', flex: 1 }}>
                        <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: '#EDF2F7', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', border: '1px solid #E3DEC3' }}>👑</div>
                        <span style={{ fontSize: '14px', fontWeight: 800 }}>Real Madrid</span>
                      </div>

                      {/* Score display */}
                      <div style={{ display: 'flex', gap: '16px', alignItems: 'center', justifyContent: 'center', flex: 1 }}>
                        <span style={{ fontSize: '42px', fontWeight: 900, fontFamily: 'monospace', color: '#1E5C3A' }}>2</span>
                        <span style={{ fontSize: '20px', color: '#A0AEC0', fontWeight: 700 }}>:</span>
                        <span style={{ fontSize: '42px', fontWeight: 900, fontFamily: 'monospace' }}>1</span>
                      </div>

                      {/* Barcelona */}
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', flex: 1 }}>
                        <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: '#FFF5F5', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', border: '1px solid #E3DEC3' }}>🔵</div>
                        <span style={{ fontSize: '14px', fontWeight: 800 }}>Barcelona</span>
                      </div>
                    </div>

                    {/* Scorers Timeline */}
                    <div style={{
                      borderTop: '1px solid #E3DEC3',
                      paddingTop: '16px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '8px'
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                        <span style={{ fontWeight: 600 }}>⚽ Vinícius Jr. (24' Pen)</span>
                        <span style={{ color: '#7E7C74', fontStyle: 'italic' }} />
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                        <span style={{ color: '#7E7C74', fontStyle: 'italic' }} />
                        <span style={{ fontWeight: 600 }}>Lewandowski (45+2') ⚽</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                        <span style={{ fontWeight: 900, color: '#1E5C3A' }}>⚽ Jude Bellingham (89')</span>
                        <span style={{ color: '#7E7C74', fontStyle: 'italic' }} />
                      </div>
                    </div>
                  </div>

                  {/* Radial Possession Ring Widget */}
                  <div style={{
                    background: '#FFFFFF',
                    border: '1px solid #E3DEC3',
                    borderRadius: '24px',
                    padding: '28px',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.02)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '20px'
                  }}>
                    <h3 style={{ fontSize: '10px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#7E7C74', width: '100%', margin: 0 }}>
                      LIVE POSSESSION CHART
                    </h3>
                    <div style={{ position: 'relative', width: '160px', height: '160px' }}>
                      <svg width="100%" height="100%" viewBox="0 0 42 42" className="donut">
                        <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="#E2E8F0" strokeWidth="4" />
                        <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="#1E5C3A" strokeWidth="4" 
                          strokeDasharray="58 42" strokeDashoffset="25" style={{ transition: 'stroke-dasharray 0.3s ease' }} />
                      </svg>
                      <div style={{
                        position: 'absolute',
                        inset: 0,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        <span style={{ fontSize: '28px', fontWeight: 900, color: '#1E5C3A', fontFamily: 'monospace' }}>58%</span>
                        <span style={{ fontSize: '10px', color: '#7E7C74', fontWeight: 800 }}>REAL MADRID</span>
                      </div>
                    </div>
                    <div style={{ display: 'flex', width: '100%', justifyContent: 'space-between', fontSize: '12px', fontWeight: 700 }}>
                      <span style={{ color: '#1E5C3A' }}>58% Real Madrid</span>
                      <span style={{ color: '#7E7C74' }}>42% Barcelona</span>
                    </div>
                  </div>
                </div>

                {/* Right Column: Match Stats Comparison & Lineups */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                  
                  {/* Match Stats Comparison */}
                  <div style={{
                    background: '#FFFFFF',
                    border: '1px solid #E3DEC3',
                    borderRadius: '24px',
                    padding: '24px',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.02)'
                  }}>
                    <h3 style={{ fontSize: '10px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#7E7C74', marginBottom: '20px', margin: 0 }}>
                      MATCH STATISTICS
                    </h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                      {[
                        { label: 'Shots', home: '14', away: '10', homePct: 58, awayPct: 42 },
                        { label: 'Shots on Target', home: '6', away: '4', homePct: 60, awayPct: 40 },
                        { label: 'Possession', home: '58%', away: '42%', homePct: 58, awayPct: 42 },
                        { label: 'Pass Accuracy', home: '89%', away: '84%', homePct: 51, awayPct: 49 },
                        { label: 'Fouls', home: '8', away: '12', homePct: 40, awayPct: 60 },
                        { label: 'Corners', home: '7', away: '3', homePct: 70, awayPct: 30 }
                      ].map((stat, idx) => (
                        <div key={idx} style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', fontWeight: 800 }}>
                            <span style={{ color: '#1E5C3A', fontFamily: 'monospace' }}>{stat.home}</span>
                            <span style={{ color: '#5C5A52' }}>{stat.label}</span>
                            <span style={{ fontFamily: 'monospace' }}>{stat.away}</span>
                          </div>
                          <div style={{ height: '4px', background: '#E2E8F0', borderRadius: '2px', display: 'flex', overflow: 'hidden' }}>
                            <div style={{ width: `${stat.homePct}%`, background: '#1E5C3A' }} />
                            <div style={{ width: `${stat.awayPct}%`, background: '#E3DEC3' }} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Team Lineups */}
                  <div style={{
                    background: '#FFFFFF',
                    border: '1px solid #E3DEC3',
                    borderRadius: '24px',
                    padding: '24px',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.02)'
                  }}>
                    <h3 style={{ fontSize: '10px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#7E7C74', marginBottom: '16px', margin: 0 }}>
                      STARTING LINEUPS
                    </h3>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                      {/* Real Madrid Lineup */}
                      <div>
                        <h4 style={{ fontSize: '12px', fontWeight: 800, color: '#1E5C3A', borderBottom: '1px solid #F0EDE8', paddingBottom: '6px', margin: '0 0 10px 0' }}>Real Madrid</h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '12px', fontWeight: 600 }}>
                          <div>Courtois (GK)</div>
                          <div>Carvajal</div>
                          <div>Militão</div>
                          <div>Rüdiger</div>
                          <div>Mendy</div>
                          <div>Valverde</div>
                          <div>Tchouaméni</div>
                          <div>Bellingham</div>
                          <div>Rodrygo</div>
                          <div>Mbappé</div>
                          <div>Vinícius Jr.</div>
                        </div>
                      </div>
                      
                      {/* Barcelona Lineup */}
                      <div>
                        <h4 style={{ fontSize: '12px', fontWeight: 800, color: '#7E7C74', borderBottom: '1px solid #F0EDE8', paddingBottom: '6px', margin: '0 0 10px 0' }}>Barcelona</h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '12px', fontWeight: 600 }}>
                          <div>Ter Stegen (GK)</div>
                          <div>Koundé</div>
                          <div>Araujo</div>
                          <div>Christensen</div>
                          <div>Balde</div>
                          <div>Pedri</div>
                          <div>Gavi</div>
                          <div>De Jong</div>
                          <div>Raphinha</div>
                          <div>Lewandowski</div>
                          <div>Yamal</div>
                        </div>
                      </div>
                    </div>
                  </div>

                </div>
              </div>
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
              {/* Formula 1 Header */}
              <div style={{
                display: 'flex',
                gap: '16px',
                borderBottom: '2px solid #1E5C3A',
                paddingBottom: '8px',
                marginBottom: '8px'
              }}>
                <span style={{ fontSize: '13px', fontWeight: 800, color: '#1E5C3A', borderBottom: '3px solid #1E5C3A', paddingBottom: '8px', marginBottom: '-10px' }}>GRID STANDINGS</span>
                <span style={{ fontSize: '13px', fontWeight: 800, color: '#7E7C74' }}>UPCOMING GP</span>
              </div>

              {/* Grid split */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px', alignItems: 'start' }}>
                
                {/* Left Column: Monaco Grand Prix Race Countdown Card */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                  
                  {/* Countdown Card */}
                  <div style={{
                    background: 'linear-gradient(135deg, #1E5C3A, #0D3B26)',
                    borderRadius: '24px',
                    padding: '32px',
                    color: '#FFFFFF',
                    boxShadow: '0 4px 20px rgba(30,92,58,0.15)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '24px'
                  }}>
                    <div>
                      <div style={{ fontSize: '11px', fontWeight: 800, opacity: 0.8, textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: '8px' }}>
                        🏎️ NEXT GRAND PRIX
                      </div>
                      <h2 style={{ fontSize: '26px', fontWeight: 900, margin: '0 0 6px 0', fontFamily: '"Playfair Display", "Georgia", serif' }}>
                        Monaco Grand Prix
                      </h2>
                      <span style={{ fontSize: '13px', opacity: 0.8, fontWeight: 500 }}>Circuit de Monaco, Monte Carlo</span>
                    </div>

                    <div style={{
                      height: '1px',
                      background: 'rgba(255,255,255,0.15)'
                    }} />

                    {/* Countdown columns */}
                    <div style={{ display: 'flex', gap: '24px' }}>
                      <div>
                        <span style={{ fontSize: '36px', fontWeight: 900, fontFamily: 'monospace', display: 'block', lineHeight: 1 }}>03</span>
                        <span style={{ fontSize: '10px', opacity: 0.75, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Days</span>
                      </div>
                      <div>
                        <span style={{ fontSize: '36px', fontWeight: 900, fontFamily: 'monospace', display: 'block', lineHeight: 1 }}>14</span>
                        <span style={{ fontSize: '10px', opacity: 0.75, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Hours</span>
                      </div>
                      <div>
                        <span style={{ fontSize: '36px', fontWeight: 900, fontFamily: 'monospace', display: 'block', lineHeight: 1 }}>52</span>
                        <span style={{ fontSize: '10px', opacity: 0.75, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Mins</span>
                      </div>
                    </div>
                  </div>

                  {/* Constructor Championship Standings */}
                  <div style={{
                    background: '#FFFFFF',
                    border: '1px solid #E3DEC3',
                    borderRadius: '24px',
                    padding: '24px',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.02)'
                  }}>
                    <h3 style={{ fontSize: '10px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#7E7C74', marginBottom: '16px', margin: 0 }}>
                      CONSTRUCTOR STANDINGS
                    </h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                      {[
                        { pos: '1', name: 'Red Bull Racing', points: '210', wins: 4, logo: '🔴' },
                        { pos: '2', name: 'Ferrari', points: '183', wins: 1, logo: '🟡' },
                        { pos: '3', name: 'McLaren', points: '165', wins: 1, logo: '🟠' },
                        { pos: '4', name: 'Mercedes', points: '110', wins: 0, logo: '⚫' }
                      ].map((team, idx) => (
                        <div key={idx} style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          paddingBottom: idx < 3 ? '12px' : '0',
                          borderBottom: idx < 3 ? '1px solid #F0EDE8' : 'none'
                        }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <span style={{ fontSize: '13px', fontWeight: 800, color: '#7E7C74', minWidth: '16px' }}>{team.pos}</span>
                            <span style={{ fontSize: '16px' }}>{team.logo}</span>
                            <div>
                              <div style={{ fontSize: '13px', fontWeight: 800 }}>{team.name}</div>
                              <div style={{ fontSize: '10px', color: '#7E7C74', fontWeight: 600 }}>{team.wins} Wins</div>
                            </div>
                          </div>
                          <span style={{ fontSize: '16px', fontWeight: 900, fontFamily: 'monospace', color: '#1E5C3A' }}>{team.points}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right Column: Driver Standings with progress bars */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                  
                  {/* Driver Championship Card */}
                  <div style={{
                    background: '#FFFFFF',
                    border: '1px solid #E3DEC3',
                    borderRadius: '24px',
                    padding: '24px',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.02)'
                  }}>
                    <h3 style={{ fontSize: '10px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#7E7C74', marginBottom: '20px', margin: 0 }}>
                      DRIVER CHAMPIONSHIP
                    </h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                      {[
                        { pos: 'P1', name: 'Max Verstappen', team: 'Red Bull Racing', points: 125, maxPoints: 150 },
                        { pos: 'P2', name: 'Charles Leclerc', team: 'Ferrari', points: 108, maxPoints: 150 },
                        { pos: 'P3', name: 'Lando Norris', team: 'McLaren', points: 95, maxPoints: 150 },
                        { pos: 'P4', name: 'Lewis Hamilton', team: 'Mercedes', points: 80, maxPoints: 150 },
                        { pos: 'P5', name: 'Carlos Sainz', team: 'Ferrari', points: 75, maxPoints: 150 }
                      ].map((driver, idx) => (
                        <div key={idx} style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', fontSize: '12px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <span style={{ fontSize: '11px', fontWeight: 900, color: idx === 0 ? '#1E5C3A' : '#7E7C74' }}>{driver.pos}</span>
                              <span style={{ fontWeight: 800 }}>{driver.name}</span>
                              <span style={{ fontSize: '10px', color: '#7E7C74', fontWeight: 600 }}>{driver.team}</span>
                            </div>
                            <span style={{ fontSize: '14px', fontWeight: 900, color: '#1E5C3A', fontFamily: 'monospace' }}>{driver.points} PTS</span>
                          </div>
                          <div style={{ height: '6px', background: '#F0EDE8', borderRadius: '3px', overflow: 'hidden' }}>
                            <div style={{
                              width: `${(driver.points / driver.maxPoints) * 100}%`,
                              height: '100%',
                              background: '#1E5C3A',
                              borderRadius: '3px'
                            }} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>
              </div>
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
