import React, { useEffect, useState } from 'react';
import { Wind } from 'lucide-react';
import Modal from '../components/ui/Modal';

/**
 * 3-step Urge Surfing flow:
 * 1) 10s breath · 2) 5 min observe timer · 3) log outcome (surfed | gave in)
 */
export default function UrgeModal({ isOpen, onComplete, onCancel }) {
  const [step, setStep] = useState(1);
  const [breathLeft, setBreathLeft] = useState(10);
  const [observeLeft, setObserveLeft] = useState(5 * 60);
  const [phase, setPhase] = useState(0);
  const [note, setNote] = useState('');

  useEffect(() => {
    if (!isOpen) return undefined;
    setStep(1);
    setBreathLeft(10);
    setObserveLeft(5 * 60);
    setPhase(0);
    setNote('');
    return undefined;
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen || step !== 1) return undefined;
    if (breathLeft <= 0) {
      setStep(2);
      return undefined;
    }
    const t = setInterval(() => setBreathLeft((s) => Math.max(0, s - 1)), 1000);
    return () => clearInterval(t);
  }, [isOpen, step, breathLeft]);

  useEffect(() => {
    if (!isOpen || step !== 2) return undefined;
    if (observeLeft <= 0) {
      setStep(3);
      return undefined;
    }
    const t = setInterval(() => setObserveLeft((s) => Math.max(0, s - 1)), 1000);
    return () => clearInterval(t);
  }, [isOpen, step, observeLeft]);

  useEffect(() => {
    if (!isOpen || step !== 2) return undefined;
    const cycle = setInterval(() => setPhase((p) => (p + 1) % 3), 4000);
    return () => clearInterval(cycle);
  }, [isOpen, step]);

  const breathe = phase === 0 ? 'Inhale' : phase === 1 ? 'Hold' : 'Exhale';
  const mm = Math.floor(observeLeft / 60);
  const ss = (observeLeft % 60).toString().padStart(2, '0');

  return (
    <Modal isOpen={isOpen} onClose={onCancel} maxWidth="520px">
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--color-text-3)', marginBottom: 16 }}>
          Step {step} of 3
        </div>

        {step === 1 && (
          <>
            <div style={{
              display: 'inline-flex', padding: 20, marginBottom: 20,
              background: 'var(--color-accent-dim)', borderRadius: '50%',
              border: '1px solid color-mix(in srgb, var(--color-accent) 30%, transparent)',
            }}>
              <Wind size={40} color="var(--color-accent)" />
            </div>
            <h2 style={{ fontSize: 28, fontWeight: 900, color: 'var(--color-text-1)', margin: '0 0 8px', letterSpacing: '-0.02em' }}>
              Breathe
            </h2>
            <p style={{ margin: '0 0 20px', fontSize: 14, color: 'var(--color-text-2)', lineHeight: 1.5 }}>
              Ten seconds. Soften the spike before you observe it.
            </p>
            <div style={{ fontSize: 56, fontWeight: 900, fontFamily: 'var(--font-mono)', color: 'var(--color-text-1)', marginBottom: 16 }}>
              {breathLeft}s
            </div>
            <button
              type="button"
              onClick={() => setStep(2)}
              style={{
                width: '100%', padding: 14, background: 'transparent',
                border: '1px solid var(--color-border)', borderRadius: 12,
                color: 'var(--color-text-2)', fontWeight: 700, cursor: 'pointer',
              }}
            >
              Skip to observe
            </button>
          </>
        )}

        {step === 2 && (
          <>
            <div style={{
              display: 'inline-flex', padding: 20, marginBottom: 20,
              background: 'var(--color-accent-dim)', borderRadius: '50%',
              border: '1px solid color-mix(in srgb, var(--color-accent) 30%, transparent)',
              transform: phase === 2 ? 'scale(0.96)' : 'scale(1.04)',
              transition: 'transform 3.6s ease',
            }}>
              <Wind size={40} color="var(--color-accent)" />
            </div>
            <h2 style={{ fontSize: 28, fontWeight: 900, color: 'var(--color-text-1)', margin: '0 0 8px', letterSpacing: '-0.02em' }}>
              Observe the urge
            </h2>
            <p style={{ margin: '0 0 16px', fontSize: 14, color: 'var(--color-text-2)', lineHeight: 1.5 }}>
              Do not fight it. Watch it rise and pass for five minutes.
            </p>
            <div style={{ fontSize: 56, fontWeight: 900, fontFamily: 'var(--font-mono)', color: 'var(--color-text-1)', marginBottom: 8, letterSpacing: '-0.04em' }}>
              {mm}:{ss}
            </div>
            <div style={{ fontSize: 12, fontWeight: 800, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--color-accent)', marginBottom: 20 }}>
              {breathe}
            </div>
            <button
              type="button"
              onClick={() => setStep(3)}
              style={{
                width: '100%', padding: 14, background: 'var(--color-accent)', border: 'none',
                borderRadius: 12, color: '#fff', fontWeight: 800, cursor: 'pointer', marginBottom: 10,
              }}
            >
              Ready to log outcome
            </button>
            <button
              type="button"
              onClick={() => setObserveLeft((t) => t + 5 * 60)}
              style={{
                width: '100%', padding: 12, background: 'transparent',
                border: '1px solid var(--color-border)', borderRadius: 12,
                color: 'var(--color-text-2)', fontWeight: 700, cursor: 'pointer',
              }}
            >
              Extend 5 min
            </button>
          </>
        )}

        {step === 3 && (
          <>
            <h2 style={{ fontSize: 28, fontWeight: 900, color: 'var(--color-text-1)', margin: '0 0 8px', letterSpacing: '-0.02em' }}>
              Outcome
            </h2>
            <p style={{ margin: '0 0 20px', fontSize: 14, color: 'var(--color-text-2)', lineHeight: 1.5 }}>
              Honest log feeds your win rate. No shame either way.
            </p>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={2}
              placeholder="Optional — what was the urge saying?"
              style={{
                width: '100%', padding: 14, background: 'var(--color-base)',
                border: '1px solid var(--color-border)', borderRadius: 12,
                marginBottom: 16, fontSize: 14, color: 'var(--color-text-1)', boxSizing: 'border-box',
              }}
            />
            <button
              type="button"
              onClick={() => onComplete({ note, outcome: 'surfed' })}
              style={{
                width: '100%', padding: 16, marginBottom: 10,
                background: 'var(--color-accent)', border: 'none', borderRadius: 12,
                color: '#fff', fontWeight: 800, fontSize: 15, cursor: 'pointer',
              }}
            >
              I surfed it
            </button>
            <button
              type="button"
              onClick={() => onComplete({ note, outcome: 'gave_in' })}
              style={{
                width: '100%', padding: 14, marginBottom: 10,
                background: 'transparent', border: '1px solid rgba(239,68,68,0.4)', borderRadius: 12,
                color: '#ef4444', fontWeight: 700, fontSize: 14, cursor: 'pointer',
              }}
            >
              I gave in
            </button>
            <button
              type="button"
              onClick={onCancel}
              style={{
                width: '100%', padding: 12, background: 'transparent', border: 'none',
                color: 'var(--color-text-3)', fontWeight: 600, cursor: 'pointer',
              }}
            >
              Close
            </button>
          </>
        )}
      </div>
    </Modal>
  );
}
