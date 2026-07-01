import { apiGet, apiPost } from '../../utils/api';

export const JOURNAL_MODES = [
  { id: 'write', param: 'write', label: 'Today' },
  { id: 'free_write', param: 'free', label: 'Free Write' },
  { id: 'cbt', param: 'cbt', label: 'CBT Record' },
  { id: 'www', param: 'www', label: 'What Went Well' },
  { id: 'morning', param: 'morning', label: 'Morning Pages' },
  { id: 'weekly', param: 'weekly', label: 'Weekly Review' },
];

export const MODE_BY_PARAM = Object.fromEntries(JOURNAL_MODES.map((m) => [m.param, m.id]));
export const MODE_LABELS = Object.fromEntries(JOURNAL_MODES.map((m) => [m.id, m.label]));

const SOCRATIC_PROMPTS = [
  'What assumption are you making right now that might not be true?',
  'If a friend wrote this, what would you ask them to clarify?',
  'What would change if the opposite of your first thought were true?',
];

export function getSocraticPrompt() {
  return SOCRATIC_PROMPTS[Math.floor(Math.random() * SOCRATIC_PROMPTS.length)];
}

export function parseEntry(raw) {
  if (!raw) return { mode: 'legacy', body: '' };
  try {
    const parsed = JSON.parse(raw);
    if (parsed && parsed.v === 2 && parsed.mode) return parsed;
  } catch {
    // legacy plain text
  }
  if (raw.includes('#relapse-reflection')) return { mode: 'legacy', body: raw, tag: 'relapse' };
  if (raw.includes('#urge-surfed')) return { mode: 'legacy', body: raw, tag: 'urge' };
  return { mode: 'legacy', body: raw };
}

export function serializeEntry(mode, payload) {
  return JSON.stringify({ v: 2, mode, ...payload });
}

export function getEntryPreview(raw, max = 80) {
  const parsed = parseEntry(raw);
  let text = '';
  if (parsed.mode === 'cbt' && parsed.fields) {
    text = parsed.fields.automaticThought || parsed.fields.situation || '';
  } else if (parsed.mode === 'www' && parsed.wins) {
    text = parsed.wins.find((w) => w.text)?.text || '';
  } else if (parsed.mode === 'weekly') {
    text = parsed.body || parsed.summary || '';
  } else if (parsed.mode === 'morning' || parsed.mode === 'write' || parsed.mode === 'free_write') {
    text = parsed.body || '';
  } else if (parsed.body) {
    text = parsed.body.replace(/^#+\s*/gm, '').trim();
  }
  const flat = text.replace(/\s+/g, ' ').trim();
  return flat.length > max ? `${flat.slice(0, max)}…` : flat || 'Empty entry';
}

export function findEntryForDate(entries, date, mode) {
  return (entries || []).find((entry) => {
    if (entry.date !== date) return false;
    const parsed = parseEntry(entry.encrypted_content);
    return parsed.mode === mode;
  }) || null;
}

export function getPlainTextFromPayload(mode, payload = {}) {
  if (mode === 'cbt') {
    const fields = payload.fields || {};
    return [
      fields.situation && `Situation: ${fields.situation}`,
      fields.automaticThought && `Thought: ${fields.automaticThought}`,
      fields.emotion && `Emotion: ${fields.emotion}`,
      fields.balancedThought && `Balanced thought: ${fields.balancedThought}`,
    ].filter(Boolean).join('\n');
  }
  if (mode === 'www') {
    return (payload.wins || [])
      .filter((win) => win?.text?.trim())
      .map((win, idx) => `${idx + 1}. ${win.text.trim()}${win.why?.trim() ? ` — ${win.why.trim()}` : ''}`)
      .join('\n');
  }
  return String(payload.body || '').trim();
}

function getSearchText(parsed) {
  if (parsed.mode === 'cbt') {
    return Object.values(parsed.fields || {}).join(' ');
  }
  if (parsed.mode === 'www') {
    return (parsed.wins || []).map((w) => `${w.text || ''} ${w.why || ''}`).join(' ');
  }
  return parsed.body || '';
}

export function entryMatchesSearch(entry, query) {
  if (!query?.trim()) return true;
  const q = query.trim().toLowerCase();
  const parsed = parseEntry(entry.encrypted_content);
  const modeLabel = (MODE_LABELS[parsed.mode] || 'Journal').toLowerCase();
  const preview = getEntryPreview(entry.encrypted_content, 240).toLowerCase();
  const fullText = getSearchText(parsed).toLowerCase();
  return modeLabel.includes(q) || preview.includes(q) || fullText.includes(q);
}

export function mapDailyLogRowToPost(row = {}) {
  return {
    date: row.date || new Date().toISOString().split('T')[0],
    sleepStart: row.sleep_start ?? null,
    sleepEnd: row.sleep_end ?? null,
    sleepHours: row.sleep_hours ?? null,
    rcCount: row.rc_count ?? 0,
    gymDone: row.gym_done ?? false,
    gymDuration: row.gym_duration ?? null,
    breakfastDone: row.breakfast_done ?? false,
    steps: row.steps ?? 0,
    waterBottles: row.water_bottles ?? 0,
    learningDone: row.learning_done ?? false,
    learningTopic: row.learning_topic ?? null,
    journalEntry: row.journal_entry ?? '',
    mood: row.mood ?? null,
    energyLevel: row.energy_level ?? null,
  };
}

export async function syncJournalToDailyLog({
  userId,
  date,
  journalEntry,
  mood,
}) {
  if (!userId || !date) return null;
  let current = null;
  try {
    current = await apiGet(`/daily-logs/${userId}/${date}`);
  } catch {
    current = null;
  }
  const base = mapDailyLogRowToPost(current || {});
  const payload = {
    ...base,
    date,
    journalEntry: journalEntry ?? base.journalEntry,
    mood: mood ?? base.mood,
  };
  return apiPost('/daily-logs', payload);
}

export function calcJournalStreak(entries) {
  if (!entries?.length) return 0;
  const dates = [...new Set(entries.map((e) => e.date))].sort((a, b) => b.localeCompare(a));
  const today = new Date().toISOString().split('T')[0];
  let streak = 0;
  let cursor = today;
  for (const d of dates) {
    if (d === cursor) {
      streak += 1;
      const prev = new Date(cursor);
      prev.setDate(prev.getDate() - 1);
      cursor = prev.toISOString().split('T')[0];
    } else if (streak === 0 && d === dates[0]) {
      // allow streak starting yesterday if no entry today
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      if (d === yesterday.toISOString().split('T')[0]) {
        streak = 1;
        const prev = new Date(d);
        prev.setDate(prev.getDate() - 1);
        cursor = prev.toISOString().split('T')[0];
      } else break;
    } else break;
  }
  return streak;
}

export function isMorningWindow() {
  return getMorningWindowStatus() === 'ideal';
}

export function isWeeklyWindow() {
  return getWeeklyWindowStatus() === 'ideal';
}

export function getMorningWindowStatus() {
  const h = new Date().getHours();
  return h >= 6 && h < 9 ? 'ideal' : 'nudge';
}

export function getWeeklyWindowStatus() {
  const now = new Date();
  return now.getDay() === 0 && now.getHours() >= 17 ? 'ideal' : 'nudge';
}

export function exportEntriesPlainText(entries) {
  return entries
    .map((e) => {
      const parsed = parseEntry(e.encrypted_content);
      const label = MODE_LABELS[parsed.mode] || 'Journal';
      const body = parsed.body || JSON.stringify(parsed.fields || parsed.wins || parsed, null, 2);
      return `--- ${e.date} · ${label} ---\n${body}\n`;
    })
    .join('\n');
}

/** Map AI emotion tags to daily_logs mood scale (1–10). */
export function emotionTagToMood(tag) {
  const t = String(tag || '').toLowerCase();
  if (/joy|happy|grateful|hope|calm|content|excited|proud/.test(t)) return 8;
  if (/neutral|reflect|curious/.test(t)) return 5;
  if (/anxious|stressed|worry|fear|overwhelm/.test(t)) return 3;
  if (/sad|angry|guilt|shame|frustrat|lonely/.test(t)) return 2;
  return 5;
}
