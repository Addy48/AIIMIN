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
  const [words, setWords] = useState([]);
  const [input, setInput] = useState('');
  const [timeLeft, setTimeLeft] = useState(30);
  const [wpm, setWpm] = useState(null);
  const [accuracy, setAccuracy] = useState(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [rawWpm, setRawWpm] = useState(0);
  const timerRef = React.useRef(null);
  const inputRef = React.useRef(null);

  // Monkeytype Colors
  const mtBg = isDark ? '#323437' : '#ffffff';
  const mtText = isDark ? '#646669' : '#9ca3af';
  const mtActive = isDark ? '#d1d0c5' : '#111827';
  const mtError = '#ca4754';
  const mtAccent = '#e2b714';

  const WORD_POOL = [
    "the", "be", "to", "of", "and", "a", "in", "that", "have", "it", "for", "not", "on", "with", "he", "as", "you", "do", "at", "this", "but", "his", "by", "from", "they", "we", "say", "her", "she", "or", "an", "will", "my", "one", "all", "would", "there", "their", "what", "so", "up", "out", "if", "about", "who", "get", "which", "go", "me", "when", "make", "can", "like", "time", "no", "just", "him", "know", "take", "people", "into", "year", "your", "good", "some", "could", "them", "see", "other", "than", "then", "now", "look", "only", "come", "its", "over", "think", "also", "back", "after", "use", "two", "how", "our", "work", "first", "well", "even", "new", "want", "because", "any", "these", "give", "day", "most", "us"
  ];

  const generateWords = () => {
    const arr = [];
    for (let i = 0; i < 100; i++) {
      arr.push(WORD_POOL[Math.floor(Math.random() * WORD_POOL.length)]);
    }
    setWords(arr);
  };

  useEffect(() => {
    generateWords();
  }, []);

  const startTest = () => {
    setPhase('running');
    setInput('');
    setTimeLeft(30);
    setTimeout(() => inputRef.current?.focus(), 50);
  };

  useEffect(() => {
    if (phase !== 'running') return;
    timerRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          clearInterval(timerRef.current);
          setPhase('done');
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [phase]);

  useEffect(() => {
    if (phase !== 'done') return;
    const wordsTyped = input.trim().split(/\s+/).filter(Boolean).length;
    const elapsed = 30; // fixed duration
    const calculatedWpm = Math.round((wordsTyped / (elapsed / 60)));
    setWpm(calculatedWpm);
    
    const targetString = words.join(' ');
    let correct = 0;
    const inputChars = input.split('');
    inputChars.forEach((c, i) => {
      if (c === targetString[i]) correct++;
    });
    setAccuracy(inputChars.length > 0 ? Number(((correct / inputChars.length) * 100).toFixed(1)) : 0);
  }, [phase, input, words]);

  const handleSave = async () => {
    setSaving(true);
    const today = new Date().toISOString().split('T')[0];
    const { error } = await supabase.from('lab_typing_tests').insert({
      user_id: userId,
      wpm: wpm,
      accuracy_pct: accuracy,
      duration_sec: 30,
      test_invalid: accuracy < 90,
      day_of: today,
    });
    setSaving(false);
    if (!error) {
      setSaved(true);
      onComplete?.();
    }
  };

  // Calculate cursor position for Monkeytype feel
  const currentWordIndex = input.split(' ').length - 1;
  const currentWordChars = input.split(' ')[currentWordIndex] || '';

  return (
    <div style={{ 
      padding: '60px 40px', 
      background: mtBg, 
      borderRadius: '24px',
      color: mtText,
      fontFamily: '"JetBrains Mono", monospace',
      minHeight: '400px',
      display: 'flex',
      flexDirection: 'column',
      position: 'relative',
      transition: 'all 0.3s ease'
    }}>
      {/* Header Stats */}
      <div style={{ display: 'flex', gap: '24px', alignItems: 'center', marginBottom: '40px' }}>
        <div style={{ fontSize: '32px', color: mtAccent, fontWeight: 700, minWidth: '40px' }}>
          {phase === 'running' ? timeLeft : (phase === 'done' ? '0' : '30')}
        </div>
        {phase === 'running' && (
          <div style={{ display: 'flex', gap: '20px', fontSize: '14px', color: mtAccent, opacity: 0.8 }}>
            <span>typing...</span>
          </div>
        )}
      </div>

      {phase === 'ready' && (
        <div style={{ textAlign: 'center', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
          <div style={{ fontSize: '20px', marginBottom: '32px', color: mtActive, opacity: 0.8 }}>
            the lab. test your focus.
          </div>
          <button 
            onClick={startTest}
            style={{ 
              background: 'transparent', 
              border: `2px solid ${mtAccent}`, 
              color: mtAccent, 
              padding: '14px 40px', 
              borderRadius: '8px', 
              cursor: 'pointer',
              fontSize: '16px',
              fontWeight: 700,
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = mtAccent; e.currentTarget.style.color = mtBg; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = mtAccent; }}
          >
            start test
          </button>
          <div style={{ marginTop: '24px', fontSize: '12px', opacity: 0.5 }}>30 second duration · top focus words</div>
        </div>
      )}

      {phase === 'running' && (
        <div 
          onClick={() => inputRef.current?.focus()}
          style={{ cursor: 'text', position: 'relative', fontSize: '28px', lineHeight: '1.6', userSelect: 'none', height: '160px', overflow: 'hidden' }}
        >
          {/* Hidden input */}
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            style={{ position: 'absolute', opacity: 0, pointerEvents: 'none' }}
            autoFocus
          />
          
          {/* Render text with active highlighting */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6em', position: 'relative' }}>
            {words.map((word, wIdx) => {
              const isCurrentWord = currentWordIndex === wIdx;
              const wordsBefore = input.split(' ').slice(0, wIdx);
              const targetString = word;
              const inputForThisWord = input.split(' ')[wIdx] || '';
              
              // Only show a few lines
              if (wIdx < currentWordIndex - 10) return null;
              if (wIdx > currentWordIndex + 20) return null;

              return (
                <span key={wIdx} style={{ position: 'relative', display: 'flex' }}>
                  {word.split('').map((char, cIdx) => {
                    let color = mtText;
                    let isCorrect = false;
                    if (inputForThisWord.length > cIdx) {
                      isCorrect = inputForThisWord[cIdx] === char;
                      color = isCorrect ? mtActive : mtError;
                    }
                    
                    return (
                      <span key={cIdx} style={{ color, position: 'relative' }}>
                        {char}
                        {isCurrentWord && cIdx === inputForThisWord.length && (
                          <motion.div 
                            layoutId="cursor"
                            style={{ 
                              position: 'absolute', left: 0, top: '10%', bottom: '10%', width: '2px', background: mtAccent 
                            }}
                            animate={{ opacity: [1, 0, 1] }}
                            transition={{ duration: 0.8, repeat: Infinity }}
                          />
                        )}
                      </span>
                    );
                  })}
                  {/* Extra chars */}
                  {inputForThisWord.length > word.length && (
                    <span style={{ color: mtError }}>
                      {inputForThisWord.slice(word.length)}
                    </span>
                  )}
                  {/* Handle space cursor */}
                  {isCurrentWord && inputForThisWord.length === word.length && (
                    <motion.div 
                      layoutId="cursor"
                      style={{ 
                        position: 'absolute', right: -2, top: '10%', bottom: '10%', width: '2px', background: mtAccent 
                      }}
                      animate={{ opacity: [1, 0, 1] }}
                      transition={{ duration: 0.8, repeat: Infinity }}
                    />
                  )}
                </span>
              );
            })}
          </div>
        </div>
      )}

      {phase === 'done' && (
        <div style={{ textAlign: 'center', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <div style={{ display: 'flex', gap: '80px', justifyContent: 'center', marginBottom: '48px' }}>
            <div>
              <div style={{ fontSize: '16px', color: mtAccent, marginBottom: '12px', textTransform: 'lowercase', letterSpacing: '0.1em' }}>wpm</div>
              <div style={{ fontSize: '80px', color: mtActive, fontWeight: 700, lineHeight: 1 }}>{wpm}</div>
            </div>
            <div>
              <div style={{ fontSize: '16px', color: mtAccent, marginBottom: '12px', textTransform: 'lowercase', letterSpacing: '0.1em' }}>accuracy</div>
              <div style={{ fontSize: '80px', color: accuracy >= 95 ? mtActive : mtError, fontWeight: 700, lineHeight: 1 }}>{accuracy}%</div>
            </div>
          </div>
          
          <div style={{ display: 'flex', gap: '20px', justifyContent: 'center' }}>
            {!saved && (
              <button 
                onClick={handleSave} 
                disabled={saving} 
                style={{ 
                  background: mtAccent, color: mtBg, border: 'none', padding: '14px 40px', 
                  borderRadius: '8px', fontWeight: 700, cursor: 'pointer', transition: 'transform 0.2s'
                }}
                onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.05)'}
                onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
              >
                {saving ? 'saving...' : 'save reflection'}
              </button>
            )}
            <button 
              onClick={startTest}
              style={{ 
                background: 'transparent', color: mtText, border: `2px solid ${mtText}`, 
                padding: '14px 40px', borderRadius: '8px', fontWeight: 600, cursor: 'pointer' 
              }}
            >
              restart test
            </button>
          </div>
          {saved && <div style={{ marginTop: '24px', color: mtAccent, fontSize: '14px', fontWeight: 600 }}>✓ Result archived to your growth metrics</div>}
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
