import { apiGet } from './api';
import { fetchJournalEntries } from '../api/journal';

// --- Local Storage Keys (fallback + Command Center + delta) ---
const PRIORITIES_KEY = 'aiimin_cmd_priorities';
const NOTE_KEY = 'aiimin_cmd_note';
const HABITS_KEY = 'aiimin_habits_v3';
const HABIT_LOGS_KEY = 'aiimin_habits_logs_v3';
const SLEEP_LOGS_KEY = 'aiimin_sleep_logs';
const SCORE_PREV_KEY = 'aiimin_life_score_prev';

const getDayKey = (d = new Date()) => d.toISOString().split('T')[0];

const loadJSON = (key, fallback) => {
  try { return JSON.parse(localStorage.getItem(key) || 'null') ?? fallback; }
  catch { return fallback; }
};

const getRollingDays = (days) => {
  const res = [];
  for (let i = 0; i < days; i++) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    res.push(getDayKey(d));
  }
  return res.reverse();
};

const calculateEMA = (data, alpha = 0.2) => {
  if (data.length === 0) return 0;
  return data.reduce((ema, val) => (val * alpha) + (ema * (1 - alpha)), data[0]);
};

const calculateStdDev = (arr) => {
  if (arr.length < 2) return 0;
  const mean = arr.reduce((a, b) => a + b) / arr.length;
  const variance = arr.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / arr.length;
  return Math.sqrt(variance);
};

const SENTIMENT_DICT = {
  grateful: 3, thankful: 3, happy: 3, shipped: 2, finished: 2, completed: 2,
  excited: 3, proud: 3, progress: 2, good: 1, great: 2, amazing: 3, blessed: 3,
  trained: 2, focused: 2, consistent: 2, honest: 1, protected: 1,
  worried: -2, stressed: -3, overwhelmed: -3, bad: -1, sad: -2, angry: -2,
  exhausted: -2, failed: -2, stuck: -1, terrible: -3, anxious: -2, frustrated: -1,
  always: -1, never: -2, everyone: -1, nobody: -2, ruined: -3, impossible: -2,
};

const analyzeSentiment = (text) => {
  if (!text) return { score: 0, distortions: 0, gratitude: 0 };
  const words = text.toLowerCase().match(/\b\w+\b/g) || [];
  let score = 0;
  let distortions = 0;
  let gratitude = 0;
  words.forEach((word) => {
    if (SENTIMENT_DICT[word] === undefined) return;
    score += SENTIMENT_DICT[word];
    if (SENTIMENT_DICT[word] < -1 && ['never', 'always', 'nobody', 'ruined', 'impossible'].includes(word)) {
      distortions += 1;
    }
    if (['grateful', 'thankful', 'blessed'].includes(word)) gratitude += 1;
  });
  return { score: Math.max(-5, Math.min(5, score)), distortions, gratitude };
};

const extractJournalText = (entry) => {
  const raw = entry?.encrypted_content;
  if (!raw || typeof raw !== 'string') return '';
  try {
    const parsed = JSON.parse(raw);
    if (typeof parsed?.body === 'string') return parsed.body;
    if (typeof parsed?.summary === 'string') return parsed.summary;
    if (Array.isArray(parsed?.wins)) {
      return parsed.wins.map((w) => (typeof w === 'string' ? w : w?.text || '')).filter(Boolean).join(' ');
    }
    if (parsed?.fields) {
      return Object.values(parsed.fields).filter((v) => typeof v === 'string').join(' ');
    }
  } catch {
    /* plaintext body */
  }
  return raw.slice(0, 2000);
};

const asList = (data) => (Array.isArray(data) ? data : (data?.data || []));

/**
 * Life Score — prefers server LHS (/intelligence/lhs), falls back to localStorage.
 * Scale: 15–98 (local) or 0–100 (API LHS).
 */
export const calculateLifeScoreLocal = async (user) => {
  const days30 = getRollingDays(30);
  const days14 = getRollingDays(14);
  const days7 = getRollingDays(7);
  const todayKey = getDayKey();
  const daySet7 = new Set(days7);

  let apiHabits = [];
  let journals = [];
  let goals = [];
  let dailyLogs = [];
  let usedApi = false;

  if (user && !user.isGuest) {
    const from30 = days30[0];
    const results = await Promise.allSettled([
      apiGet('/habits'),
      fetchJournalEntries({ orderCol: 'date', ascending: false, limit: 30 }),
      apiGet('/goals'),
      apiGet('/daily-logs', {
        params: { from: from30, to: getDayKey() },
      }),
    ]);
    if (results[0].status === 'fulfilled') apiHabits = asList(results[0].value);
    if (results[1].status === 'fulfilled') journals = asList(results[1].value);
    if (results[2].status === 'fulfilled') goals = asList(results[2].value);
    if (results[3].status === 'fulfilled') dailyLogs = asList(results[3].value);
    usedApi = apiHabits.length > 0 || journals.length > 0 || goals.length > 0 || dailyLogs.length > 0;
  }

  // 1. BEHAVIORAL — API habit completedDates, else local logs
  let behavioralScore = 50;
  if (apiHabits.length > 0) {
    const dailyRates = days30.map((date) => {
      let hits = 0;
      apiHabits.forEach((h) => {
        const dates = h.meta?.completedDates || [];
        if (dates.includes(date)) hits += 1;
      });
      return hits / apiHabits.length;
    });
    const recent7 = dailyRates.slice(-7);
    const ema7 = calculateEMA(recent7, 0.3);
    const stdDev30 = calculateStdDev(dailyRates);
    const consistencyPenalty = stdDev30 * 20;
    let streak = 0;
    for (let i = dailyRates.length - 1; i >= 0; i -= 1) {
      if (dailyRates[i] >= 0.5) streak += 1;
      else break;
    }
    let rawBehav = (ema7 * 100 * 0.8) + (streak * 1.5) - consistencyPenalty;
    behavioralScore = Math.max(15, Math.min(100, rawBehav));
    if (dailyRates.every((r) => r === 0)) behavioralScore = 28;
  } else {
    const habits = loadJSON(HABITS_KEY, []);
    const habitLogs = loadJSON(HABIT_LOGS_KEY, {});
    if (habits.length > 0) {
      const dailyRates = days30.map((date) => {
        const log = habitLogs[date] || {};
        let hits = 0;
        habits.forEach((h) => { if (log[h.id]) hits += 1; });
        return hits / habits.length;
      });
      const ema7 = calculateEMA(dailyRates.slice(-7), 0.3);
      const consistencyPenalty = calculateStdDev(dailyRates) * 20;
      let streak = 0;
      for (let i = dailyRates.length - 1; i >= 0; i -= 1) {
        if (dailyRates[i] === 1.0) streak += 1;
        else break;
      }
      behavioralScore = Math.max(15, Math.min(100, (ema7 * 100 * 0.8) + (streak * 2) - consistencyPenalty));
      if (dailyRates.every((r) => r === 0)) behavioralScore = 30;
    }
  }

  // 2. MENTAL — journals (mood + text) + CC notes fallback
  let mentalScore = 50;
  let journalCount = 0;
  let totalSentiment = 0;
  let distortionCount = 0;
  let moodSum = 0;
  let moodN = 0;

  journals.forEach((entry) => {
    const dateKey = String(entry.date || '').slice(0, 10);
    const inLast7 = daySet7.has(dateKey);
    if (!inLast7 && dateKey) return;
    journalCount += 1;
    if (entry.mood != null) {
      moodSum += Number(entry.mood);
      moodN += 1;
    }
    const analysis = analyzeSentiment(extractJournalText(entry));
    totalSentiment += analysis.score;
    distortionCount += analysis.distortions;
  });

  // If journal dates missing/outside window, use newest 7 rows from API order
  if (journalCount === 0 && journals.length > 0) {
    journals.slice(0, 7).forEach((entry) => {
      journalCount += 1;
      if (entry.mood != null) {
        moodSum += Number(entry.mood);
        moodN += 1;
      }
      const analysis = analyzeSentiment(extractJournalText(entry));
      totalSentiment += analysis.score;
      distortionCount += analysis.distortions;
    });
  }

  days7.forEach((date) => {
    const note = localStorage.getItem(`${NOTE_KEY}_${date}`);
    if (note && note.trim().length > 0) {
      journalCount += 1;
      const analysis = analyzeSentiment(note);
      totalSentiment += analysis.score;
      distortionCount += analysis.distortions;
    }
  });

  // daily_logs mood as soft signal
  dailyLogs.forEach((log) => {
    const dk = String(log.date || '').slice(0, 10);
    if (daySet7.has(dk) && log.mood != null) {
      moodSum += Number(log.mood);
      moodN += 1;
    }
  });

  if (journalCount > 0 || moodN > 0) {
    const engagement = Math.min(1, journalCount / 7) * 30;
    const sentimentShift = totalSentiment * 3;
    const moodAvg = moodN > 0 ? moodSum / moodN : 3;
    // mood 1–5 → map to ±20 around mid
    const moodShift = (moodAvg - 3) * 10;
    let rawMental = 42 + engagement + sentimentShift + moodShift;
    rawMental -= distortionCount * 4;
    mentalScore = Math.max(20, Math.min(95, rawMental));
  } else {
    mentalScore = 45;
  }

  // 3. FINANCIAL — API MTD (unchanged logic)
  let financialScore = 50;
  if (user && !user.isGuest) {
    try {
      const now = new Date();
      const startOfMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-01`;
      const data = await apiGet(`/wealth/transactions?from=${startOfMonth}&limit=200`);
      const txList = asList(data);
      const income = txList.filter((t) => t.type === 'income').reduce((s, t) => s + Number(t.amount || 0), 0);
      const expense = txList.filter((t) => t.type === 'expense').reduce((s, t) => s + Math.abs(Number(t.amount || 0)), 0);
      if (txList.length > 0) {
        const savingsRate = income > 0 ? (income - expense) / income : (expense > 0 ? -1 : 0);
        if (savingsRate >= 0.2) financialScore = Math.min(98, 90 + (savingsRate * 10));
        else if (savingsRate > 0) financialScore = 70 + (savingsRate * 100);
        else if (expense === income && income > 0) financialScore = 60;
        else if (expense > income && income > 0) {
          const overrun = (expense - income) / income;
          financialScore = Math.max(10, 50 - (overrun * 50));
        } else if (expense > 0 && income === 0) {
          financialScore = 25;
        }
      }
    } catch {
      /* finance optional */
    }
  }

  // 4. GOAL MOMENTUM — API goals milestones/progress, else CC priorities
  let goalScore = 50;
  if (goals.length > 0) {
    const active = goals.filter((g) => {
      const st = String(g.status || '').toLowerCase();
      return st !== 'archived' && st !== 'dropped';
    });
    const pool = active.length ? active : goals;
    let ratioSum = 0;
    pool.forEach((g) => {
      const st = String(g.status || '');
      if (/achieved|won|done|completed/i.test(st)) {
        ratioSum += 1;
        return;
      }
      const ms = Array.isArray(g.milestones) ? g.milestones : [];
      if (ms.length) {
        ratioSum += ms.filter((m) => m.done).length / ms.length;
        return;
      }
      const prog = Number(g.progress ?? g.meta?.progress);
      if (!Number.isNaN(prog) && prog > 0) ratioSum += Math.min(1, prog / 100);
      else if (/on track/i.test(st)) ratioSum += 0.7;
      else if (/at risk/i.test(st)) ratioSum += 0.35;
      else ratioSum += 0.45;
    });
    const completionRate = ratioSum / pool.length;
    if (completionRate >= 0.9) goalScore = 95;
    else if (completionRate >= 0.75) goalScore = 85;
    else if (completionRate >= 0.5) goalScore = 72;
    else if (completionRate >= 0.3) goalScore = 58;
    else if (completionRate > 0) goalScore = 48;
    else goalScore = 35;
  } else {
    const p = loadJSON(`${PRIORITIES_KEY}_${todayKey}`, []);
    if (p.length > 0) {
      const done = p.filter((x) => x.done).length;
      const completionRate = done / p.length;
      if (completionRate === 1.0) goalScore = 95;
      else if (completionRate >= 0.75) goalScore = 85;
      else if (completionRate >= 0.5) goalScore = 70;
      else if (completionRate > 0) goalScore = 50;
      else goalScore = 30;
    } else {
      goalScore = 40;
    }
  }

  // 5. RECOVERY — daily_logs sleep_hours, else local sleep logs
  let recoveryScore = 65;
  const sleepFromLogs = dailyLogs
    .filter((l) => days14.includes(String(l.date || '').slice(0, 10)) && l.sleep_hours != null)
    .map((l) => Number(l.sleep_hours));

  if (sleepFromLogs.length > 0) {
    const avgSleep = sleepFromLogs.reduce((a, b) => a + b, 0) / sleepFromLogs.length;
    const sleepStdDev = calculateStdDev(sleepFromLogs);
    const durationScore = 100 - (Math.abs(7.5 - avgSleep) * 15);
    recoveryScore = Math.max(15, Math.min(96, durationScore - (sleepStdDev * 10)));
  } else {
    const sleepLogs = loadJSON(SLEEP_LOGS_KEY, {});
    const loggedNights = days14.filter((d) => sleepLogs[d]).map((d) => sleepLogs[d]);
    if (loggedNights.length > 0) {
      const durations = loggedNights.map((l) => l.duration || 7);
      const avgSleep = durations.reduce((a, b) => a + b, 0) / durations.length;
      const sleepStdDev = calculateStdDev(durations);
      recoveryScore = Math.max(15, Math.min(96, (100 - (Math.abs(7.5 - avgSleep) * 15)) - (sleepStdDev * 10)));
    } else {
      recoveryScore = 55;
    }
  }

  const weights = {
    behavioral: 0.28,
    mental_clarity: 0.22,
    goal_momentum: 0.20,
    financial: 0.18,
    recovery: 0.12,
  };

  const rawScore =
    (behavioralScore * weights.behavioral) +
    (mentalScore * weights.mental_clarity) +
    (goalScore * weights.goal_momentum) +
    (financialScore * weights.financial) +
    (recoveryScore * weights.recovery);

  const finalScore = Math.round(Math.max(15, Math.min(98, rawScore)));

  let delta = 0;
  try {
    const prev = Number(localStorage.getItem(SCORE_PREV_KEY));
    if (!Number.isNaN(prev) && prev > 0) delta = finalScore - prev;
    localStorage.setItem(SCORE_PREV_KEY, String(finalScore));
  } catch { /* ignore */ }

  const deltas = [
    { name: 'Behavioral', val: behavioralScore - 50 },
    { name: 'Mental Clarity', val: mentalScore - 50 },
    { name: 'Goal Momentum', val: goalScore - 50 },
    { name: 'Financial', val: financialScore - 50 },
    { name: 'Recovery', val: recoveryScore - 50 },
  ].sort((a, b) => b.val - a.val);

  const best = deltas[0];
  const worst = deltas[4];

  let explanation = usedApi
    ? 'Score reflects your logged habits, journals, goals, money, and sleep.'
    : 'Your baseline is stabilizing.';
  if (best.val > 10 && worst.val < -10) {
    explanation = `${best.name} is driving your score up, but ${worst.name.toLowerCase()} is dragging it down.`;
  } else if (best.val > 15) {
    explanation = `Excellent momentum in ${best.name} is boosting your score.`;
  } else if (worst.val < -15) {
    explanation = `Your score dipped due to low ${worst.name.toLowerCase()} indicators.`;
  }

  return {
    score: finalScore,
    delta,
    explanation,
    source: usedApi ? 'api-partial' : 'local',
    contributors: {
      behavioral: { score: Math.round(behavioralScore), label: 'Behavioral' },
      mental_clarity: { score: Math.round(mentalScore), label: 'Mental Clarity' },
      goal_momentum: { score: Math.round(goalScore), label: 'Goal Momentum' },
      financial: { score: Math.round(financialScore), label: 'Financial' },
      recovery: { score: Math.round(recoveryScore), label: 'Recovery' },
    },
  };
};

/** API-first unified score — same path as useLifeScore hook */
export const calculateLifeScore = async (user) => {
  if (user && !user.isGuest) {
    try {
      const lhs = await apiGet('/intelligence/lhs?days=30');
      if (lhs?.globalScore != null) {
        const ss = lhs.systemScores || {};
        const score = Math.round(Number(lhs.globalScore) || 0);
        let delta = 0;
        try {
          const prev = Number(localStorage.getItem(SCORE_PREV_KEY));
          if (!Number.isNaN(prev) && prev > 0) delta = score - prev;
          localStorage.setItem(SCORE_PREV_KEY, String(score));
        } catch { /* ignore */ }
        const contributors = {
          behavioral: { score: Math.round(ss.discipline || 0), label: 'Behavioral' },
          mental_clarity: { score: Math.round(ss.emotional || 0), label: 'Mental Clarity' },
          goal_momentum: { score: Math.round(ss.cognitive || 0), label: 'Goal Momentum' },
          financial: { score: Math.round(ss.financial || 0), label: 'Financial' },
          recovery: { score: Math.round(ss.physical || 0), label: 'Recovery' },
        };
        return {
          score,
          delta,
          explanation: 'Score reflects your logged habits, sleep, focus, money, and mood.',
          source: 'api',
          contributors,
        };
      }
    } catch {
      /* fall through to local */
    }
  }
  return calculateLifeScoreLocal(user);
};
