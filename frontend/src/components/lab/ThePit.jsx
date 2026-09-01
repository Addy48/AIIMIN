import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from '../../utils/supabase';
import {
  Snowflake,
  Brain,
  Barbell,
  DeviceMobileSlash,
  Heartbeat,
  BookOpen,
  Check,
  X,
} from '@phosphor-icons/react';

const CHALLENGES = [
  { id: 'cold_shower', label: 'Cold Shower', icon: Snowflake, xp: 50 },
  { id: 'deep_work', label: 'Deep Work (2h+)', icon: Brain, xp: 100 },
  { id: 'hard_workout', label: 'Hard Workout', icon: Barbell, xp: 80 },
  { id: 'no_distraction', label: 'Zero Distraction Day', icon: DeviceMobileSlash, xp: 120 },
  { id: 'meditation', label: 'Meditation (20m+)', icon: Heartbeat, xp: 40 },
  { id: 'reading_deep', label: 'Deep Reading', icon: BookOpen, xp: 60 },
];

export default function ThePit({ userId, isDark, onClose }) {
  const [logs, setLogs] = useState([]);
  const [logging, setLogging] = useState(null);

  const border = 'var(--color-border)';
  const text1 = 'var(--color-text-1)';
  const text2 = 'var(--color-text-2)';

  const fetchTodayLogs = useCallback(async () => {
    const today = new Date().toISOString().split('T')[0];
    const { data } = await supabase
      .from('lab_pit_logs')
      .select('*')
      .eq('user_id', userId)
      .gte('created_at', today);
    
    if (data) setLogs(data);
  }, [userId]);

  useEffect(() => {
    fetchTodayLogs();
  }, [fetchTodayLogs]);

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

  const isDone = (challengeId) => logs.some(l => l.challenge_id === challengeId);

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '40px 24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <h2 style={{ fontSize: '28px', fontWeight: 900, color: text1, margin: 0, letterSpacing: '-0.02em' }}>THE PIT</h2>
          <p style={{ fontSize: '14px', color: text2, marginTop: '4px' }}>Voluntary hardship builds unshakeable resilience. Log one daily.</p>
        </div>
        {onClose && (
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: text2, cursor: 'pointer' }}>
            <X size={20} />
          </button>
        )}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '40px' }}>
        {CHALLENGES.map(c => {
          const done = isDone(c.id);
          const Icon = c.icon;
          return (
            <button
              key={c.id}
              onClick={() => !done && handleLog(c)}
              disabled={done || logging === c.id}
              style={{
                padding: '24px', borderRadius: '20px', border: `2px solid ${done ? '#22C55E' : border}`,
                background: done ? 'rgba(34,197,94,0.08)' : 'var(--color-surface)',
                cursor: done ? 'default' : 'pointer', textAlign: 'left', transition: 'all 200ms ease',
                display: 'flex', flexDirection: 'column', gap: '12px', position: 'relative', overflow: 'hidden'
              }}
            >
              <div style={{ color: done ? '#22C55E' : 'var(--color-accent)' }}>
                <Icon size={32} weight="duotone" />
              </div>
              <div>
                <div style={{ fontSize: '18px', fontWeight: 700, color: done ? '#22C55E' : text1 }}>{c.label}</div>
                <div style={{ fontSize: '14px', color: done ? '#22C55E' : text2, opacity: 0.8, marginTop: '4px' }}>+{c.xp} XP</div>
              </div>
              {done && (
                <div style={{ position: 'absolute', top: '12px', right: '12px', color: '#22C55E' }}>
                  <Check size={18} weight="bold" />
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

      <div style={{ padding: '32px', borderRadius: '20px', background: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.03)', border: `2px dashed ${border}` }}>
        <div style={{ fontSize: '14px', fontWeight: 800, color: text2, textTransform: 'uppercase', marginBottom: '12px', letterSpacing: '0.05em' }}>Daily Discipline Score</div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px' }}>
          <div style={{ fontSize: '48px', fontWeight: 900, color: text1 }}>{logs.reduce((acc, curr) => acc + curr.xp_earned, 0)}</div>
          <div style={{ fontSize: '18px', fontWeight: 600, color: text2 }}>XP Earned Today</div>
        </div>
      </div>
    </div>
  );
}
