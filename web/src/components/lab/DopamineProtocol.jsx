import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  TrendDown,
  TrendUp,
  DeviceMobile,
  Cookie,
  EyeSlash,
  GameController,
  Brain,
  Barbell,
  Drop,
  Heartbeat,
  ArrowLeft,
} from '@phosphor-icons/react';

export default function DopamineProtocol({ onBack }) {
  const [day, setDay] = useState(1);
  const [logs, setLogs] = useState([]);
  const [level, setLevel] = useState(50); // Baseline 50%

  // Simulated data for 30 days
  useEffect(() => {
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
    { label: "Doomscrolling (30m)", impact: -10, icon: DeviceMobile },
    { label: "Junk Food / Sugar", impact: -15, icon: Cookie },
    { label: "High Stimulus / Impulse", impact: -25, icon: EyeSlash },
    { label: "Video Games (Binge)", impact: -10, icon: GameController }
  ];

  const earnedDopamine = [
    { label: "Deep Work (90m)", impact: +15, icon: Brain },
    { label: "Intense Workout", impact: +20, icon: Barbell },
    { label: "Cold Exposure", impact: +15, icon: Drop },
    { label: "Mindfulness & Reset", impact: +10, icon: Heartbeat }
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
            background: 'var(--color-surface)',
            border: '1px solid var(--color-border)',
            borderRadius: '8px',
            padding: '0.5rem 0.75rem',
            color: 'var(--color-text-2)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            fontSize: '0.85rem'
          }}
        >
          <ArrowLeft size={14} /> Back to Lab
        </button>
        <div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0, color: 'var(--color-text-1)' }}>Dopamine Calibration</h2>
          <span style={{ fontSize: '0.8rem', color: 'var(--color-text-3)' }}>Re-sensitize Baseline Receptors Protocol</span>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {/* Baseline Meter */}
        <div style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: '16px', padding: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '0.5rem' }}>
            <div>
              <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-text-3)', fontWeight: 600 }}>Estimated Baseline</span>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: level >= 50 ? '#10B981' : '#EF4444' }}>{level}%</div>
            </div>
            <span style={{ fontSize: '0.8rem', color: 'var(--color-text-2)' }}>Day {day} of 30 Calibration</span>
          </div>

          <div style={{ width: '100%', height: '8px', background: 'var(--color-bg)', borderRadius: '4px', overflow: 'hidden' }}>
            <motion.div 
              style={{ height: '100%', background: level >= 50 ? '#10B981' : '#EF4444' }}
              initial={{ width: 0 }}
              animate={{ width: `${level}%` }}
              transition={{ type: 'spring', stiffness: 50 }}
            />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          {/* Cheap Dopamine */}
          <div style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: '16px', padding: '1.5rem' }}>
            <h3 style={{ fontSize: '1rem', color: '#EF4444', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <TrendDown size={18} weight="bold" /> Cheap Dopamine
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {cheapDopamine.map((action, i) => {
                const Icon = action.icon;
                return (
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
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                      <Icon size={16} weight="duotone" /> {action.label}
                    </span>
                    <span style={{ color: '#EF4444', fontSize: '0.8rem', fontWeight: 600 }}>{action.impact}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Earned Dopamine */}
          <div style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: '16px', padding: '1.5rem' }}>
            <h3 style={{ fontSize: '1rem', color: '#10B981', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <TrendUp size={18} weight="bold" /> Earned Dopamine
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {earnedDopamine.map((action, i) => {
                const Icon = action.icon;
                return (
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
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                      <Icon size={16} weight="duotone" /> {action.label}
                    </span>
                    <span style={{ color: '#10B981', fontSize: '0.8rem', fontWeight: 600 }}>+{action.impact}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
