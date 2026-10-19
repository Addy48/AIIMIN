import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RotateCcw, ChevronRight, Layers } from 'lucide-react';
import confirm from '../../utils/confirm';

const STORAGE_KEY = 'aiimin_leitner_v1';

const DEFAULT_DECK = [
  { id: 1, term: 'CAP Theorem', definition: 'Consistency, Availability, Partition tolerance — pick two in distributed systems.', category: 'System Design' },
  { id: 2, term: 'Idempotency', definition: 'Repeating an operation yields the same result (PUT/DELETE in REST).', category: 'API Design' },
  { id: 3, term: 'Closure', definition: 'Inner function retains access to outer scope variables in JavaScript.', category: 'JavaScript' },
  { id: 4, term: 'Virtual DOM', definition: 'In-memory UI representation synced to real DOM via reconciliation (React).', category: 'React' },
  { id: 5, term: 'Event Loop', definition: 'Node.js mechanism for non-blocking I/O on a single thread.', category: 'Node.js' },
  { id: 6, term: 'ACID', definition: 'Atomicity, Consistency, Isolation, Durability — database transaction guarantees.', category: 'Databases' },
  { id: 7, term: 'JWT', definition: 'Self-contained JSON token for stateless auth (RFC 7519).', category: 'Security' },
  { id: 8, term: 'Polymorphism', definition: 'Same interface, different implementations via inheritance.', category: 'OOP' },
  { id: 9, term: 'Docker', definition: 'Portable container packaging code + runtime + dependencies.', category: 'DevOps' },
  { id: 10, term: 'Big O', definition: 'Asymptotic complexity notation for algorithm efficiency.', category: 'Algorithms' },
];

const BOX_INTERVALS = [1, 2, 4, 7, 14]; // days per Leitner box

function loadState() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null');
    if (saved?.cards?.length) return saved;
  } catch { /* ignore */ }
  return {
    cards: DEFAULT_DECK.map((c) => ({ ...c, box: 1, nextReview: Date.now(), correctStreak: 0 })),
    stats: { reviewed: 0, mastered: 0 },
  };
}

function saveState(state) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch { /* ignore */ }
}

/**
 * Leitner spaced repetition — 5-box system (Ebbinghaus forgetting curve).
 * FSRS outperforms SM-2 (Anki) by 8–14% fewer reviews for same retention (2022 study).
 */
export default function FlashcardLeitner({ onClose }) {
  const [state, setState] = useState(loadState);
  const [current, setCurrent] = useState(null);
  const [flipped, setFlipped] = useState(false);
  const [sessionDone, setSessionDone] = useState(false);

  useEffect(() => { saveState(state); }, [state]);

  const dueCards = useMemo(
    () => state.cards.filter((c) => c.nextReview <= Date.now()).sort((a, b) => a.box - b.box),
    [state.cards]
  );

  const boxCounts = useMemo(() => {
    const counts = [0, 0, 0, 0, 0];
    state.cards.forEach((c) => { counts[Math.min(c.box - 1, 4)]++; });
    return counts;
  }, [state.cards]);

  const startSession = useCallback(() => {
    if (!dueCards.length) return;
    setCurrent(dueCards[0]);
    setFlipped(false);
    setSessionDone(false);
  }, [dueCards]);

  const rate = (correct) => {
    if (!current) return;
    const now = Date.now();
    const newBox = correct ? Math.min(5, current.box + 1) : 1;
    const days = BOX_INTERVALS[newBox - 1] || 14;
    const updated = state.cards.map((c) =>
      c.id === current.id
        ? {
            ...c,
            box: newBox,
            nextReview: now + days * 86400000,
            correctStreak: correct ? c.correctStreak + 1 : 0,
          }
        : c
    );
    const mastered = updated.filter((c) => c.box >= 5).length;
    setState((s) => ({
      cards: updated,
      stats: { reviewed: s.stats.reviewed + 1, mastered },
    }));

    const remaining = updated.filter((c) => c.id !== current.id && c.nextReview <= now);
    if (remaining.length) {
      setCurrent(remaining[0]);
      setFlipped(false);
    } else {
      setCurrent(null);
      setSessionDone(true);
    }
  };

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '32px 20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '28px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <Layers size={18} style={{ color: 'var(--color-accent)' }} />
            <h2 style={{ fontSize: '24px', fontWeight: 800, margin: 0, color: 'var(--color-text-1)' }}>Leitner Flashcards</h2>
          </div>
          <p style={{ fontSize: '13px', color: 'var(--color-text-3)', margin: 0 }}>Spaced repetition — cards advance through 5 boxes as you recall them.</p>
        </div>
        <div style={{ textAlign: 'right', fontSize: '12px', color: 'var(--color-text-3)' }}>
          <div><strong style={{ color: '#10B981' }}>{state.stats.mastered}</strong> mastered</div>
          <div><strong>{dueCards.length}</strong> due today</div>
        </div>
      </div>

      {/* Leitner boxes */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '8px', marginBottom: '28px' }}>
        {boxCounts.map((count, i) => (
          <div key={i} style={{
            padding: '12px 8px', borderRadius: '12px', textAlign: 'center',
            background: `color-mix(in srgb, ${['#EF4444', '#F59E0B', '#2563EB', '#10B981', 'var(--color-accent)'][i]} 12%, transparent)`,
            border: `1px solid ${['#EF4444', '#F59E0B', '#2563EB', '#10B981', 'var(--color-accent)'][i]}33`,
          }}>
            <div style={{ fontSize: '18px', fontWeight: 900, color: 'var(--color-text-1)' }}>{count}</div>
            <div style={{ fontSize: '9px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--color-text-3)' }}>Box {i + 1}</div>
            <div style={{ fontSize: '9px', color: 'var(--color-text-3)' }}>{BOX_INTERVALS[i]}d</div>
          </div>
        ))}
      </div>

      {!current && !sessionDone && (
        <div style={{ textAlign: 'center', padding: '48px', background: 'var(--color-surface)', borderRadius: '20px', border: '1px solid var(--color-border)' }}>
          {dueCards.length === 0 ? (
            <>
              <div style={{ fontSize: '48px', marginBottom: '12px' }}>🎉</div>
              <div style={{ fontSize: '16px', fontWeight: 700, color: 'var(--color-text-1)', marginBottom: '8px' }}>All caught up!</div>
              <div style={{ fontSize: '13px', color: 'var(--color-text-3)' }}>No cards due for review right now.</div>
            </>
          ) : (
            <>
              <div style={{ fontSize: '16px', fontWeight: 700, color: 'var(--color-text-1)', marginBottom: '16px' }}>{dueCards.length} cards ready</div>
              <button type="button" onClick={startSession} style={{ padding: '14px 32px', borderRadius: '12px', border: 'none', background: 'var(--color-accent)', color: '#fff', fontWeight: 800, cursor: 'pointer', fontSize: '14px' }}>
                Start Review <ChevronRight size={16} style={{ verticalAlign: 'middle' }} />
              </button>
            </>
          )}
        </div>
      )}

      {sessionDone && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ textAlign: 'center', padding: '40px', background: 'var(--color-surface)', borderRadius: '20px', border: '1px solid var(--color-border)' }}>
          <div style={{ fontSize: '40px', marginBottom: '12px' }}>✅</div>
          <div style={{ fontSize: '18px', fontWeight: 800, marginBottom: '16px' }}>Session complete</div>
          <button type="button" onClick={() => setSessionDone(false)} style={{ padding: '12px 24px', borderRadius: '10px', border: '1px solid var(--color-border)', background: 'var(--bg-elevated)', cursor: 'pointer', fontWeight: 700 }}>
            Done
          </button>
        </motion.div>
      )}

      <AnimatePresence mode="wait">
        {current && (
          <motion.div
            key={current.id}
            initial={{ opacity: 0, rotateY: -10 }}
            animate={{ opacity: 1, rotateY: 0 }}
            exit={{ opacity: 0 }}
            style={{ perspective: '1000px' }}
          >
            <div
              onClick={() => setFlipped((f) => !f)}
              style={{
                minHeight: 280, padding: '40px', borderRadius: '24px', cursor: 'pointer',
                background: 'var(--color-surface)', border: '1px solid var(--color-border)',
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                textAlign: 'center', marginBottom: '20px',
              }}
            >
              <span style={{ fontSize: '11px', fontWeight: 700, color: '#2563EB', background: 'rgba(37,99,235,0.1)', padding: '6px 12px', borderRadius: '99px', marginBottom: '16px' }}>
                {current.category} · Box {current.box}
              </span>
              {!flipped ? (
                <div style={{ fontSize: '32px', fontWeight: 800, color: 'var(--color-text-1)' }}>{current.term}</div>
              ) : (
                <div style={{ fontSize: '16px', lineHeight: 1.7, color: 'var(--color-text-2)', maxWidth: 520 }}>{current.definition}</div>
              )}
              <div style={{ fontSize: '11px', color: 'var(--color-text-3)', marginTop: '20px' }}>Tap to {flipped ? 'hide' : 'reveal'}</div>
            </div>

            {flipped && (
              <div style={{ display: 'flex', gap: '12px' }}>
                <button type="button" onClick={() => rate(false)} style={{ flex: 1, padding: '16px', borderRadius: '12px', border: '1px solid #EF4444', background: 'rgba(239,68,68,0.08)', color: '#EF4444', fontWeight: 800, cursor: 'pointer' }}>
                  Again → Box 1
                </button>
                <button type="button" onClick={() => rate(true)} style={{ flex: 1, padding: '16px', borderRadius: '12px', border: 'none', background: '#10B981', color: '#fff', fontWeight: 800, cursor: 'pointer' }}>
                  Got it → Box {Math.min(5, current.box + 1)}
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <button
        type="button"
        onClick={async () => { if (await confirm('Reset all cards to Box 1?')) { setState(loadState()); setCurrent(null); } }}
        style={{ marginTop: '24px', display: 'flex', alignItems: 'center', gap: '6px', background: 'none', border: 'none', color: 'var(--color-text-3)', fontSize: '11px', cursor: 'pointer' }}
      >
        <RotateCcw size={12} /> Reset deck
      </button>
    </div>
  );
}
