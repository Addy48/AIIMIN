/**
 * aiService.js
 *
 * Unified AI service for AIIMIN.
 * Routes tasks intelligently across providers with local caching.
 * Prioritizes Groq (completely free, Llama 3.3 70B) to ensure zero cost.
 */

import { apiPost } from '../utils/api';

function formatINR(amount) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(Number(amount) || 0);
}

/** Replace accidental USD symbols from model output. */
function normalizeINRCurrency(text) {
  return String(text || '').replace(/\$(\d[\d,]*(?:\.\d+)?)/g, '₹$1');
}

// ─── Provider Configs ─────────────────────────────────────────────────────────

const PROVIDERS = {
  groq: {
    name: 'Groq',
    model: 'llama-3.3-70b-versatile',
    contextWindow: 131072,
    dailyLimit: 14400,
    handles: ['emotion_tag', 'habit_coach', 'short_summary', 'sport_preview',
               'sport_summary', 'subscription_audit', 'spending_alert',
               'journal_prompt', 'note_connection', 'weekly_report',
               'safe_to_spend', 'pop_quiz', 'goal_decompose', 'cbt_analysis',
               'finance_whatif', 'cognitive_distortion', 'pre_mortem',
               'sip_planner', 'vocal_scorecard', 'knowledge_graph',
               'weekly_insight', 'devils_advocate', 'decision_analysis'],
  },

  kimi: {
    name: 'Kimi K2',
    model: 'moonshotai/kimi-k2.6',
    contextWindow: 131072,
    dailyLimit: null,
    handles: ['goal_decompose', 'cbt_analysis', 'finance_whatif',
               'cognitive_distortion', 'pre_mortem', 'sip_planner',
               'vocal_scorecard', 'knowledge_graph', 'weekly_insight',
               'devils_advocate', 'decision_analysis'],
  },

  gemini_lite: {
    name: 'Gemini Lite',
    model: 'gemini-2.0-flash',
    contextWindow: 1000000,
    dailyLimit: null,
    handles: ['arc_sharpen', 'journal_prompt', 'habit_coach', 'emotion_tag', 'short_summary'],
    useServerLite: true,
  },

  gemini: {
    name: 'Gemini Flash',
    model: 'gemini-2.0-flash',
    contextWindow: 1000000,
    dailyLimit: null,
    handles: ['structured_output', 'multimodal', 'long_document'],
    useServerGenerate: true,
  },

  xai: {
    name: 'xAI Grok',
    model: 'grok-3',
    contextWindow: 131072,
    dailyLimit: null,
    handles: [],
    disabled: true,
  },
};

// ─── Task Type → Provider Routing (Groq prioritized first for all) ────────────

const TASK_ROUTING = {
  emotion_tag:          ['gemini_lite', 'groq', 'kimi'],
  habit_coach:          ['gemini_lite', 'groq', 'kimi'],
  short_summary:        ['gemini_lite', 'groq', 'kimi'],
  sport_preview:        ['groq', 'kimi'],
  sport_summary:        ['groq', 'kimi'],
  subscription_audit:   ['groq', 'kimi'],
  spending_alert:       ['groq', 'kimi'],
  journal_prompt:       ['gemini_lite', 'groq', 'kimi'],
  note_connection:      ['groq', 'kimi'],
  weekly_report:        ['groq', 'kimi'],
  safe_to_spend:        ['groq', 'kimi'],
  pop_quiz:             ['groq', 'kimi'],

  goal_decompose:       ['groq', 'kimi'],
  cbt_analysis:         ['groq', 'kimi'],
  finance_whatif:       ['groq', 'kimi'],
  cognitive_distortion: ['groq', 'kimi'],
  pre_mortem:           ['groq', 'kimi'],
  sip_planner:          ['groq', 'kimi'],
  vocal_scorecard:      ['groq', 'kimi'],
  knowledge_graph:      ['groq', 'kimi'],
  weekly_insight:       ['groq', 'kimi'],
  devils_advocate:      ['groq', 'kimi'],
  decision_analysis:    ['groq', 'kimi'],
};

// ─── In-Memory Rate Limit Tracker ────────────────────────────────────────────

const _tracker = {
  groq: { calls: 0, resetAt: Date.now() + 86400000 },
};

function isRateLimited(name) {
  const t = _tracker[name];
  if (!t) return false;
  const p = PROVIDERS[name];
  if (!p?.dailyLimit) return false;
  if (Date.now() > t.resetAt) {
    t.calls = 0;
    t.resetAt = Date.now() + 86400000;
  }
  return t.calls >= p.dailyLimit * 0.9;
}

function trackCall(name) {
  if (_tracker[name]) _tracker[name].calls++;
}

function reportServerUsage(providerName, endpoint) {
  const providerMap = { groq: 'groq', kimi: 'moonshot', gemini: 'gemini' };
  const provider = providerMap[providerName];
  if (!provider) return;
  apiPost('/intelligence/usage-report', { provider, endpoint, units: 1 }).catch(() => {});
}

// ─── Caching Helpers (24-Hour TTL) ──────────────────────────────────────────

function hashCode(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash |= 0;
  }
  return Math.abs(hash).toString(36);
}

function getCacheKey(taskType, messages, options) {
  const serialized = JSON.stringify({ taskType, messages, options });
  return `aiimin_ai_cache_${hashCode(serialized)}`;
}

function getCachedResponse(key) {
  try {
    const cached = localStorage.getItem(key);
    if (!cached) return null;
    const { val, expiry } = JSON.parse(cached);
    if (Date.now() > expiry) {
      localStorage.removeItem(key);
      return null;
    }
    return val;
  } catch (e) {
    return null;
  }
}

function cacheResponse(key, val) {
  try {
    const expiry = Date.now() + 24 * 60 * 60 * 1000; // 24 hours
    localStorage.setItem(key, JSON.stringify({ val, expiry }));
  } catch (e) {
    console.warn('[aiService] Cache write failed:', e);
  }
}

// ─── Core API Call ────────────────────────────────────────────────────────────

async function callProvider(providerName, messages, options = {}) {
  const provider = PROVIDERS[providerName];
  if (!provider || provider.disabled) throw new Error(`${providerName} disabled`);

  const { maxTokens = 1024, temperature = 0.7, systemPrompt = null } = options;

  const fullMessages = systemPrompt
    ? [{ role: 'system', content: systemPrompt }, ...messages]
    : messages;

  if (provider.useServerLite) {
    const userContent = fullMessages.filter((m) => m.role === 'user').map((m) => m.content).join('\n');
    const data = await apiPost('/intelligence/lite', {
      task: options.liteTask || 'short_summary',
      text: userContent,
      context: userContent,
    });
    trackCall(providerName);
    reportServerUsage('gemini', `/intelligence/lite:${options.liteTask || 'short_summary'}`);
    return data.text || '';
  }

  // All AI keys live on the server — never in the client bundle.
  if (provider.useServerGenerate) {
    const data = await apiPost('/intelligence/generate', {
      messages: fullMessages,
      systemPrompt,
      maxTokens,
      temperature,
    });
    trackCall(providerName);
    reportServerUsage(providerName, '/intelligence/generate');
    return data.text || '';
  }

  const data = await apiPost('/intelligence/chat', {
    provider: providerName === 'kimi' ? 'moonshot' : providerName,
    messages: fullMessages,
    systemPrompt,
    maxTokens,
    temperature,
  });

  trackCall(providerName);
  reportServerUsage(providerName, '/intelligence/chat');
  return data.text || '';
}

// ─── Smart Router ─────────────────────────────────────────────────────────────

export async function askAI(taskType, messages, options = {}) {
  const bypassCache = !!options.bypassCache;
  const cacheKey = getCacheKey(taskType, messages, options);

  if (!bypassCache) {
    const cached = getCachedResponse(cacheKey);
    if (cached) {
      console.log(`[aiService] Task "${taskType}" → served from cache`);
      return cached;
    }
  }

  const chain = TASK_ROUTING[taskType] || ['groq', 'kimi'];

  for (const name of chain) {
    if (PROVIDERS[name]?.disabled) continue;
    if (name === 'gemini_lite' && !options.liteTask && !TASK_ROUTING[taskType]?.includes('gemini_lite')) continue;
    if (isRateLimited(name)) {
      console.warn(`[aiService] ${name} near rate limit — trying next provider.`);
      continue;
    }
    try {
      const liteTask = options.liteTask || (name === 'gemini_lite' ? taskType : undefined);
      const result = await callProvider(name, messages, { ...options, liteTask: liteTask || options.liteTask });
      console.log(`[aiService] Task "${taskType}" → served by ${name}`);
      if (!bypassCache) {
        cacheResponse(cacheKey, result);
      }
      return result;
    } catch (err) {
      console.warn(`[aiService] ${name} failed for "${taskType}": ${err.message}`);
    }
  }
  throw new Error(`[aiService] All providers exhausted for task: ${taskType}`);
}

// ─── Pre-built Task Helpers ───────────────────────────────────────────────────

/** Analyze journal entry: emotional tone, cognitive distortions, feedback. */
export async function analyzeJournalEntry(text, mood = 3, energy = 3) {
  try {
    const raw = await askAI('cbt_analysis', [{
      role: 'user',
      content: `Analyze this journal entry (reported mood: ${mood}/5, energy: ${energy}/5).
Return ONLY valid JSON (no markdown code blocks or additional text):
{
  "sentiment": "focused|positive|warning|reflective",
  "feedback": "2 sentences of deep psychological feedback highlighting strengths or potential burnout signs.",
  "habitsAdvice": "1 sentence of practical action to improve their cognitive flow tomorrow.",
  "mindsetScore": 75,
  "emotionalTone": "Anxious|Hopeful|Frustrated|Grateful|Determined|Sad|Neutral",
  "cognitiveDistortion": "None|Catastrophizing|BlackAndWhite|MindReading|Overgeneralizing|Personalizing",
  "theme": "2-3 word theme"
}
Entry: ${text.slice(0, 3000)}`
    }], { maxTokens: 400, temperature: 0.3 });
    const match = raw.match(/\{[\s\S]*?\}/);
    if (!match) throw new Error("No JSON found");
    return JSON.parse(match[0]);
  } catch (err) {
    console.error('[aiService] analyzeJournalEntry failed:', err);
    return null;
  }
}

/** Get exactly 3 Socratic reflection prompts. */
export async function getJournalPrompts(textSnippet = '') {
  try {
    const raw = await askAI('journal_prompt', [{
      role: 'user',
      content: `Generate exactly 3 deep, personalized, open-ended reflection questions that will help the user think deeper.
${textSnippet ? `Journal context: "${textSnippet.slice(0, 500)}"` : 'Make them universal.'}
Return ONLY a valid JSON array of strings (no markdown code blocks, no other text):
["question 1", "question 2", "question 3"]`
    }], { maxTokens: 250, temperature: 0.8, liteTask: 'journal_prompt' });
    const match = raw.match(/\[[\s\S]*?\]/);
    if (!match) throw new Error("No JSON array found");
    return JSON.parse(match[0]);
  } catch (err) {
    console.error('[aiService] getJournalPrompts failed:', err);
    return [
      "What was the most challenging event today, and how did you handle it?",
      "How can you bring the positive energy of today's wins into tomorrow?",
      "What is one thing you can change tomorrow to focus more on your main priorities?"
    ];
  }
}

/** Break a goal into milestone steps. */
export async function decomposeGoal(goalText, months = 6) {
  try {
    const raw = await askAI('goal_decompose', [{
      role: 'user',
      content: `Break down this goal into 4-6 milestones over ${months} months.
Goal: "${goalText}"
Return ONLY a JSON array (no markdown code blocks, no other text):
[{"milestone":"string","targetWeek":4,"keyAction":"string","successCriteria":"string"}]`
    }], { maxTokens: 900, temperature: 0.4 });
    const match = raw.match(/\[[\s\S]*?\]/);
    if (!match) throw new Error("No JSON array found");
    return JSON.parse(match[0]);
  } catch (err) {
    console.error('[aiService] decomposeGoal failed:', err);
    return [];
  }
}

/** Habit coaching insight — Lally et al. (2010): automaticity averages ~66 days, not 21. */
export async function getHabitCoaching(habitName, { thisWeek = 0, bestDays = [], currentStreak = 0, aiTone = 'motivating' }) {
  const toneGuide = {
    motivating: 'Warm, encouraging, energizing.',
    direct: 'Blunt, no fluff, accountability-focused.',
    analytical: 'Data-driven, cite patterns from their stats.',
    calm: 'Gentle, mindful, low pressure.',
  };
  try {
    return await askAI('habit_coach', [{
      role: 'user',
      content: `Provide a 2-sentence coaching insight for habit: "${habitName}".
Tone: ${aiTone}. Style: ${toneGuide[aiTone] || toneGuide.motivating}
Completion this week: ${thisWeek}/7. Best days: ${bestDays.join(', ') || 'none yet'}. Current streak: ${currentStreak} days.
Science: cite Lally et al. (2010) — habit automaticity averages ~66 days, never say "21 days to form a habit".
Be specific, motivating, and highly actionable.`
    }], { maxTokens: 150, temperature: 0.7, liteTask: 'habit_coach' });
  } catch (err) {
    return "Stay consistent — research shows automaticity builds over ~66 days on average, not 21. Your next rep matters most.";
  }
}

/** Finance "What If" simulation. */
export async function financeWhatIf(scenario, { monthlyIncome = 0, currentSavings = 0, expenses = {} }) {
  try {
    return await askAI('finance_whatif', [{
      role: 'user',
      content: `Indian user finance what-if simulation (max 80 words, use ₹): "${scenario}". Monthly income: ₹${monthlyIncome}. Current savings: ₹${currentSavings}. Top expenses: ${JSON.stringify(expenses)}. State: exact savings impact, 1 vivid alternative use, and 1 core recommendation.`
    }], { maxTokens: 250, temperature: 0.6 });
  } catch (err) {
    return "Simulation unavailable. Consistently save at least 30% of your income to secure options.";
  }
}

export async function getSportsPreview(matchContext = {}) {
  const {
    team1 = 'TBD',
    team2 = 'TBD',
    sport = 'Sports',
    competition = 'Match',
    isLive = false,
    isFinished = false,
    homeScore,
    awayScore,
    venue = '',
    statusDetail = '',
    kickoff = '',
    homeRecords = [],
    awayRecords = [],
    notes = [],
    headlines = [],
    fallback = '',
  } = matchContext;

  const facts = [
    `Teams: ${team1} vs ${team2}`,
    `Competition: ${competition} (${sport})`,
    isLive
      ? `Status: LIVE match in progress. Score: ${team1} ${homeScore ?? '0'} - ${awayScore ?? '0'} ${team2}. Detail: ${statusDetail || 'In Progress'}.`
      : isFinished
        ? `Status: FINISHED match. Score: ${team1} ${homeScore ?? '0'} - ${awayScore ?? '0'} ${team2}. Detail: ${statusDetail || 'Match Completed'}.`
        : `Status: UPCOMING match. Kickoff: ${kickoff || 'TBD'}.`,
    venue ? `Venue: ${venue}` : null,
    homeRecords.length ? `${team1} form: ${homeRecords.join(', ')}` : null,
    awayRecords.length ? `${team2} form: ${awayRecords.join(', ')}` : null,
    notes.length ? `Buzz / notes: ${notes.join(' | ')}` : null,
    headlines.length ? `Latest headlines: ${headlines.join(' | ')}` : null,
  ].filter(Boolean).join('\n');

  let promptContent = '';
  if (isFinished) {
    promptContent = `Generate an engaging post-match summary based on these facts:\n\n${facts}\n\nWrite exactly 2 sentences. Sentence 1 should state the final score, the winner, and the match state. Sentence 2 should explain what the result means right now using only the supplied buzz, notes, or form signals. Do not invent any players or details not present in the facts.`;
  } else if (isLive) {
    promptContent = `Generate a dynamic live match update based on these facts:\n\n${facts}\n\nWrite exactly 2 sentences. Sentence 1 should state the current live score and match status. Sentence 2 should describe the immediate stakes, current target, momentum, or biggest talking point from the supplied notes. Do not invent any details not present in the facts.`;
  } else {
    promptContent = `Generate an exciting pre-match preview and buzz based on these facts:\n\n${facts}\n\nWrite exactly 2 sentences. Sentence 1 should state the upcoming match, kickoff time, and venue. Sentence 2 should focus on the key matchup narrative, recent form, and any supplied buzz or notes worth watching. Do not invent any details not present in the facts.`;
  }

  try {
    return await askAI(isFinished ? 'sport_summary' : 'sport_preview', [{
      role: 'user',
      content: promptContent,
    }], {
      maxTokens: 160,
      temperature: 0.6,
      systemPrompt: 'You are a professional sports editor. Write exactly 2 sentences that are highly engaging, factual, and based strictly on the provided match state.',
    });
  } catch (err) {
    return fallback || 'Match brief unavailable — expand again after sync.';
  }
}

/** Monday morning weekly insight report. */
export async function generateWeeklyInsight({ habits = {}, journal = {}, finance = {}, lab = {}, discipline = {} }) {
  const financeLine = finance.period
    ? `Income ${finance.income || formatINR(0)}, expenses ${finance.expenses || formatINR(0)}, ${finance.count || 0} transactions (${finance.period})`
    : `Income ${formatINR(finance.income)}, expenses ${formatINR(finance.expenses)}, ${finance.count || 0} transactions`;

  try {
    const raw = await askAI('weekly_insight', [{
      role: 'user',
      content: `Write ONLY the user-facing report. Never repeat these instructions.

Data:
- Habits: ${JSON.stringify(habits)}
- Mood trend: ${journal.moodTrend || 'N/A'}
- Finance: ${financeLine}
- Lab sessions: ${lab.sessions || 0}
- Discipline streak: ${discipline.streak || 0} days

Output format (strict):
- bullet one
- bullet two
- bullet three
- bullet four
Next move: one short concrete action

Rules: speak to "you"; ₹ only; no $; no apology; no invented causes; ≤110 words total.`,
    }], {
      maxTokens: 450,
      temperature: 0.55,
      systemPrompt: 'You return only the weekly report body for an Indian Life OS user. Never echo instructions, constraints, or meta commentary. Currency ₹ only.',
    });
    const text = normalizeINRCurrency(raw || '');
    // Bail if model echoed the prompt — caller builds local fallback
    if (/under\s+\d+\s+words|passive voice|dollar signs|categories to reference|write\s+\d+\s+short|must\s+not\s+use/i.test(text)) {
      return '';
    }
    return text;
  } catch (err) {
    return '';
  }
}

/** Check which providers are active and their status. */
export async function getAIStatus() {
  return Object.fromEntries(
    Object.entries(PROVIDERS).map(([name, p]) => [
      name,
      p.disabled
        ? { available: false, reason: 'Disabled — needs credits' }
        : !p.apiKey
          ? { available: false, reason: 'No API key configured' }
          : {
               available: !isRateLimited(name),
               model: p.model,
               rateLimited: isRateLimited(name),
               callsToday: _tracker[name]?.calls ?? 'unlimited',
             }
    ])
  );
}

export { PROVIDERS, TASK_ROUTING };
export default askAI;
