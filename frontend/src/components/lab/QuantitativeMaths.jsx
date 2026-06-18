import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ChevronRight, RotateCcw, BarChart2, BookOpen } from 'lucide-react';

/* ─── Question Bank (15 questions × 50 sets = 750 questions) ──────────────── */
function generateQuestionBank() {
  const templates = [
    // Profit & Loss
    (seed) => {
      const cp = 100 + seed * 7;
      const mp = Math.round(cp * (1 + (10 + seed % 20) / 100));
      const disc = 5 + seed % 15;
      const sp = Math.round(mp * (1 - disc / 100));
      const profit = Math.round(((sp - cp) / cp) * 100);
      return {
        text: `A shopkeeper marks goods ${(10 + seed % 20)}% above cost price ₹${cp}. A discount of ${disc}% is given. Profit %?`,
        options: [profit - 2, profit, profit + 3, profit + 5].sort(() => 0.5 - Math.random()).map(String),
        correct: null, _ans: profit,
        explanation: `CP=₹${cp}, MP=₹${mp}, SP=₹${sp}. Profit = (${sp}-${cp})/${cp}×100 = ${profit}%`,
        topic: 'Profit & Loss'
      };
    },
    // Age Problems
    (seed) => {
      const x = 2 + seed % 5;
      const ratio1 = 3 + seed % 4, ratio2 = 2 + seed % 3;
      const sum = (ratio1 + ratio2) * x;
      const ageA = ratio1 * x;
      const after = 5 + seed % 8;
      return {
        text: `Ratio of ages of A:B = ${ratio1}:${ratio2}. Sum = ${sum} yrs. A's age after ${after} years?`,
        options: [ageA + after - 2, ageA + after, ageA + after + 3, ageA + after + 6].map(String),
        correct: null, _ans: ageA + after,
        explanation: `Let ages = ${ratio1}k, ${ratio2}k. Sum = ${ratio1 + ratio2}k = ${sum} → k=${x}. A = ${ageA}. After ${after}yrs = ${ageA + after}.`,
        topic: 'Age Problems'
      };
    },
    // Work & Time
    (seed) => {
      const a = 6 + seed % 6, b = 8 + seed % 8;
      const lcm = (a * b) / gcd(a, b);
      const rateA = lcm / a, rateB = lcm / b;
      const days = 2 + seed % 4;
      const doneAB = (rateA + rateB) * days;
      const remC = lcm - doneAB;
      const rateC = rateA + rateB;
      const timeC = Math.round(remC / rateB);
      return {
        text: `A finishes work in ${a} days, B in ${b} days. Together for ${days} days, then only B. Total days?`,
        options: [days + timeC - 1, days + timeC, days + timeC + 1, days + timeC + 2].map(String),
        correct: null, _ans: days + timeC,
        explanation: `A+B per day = 1/${a}+1/${b}. After ${days} days done. B alone does rest. Total = ${days + timeC} days.`,
        topic: 'Work & Time'
      };
    },
    // Speed, Distance, Time
    (seed) => {
      const speed = 40 + seed * 2;
      const dist = 120 + seed * 10;
      const time = dist / speed;
      const timeStr = Number.isInteger(time) ? time : (time * 60) + ' mins';
      return {
        text: `Train travels ${dist} km at ${speed} km/hr. Time taken?`,
        options: [`${time - 0.5} hrs`, `${time} hrs`, `${time + 0.5} hrs`, `${time + 1} hrs`],
        correct: null, _ans: time,
        explanation: `Time = Distance/Speed = ${dist}/${speed} = ${time} hrs.`,
        topic: 'Speed & Distance'
      };
    },
    // Percentages
    (seed) => {
      const val = 200 + seed * 15;
      const pct = 10 + seed % 30;
      const result = Math.round(val * pct / 100);
      return {
        text: `${pct}% of ${val} is?`,
        options: [result - 5, result, result + 5, result + 10].map(String),
        correct: null, _ans: result,
        explanation: `${pct}% of ${val} = ${val} × ${pct}/100 = ${result}.`,
        topic: 'Percentages'
      };
    },
    // Compound Interest
    (seed) => {
      const p = (2 + seed % 8) * 1000;
      const r = 5 + seed % 15;
      const n = 2;
      const amount = Math.round(p * Math.pow(1 + r / 100, n));
      const ci = amount - p;
      return {
        text: `CI on ₹${p} for ${n} years at ${r}% p.a. compounded annually?`,
        options: [ci - 50, ci, ci + 50, ci + 100].map(v => `₹${v}`),
        correct: null, _ans: `₹${ci}`,
        explanation: `Amount = ${p}(1+${r}/100)² = ₹${amount}. CI = ${amount}-${p} = ₹${ci}.`,
        topic: 'Compound Interest'
      };
    },
    // Ratio & Proportion
    (seed) => {
      const a = 2 + seed % 5, b = 3 + seed % 4, c = 4 + seed % 3;
      const total = (a + b + c) * (2 + seed % 5);
      const shareA = Math.round((a / (a + b + c)) * total);
      return {
        text: `₹${total} is divided in ratio ${a}:${b}:${c}. A's share?`,
        options: [shareA - 10, shareA, shareA + 10, shareA + 20].map(v => `₹${v}`),
        correct: null, _ans: `₹${shareA}`,
        explanation: `A's share = ${a}/(${a}+${b}+${c}) × ${total} = ₹${shareA}.`,
        topic: 'Ratio & Proportion'
      };
    },
    // HCF & LCM
    (seed) => {
      const a = (3 + seed % 7) * 4, b = (2 + seed % 6) * 6;
      const h = gcd(a, b);
      const l = (a * b) / h;
      return {
        text: `HCF of ${a} and ${b} is?`,
        options: [h / 2 || 1, h, h * 2, h + 3].map(String),
        correct: null, _ans: h,
        explanation: `${a} = ${a / h} × ${h}, ${b} = ${b / h} × ${h}. HCF = ${h}.`,
        topic: 'HCF & LCM'
      };
    },
    // Simple Interest
    (seed) => {
      const p = (1 + seed % 10) * 500;
      const r = 5 + seed % 10;
      const t = 2 + seed % 5;
      const si = (p * r * t) / 100;
      return {
        text: `SI on ₹${p} at ${r}% p.a. for ${t} years?`,
        options: [si - 50, si, si + 50, si + 100].map(v => `₹${v}`),
        correct: null, _ans: `₹${si}`,
        explanation: `SI = PRT/100 = ${p}×${r}×${t}/100 = ₹${si}.`,
        topic: 'Simple Interest'
      };
    },
    // Pipes & Cisterns
    (seed) => {
      const a = 12 + seed % 8, b = 15 + seed % 10;
      const lcm = (a * b) / gcd(a, b);
      const together = lcm / (lcm / a + lcm / b);
      const togRound = Math.round(together * 10) / 10;
      return {
        text: `Pipes A and B fill tank in ${a} and ${b} mins. Together in?`,
        options: [togRound - 1, togRound, togRound + 1, togRound + 2].map(String),
        correct: null, _ans: togRound,
        explanation: `1/A + 1/B = 1/${a} + 1/${b} = ${lcm / a + lcm / b}/${lcm}. Time = ${lcm}/${lcm / a + lcm / b} ≈ ${togRound} min.`,
        topic: 'Pipes & Cisterns'
      };
    },
    // Trains
    (seed) => {
      const len = 100 + seed * 10;
      const manSpeed = 3 + seed % 4;
      const relSpeed = 40 + seed % 10;
      const time = Math.round(len / ((relSpeed - manSpeed) * (1000 / 3600)));
      const trainSpeed = relSpeed;
      return {
        text: `A ${len}m train passes a man at ${manSpeed} km/hr in ${time} sec. Train speed?`,
        options: [trainSpeed - 5, trainSpeed, trainSpeed + 5, trainSpeed + 10].map(v => `${v} km/hr`),
        correct: null, _ans: `${trainSpeed} km/hr`,
        explanation: `Relative speed = ${len}m/${time}s = ${(len / time).toFixed(1)} m/s = ${trainSpeed} km/hr. Train speed = ${trainSpeed} km/hr.`,
        topic: 'Trains'
      };
    },
    // Averages
    (seed) => {
      const n = 5 + seed % 5;
      const avg = 20 + seed % 30;
      const total = n * avg;
      const newVal = total + 30 + seed % 20;
      const newAvg = Math.round(newVal / (n + 1));
      return {
        text: `Average of ${n} numbers is ${avg}. If one more number ${30 + seed % 20} is added, new average?`,
        options: [newAvg - 2, newAvg, newAvg + 2, newAvg + 4].map(String),
        correct: null, _ans: newAvg,
        explanation: `Old total = ${n}×${avg}=${total}. New total = ${newVal}. New avg = ${newVal}/${n + 1} = ${newAvg}.`,
        topic: 'Averages'
      };
    },
    // Permutations & Combinations
    (seed) => {
      const n = 4 + seed % 4, r = 2 + seed % 3;
      const perm = factorial(n) / factorial(n - r);
      return {
        text: `P(${n},${r}) = ${n}P${r} = ?`,
        options: [perm - 6, perm, perm + 6, perm + 12].map(String),
        correct: null, _ans: perm,
        explanation: `P(n,r) = n!/(n-r)! = ${n}!/${n - r}! = ${perm}.`,
        topic: 'Permutations'
      };
    },
    // Probability
    (seed) => {
      const total = 52;
      const favNumerator = 4 + seed % 9;
      const g = gcd(favNumerator, total);
      const simplNum = favNumerator / g, simplDen = total / g;
      return {
        text: `Probability of drawing a ${seed % 4 === 0 ? 'King' : seed % 4 === 1 ? 'Ace' : seed % 4 === 2 ? 'Heart' : 'Red card'} from a deck?`,
        options: [`${simplNum}/${simplDen}`, `1/${13 + seed % 5}`, `${simplNum + 1}/${simplDen}`, `${simplNum}/${simplDen + 4}`],
        correct: null, _ans: `${simplNum}/${simplDen}`,
        explanation: `Favorable = ${favNumerator}, Total = 52. P = ${favNumerator}/52 = ${simplNum}/${simplDen}.`,
        topic: 'Probability'
      };
    },
    // Number Series
    (seed) => {
      const start = 2 + seed % 5;
      const diff = 3 + seed % 6;
      const series = [start, start + diff, start + 2 * diff, start + 3 * diff, start + 4 * diff];
      const next = start + 5 * diff;
      return {
        text: `Find the next term: ${series.join(', ')}, ?`,
        options: [next - diff, next, next + diff, next + 2 * diff].map(String),
        correct: null, _ans: next,
        explanation: `AP with first term ${start} and common difference ${diff}. Next term = ${series[4]} + ${diff} = ${next}.`,
        topic: 'Number Series'
      };
    },
  ];
  return templates;
}

function gcd(a, b) { return b === 0 ? a : gcd(b, a % b); }
function factorial(n) { return n <= 1 ? 1 : n * factorial(n - 1); }

function generateSet(setNumber) {
  const templates = generateQuestionBank();
  const questions = [];
  for (let i = 0; i < 15; i++) {
    const templateIdx = i % templates.length;
    const seed = setNumber * 15 + i;
    const q = templates[templateIdx](seed);
    // Fix correct answer index
    let ansStr = String(q._ans);
    let optIdx = q.options.findIndex(o => String(o) === ansStr);
    if (optIdx === -1) {
      q.options[0] = q._ans;
      optIdx = 0;
    }
    questions.push({ ...q, id: seed, correct: optIdx });
  }
  return questions;
}

/* ─── History Storage ──────────────────────────── */
const HISTORY_KEY = 'aiimin_quant_history_v1';
const loadHistory = () => { try { return JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]'); } catch { return []; } };
const saveHistory = (h) => localStorage.setItem(HISTORY_KEY, JSON.stringify(h));

/* ─── Set Selector ─────────────────────────────── */
function SetSelector({ history, onSelect }) {
  const completedSets = new Set(history.map(h => h.setNumber));
  const [page, setPage] = useState(0);
  const SETS_PER_PAGE = 25;
  const totalPages = Math.ceil(50 / SETS_PER_PAGE);

  const inp = { background: 'var(--bg-elevated)', border: '1px solid var(--border)', color: 'var(--text-3)' };

  return (
    <div style={{ padding: '32px 24px' }}>
      <div style={{ marginBottom: '24px' }}>
        <div style={{ fontSize: '11px', fontWeight: 800, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--text-3)', marginBottom: '8px' }}>
          Quantitative Maths · 50 Sets
        </div>
        <h2 style={{ fontSize: '28px', fontWeight: 900, color: 'var(--text-1)', margin: 0, letterSpacing: '-0.02em' }}>
          Select a Set
        </h2>
        <p style={{ fontSize: '14px', color: 'var(--text-3)', marginTop: '8px', margin: '8px 0 0' }}>
          15 questions per set · Topics: P&L, Age, Work, Speed, CI, Ratio, HCF, Percentages & more
        </p>
      </div>

      <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
        {[...Array(totalPages)].map((_, p) => (
          <button key={p} onClick={() => setPage(p)}
            style={{ padding: '6px 14px', borderRadius: '8px', border: `1px solid ${page === p ? 'var(--color-accent)' : 'var(--border)'}`, background: page === p ? 'var(--color-accent)' : 'transparent', color: page === p ? '#fff' : 'var(--text-2)', fontSize: '12px', fontWeight: 700, cursor: 'pointer' }}>
            Sets {p * SETS_PER_PAGE + 1}–{Math.min((p + 1) * SETS_PER_PAGE, 50)}
          </button>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '10px' }}>
        {[...Array(SETS_PER_PAGE)].map((_, i) => {
          const setNum = page * SETS_PER_PAGE + i + 1;
          if (setNum > 50) return null;
          const histEntry = history.find(h => h.setNumber === setNum);
          const done = !!histEntry;
          const score = histEntry?.score;
          const total = histEntry?.total || 15;
          const pct = done ? Math.round((score / total) * 100) : null;
          const color = done ? (pct >= 80 ? '#22C55E' : pct >= 50 ? '#F59E0B' : '#EF4444') : 'var(--border)';

          return (
            <button key={setNum} onClick={() => onSelect(setNum)}
              style={{
                padding: '16px 8px', borderRadius: '14px',
                background: done ? `${color}12` : 'var(--bg-elevated)',
                border: `1.5px solid ${done ? color : 'var(--border)'}`,
                cursor: 'pointer', textAlign: 'center', transition: 'all 0.2s',
              }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 20px rgba(0,0,0,0.15)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none'; }}
            >
              <div style={{ fontSize: '16px', fontWeight: 900, color: done ? color : 'var(--text-1)' }}>
                {setNum}
              </div>
              <div style={{ fontSize: '10px', color: done ? color : 'var(--text-3)', fontWeight: 700, marginTop: '4px' }}>
                {done ? `${score}/${total}` : '—'}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ─── History View ──────────────────────────────── */
function HistoryView({ history }) {
  if (!history.length) {
    return (
      <div style={{ textAlign: 'center', padding: '80px 24px', color: 'var(--text-3)' }}>
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>📊</div>
        <div style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-1)', marginBottom: '8px' }}>No history yet</div>
        <div style={{ fontSize: '14px' }}>Complete sets to track your progress here.</div>
      </div>
    );
  }
  const totalSolved = history.length;
  const avgScore = Math.round(history.reduce((s, h) => s + (h.score / h.total) * 100, 0) / history.length);
  
  // Topic analysis
  const topicWrong = {};
  history.forEach(h => {
    (h.wrongTopics || []).forEach(t => { topicWrong[t] = (topicWrong[t] || 0) + 1; });
  });
  const weakTopics = Object.entries(topicWrong).sort((a, b) => b[1] - a[1]).slice(0, 5);

  return (
    <div style={{ padding: '24px' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '24px' }}>
        {[
          { label: 'Sets Attempted', value: totalSolved, color: '#3B82F6' },
          { label: 'Avg Score', value: `${avgScore}%`, color: avgScore >= 70 ? '#22C55E' : '#F59E0B' },
          { label: 'Best Score', value: `${Math.round(Math.max(...history.map(h => h.score / h.total * 100)))}%`, color: '#8B5CF6' },
        ].map(m => (
          <div key={m.label} style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: '14px', padding: '20px', textAlign: 'center' }}>
            <div style={{ fontSize: '28px', fontWeight: 900, color: m.color }}>{m.value}</div>
            <div style={{ fontSize: '11px', color: 'var(--text-3)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', marginTop: '4px' }}>{m.label}</div>
          </div>
        ))}
      </div>

      {weakTopics.length > 0 && (
        <div style={{ background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: '14px', padding: '20px', marginBottom: '20px' }}>
          <div style={{ fontSize: '12px', fontWeight: 800, color: '#EF4444', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '12px' }}>
            ⚠️ Topics to Work On
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {weakTopics.map(([topic, count]) => (
              <span key={topic} style={{ padding: '4px 12px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '99px', fontSize: '12px', fontWeight: 700, color: '#EF4444' }}>
                {topic} ({count}✗)
              </span>
            ))}
          </div>
        </div>
      )}

      <div style={{ fontSize: '11px', fontWeight: 800, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '12px' }}>Recent Sessions</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {[...history].reverse().slice(0, 15).map((h, i) => {
          const pct = Math.round((h.score / h.total) * 100);
          const color = pct >= 80 ? '#22C55E' : pct >= 50 ? '#F59E0B' : '#EF4444';
          return (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 16px', background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: '12px' }}>
              <div>
                <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-1)' }}>Set {h.setNumber}</div>
                <div style={{ fontSize: '11px', color: 'var(--text-3)', marginTop: '2px' }}>{new Date(h.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '18px', fontWeight: 900, color }}>{h.score}/{h.total}</div>
                <div style={{ fontSize: '11px', fontWeight: 700, color }}>{pct}%</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ─── Active Quiz ───────────────────────────────── */
function Quiz({ questions, setNumber, onFinish, onClose }) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOpt, setSelectedOpt] = useState(null);
  const [score, setScore] = useState(0);
  const [wrongTopics, setWrongTopics] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [answers, setAnswers] = useState([]);

  const question = questions[currentIdx];

  const handleSelect = (idx) => {
    if (selectedOpt !== null) return;
    setSelectedOpt(idx);
    if (idx === question.correct) {
      setScore(s => s + 1);
    } else {
      setWrongTopics(w => [...w, question.topic]);
    }
    setAnswers(a => [...a, { idx, correct: question.correct, topic: question.topic }]);
  };

  const handleNext = () => {
    if (currentIdx < questions.length - 1) {
      setCurrentIdx(c => c + 1);
      setSelectedOpt(null);
    } else {
      setShowResult(true);
    }
  };

  const handleFinish = () => {
    onFinish({ setNumber, score, total: questions.length, wrongTopics: [...new Set(wrongTopics)] });
  };

  if (showResult) {
    const pct = Math.round((score / questions.length) * 100);
    const color = pct >= 80 ? '#22C55E' : pct >= 50 ? '#F59E0B' : '#EF4444';
    return (
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        style={{ maxWidth: '560px', margin: '0 auto', padding: '48px 24px', textAlign: 'center' }}>
        <div style={{ fontSize: '64px', marginBottom: '20px' }}>{pct >= 80 ? '🏆' : pct >= 50 ? '👍' : '💪'}</div>
        <h2 style={{ fontSize: '28px', fontWeight: 900, color: 'var(--text-1)', marginBottom: '8px' }}>Set {setNumber} Complete</h2>
        <div style={{ fontSize: '56px', fontWeight: 900, color, marginBottom: '8px' }}>{score}/{questions.length}</div>
        <div style={{ fontSize: '18px', color, fontWeight: 700, marginBottom: '32px' }}>{pct}% accuracy</div>
        {wrongTopics.length > 0 && (
          <div style={{ background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: '14px', padding: '16px', marginBottom: '24px', textAlign: 'left' }}>
            <div style={{ fontSize: '11px', fontWeight: 800, color: '#EF4444', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '10px' }}>Needs Work</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {[...new Set(wrongTopics)].map(t => (
                <span key={t} style={{ padding: '3px 10px', background: 'rgba(239,68,68,0.1)', borderRadius: '99px', fontSize: '12px', fontWeight: 700, color: '#EF4444' }}>{t}</span>
              ))}
            </div>
          </div>
        )}
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
          <button onClick={handleFinish}
            style={{ padding: '14px 32px', background: 'var(--color-accent)', color: '#fff', border: 'none', borderRadius: '14px', fontSize: '15px', fontWeight: 800, cursor: 'pointer' }}>
            Save & Return
          </button>
          <button onClick={onClose}
            style={{ padding: '14px 24px', background: 'var(--bg-elevated)', color: 'var(--text-1)', border: '1px solid var(--border)', borderRadius: '14px', fontSize: '15px', fontWeight: 700, cursor: 'pointer' }}>
            Exit Lab
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '32px 20px', height: '100%', overflowY: 'auto' }}>
      {/* Progress bar */}
      <div style={{ marginBottom: '32px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', alignItems: 'center' }}>
          <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            Set {setNumber} · Q{currentIdx + 1}/{questions.length}
          </span>
          <span style={{ fontSize: '14px', fontWeight: 800, color: 'var(--color-accent)' }}>Score: {score}</span>
        </div>
        <div style={{ height: '5px', background: 'var(--bg-elevated)', borderRadius: '99px', overflow: 'hidden' }}>
          <motion.div
            animate={{ width: `${((currentIdx + 1) / questions.length) * 100}%` }}
            transition={{ duration: 0.4 }}
            style={{ height: '100%', background: 'var(--color-accent)', borderRadius: '99px' }}
          />
        </div>
        <div style={{ display: 'inline-block', marginTop: '8px', padding: '3px 10px', background: `${topicColors[question.topic] || 'var(--color-accent)'}18`, borderRadius: '6px', fontSize: '11px', fontWeight: 800, color: topicColors[question.topic] || 'var(--color-accent)', letterSpacing: '0.06em' }}>
          {question.topic}
        </div>
      </div>

      {/* Question */}
      <AnimatePresence mode="wait">
        <motion.div key={currentIdx} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
          <div style={{ fontSize: '22px', fontWeight: 700, color: 'var(--text-1)', marginBottom: '32px', lineHeight: 1.5 }}>
            {question.text}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
            {question.options.map((opt, idx) => {
              let bg = 'var(--bg-elevated)', border = 'var(--border)', textColor = 'var(--text-1)';
              if (selectedOpt !== null) {
                if (idx === question.correct) { bg = 'rgba(34,197,94,0.1)'; border = '#22C55E'; textColor = '#22C55E'; }
                else if (idx === selectedOpt) { bg = 'rgba(239,68,68,0.1)'; border = '#EF4444'; textColor = '#EF4444'; }
              }
              return (
                <button key={idx} onClick={() => handleSelect(idx)} disabled={selectedOpt !== null}
                  style={{ width: '100%', padding: '18px 24px', background: bg, border: `2px solid ${border}`, borderRadius: '14px', textAlign: 'left', fontSize: '17px', fontWeight: 600, color: textColor, cursor: selectedOpt === null ? 'pointer' : 'default', transition: 'all 0.2s', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span>{opt}</span>
                  {selectedOpt !== null && idx === question.correct && <span>✓</span>}
                  {selectedOpt !== null && idx === selectedOpt && idx !== question.correct && <span>✕</span>}
                </button>
              );
            })}
          </div>

          {/* Explanation */}
          <AnimatePresence>
            {selectedOpt !== null && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
                <div style={{ background: 'rgba(168,85,247,0.06)', border: '1px solid rgba(168,85,247,0.25)', borderRadius: '14px', padding: '20px', position: 'relative', overflow: 'hidden', marginBottom: '24px' }}>
                  <div style={{ position: 'absolute', top: 0, left: 0, width: '4px', height: '100%', background: '#A855F7' }} />
                  <div style={{ fontSize: '11px', fontWeight: 800, color: '#A855F7', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '8px' }}>✨ AI Breakdown</div>
                  <div style={{ fontSize: '15px', color: 'var(--text-1)', lineHeight: 1.7 }}>{question.explanation}</div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <button onClick={handleNext}
                    style={{ padding: '14px 36px', background: 'var(--color-accent)', color: '#fff', border: 'none', borderRadius: '12px', fontSize: '16px', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    {currentIdx < questions.length - 1 ? 'Next' : 'View Results'} <ChevronRight size={18} />
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

const topicColors = {
  'Profit & Loss': '#22C55E',
  'Age Problems': '#3B82F6',
  'Work & Time': '#F59E0B',
  'Speed & Distance': '#8B5CF6',
  'Percentages': '#EC4899',
  'Compound Interest': '#10B981',
  'Ratio & Proportion': '#F97316',
  'HCF & LCM': '#06B6D4',
  'Simple Interest': '#EAB308',
  'Pipes & Cisterns': '#6366F1',
  'Trains': '#EF4444',
  'Averages': '#14B8A6',
  'Permutations': '#A855F7',
  'Probability': '#84CC16',
  'Number Series': '#FB923C',
};

/* ─── Main Export ───────────────────────────────── */
export default function QuantitativeMaths({ onClose }) {
  const [view, setView] = useState('sets'); // 'sets' | 'history' | 'quiz'
  const [activeSet, setActiveSet] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [history, setHistory] = useState(loadHistory);

  const handleSelectSet = useCallback((setNumber) => {
    const qs = generateSet(setNumber);
    setQuestions(qs);
    setActiveSet(setNumber);
    setView('quiz');
  }, []);

  const handleFinish = useCallback((result) => {
    const newHistory = [...history.filter(h => h.setNumber !== result.setNumber), { ...result, date: new Date().toISOString() }];
    setHistory(newHistory);
    saveHistory(newHistory);
    setView('sets');
    setActiveSet(null);
  }, [history]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 24px', borderBottom: '1px solid var(--border)', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {(view === 'quiz' || view === 'history') && (
            <button onClick={() => setView('sets')} style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: '10px', padding: '8px 14px', display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-2)', cursor: 'pointer', fontSize: '13px', fontWeight: 700 }}>
              <ArrowLeft size={14} /> Back to Sets
            </button>
          )}
          <div style={{ fontSize: '14px', fontWeight: 800, color: 'var(--text-1)' }}>
            📐 Quantitative Maths {activeSet ? `— Set ${activeSet}` : ''}
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {view !== 'history' && (
            <button onClick={() => setView('history')} style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: '10px', padding: '8px 14px', display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-2)', cursor: 'pointer', fontSize: '13px', fontWeight: 700 }}>
              <BarChart2 size={14} /> History
            </button>
          )}
        </div>
      </div>

      {/* Content */}
      <div style={{ flex: 1, overflowY: 'auto' }}>
        <AnimatePresence mode="wait">
          {view === 'sets' && (
            <motion.div key="sets" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <SetSelector history={history} onSelect={handleSelectSet} />
            </motion.div>
          )}
          {view === 'history' && (
            <motion.div key="history" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <HistoryView history={history} />
            </motion.div>
          )}
          {view === 'quiz' && questions.length > 0 && (
            <motion.div key="quiz" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ height: '100%' }}>
              <Quiz questions={questions} setNumber={activeSet} onFinish={handleFinish} onClose={onClose} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
