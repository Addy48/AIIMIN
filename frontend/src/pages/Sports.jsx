import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { RefreshCw, Wifi, WifiOff } from 'lucide-react';
import { sportsService } from '../services/sportsService';

/* ── Fallback data — always shows something ── */
const FALLBACK = {
  football: [
    { fixture: { id:1, status:{ short:'FT', elapsed:null } }, teams: { home:{ name:'Real Madrid' }, away:{ name:'FC Barcelona' } }, goals:{ home:3, away:2 }, league:{ name:'La Liga' } },
    { fixture: { id:2, status:{ short:'FT', elapsed:null } }, teams: { home:{ name:'Man City' }, away:{ name:'Arsenal' } }, goals:{ home:2, away:1 }, league:{ name:'Premier League' } },
    { fixture: { id:3, status:{ short:'NS', elapsed:null } }, teams: { home:{ name:'Bayern Munich' }, away:{ name:'Borussia Dortmund' } }, goals:{ home:null, away:null }, league:{ name:'Bundesliga' } },
  ],
  f1: [
    { name:'Monaco Grand Prix', date:'2026-05-25', circuit:{ name:'Circuit de Monaco' }, competition:{ name:'Monaco GP' }, status:'Scheduled', type:'Race' },
    { name:'Canadian Grand Prix', date:'2026-06-08', circuit:{ name:'Circuit Gilles Villeneuve' }, competition:{ name:'Canadian GP' }, status:'Scheduled', type:'Race' },
    { name:'British Grand Prix', date:'2026-07-06', circuit:{ name:'Silverstone Circuit' }, competition:{ name:'British GP' }, status:'Scheduled', type:'Race' },
  ],
  cricket: [
    { name:'IPL 2026 — CSK vs MI', status:'Live', live:true, score:'CSK 187/4 (18.3 ov)' },
    { name:'IPL 2026 — RCB vs KKR', status:'Scheduled', live:false, score:'Mar 24, 7:30 PM IST' },
  ],
  recentMatches: [
    { title:'Real Madrid vs Barcelona', score:'3 - 2', status:'Finished' },
    { title:'Man City vs Arsenal', score:'2 - 1', status:'Finished' },
    { title:'PSG vs Lyon', score:'4 - 0', status:'Finished' },
  ],
  news: [
    { title:'Verstappen on pole at Monaco qualifying', time:'1h ago', source:'F1 Official' },
    { title:'CSK beat MI in last-over thriller — Dhoni finishes in style', time:'3h ago', source:'ESPNcricinfo' },
    { title:'Mbappé hat-trick seals Real Madrid title', time:'5h ago', source:'Sky Sports' },
  ],
};

const statusLabel = (s) => {
  if (!s) return 'Scheduled';
  const m = { FT:'Finished', NS:'Upcoming', '1H':'Live', '2H':'Live', HT:'Half-Time', ET:'Extra Time' };
  return m[s] || s;
};

const ArenaCard = ({ type, title, subtitle, status, score, time }) => {
  const isLive = status === 'Live';
  return (
    <motion.div
      initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }}
      whileHover={{ y: -3, boxShadow:'0 12px 30px rgba(0,0,0,0.12)' }}
      style={{ background:'var(--color-surface)', border:'1px solid var(--color-border)', borderRadius:'20px', padding:'20px', display:'flex', flexDirection:'column', gap:'12px', transition:'box-shadow 0.2s' }}
    >
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
        <div style={{ fontSize:'9px', fontWeight:900, color:'var(--color-accent)', textTransform:'uppercase', letterSpacing:'0.12em' }}>{type}</div>
        <div style={{ padding:'3px 8px', background: isLive ? 'rgba(239,68,68,0.12)' : 'var(--color-elevated)', borderRadius:'6px', color: isLive ? '#ef4444' : 'var(--color-text-3)', fontSize:'9px', fontWeight:800, display:'flex', alignItems:'center', gap:'4px' }}>
          {isLive && <span style={{ width:'5px', height:'5px', borderRadius:'50%', background:'#ef4444', animation:'pulse 1s infinite', display:'inline-block' }} />}
          {status}
        </div>
      </div>
      <div>
        <div style={{ fontSize:'14px', fontWeight:800, color:'var(--color-text-1)', marginBottom:'3px' }}>{title}</div>
        <div style={{ fontSize:'11px', color:'var(--color-text-3)', fontWeight:600 }}>{subtitle}</div>
      </div>
      <div style={{ background:'var(--color-elevated)', borderRadius:'12px', padding:'14px', textAlign:'center', border:'1px solid var(--color-border)' }}>
        <div style={{ fontSize:'22px', fontWeight:900, letterSpacing:'0.05em', color:'var(--color-text-1)' }}>{score || '— vs —'}</div>
      </div>
      {time && <div style={{ fontSize:'10px', fontWeight:700, color:'var(--color-text-3)', textAlign:'center' }}>{time}</div>}
    </motion.div>
  );
};

const TrainingLog = () => {
  const EXERCISES = [
    { name:'Push-ups', sets:3, reps:20 },
    { name:'Pull-ups', sets:3, reps:10 },
    { name:'Squats', sets:4, reps:15 },
    { name:'Plank', sets:3, reps:'60s' },
  ];
  const [done, setDone] = useState({});

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:'12px' }}>
      <div style={{ background:'linear-gradient(135deg, #1E5C3A 0%, #0D3B26 100%)', borderRadius:'16px', padding:'24px', color:'#fff', marginBottom:'4px' }}>
        <div style={{ fontSize:'10px', fontWeight:800, opacity:0.75, marginBottom:'4px', textTransform:'uppercase', letterSpacing:'0.1em' }}>Today's Session</div>
        <div style={{ fontSize:'22px', fontWeight:900 }}>HIIT Training</div>
        <div style={{ display:'flex', gap:'20px', marginTop:'12px', fontSize:'12px', opacity:0.85 }}>
          <div><div style={{ fontSize:'9px', opacity:0.7, marginBottom:'2px' }}>DURATION</div><div style={{ fontWeight:900 }}>45m</div></div>
          <div><div style={{ fontSize:'9px', opacity:0.7, marginBottom:'2px' }}>INTENSITY</div><div style={{ fontWeight:900 }}>8/10</div></div>
          <div><div style={{ fontSize:'9px', opacity:0.7, marginBottom:'2px' }}>DONE</div><div style={{ fontWeight:900 }}>{Object.values(done).filter(Boolean).length}/{EXERCISES.length}</div></div>
        </div>
      </div>
      {EXERCISES.map(ex => (
        <div key={ex.name} style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'12px 16px', background:'var(--color-surface)', border:'1px solid var(--color-border)', borderRadius:'12px' }}>
          <div>
            <div style={{ fontSize:'13px', fontWeight:700, color:'var(--color-text-1)' }}>{ex.name}</div>
            <div style={{ fontSize:'11px', color:'var(--color-text-3)' }}>{ex.sets} × {ex.reps}</div>
          </div>
          <button onClick={() => setDone(p=>({...p,[ex.name]:!p[ex.name]}))}
            style={{ width:'28px', height:'28px', borderRadius:'50%', background: done[ex.name] ? 'var(--color-accent)' : 'var(--color-elevated)', border:`1px solid ${done[ex.name]?'var(--color-accent)':'var(--color-border)'}`, cursor:'pointer', color: done[ex.name]?'#fff':'var(--color-text-3)', fontSize:'12px', fontWeight:900 }}>
            {done[ex.name] ? '✓' : '○'}
          </button>
        </div>
      ))}
    </div>
  );
};

const Sports = () => {
  const [data, setData] = useState(FALLBACK);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [usingFallback, setUsingFallback] = useState(false);
  const [activeTab, setActiveTab] = useState('Arena');

  const loadData = useCallback(async () => {
    setRefreshing(true);
    try {
      const res = await sportsService.getAggregatedSports();
      const hasReal = (res.football?.length > 0 && res.football[0] !== FALLBACK.football[0]);
      setData(res.football?.length ? res : FALLBACK);
      setUsingFallback(!hasReal);
    } catch {
      setData(FALLBACK);
      setUsingFallback(true);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => { loadData(); const iv = setInterval(loadData, 60000); return () => clearInterval(iv); }, [loadData]);

  return (
    <div style={{ maxWidth:'1200px', margin:'0 auto' }}>
      {/* Header */}
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-end', marginBottom:'32px' }}>
        <div>
          <div style={{ fontSize:'10px', fontWeight:800, textTransform:'uppercase', letterSpacing:'0.18em', color:'var(--color-accent)', marginBottom:'6px' }}>Sports Intelligence</div>
          <h1 style={{ font:'var(--text-hero)', margin:0, color:'var(--color-text-1)' }}>The Arena.</h1>
        </div>
        <div style={{ display:'flex', alignItems:'center', gap:'10px' }}>
          {usingFallback && (
            <div style={{ display:'flex', alignItems:'center', gap:'6px', padding:'6px 12px', background:'var(--color-warning-dim)', border:'1px solid var(--color-warning)', borderRadius:'8px', fontSize:'10px', fontWeight:800, color:'var(--color-warning)' }}>
              <WifiOff size={11} /> Cached Data
            </div>
          )}
          <button onClick={loadData} disabled={refreshing} style={{ background:'var(--color-surface)', border:'1px solid var(--color-border)', borderRadius:'12px', padding:'10px 16px', fontSize:'11px', fontWeight:800, color:'var(--color-text-2)', cursor:'pointer', display:'flex', alignItems:'center', gap:'8px' }}>
            <RefreshCw size={12} style={{ animation: refreshing ? 'aiimin-spin 0.7s linear infinite' : 'none' }} />
            {refreshing ? 'Refreshing...' : 'Live Refresh'}
          </button>
        </div>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'1fr 300px', gap:'32px' }}>
        {/* Main */}
        <div>
          <div style={{ display:'flex', gap:'0', marginBottom:'24px', borderBottom:'1px solid var(--color-border)' }}>
            {['Arena','Training','Insights'].map(t => (
              <button key={t} onClick={() => setActiveTab(t)} style={{ padding:'12px 20px', background:'none', border:'none', fontSize:'12px', fontWeight:800, color: activeTab===t ? 'var(--color-accent)' : 'var(--color-text-3)', borderBottom: activeTab===t ? '2px solid var(--color-accent)' : '2px solid transparent', cursor:'pointer', fontFamily:'inherit' }}>
                {t}
              </button>
            ))}
          </div>

          {loading ? (
            <div style={{ padding:'100px', textAlign:'center', color:'var(--color-text-3)', fontSize:'13px', fontWeight:700 }}>TUNING FEEDS...</div>
          ) : activeTab === 'Arena' ? (
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(260px, 1fr))', gap:'16px' }}>
              {(data.football||[]).slice(0,4).map((m,i) => (
                <ArenaCard key={`fb-${i}`} type="Football" title={`${m.teams?.home?.name} vs ${m.teams?.away?.name}`}
                  subtitle={m.league?.name||'League Match'} status={statusLabel(m.fixture?.status?.short)}
                  score={m.goals?.home != null ? `${m.goals.home} – ${m.goals.away}` : '—'} time={m.fixture?.status?.elapsed ? `${m.fixture.status.elapsed}'` : null} />
              ))}
              {(data.f1||[]).slice(0,2).map((f,i) => (
                <ArenaCard key={`f1-${i}`} type="Formula 1" title={f.competition?.name||f.name||'Grand Prix'}
                  subtitle={f.circuit?.name||'Circuit'} status={f.status||'Scheduled'}
                  score={f.type||'Race'} time={f.date ? new Date(f.date).toLocaleDateString('en-US',{month:'short',day:'numeric'}) : 'TBD'} />
              ))}
              {(data.cricket||[]).slice(0,2).map((c,i) => (
                <ArenaCard key={`cr-${i}`} type="Cricket" title={c.name||c.title}
                  subtitle={c.status} status={c.live?'Live':'Scheduled'} score={c.score||'—'} />
              ))}
            </div>
          ) : activeTab === 'Training' ? (
            <TrainingLog />
          ) : (
            <div style={{ padding:'60px 40px', textAlign:'center', border:'1px dashed var(--color-border)', borderRadius:'20px', color:'var(--color-text-3)' }}>
              <div style={{ fontSize:'32px', marginBottom:'12px' }}>🧠</div>
              <div style={{ fontSize:'14px', fontWeight:700 }}>Analytical models converging</div>
              <div style={{ fontSize:'12px', marginTop:'6px' }}>Insights available after 7+ days of session data</div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div style={{ display:'flex', flexDirection:'column', gap:'20px' }}>
          <div style={{ background:'var(--color-surface)', border:'1px solid var(--color-border)', borderRadius:'20px', padding:'20px' }}>
            <div style={{ fontSize:'10px', fontWeight:800, textTransform:'uppercase', color:'var(--color-text-3)', marginBottom:'16px', letterSpacing:'0.1em' }}>Quick Scores</div>
            {(data.recentMatches||[]).map((m,i,arr) => (
              <div key={i} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'10px 0', borderBottom: i<arr.length-1?'1px solid var(--color-border)':'none' }}>
                <div style={{ fontSize:'12px', fontWeight:700, color:'var(--color-text-1)', flex:1 }}>{m.title}</div>
                <div style={{ fontSize:'13px', fontWeight:900, color:'var(--color-accent)', marginLeft:'12px', whiteSpace:'nowrap' }}>{m.score}</div>
              </div>
            ))}
          </div>

          <div style={{ background:'var(--color-surface)', border:'1px solid var(--color-border)', borderRadius:'20px', padding:'20px' }}>
            <div style={{ fontSize:'10px', fontWeight:800, textTransform:'uppercase', color:'var(--color-text-3)', marginBottom:'16px', letterSpacing:'0.1em' }}>Sports Intel</div>
            {(data.news||[]).map((n,i) => (
              <div key={i} style={{ marginBottom:'14px', paddingBottom:'14px', borderBottom: i<data.news.length-1?'1px solid var(--color-border)':'none' }}>
                <div style={{ fontSize:'13px', fontWeight:600, color:'var(--color-text-1)', lineHeight:1.4, marginBottom:'4px' }}>{n.title}</div>
                <div style={{ fontSize:'10px', color:'var(--color-text-3)', fontWeight:700 }}>{n.time} · {n.source}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`@keyframes aiimin-spin { to { transform: rotate(360deg); } } @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.3} }`}</style>
    </div>
  );
};

export default Sports;
