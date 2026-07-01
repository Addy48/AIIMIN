import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, Zap, Hash, Target } from 'lucide-react';
import AnimatedNumber from '../ui/AnimatedNumber';
import { apiPost } from '../../utils/api';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5001';

/**
 * Cognitive Benchmark — reaction speed, digit span, 1-back (working memory triad).
 */
export default function CognitiveBenchmark({ onClose }) {
  const [phase, setPhase] = useState('intro'); // intro | reaction | digit | nback | results
  const [reactionMs, setReactionMs] = useState(null);
  const [digitSpan, setDigitSpan] = useState(0);
  const [nBackScore, setNBackScore] = useState(0);
  const [overallScore, setOverallScore] = useState(null);
  const [saving, setSaving] = useState(false);

  const computeOverall = useCallback((react, digit, nback) => {
    const reactScore = react ? Math.max(0, Math.min(100, 100 - (react - 180) / 2)) : 50;
    const digitScore = Math.min(100, (digit / 9) * 100);
    const nbackPct = nback;
    return Math.round((reactScore * 0.35) + (digitScore * 0.35) + (nbackPct * 0.30));
  }, []);

  const finishAll = async (react, digit, nback) => {
    const overall = computeOverall(react, digit, nback);
    setOverallScore(overall);
    setPhase('results');
    setSaving(true);
    try {
      const token = localStorage.getItem('access_token');
      await fetch(`${API_BASE}/lab/practice/reaction`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ trial_ms: [react, react + 20, react - 15, react + 10, react] }),
      });
    } catch { /* silent */ }
    try {
      await apiPost('/lab/cognitive-benchmark', {
        reaction_speed_ms: react,
        digit_span_score: digit,
        n_back_score: nback,
        overall_score: overall,
      });
    } catch { /* table may not exist */ }
    setSaving(false);
  };

  return (
    <div style={{ maxWidth: '720px', margin: '0 auto', padding: '32px 20px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '28px' }}>
        <div style={{ padding: '10px', borderRadius: '12px', background: 'var(--color-accent-dim)', color: 'var(--color-accent)' }}>
          <Brain size={22} />
        </div>
        <div>
          <h2 style={{ fontSize: '24px', fontWeight: 800, margin: 0 }}>Cognitive Benchmark</h2>
          <p style={{ fontSize: '12px', color: 'var(--color-text-3)', margin: '4px 0 0' }}>3 tests · ~5 minutes · tracks your cognitive baseline</p>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {phase === 'intro' && (
          <motion.div key="intro" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div style={{ display: 'grid', gap: '12px', marginBottom: '24px' }}>
              {[
                { icon: Zap, label: 'Reaction Speed', desc: '5 trials — click when screen turns green', color: '#2563EB' },
                { icon: Hash, label: 'Digit Span', desc: 'Remember increasing number sequences', color: '#F59E0B' },
                { icon: Target, label: '1-Back Task', desc: 'Press when current letter matches previous', color: '#10B981' },
              ].map(({ icon: Icon, label, desc, color }) => (
                <div key={label} style={{ display: 'flex', gap: '14px', padding: '16px', borderRadius: '14px', border: '1px solid var(--color-border)', background: 'var(--color-surface)' }}>
                  <Icon size={20} style={{ color, flexShrink: 0 }} />
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: 700 }}>{label}</div>
                    <div style={{ fontSize: '12px', color: 'var(--color-text-3)' }}>{desc}</div>
                  </div>
                </div>
              ))}
            </div>
            <button type="button" onClick={() => setPhase('reaction')} style={{ width: '100%', padding: '16px', borderRadius: '14px', border: 'none', background: 'var(--color-accent)', color: '#fff', fontWeight: 800, fontSize: '15px', cursor: 'pointer' }}>
              Begin Benchmark
            </button>
          </motion.div>
        )}

        {phase === 'reaction' && (
          <ReactionTest
            onComplete={(ms) => { setReactionMs(ms); setPhase('digit'); }}
          />
        )}

        {phase === 'digit' && (
          <DigitSpanTest
            onComplete={(span) => { setDigitSpan(span); setPhase('nback'); }}
          />
        )}

        {phase === 'nback' && (
          <NBackTest
            onComplete={(score) => {
              setNBackScore(score);
              finishAll(reactionMs, digitSpan, score);
            }}
          />
        )}

        {phase === 'results' && overallScore != null && (
          <motion.div key="results" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={{ textAlign: 'center' }}>
            <div className="score-highlight" style={{ fontSize: '72px', fontWeight: 900, color: 'var(--color-accent)', fontFamily: 'var(--font-mono)', lineHeight: 1 }}>
              <AnimatedNumber value={overallScore} duration={0.8} />
            </div>
            <div style={{ fontSize: '12px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.15em', color: 'var(--color-text-3)', marginBottom: '32px' }}>Overall Cognitive Score</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '24px' }}>
              {[
                { label: 'Reaction', value: reactionMs ? `${reactionMs}ms` : '—', color: '#2563EB' },
                { label: 'Digit Span', value: digitSpan, color: '#F59E0B' },
                { label: '1-Back', value: `${nBackScore}%`, color: '#10B981' },
              ].map(({ label, value, color }) => (
                <div key={label} style={{ padding: '16px', borderRadius: '12px', border: `1px solid ${color}33`, background: `color-mix(in srgb, ${color} 8%, transparent)` }}>
                  <div style={{ fontSize: '9px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--color-text-3)' }}>{label}</div>
                  <div style={{ fontSize: '20px', fontWeight: 800, color, fontFamily: 'var(--font-mono)' }}>{value}</div>
                </div>
              ))}
            </div>
            {saving ? <div style={{ fontSize: '12px', color: 'var(--color-text-3)' }}>Saving to Lab history…</div> : (
              <button type="button" onClick={() => setPhase('intro')} style={{ padding: '12px 24px', borderRadius: '10px', border: '1px solid var(--color-border)', background: 'var(--bg-elevated)', fontWeight: 700, cursor: 'pointer' }}>
                Run Again
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function ReactionTest({ onComplete }) {
  const [state, setState] = useState('wait');
  const [trials, setTrials] = useState([]);
  const [trial, setTrial] = useState(0);
  const startRef = useRef(null);
  const timeoutRef = useRef(null);
  const doneRef = useRef(false);

  useEffect(() => {
    if (trials.length >= 5 && !doneRef.current) {
      doneRef.current = true;
      const sorted = [...trials].filter((t) => t < 900).sort((a, b) => a - b);
      const mean = sorted.length >= 3
        ? Math.round(sorted.slice(1, 4).reduce((a, b) => a + b, 0) / 3)
        : Math.round(sorted.reduce((a, b) => a + b, 0) / sorted.length);
      onComplete(mean || 300);
      return undefined;
    }
    if (trial >= 5) return undefined;
    setState('wait');
    const delay = 1500 + Math.random() * 2500;
    timeoutRef.current = setTimeout(() => {
      startRef.current = Date.now();
      setState('go');
    }, delay);
    return () => clearTimeout(timeoutRef.current);
  }, [trial, trials, onComplete]);

  const handleClick = () => {
    if (state === 'wait') {
      clearTimeout(timeoutRef.current);
      setTrials((t) => [...t, 999]);
      setTrial((n) => n + 1);
      return;
    }
    if (state === 'go') {
      const ms = Date.now() - startRef.current;
      setTrials((t) => [...t, ms]);
      setTrial((n) => n + 1);
    }
  };

  return (
    <div
      onClick={handleClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === ' ' && handleClick()}
      style={{
        height: 220, borderRadius: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
        background: state === 'go' ? '#10B981' : state === 'wait' ? '#EF4444' : 'var(--color-surface)',
        border: '2px solid var(--color-border)', transition: 'background 0.15s',
      }}
    >
      <div style={{ fontSize: '14px', fontWeight: 800, color: state === 'go' ? '#fff' : 'var(--color-text-2)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
        {state === 'wait' ? 'Wait for green…' : 'CLICK NOW!'}
      </div>
      <div style={{ fontSize: '12px', color: 'var(--color-text-3)', marginTop: '8px' }}>Trial {trial + 1} / 5</div>
    </div>
  );
}

function DigitSpanTest({ onComplete }) {
  const [level, setLevel] = useState(3);
  const [sequence, setSequence] = useState([]);
  const [phase, setPhase] = useState('show'); // show | input
  const [input, setInput] = useState('');
  const [best, setBest] = useState(0);

  const newSequence = useCallback((len) => {
    const seq = Array.from({ length: len }, () => Math.floor(Math.random() * 10));
    setSequence(seq);
    setPhase('show');
    setInput('');
    setTimeout(() => setPhase('input'), len * 800 + 500);
  }, []);

  useEffect(() => { newSequence(level); }, [level, newSequence]);

  const submit = () => {
    const expected = sequence.join('');
    if (input.trim() === expected) {
      setBest(level);
      if (level >= 9) { onComplete(level); return; }
      setLevel((l) => l + 1);
    } else {
      onComplete(best || level - 1);
    }
  };

  return (
    <div style={{ padding: '24px', borderRadius: '20px', border: '1px solid var(--color-border)', background: 'var(--color-surface)' }}>
      <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--color-text-3)', marginBottom: '16px' }}>Digit Span · Level {level}</div>
      {phase === 'show' ? (
        <div style={{ fontSize: '48px', fontWeight: 900, letterSpacing: '0.3em', textAlign: 'center', fontFamily: 'var(--font-mono)', color: 'var(--color-accent)' }}>
          {sequence.join(' ')}
        </div>
      ) : (
        <>
          <input
            autoFocus
            value={input}
            onChange={(e) => setInput(e.target.value.replace(/\D/g, ''))}
            onKeyDown={(e) => e.key === 'Enter' && submit()}
            placeholder="Enter digits…"
            style={{ width: '100%', padding: '16px', fontSize: '24px', textAlign: 'center', fontFamily: 'var(--font-mono)', borderRadius: '12px', border: '1px solid var(--color-border)', background: 'var(--bg-elevated)', color: 'var(--color-text-1)' }}
          />
          <button type="button" onClick={submit} style={{ marginTop: '12px', width: '100%', padding: '14px', borderRadius: '10px', border: 'none', background: 'var(--color-accent)', color: '#fff', fontWeight: 800, cursor: 'pointer' }}>Submit</button>
        </>
      )}
    </div>
  );
}

function NBackTest({ onComplete }) {
  const letters = 'ABCDEFGHJKLMNPQRSTUVWXYZ';
  const [round, setRound] = useState(0);
  const [current, setCurrent] = useState('');
  const [prev, setPrev] = useState('');
  const [hits, setHits] = useState(0);
  const [targets, setTargets] = useState(0);
  const [missed, setMissed] = useState(0);
  const total = 20;
  const finishedRef = useRef(false);

  useEffect(() => {
    if (round >= total) {
      if (!finishedRef.current) {
        finishedRef.current = true;
        const pct = targets > 0 ? Math.round((hits / targets) * 100) : 50;
        onComplete(Math.min(100, Math.max(0, pct - missed * 5)));
      }
      return undefined;
    }
    const isMatch = round > 0 && Math.random() < 0.35;
    const letter = isMatch && prev ? prev : letters[Math.floor(Math.random() * letters.length)];
    if (isMatch) setTargets((t) => t + 1);
    setCurrent(letter);
    if (round > 0) setPrev(current || letter);
    const t = setTimeout(() => setRound((r) => r + 1), 1800);
    return () => clearTimeout(t);
  }, [round]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleMatch = () => {
    if (round >= total) return;
    const isMatch = current === prev && round > 1;
    if (isMatch) setHits((h) => h + 1);
    else setMissed((m) => m + 1);
    setRound((r) => r + 1);
  };

  return (
    <div style={{ padding: '24px', borderRadius: '20px', border: '1px solid var(--color-border)', background: 'var(--color-surface)', textAlign: 'center' }}>
      <div style={{ fontSize: '12px', color: 'var(--color-text-3)', marginBottom: '16px' }}>1-Back · {round}/{total}</div>
      <div style={{ fontSize: '80px', fontWeight: 900, color: 'var(--color-text-1)', marginBottom: '24px' }}>{current}</div>
      <button type="button" onClick={handleMatch} style={{ padding: '14px 32px', borderRadius: '12px', border: 'none', background: '#2563EB', color: '#fff', fontWeight: 800, cursor: 'pointer' }}>
        Match Previous
      </button>
      <div style={{ fontSize: '11px', color: 'var(--color-text-3)', marginTop: '12px' }}>Press when letter matches the one before</div>
    </div>
  );
}
