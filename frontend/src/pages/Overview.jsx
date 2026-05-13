import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer } from 'recharts';
import { useAuth } from '../hooks/useAuth';
import { useThemeContext } from '../context/ThemeContext';
import supabase from '../utils/supabase';
import { motion, AnimatePresence } from 'framer-motion';

/* ── Components ── */

const QuickCheckIn = ({ user, isDark }) => {
  const [vals, setVals] = useState({ mood: 7, energy: 7, focus: 7 });
  const [note, setNote] = useState('');
  const [saved, setSaved] = useState(false);
  
  const save = async () => {
    if (!user) return;
    const { error } = await supabase.from('lab_mood_logs').insert({
      user_id: user.id,
      logged_at: new Date().toISOString(),
      ...vals,
      note: note.trim()
    });
    if (!error) {
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
      setNote('');
    }
  };

  return (
    <div style={{ background: isDark?'var(--color-surface)':'#fff', border: '1px solid var(--color-border)', borderRadius:'20px', padding:'24px' }}>
      <div style={{ fontSize:'12px', fontWeight:800, textTransform:'uppercase', letterSpacing:'0.12em', color:isDark?'#fff':'#000', marginBottom:'20px', display:'flex', alignItems:'center', gap:'8px' }}>
        <span style={{ width:'6px', height:'6px', borderRadius:'50%', background:'var(--color-accent)' }} /> 
        Daily Pulse
      </div>
      <div style={{ display:'flex', flexDirection:'column', gap:'18px' }}>
        {['mood', 'energy', 'focus'].map(k => (
          <div key={k}>
            <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'8px' }}>
              <span style={{ fontSize:'11px', fontWeight:800, textTransform:'uppercase', color:'var(--color-text-3)' }}>{k}</span>
              <span style={{ fontSize:'11px', fontWeight:900, color:'var(--color-accent)' }}>{vals[k]}</span>
            </div>
            <input type="range" min={1} max={10} value={vals[k]} onChange={e => setVals(v=>({...v, [k]: Number(e.target.value)}))}
              style={{ width:'100%', height:'4px', appearance:'none', background:'var(--color-border)', borderRadius:'10px', outline:'none', cursor:'pointer' }} />
          </div>
        ))}
        <textarea placeholder="Quick reflection..." value={note} onChange={e=>setNote(e.target.value)}
          style={{ width:'100%', background:isDark?'rgba(255,255,255,0.03)':'rgba(0,0,0,0.02)', border:'1px solid var(--color-border)', borderRadius:'12px', padding:'12px', fontSize:'13px', color:'var(--color-text-1)', outline:'none', resize:'none', height:'80px', fontFamily:'inherit' }} />
        <button onClick={save} disabled={saved}
          style={{ padding:'14px', borderRadius:'14px', background:saved?'var(--color-accent-dim)':'var(--color-accent)', color:saved?'var(--color-accent)':'#fff', border:'none', fontSize:'13px', fontWeight:900, cursor:'pointer', transition:'all 0.2s' }}>
          {saved ? '✓ DATA SYNCED' : 'LOG SESSION'}
        </button>
      </div>
    </div>
  );
};

const MetricStrip = ({ label, value, color }) => (
  <div style={{ background:'var(--color-surface)', border:'1px solid var(--color-border)', borderRadius:'16px', padding:'16px' }}>
    <div style={{ fontSize:'10px', fontWeight:800, color:'var(--color-text-3)', textTransform:'uppercase', marginBottom:'4px' }}>{label}</div>
    <div style={{ fontSize:'20px', fontWeight:900, color }}>{value}</div>
  </div>
);

const Overview = () => {
  const { user } = useAuth();
  const { theme } = useThemeContext();
  const isDark = theme === 'dark';
  
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    // Initial fetch of tasks / stats would go here
    setLoading(false);
  }, [user]);

  if (!user) return null;

  const targetDate = new Date('2026-07-26');
  const now = new Date();
  const daysLeft = Math.floor((targetDate - now) / (1000 * 60 * 60 * 24));

  // Dynamic Week & Month
  const getWeekNumber = (d) => {
    d = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
    d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    return Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
  };
  const weekNum = getWeekNumber(now);
  const monthName = now.toLocaleString('en-US', { month: 'long' });
  const yearNum = now.getFullYear();

  return (
    <div style={{ maxWidth: 'var(--content-max)', margin: '0 auto', padding: '0 var(--content-pad)' }}>
      
      {/* Header Area */}
      <div style={{ marginBottom: '48px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <div style={{ fontSize: '12px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.25em', color: 'var(--color-accent)', marginBottom: '12px' }}>Operational Intelligence</div>
          <h1 style={{ fontSize: '56px', fontWeight: 800, color: 'var(--color-text-1)', margin: 0, letterSpacing: '-0.04em', fontFamily: 'var(--font-serif)' }}>Day Control.</h1>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--color-text-2)' }}>{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</div>
          <div style={{ fontSize: '11px', color: 'var(--color-text-3)', marginTop: '4px' }}>AIIMIN v2.5 Protocol</div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '32px' }}>
        
        {/* Main Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          
          {/* Hero Widget: Placement Countdown */}
          <div style={{
            background: 'linear-gradient(135deg, var(--color-accent) 0%, #064e3b 100%)',
            borderRadius: '32px', padding: '40px', color: '#fff',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            boxShadow: '0 30px 60px rgba(22, 163, 74, 0.2)', position: 'relative', overflow: 'hidden'
          }}>
            <div style={{ position: 'absolute', top: '-40px', right: '-20px', fontSize: '180px', opacity: 0.08, pointerEvents: 'none' }}>🎯</div>
            <div>
              <div style={{ fontSize: '13px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.3em', opacity: 0.8, marginBottom: '12px' }}>Placement Target Launch</div>
              <div style={{ fontSize: '96px', fontWeight: 900, lineHeight: 0.9, letterSpacing: '-0.06em' }}>{daysLeft}</div>
              <div style={{ fontSize: '18px', fontWeight: 700, marginTop: '12px', opacity: 0.9 }}>Days Until July 26, {yearNum}</div>
            </div>
            <div style={{ textAlign: 'right', display:'flex', flexDirection:'column', gap:'8px' }}>
               <div style={{ padding:'10px 20px', background:'rgba(255,255,255,0.15)', backdropFilter:'blur(10px)', borderRadius:'16px', fontWeight:800, fontSize:'13px' }}>PROTOCOL: ACTIVE</div>
               <div style={{ padding:'10px 20px', background:'rgba(0,0,0,0.2)', borderRadius:'16px', fontWeight:700, fontSize:'11px', opacity:0.8 }}>SYSTEM HYDRATION: 94%</div>
            </div>
          </div>

          {/* Weekly Grid */}
          <div>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'24px' }}>
              <div style={{ fontSize: '16px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.15em', color: 'var(--color-text-1)' }}>Master Planner</div>
              <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-text-3)' }}>Week {weekNum} · {monthName} {yearNum}</div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '12px' }}>
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
                <div key={day} style={{ 
                  background: 'var(--color-surface)', 
                  border: '1px solid var(--color-border)', 
                  borderRadius: '20px', 
                  padding: '16px', 
                  minHeight: '240px',
                  display:'flex',
                  flexDirection:'column'
                }}>
                  <div style={{ fontSize: '10px', fontWeight: 900, textTransform: 'uppercase', color: 'var(--color-text-3)', marginBottom: '16px', borderBottom: '1px solid var(--color-border)', paddingBottom: '10px', letterSpacing:'0.1em' }}>{day}</div>
                  <div style={{ flex: 1, display:'flex', flexDirection:'column', gap:'8px' }}>
                    {/* Placeholder for tasks */}
                    <div style={{ width: '100%', height: '40px', borderRadius: '10px', border: '1.5px dashed var(--color-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', color: 'var(--color-text-3)', cursor: 'pointer', fontWeight:800 }}>+</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Sidebar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          
          <QuickCheckIn user={user} isDark={isDark} />

          {/* Progress Indicators */}
          <div style={{ background:'var(--color-surface)', border:'1px solid var(--color-border)', borderRadius:'24px', padding:'24px' }}>
            <div style={{ fontSize:'11px', fontWeight:800, textTransform:'uppercase', color:'var(--color-text-3)', marginBottom:'20px' }}>Trajectory</div>
            {[
              { label:'Yearly', val: 34, color: 'var(--color-accent)' },
              { label:'Monthly', val: 42, color: '#3B82F6' },
              { label:'Weekly', val: 68, color: '#F59E0B' },
              { label:'Daily', val: 72, color: '#EC4899' },
            ].map(p => (
              <div key={p.label} style={{ marginBottom:'20px' }}>
                <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'8px', fontSize:'11px', fontWeight:800 }}>
                  <span style={{ color:'var(--color-text-2)' }}>{p.label}</span>
                  <span style={{ color:p.color }}>{p.val}%</span>
                </div>
                <div style={{ height:'6px', background:'var(--color-border)', borderRadius:'3px', overflow:'hidden' }}>
                  <div style={{ height:'100%', width:`${p.val}%`, background:p.color, borderRadius:'3px' }} />
                </div>
              </div>
            ))}
          </div>

          {/* Quick Metrics */}
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'12px' }}>
            <MetricStrip label="DSA" value="142" color="#3B82F6" />
            <MetricStrip label="TYPING" value="84" color="#10B981" />
            <MetricStrip label="NOTES" value="1,204" color="#F59E0B" />
            <MetricStrip label="REPORTS" value="12" color="#8B5CF6" />
          </div>

          {/* Intelligence Radar */}
          <div style={{ background: 'var(--color-bg-2)', border: '1px solid var(--color-border)', borderRadius: '32px', padding: '32px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
              <div style={{ fontSize: '16px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.15em', color: 'var(--color-text-1)' }}>Life Balance Radar</div>
              <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--color-accent)', background:'var(--color-accent-dim)', padding:'4px 10px', borderRadius:'100px' }}>PROTOCOL: BALANCED</div>
            </div>
            <div style={{ height: '240px', width: '100%' }}>
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={[
                  { subject: 'Focus', A: 85, fullMark: 100 },
                  { subject: 'Vitality', A: 72, fullMark: 100 },
                  { subject: 'Wealth', A: 65, fullMark: 100 },
                  { subject: 'Mastery', A: 90, fullMark: 100 },
                  { subject: 'Social', A: 58, fullMark: 100 },
                  { subject: 'Discipline', A: 95, fullMark: 100 },
                ]}>
                  <PolarGrid stroke="var(--color-border)" />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: 'var(--color-text-3)', fontSize: 10, fontWeight: 700 }} />
                  <Radar
                    name="LifeBalance"
                    dataKey="A"
                    stroke="var(--color-accent)"
                    fill="var(--color-accent)"
                    fillOpacity={0.15}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
            <div style={{ fontSize: '12px', color: 'var(--color-text-3)', textAlign: 'center', lineHeight: 1.5, fontWeight: 500 }}>
              Your discipline is at a peak (95%). Focus on social integration (58%) to maintain neural harmony.
            </div>
          </div>
        </div>

        {/* Status Protocol decorative footer */}
        <div style={{ marginTop: '48px', padding: '32px', background: 'var(--color-bg-2)', borderRadius: '32px', border: '1px solid var(--color-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'relative', overflow: 'hidden' }}>
           <div style={{ position:'absolute', left:0, top:0, bottom:0, width:'4px', background:'var(--color-accent)' }} />
           <div>
             <div style={{ fontSize: '12px', fontWeight: 800, textTransform: 'uppercase', color: 'var(--color-text-3)', marginBottom: '4px' }}>System Integrity</div>
             <div style={{ fontSize: '18px', fontWeight: 800, color: 'var(--color-text-1)' }}>All systems operational. Life OS v2.1 active.</div>
           </div>
           <div style={{ display:'flex', gap:'24px' }}>
              <div style={{ textAlign:'right' }}>
                <div style={{ fontSize:'10px', fontWeight:800, opacity:0.5 }}>UPTIME</div>
                <div style={{ fontSize:'14px', fontWeight:900 }}>100%</div>
              </div>
              <div style={{ textAlign:'right' }}>
                <div style={{ fontSize:'10px', fontWeight:800, opacity:0.5 }}>NEURAL SYNC</div>
                <div style={{ fontSize:'14px', fontWeight:900 }}>OPTIMAL</div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Overview;
