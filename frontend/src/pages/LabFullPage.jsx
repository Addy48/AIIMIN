import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useThemeContext } from '../context/ThemeContext';
import { supabase } from '../utils/supabase';
import TypingTest from '../components/lab/TypingTest';
import ReactionTest from '../components/lab/ReactionTest';
import SpeakingLogger from '../components/lab/SpeakingLogger';
import DecisionScenario from '../components/lab/DecisionScenario';
import MindsetLogger from '../components/lab/MindsetLogger';
import BeliefEntry from '../components/lab/BeliefEntry';
import './lab/lab.css';

/* ─────────────────────────────────────────────────────────────
   LabFullPage — reads directly from Supabase, no backend needed
───────────────────────────────────────────────────────────── */

const SAMPLE_TEXTS = [
  "The mind is not a vessel to be filled, but a fire to be kindled.",
  "Clarity comes from engagement, not from thought.",
  "Discipline is choosing between what you want now and what you want most.",
];

/* ── Typing test that saves to Supabase ─────────────────────── */
function TypingTestSupabase({ userId, onComplete }) {
  const { theme } = useThemeContext();
  const isDark = theme === 'dark';
  const [phase, setPhase] = useState('ready');
  const [text] = useState(() => SAMPLE_TEXTS[Math.floor(Math.random() * SAMPLE_TEXTS.length)]);
  const [input, setInput] = useState('');
  const [timeLeft, setTimeLeft] = useState(60);
  const [wpm, setWpm] = useState(null);
  const [accuracy, setAccuracy] = useState(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const timerRef = React.useRef(null);
  const inputRef = React.useRef(null);

  const border = isDark ? '#222' : '#e5e7eb';
  const text1 = isDark ? '#ededed' : '#111';
  const text2 = isDark ? '#a1a1aa' : '#6b7280';
  const cardBg = isDark ? '#111' : '#fff';

  React.useEffect(() => {
    if (phase !== 'running') return;
    timerRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) { clearInterval(timerRef.current); setPhase('done'); return 0; }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [phase]);

  React.useEffect(() => {
    if (phase !== 'done') return;
    const words = input.trim().split(/\s+/).filter(Boolean).length;
    const elapsed = 60 - timeLeft || 60;
    setWpm(Math.round((words / elapsed) * 60));
    const textChars = text.slice(0, input.length).split('');
    const inputChars = input.split('');
    let correct = 0;
    inputChars.forEach((c, i) => { if (c === textChars[i]) correct++; });
    setAccuracy(inputChars.length > 0 ? Number(((correct / inputChars.length) * 100).toFixed(1)) : 0);
  }, [phase]);

  const handleSave = async () => {
    setSaving(true);
    const today = new Date().toISOString().split('T')[0];
    const { error } = await supabase.from('lab_typing_tests').insert({
      user_id: userId,
      wpm: wpm,
      accuracy_pct: accuracy,
      duration_sec: 60,
      test_invalid: accuracy < 95,
      day_of: today,
    });
    setSaving(false);
    if (!error) { setSaved(true); onComplete?.(); }
  };

  const getCharStyle = (i) => {
    if (i >= input.length) return { color: isDark ? '#52525b' : '#9ca3af' };
    return input[i] === text[i] ? { color: isDark ? '#ededed' : '#111' } : { color: '#ef4444', textDecoration: 'underline' };
  };

  return (
    <div style={{ padding: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <span style={{ fontSize: '15px', fontWeight: 600, color: text1, fontFamily: 'var(--font-sans)' }}>Typing Test</span>
        {phase === 'running' && (
          <span style={{ fontSize: '20px', fontWeight: 700, color: timeLeft <= 10 ? '#ef4444' : text2, fontFamily: 'var(--font-mono)' }}>{timeLeft}s</span>
        )}
      </div>

      {phase === 'ready' && (
        <div style={{ textAlign: 'center', padding: '20px 0' }}>
          <p style={{ color: text2, fontFamily: 'var(--font-sans)', fontSize: '14px', marginBottom: '20px' }}>60-second test. Type the text as accurately as possible.</p>
          <button onClick={() => { setPhase('running'); setTimeout(() => inputRef.current?.focus(), 100); }}
            style={{ padding: '10px 28px', background: '#22C55E', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '13px', fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font-sans)' }}>
            Start Test
          </button>
        </div>
      )}

      {phase === 'running' && (
        <>
          <div style={{ fontSize: '15px', lineHeight: 1.8, background: isDark ? '#1a1a1a' : '#f9fafb', border: `1px solid ${border}`, borderRadius: '8px', padding: '16px', marginBottom: '14px', userSelect: 'none', fontFamily: 'var(--font-sans)' }}>
            {text.split('').map((ch, i) => <span key={i} style={getCharStyle(i)}>{ch}</span>)}
          </div>
          <textarea
            ref={inputRef}
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Start typing here..."
            autoFocus
            style={{ width: '100%', minHeight: '80px', resize: 'none', fontFamily: 'var(--font-sans)', fontSize: '15px', color: text1, background: isDark ? '#161616' : '#f9fafb', border: `1px solid ${border}`, borderRadius: '8px', padding: '12px', outline: 'none', boxSizing: 'border-box' }}
          />
        </>
      )}

      {phase === 'done' && (
        <div style={{ textAlign: 'center', padding: '16px 0' }}>
          <div style={{ display: 'flex', gap: '48px', justifyContent: 'center', marginBottom: '20px' }}>
            <div>
              <div style={{ fontSize: '42px', fontWeight: 700, color: text1, fontFamily: 'var(--font-sans)', lineHeight: 1 }}>{wpm}</div>
              <div style={{ fontSize: '11px', color: text2, marginTop: '4px', fontFamily: 'var(--font-mono)', letterSpacing: '0.08em' }}>WPM</div>
            </div>
            <div>
              <div style={{ fontSize: '42px', fontWeight: 700, color: accuracy >= 95 ? '#22C55E' : '#f59e0b', fontFamily: 'var(--font-sans)', lineHeight: 1 }}>{accuracy}%</div>
              <div style={{ fontSize: '11px', color: text2, marginTop: '4px', fontFamily: 'var(--font-mono)', letterSpacing: '0.08em' }}>ACCURACY</div>
            </div>
          </div>
          {accuracy < 95 && <p style={{ color: '#f59e0b', fontSize: '12px', fontFamily: 'var(--font-sans)', marginBottom: '16px' }}>Below 95% accuracy — result marked invalid.</p>}
          {saved ? (
            <p style={{ color: '#22C55E', fontSize: '13px', fontFamily: 'var(--font-sans)', fontWeight: 600 }}>✓ Result saved</p>
          ) : (
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
              <button onClick={handleSave} disabled={saving} style={{ padding: '9px 22px', background: '#22C55E', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '13px', fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font-sans)' }}>
                {saving ? 'Saving…' : 'Save Result'}
              </button>
              <button onClick={() => { setPhase('ready'); setInput(''); setSaved(false); }} style={{ padding: '9px 18px', background: 'transparent', color: text2, border: `1px solid ${border}`, borderRadius: '8px', fontSize: '13px', cursor: 'pointer', fontFamily: 'var(--font-sans)' }}>
                Retry
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/* ── Mindset Logger that saves to Supabase ──────────────────── */
function MindsetLoggerSupabase({ userId, currentState, onComplete }) {
  const { theme } = useThemeContext();
  const isDark = theme === 'dark';
  const STATES = ['focused', 'neutral', 'distracted', 'anxious', 'energized', 'drained', 'creative', 'productive'];
  const [selected, setSelected] = useState(currentState || null);
  const [note, setNote] = useState('');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const border = isDark ? '#222' : '#e5e7eb';
  const text1 = isDark ? '#ededed' : '#111';
  const text2 = isDark ? '#a1a1aa' : '#6b7280';

  const handleSave = async () => {
    if (!selected) return;
    setSaving(true);
    const today = new Date().toISOString().split('T')[0];
    const { error } = await supabase.from('lab_mindset_logs').insert({
      user_id: userId,
      state: selected,
      note: note.trim() || null,
      day_of: today,
    });
    setSaving(false);
    if (!error) { setSaved(true); onComplete?.(); }
  };

  return (
    <div style={{ padding: '24px' }}>
      <div style={{ fontSize: '15px', fontWeight: 600, color: text1, fontFamily: 'var(--font-sans)', marginBottom: '18px' }}>Mindset State</div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '16px' }}>
        {STATES.map(s => (
          <button key={s} onClick={() => setSelected(s)} style={{
            padding: '7px 16px', borderRadius: '9999px', border: `1px solid ${s === selected ? '#22C55E' : border}`,
            background: s === selected ? 'rgba(34,197,94,0.12)' : 'transparent',
            color: s === selected ? '#22C55E' : text2, fontSize: '12px', fontWeight: 500, cursor: 'pointer',
            fontFamily: 'var(--font-sans)', transition: 'all 120ms ease', textTransform: 'capitalize',
          }}>{s}</button>
        ))}
      </div>
      <textarea value={note} onChange={e => setNote(e.target.value)} placeholder="Optional note…"
        style={{ width: '100%', minHeight: '70px', resize: 'none', fontFamily: 'var(--font-sans)', fontSize: '13px', color: text1, background: isDark ? '#161616' : '#f9fafb', border: `1px solid ${border}`, borderRadius: '8px', padding: '10px', outline: 'none', boxSizing: 'border-box', marginBottom: '14px' }} />
      {saved ? (
        <p style={{ color: '#22C55E', fontSize: '13px', fontFamily: 'var(--font-sans)', fontWeight: 600 }}>✓ Logged</p>
      ) : (
        <button onClick={handleSave} disabled={!selected || saving} style={{
          padding: '9px 24px', background: selected ? '#22C55E' : '#3f3f3f', color: '#fff',
          border: 'none', borderRadius: '8px', fontSize: '13px', fontWeight: 600, cursor: selected ? 'pointer' : 'not-allowed', fontFamily: 'var(--font-sans)',
        }}>{saving ? 'Saving…' : 'Log State'}</button>
      )}
    </div>
  );
}

/* ── Main Lab Page ──────────────────────────────────────────── */
export default function LabFullPage() {
  const { user } = useAuth();
  const { theme } = useThemeContext();
  const isDark = theme === 'dark';
  const [activeModule, setActiveModule] = useState(null);
  const [typingStats, setTypingStats] = useState(null);
  const [todayMindset, setTodayMindset] = useState(null);
  const [loading, setLoading] = useState(true);

  const bg = isDark ? '#0A0A0A' : '#F9FAFB';
  const cardBg = isDark ? '#111' : '#fff';
  const border = isDark ? '#222' : '#e5e7eb';
  const text1 = isDark ? '#ededed' : '#111';
  const text2 = isDark ? '#a1a1aa' : '#6b7280';
  const text3 = isDark ? '#52525b' : '#9ca3af';

  const fetchStats = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      // Typing stats — last 7 days
      const weekAgo = new Date(Date.now() - 7 * 86400000).toISOString().split('T')[0];
      const [typingRes, mindsetRes] = await Promise.all([
        supabase
          .from('lab_typing_tests')
          .select('wpm, accuracy_pct, day_of, test_invalid')
          .eq('user_id', user.id)
          .gte('day_of', weekAgo)
          .order('wpm', { ascending: false }),
        supabase
          .from('lab_mindset_logs')
          .select('state, logged_at, day_of')
          .eq('user_id', user.id)
          .eq('day_of', new Date().toISOString().split('T')[0])
          .order('logged_at', { ascending: false })
          .limit(1),
      ]);

      const validTests = (typingRes.data || []).filter(t => !t.test_invalid);
      const bestWpm = validTests.length > 0 ? Math.max(...validTests.map(t => t.wpm)) : null;
      const avgAccuracy = validTests.length > 0
        ? Number((validTests.reduce((s, t) => s + Number(t.accuracy_pct), 0) / validTests.length).toFixed(1))
        : null;
      setTypingStats({ bestWpm, avgAccuracy, testsThisWeek: validTests.length, totalTests: typingRes.data?.length || 0 });
      setTodayMindset((mindsetRes.data || [])[0] || null);
    } catch (e) {
      // silent fail — show empty state
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => { fetchStats(); }, [fetchStats]);

  if (!user) return null;

  const modules = [
    { key: 'typing',    emoji: '⌨️', label: 'Typing Speed',      desc: 'WPM & accuracy benchmark', color: '#3B82F6' },
    { key: 'reaction',  emoji: '⚡', label: 'Reaction Time',      desc: '5 trials per session',     color: '#F59E0B' },
    { key: 'speaking',  emoji: '🎙️', label: 'Speaking Logger',   desc: '60-second vocal response',  color: '#8B5CF6' },
    { key: 'decisions', emoji: '🎯', label: 'Decision Scenario',  desc: '90-second reasoning test',  color: '#EC4899' },
    { key: 'mindset',   emoji: '🧠', label: 'Mindset State',      desc: 'Today\'s mental state',     color: '#10B981' },
    { key: 'beliefs',   emoji: '📋', label: 'Belief Inventory',   desc: 'Quarterly audit',           color: '#EF4444' },
  ];

  return (
    <div style={{ flex: 1 }}>
      {/* Header */}
      <div style={{ marginBottom: '36px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <div style={{ fontSize: '10px', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: text3, fontFamily: 'var(--font-sans)', marginBottom: '8px' }}>
            Lab · Cognitive Benchmarks
          </div>
          <h1 style={{ font: 'var(--text-hero)', color: text1, margin: 0, letterSpacing: '-0.02em' }}>
            Iteration on self.
          </h1>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '11px', color: text3, fontFamily: 'var(--font-sans)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{modules.length} modules</div>
        </div>
      </div>

      {/* Quick stats strip */}
      {!loading && typingStats && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', marginBottom: '32px' }}>
          {[
            { label: 'Best WPM (7d)', value: typingStats.bestWpm ?? '—', color: '#3B82F6' },
            { label: 'Avg Accuracy', value: typingStats.avgAccuracy ? `${typingStats.avgAccuracy}%` : '—', color: '#10B981' },
            { label: 'Tests This Week', value: typingStats.testsThisWeek, color: '#F59E0B' },
            { label: 'Mindset Today', value: todayMindset?.state ?? '—', color: '#8B5CF6' },
          ].map(stat => (
            <div key={stat.label} style={{ background: cardBg, border: `1px solid ${border}`, borderRadius: '10px', padding: '16px', borderTop: `3px solid ${stat.color}` }}>
              <div style={{ fontSize: '10px', fontWeight: 600, color: text3, fontFamily: 'var(--font-sans)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '8px' }}>{stat.label}</div>
              <div style={{ fontSize: '22px', fontWeight: 700, color: text1, fontFamily: 'var(--font-sans)', letterSpacing: '-0.02em', lineHeight: 1, textTransform: 'capitalize' }}>{stat.value}</div>
            </div>
          ))}
        </div>
      )}
      {loading && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', marginBottom: '32px' }}>
          {[1,2,3,4].map(i => <div key={i} style={{ height: '80px', background: cardBg, border: `1px solid ${border}`, borderRadius: '10px' }} />)}
        </div>
      )}

      {/* Module grid */}
      <div style={{ marginBottom: '24px', fontSize: '11px', fontWeight: 600, color: text3, fontFamily: 'var(--font-sans)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
        Modules
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
        {modules.map(m => (
          <button
            key={m.key}
            onClick={() => setActiveModule(m.key)}
            style={{
              background: cardBg, border: `1px solid ${border}`, borderRadius: '12px',
              padding: '20px', textAlign: 'left', cursor: 'pointer',
              transition: 'all 150ms ease', borderLeft: `4px solid ${m.color}`,
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = m.color; e.currentTarget.style.transform = 'translateY(-1px)'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = border; e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.borderLeftColor = m.color; }}
          >
            <div style={{ fontSize: '22px', marginBottom: '10px' }}>{m.emoji}</div>
            <div style={{ fontSize: '13px', fontWeight: 600, color: text1, fontFamily: 'var(--font-sans)', marginBottom: '4px' }}>{m.label}</div>
            <div style={{ fontSize: '11px', color: text2, fontFamily: 'var(--font-sans)' }}>{m.desc}</div>
          </button>
        ))}
      </div>

      {/* Recent typing history */}
      {!loading && typingStats && typingStats.totalTests > 0 && (
        <div style={{ marginTop: '32px' }}>
          <div style={{ fontSize: '11px', fontWeight: 600, color: text3, fontFamily: 'var(--font-sans)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '16px' }}>
            Recent Tests This Week
          </div>
          <TypingHistory userId={user.id} isDark={isDark} cardBg={cardBg} border={border} text1={text1} text2={text2} text3={text3} />
        </div>
      )}

      {/* Module modal */}
      {activeModule && (
        <div
          onClick={() => setActiveModule(null)}
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{ background: cardBg, border: `1px solid ${border}`, borderRadius: '16px', width: '520px', maxWidth: '95vw', maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 24px 64px rgba(0,0,0,0.6)', position: 'relative' }}
          >
            <button
              onClick={() => setActiveModule(null)}
              style={{ position: 'absolute', top: '16px', right: '16px', width: '28px', height: '28px', borderRadius: '50%', border: `1px solid ${border}`, background: 'transparent', color: text2, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', zIndex: 1 }}
            >✕</button>

            {activeModule === 'typing' && <TypingTestSupabase userId={user.id} onComplete={() => { fetchStats(); }} />}
            {activeModule === 'mindset' && <MindsetLoggerSupabase userId={user.id} currentState={todayMindset?.state} onComplete={() => { fetchStats(); setActiveModule(null); }} />}
            {activeModule === 'reaction' && <ReactionTest onComplete={() => fetchStats()} />}
            {activeModule === 'speaking' && <SpeakingLogger onComplete={() => fetchStats()} />}
            {activeModule === 'decisions' && <DecisionScenario onComplete={() => fetchStats()} />}
            {activeModule === 'beliefs' && <BeliefEntry onComplete={() => fetchStats()} />}
          </div>
        </div>
      )}
    </div>
  );
}

/* ── Typing history sub-component ───────────────────────────── */
function TypingHistory({ userId, isDark, cardBg, border, text1, text2, text3 }) {
  const [rows, setRows] = useState([]);
  const weekAgo = new Date(Date.now() - 7 * 86400000).toISOString().split('T')[0];

  useEffect(() => {
    supabase
      .from('lab_typing_tests')
      .select('id, wpm, accuracy_pct, day_of, test_invalid')
      .eq('user_id', userId)
      .gte('day_of', weekAgo)
      .order('day_of', { ascending: false })
      .limit(10)
      .then(({ data }) => setRows(data || []));
  }, [userId]);

  if (rows.length === 0) return null;

  return (
    <div style={{ background: cardBg, border: `1px solid ${border}`, borderRadius: '12px', overflow: 'hidden' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 80px 80px 80px', padding: '10px 16px', borderBottom: `1px solid ${border}` }}>
        {['Date', 'WPM', 'Accuracy', 'Status'].map(h => (
          <div key={h} style={{ fontSize: '10px', fontWeight: 600, color: text3, fontFamily: 'var(--font-sans)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{h}</div>
        ))}
      </div>
      {rows.map(r => (
        <div key={r.id} style={{ display: 'grid', gridTemplateColumns: '1fr 80px 80px 80px', padding: '10px 16px', borderBottom: `1px solid ${border}` }}>
          <div style={{ fontSize: '12px', color: text2, fontFamily: 'var(--font-sans)' }}>
            {new Date(r.day_of).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}
          </div>
          <div style={{ fontSize: '13px', fontWeight: 600, color: text1, fontFamily: 'var(--font-sans)' }}>{r.wpm}</div>
          <div style={{ fontSize: '13px', fontWeight: 600, color: Number(r.accuracy_pct) >= 95 ? '#22C55E' : '#f59e0b', fontFamily: 'var(--font-sans)' }}>
            {Number(r.accuracy_pct).toFixed(1)}%
          </div>
          <div style={{ fontSize: '11px', color: r.test_invalid ? '#ef4444' : '#22C55E', fontFamily: 'var(--font-sans)', fontWeight: 500 }}>
            {r.test_invalid ? 'Invalid' : 'Valid'}
          </div>
        </div>
      ))}
    </div>
  );
}
