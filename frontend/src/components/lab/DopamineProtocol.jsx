import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function DopamineProtocol({ onBack }) {
  const [day, setDay] = useState(1);
  const [logs, setLogs] = useState([]);
  const [level, setLevel] = useState(50); // Baseline 50%

  // Simulated data for 30 days
  useEffect(() => {
    // We could load this from Supabase, but keeping it local state for demo
    const saved = localStorage.getItem('dopamine_logs');
    if (saved) {
      setLogs(JSON.parse(saved));
    }
  }, []);

  const handleAction = (type, impact) => {
    const newLog = { id: Date.now(), type, impact, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
    const newLogs = [newLog, ...logs].slice(0, 10);
    setLogs(newLogs);
    localStorage.setItem('dopamine_logs', JSON.stringify(newLogs));
    
    // Update baseline based on impact
    setLevel(prev => Math.max(10, Math.min(100, prev + impact)));
  };

  const cheapDopamine = [
    { label: "Doomscrolling (30m)", impact: -10, emoji: "📱" },
    { label: "Junk Food / Sugar", impact: -15, emoji: "🍩" },
    { label: "Porn / High Stimulus", impact: -25, emoji: "🔞" },
    { label: "Video Games (Binge)", impact: -10, emoji: "🎮" }
  ];

  const earnedDopamine = [
    { label: "Deep Work (90m)", impact: +15, emoji: "🧠" },
    { label: "Intense Workout", impact: +20, emoji: "🏋️" },
    { label: "Cold Exposure", impact: +15, emoji: "🧊" },
    { label: "Meditation (20m)", impact: +10, emoji: "🧘" }
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      style={{ maxWidth: '800px', margin: '0 auto', width: '100%' }}
    >
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1.5rem', gap: '1rem' }}>
        <button 
          onClick={onBack}
          style={{
            background: 'transparent', border: 'none', color: 'var(--color-text-2)',
            cursor: 'pointer', fontSize: '1.25rem', padding: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center',
            borderRadius: '50%'
          }}
        >
          ←
        </button>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 600, color: 'var(--color-text-1)', margin: 0 }}>Dopamine Protocol</h2>
          <p style={{ color: 'var(--color-text-3)', fontSize: '0.875rem', margin: '0.25rem 0 0 0' }}>Monitor stimulus intake and recover your baseline focus.</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '1.5rem' }}>
        {/* Left Column: Actions */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          {/* Baseline Gauge */}
          <div style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: '16px', padding: '1.5rem' }}>
            <h3 style={{ fontSize: '1rem', color: 'var(--color-text-2)', marginBottom: '1rem', display: 'flex', justifyContent: 'space-between' }}>
              <span>Baseline Dopamine Tone</span>
              <span style={{ color: level > 70 ? '#10B981' : level < 30 ? '#EF4444' : '#F59E0B', fontWeight: 600 }}>{level}%</span>
            </h3>
            <div style={{ height: '12px', background: 'var(--color-bg)', borderRadius: '6px', overflow: 'hidden' }}>
              <motion.div 
                animate={{ width: `${level}%` }} 
                transition={{ type: 'spring', bounce: 0.4 }}
                style={{ 
                  height: '100%', 
                  background: level > 70 ? 'linear-gradient(90deg, #10B981, #34D399)' : level < 30 ? 'linear-gradient(90deg, #EF4444, #F87171)' : 'linear-gradient(90deg, #F59E0B, #FBBF24)',
                  borderRadius: '6px'
                }} 
              />
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--color-text-3)', marginTop: '0.75rem', margin: '0.75rem 0 0 0' }}>
              {level > 70 ? "Optimal baseline. High motivation, calm focus." : level < 30 ? "Baseline depleted. High lethargy, cravings, brain fog." : "Average baseline. Susceptible to cheap spikes."}
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            {/* Cheap Dopamine */}
            <div style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: '16px', padding: '1.5rem' }}>
              <h3 style={{ fontSize: '1rem', color: '#EF4444', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span>📉</span> Cheap Dopamine
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {cheapDopamine.map((action, i) => (
                  <button 
                    key={i} 
                    onClick={() => handleAction(action.label, action.impact)}
                    style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      background: 'var(--color-bg)', border: '1px solid var(--color-border)',
                      padding: '0.75rem', borderRadius: '8px', cursor: 'pointer', transition: 'all 0.2s',
                      color: 'var(--color-text-1)', fontSize: '0.9rem'
                    }}
                  >
                    <span>{action.emoji} {action.label}</span>
                    <span style={{ color: '#EF4444', fontSize: '0.8rem', fontWeight: 600 }}>{action.impact}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Earned Dopamine */}
            <div style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: '16px', padding: '1.5rem' }}>
              <h3 style={{ fontSize: '1rem', color: '#10B981', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span>📈</span> Earned Dopamine
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {earnedDopamine.map((action, i) => (
                  <button 
                    key={i} 
                    onClick={() => handleAction(action.label, action.impact)}
                    style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      background: 'var(--color-bg)', border: '1px solid var(--color-border)',
                      padding: '0.75rem', borderRadius: '8px', cursor: 'pointer', transition: 'all 0.2s',
                      color: 'var(--color-text-1)', fontSize: '0.9rem'
                    }}
                  >
                    <span>{action.emoji} {action.label}</span>
                    <span style={{ color: '#10B981', fontSize: '0.8rem', fontWeight: 600 }}>+{action.impact}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Log */}
        <div style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: '16px', padding: '1.5rem', display: 'flex', flexDirection: 'column' }}>
          <h3 style={{ fontSize: '1rem', color: 'var(--color-text-2)', marginBottom: '1rem' }}>Stimulus Log</h3>
          
          <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {logs.length === 0 ? (
              <div style={{ textAlign: 'center', color: 'var(--color-text-3)', fontSize: '0.9rem', marginTop: '2rem' }}>
                No stimulus logged today.
              </div>
            ) : (
              logs.map(log => (
                <div key={log.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--color-bg)', padding: '0.75rem', borderRadius: '8px', borderLeft: `3px solid ${log.impact > 0 ? '#10B981' : '#EF4444'}` }}>
                  <div>
                    <div style={{ color: 'var(--color-text-1)', fontSize: '0.9rem', fontWeight: 500 }}>{log.type}</div>
                    <div style={{ color: 'var(--color-text-3)', fontSize: '0.75rem' }}>{log.time}</div>
                  </div>
                  <div style={{ color: log.impact > 0 ? '#10B981' : '#EF4444', fontWeight: 600, fontSize: '0.9rem' }}>
                    {log.impact > 0 ? '+' : ''}{log.impact}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>
    </motion.div>
  );
}
