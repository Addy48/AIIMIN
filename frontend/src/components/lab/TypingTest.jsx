import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RefreshCw, Clock, Zap, BookOpen, ChevronRight, BarChart2, X, CheckCircle2, AlertTriangle, Trophy, Target, ArrowLeft, Keyboard } from 'lucide-react';
import { supabase } from '../../utils/supabase';

/* ─── Word Banks ─────────────────────────────────────────────────── */
const COMMON_WORDS = [
  "the","be","to","of","and","a","in","that","have","it","for","not","on","with","he","as","you","do","at",
  "this","but","his","by","from","they","we","say","her","she","or","an","will","my","one","all","would",
  "there","their","what","so","up","out","if","about","who","get","which","go","me","when","make","can",
  "like","time","no","just","him","know","take","people","into","year","your","good","some","could","them",
  "see","other","than","then","now","look","only","come","its","over","think","also","back","after","use",
  "two","how","our","work","first","well","way","even","new","want","because","any","these","give","day",
  "most","us","great","between","need","large","often","hand","high","place","hold","turn","where","much",
  "keep","point","right","play","small","number","off","always","move","live","write","open","seem","should",
  "home","show","still","learn","plant","cover","food","sun","four","between","state","never","become","between",
  "made","many","set","long","each","these","those","call","down","side","been","might","same","tell","does",
];

/* ─── Lesson System ──────────────────────────────────────────────── */
const LESSONS = [
  {
    id: 'L1', title: 'Home Row Basics', level: 1, color: '#3B82F6',
    keys: ['a','s','d','f','j','k','l',';'],
    desc: 'Master the foundation — fingers never leave home row.',
    text: 'add all ask fall dad sad fad lads jalf alj falls asks adds dads shall flask flask glass flask',
  },
  {
    id: 'L2', title: 'Home Row Flow', level: 1, color: '#3B82F6',
    keys: ['a','s','d','f','j','k','l',';'],
    desc: 'Build speed on home row with longer words.',
    text: 'flash flask glass salsa flask falls halls skill skill lads falls dads alfalfa ask all add fall',
  },
  {
    id: 'L3', title: 'Top Row — QWERTY', level: 2, color: '#8B5CF6',
    keys: ['q','w','e','r','t','y','u','i','o','p'],
    desc: 'Extend reach to the top row, one key at a time.',
    text: 'two wet quit euro trip type were your quit power tower wrote three quote repute quote upper tree',
  },
  {
    id: 'L4', title: 'Top Row Combinations', level: 2, color: '#8B5CF6',
    keys: ['q','w','e','r','t','y','u','i','o','p'],
    desc: 'Combine top row keys into real words fluidly.',
    text: 'write quote proper power tower outer route query typo upper report typist porte write quote tower',
  },
  {
    id: 'L5', title: 'Bottom Row — ZXCVBNM', level: 3, color: '#EC4899',
    keys: ['z','x','c','v','b','n','m'],
    desc: 'Master the bottom row, the most challenging reach.',
    text: 'move zinc next civic verb norm came calm back vex zinc mob zinc next move verb back came calm',
  },
  {
    id: 'L6', title: 'Numbers & Symbols', level: 4, color: '#F59E0B',
    keys: ['1','2','3','4','5','6','7','8','9','0'],
    desc: 'Build confidence with number row typing.',
    text: '123 456 789 012 345 678 90 2024 1080 42 100 2048 777 1234 5678 9012 3456 7890 10 25 50 75',
  },
  {
    id: 'L7', title: 'Capitals & Shift', level: 4, color: '#F59E0B',
    keys: ['shift'],
    desc: 'Practice shift for capital letters without looking.',
    text: 'The New York Times Google Apple Microsoft India Japan France Paris London Berlin Tokyo Seoul',
  },
  {
    id: 'L8', title: 'Common Bigrams', level: 5, color: '#10B981',
    keys: ['th','he','in','er','an'],
    desc: 'The most frequent two-letter combos in English.',
    text: 'the then there their other another whether together either father mother rather brother further gather',
  },
  {
    id: 'L9', title: 'Speed Burst — Easy', level: 5, color: '#10B981',
    keys: [],
    desc: 'Full keyboard fluency — common everyday words at speed.',
    text: 'time make good work life give most show them from what then when call back more over into look like',
  },
  {
    id: 'L10', title: 'Speed Burst — Hard', level: 6, color: '#EF4444',
    keys: [],
    desc: 'Advanced vocabulary and uncommon letter combos.',
    text: 'pneumatic cryptography xenophobia czechoslovakia syzygy bureaucracy acknowledge approximately comfortable',
  },
];

/* ─── Helpers ────────────────────────────────────────────────────── */
const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5001';
const STORAGE_KEY = 'aiimin_typing_v2';

const generateText = (count = 80) => {
  const arr = [];
  for (let i = 0; i < count; i++) arr.push(COMMON_WORDS[Math.floor(Math.random() * COMMON_WORDS.length)]);
  return arr.join(' ');
};

const loadProgress = () => {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}'); }
  catch { return {}; }
};
const saveProgress = (data) => {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(data)); } catch {}
};

/* ─── Weak Key Analyzer ──────────────────────────────────────────── */
function analyzeWeakKeys(keyErrors) {
  return Object.entries(keyErrors)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)
    .map(([k, count]) => ({ key: k, count }));
}

function hexToRgb(hex) {
  if (!hex || typeof hex !== 'string') return '0, 0, 0';
  const h = hex.replace('#', '');
  const r = parseInt(h.substring(0, 2), 16) || 0;
  const g = parseInt(h.substring(2, 4), 16) || 0;
  const b = parseInt(h.substring(4, 6), 16) || 0;
  return `${r}, ${g}, ${b}`;
}

/* ─── CSS injected once ──────────────────────────────────────────── */
const TYPING_CSS = `
  .tt-input { position: absolute; opacity: 0; pointer-events: none; }
  .tt-kbd {
    display: inline-flex; align-items: center; justify-content: center;
    min-width: 28px; height: 28px; padding: 0 6px;
    background: var(--bg-elevated); border: 1px solid var(--color-border);
    border-bottom-width: 2px; border-radius: 6px;
    font: 700 11px/1 'Fira Code', monospace; color: var(--color-text-2);
    user-select: none;
  }
  .tt-kbd.highlight { background: rgba(59,130,246,0.2); border-color: #3B82F6; color: #3B82F6; }
  .tt-kbd.error { background: rgba(239,68,68,0.2); border-color: #ef4444; color: #ef4444; animation: tt-shake 0.3s; }
  @keyframes tt-shake {
    0%,100% { transform: translateX(0); }
    25% { transform: translateX(-3px); }
    75% { transform: translateX(3px); }
  }
  .tt-progress-bar { height: 2px; background: var(--color-border); border-radius: 2px; overflow: hidden; }
  .tt-progress-fill { height: 100%; border-radius: 2px; transition: width 0.3s ease; }
  .tt-tab { padding: 8px 18px; border-radius: 8px; border: none; font: 600 13px/1 inherit; cursor: pointer; transition: all 0.15s; }
  .tt-tab.active { background: var(--bg-elevated); color: var(--color-text-1); border: 1px solid var(--color-border); }
  .tt-tab.inactive { background: transparent; color: var(--color-text-3); border: 1px solid transparent; }
  .tt-tab.inactive:hover { color: var(--color-text-2); background: var(--bg-elevated); border: 1px solid var(--color-border); }
  .tt-btn-primary {
    border: none; border-radius: 10px; padding: 12px 28px;
    font: 700 14px/1 inherit; cursor: pointer; transition: all 0.2s;
    background: var(--color-accent); color: #fff;
    box-shadow: 0 4px 14px rgba(0,0,0,0.3);
  }
  .tt-btn-primary:hover { opacity: 0.88; transform: translateY(-1px); }
  .tt-btn-secondary {
    border: 1px solid var(--color-border); border-radius: 10px; padding: 12px 24px;
    font: 600 13px/1 inherit; cursor: pointer; transition: all 0.15s;
    background: var(--bg-elevated); color: var(--color-text-2);
  }
  .tt-btn-secondary:hover { background: var(--color-border); color: var(--color-text-1); }
  .tt-metric {
    background: var(--bg-elevated); border: 1px solid var(--color-border);
    border-radius: 12px; padding: 16px 20px;
  }
  .tt-inp {
    width: 100%; background: var(--bg-elevated); border: 1px solid var(--color-border);
    border-radius: 10px; padding: 10px 14px; color: var(--color-text-1);
    font: 400 13px/1 inherit; outline: none; box-sizing: border-box;
    transition: border-color 0.15s;
  }
  .tt-inp:focus { border-color: var(--color-accent); }
  .tt-inp option { background: #1a1a1a; color: #fff; }
  select.tt-inp { cursor: pointer; }
`;

/* ═══════════════════════════════════════════════════════════════════
   MAIN COMPONENT
════════════════════════════════════════════════════════════════════ */
export default function TypingTest({ userId, onComplete, onClose }) {
  const [mode, setMode] = useState('home'); // home | speed | lesson | results | lessonResults
  const [progress, setProgress] = useState(() => loadProgress());

  // Persist whenever progress changes
  useEffect(() => { saveProgress(progress); }, [progress]);

  const updateProgress = useCallback((patch) => {
    setProgress(prev => { const next = { ...prev, ...patch }; saveProgress(next); return next; });
  }, []);

  // Inject CSS once
  useEffect(() => {
    if (!document.getElementById('tt-styles')) {
      const tag = document.createElement('style');
      tag.id = 'tt-styles';
      tag.textContent = TYPING_CSS;
      document.head.appendChild(tag);
    }
    return () => {};
  }, []);

  const weakKeys = useMemo(() => analyzeWeakKeys(progress.keyErrors || {}), [progress]);

  if (mode === 'speed') return <SpeedTest userId={userId} onComplete={(r) => { onComplete?.(r); setMode('home'); }} onBack={() => setMode('home')} onUpdateProgress={updateProgress} progress={progress} />;
  if (mode === 'lesson') return <LessonSelect progress={progress} weakKeys={weakKeys} onSelectLesson={(l) => setMode({ type: 'lesson', lesson: l })} onBack={() => setMode('home')} />;
  if (typeof mode === 'object' && mode.type === 'lesson') return <LessonRunner lesson={mode.lesson} progress={progress} onComplete={(r) => { updateProgress(r); setMode('home'); }} onBack={() => setMode('lesson')} onUpdateProgress={updateProgress} />;

  /* ── Home Screen ── */
  const completedLessons = Object.keys(progress.lessons || {}).length;
  const bestWpm = progress.bestWpm || 0;
  const totalTests = progress.totalTests || 0;

  return (
    <div style={{ padding: '32px 28px', maxWidth: '860px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '32px' }}>
        <div>
          <div style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--color-text-3)', marginBottom: '6px' }}>
            Typing Lab · Keyboard Dexterity
          </div>
          <h2 style={{ font: '800 24px/1 var(--font-serif, serif)', color: 'var(--color-text-1)', margin: 0, letterSpacing: '-0.02em' }}>
            Master the keys.
          </h2>
        </div>
        <div style={{ display: 'flex', gap: '24px' }}>
          {[
            { label: 'Best WPM', value: bestWpm || '—', color: '#3B82F6' },
            { label: 'Tests Done', value: totalTests, color: '#10B981' },
            { label: 'Lessons', value: `${completedLessons}/${LESSONS.length}`, color: '#8B5CF6' },
          ].map(s => (
            <div key={s.label} className="tt-metric" style={{ textAlign: 'center', minWidth: '80px' }}>
              <div style={{ fontSize: '22px', fontWeight: 800, color: s.color, lineHeight: 1, marginBottom: '4px' }}>{s.value}</div>
              <div style={{ fontSize: '10px', fontWeight: 600, color: 'var(--color-text-3)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Mode Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '28px' }}>
        <ModeCard
          emoji="⚡"
          title="Speed Test"
          desc="15, 30, or 60 second benchmark — see your raw WPM and accuracy"
          color="#3B82F6"
          onClick={() => setMode('speed')}
          badge={bestWpm ? `Best: ${bestWpm} WPM` : null}
        />
        <ModeCard
          emoji="🎯"
          title="Lesson Mode"
          desc="Step-by-step key-by-key lessons — builds muscle memory from scratch"
          color="#8B5CF6"
          onClick={() => setMode('lesson')}
          badge={completedLessons > 0 ? `${completedLessons}/${LESSONS.length} done` : 'Start from L1'}
        />
      </div>

      {/* Weak Keys Panel */}
      {weakKeys.length > 0 && (
        <div className="tt-metric" style={{ marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
            <AlertTriangle size={14} color="#F59E0B" />
            <span style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--color-text-3)' }}>
              Weak Keys Detected — {weakKeys.length} patterns
            </span>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', alignItems: 'center' }}>
            {weakKeys.map(({ key, count }) => (
              <div key={key} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span className="tt-kbd" style={{ borderColor: '#ef4444', color: '#ef4444', background: 'rgba(239,68,68,0.1)' }}>
                  {key === ' ' ? 'space' : key}
                </span>
                <span style={{ fontSize: '11px', color: '#ef4444', fontWeight: 600 }}>{count}×</span>
              </div>
            ))}
            <span style={{ fontSize: '11px', color: 'var(--color-text-3)', marginLeft: '6px' }}>
              — Practice these in Lesson Mode
            </span>
          </div>
        </div>
      )}

      {/* Recent history */}
      {(progress.history || []).length > 0 && (
        <div>
          <div style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--color-text-3)', marginBottom: '12px' }}>
            Recent Speed Tests
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {(progress.history || []).slice(0, 5).map((r, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '10px 14px', background: 'var(--bg-elevated)', borderRadius: '8px', border: '1px solid var(--color-border)' }}>
                <span style={{ fontSize: '11px', color: 'var(--color-text-3)', minWidth: '80px' }}>{new Date(r.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</span>
                <span style={{ fontSize: '14px', fontWeight: 800, color: '#3B82F6', fontFamily: 'var(--font-mono, monospace)' }}>{r.wpm} WPM</span>
                <span style={{ fontSize: '13px', fontWeight: 600, color: r.accuracy >= 95 ? '#10B981' : '#F59E0B' }}>{r.accuracy}%</span>
                <span style={{ fontSize: '11px', color: 'var(--color-text-3)' }}>{r.duration}s</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── Mode Card ──────────────────────────────────────────────────── */
function ModeCard({ emoji, title, desc, color, onClick, badge }) {
  const [hov, setHov] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background: hov ? 'var(--color-border-lit)' : 'var(--bg-elevated)',
        border: `1px solid ${hov ? color + '40' : 'var(--color-border)'}`,
        borderRadius: '14px', padding: '24px', textAlign: 'left', cursor: 'pointer',
        transition: 'all 0.2s', display: 'flex', flexDirection: 'column', gap: '12px',
        transform: hov ? 'translateY(-2px)' : 'none',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontSize: '28px' }}>{emoji}</span>
        {badge && (
          <span style={{ fontSize: '10px', fontWeight: 700, padding: '4px 10px', borderRadius: '6px', background: `rgba(${hexToRgb(color)},0.15)`, color }}>
            {badge}
          </span>
        )}
      </div>
      <div>
        <div style={{ fontSize: '15px', fontWeight: 700, color: 'var(--color-text-1)', marginBottom: '6px' }}>{title}</div>
        <div style={{ fontSize: '12px', color: 'var(--color-text-3)', lineHeight: 1.5 }}>{desc}</div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color, fontSize: '12px', fontWeight: 700 }}>
        Open <ChevronRight size={14} />
      </div>
    </button>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   SPEED TEST
════════════════════════════════════════════════════════════════════ */
function SpeedTest({ userId, onComplete, onBack, onUpdateProgress, progress }) {
  const [phase, setPhase] = useState('ready');  // ready | running | done
  const [duration, setDuration] = useState(30);
  const [text, setText] = useState(() => generateText(100));
  const [input, setInput] = useState('');
  const [timeLeft, setTimeLeft] = useState(30);
  const [wpm, setWpm] = useState(0);
  const [accuracy, setAccuracy] = useState(100);
  const [isFocused, setIsFocused] = useState(false);
  const [saving, setSaving] = useState(false);
  const [keyErrors, setKeyErrors] = useState({});

  const inputRef = useRef(null);
  const timerRef = useRef(null);
  const startRef = useRef(null);
  const textRef = useRef(text);
  textRef.current = text;

  const reset = useCallback((dur = duration) => {
    if (timerRef.current) clearInterval(timerRef.current);
    setText(generateText(100));
    setInput('');
    setPhase('ready');
    setTimeLeft(dur);
    setWpm(0);
    setAccuracy(100);
    startRef.current = null;
    setKeyErrors({});
    setTimeout(() => inputRef.current?.focus(), 50);
  }, [duration]);

  useEffect(() => { reset(duration); }, []); // eslint-disable-line

  const handleDuration = (d) => { setDuration(d); reset(d); };

  useEffect(() => {
    if (phase !== 'running') return;
    timerRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) { clearInterval(timerRef.current); setPhase('done'); return 0; }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [phase]);

  const handleInput = (e) => {
    const val = e.target.value;

    if (phase === 'ready' && val.length > 0) {
      setPhase('running');
      startRef.current = Date.now();
    }
    if (phase === 'done') return;

    // Track errors per key
    if (val.length > input.length) {
      const newChar = val[val.length - 1];
      const expectedChar = textRef.current[val.length - 1];
      if (newChar !== expectedChar) {
        setKeyErrors(prev => ({ ...prev, [newChar]: (prev[newChar] || 0) + 1 }));
      }
    }

    setInput(val);
    const correct = val.split('').filter((c, i) => c === textRef.current[i]).length;
    const acc = val.length > 0 ? Math.round((correct / val.length) * 100) : 100;
    setAccuracy(acc);
    if (startRef.current) {
      const elapsed = (Date.now() - startRef.current) / 1000;
      setWpm(elapsed > 0 ? Math.round((correct / 5) / (elapsed / 60)) : 0);
    }
    if (val.length >= textRef.current.length) { clearInterval(timerRef.current); setPhase('done'); }
  };

  const handleSave = async () => {
    setSaving(true);
    // Merge key errors into progress
    const merged = { ...((progress.keyErrors) || {}) };
    Object.entries(keyErrors).forEach(([k, v]) => { merged[k] = (merged[k] || 0) + v; });
    const prevBest = progress.bestWpm || 0;
    const newHistory = [{ date: new Date().toISOString(), wpm, accuracy, duration }, ...(progress.history || [])].slice(0, 20);
    onUpdateProgress({ keyErrors: merged, bestWpm: Math.max(prevBest, wpm), totalTests: (progress.totalTests || 0) + 1, history: newHistory });

    try {
      const token = localStorage.getItem('access_token');
      await fetch(`${API_BASE}/lab/practice/typing`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ wpm, accuracy_pct: accuracy, duration_sec: duration - timeLeft }),
      });
    } catch {}
    setSaving(false);
    onComplete?.({ wpm, accuracy });
  };

  const textChars = text.split('');
  const accentColor = '#3B82F6';
  const errorColor = '#ef4444';

  if (phase === 'done') {
    const rating = wpm >= 80 ? { label: 'Expert', color: '#10B981', emoji: '🏆' } : wpm >= 60 ? { label: 'Advanced', color: '#3B82F6', emoji: '⭐' } : wpm >= 40 ? { label: 'Intermediate', color: '#F59E0B', emoji: '💪' } : { label: 'Beginner', color: '#8B5CF6', emoji: '🌱' };
    return (
      <div style={{ padding: '32px 28px', maxWidth: '700px', margin: '0 auto' }}>
        <button className="tt-btn-secondary" style={{ marginBottom: '28px', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px' }} onClick={onBack}>
          <ArrowLeft size={14} /> Back
        </button>
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '48px', marginBottom: '8px' }}>{rating.emoji}</div>
          <div style={{ fontSize: '13px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', color: rating.color, marginBottom: '32px' }}>
            {rating.label} Typist
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '40px', marginBottom: '40px' }}>
            <div className="tt-metric" style={{ textAlign: 'center', minWidth: '130px' }}>
              <div style={{ fontSize: '56px', fontWeight: 900, color: accentColor, lineHeight: 1, fontFamily: 'var(--font-mono, monospace)', letterSpacing: '-0.04em' }}>{wpm}</div>
              <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--color-text-3)', textTransform: 'uppercase', letterSpacing: '0.1em', marginTop: '6px' }}>WPM</div>
            </div>
            <div className="tt-metric" style={{ textAlign: 'center', minWidth: '130px' }}>
              <div style={{ fontSize: '56px', fontWeight: 900, color: accuracy >= 95 ? '#10B981' : accuracy >= 85 ? '#F59E0B' : '#ef4444', lineHeight: 1, fontFamily: 'var(--font-mono, monospace)', letterSpacing: '-0.04em' }}>{accuracy}<span style={{ fontSize: '24px', color: 'var(--color-text-3)' }}>%</span></div>
              <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--color-text-3)', textTransform: 'uppercase', letterSpacing: '0.1em', marginTop: '6px' }}>Accuracy</div>
            </div>
          </div>
          {Object.keys(keyErrors).length > 0 && (
            <div className="tt-metric" style={{ marginBottom: '28px', textAlign: 'left' }}>
              <div style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--color-text-3)', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <AlertTriangle size={12} color="#F59E0B" /> Keys that tripped you up
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {Object.entries(keyErrors).sort((a,b)=>b[1]-a[1]).slice(0,8).map(([k,c]) => (
                  <div key={k} style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <span className="tt-kbd" style={{ borderColor: '#ef4444', color: '#ef4444', background: 'rgba(239,68,68,0.1)' }}>{k === ' ' ? 'space' : k}</span>
                    <span style={{ fontSize: '11px', color: '#ef4444', fontWeight: 600 }}>{c}×</span>
                  </div>
                ))}
              </div>
            </div>
          )}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '12px' }}>
            <button className="tt-btn-primary" onClick={handleSave} disabled={saving}>
              {saving ? 'Saving...' : 'Save Result'}
            </button>
            <button className="tt-btn-secondary" onClick={() => reset(duration)}>
              <RefreshCw size={14} style={{ marginRight: '6px' }} /> Try Again
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div style={{ padding: '24px 28px', maxWidth: '860px', margin: '0 auto' }}>
      {/* Nav */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
        <button className="tt-btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', padding: '8px 14px' }} onClick={onBack}>
          <ArrowLeft size={13} /> Back
        </button>
        <div style={{ display: 'flex', gap: '4px', background: 'var(--bg-elevated)', borderRadius: '10px', padding: '4px', border: '1px solid var(--color-border)' }}>
          {[15, 30, 60].map(d => (
            <button key={d} onClick={() => handleDuration(d)}
              style={{ padding: '7px 16px', borderRadius: '7px', border: 'none', fontSize: '12px', fontWeight: 700, cursor: 'pointer', transition: 'all 0.15s',
                background: duration === d ? 'var(--color-border-lit)' : 'transparent',
                color: duration === d ? 'var(--color-text-1)' : 'var(--color-text-3)',
              }}>
              {d}s
            </button>
          ))}
        </div>
        <button className="tt-btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', padding: '8px 14px' }} onClick={() => reset(duration)}>
          <RefreshCw size={13} /> Restart
        </button>
      </div>

      {/* Live Metrics */}
      <div style={{ display: 'flex', gap: '16px', marginBottom: '16px' }}>
        {[
          { label: 'TIME', value: timeLeft + 's', color: timeLeft <= 5 ? '#ef4444' : 'var(--color-text-1)' },
          { label: 'WPM', value: wpm, color: accentColor },
          { label: 'ACC', value: accuracy + '%', color: accuracy < 90 ? '#ef4444' : accuracy < 95 ? '#F59E0B' : '#10B981' },
        ].map(m => (
          <div key={m.label} className="tt-metric" style={{ flex: 1, textAlign: 'center' }}>
            <div style={{ fontSize: '26px', fontWeight: 900, color: m.color, lineHeight: 1, fontFamily: 'var(--font-mono, monospace)' }}>{m.value}</div>
            <div style={{ fontSize: '10px', fontWeight: 700, color: 'var(--color-text-3)', textTransform: 'uppercase', letterSpacing: '0.1em', marginTop: '4px' }}>{m.label}</div>
          </div>
        ))}
      </div>

      {/* Progress bar */}
      <div className="tt-progress-bar" style={{ marginBottom: '16px' }}>
        <div className="tt-progress-fill" style={{ width: `${(input.length / text.length) * 100}%`, background: accentColor }} />
      </div>

      {/* Typing Area */}
      <div
        style={{ position: 'relative', background: 'var(--bg-elevated)', border: `1px solid ${isFocused ? 'var(--color-accent)' : 'var(--color-border)'}`, borderRadius: '14px', padding: '28px 32px', cursor: 'text', transition: 'border-color 0.2s', minHeight: '160px', userSelect: 'none' }}
        onClick={() => inputRef.current?.focus()}
      >
        <input ref={inputRef} type="text" value={input} onChange={handleInput}
          onFocus={() => setIsFocused(true)} onBlur={() => setIsFocused(false)}
          className="tt-input" autoFocus autoComplete="off" autoCorrect="off" autoCapitalize="off" spellCheck={false}
        />

        {phase === 'ready' && (
          <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', borderRadius: '14px', background: 'var(--color-base)', opacity: 0.9, backdropFilter: 'blur(4px)', zIndex: 5, gap: '8px' }}>
            <Keyboard size={28} color="var(--color-text-3)" />
            <div style={{ fontSize: '16px', fontWeight: 700, color: 'var(--color-text-1)' }}>Click here and start typing</div>
            <div style={{ fontSize: '12px', color: 'var(--color-text-3)' }}>Timer starts on first keystroke</div>
          </div>
        )}

        {!isFocused && phase === 'running' && (
          <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', borderRadius: '14px', background: 'var(--color-base)', opacity: 0.9, backdropFilter: 'blur(4px)', zIndex: 5, gap: '6px' }}>
            <div style={{ fontSize: '15px', fontWeight: 700, color: 'var(--color-text-1)' }}>⏸ Paused</div>
            <div style={{ fontSize: '12px', color: 'var(--color-text-3)' }}>Click to resume</div>
          </div>
        )}

        <div style={{ fontSize: '19px', lineHeight: '2.1', fontFamily: '"Fira Code","JetBrains Mono","Roboto Mono",monospace', letterSpacing: '0.01em', wordBreak: 'break-word' }}>
          {textChars.map((char, i) => {
            const typed = i < input.length;
            const correct = typed && input[i] === char;
            const wrong = typed && input[i] !== char;
            const current = i === input.length;
            return (
              <span key={i} style={{ position: 'relative', color: wrong ? '#ef4444' : correct ? 'var(--color-text-1)' : 'var(--color-text-3)', opacity: correct ? 1 : 0.6, textDecoration: wrong ? 'underline' : 'none', transition: 'color 0.05s' }}>
                {current && phase !== 'done' && (
                  <motion.span style={{ position: 'absolute', left: 0, top: '10%', width: '2px', height: '82%', background: accentColor, boxShadow: `0 0 8px ${accentColor}`, borderRadius: '2px' }}
                    animate={{ opacity: [1, 0, 1] }} transition={{ repeat: Infinity, duration: 0.8 }} />
                )}
                {char}
              </span>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   LESSON SELECT
════════════════════════════════════════════════════════════════════ */
function LessonSelect({ progress, weakKeys, onSelectLesson, onBack }) {
  const levels = [...new Set(LESSONS.map(l => l.level))];
  const levelLabels = { 1: 'Home Row', 2: 'Top Row', 3: 'Bottom Row', 4: 'Numbers & Shift', 5: 'Speed', 6: 'Expert' };
  return (
    <div style={{ padding: '28px', maxWidth: '760px', margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
        <button className="tt-btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', padding: '8px 14px' }} onClick={onBack}>
          <ArrowLeft size={13} /> Back
        </button>
        <div>
          <h3 style={{ font: '700 16px/1 inherit', color: 'var(--color-text-1)', margin: 0 }}>Lesson Mode</h3>
          <p style={{ font: '400 12px/1 inherit', color: 'var(--color-text-3)', margin: '4px 0 0' }}>Learn keys step-by-step. Progress is saved automatically.</p>
        </div>
      </div>

      {weakKeys.length > 0 && (
        <div className="tt-metric" style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          <AlertTriangle size={14} color="#F59E0B" />
          <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-text-2)' }}>Your weak keys:</span>
          {weakKeys.slice(0, 5).map(({ key }) => (
            <span key={key} className="tt-kbd" style={{ borderColor: '#ef4444', color: '#ef4444', background: 'rgba(239,68,68,0.1)' }}>{key === ' ' ? 'space' : key}</span>
          ))}
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {levels.map(level => (
          <div key={level}>
            <div style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--color-text-3)', marginBottom: '10px' }}>
              Level {level} — {levelLabels[level]}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {LESSONS.filter(l => l.level === level).map(lesson => {
                const done = !!(progress.lessons || {})[lesson.id];
                return (
                  <LessonRow key={lesson.id} lesson={lesson} done={done} onSelect={() => onSelectLesson(lesson)} />
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function LessonRow({ lesson, done, onSelect }) {
  const [hov, setHov] = useState(false);
  return (
    <button
      onClick={onSelect}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background: hov ? 'var(--color-border-lit)' : 'var(--bg-elevated)',
        border: `1px solid ${done ? lesson.color + '30' : 'var(--color-border)'}`,
        borderLeft: `3px solid ${done ? lesson.color : 'var(--color-border)'}`,
        borderRadius: '10px', padding: '14px 16px', cursor: 'pointer', textAlign: 'left',
        transition: 'all 0.15s', display: 'flex', alignItems: 'center', gap: '14px',
        transform: hov ? 'translateX(2px)' : 'none',
      }}
    >
      <div style={{ width: '28px', height: '28px', borderRadius: '8px', background: done ? lesson.color + '20' : 'var(--bg-elevated)', border: `1px solid ${done ? lesson.color + '40' : 'var(--color-border)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        {done ? <CheckCircle2 size={14} color={lesson.color} /> : <span style={{ fontSize: '11px', fontWeight: 800, color: 'var(--color-text-3)' }}>{lesson.id}</span>}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--color-text-1)', marginBottom: '2px' }}>{lesson.title}</div>
        <div style={{ fontSize: '11px', color: 'var(--color-text-3)' }}>{lesson.desc}</div>
      </div>
      {lesson.keys.length > 0 && (
        <div style={{ display: 'flex', gap: '4px', flexShrink: 0 }}>
          {lesson.keys.slice(0, 4).map(k => <span key={k} className="tt-kbd">{k}</span>)}
          {lesson.keys.length > 4 && <span style={{ fontSize: '11px', color: 'var(--color-text-3)', alignSelf: 'center' }}>+{lesson.keys.length - 4}</span>}
        </div>
      )}
      <ChevronRight size={16} color="var(--color-text-3)" />
    </button>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   LESSON RUNNER
════════════════════════════════════════════════════════════════════ */
function LessonRunner({ lesson, progress, onComplete, onBack, onUpdateProgress }) {
  const text = lesson.text;
  const [input, setInput] = useState('');
  const [phase, setPhase] = useState('intro'); // intro | active | done
  const [wpm, setWpm] = useState(0);
  const [accuracy, setAccuracy] = useState(100);
  const [keyErrors, setKeyErrors] = useState({});
  const [startTime, setStartTime] = useState(null);
  const [isFocused, setIsFocused] = useState(false);
  const [flashKey, setFlashKey] = useState(null);
  const inputRef = useRef(null);

  const reset = () => { setInput(''); setPhase('intro'); setWpm(0); setAccuracy(100); setKeyErrors({}); setStartTime(null); };

  const handleInput = (e) => {
    const val = e.target.value;
    if (val.length > text.length) return;

    if (!startTime && val.length > 0) { setStartTime(Date.now()); setPhase('active'); }

    // Track error per key
    if (val.length > input.length) {
      const newChar = val[val.length - 1];
      const expected = text[val.length - 1];
      if (newChar !== expected) {
        setKeyErrors(prev => ({ ...prev, [newChar]: (prev[newChar] || 0) + 1 }));
        setFlashKey(expected);
        setTimeout(() => setFlashKey(null), 400);
      }
    }

    setInput(val);
    const correct = val.split('').filter((c, i) => c === text[i]).length;
    const acc = val.length > 0 ? Math.round((correct / val.length) * 100) : 100;
    setAccuracy(acc);
    if (startTime) {
      const elapsed = (Date.now() - startTime) / 1000;
      if (elapsed > 0) setWpm(Math.round((correct / 5) / (elapsed / 60)));
    }
    if (val.length >= text.length) {
      setPhase('done');
      // Merge into global key errors
      const merged = { ...(progress.keyErrors || {}) };
      Object.entries(keyErrors).forEach(([k, v]) => { merged[k] = (merged[k] || 0) + v; });
      const lessons = { ...(progress.lessons || {}), [lesson.id]: { wpm, accuracy: acc, date: new Date().toISOString() } };
      onUpdateProgress({ keyErrors: merged, lessons });
    }
  };

  if (phase === 'done') {
    return (
      <div style={{ padding: '32px 28px', maxWidth: '700px', margin: '0 auto' }}>
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '40px', marginBottom: '8px' }}>✅</div>
          <h3 style={{ font: '800 20px/1 inherit', color: 'var(--color-text-1)', margin: '0 0 4px' }}>Lesson Complete!</h3>
          <p style={{ font: '400 13px/1 inherit', color: 'var(--color-text-3)', marginBottom: '28px' }}>{lesson.title}</p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginBottom: '28px' }}>
            {[{ label: 'WPM', value: wpm, color: lesson.color }, { label: 'Accuracy', value: accuracy + '%', color: accuracy >= 90 ? '#10B981' : '#F59E0B' }].map(s => (
              <div key={s.label} className="tt-metric" style={{ textAlign: 'center', minWidth: '110px' }}>
                <div style={{ fontSize: '36px', fontWeight: 900, color: s.color, fontFamily: 'var(--font-mono, monospace)', lineHeight: 1 }}>{s.value}</div>
                <div style={{ fontSize: '10px', fontWeight: 700, color: 'var(--color-text-3)', textTransform: 'uppercase', letterSpacing: '0.1em', marginTop: '4px' }}>{s.label}</div>
              </div>
            ))}
          </div>
          {Object.keys(keyErrors).length > 0 && (
            <div className="tt-metric" style={{ marginBottom: '24px', textAlign: 'left' }}>
              <div style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--color-text-3)', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <AlertTriangle size={12} color="#F59E0B" /> Errors this lesson
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {Object.entries(keyErrors).sort((a,b)=>b[1]-a[1]).map(([k,c]) => (
                  <div key={k} style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <span className="tt-kbd" style={{ borderColor: '#ef4444', color: '#ef4444', background: 'rgba(239,68,68,0.1)' }}>{k === ' ' ? 'space' : k}</span>
                    <span style={{ fontSize: '11px', color: '#ef4444', fontWeight: 600 }}>{c}×</span>
                  </div>
                ))}
              </div>
            </div>
          )}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '12px' }}>
            <button className="tt-btn-primary" style={{ background: lesson.color }} onClick={onBack}>Back to Lessons</button>
            <button className="tt-btn-secondary" onClick={reset}><RefreshCw size={13} style={{ marginRight: '6px' }} />Retry</button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div style={{ padding: '24px 28px', maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
        <button className="tt-btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', padding: '8px 14px' }} onClick={onBack}>
          <ArrowLeft size={13} /> Lessons
        </button>
        <div style={{ textAlign: 'center' }}>
          <span style={{ fontSize: '10px', fontWeight: 700, padding: '4px 12px', borderRadius: '6px', background: `rgba(${hexToRgb(lesson.color)},0.15)`, color: lesson.color, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            {lesson.id} · Level {lesson.level}
          </span>
          <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--color-text-1)', marginTop: '4px' }}>{lesson.title}</div>
        </div>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '16px', fontWeight: 800, color: lesson.color, fontFamily: 'var(--font-mono, monospace)' }}>{wpm} <span style={{ fontSize: '10px', color: 'var(--color-text-3)' }}>WPM</span></div>
            <div style={{ fontSize: '12px', fontWeight: 600, color: accuracy < 90 ? '#ef4444' : '#10B981' }}>{accuracy}% acc</div>
          </div>
        </div>
      </div>

      {/* Key spotlight row */}
      {lesson.keys.length > 0 && (
        <div style={{ display: 'flex', gap: '6px', marginBottom: '16px', flexWrap: 'wrap', alignItems: 'center' }}>
          <span style={{ fontSize: '11px', color: 'var(--color-text-3)', fontWeight: 600 }}>Focus keys:</span>
          {lesson.keys.map(k => (
            <span key={k} className={`tt-kbd ${flashKey === k ? 'highlight' : ''}`} style={flashKey === k ? { background: `rgba(${hexToRgb(lesson.color)},0.2)`, borderColor: lesson.color, color: lesson.color } : {}}>
              {k}
            </span>
          ))}
        </div>
      )}

      {/* Progress */}
      <div className="tt-progress-bar" style={{ marginBottom: '16px' }}>
        <div className="tt-progress-fill" style={{ width: `${(input.length / text.length) * 100}%`, background: lesson.color }} />
      </div>

      {/* Typing area */}
      <div
        style={{ position: 'relative', background: 'var(--bg-elevated)', border: `1px solid ${isFocused ? 'var(--color-accent)' : 'var(--color-border)'}`, borderRadius: '14px', padding: '28px 32px', cursor: 'text', transition: 'border-color 0.2s', minHeight: '120px' }}
        onClick={() => { inputRef.current?.focus(); }}
      >
        <input ref={inputRef} type="text" value={input} onChange={handleInput}
          onFocus={() => setIsFocused(true)} onBlur={() => setIsFocused(false)}
          className="tt-input" autoFocus autoComplete="off" autoCorrect="off" autoCapitalize="off" spellCheck={false}
        />

        {phase === 'intro' && (
          <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', borderRadius: '14px', background: 'var(--color-base)', opacity: 0.9, backdropFilter: 'blur(4px)', zIndex: 5, gap: '8px' }}>
            <Keyboard size={24} color="var(--color-text-3)" />
            <div style={{ fontSize: '15px', fontWeight: 700, color: 'var(--color-text-1)' }}>Click and start typing the text below</div>
          </div>
        )}

        <div style={{ fontSize: '18px', lineHeight: '2.1', fontFamily: '"Fira Code","JetBrains Mono","Roboto Mono",monospace', letterSpacing: '0.015em', wordBreak: 'break-word', userSelect: 'none' }}>
          {text.split('').map((char, i) => {
            const typed = i < input.length;
            const correct = typed && input[i] === char;
            const wrong = typed && input[i] !== char;
            const current = i === input.length;
            return (
              <span key={i} style={{ position: 'relative', color: wrong ? '#ef4444' : correct ? 'rgba(255,255,255,0.88)' : 'rgba(255,255,255,0.22)', textDecoration: wrong ? 'underline' : 'none', transition: 'color 0.05s', background: current ? `rgba(${hexToRgb(lesson.color)},0.12)` : 'none', borderRadius: '2px' }}>
                {current && phase !== 'done' && (
                  <motion.span style={{ position: 'absolute', left: 0, top: '10%', width: '2px', height: '82%', background: lesson.color, boxShadow: `0 0 8px ${lesson.color}`, borderRadius: '2px' }}
                    animate={{ opacity: [1, 0, 1] }} transition={{ repeat: Infinity, duration: 0.8 }} />
                )}
                {char}
              </span>
            );
          })}
        </div>
      </div>

      <p style={{ fontSize: '11px', color: 'var(--color-text-3)', textAlign: 'center', marginTop: '12px' }}>{lesson.desc}</p>
    </div>
  );
}

/* ─── Util ───────────────────────────────────────────────────────── */
function hexToRgb(hex) {
  const r = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return r ? `${parseInt(r[1],16)},${parseInt(r[2],16)},${parseInt(r[3],16)}` : '255,255,255';
}
