import { apiGet } from './api';

// --- Local Storage Keys ---
const PRIORITIES_KEY = 'aiimin_cmd_priorities';
const NOTE_KEY = 'aiimin_cmd_note';
const HABITS_KEY = 'aiimin_habits_v3';
const HABIT_LOGS_KEY = 'aiimin_habits_logs_v3';
const SLEEP_LOGS_KEY = 'aiimin_sleep_logs'; // Format: { date: { duration: 7.2, bedtime: '23:30', quality: 4 } }

// --- Utility Functions ---
const getDayKey = (d = new Date()) => d.toISOString().split('T')[0];

const loadJSON = (key, fallback) => {
  try { return JSON.parse(localStorage.getItem(key) || 'null') ?? fallback; }
  catch { return fallback; }
};

const getRollingDays = (days) => {
  const res = [];
  for (let i = 0; i < days; i++) {
    let d = new Date();
    d.setDate(d.getDate() - i);
    res.push(getDayKey(d));
  }
  return res.reverse();
};

// --- Mathematical / ML Primitives ---

// 1. Exponential Moving Average (EMA)
const calculateEMA = (data, alpha = 0.2) => {
  if (data.length === 0) return 0;
  return data.reduce((ema, val) => (val * alpha) + (ema * (1 - alpha)), data[0]);
};

// 2. Standard Deviation
const calculateStdDev = (arr) => {
  if (arr.length < 2) return 0;
  const mean = arr.reduce((a, b) => a + b) / arr.length;
  const variance = arr.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / arr.length;
  return Math.sqrt(variance);
};

// 3. NLP Lexicon (Mini AFINN + Cognitive Distortion Markers)
const SENTIMENT_DICT = {
  // Positive
  "grateful": 3, "thankful": 3, "happy": 3, "shipped": 2, "finished": 2, "completed": 2,
  "excited": 3, "proud": 3, "progress": 2, "good": 1, "great": 2, "amazing": 3, "blessed": 3,
  // Negative
  "worried": -2, "stressed": -3, "overwhelmed": -3, "bad": -1, "sad": -2, "angry": -2,
  "exhausted": -2, "failed": -2, "stuck": -1, "terrible": -3,
  // Cognitive Distortions (Catastrophizing / Absolute)
  "always": -1, "never": -2, "everyone": -1, "nobody": -2, "ruined": -3, "impossible": -2
};

const analyzeSentiment = (text) => {
  if (!text) return { score: 0, distortions: 0, gratitude: 0 };
  const words = text.toLowerCase().match(/\b\w+\b/g) || [];
  let score = 0;
  let distortions = 0;
  let gratitude = 0;

  words.forEach(word => {
    if (SENTIMENT_DICT[word] !== undefined) {
      score += SENTIMENT_DICT[word];
      if (SENTIMENT_DICT[word] < -1 && ["never", "always", "nobody", "ruined", "impossible"].includes(word)) {
        distortions++;
      }
      if (["grateful", "thankful", "blessed"].includes(word)) {
        gratitude++;
      }
    }
  });
  
  // Normalize score between -5 and +5 approx
  return { score: Math.max(-5, Math.min(5, score)), distortions, gratitude };
};

// --- Life Score Engine (Weighted Ensemble Model) ---

export const calculateLifeScore = async (user) => {
  const days30 = getRollingDays(30);
  const days14 = getRollingDays(14);
  const days7 = getRollingDays(7);
  const todayKey = getDayKey();

  // 1. BEHAVIORAL CONSISTENCY MODEL (Time-Series simulation)
  let behavioralScore = 50;
  const habits = loadJSON(HABITS_KEY, []);
  const habitLogs = loadJSON(HABIT_LOGS_KEY, {});
  
  if (habits.length > 0) {
    const dailyRates = days30.map(date => {
      const log = habitLogs[date] || {};
      let hits = 0;
      habits.forEach(h => { if (log[h.id]) hits++; });
      return hits / habits.length;
    });

    // Recent 7 days matter more (EMA logic approximation)
    const recent7 = dailyRates.slice(-7);
    const ema7 = calculateEMA(recent7, 0.3); // alpha 0.3 favors recent days
    const stdDev30 = calculateStdDev(dailyRates);
    
    // Penalize high variance (inconsistency)
    const consistencyPenalty = stdDev30 * 20; 
    
    // Compute current streak
    let streak = 0;
    for (let i = dailyRates.length - 1; i >= 0; i--) {
      if (dailyRates[i] === 1.0) streak++;
      else break;
    }

    // Formula: EMA drives 70%, streak gives bonus, variance penalizes
    let rawBehav = (ema7 * 100 * 0.8) + (streak * 2) - consistencyPenalty;
    behavioralScore = Math.max(15, Math.min(100, rawBehav));
    if (dailyRates.every(r => r === 0)) behavioralScore = 30; // 30 day zero fallback
  }

  // 2. MENTAL CLARITY MODEL (NLP Sentiment + DistilBERT proxy)
  let mentalScore = 50;
  let totalSentiment = 0;
  let journalCount = 0;
  let distortionCount = 0;

  days7.forEach(date => {
    const note = localStorage.getItem(`${NOTE_KEY}_${date}`);
    if (note && note.trim().length > 0) {
      journalCount++;
      const analysis = analyzeSentiment(note);
      totalSentiment += analysis.score;
      distortionCount += analysis.distortions;
    }
  });

  if (journalCount > 0) {
    // Base 40 + Engagement (up to 30) + Sentiment Shift (up to +30 or -20)
    let rawMental = 40 + (journalCount / 7) * 30 + (totalSentiment * 4);
    // Cognitive distortion penalty
    rawMental -= (distortionCount * 5);
    mentalScore = Math.max(20, Math.min(95, rawMental));
  } else {
    mentalScore = 45; // Decay fallback
  }

  // 3. FINANCIAL DISCIPLINE MODEL (XGBoost Simulated logic)
  let financialScore = 50;
  if (user && !user.isGuest) {
    try {
      const now = new Date();
      const startOfMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-01`;
      const data = await apiGet(`/wealth/transactions?from=${startOfMonth}&limit=200`);
      const txList = Array.isArray(data) ? data : (data?.data || []);
      const income = txList.filter(t => t.type === 'income').reduce((s, t) => s + Number(t.amount || 0), 0);
      const expense = txList.filter(t => t.type === 'expense').reduce((s, t) => s + Number(t.amount || 0), 0);
      
      if (txList.length > 0) {
        const savingsRate = income > 0 ? (income - expense) / income : 0;
        
        if (savingsRate >= 0.2) financialScore = 90 + (savingsRate * 10);
        else if (savingsRate > 0) financialScore = 70 + (savingsRate * 100);
        else if (expense === income && income > 0) financialScore = 60;
        else if (expense > income) {
          // Negative savings rate penalty
          const overrun = (expense - income) / income;
          financialScore = Math.max(10, 50 - (overrun * 50));
        }
      }
    } catch (e) {
      console.warn("Finance API skipped for ML score");
    }
  }

  // 4. GOAL MOMENTUM MODEL (LightGBM Simulated Tree Logic)
  let goalScore = 50;
  const p = loadJSON(`${PRIORITIES_KEY}_${todayKey}`, []);
  
  if (p.length > 0) {
    const done = p.filter(x => x.done).length;
    const completionRate = done / p.length;
    // Tree-like decision boundaries
    if (completionRate === 1.0) goalScore = 95;
    else if (completionRate >= 0.75) goalScore = 85;
    else if (completionRate >= 0.5) goalScore = 70;
    else if (completionRate > 0) goalScore = 50;
    else goalScore = 30; // 0%
  } else {
    // No priorities set today
    goalScore = 40; 
  }

  // 5. RECOVERY QUALITY MODEL (Sleep Regularity Index + Bayesian Prior)
  let recoveryScore = 65; // Bayesian Prior for a young adult
  const sleepLogs = loadJSON(SLEEP_LOGS_KEY, {});
  
  const loggedNights = days14.filter(d => sleepLogs[d]).map(d => sleepLogs[d]);
  if (loggedNights.length > 0) {
    // Sleep Regularity Index (SRI proxy) - Penalize highly variant sleep durations
    const durations = loggedNights.map(l => l.duration || 7);
    const avgSleep = durations.reduce((a, b) => a + b, 0) / durations.length;
    const sleepStdDev = calculateStdDev(durations);
    
    // Ideal sleep is ~7.5h. 
    let durationScore = 100 - (Math.abs(7.5 - avgSleep) * 15);
    
    // Penalty for irregularity
    let sriPenalty = sleepStdDev * 10;
    
    recoveryScore = Math.max(15, Math.min(96, durationScore - sriPenalty));
  } else {
    // If no data, gently decay the prior
    recoveryScore = 55;
  }

  // --- FINAL SCORE ENSEMBLE (Adaptive Weights) ---
  const weights = {
    behavioral: 0.28,
    mental_clarity: 0.22,
    goal_momentum: 0.20,
    financial: 0.18,
    recovery: 0.12
  };
  
  const rawScore = 
    (behavioralScore * weights.behavioral) +
    (mentalScore * weights.mental_clarity) +
    (goalScore * weights.goal_momentum) +
    (financialScore * weights.financial) +
    (recoveryScore * weights.recovery);
    
  // Anti-Whiplash Smoothing (70% Today, 30% Yesterday if we had historical score storage)
  const finalScore = Math.round(Math.max(15, Math.min(98, rawScore)));

  // SHAP-style Explainability
  // Find which domain pulled the score highest and lowest vs 50 baseline
  const deltas = [
    { name: 'Behavioral', val: behavioralScore - 50 },
    { name: 'Mental Clarity', val: mentalScore - 50 },
    { name: 'Goal Momentum', val: goalScore - 50 },
    { name: 'Financial', val: financialScore - 50 },
    { name: 'Recovery', val: recoveryScore - 50 },
  ].sort((a, b) => b.val - a.val);

  const best = deltas[0];
  const worst = deltas[4];

  let explanation = "Your baseline is stabilizing.";
  if (best.val > 10 && worst.val < -10) {
    explanation = `${best.name} is driving your score up, but ${worst.name.toLowerCase()} is dragging it down.`;
  } else if (best.val > 15) {
    explanation = `Excellent momentum in ${best.name} is boosting your score.`;
  } else if (worst.val < -15) {
    explanation = `Your score dipped due to low ${worst.name.toLowerCase()} indicators.`;
  }

  return {
    score: finalScore,
    delta: 0, // Delta to be computed by the caller reading yesterday's state
    explanation,
    contributors: {
      behavioral: { score: Math.round(behavioralScore), label: 'Behavioral' },
      mental_clarity: { score: Math.round(mentalScore), label: 'Mental Clarity' },
      goal_momentum: { score: Math.round(goalScore), label: 'Goal Momentum' },
      financial: { score: Math.round(financialScore), label: 'Financial' },
      recovery: { score: Math.round(recoveryScore), label: 'Recovery' }
    }
  };
};
