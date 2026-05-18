import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RefreshCw, WifiOff, Wifi, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { fetchAllSports, fetchMatchDetails } from '../services/sportsService';

const STATUS_MAP = {
  STATUS_FINAL: { label: 'FT', live: false, color: '#6b7280' },
  STATUS_IN_PROGRESS: { label: 'LIVE', live: true, color: '#ef4444' },
  STATUS_SCHEDULED: { label: 'Soon', live: false, color: '#f59e0b' },
};
const getStatus = (s) => STATUS_MAP[s] || { label: (s || '').replace('STATUS_', ''), live: false, color: '#6b7280' };

const fmt = (d) => d ? new Date(d).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Kolkata' }) + ' IST' : '';
const fmtDate = (d) => d ? new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }) : '';

const MatchCard = ({ event, leagueName, leagueFlag }) => {
  const st = getStatus(event.status);
  const hasScore = event.isFinished || event.isLive;
  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} whileHover={{ y: -2 }}
      style={{ background: 'var(--color-surface)', border: `1px solid ${event.isLive ? 'rgba(239,68,68,0.35)' : 'var(--color-border)'}`, borderRadius: '20px', padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: '10px', fontWeight: 800, color: 'var(--color-text-3)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{leagueFlag} {leagueName}</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
          {event.isLive && <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#ef4444', animation: 'pulse 1s infinite', display: 'inline-block' }} />}
          <span style={{ fontSize: '10px', fontWeight: 800, color: st.color }}>{st.label}</span>
          {event.isLive && event.clock && <span style={{ fontSize: '10px', color: '#ef4444' }}>{event.clock}</span>}
        </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {[event.home, event.away].map((team, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            {team.logo
              ? <img src={team.logo} alt={team.short} style={{ width: '22px', height: '22px', objectFit: 'contain', borderRadius: '4px' }} onError={e => { e.target.style.display = 'none'; }} />
              : <div style={{ width: '22px', height: '22px', borderRadius: '50%', background: team.color || '#555' }} />}
            <span style={{ fontSize: '14px', fontWeight: 700, color: 'var(--color-text-1)', flex: 1 }}>{team.short || team.name}</span>
            {hasScore
              ? <span style={{ fontSize: '18px', fontWeight: 900, color: 'var(--color-text-1)', fontFamily: 'monospace' }}>{team.score ?? '—'}</span>
              : <span style={{ fontSize: '11px', color: 'var(--color-text-3)' }}>{fmt(event.date)}</span>}
          </div>
        ))}
      </div>
      {event.statusShort && <div style={{ fontSize: '11px', color: event.isLive ? '#ef4444' : 'var(--color-text-3)', fontWeight: 600, borderTop: '1px solid var(--color-border)', paddingTop: '8px' }}>{event.statusShort}</div>}
      {event.venue && <div style={{ fontSize: '10px', color: 'var(--color-text-3)', marginTop: event.statusShort ? '4px' : '0', borderTop: event.statusShort ? 'none' : '1px solid var(--color-border)', paddingTop: event.statusShort ? '0' : '8px' }}>{event.venue}{event.location ? ` · ${event.location}` : ''}</div>}
    </motion.div>
  );
};

const F1Panel = ({ f1 }) => {
  if (!f1?.next && !f1?.last) return <div style={{ padding: '80px', textAlign: 'center', color: 'var(--color-text-3)' }}>F1 data unavailable</div>;
  const daysUntil = f1.next ? Math.ceil((new Date(`${f1.next.date}T${f1.next.time || '00:00:00'}`) - new Date()) / 86400000) : null;
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
      {f1.next && (
        <div style={{ background: 'linear-gradient(135deg,#dc2626,#7f1d1d)', borderRadius: '20px', padding: '24px', color: '#fff' }}>
          <div style={{ fontSize: '10px', opacity: 0.75, marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>🏎️ Next Race</div>
          <div style={{ fontSize: '20px', fontWeight: 900, marginBottom: '4px' }}>{f1.next.raceName}</div>
          <div style={{ fontSize: '13px', opacity: 0.8 }}>{f1.next.Circuit?.circuitName}</div>
          <div style={{ fontSize: '12px', opacity: 0.7, marginTop: '8px' }}>{fmtDate(f1.next.date)}</div>
          {daysUntil !== null && <div style={{ fontSize: '28px', fontWeight: 900, marginTop: '12px' }}>{daysUntil}<span style={{ fontSize: '14px', opacity: 0.75 }}>d to go</span></div>}
        </div>
      )}
      {f1.last && (
        <div style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: '20px', padding: '24px' }}>
          <div style={{ fontSize: '10px', fontWeight: 800, color: 'var(--color-text-3)', marginBottom: '8px', textTransform: 'uppercase' }}>🏁 Last — {f1.last.raceName}</div>
          {(f1.last.Results || []).slice(0, 5).map((r, i) => (
            <div key={i} style={{ display: 'flex', gap: '12px', alignItems: 'center', padding: '6px 0', borderBottom: i < 4 ? '1px solid var(--color-border)' : 'none' }}>
              <span style={{ fontSize: '12px', fontWeight: 900, color: i === 0 ? '#f59e0b' : 'var(--color-text-3)', minWidth: '18px' }}>P{r.position}</span>
              <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--color-text-1)', flex: 1 }}>{r.Driver?.familyName}</span>
              <span style={{ fontSize: '11px', color: 'var(--color-text-3)' }}>{r.Constructor?.name}</span>
            </div>
          ))}
        </div>
      )}
      {f1.standings && (
        <div style={{ gridColumn: '1 / -1', background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: '20px', padding: '20px' }}>
          <div style={{ fontSize: '10px', fontWeight: 800, color: 'var(--color-text-3)', marginBottom: '14px', textTransform: 'uppercase' }}>🏆 Driver Championship</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '12px' }}>
            {f1.standings.map((s, i) => (
              <div key={i} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '11px', fontWeight: 900, color: i === 0 ? '#f59e0b' : 'var(--color-text-3)' }}>P{s.position}</div>
                <div style={{ fontSize: '13px', fontWeight: 800, color: 'var(--color-text-1)', marginTop: '2px' }}>{s.Driver?.familyName}</div>
                <div style={{ fontSize: '20px', fontWeight: 900, color: 'var(--color-accent)' }}>{s.points}</div>
                <div style={{ fontSize: '10px', color: 'var(--color-text-3)' }}>{s.Constructors?.[0]?.name}</div>
              </div>
            ))}
          </div>
        </div>
      )}
      {f1.constructors && (
        <div style={{ gridColumn: '1 / -1', background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: '20px', padding: '20px' }}>
          <div style={{ fontSize: '10px', fontWeight: 800, color: 'var(--color-text-3)', marginBottom: '14px', textTransform: 'uppercase' }}>🏗️ Constructor Championship</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '12px' }}>
            {f1.constructors.map((c, i) => (
              <div key={i} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '11px', fontWeight: 900, color: i === 0 ? '#f59e0b' : 'var(--color-text-3)' }}>P{c.position}</div>
                <div style={{ fontSize: '13px', fontWeight: 800, color: 'var(--color-text-1)', marginTop: '2px' }}>{c.Constructor?.name}</div>
                <div style={{ fontSize: '20px', fontWeight: 900, color: 'var(--color-accent)' }}>{c.points}</div>
                <div style={{ fontSize: '10px', color: 'var(--color-text-3)' }}>{c.wins} wins</div>
              </div>
            ))}
          </div>
        </div>
      )}
      {f1.upcoming?.length > 0 && (
        <div style={{ gridColumn: '1 / -1', background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: '20px', padding: '20px' }}>
          <div style={{ fontSize: '10px', fontWeight: 800, color: 'var(--color-text-3)', marginBottom: '14px', textTransform: 'uppercase' }}>📅 Upcoming Races</div>
          {f1.upcoming.map((r, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: i < f1.upcoming.length - 1 ? '1px solid var(--color-border)' : 'none' }}>
              <div>
                <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--color-text-1)' }}>{r.raceName}</div>
                <div style={{ fontSize: '11px', color: 'var(--color-text-3)' }}>{r.Circuit?.circuitName}</div>
              </div>
              <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-accent)' }}>{fmtDate(r.date)}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const EXERCISES = [
  { name: 'Push-ups', sets: 3, reps: 20 }, { name: 'Pull-ups', sets: 3, reps: 10 },
  { name: 'Squats', sets: 4, reps: 15 }, { name: 'Plank', sets: 3, reps: '60s' }, { name: 'Burpees', sets: 3, reps: 12 },
];
const TrainingLog = () => {
  const [done, setDone] = useState({});
  const c = Object.values(done).filter(Boolean).length;
  return (
    <div>
      <div style={{ background: 'linear-gradient(135deg,#1E5C3A,#0D3B26)', borderRadius: '20px', padding: '24px', color: '#fff', marginBottom: '16px' }}>
        <div style={{ fontSize: '10px', opacity: 0.75, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '4px' }}>Today's Session</div>
        <div style={{ fontSize: '22px', fontWeight: 900 }}>HIIT Training</div>
        <div style={{ display: 'flex', gap: '20px', marginTop: '12px', fontSize: '12px', opacity: 0.85 }}>
          <div><div style={{ fontSize: '9px', opacity: 0.7 }}>DONE</div><div style={{ fontWeight: 900 }}>{c}/{EXERCISES.length}</div></div>
          <div><div style={{ fontSize: '9px', opacity: 0.7 }}>PROGRESS</div><div style={{ fontWeight: 900 }}>{Math.round((c / EXERCISES.length) * 100)}%</div></div>
        </div>
      </div>
      {EXERCISES.map(ex => (
        <div key={ex.name} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: '12px', marginBottom: '8px' }}>
          <div>
            <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--color-text-1)', opacity: done[ex.name] ? 0.4 : 1, textDecoration: done[ex.name] ? 'line-through' : 'none' }}>{ex.name}</div>
            <div style={{ fontSize: '11px', color: 'var(--color-text-3)' }}>{ex.sets} × {ex.reps}</div>
          </div>
          <button onClick={() => setDone(p => ({ ...p, [ex.name]: !p[ex.name] }))}
            style={{ width: '30px', height: '30px', borderRadius: '50%', background: done[ex.name] ? 'var(--color-accent)' : 'var(--color-elevated)', border: `1px solid ${done[ex.name] ? 'var(--color-accent)' : 'var(--color-border)'}`, cursor: 'pointer', color: done[ex.name] ? '#fff' : 'var(--color-text-3)', fontSize: '14px', fontWeight: 900, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {done[ex.name] ? '✓' : ''}
          </button>
        </div>
      ))}
    </div>
  );
};

const MatchDetails = ({ sport, matchId, onClose }) => {
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDetails = async () => {
      setLoading(true);
      const d = await fetchMatchDetails(sport, matchId);
      setDetails(d);
      setLoading(false);
    };
    loadDetails();
  }, [sport, matchId]);

  if (loading) return (
    <div style={{ padding: '40px', textAlign: 'center', color: 'var(--color-text-3)' }}>
      <RefreshCw size={24} style={{ animation: 'aiimin-spin 1s linear infinite', marginBottom: '12px' }} />
      <div>Pulling granular data...</div>
    </div>
  );

  if (!details) return <div style={{ padding: '40px', textAlign: 'center' }}>Detail view unavailable for this match.</div>;

  return (
    <div style={{ padding: '24px', background: 'var(--color-surface)', borderRadius: '24px', border: '1px solid var(--color-border)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
        <h3 style={{ fontSize: '18px', fontWeight: 800, margin: 0 }}>Full Scorecard</h3>
        <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--color-text-3)', cursor: 'pointer' }}><X size={20} /></button>
      </div>

      {sport === 'cricket' ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ padding: '16px', background: 'var(--bg-elevated)', borderRadius: '12px' }}>
            <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--color-accent)', marginBottom: '8px' }}>MATCH STATUS</div>
            <div style={{ fontSize: '14px', fontWeight: 600 }}>{details.status}</div>
          </div>
          {details.score?.map((s, i) => (
            <div key={i} style={{ borderBottom: '1px solid var(--color-border)', pb: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700 }}>
                <span>{s.inning}</span>
                <span style={{ color: 'var(--color-accent)' }}>{s.r}/{s.w} ({s.o})</span>
              </div>
            </div>
          ))}
          <div style={{ fontSize: '11px', color: 'var(--color-text-3)', fontStyle: 'italic' }}>{details.venue}</div>
        </div>
      ) : (
        <div style={{ fontSize: '14px' }}>
          {/* Football details implementation */}
          <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--color-accent)', marginBottom: '16px' }}>MATCH EVENTS</div>
          {details.summary?.map((ev, i) => (
            <div key={i} style={{ display: 'flex', gap: '12px', marginBottom: '8px' }}>
              <span style={{ fontWeight: 800, minWidth: '30px' }}>{ev.clock}'</span>
              <span>{ev.text}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const Sports = () => {
  const [data, setData] = useState({ football: [], cricket: [], basketball: [], f1: {} });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [usingFallback, setUsingFallback] = useState(false);
  const [activeTab, setActiveTab] = useState('Football');
  const [activeLeague, setActiveLeague] = useState(0);
  const [dateOffset, setDateOffset] = useState(0);
  const [selectedMatch, setSelectedMatch] = useState(null);
  const intervalRef = useRef(null);

  const loadData = useCallback(async (offset) => {
    setRefreshing(true);
    try {
      const res = await fetchAllSports(offset ?? dateOffset);
      setData(res);
      setUsingFallback(!res.football?.length && !res.cricket?.length);
    } catch { setUsingFallback(true); }
    finally { setLoading(false); setRefreshing(false); }
  }, [dateOffset]);

  useEffect(() => {
    loadData(dateOffset);
    intervalRef.current = setInterval(() => loadData(dateOffset), 60000);
    return () => clearInterval(intervalRef.current);
  }, [dateOffset, loadData]);

  const changeDate = (d) => { setActiveLeague(0); setDateOffset(d); };
  const dateLabelStr = () => {
    const d = new Date(); d.setDate(d.getDate() + dateOffset);
    if (dateOffset === 0) return 'Today';
    if (dateOffset === -1) return 'Yesterday';
    if (dateOffset === 1) return 'Tomorrow';
    return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
  };

  const tabs = ['Football', 'Cricket', 'Basketball', 'F1', 'Training'];
  const footballLeagues = data.football || [];
  const currentLeague = footballLeagues[activeLeague] || null;

  const EmptyState = ({ icon, title, sub }) => (
    <div style={{ padding: '80px', textAlign: 'center', border: '1px dashed var(--color-border)', borderRadius: '20px', color: 'var(--color-text-3)' }}>
      <div style={{ fontSize: '32px', marginBottom: '12px' }}>{icon}</div>
      <div style={{ fontSize: '14px', fontWeight: 700 }}>{title}</div>
      <div style={{ fontSize: '12px', marginTop: '6px' }}>{sub}</div>
    </div>
  );

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 16px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ fontSize: '10px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.18em', color: 'var(--color-accent)', marginBottom: '6px' }}>Sports Intelligence</div>
          <h1 style={{ fontSize: '36px', fontWeight: 800, color: 'var(--color-text-1)', margin: 0, letterSpacing: '-0.03em' }}>The Arena.</h1>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            {usingFallback
              ? <div style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 12px', background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.3)', borderRadius: '8px', fontSize: '10px', fontWeight: 800, color: '#f59e0b' }}><WifiOff size={11} /> Offline</div>
              : !loading && <div style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 12px', background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.2)', borderRadius: '8px', fontSize: '10px', fontWeight: 800, color: '#22c55e' }}><Wifi size={11} /> ESPN Live</div>}
            <button onClick={loadData} disabled={refreshing}
              style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: '12px', padding: '10px 16px', fontSize: '11px', fontWeight: 800, color: 'var(--color-text-2)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <RefreshCw size={12} style={{ animation: refreshing ? 'aiimin-spin 0.7s linear infinite' : 'none' }} />
              {refreshing ? 'Refreshing...' : 'Refresh'}
            </button>
          </div>
          {/* Date Navigation */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: '12px', padding: '4px' }}>
            <button onClick={() => changeDate(dateOffset - 1)} style={{ background: 'none', border: 'none', color: 'var(--color-text-2)', cursor: 'pointer', padding: '6px', borderRadius: '8px', display: 'flex' }}><ChevronLeft size={14} /></button>
            <button onClick={() => changeDate(0)} style={{ background: dateOffset === 0 ? 'var(--color-accent)' : 'none', border: 'none', color: dateOffset === 0 ? '#fff' : 'var(--color-text-2)', cursor: 'pointer', padding: '4px 12px', borderRadius: '8px', fontSize: '11px', fontWeight: 800, fontFamily: 'inherit' }}>{dateLabelStr()}</button>
            <button onClick={() => changeDate(dateOffset + 1)} style={{ background: 'none', border: 'none', color: 'var(--color-text-2)', cursor: 'pointer', padding: '6px', borderRadius: '8px', display: 'flex' }}><ChevronRight size={14} /></button>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 0, marginBottom: '24px', borderBottom: '1px solid var(--color-border)', overflowX: 'auto', whiteSpace: 'nowrap', scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
        {tabs.map(t => (
          <button key={t} onClick={() => setActiveTab(t)}
            style={{ padding: '12px 22px', background: 'none', border: 'none', fontSize: '12px', fontWeight: 800, color: activeTab === t ? 'var(--color-accent)' : 'var(--color-text-3)', borderBottom: activeTab === t ? '2px solid var(--color-accent)' : '2px solid transparent', cursor: 'pointer', fontFamily: 'inherit', flexShrink: 0 }}>
            {t === 'Football' ? '⚽ Football' : t === 'Cricket' ? '🏏 Cricket' : t === 'Basketball' ? '🏀 Basketball' : t === 'F1' ? '🏎️ F1' : '🏋️ Training'}
          </button>
        ))}
      </div>

      {loading ? (
        <div style={{ padding: '100px', textAlign: 'center', color: 'var(--color-text-3)', fontSize: '13px', fontWeight: 700 }}>TUNING ESPN FEEDS...</div>
      ) : (
        <>
          {activeTab === 'Football' && (
            <div>
              {footballLeagues.length > 1 && (
                <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', flexWrap: 'wrap' }}>
                  {footballLeagues.map((l, i) => (
                    <button key={i} onClick={() => setActiveLeague(i)}
                      style={{ padding: '6px 14px', borderRadius: '99px', border: `1px solid ${activeLeague === i ? 'var(--color-accent)' : 'var(--color-border)'}`, background: activeLeague === i ? 'var(--color-accent)' : 'transparent', color: activeLeague === i ? '#fff' : 'var(--color-text-2)', fontSize: '12px', fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>
                      {l.league?.flag} {l.league?.name}
                    </button>
                  ))}
                </div>
              )}
              {currentLeague ? (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
                  {currentLeague.events.map(ev => (
                    <div key={ev.id} onClick={() => setSelectedMatch({ sport: 'football', id: ev.id })} style={{ cursor: 'pointer' }}>
                      <MatchCard event={ev} leagueName={currentLeague.league?.name} leagueFlag={currentLeague.league?.flag} />
                    </div>
                  ))}
                </div>
              ) : <EmptyState icon="⚽" title="No fixtures today" sub="Check back on matchday" />}
            </div>
          )}

          {activeTab === 'Cricket' && (
            data.cricket?.length > 0
              ? data.cricket.map((l, li) => {
                  const matchRank = ev => ev.isLive ? 0 : ev.isFinished ? 1 : 2;
                  const sorted = [...l.events].sort((a, b) => matchRank(a) - matchRank(b));
                  return (
                    <div key={li} style={{ marginBottom: '24px' }}>
                      <div style={{ fontSize: '11px', fontWeight: 800, color: 'var(--color-text-3)', textTransform: 'uppercase', marginBottom: '12px', letterSpacing: '0.1em' }}>{l.league?.flag} {l.league?.name}</div>
                      {sorted.some(ev => ev.isLive) && (
                        <div style={{ fontSize: '10px', fontWeight: 800, color: '#ef4444', textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#ef4444', display: 'inline-block', animation: 'pulse 1s infinite' }} /> Live Now
                        </div>
                      )}
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
                        {sorted.map(ev => (
                          <div key={ev.id} onClick={() => setSelectedMatch({ sport: 'cricket', id: ev.id })} style={{ cursor: 'pointer' }}>
                            <MatchCard event={ev} leagueName={l.league?.name} leagueFlag={l.league?.flag} />
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })
              : <EmptyState icon="🏏" title="No live cricket right now" sub="IPL & international fixtures appear here" />
          )}

          {/* Match Details Modal Overlay */}
          <AnimatePresence>
            {selectedMatch && (
              <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(10px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
                <motion.div 
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.9, opacity: 0 }}
                  style={{ maxWidth: '600px', width: '100%' }}
                >
                  <MatchDetails 
                    sport={selectedMatch.sport} 
                    matchId={selectedMatch.id} 
                    onClose={() => setSelectedMatch(null)} 
                  />
                </motion.div>
              </div>
            )}
          </AnimatePresence>

          {activeTab === 'Basketball' && (
            data.basketball?.length > 0
              ? data.basketball.map((l, li) => (
                  <div key={li} style={{ marginBottom: '24px' }}>
                    <div style={{ fontSize: '11px', fontWeight: 800, color: 'var(--color-text-3)', textTransform: 'uppercase', marginBottom: '12px', letterSpacing: '0.1em' }}>{l.league?.flag} {l.league?.name}</div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '14px' }}>
                      {l.events.map(ev => <MatchCard key={ev.id} event={ev} leagueName={l.league?.name} leagueFlag={l.league?.flag} />)}
                    </div>
                  </div>
                ))
              : <EmptyState icon="🏀" title="No live basketball right now" sub="NBA fixtures appear here" />
          )}

          {activeTab === 'F1' && <F1Panel f1={data.f1} />}
          {activeTab === 'Training' && <TrainingLog />}
        </>
      )}
      <style>{`@keyframes aiimin-spin{to{transform:rotate(360deg)}} @keyframes pulse{0%,100%{opacity:1}50%{opacity:0.3}}`}</style>
    </div>
  );
};

export default Sports;
