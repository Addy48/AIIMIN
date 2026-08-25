#!/usr/bin/env node
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { resolve } from 'node:path';

dotenv.config({ path: process.env.DOTENV_CONFIG_PATH || resolve(process.cwd(), '.env') });
try { dotenv.config({ path: resolve(process.cwd(), '.env.local'), override: true }); } catch { /* optional */ }

const USERNAME = String(process.env.SEED_USERNAME || 'AADI0837').trim().toUpperCase();
const ALLOWLIST = new Set(String(process.env.SEED_ALLOWLIST || 'AADI0837').split(',').map((value) => value.trim().toUpperCase()).filter(Boolean));
const TABLES = [
  'daily_logs', 'habits', 'habit_logs', 'sessions', 'study_sessions', 'journal_entries',
  'money_transactions', 'calendar_events', 'goals', 'job_applications', 'family_members',
  'family_reminders', 'notes', 'urge_events', 'discipline_logs', 'lab_typing_tests',
  'lab_reaction_tests', 'lab_speaking_logs', 'lab_mindset_logs', 'lab_reading_log',
  'lab_decision_scenarios', 'dsa_logs', 'net_worth_snapshots',
];
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false, autoRefreshToken: false } });

if (!ALLOWLIST.has(USERNAME)) throw new Error(`Refusing audit for non-allowlisted OS-ID: ${USERNAME}`);
if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) throw new Error('Need SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY');
const { data: user, error: userError } = await supabase.from('users').select('id').eq('username', USERNAME).maybeSingle();
if (userError) throw userError;
if (!user?.id) throw new Error(`No user ${USERNAME}`);

const { data: dailyDates, error: dailyDateError } = await supabase
  .from('daily_logs')
  .select('date, source_type')
  .eq('user_id', user.id)
  .order('date', { ascending: true });

const rows = [];
for (const table of TABLES) {
  const { count, error } = await supabase.from(table).select('*', { count: 'exact', head: true }).eq('user_id', user.id);
  rows.push({ table, count: error ? null : count ?? 0, error: error?.message || null });
}
const markerChecks = [
  ['daily_logs', 'source_type', 'admin_simulated'],
  ['sessions', 'source_type', 'admin_simulated'],
  ['calendar_events', 'source_type', 'admin_simulated'],
  ['notes', 'source_type', 'admin_simulated'],
  ['money_transactions', 'source', 'seed'],
];
const markers = [];
for (const [table, column, value] of markerChecks) {
  const { count, error } = await supabase.from(table).select('*', { count: 'exact', head: true }).eq('user_id', user.id).eq(column, value);
  markers.push({ table, marker: `${column}=${value}`, count: error ? null : count ?? 0, error: error?.message || null });
}
console.log(JSON.stringify({
  osId: USERNAME,
  scope: 'read-only',
  dateCoverage: {
    min: dailyDates?.[0]?.date || null,
    max: dailyDates?.at(-1)?.date || null,
    distinctDays: new Set((dailyDates || []).map((row) => row.date)).size,
    error: dailyDateError?.message || null,
  },
  rows,
  markers,
}, null, 2));
