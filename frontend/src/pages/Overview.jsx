import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useThemeContext } from '../context/ThemeContext';
import supabase from '../utils/supabase';
import { motion, AnimatePresence } from 'framer-motion';

/* ── Components ── */

const STATES = ['clarity', 'scarcity', 'abundance', 'fear', 'growth', 'aimlessness', 'focus', 'noise'];
const STATE_ICONS = { clarity: '🔍', scarcity: '🪨', abundance: '🌊', fear: '🌑', growth: '🌱', aimlessness: '🌫️', focus: '🎯', noise: '📡' };

const QuickCheckIn = ({ user, isDark }) => {
  const [vals, setVals] = useState({ mood: 7, energy: 7, focus: 7 });
  const [state, setState] = useState('focus');
  const [note, setNote] = useState('');
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  
  const save = async () => {
    if (!user || saving) return;
    setSaving(true);
    const today = new Date().toISOString().split('T')[0];
    
    try {
      // Log to daily_logs (Numbers)
      const { error: dailyErr } = await supabase.from('daily_logs').insert({
        user_id: user.id,
        mood: vals.mood,
        energy_level: vals.energy,
        focus_score: vals.focus,
        logged_at: new Date().toISOString()
      });

      // Log to lab_mindset_logs (State/Text)
      const { error: mindsetErr } = await supabase.from('lab_mindset_logs').insert({
        user_id: user.id,
        state: state,
        note: note.trim() || null,
        day_of: today,
        logged_at: new Date().toISOString()
      });

      if (!dailyErr && !mindsetErr) {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
        setNote('');
      }
    } catch (err) {
      console.error('Check-in error:', err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ background: isDark?'var(--color-surface)':'#fff', border: '1px solid var(--color-border)', borderRadius:'20px', padding:'24px' }}>
      <div style={{ fontSize:'12px', fontWeight:800, textTransform:'uppercase', letterSpacing:'0.12em', color:isDark?'#fff':'#000', marginBottom:'20px', display:'flex', alignItems:'center', gap:'8px' }}>
        <span style={{ width:'6px', height:'6px', borderRadius:'50%', background:'var(--color-accent)' }} /> 
        Operational Pulse
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'repeat(4, 1fr)', gap:'8px', marginBottom:'24px' }}>
        {STATES.map(s => (
          <button key={s} onClick={() => setState(s)}
            style={{
              background: state === s ? 'var(--color-accent)' : (isDark?'rgba(255,255,255,0.03)':'rgba(0,0,0,0.02)'),
              color: state === s ? '#fff' : 'var(--color-text-3)',
              border: '1px solid var(--color-border)', borderRadius: '8px',
              padding: '8px 4px', cursor: 'pointer',
              fontSize: '10px', fontWeight: 800, textAlign: 'center',
              transition: 'all 0.15s',
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px'
            }}
          >
            <span style={{ fontSize: '14px' }}>{STATE_ICONS[s]}</span>
            {s}
          </button>
        ))}
      </div>

      <div style={{ display:'flex', flexDirection:'column', gap:'18px' }}>
        {['mood', 'energy', 'focus'].map(k => (
          <div key={k}>
            <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'8px' }}>
              <span style={{ fontSize:'10px', fontWeight:800, textTransform:'uppercase', color:'var(--color-text-3)' }}>{k}</span>
              <span style={{ fontSize:'11px', fontWeight:900, color:'var(--color-accent)' }}>{vals[k]}</span>
            </div>
            <input type="range" min={1} max={10} value={vals[k]} onChange={e => setVals(v=>({...v, [k]: Number(e.target.value)}))}
              style={{ width:'100%', height:'4px', appearance:'none', background:'var(--color-border)', borderRadius:'10px', outline:'none', cursor:'pointer' }} />
          </div>
        ))}
        <textarea placeholder="Quick reflection..." value={note} onChange={e=>setNote(e.target.value)}
          style={{ width:'100%', background:isDark?'rgba(255,255,255,0.03)':'rgba(0,0,0,0.02)', border:'1px solid var(--color-border)', borderRadius:'12px', padding:'12px', fontSize:'13px', color:'var(--color-text-1)', outline:'none', resize:'none', height:'60px', fontFamily:'inherit' }} />
        <button onClick={save} disabled={saved || saving}
          style={{ padding:'14px', borderRadius:'14px', background:saved?'var(--color-accent-dim)':'var(--color-accent)', color:saved?'var(--color-accent)':'#fff', border:'none', fontSize:'13px', fontWeight:900, cursor:'pointer', transition:'all 0.2s' }}>
          {saved ? '✓ DATA SYNCED' : saving ? 'SYNCING...' : 'COMMIT SESSION'}
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
    setLoading(false);
  }, [user]);

  if (!user) return null;

  const targetDate = new Date('2026-07-26');
  const now = new Date();
  const daysLeft = Math.floor((targetDate - now) / (1000 * 60 * 60 * 24));

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
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>
      
      {/* Header Area */}
      <div style={{ marginBottom: '40px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <div style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.2em', color: 'var(--color-accent)', marginBottom: '8px' }}>Operational Intelligence</div>
          <h1 style={{ fontSize: '40px', fontWeight: 800, color: 'var(--color-text-1)', margin: 0, letterSpacing: '-0.03em', fontFamily: 'var(--font-serif)' }}>Day Control.</h1>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--color-text-2)' }}>{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</div>
          <div style={{ fontSize: '10px', color: 'var(--color-text-3)', marginTop: '4px' }}>AIIMIN v2.5 Protocol</div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '24px' }}>
        
        {/* Main Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* Hero Widget: Placement Countdown */}
          <div style={{
            background: 'linear-gradient(135deg, var(--color-accent) 0%, #064e3b 100%)',
            borderRadius: '24px', padding: '32px', color: '#fff',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            boxShadow: '0 20px 40px rgba(22, 163, 74, 0.15)', position: 'relative', overflow: 'hidden'
          }}>
            <div style={{ position: 'absolute', top: '-20px', right: '-10px', fontSize: '140px', opacity: 0.08, pointerEvents: 'none' }}>🎯</div>
            <div>
              <div style={{ fontSize: '11px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.2em', opacity: 0.8, marginBottom: '8px' }}>Placement Target Launch</div>
              <div style={{ fontSize: '72px', fontWeight: 900, lineHeight: 0.9, letterSpacing: '-0.05em' }}>{daysLeft}</div>
              <div style={{ fontSize: '16px', fontWeight: 700, marginTop: '8px', opacity: 0.9 }}>Days Until July 26, {yearNum}</div>
            </div>
            <div style={{ textAlign: 'right' }}>
               <div style={{ padding:'8px 16px', background:'rgba(255,255,255,0.15)', backdropFilter:'blur(10px)', borderRadius:'12px', fontWeight:800, fontSize:'11px' }}>PROTOCOL: ACTIVE</div>
            </div>
          </div>

          {/* Weekly Grid */}
          <div>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'20px' }}>
              <div style={{ fontSize: '14px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--color-text-1)' }}>Master Planner</div>
              <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-text-3)' }}>Week {weekNum} · {monthName} {yearNum}</div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '8px' }}>
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
                <div key={day} style={{ 
                  background: 'var(--color-surface)', 
                  border: '1px solid var(--color-border)', 
                  borderRadius: '16px', 
                  padding: '12px', 
                  minHeight: '200px',
                  display:'flex',
                  flexDirection:'column'
                }}>
                  <div style={{ fontSize: '9px', fontWeight: 900, textTransform: 'uppercase', color: 'var(--color-text-3)', marginBottom: '12px', borderBottom: '1px solid var(--color-border)', paddingBottom: '8px', letterSpacing:'0.1em' }}>{day}</div>
                  <div style={{ flex: 1, display:'flex', flexDirection:'column', gap:'6px' }}>
                    <div style={{ width: '100%', height: '32px', borderRadius: '8px', border: '1.5px dashed var(--color-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '9px', color: 'var(--color-text-3)', cursor: 'pointer', fontWeight:800 }}>+</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Sidebar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          <QuickCheckIn user={user} isDark={isDark} />

          {/* Progress Indicators */}
          <div style={{ background:'var(--color-surface)', border:'1px solid var(--color-border)', borderRadius:'20px', padding:'20px' }}>
            <div style={{ fontSize:'10px', fontWeight:800, textTransform:'uppercase', color:'var(--color-text-3)', marginBottom:'16px' }}>Trajectory</div>
            {[
              { label:'Yearly', val: 34, color: 'var(--color-accent)' },
              { label:'Monthly', val: 42, color: '#3B82F6' },
              { label:'Weekly', val: 68, color: '#F59E0B' },
              { label:'Daily', val: 72, color: '#EC4899' },
            ].map(p => (
              <div key={p.label} style={{ marginBottom:'16px' }}>
                <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'6px', fontSize:'10px', fontWeight:800 }}>
                  <span style={{ color:'var(--color-text-2)' }}>{p.label}</span>
                  <span style={{ color:p.color }}>{p.val}%</span>
                </div>
                <div style={{ height:'4px', background:'var(--color-border)', borderRadius:'2px', overflow:'hidden' }}>
                  <div style={{ height:'100%', width:`${p.val}%`, background:p.color, borderRadius:'2px' }} />
                </div>
              </div>
            ))}
          </div>

          {/* Quick Metrics */}
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'8px' }}>
            <MetricStrip label="DSA" value="142" color="#3B82F6" />
            <MetricStrip label="TYPING" value="84" color="#10B981" />
            <MetricStrip label="NOTES" value="1,204" color="#F59E0B" />
            <MetricStrip label="REPORTS" value="12" color="#8B5CF6" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Overview;

