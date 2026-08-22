#!/usr/bin/env node
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { resolve } from 'node:path';

dotenv.config({ path: process.env.DOTENV_CONFIG_PATH || resolve(process.cwd(), '.env') });
try { dotenv.config({ path: resolve(process.cwd(), '.env.local'), override: true }); } catch { /* optional */ }

const USERNAME = String(process.env.SEED_USERNAME || 'AADI0837').trim().toUpperCase();
const ALLOWLIST = new Set(String(process.env.SEED_ALLOWLIST || 'AADI0837').split(',').map((value) => value.trim().toUpperCase()).filter(Boolean));
const END = process.env.ANALYSIS_END || '2026-08-21';
const START = process.env.ANALYSIS_START || '2026-04-25';
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false, autoRefreshToken: false } });

if (!ALLOWLIST.has(USERNAME)) throw new Error(`Refusing analysis for non-allowlisted OS-ID: ${USERNAME}`);
if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) throw new Error('Need SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY');
const { data: user, error: userError } = await supabase.from('users').select('id').eq('username', USERNAME).maybeSingle();
if (userError) throw userError;
if (!user?.id) throw new Error(`No user ${USERNAME}`);

const { data: daily, error: dailyError } = await supabase
  .from('daily_logs')
  .select('date, sleep_hours, mood, energy_level, brain_fog, steps, water_bottles, focus_score, habits_completed, gym_done, learning_done, breakfast_done, headache, source_type')
  .eq('user_id', user.id)
  .gte('date', START)
  .lte('date', END)
  .order('date', { ascending: true });
if (dailyError) throw dailyError;

const numeric = (rows, key) => rows.map((row) => Number(row[key])).filter(Number.isFinite);
const quantile = (values, q) => {
  if (!values.length) return null;
  const sorted = [...values].sort((a, b) => a - b);
  const index = (sorted.length - 1) * q;
  const low = Math.floor(index); const high = Math.ceil(index);
  return Number((sorted[low] + (sorted[high] - sorted[low]) * (index - low)).toFixed(2));
};
const describe = (values) => values.length ? {
  n: values.length,
  min: Math.min(...values),
  p10: quantile(values, 0.1),
  median: quantile(values, 0.5),
  mean: Number((values.reduce((sum, value) => sum + value, 0) / values.length).toFixed(2)),
  p90: quantile(values, 0.9),
  max: Math.max(...values),
} : { n: 0 };
const freq = (rows, key) => rows.reduce((out, row) => {
  const value = String(row[key]);
  out[value] = (out[value] || 0) + 1;
  return out;
}, {});
const pearson = (rows, xKey, yKey) => {
  const pairs = rows.map((row) => [Number(row[xKey]), Number(row[yKey])]).filter(([x, y]) => Number.isFinite(x) && Number.isFinite(y));
  if (pairs.length < 3) return null;
  const xMean = pairs.reduce((s, p) => s + p[0], 0) / pairs.length;
  const yMean = pairs.reduce((s, p) => s + p[1], 0) / pairs.length;
  const numerator = pairs.reduce((s, [x, y]) => s + (x - xMean) * (y - yMean), 0);
  const xDen = Math.sqrt(pairs.reduce((s, [x]) => s + (x - xMean) ** 2, 0));
  const yDen = Math.sqrt(pairs.reduce((s, [, y]) => s + (y - yMean) ** 2, 0));
  return xDen && yDen ? Number((numerator / (xDen * yDen)).toFixed(3)) : null;
};

const tables = [
  ['habit_logs', 'completed_at'], ['sessions', 'started_at'], ['study_sessions', 'started_at'],
  ['journal_entries', 'created_at'], ['money_transactions', 'date'], ['calendar_events', 'start_time'],
  ['urge_events', 'started_at'], ['discipline_logs', 'created_at'], ['lab_typing_tests', 'taken_at'],
  ['lab_reaction_tests', 'taken_at'], ['lab_speaking_logs', 'logged_at'], ['lab_mindset_logs', 'logged_at'],
  ['lab_reading_log', 'logged_at'], ['net_worth_snapshots', 'snapshot_date'],
];
const activity = [];
for (const [table, column] of tables) {
  const { count, error } = await supabase.from(table).select('*', { count: 'exact', head: true }).eq('user_id', user.id).gte(column, `${START}T00:00:00.000Z`).lte(column, `${END}T23:59:59.999Z`);
  activity.push({ table, count: error ? null : count ?? 0, error: error?.message || null });
}

const expectedDays = Math.round((new Date(`${END}T00:00:00Z`) - new Date(`${START}T00:00:00Z`)) / 86400000) + 1;
const uniqueDays = new Set((daily || []).map((row) => row.date));
const missingDays = [];
for (let cursor = new Date(`${START}T00:00:00Z`); cursor <= new Date(`${END}T00:00:00Z`); cursor.setUTCDate(cursor.getUTCDate() + 1)) {
  const date = cursor.toISOString().slice(0, 10);
  if (!uniqueDays.has(date)) missingDays.push(date);
}

console.log(JSON.stringify({
  osId: USERNAME,
  scope: 'read-only',
  window: { start: START, end: END, expectedDays, loggedDays: uniqueDays.size, missingDays: missingDays.length, firstMissing: missingDays.slice(0, 10) },
  dailyVariance: {
    sleep_hours: describe(numeric(daily, 'sleep_hours')),
    mood: describe(numeric(daily, 'mood')),
    energy_level: describe(numeric(daily, 'energy_level')),
    brain_fog: describe(numeric(daily, 'brain_fog')),
    steps: describe(numeric(daily, 'steps')),
    water_bottles: describe(numeric(daily, 'water_bottles')),
    focus_score: describe(numeric(daily, 'focus_score')),
    habits_completed: describe(numeric(daily, 'habits_completed')),
  },
  stateMix: {
    mood: freq(daily, 'mood'),
    gym_done: freq(daily, 'gym_done'),
    learning_done: freq(daily, 'learning_done'),
    breakfast_done: freq(daily, 'breakfast_done'),
    headache: freq(daily, 'headache'),
    source_type: freq(daily, 'source_type'),
  },
  relationships: {
    sleep_hours_to_mood: pearson(daily, 'sleep_hours', 'mood'),
    sleep_hours_to_energy: pearson(daily, 'sleep_hours', 'energy_level'),
    steps_to_mood: pearson(daily, 'steps', 'mood'),
    focus_score_to_mood: pearson(daily, 'focus_score', 'mood'),
  },
  activity,
}, null, 2));
