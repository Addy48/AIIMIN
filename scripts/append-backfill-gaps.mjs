#!/usr/bin/env node
/**
 * Append-only gap backfill for the allowlisted AADI0837 demo account.
 * Never deletes or updates existing rows during a write. Every row is tagged
 * with the existing schema-approved simulated/seed source values and a batch
 * marker is embedded in journals/notes. Rollback requires an explicit gap-date
 * list from the write receipt, so it refuses broad deletion.
 *
 * Dry-run:
 *   SEED_USERNAME=AADI0837 SEED_DAYS=120 SEED_END=2026-08-21 node scripts/append-backfill-gaps.mjs
 * Write after explicit confirmation:
 *   ... node scripts/append-backfill-gaps.mjs --confirm
 * Roll back only the exact write receipt dates:
 *   SEED_GAP_DATES=... node scripts/append-backfill-gaps.mjs --wipe-backfill --confirm
 */
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { resolve } from 'node:path';

dotenv.config({ path: process.env.DOTENV_CONFIG_PATH || resolve(process.cwd(), '.env') });
try { dotenv.config({ path: resolve(process.cwd(), '.env.local'), override: true }); } catch { /* optional */ }

const CONFIRM = process.argv.includes('--confirm');
const WIPE_BACKFILL = process.argv.includes('--wipe-backfill');
const USERNAME = String(process.env.SEED_USERNAME || 'AADI0837').trim().toUpperCase();
const ALLOWLIST = new Set(String(process.env.SEED_ALLOWLIST || 'AADI0837').split(',').map((value) => value.trim().toUpperCase()).filter(Boolean));
const DAYS = Math.max(90, Math.min(120, Number(process.env.SEED_DAYS || 120)));
const END = parseDate(process.env.SEED_END || '2026-08-21');
const START = addDays(END, -(DAYS - 1));
const SOURCE = 'admin_simulated';
const MONEY_SOURCE = 'seed';
const JOURNAL_MARKER = `backfill-${fmtDate(END)}`;
const ROLLBACK_DATES = String(process.env.SEED_GAP_DATES || '').split(',').map((value) => value.trim()).filter(Boolean);
const EXPECTED_ROLLBACK_COUNTS = { daily_logs: 33, sessions: 62, journal_entries: 16, money_transactions: 19, calendar_events: 14, wins: 29, daily_commitments: 33, tasks: 8, notes: 7 };
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false, autoRefreshToken: false } });

function parseDate(value) { const [year, month, day] = value.split('-').map(Number); return new Date(Date.UTC(year, month - 1, day)); }
function fmtDate(date) { return date.toISOString().slice(0, 10); }
function addDays(date, days) { const next = new Date(date); next.setUTCDate(next.getUTCDate() + days); return next; }
function clamp(value, min, max) { return Math.max(min, Math.min(max, value)); }
function atUTC(date, hour, minute = 0) { return `${date}T${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}:00.000Z`; }
function hash(value) { let result = 2166136261; for (const char of value) result = Math.imul(result ^ char.charCodeAt(0), 16777619); return (result >>> 0) / 4294967295; }
function noise(key, magnitude = 1) { return (hash(key) - 0.5) * 2 * magnitude; }
function pick(key, values) { return values[Math.floor(hash(key) * values.length) % values.length]; }

if (!ALLOWLIST.has(USERNAME)) throw new Error(`Refusing backfill for non-allowlisted OS-ID: ${USERNAME}`);
if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) throw new Error('Need SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY');
const { data: user, error: userError } = await supabase.from('users').select('id').eq('username', USERNAME).maybeSingle();
if (userError) throw userError;
if (!user?.id) throw new Error(`No user ${USERNAME}`);
const uid = user.id;

const { data: existingDaily, error: dailyError } = await supabase.from('daily_logs').select('date').eq('user_id', uid).gte('date', fmtDate(START)).lte('date', fmtDate(END));
if (dailyError) throw dailyError;
const existingDates = new Set((existingDaily || []).map((row) => String(row.date).slice(0, 10)));
const gapDates = [];
for (let cursor = new Date(START); cursor <= END; cursor = addDays(cursor, 1)) {
  const date = fmtDate(cursor);
  if (!existingDates.has(date)) gapDates.push(date);
}

const { data: accounts } = await supabase.from('accounts').select('id').eq('user_id', uid).limit(20);
const { data: categories } = await supabase.from('money_categories').select('id,name,type').eq('user_id', uid).limit(30);
const accountIds = (accounts || []).map((row) => row.id);
const expenseCategories = (categories || []).filter((row) => row.type !== 'income');
const incomeCategories = (categories || []).filter((row) => row.type === 'income');

const dailyLogs = [];
const sessions = [];
const journals = [];
const money = [];
const calendar = [];
const wins = [];
const commitments = [];
const tasks = [];
const notes = [];

for (let index = 0; index < gapDates.length; index += 1) {
  const date = gapDates[index];
  const weekend = [0, 6].includes(new Date(`${date}T00:00:00Z`).getUTCDay());
  const wave = Math.sin((index / 6.5) + 0.6) + 0.35 * Math.sin(index / 2.7);
  const sleep = clamp(Number((6.9 + (weekend ? 0.7 : 0) + wave * 0.45 + noise(`${date}:sleep`, 0.7)).toFixed(2)), 4.5, 9.5);
  const mood = clamp(Math.round(3.1 + wave * 0.6 + (sleep >= 7.2 ? 0.5 : -0.45) + noise(`${date}:mood`, 0.9)), 1, 5);
  const energy = clamp(Math.round(3.2 + (sleep - 6.5) * 0.55 + mood * 0.15 + noise(`${date}:energy`, 0.65)), 1, 5);
  const brainFog = clamp(Math.round(2.2 - (energy - 3) * 0.55 + noise(`${date}:fog`, 0.65)), 1, 3);
  const gymDone = hash(`${date}:gym`) < (weekend ? 0.3 : 0.52) && energy >= 3;
  const learningDone = hash(`${date}:learning`) < (weekend ? 0.28 : 0.62) && energy >= 3;
  const breakfastDone = hash(`${date}:breakfast`) < (weekend ? 0.62 : 0.78);
  const steps = Math.round(clamp(5700 + (gymDone ? 2800 : 0) + (weekend ? 1100 : 0) + noise(`${date}:steps`, 2200), 1200, 18000));
  const water = clamp(Math.round(6.5 + noise(`${date}:water`, 2.2) + (gymDone ? 1 : 0)), 1, 12);
  const focusCount = energy >= 4 ? 2 + Math.floor(hash(`${date}:focus-count`) * 2) : hash(`${date}:focus-count`) < 0.5 ? 1 : 0;
  const focusMinutes = Array.from({ length: focusCount }, (_, n) => Math.round(clamp(35 + hash(`${date}:focus:${n}`) * 55 + (energy >= 4 ? 15 : 0), 20, 110)));
  const focusScore = Math.round(clamp(focusMinutes.reduce((sum, value) => sum + value, 0) / 5 + mood * 4 + (gymDone ? 8 : 0), 0, 100));
  const lateNight = sleep < 6.1;
  const headache = brainFog >= 3 && hash(`${date}:headache`) < 0.2;
  const journalEntry = hash(`${date}:journal`) < 0.55 ? pick(`${date}:diary`, ['Protected a focused morning.', 'Energy dipped; kept the day honest.', 'Movement helped the evening.', 'Family time anchored the day.', 'A messy day, but not a lost day.']) : null;

  dailyLogs.push({
    user_id: uid, date, sleep_start: `${lateNight ? '01' : '23'}:${String(Math.floor(hash(`${date}:sleep-start`) * 59)).padStart(2, '0')}:00`,
    sleep_end: `${String(6 + Math.floor(hash(`${date}:sleep-end`) * 3)).padStart(2, '0')}:00:00`, sleep_hours: sleep,
    gym_done: gymDone, gym_duration: gymDone ? Math.round(40 + hash(`${date}:gym-duration`) * 40) : null,
    breakfast_done: breakfastDone, steps, protein_grams: Math.round(65 + hash(`${date}:protein`) * 85),
    learning_done: learningDone, learning_topic: learningDone ? pick(`${date}:topic`, ['System design', 'DSA graphs', 'React performance', 'Writing', 'Product strategy']) : null,
    journal_entry: journalEntry, mood, energy_level: energy, brain_fog: brainFog, headache, water_bottles: water, focus_score: focusScore,
    habits_completed: clamp(Math.round(2.5 + energy * 0.75 + noise(`${date}:habits`, 1.8)), 0, 8), routines_completed: 0, rc_count: 0, rc_entries: [],
    masturbation_count: 0, masturbation_times: [], source_type: SOURCE, created_at: atUTC(date, 21, 30),
  });

  for (let n = 0; n < focusMinutes.length; n += 1) {
    const started = atUTC(date, 9 + n * 2, Math.floor(hash(`${date}:session:${n}`) * 45));
    sessions.push({ user_id: uid, started_at: started, ended_at: new Date(new Date(started).getTime() + focusMinutes[n] * 60000).toISOString(), duration_minutes: focusMinutes[n], session_type: 'focus', mood_before: mood, mood_after: clamp(mood + (focusMinutes[n] >= 55 ? 1 : 0), 1, 5), energy_level: energy, distraction_src: energy <= 2 ? 'phone' : null, playlist_used: hash(`${date}:playlist`) < 0.5 ? 'Deep Work' : null, source_type: SOURCE, created_at: started });
  }
  if (journalEntry) journals.push({ user_id: uid, date, encrypted_content: JSON.stringify({ v: 2, mode: weekend ? 'weekly' : 'write', seed: JOURNAL_MARKER, body: journalEntry, mood, energy_level: energy }), mood, sleep_hours: sleep, energy_level: energy, created_at: atUTC(date, 21, 45) });

  if (accountIds.length && expenseCategories.length && hash(`${date}:expense`) < (weekend ? 0.78 : 0.52)) {
    const category = pick(`${date}:expense-category`, expenseCategories);
    const amount = Math.round(150 + hash(`${date}:expense-amount`) * (weekend ? 1700 : 950));
    money.push({ user_id: uid, date, category: category.name, category_id: category.id, amount: -amount, source: MONEY_SOURCE, description: category.name, currency: 'INR', account_id: pick(`${date}:account`, accountIds), type: 'expense', tags: [], emotion_tag: mood <= 2 ? 'stressed' : weekend ? 'social' : 'neutral', time_of_day: pick(`${date}:expense-time`, ['afternoon', 'evening']), created_at: atUTC(date, 18) });
  }
  if (accountIds.length && incomeCategories.length && index % 14 === 0) {
    const category = incomeCategories[0];
    money.push({ user_id: uid, date, category: category.name, category_id: category.id, amount: 18000 + Math.round(hash(`${date}:income`) * 22000), source: MONEY_SOURCE, description: 'Freelance / stipend', currency: 'INR', account_id: accountIds[0], type: 'income', tags: [], emotion_tag: 'positive', time_of_day: 'morning', created_at: atUTC(date, 10) });
  }
  if (hash(`${date}:calendar`) < 0.48) {
    const start = atUTC(date, weekend ? 11 : 16);
    calendar.push({ user_id: uid, title: pick(`${date}:calendar-title`, ['Deep work', 'Gym', 'Family dinner', 'Study block', 'Interview prep']), start_time: start, end_time: new Date(new Date(start).getTime() + 60 * 60000).toISOString(), completed: hash(`${date}:calendar-done`) < 0.6, all_day: false, event_type: 'event', source_type: SOURCE, description: '', location: pick(`${date}:location`, ['Home', 'Gym', 'Cafe', 'Online', null]), system_type: pick(`${date}:system`, ['work', 'health', 'social', 'reflection']), tags: [], color: '#ff6b35', reminder_minutes: 30, timezone: 'Asia/Kolkata' });
  }
  if (gymDone || focusMinutes.some((value) => value >= 60)) wins.push({ user_id: uid, date, description: gymDone ? 'Hit gym plan' : 'Protected a deep focus block', source_type: SOURCE, created_at: atUTC(date, 20) });
  const metCount = (gymDone ? 1 : 0) + (learningDone ? 1 : 0) + (sleep >= 7 ? 1 : 0) + (dailyLogs.at(-1).habits_completed >= 4 ? 1 : 0);
  commitments.push({ user_id: uid, date, targets: [{ id: 'gym', label: 'Gym', met: gymDone }, { id: 'learning', label: 'Learning', met: learningDone }, { id: 'sleep', label: 'Sleep 7h+', met: sleep >= 7 }, { id: 'habits', label: 'Core habits', met: dailyLogs.at(-1).habits_completed >= 4 }], met_count: metCount, total_count: 4, fulfillment_pct: Number(((metCount / 4) * 100).toFixed(1)), evaluated_at: atUTC(date, 22), source_type: SOURCE, created_at: atUTC(date, 8) });
  if (hash(`${date}:task`) < 0.3) tasks.push({ user_id: uid, title: pick(`${date}:task-title`, ['Review weekly plan', 'Clean up notes', 'Follow up on application', 'Plan tomorrow']), description: 'Backfilled planning activity', due_date: date, completed: hash(`${date}:task-done`) < 0.55, source: MONEY_SOURCE, priority: pick(`${date}:priority`, ['normal', 'high', 'low']), created_at: atUTC(date, 9), updated_at: atUTC(date, 18) });
  if (hash(`${date}:note`) < 0.22) { const body = pick(`${date}:note-body`, ['A useful pattern emerged from the week.', 'Kept the loop small and honest.', 'Need to protect sleep before pushing volume.']); notes.push({ user_id: uid, title: 'Backfill reflection', content: body, body_text: body, type: 'note', source_type: SOURCE, status: 'ready', completed: false, meta: { seed: JOURNAL_MARKER }, created_at: atUTC(date, 14), updated_at: atUTC(date, 14) }); }
}

const plan = {
  osId: USERNAME, scope: 'append-only', sourceTypes: { standard: SOURCE, money: MONEY_SOURCE, journalMarker: JOURNAL_MARKER },
  window: { start: fmtDate(START), end: fmtDate(END), requestedDays: DAYS, missingDaysBeforeWrite: gapDates.length, gapDates },
  existingDailyDaysInWindow: existingDates.size,
  availableRelations: { accounts: accountIds.length, expenseCategories: expenseCategories.length, incomeCategories: incomeCategories.length },
  plannedRows: { daily_logs: dailyLogs.length, sessions: sessions.length, journal_entries: journals.length, money_transactions: money.length, calendar_events: calendar.length, wins: wins.length, daily_commitments: commitments.length, tasks: tasks.length, notes: notes.length },
  variance: { moodRange: dailyLogs.length ? [Math.min(...dailyLogs.map((row) => row.mood)), Math.max(...dailyLogs.map((row) => row.mood))] : [], sleepRange: dailyLogs.length ? [Math.min(...dailyLogs.map((row) => row.sleep_hours)), Math.max(...dailyLogs.map((row) => row.sleep_hours))] : [], energyRange: dailyLogs.length ? [Math.min(...dailyLogs.map((row) => row.energy_level)), Math.max(...dailyLogs.map((row) => row.energy_level))] : [], gymDone: dailyLogs.filter((row) => row.gym_done).length, learningDone: dailyLogs.filter((row) => row.learning_done).length, headacheDays: dailyLogs.filter((row) => row.headache).length },
};

async function insertBatch(table, rows) {
  if (!rows.length) return 0;
  const { error } = await supabase.from(table).insert(rows);
  if (error) throw new Error(`${table}: ${error.message}`);
  return rows.length;
}
async function deleteForDate(table, query) {
  const { error } = await query;
  if (error) throw new Error(`rollback ${table}: ${error.message}`);
}
async function preflightRollback() {
  if (ROLLBACK_DATES.length !== EXPECTED_ROLLBACK_COUNTS.daily_logs) throw new Error(`Rollback requires exactly ${EXPECTED_ROLLBACK_COUNTS.daily_logs} dates from the write receipt; received ${ROLLBACK_DATES.length}.`);
  const first = ROLLBACK_DATES.slice().sort()[0];
  const last = ROLLBACK_DATES.slice().sort().at(-1);
  const end = fmtDate(addDays(parseDate(last), 1));
  const startIso = `${first}T00:00:00.000Z`;
  const endIso = `${end}T00:00:00.000Z`;
  const queries = {
    daily_logs: supabase.from('daily_logs').select('*', { count: 'exact', head: true }).eq('user_id', uid).eq('source_type', SOURCE).in('date', ROLLBACK_DATES),
    sessions: supabase.from('sessions').select('*', { count: 'exact', head: true }).eq('user_id', uid).eq('source_type', SOURCE).gte('started_at', startIso).lt('started_at', endIso),
    journal_entries: supabase.from('journal_entries').select('*', { count: 'exact', head: true }).eq('user_id', uid).gte('created_at', startIso).lt('created_at', endIso).filter('encrypted_content', 'ilike', `%\"seed\":\"${JOURNAL_MARKER}\"%`),
    money_transactions: supabase.from('money_transactions').select('*', { count: 'exact', head: true }).eq('user_id', uid).eq('source', MONEY_SOURCE).in('date', ROLLBACK_DATES),
    calendar_events: supabase.from('calendar_events').select('*', { count: 'exact', head: true }).eq('user_id', uid).eq('source_type', SOURCE).gte('start_time', startIso).lt('start_time', endIso),
    wins: supabase.from('wins').select('*', { count: 'exact', head: true }).eq('user_id', uid).eq('source_type', SOURCE).in('date', ROLLBACK_DATES),
    daily_commitments: supabase.from('daily_commitments').select('*', { count: 'exact', head: true }).eq('user_id', uid).eq('source_type', SOURCE).in('date', ROLLBACK_DATES),
    tasks: supabase.from('tasks').select('*', { count: 'exact', head: true }).eq('user_id', uid).eq('source', MONEY_SOURCE).in('due_date', ROLLBACK_DATES),
    notes: supabase.from('notes').select('*', { count: 'exact', head: true }).eq('user_id', uid).eq('source_type', SOURCE).contains('meta', { seed: JOURNAL_MARKER }),
  };
  const actual = {};
  for (const [table, query] of Object.entries(queries)) {
    const { count, error } = await query;
    if (error) throw new Error(`rollback preflight ${table}: ${error.message}`);
    actual[table] = count ?? 0;
  }
  const mismatches = Object.entries(EXPECTED_ROLLBACK_COUNTS).filter(([table, expected]) => actual[table] !== expected).map(([table, expected]) => `${table} expected ${expected}, found ${actual[table]}`);
  if (mismatches.length) throw new Error(`Rollback preflight refused: ${mismatches.join('; ')}`);
  console.log(`Rollback preflight passed: ${JSON.stringify(actual)}`);
}

async function rollback() {
  if (!ROLLBACK_DATES.length) throw new Error('Rollback requires SEED_GAP_DATES from the write receipt; refusing broad deletion.');
  await preflightRollback();
  for (const date of ROLLBACK_DATES) {
    const next = fmtDate(addDays(parseDate(date), 1));
    const start = `${date}T00:00:00.000Z`; const end = `${next}T00:00:00.000Z`;
    await deleteForDate('daily_logs', supabase.from('daily_logs').delete().eq('user_id', uid).eq('source_type', SOURCE).eq('date', date));
    await deleteForDate('sessions', supabase.from('sessions').delete().eq('user_id', uid).eq('source_type', SOURCE).gte('started_at', start).lt('started_at', end));
    await deleteForDate('money_transactions', supabase.from('money_transactions').delete().eq('user_id', uid).eq('source', MONEY_SOURCE).eq('date', date));
    await deleteForDate('calendar_events', supabase.from('calendar_events').delete().eq('user_id', uid).eq('source_type', SOURCE).gte('start_time', start).lt('start_time', end));
    await deleteForDate('wins', supabase.from('wins').delete().eq('user_id', uid).eq('source_type', SOURCE).eq('date', date));
    await deleteForDate('daily_commitments', supabase.from('daily_commitments').delete().eq('user_id', uid).eq('source_type', SOURCE).eq('date', date));
    await deleteForDate('tasks', supabase.from('tasks').delete().eq('user_id', uid).eq('source', MONEY_SOURCE).eq('due_date', date));
    await deleteForDate('notes', supabase.from('notes').delete().eq('user_id', uid).eq('source_type', SOURCE).gte('created_at', start).lt('created_at', end));
    await deleteForDate('journal_entries', supabase.from('journal_entries').delete().eq('user_id', uid).gte('created_at', start).lt('created_at', end).filter('encrypted_content', 'ilike', `%"seed":"${JOURNAL_MARKER}"%`));
  }
}

console.log(JSON.stringify({ mode: WIPE_BACKFILL ? (CONFIRM ? 'WIPE' : 'WIPE_DRY_RUN') : (CONFIRM ? 'WRITE' : 'DRY_RUN'), ...plan }, null, 2));
if (WIPE_BACKFILL) {
  if (!CONFIRM) {
    console.log('Rollback dry-run: verifying exact marker/date counts; no rows will be deleted.');
    await preflightRollback();
    console.log('Dry-run only. Add --confirm to remove only the verified rows.');
    process.exit(0);
  }
  await rollback();
  console.log('Gap-date/source-marker backfill rollback complete; existing non-marker rows were not touched.');
  process.exit(0);
}
if (!CONFIRM) { console.log('Dry-run only. Add --confirm only after reviewing this exact plan. No rows were written.'); process.exit(0); }

console.log(`Writing append-only backfill for ${gapDates.length} missing dates…`);
try {
  for (const [table, rows] of Object.entries({ daily_logs: dailyLogs, sessions, journal_entries: journals, money_transactions: money, calendar_events: calendar, wins, daily_commitments: commitments, tasks, notes })) {
    console.log(`${table}: ${await insertBatch(table, rows)}`);
  }
} catch (error) {
  console.error(error.message);
  console.error(`If any earlier table inserted, rollback with: SEED_GAP_DATES=${gapDates.join(',')} node scripts/append-backfill-gaps.mjs --wipe-backfill --confirm`);
  process.exit(1);
}
console.log('Append-only backfill complete. No existing rows were updated or deleted.');
console.log(`BACKFILL_GAP_DATES=${gapDates.join(',')}`);
