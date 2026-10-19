import React from 'react';
import { motion } from 'framer-motion';
import { Mic, TrendingUp, Award, RotateCcw } from 'lucide-react';
import AnimatedNumber from '../ui/AnimatedNumber';

/**
 * Vocal post-session review — Kolb reflective cycle after speaking practice.
 */
export default function VocalPostSession({
  topic,
  prompt,
  scores = {},
  notes = '',
  durationSec = 60,
  onNewSession,
  color = 'var(--color-accent)',
}) {
  const avg = Math.round(
    ((scores.confidence_score || 0) + (scores.clarity_score || 0) + (scores.pace_score || 0)) / 3
  );

  const rating = avg >= 80
    ? { label: 'Strong delivery', emoji: '🏆', tip: 'Push into debate mode for real-time pressure.' }
    : avg >= 60
      ? { label: 'Solid foundation', emoji: '⭐', tip: 'Focus on clarity — slow down 10% and structure in 3 points.' }
      : { label: 'Building phase', emoji: '💪', tip: 'Record daily. Confidence follows repetition (Deci & Ryan SDT).' };

  const bars = [
    { key: 'confidence_score', label: 'Confidence', color: '#2563EB' },
    { key: 'clarity_score', label: 'Clarity', color: '#10B981' },
    { key: 'pace_score', label: 'Pace', color: '#F59E0B' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      style={{
        background: 'var(--color-surface)', border: '1px solid var(--color-border)',
        borderRadius: '24px', padding: '32px', borderTop: `4px solid ${color}`,
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <Mic size={18} style={{ color }} />
            <span style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--color-text-3)' }}>
              Session Complete
            </span>
          </div>
          <h3 style={{ fontSize: '20px', fontWeight: 800, margin: '0 0 4px', color: 'var(--color-text-1)' }}>{rating.emoji} {rating.label}</h3>
          <div style={{ fontSize: '12px', color: 'var(--color-text-3)' }}>{topic} · {durationSec}s recorded</div>
        </div>
        <div className="score-highlight" style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '48px', fontWeight: 900, color, fontFamily: 'var(--font-mono)', lineHeight: 1 }}>
            <AnimatedNumber value={avg} duration={0.6} />
          </div>
          <div style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--color-text-3)' }}>Avg Score</div>
        </div>
      </div>

      {prompt && (
        <div style={{ padding: '14px 16px', borderRadius: '12px', background: 'var(--bg-elevated)', border: '1px solid var(--color-border)', marginBottom: '20px', fontStyle: 'italic', fontSize: '14px', color: 'var(--color-text-2)', lineHeight: 1.5 }}>
          &ldquo;{prompt}&rdquo;
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '20px' }}>
        {bars.map(({ key, label, color: barColor }) => (
          <div key={key}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
              <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--color-text-2)' }}>{label}</span>
              <span style={{ fontSize: '14px', fontWeight: 800, color: barColor, fontFamily: 'var(--font-mono)' }}>{scores[key] || 0}</span>
            </div>
            <div style={{ height: '6px', borderRadius: '3px', background: 'var(--color-border)', overflow: 'hidden' }}>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${scores[key] || 0}%` }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
                style={{ height: '100%', background: barColor, borderRadius: '3px' }}
              />
            </div>
          </div>
        ))}
      </div>

      {notes && (
        <div style={{ marginBottom: '20px' }}>
          <div style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--color-text-3)', marginBottom: '6px' }}>Your Notes</div>
          <div style={{ fontSize: '13px', color: 'var(--color-text-2)', lineHeight: 1.5 }}>{notes}</div>
        </div>
      )}

      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', padding: '14px', borderRadius: '12px', background: 'var(--color-accent-dim)', marginBottom: '20px' }}>
        <TrendingUp size={16} style={{ color: 'var(--color-accent)', flexShrink: 0, marginTop: 2 }} />
        <div style={{ fontSize: '12px', color: 'var(--color-text-2)', lineHeight: 1.5 }}>{rating.tip}</div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '11px', color: 'var(--color-text-3)', marginBottom: '16px' }}>
        <Award size={12} /> Saved to Lab speaking history
      </div>

      <button
        type="button"
        onClick={onNewSession}
        style={{
          width: '100%', padding: '14px', borderRadius: '12px', border: '1px solid var(--color-border)',
          background: 'var(--bg-elevated)', color: 'var(--color-text-1)', fontWeight: 700, cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
        }}
      >
        <RotateCcw size={16} /> New Session
      </button>
    </motion.div>
  );
}
