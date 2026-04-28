import React, { useState, useEffect } from 'react';
import { supabase } from '../../utils/supabase';

const CHALLENGES = [
  { id: 'cold_shower', label: 'Cold Shower', icon: '❄️', xp: 50 },
  { id: 'deep_work', label: 'Deep Work (2h+)', icon: '🧠', xp: 100 },
  { id: 'hard_workout', label: 'Hard Workout', icon: '🏋️', xp: 80 },
  { id: 'no_distraction', label: 'Zero Distraction Day', icon: '📵', xp: 120 },
  { id: 'meditation', label: 'Meditation (20m+)', icon: '🧘', xp: 40 },
  { id: 'reading_deep', label: 'Deep Reading', icon: '📖', xp: 60 },
];

export default function ThePit({ userId, isDark, onClose }) {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [logging, setLogging] = useState(null);

  const border = isDark ? '#222' : '#e5e7eb';
  const text1 = isDark ? '#ededed' : '#111';
  const text2 = isDark ? '#a1a1aa' : '#6b7280';

  useEffect(() => {
    fetchTodayLogs();
  }, [userId]);

  const fetchTodayLogs = async () => {
    const today = new Date().toISOString().split('T')[0];
    const { data, error } = await supabase
      .from('lab_pit_logs')
      .select('*')
      .eq('user_id', userId)
      .gte('created_at', today);
    
    if (data) setLogs(data);
    setLoading(false);
  };

  const handleLog = async (challenge) => {
    setLogging(challenge.id);
    const { error } = await supabase.from('lab_pit_logs').insert({
      user_id: userId,
      challenge_id: challenge.id,
      label: challenge.label,
      xp_earned: challenge.xp
    });
    
    if (!error) {
      await fetchTodayLogs();
    }
    setLogging(null);
  };

  const isLogged = (id) => logs.some(l => l.challenge_id === id);

  return (
    <div style={{ padding: '32px' }}>
      <div style={{ marginBottom: '28px' }}>
        <h2 style={{ fontSize: '24px', fontWeight: 800, color: text1, margin: '0 0 8px' }}>The Pit</h2>
        <p style={{ fontSize: '14px', color: text2 }}>Where discipline is forged. No excuses, just output.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '32px' }}>
        {CHALLENGES.map(c => {
          const done = isLogged(c.id);
          return (
            <button 
              key={c.id}
              onClick={() => !done && handleLog(c)}
              disabled={done || logging === c.id}
              style={{
                padding: '20px', borderRadius: '16px', border: `1px solid ${done ? '#22C55E' : border}`,
                background: done ? 'rgba(34,197,94,0.08)' : (isDark ? '#111' : '#f9fafb'),
                cursor: done ? 'default' : 'pointer', textAlign: 'left', transition: 'all 200ms ease',
                display: 'flex', flexDirection: 'column', gap: '8px', position: 'relative', overflow: 'hidden'
              }}
            >
              <div style={{ fontSize: '24px' }}>{c.icon}</div>
              <div>
                <div style={{ fontSize: '14px', fontWeight: 700, color: done ? '#22C55E' : text1 }}>{c.label}</div>
                <div style={{ fontSize: '11px', color: done ? '#22C55E' : text2, opacity: 0.8 }}>+{c.xp} XP</div>
              </div>
              {done && (
                <div style={{ position: 'absolute', top: '12px', right: '12px', color: '#22C55E' }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                </div>
              )}
              {logging === c.id && (
                <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '12px', fontWeight: 700 }}>
                  LOGGING...
                </div>
              )}
            </button>
          );
        })}
      </div>

      <div style={{ padding: '20px', borderRadius: '16px', background: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.03)', border: `1px dashed ${border}` }}>
        <div style={{ fontSize: '12px', fontWeight: 700, color: text2, textTransform: 'uppercase', marginBottom: '8px' }}>Daily Discipline Score</div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
          <div style={{ fontSize: '32px', fontWeight: 900, color: text1 }}>{logs.reduce((acc, curr) => acc + curr.xp_earned, 0)}</div>
          <div style={{ fontSize: '14px', fontWeight: 600, color: text2 }}>XP Earned Today</div>
        </div>
      </div>
    </div>
  );
}
