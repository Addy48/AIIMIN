import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Check, ChevronRight, Flame } from 'lucide-react';
import { apiGet } from '../../utils/api';
import { useLifeScore } from '../../hooks/useLifeScore';
import { useUserProfile } from '../../hooks/useUserProfile';
import { LIFE_ARC_LABEL } from '../../constants/arc';
import { formatINR } from '../../utils/formatDate';

/* ─── Constants ─────────────────────────────────────────────────── */
const PRIORITIES_KEY = 'aiimin_cmd_priorities';
const NOTE_KEY = 'aiimin_cmd_note';
const HABITS_KEY = 'aiimin_habits_v3';
const HABIT_LOGS_KEY = 'aiimin_habits_logs_v3';
const getDayKey = (d = new Date()) => d.toISOString().split('T')[0];
const TODAY = getDayKey();

const loadJSON = (key, fallback) => {
  try { return JSON.parse(localStorage.getItem(key) || 'null') ?? fallback; }
  catch { return fallback; }
};

/* ─── Helpers ────────────────────────────────────────────────────── */
const calcStreak = (habitId, logs) => {
  let s = 0;
  const d = new Date();
  while (true) {
    const k = getDayKey(d);
    if (logs[k]?.[habitId]) { s++; d.setDate(d.getDate() - 1); }
    else break;
  }
  return s;
};

const yesterdayKey = () => {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return getDayKey(d);
};

function getStreakStatus(habitId, logs, streak) {
  if (streak === 0) {
    const wasYesterday = logs[yesterdayKey()]?.[habitId];
    if (wasYesterday === false || wasYesterday === undefined) {
      // Check if ever done before
      const hasHistory = Object.values(logs).some(day => day?.[habitId]);
      return hasHistory ? 'broken' : 'new';
    }
  }
  if (streak >= 1) {
    const doneToday = logs[TODAY]?.[habitId];
    if (!doneToday) return 'at_risk'; // Had streak yesterday but not yet done today
  }
  return 'healthy';
}

/* ═══════════════════════════════════════════════════════════════════
   COMMAND CENTER
════════════════════════════════════════════════════════════════════ */
export default function CommandCenter({ user }) {
  const { profile } = useUserProfile();
  const lifeArc = profile?.tagline?.trim();
  const [priorities, setPriorities] = useState(() => loadJSON(`${PRIORITIES_KEY}_${TODAY}`, []));
  const [newPriority, setNewPriority] = useState('');
  const [addingPriority, setAddingPriority] = useState(false);
  const [note, setNote] = useState(() => localStorage.getItem(`${NOTE_KEY}_${TODAY}`) || '');
  const [noteSaved, setNoteSaved] = useState(false);
  const [habits, setHabits] = useState([]);
  const [habitLogs, setHabitLogs] = useState({});
  const [finSnap, setFinSnap] = useState(null);
  const { lifeScore, refetch: refetchLifeScore } = useLifeScore(user);

  useEffect(() => {
    if (user && !user.isGuest) refetchLifeScore();
  }, [user, habits, habitLogs, priorities, refetchLifeScore]);

  // Load habits from localStorage
  useEffect(() => {
    const h = loadJSON(HABITS_KEY, []);
    const l = loadJSON(HABIT_LOGS_KEY, {});
    setHabits(h);
    setHabitLogs(l);
  }, []);

  // Load finance snapshot from API
  useEffect(() => {
    if (!user || user.isGuest) return;
    const now = new Date();
    const startOfMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-01`;
    apiGet(`/wealth/transactions?from=${startOfMonth}&limit=200`)
      .then(data => {
        const txList = Array.isArray(data) ? data : (data?.data || []);
        const income = txList.filter(t => t.type === 'income').reduce((s, t) => s + Number(t.amount || 0), 0);
        const expense = txList.filter(t => t.type === 'expense').reduce((s, t) => s + Number(t.amount || 0), 0);
        setFinSnap({ total_income: income, total_expenses: expense, tx_count: txList.length, budget_limit: 0 });
      })
      .catch(() => setFinSnap({ total_income: 0, total_expenses: 0, tx_count: 0, budget_limit: 0 }));
  }, [user]);

  // Persist priorities for today
  useEffect(() => {
    localStorage.setItem(`${PRIORITIES_KEY}_${TODAY}`, JSON.stringify(priorities));
  }, [priorities]);

  const addPriority = useCallback(() => {
    if (!newPriority.trim() || priorities.length >= 3) return;
    setPriorities(prev => [...prev, { id: Date.now(), text: newPriority.trim(), done: false }]);
    setNewPriority('');
    setAddingPriority(false);
  }, [newPriority, priorities.length]);

  const togglePriority = useCallback((id) => {
    setPriorities(prev => prev.map(p => p.id === id ? { ...p, done: !p.done } : p));
  }, []);

  const removePriority = useCallback((id) => {
    setPriorities(prev => prev.filter(p => p.id !== id));
  }, []);

  const saveNote = useCallback(() => {
    if (!note.trim()) return;
    localStorage.setItem(`${NOTE_KEY}_${TODAY}`, note.trim());
    setNoteSaved(true);
    setTimeout(() => setNoteSaved(false), 2000);
  }, [note]);

  // Top 3 habits by streak + status (dedupe by id — localStorage can accumulate duplicates)
  const topHabits = Array.from(
    new Map(habits.filter((h) => h?.id).map((h) => [h.id, h])).values()
  )
    .map(h => {
      const streak = calcStreak(h.id, habitLogs);
      const status = getStreakStatus(h.id, habitLogs, streak);
      const doneToday = !!(habitLogs[TODAY]?.[h.id]);
      return { ...h, streak, status, doneToday };
    })
    .sort((a, b) => {
      const order = { broken: 0, at_risk: 1, healthy: 2, new: 3 };
      return order[a.status] - order[b.status];
    })
    .slice(0, 3);

  const doneCount = priorities.filter(p => p.done).length;

  return (
    <div style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: '20px', overflow: 'hidden' }}>
      {/* Header */}
      <div style={{ padding: '18px 20px 14px', borderBottom: '1px solid var(--color-border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--color-accent)', display: 'inline-block', boxShadow: '0 0 6px var(--color-accent)' }} />
          <span style={{ fontSize: '10px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--color-text-3)' }}>Command Center</span>
        </div>
        <span style={{ fontSize: '11px', color: 'var(--color-text-3)', fontWeight: 600 }}>
          {new Date().toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' })}
        </span>
      </div>

      {/* ── Section 0: Life Score ── */}
      {lifeScore && (
        <Section icon="🧠" label="Life Score" right={<span style={{ color: lifeScore.delta >= 0 ? '#22C55E' : '#EF4444' }}>{lifeScore.delta >= 0 ? '+' : ''}{lifeScore.delta} today</span>}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ position: 'relative', width: '48px', height: '48px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg viewBox="0 0 36 36" style={{ position: 'absolute', width: '100%', height: '100%', transform: 'rotate(-90deg)' }}>
                <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="var(--color-elevated)" strokeWidth="3" />
                <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="var(--color-accent)" strokeWidth="3" strokeDasharray={`${lifeScore.score}, 100`} />
              </svg>
              <span style={{ fontSize: '16px', fontWeight: 900, color: 'var(--color-text-1)' }}>{lifeScore.score}</span>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '12px', color: 'var(--color-text-2)', lineHeight: 1.4 }}>
                {lifeScore.explanation}
              </div>
              <div style={{ display: 'flex', gap: '8px', marginTop: '6px', flexWrap: 'wrap' }}>
                <div style={{ fontSize: '10px', color: 'var(--color-text-3)' }}>Behav: {lifeScore.contributors.behavioral.score}</div>
                <div style={{ fontSize: '10px', color: 'var(--color-text-3)' }}>Mental: {lifeScore.contributors.mental_clarity.score}</div>
                {lifeScore.contributors.goal_momentum && (
                  <div style={{ fontSize: '10px', color: 'var(--color-text-3)' }}>Goals: {lifeScore.contributors.goal_momentum.score}</div>
                )}
                {lifeScore.contributors.financial && (
                  <div style={{ fontSize: '10px', color: 'var(--color-text-3)' }}>Money: {lifeScore.contributors.financial.score}</div>
                )}
                {lifeScore.contributors.recovery && (
                  <div style={{ fontSize: '10px', color: 'var(--color-text-3)' }}>Sleep: {lifeScore.contributors.recovery.score}</div>
                )}
              </div>
            </div>
          </div>
        </Section>
      )}

      {/* ── Section 1: Top 3 Priorities ── */}
      <Section icon="🎯" label="Today's Priorities" right={priorities.length > 0 ? `${doneCount}/${priorities.length}` : null} rightColor="var(--color-accent)">
        {lifeArc && (
          <p style={{ margin: '0 0 10px', fontSize: 11, lineHeight: 1.45, color: 'var(--color-text-3)' }}>
            <span style={{ fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{LIFE_ARC_LABEL}: </span>
            <span style={{ color: 'var(--color-text-2)', fontWeight: 600 }}>{lifeArc}</span>
          </p>
        )}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {priorities.map(p => (
            <div key={p.id} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 10px', background: p.done ? 'rgba(34,197,94,0.05)' : 'var(--color-elevated)', borderRadius: '10px', border: `1px solid ${p.done ? 'rgba(34,197,94,0.2)' : 'var(--color-border)'}`, transition: 'all 0.2s' }}>
              <button onClick={() => togglePriority(p.id)} style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', display: 'flex', alignItems: 'center', color: p.done ? '#22C55E' : 'var(--color-text-3)', flexShrink: 0 }}>
                {p.done ? <Check size={14} strokeWidth={3} /> : <div style={{ width: '14px', height: '14px', borderRadius: '4px', border: '1.5px solid var(--color-text-3)' }} />}
              </button>
              <span style={{ fontSize: '12px', color: p.done ? 'var(--color-text-3)' : 'var(--color-text-1)', textDecoration: p.done ? 'line-through' : 'none', flex: 1, lineHeight: 1.3 }}>{p.text}</span>
              <button onClick={() => removePriority(p.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-3)', padding: 0, opacity: 0.5, fontSize: '11px', lineHeight: 1 }}>✕</button>
            </div>
          ))}

          {priorities.length < 3 && (
            addingPriority ? (
              <div style={{ display: 'flex', gap: '6px' }}>
                <input
                  autoFocus
                  value={newPriority}
                  onChange={e => setNewPriority(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter') addPriority(); if (e.key === 'Escape') { setAddingPriority(false); setNewPriority(''); } }}
                  onBlur={() => { if (!newPriority.trim()) setAddingPriority(false); }}
                  placeholder={`Priority ${priorities.length + 1} of 3...`}
                  style={{ flex: 1, background: 'var(--color-elevated)', border: '1px solid var(--color-accent)', borderRadius: '10px', padding: '8px 12px', fontSize: '12px', color: 'var(--color-text-1)', outline: 'none', fontFamily: 'inherit' }}
                />
                <button onClick={addPriority} style={{ background: 'var(--color-accent)', border: 'none', borderRadius: '10px', padding: '8px 12px', color: '#fff', fontSize: '12px', fontWeight: 700, cursor: 'pointer' }}>Add</button>
              </div>
            ) : (
              <button onClick={() => setAddingPriority(true)} style={{ background: 'none', border: '1.5px dashed var(--color-border)', borderRadius: '10px', padding: '8px', fontSize: '11px', color: 'var(--color-text-2)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px', fontFamily: 'inherit', fontWeight: 700 }}>
                <Plus size={11} /> Add priorities
              </button>
            )
          )}

          {priorities.length === 0 && !addingPriority && (
            <p style={{ margin: '0 0 10px', fontSize: 12, lineHeight: 1.45, color: 'var(--color-text-1)' }}>
              Set up to 3 things that must happen today.
            </p>
          )}
        </div>
      </Section>

      {/* ── Section 2: Streak Monitor ── */}
      <Section icon="🔥" label="Streak Monitor" right={<Link to="/habits" style={{ display: 'flex', alignItems: 'center', gap: '3px', color: 'var(--color-text-3)', textDecoration: 'none', fontSize: '11px' }}>All <ChevronRight size={11} /></Link>}>
        {topHabits.length === 0 ? (
          <p style={{ fontSize: '12px', color: 'var(--color-text-1)', margin: 0, lineHeight: 1.5 }}>
            No habits yet. <Link to="/habits" style={{ color: 'var(--color-accent)', textDecoration: 'underline', fontWeight: 700 }}>Add one</Link>
          </p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {topHabits.map(h => {
              const barWidth = Math.min(100, (h.streak / 14) * 100);
              const statusColors = { healthy: '#22C55E', at_risk: '#F59E0B', broken: '#EF4444', new: 'var(--color-text-3)' };
              const statusLabels = { healthy: h.doneToday ? '✓ done' : 'on track', at_risk: '⚠ at risk', broken: '💀 broken', new: 'new' };
              const statusColor = statusColors[h.status];
              return (
                <div key={h.id}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '5px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ fontSize: '13px' }}>{h.icon}</span>
                      <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-text-1)' }}>{h.name}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ fontSize: '10px', fontWeight: 700, color: statusColor }}>{statusLabels[h.status]}</span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '3px', color: h.streak > 0 ? '#F59E0B' : 'var(--color-text-3)' }}>
                        <Flame size={11} />
                        <span style={{ fontSize: '11px', fontWeight: 800 }}>{h.streak}</span>
                      </div>
                    </div>
                  </div>
                  <div style={{ height: '4px', background: 'var(--color-border)', borderRadius: '99px', overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${barWidth}%`, background: statusColor, borderRadius: '99px', transition: 'width 0.6s ease' }} />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </Section>

      {/* ── Section 3: Money Snapshot ── */}
      <Section icon="💰" label="Money This Month" right={<Link to="/finance" style={{ display: 'flex', alignItems: 'center', gap: '3px', color: 'var(--color-text-3)', textDecoration: 'none', fontSize: '11px' }}>Finance <ChevronRight size={11} /></Link>}>
        {user?.isGuest ? (
          <p style={{ fontSize: '11px', color: 'var(--color-text-3)', fontStyle: 'italic' }}>Log in to see your spending.</p>
        ) : finSnap ? (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '8px' }}>
              <div>
                <div style={{ fontSize: '10px', color: 'var(--color-text-3)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Spent</div>
                <div style={{ fontSize: '20px', fontWeight: 900, color: 'var(--color-text-1)', fontFamily: 'var(--font-mono, monospace)', lineHeight: 1 }}>
                  {formatINR(Math.abs(Number(finSnap.total_expenses) || 0))}
                </div>
              </div>
              {finSnap.total_income > 0 && (
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '10px', color: 'var(--color-text-3)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Income</div>
                  <div style={{ fontSize: '14px', fontWeight: 800, color: '#22C55E', fontFamily: 'var(--font-mono, monospace)', lineHeight: 1 }}>
                    +{formatINR(Math.abs(Number(finSnap.total_income) || 0))}
                  </div>
                </div>
              )}
            </div>
            {finSnap.budget_limit > 0 && (
              <>
                <div style={{ height: '4px', background: 'var(--color-border)', borderRadius: '99px', overflow: 'hidden', marginBottom: '4px' }}>
                  <div style={{
                    height: '100%',
                    width: `${Math.min(100, ((finSnap.total_expenses || 0) / finSnap.budget_limit) * 100)}%`,
                    background: (finSnap.total_expenses / finSnap.budget_limit) > 0.85 ? '#EF4444' : '#22C55E',
                    borderRadius: '99px', transition: 'width 0.6s ease'
                  }} />
                </div>
                <span style={{ fontSize: '10px', color: 'var(--color-text-3)' }}>
                  Budget: {formatINR(Math.abs(Number(finSnap.budget_limit) || 0))}
                </span>
              </>
            )}
            {!finSnap.budget_limit && (
              <p style={{ fontSize: '11px', color: 'var(--color-text-3)', margin: 0 }}>
                {finSnap.tx_count || 0} transactions this month
              </p>
            )}
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {[48, 72, 36].map((w, i) => (
              <div key={i} style={{ height: '12px', background: 'var(--color-elevated)', borderRadius: '6px', width: `${w}%`, animation: 'pulse 1.5s ease-in-out infinite' }} />
            ))}
          </div>
        )}
      </Section>

      {/* ── Section 4: One-Liner Journal ── */}
      <Section icon="✍️" label="One Liner" noBorder>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'stretch' }}>
          <input
            value={note}
            onChange={e => setNote(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && saveNote()}
            placeholder="What's on your mind right now?"
            style={{
              flex: 1, background: 'var(--color-elevated)', border: '1px solid var(--color-border)',
              borderRadius: '10px', padding: '9px 12px', fontSize: '12px', color: 'var(--color-text-1)',
              outline: 'none', fontFamily: 'inherit', transition: 'border-color 0.15s',
            }}
            onFocus={e => e.target.style.borderColor = 'var(--color-accent)'}
            onBlur={e => e.target.style.borderColor = 'var(--color-border)'}
          />
          <button
            onClick={saveNote}
            disabled={!note.trim()}
            style={{
              background: noteSaved ? '#22C55E' : 'var(--color-accent)',
              border: 'none', borderRadius: '10px', padding: '9px 14px',
              fontSize: '11px', fontWeight: 800, color: '#fff', cursor: note.trim() ? 'pointer' : 'default',
              transition: 'all 0.2s', opacity: note.trim() ? 1 : 0.4, whiteSpace: 'nowrap',
            }}
          >
            {noteSaved ? '✓ Saved' : 'Log →'}
          </button>
        </div>
      </Section>
    </div>
  );
}

/* ─── Section wrapper ────────────────────────────────────────────── */
function Section({ icon, label, right, rightColor, children, noBorder }) {
  return (
    <div style={{ padding: '16px 20px', borderBottom: noBorder ? 'none' : '1px solid var(--color-border)' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ fontSize: '13px' }}>{icon}</span>
          <span style={{ fontSize: '10px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--color-text-3)' }}>{label}</span>
        </div>
        {right && (
          <span style={{ fontSize: '11px', fontWeight: 700, color: rightColor || 'var(--color-text-3)' }}>{right}</span>
        )}
      </div>
      {children}
    </div>
  );
}
