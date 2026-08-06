#!/usr/bin/env node
/**
 * Realistic demo history for ONE throwaway OS account (default AADI0837).
 * No "Seed" labels in UI-facing names. Fully removable anytime.
 *
 *   node scripts/seed-realistic-life.mjs                  # dry-run plan
 *   node scripts/seed-realistic-life.mjs --confirm        # wipe then seed
 *   node scripts/seed-realistic-life.mjs --wipe-only --confirm   # wipe only (fresh account data)
 *
 * Env: SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY
 * Optional: SEED_USERNAME=AADI0837  SEED_DAYS=180  SEED_END=YYYY-MM-DD
 *
 * Markers: meta.seed / source=seed / source_type=admin_simulated /
 * encrypted journal seed flag. Wipe-only clears that user's seeded domains
 * completely (account stays; login/auth unchanged).
 */
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { resolve } from 'node:path';
import { randomUUID } from 'node:crypto';

dotenv.config({ path: process.env.DOTENV_CONFIG_PATH || resolve(process.cwd(), '.env') });
try { dotenv.config({ path: resolve(process.cwd(), '.env.local'), override: true }); } catch { /* */ }

const CONFIRM = process.argv.includes('--confirm');
const WIPE_ONLY = process.argv.includes('--wipe-only');
const DAYS = Number(process.env.SEED_DAYS || 180);
const END = parseDate(process.env.SEED_END || '2026-07-17');
const START = addDays(END, -(DAYS - 1));
const USERNAME = process.env.SEED_USERNAME || 'AADI0837';

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false, autoRefreshToken: false },
});

function parseDate(s) {
  const [y, m, d] = s.split('-').map(Number);
  return new Date(Date.UTC(y, m - 1, d));
}
function fmtDate(d) { return d.toISOString().slice(0, 10); }
function addDays(d, n) { const x = new Date(d); x.setUTCDate(x.getUTCDate() + n); return x; }
function clamp(n, lo, hi) { return Math.max(lo, Math.min(hi, n)); }
function rand() { return Math.random(); }
function randInt(lo, hi) { return Math.floor(rand() * (hi - lo + 1)) + lo; }
function pick(arr) { return arr[randInt(0, arr.length - 1)]; }
function gauss(mean, sd) {
  const u = 1 - rand(); const v = 1 - rand();
  return mean + sd * Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
}
function pad(n) { return String(n).padStart(2, '0'); }
function atLocal(dateStr, hour, minute = 0) {
  const [y, m, d] = dateStr.split('-').map(Number);
  return new Date(Date.UTC(y, m - 1, d, hour - 5, minute - 30)).toISOString();
}
function serializeJournal(mode, payload) {
  return JSON.stringify({ v: 2, mode, seed: true, ...payload });
}

async function batchInsert(table, rows, chunk = 400) {
  if (!rows.length) return 0;
  let n = 0;
  for (let i = 0; i < rows.length; i += chunk) {
    const { error } = await supabase.from(table).insert(rows.slice(i, i + chunk));
    if (error) throw new Error(`${table}: ${error.message}`);
    n += rows.slice(i, i + chunk).length;
  }
  return n;
}
async function softInsert(table, rows) {
  try {
    const n = await batchInsert(table, rows);
    console.log(`  ${table}: ${n}`);
    return n;
  } catch (e) {
    console.warn(`  ${table}: SKIPPED — ${e.message}`);
    return 0;
  }
}
async function del(label, q) {
  const { error, count } = await q;
  if (error) console.warn(`  wipe ${label}: ${error.message}`);
  else console.log(`  wiped ${label}${typeof count === 'number' ? ` (${count})` : ''}`);
}

async function resolveUser() {
  const { data, error } = await supabase
    .from('users')
    .select('id, email, username')
    .eq('username', USERNAME)
    .maybeSingle();
  if (error) throw error;
  if (!data) throw new Error(`No user ${USERNAME}`);
  return data;
}

/**
 * Remove demo seed for ONE user only (SEED_USERNAME).
 * Does not delete the auth/user row — only life-data domains the seed owns.
 * full=true (wipe-only): ignore date windows; clear all rows for that user in those tables.
 */
async function wipe(userId, { full = false } = {}) {
  const startStr = fmtDate(START);
  const endStr = fmtDate(END);
  const startIso = `${startStr}T00:00:00.000Z`;
  const endIso = `${endStr}T23:59:59.999Z`;

  console.log(`  scope: user_id=${userId} full=${full}`);

  // Habits — full tree (seed owns this account's habits during demo)
  await del('habit_logs', supabase.from('habit_logs').delete().eq('user_id', userId));
  await del('routines', supabase.from('routines').delete().eq('user_id', userId));
  await del('habits', supabase.from('habits').delete().eq('user_id', userId));
  await del('habit_stacks', supabase.from('habit_stacks').delete().eq('user_id', userId));
  await del('replacement_habits', supabase.from('replacement_habits').delete().eq('user_id', userId));

  if (full) {
    await del('daily_logs', supabase.from('daily_logs').delete().eq('user_id', userId));
    await del('sessions', supabase.from('sessions').delete().eq('user_id', userId));
    await del('study_sessions', supabase.from('study_sessions').delete().eq('user_id', userId));
    await del('wins', supabase.from('wins').delete().eq('user_id', userId));
    await del('commitments', supabase.from('daily_commitments').delete().eq('user_id', userId));
    await del('journals', supabase.from('journal_entries').delete().eq('user_id', userId));
    await del('money_tx', supabase.from('money_transactions').delete().eq('user_id', userId));
    await del('calendar', supabase.from('calendar_events').delete().eq('user_id', userId));
    await del('xp_log', supabase.from('xp_log').delete().eq('user_id', userId));
    await del('tasks', supabase.from('tasks').delete().eq('user_id', userId));
    await del('notes', supabase.from('notes').delete().eq('user_id', userId));
    await del('urges', supabase.from('urge_events').delete().eq('user_id', userId));
    await del('discipline_logs', supabase.from('discipline_logs').delete().eq('user_id', userId));
    await del('goals', supabase.from('goals').delete().eq('user_id', userId));
  } else {
    await del('daily_logs', supabase.from('daily_logs').delete().eq('user_id', userId).eq('source_type', 'admin_simulated'));
    await del('sessions', supabase.from('sessions').delete().eq('user_id', userId).eq('source_type', 'admin_simulated'));
    await del('study_sessions', supabase.from('study_sessions').delete().eq('user_id', userId).gte('started_at', startIso).lte('started_at', endIso));
    await del('wins', supabase.from('wins').delete().eq('user_id', userId).eq('source_type', 'admin_simulated'));
    await del('commitments', supabase.from('daily_commitments').delete().eq('user_id', userId).eq('source_type', 'admin_simulated'));
    await del('journals', supabase.from('journal_entries').delete().eq('user_id', userId).filter('encrypted_content', 'ilike', '%"seed":true%'));
    await del('money_tx', supabase.from('money_transactions').delete().eq('user_id', userId).eq('source', 'seed'));
    await del('calendar', supabase.from('calendar_events').delete().eq('user_id', userId).eq('source_type', 'admin_simulated'));
    await del('xp_log', supabase.from('xp_log').delete().eq('user_id', userId).gte('date', startStr).lte('date', endStr));
    await del('tasks', supabase.from('tasks').delete().eq('user_id', userId).eq('source', 'seed'));
    await del('notes', supabase.from('notes').delete().eq('user_id', userId).eq('source_type', 'admin_simulated'));
    await del('urges', supabase.from('urge_events').delete().eq('user_id', userId).gte('started_at', startIso));
    await del('discipline_logs', supabase.from('discipline_logs').delete().eq('user_id', userId).gte('created_at', startIso));
    await del('goals meta.seed', supabase.from('goals').delete().eq('user_id', userId).contains('meta', { seed: true }));
    await del('goals Seed%', supabase.from('goals').delete().eq('user_id', userId).like('metric', 'Seed %'));
  }

  // Money structure (FK: children before accounts)
  await del('budgets', supabase.from('budgets').delete().eq('user_id', userId));
  await del('lent', supabase.from('money_lent').delete().eq('user_id', userId));
  await del('recurring', supabase.from('recurring').delete().eq('user_id', userId));
  await del('savings', supabase.from('savings_goals').delete().eq('user_id', userId));
  await del('fin_goals', supabase.from('financial_goals').delete().eq('user_id', userId));
  await del('wealth', supabase.from('wealth_assets').delete().eq('user_id', userId));
  await del('acct_bal', supabase.from('account_balances').delete().eq('user_id', userId));
  await del('accounts', supabase.from('accounts').delete().eq('user_id', userId));
  await del('money_categories', supabase.from('money_categories').delete().eq('user_id', userId));

  await del('dsa_problems', supabase.from('dsa_problems').delete().eq('user_id', userId));
  await del('dsa_logs', supabase.from('dsa_logs').delete().eq('user_id', userId));
  await del('resumes', supabase.from('resumes').delete().eq('user_id', userId));
  await del('jobs', supabase.from('job_applications').delete().eq('user_id', userId));
  await del('net_worth', supabase.from('net_worth_snapshots').delete().eq('user_id', userId));

  for (const t of [
    'family_health', 'family_insurance', 'family_documents', 'family_finance',
    'family_reminders', 'family_emergency_contacts', 'family_vehicles',
    'family_relationships', 'family_members',
  ]) {
    await del(t, supabase.from(t).delete().eq('user_id', userId));
  }
  for (const t of [
    'lab_typing_tests', 'lab_reaction_tests', 'lab_speaking_logs', 'lab_mindset_logs',
    'lab_reading_log', 'lab_personality_logs', 'lab_aptitude_scores', 'lab_pit_logs',
    'lab_system_design_logs', 'lab_decision_scenarios', 'lab_beliefs',
    'lab_correlations', 'lab_insights',
  ]) {
    await del(t, supabase.from(t).delete().eq('user_id', userId));
  }
  await del('lab_streaks', supabase.from('lab_streaks').delete().eq('user_id', userId));
  await del('lab_mastery', supabase.from('lab_mastery_badges').delete().eq('user_id', userId));
  await del('discipline_streaks', supabase.from('discipline_streaks').delete().eq('user_id', userId));
}

async function main() {
  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    console.error('Need SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY');
    process.exit(1);
  }
  const user = await resolveUser();
  console.log(WIPE_ONLY ? '=== Wipe seed data (one account) ===' : '=== Realistic life seed ===');
  console.log(`${user.username} <${user.email}> ${user.id}`);
  console.log(`${fmtDate(START)} .. ${fmtDate(END)} (${DAYS}d)  mode=${CONFIRM ? (WIPE_ONLY ? 'WIPE-ONLY' : 'WRITE') : 'dry-run'}`);

  if (WIPE_ONLY) {
    if (!CONFIRM) {
      console.log('\nDry-run. This clears ALL demo life-data for this user only (keeps login).');
      console.log('Write with: node scripts/seed-realistic-life.mjs --wipe-only --confirm');
      console.log(`Optional: SEED_USERNAME=${USERNAME}`);
      return;
    }
    console.log('\nWiping (full)…');
    await wipe(user.id, { full: true });
    console.log('\nDone. Account still exists; demo life-data removed. Site fresh for this user.');
    return;
  }

  const uid = user.id;
  const ids = {
    accBank: randomUUID(), accCash: randomUUID(), accInvest: randomUUID(),
    catFood: randomUUID(), catTransport: randomUUID(), catRent: randomUUID(),
    catFun: randomUUID(), catHealth: randomUUID(), catShop: randomUUID(), catIncome: randomUUID(),
    hWater: randomUUID(), hMed: randomUUID(), hRun: randomUUID(), hRead: randomUUID(),
    hJournal: randomUUID(), hGym: randomUUID(), hPhone: randomUUID(), hProtein: randomUUID(),
    routine: randomUUID(),
    resumeG: randomUUID(), resumeB: randomUUID(), resumeF: randomUUID(),
    mom: randomUUID(), dad: randomUUID(), sib: randomUUID(), grandma: randomUUID(), uncle: randomUUID(), cousin: randomUUID(),
  };

  // ── Money ──
  const accounts = [
    { id: ids.accBank, user_id: uid, name: 'HDFC Salary', type: 'bank', currency: 'INR', balance: 214500, icon: '🏦', color: '#ff6b35', is_default: true },
    { id: ids.accCash, user_id: uid, name: 'Cash Wallet', type: 'cash', currency: 'INR', balance: 3200, icon: '💵', color: '#10b981' },
    { id: ids.accInvest, user_id: uid, name: 'Groww Demat', type: 'investment', currency: 'INR', balance: 128400, icon: '📈', color: '#6b7280' },
  ];
  const categories = [
    { id: ids.catFood, user_id: uid, name: 'Food & Dining', icon: '🍽️', color: '#ff6b35', type: 'expense' },
    { id: ids.catTransport, user_id: uid, name: 'Transport', icon: '🚗', color: '#6b7280', type: 'expense' },
    { id: ids.catRent, user_id: uid, name: 'Housing', icon: '🏠', color: '#2d2d2d', type: 'expense' },
    { id: ids.catFun, user_id: uid, name: 'Entertainment', icon: '🎮', color: '#ff6b35', type: 'expense' },
    { id: ids.catHealth, user_id: uid, name: 'Health', icon: '💊', color: '#10b981', type: 'expense' },
    { id: ids.catShop, user_id: uid, name: 'Shopping', icon: '🛍️', color: '#6b7280', type: 'expense' },
    { id: ids.catIncome, user_id: uid, name: 'Salary', icon: '💰', color: '#10b981', type: 'income' },
  ];
  const budgets = [
    { user_id: uid, category_id: ids.catFood, amount: 12000, period: 'monthly', start_date: fmtDate(START), alert_threshold: 80 },
    { user_id: uid, category_id: ids.catTransport, amount: 4500, period: 'monthly', start_date: fmtDate(START), alert_threshold: 80 },
    { user_id: uid, category_id: ids.catFun, amount: 6000, period: 'monthly', start_date: fmtDate(START), alert_threshold: 90 },
    { user_id: uid, category_id: ids.catHealth, amount: 3500, period: 'monthly', start_date: fmtDate(START), alert_threshold: 80 },
  ];
  const recurring = [
    { user_id: uid, name: 'Netflix', amount: 649, category_id: ids.catFun, frequency: 'monthly', next_due_date: fmtDate(addDays(END, 6)), active: true, account_id: ids.accBank, type: 'expense' },
    { user_id: uid, name: 'Flat rent', amount: 22000, category_id: ids.catRent, frequency: 'monthly', next_due_date: fmtDate(addDays(END, 2)), active: true, account_id: ids.accBank, type: 'expense' },
    { user_id: uid, name: 'Cult.fit', amount: 1499, category_id: ids.catHealth, frequency: 'monthly', next_due_date: fmtDate(addDays(END, 11)), active: true, account_id: ids.accBank, type: 'expense' },
  ];

  // ── Habits (realistic names, meta.seed for wipe) ──
  const habits = [
    { id: ids.hWater, user_id: uid, name: 'Drink Water', emoji: '💧', category: 'Health', frequency: 'daily', status: 'active', meta: { seed: true, color: '#06B6D4', description: '3L hydration', target: 7, completedDates: [] } },
    { id: ids.hMed, user_id: uid, name: 'Meditation', emoji: '🧘', category: 'Mindset', frequency: 'daily', status: 'active', meta: { seed: true, color: '#8B5CF6', description: '10 min sit', target: 7, completedDates: [] } },
    { id: ids.hRun, user_id: uid, name: 'Morning Run', emoji: '🏃', category: 'Health', frequency: 'daily', status: 'active', meta: { seed: true, color: '#22C55E', description: 'Easy miles', target: 5, completedDates: [] } },
    { id: ids.hRead, user_id: uid, name: 'Read 20 pages', emoji: '📚', category: 'Learning', frequency: 'daily', status: 'active', meta: { seed: true, color: '#3B82F6', description: 'Books / papers', target: 7, completedDates: [] } },
    { id: ids.hJournal, user_id: uid, name: 'Journal', emoji: '✍️', category: 'Mindset', frequency: 'daily', status: 'active', meta: { seed: true, color: '#F59E0B', description: 'Evening pages', target: 7, completedDates: [] } },
    { id: ids.hGym, user_id: uid, name: 'Gym', emoji: '🏋️', category: 'Health', frequency: 'daily', status: 'active', meta: { seed: true, color: '#EF4444', description: 'Strength block', target: 4, completedDates: [] } },
    { id: ids.hPhone, user_id: uid, name: 'No phone first hour', emoji: '📵', category: 'Focus', frequency: 'daily', status: 'active', meta: { seed: true, color: '#EC4899', description: 'Protect mornings', target: 7, completedDates: [] } },
    { id: ids.hProtein, user_id: uid, name: 'Protein target', emoji: '🥩', category: 'Health', frequency: 'daily', status: 'active', meta: { seed: true, color: '#F97316', description: 'Hit macros', target: 7, completedDates: [] } },
  ];
  const routines = [{ id: ids.routine, user_id: uid, name: 'Morning Stack', time_of_day: 'morning' }];
  const routineHabits = [
    { routine_id: ids.routine, habit_id: ids.hPhone, position: 0 },
    { routine_id: ids.routine, habit_id: ids.hWater, position: 1 },
    { routine_id: ids.routine, habit_id: ids.hMed, position: 2 },
    { routine_id: ids.routine, habit_id: ids.hJournal, position: 3 },
  ];

  // ── Goals across pillars ──
  const goals = [
    { user_id: uid, metric: 'Ship AIIMIN tester E2E', target: 100, frequency: 'monthly', start_date: fmtDate(START), meta: { seed: true, title: 'Ship AIIMIN tester E2E', pillar: 'career', priority: 'High', status: 'On Track', targetDate: fmtDate(addDays(END, 40)), why: 'Close before launch.', milestones: [{ text: 'Login E2E green', done: true }, { text: 'Habits heatmap live', done: true }, { text: 'Tester sign-off', done: false }], progress: 66 } },
    { user_id: uid, metric: 'Read 12 books', target: 12, frequency: 'yearly', start_date: fmtDate(START), meta: { seed: true, title: 'Read 12 books', pillar: 'academic', priority: 'Medium', status: 'Active', targetDate: fmtDate(addDays(END, 200)), why: 'Depth over scroll.', milestones: [{ text: 'Atomic Habits done', done: true }, { text: 'DDIA halfway', done: false }], progress: 25 } },
    { user_id: uid, metric: '150 gym sessions', target: 150, frequency: 'yearly', start_date: fmtDate(START), meta: { seed: true, title: '150 gym sessions', pillar: 'health', priority: 'High', status: 'On Track', targetDate: fmtDate(addDays(END, 180)), why: 'Strength compounds.', milestones: [{ text: '40 sessions', done: true }, { text: '80 sessions', done: false }], progress: 30 } },
    { user_id: uid, metric: 'Land SWE offer', target: 1, frequency: 'yearly', start_date: fmtDate(START), meta: { seed: true, title: 'Land SWE offer', pillar: 'career', priority: 'High', status: 'At Risk', targetDate: fmtDate(addDays(END, 90)), why: 'Optionality.', milestones: [{ text: 'Resume ready', done: true }, { text: '10 apps out', done: true }, { text: 'Offer', done: false }], progress: 45 } },
    { user_id: uid, metric: '60-day journal streak', target: 60, frequency: 'monthly', start_date: fmtDate(START), meta: { seed: true, title: '60-day journal streak', pillar: 'personal', priority: 'Medium', status: 'Active', targetDate: fmtDate(addDays(END, 50)), why: 'Clarity.', milestones: [{ text: '14 days', done: true }, { text: '30 days', done: false }], progress: 28 } },
    { user_id: uid, metric: 'Emergency fund ₹3L', target: 300000, frequency: 'yearly', start_date: fmtDate(START), meta: { seed: true, title: 'Emergency fund ₹3L', pillar: 'personal', priority: 'High', status: 'On Track', targetDate: fmtDate(addDays(END, 140)), why: 'Runway.', milestones: [{ text: '₹1L', done: true }, { text: '₹2L', done: false }], progress: 40 } },
  ];

  // ── Family (realistic Indian household) ──
  const familyMembers = [
    { id: ids.mom, user_id: uid, name: 'Sunita Upadhyay', relation: 'mother', dob: '1975-04-12', blood_group: 'B+', phone: '+91-98765-41001' },
    { id: ids.dad, user_id: uid, name: 'Rajesh Upadhyay', relation: 'father', dob: '1972-09-03', blood_group: 'O+', phone: '+91-98765-41002' },
    { id: ids.sib, user_id: uid, name: 'Ananya Upadhyay', relation: 'sibling', dob: '2004-01-22', blood_group: 'B+', phone: '+91-98765-41003' },
    { id: ids.grandma, user_id: uid, name: 'Kamala Devi', relation: 'grandmother', dob: '1950-11-08', blood_group: 'A+', phone: '+91-98765-41004' },
    { id: ids.uncle, user_id: uid, name: 'Vikram Sharma', relation: 'uncle', dob: '1978-06-15', blood_group: 'O+', phone: '+91-98765-41005' },
    { id: ids.cousin, user_id: uid, name: 'Meera Sharma', relation: 'cousin', dob: '2001-08-19', blood_group: 'A+', phone: '+91-98765-41006' },
  ];
  const familyHealth = [
    { user_id: uid, member_id: ids.mom, allergies: 'None', conditions: 'Hypertension (managed)', medications: 'Amlodipine 5mg', doctor_name: 'Dr. Mehta', doctor_phone: '+91-98111-22001' },
    { user_id: uid, member_id: ids.dad, allergies: 'Penicillin', conditions: 'None active', medications: '', doctor_name: 'Dr. Mehta', doctor_phone: '+91-98111-22001' },
    { user_id: uid, member_id: ids.grandma, allergies: 'Sulfa', conditions: 'Type 2 diabetes', medications: 'Metformin 500mg', doctor_name: 'Dr. Kapoor', doctor_phone: '+91-98111-22002' },
    { user_id: uid, member_id: ids.sib, allergies: 'Dust', conditions: 'Mild asthma', medications: 'Inhaler PRN', doctor_name: 'Dr. Mehta', doctor_phone: '+91-98111-22001' },
    { user_id: uid, member_id: ids.uncle, allergies: 'None', conditions: 'Borderline cholesterol', medications: 'Lifestyle only', doctor_name: 'Dr. Mehta', doctor_phone: '+91-98111-22001' },
    { user_id: uid, member_id: ids.cousin, allergies: 'Peanuts', conditions: 'None', medications: '', doctor_name: 'Dr. Mehta', doctor_phone: '+91-98111-22001' },
  ];
  const familyInsurance = [
    { user_id: uid, member_id: ids.dad, policy_name: 'Family Floater', provider: 'HDFC Ergo', policy_number: 'HE-FL-88421', premium_amount: 18500, renewal_date: fmtDate(addDays(END, 55)), nominee: 'Sunita Upadhyay' },
    { user_id: uid, member_id: ids.mom, policy_name: 'Term Life', provider: 'LIC', policy_number: 'LIC-T-10293', premium_amount: 12000, renewal_date: fmtDate(addDays(END, 120)), nominee: 'Rajesh Upadhyay' },
    { user_id: uid, member_id: ids.grandma, policy_name: 'Senior Care', provider: 'Star Health', policy_number: 'SH-SC-44102', premium_amount: 22000, renewal_date: fmtDate(addDays(END, 30)), nominee: 'Rajesh Upadhyay' },
    { user_id: uid, member_id: ids.sib, policy_name: 'Student Mediclaim', provider: 'Niva Bupa', policy_number: 'NB-ST-22018', premium_amount: 4500, renewal_date: fmtDate(addDays(END, 75)), nominee: 'Sunita Upadhyay' },
  ];
  const familyDocs = [
    { user_id: uid, member_id: ids.dad, doc_type: 'passport', doc_number: 'Z4829103', expiry_date: fmtDate(addDays(END, 900)), issue_date: '2019-06-01', issuing_country: 'IN', notes: 'Primary passport' },
    { user_id: uid, member_id: ids.mom, doc_type: 'aadhaar', doc_number: 'XXXX-XXXX-4821', expiry_date: null, issue_date: '2015-03-12', issuing_country: 'IN', notes: '' },
    { user_id: uid, member_id: ids.sib, doc_type: 'passport', doc_number: 'W9912044', expiry_date: fmtDate(addDays(END, 600)), issue_date: '2021-01-15', issuing_country: 'IN', notes: 'Student passport' },
    { user_id: uid, member_id: ids.grandma, doc_type: 'pan', doc_number: 'ABCPD1234E', expiry_date: null, issue_date: '2008-08-01', issuing_country: 'IN', notes: '' },
    { user_id: uid, member_id: ids.cousin, doc_type: 'passport', doc_number: 'V7733102', expiry_date: fmtDate(addDays(END, 420)), issue_date: '2022-09-01', issuing_country: 'IN', notes: '' },
    { user_id: uid, member_id: ids.uncle, doc_type: 'driving_license', doc_number: 'MH12-2018-88421', expiry_date: fmtDate(addDays(END, 310)), issue_date: '2018-04-01', issuing_country: 'IN', notes: '' },
  ];
  const familyFinance = [
    { user_id: uid, member_id: ids.dad, account_type: 'savings', institution_name: 'SBI', account_number: 'XXXX7788', current_balance: 420000, notes: 'Joint family corpus' },
    { user_id: uid, member_id: ids.mom, account_type: 'savings', institution_name: 'HDFC', account_number: 'XXXX3312', current_balance: 185000, notes: '' },
    { user_id: uid, member_id: ids.uncle, account_type: 'fd', institution_name: 'ICICI', account_number: 'FD-99201', current_balance: 500000, notes: 'Shared FD note' },
    { user_id: uid, member_id: ids.sib, account_type: 'savings', institution_name: 'Axis', account_number: 'XXXX5510', current_balance: 42000, notes: 'College stipend' },
  ];
  const familyEmergency = [
    { user_id: uid, name: 'Vikram Sharma', relation_or_role: 'uncle', phone: '+91-98765-41005', notes: 'Primary emergency', is_pinned: true },
    { user_id: uid, name: 'Building security', relation_or_role: 'security', phone: '+91-98765-41999', notes: 'Gate desk', is_pinned: false },
    { user_id: uid, name: 'Dr. Mehta clinic', relation_or_role: 'doctor', phone: '+91-98111-22001', notes: 'Family GP', is_pinned: true },
    { user_id: uid, name: 'Meera Sharma', relation_or_role: 'cousin', phone: '+91-98765-41006', notes: 'Nearby if parents travel', is_pinned: false },
  ];
  const familyVehicles = [
    { user_id: uid, make_model: 'Honda City 2021', registration_number: 'MH12AB4821', insurance_provider: 'Bajaj Allianz', insurance_expiry: fmtDate(addDays(END, 88)), puc_expiry: fmtDate(addDays(END, 35)), service_due_date: fmtDate(addDays(END, 18)) },
    { user_id: uid, make_model: 'Activa 6G', registration_number: 'MH12CD1190', insurance_provider: 'Acko', insurance_expiry: fmtDate(addDays(END, 140)), puc_expiry: fmtDate(addDays(END, 60)), service_due_date: fmtDate(addDays(END, 40)) },
  ];
  const familyRelationships = [
    { user_id: uid, name: 'Rohan Mehta', relation_type: 'friend', birthday: '2001-11-08', last_contacted: fmtDate(addDays(END, -3)), notes: 'College roommate — weekly call' },
    { user_id: uid, name: 'Priya Nair', relation_type: 'friend', birthday: '2002-02-14', last_contacted: fmtDate(addDays(END, -12)), notes: 'Batchmate' },
    { user_id: uid, name: 'Arjun Patel', relation_type: 'mentor', birthday: '1988-07-01', last_contacted: fmtDate(addDays(END, -7)), notes: 'Career mentor' },
    { user_id: uid, name: 'Kabir Singh', relation_type: 'friend', birthday: '2000-05-21', last_contacted: fmtDate(addDays(END, -5)), notes: 'Gym partner' },
    { user_id: uid, name: 'Neha Gupta', relation_type: 'colleague', birthday: '1999-12-02', last_contacted: fmtDate(addDays(END, -1)), notes: 'Interview study buddy' },
  ];
  const familyReminders = [
    { user_id: uid, title: 'Mom birthday prep', description: 'Gift + call', due_date: fmtDate(addDays(END, 14)), is_auto_generated: false, source_type: 'admin_simulated', completed: false },
    { user_id: uid, title: 'Family floater renewal', description: 'HDFC Ergo', due_date: fmtDate(addDays(END, 50)), is_auto_generated: true, source_type: 'admin_simulated', completed: false },
    { user_id: uid, title: 'Honda City service', description: '10k km service', due_date: fmtDate(addDays(END, 18)), is_auto_generated: true, source_type: 'admin_simulated', completed: false },
    { user_id: uid, title: 'Grandma checkup', description: 'Dr. Kapoor diabetes review', due_date: fmtDate(addDays(END, 9)), is_auto_generated: false, source_type: 'admin_simulated', completed: false },
    { user_id: uid, title: 'Dad passport photocopy', description: 'Keep digital scan updated', due_date: fmtDate(addDays(END, 25)), is_auto_generated: false, source_type: 'admin_simulated', completed: false },
    { user_id: uid, title: 'Ananya semester fees', description: 'Transfer before deadline', due_date: fmtDate(addDays(END, 22)), is_auto_generated: false, source_type: 'admin_simulated', completed: false },
    { user_id: uid, title: 'PUC renewal — City', description: 'Pollution certificate', due_date: fmtDate(addDays(END, 30)), is_auto_generated: true, source_type: 'admin_simulated', completed: false },
    { user_id: uid, title: 'Call Rohan', description: 'Weekly check-in', due_date: fmtDate(addDays(END, 2)), is_auto_generated: false, source_type: 'admin_simulated', completed: false },
  ];

  // ── Career ──
  const resumes = [
    { id: ids.resumeG, user_id: uid, title: 'General SWE Resume', target_role: 'Software Engineer', link_url: 'https://drive.google.com/file/d/demo-general/view' },
    { id: ids.resumeB, user_id: uid, title: 'Backend Resume', target_role: 'Backend Engineer', link_url: 'https://drive.google.com/file/d/demo-backend/view' },
    { id: ids.resumeF, user_id: uid, title: 'Frontend Resume', target_role: 'Frontend Engineer', link_url: 'https://drive.google.com/file/d/demo-frontend/view' },
  ];
  const companies = [['Stripe', 'Software Engineer'], ['Razorpay', 'Backend Engineer'], ['Google', 'SWE'], ['Atlassian', 'Full Stack'], ['Notion', 'Product Engineer'], ['Zerodha', 'Frontend Engineer'], ['Microsoft', 'SDE'], ['Flipkart', 'SDE-1'], ['Postman', 'DX Engineer'], ['Cred', 'Full Stack']];
  const jobApps = companies.map(([company, role], i) => ({
    user_id: uid, company_name: company, role_title: role,
    status: ['applied', 'wishlist', 'interview', 'rejected', 'offer', 'applied'][i % 6],
    notes: `Applied via careers. Follow-up week ${i + 1}.`,
    applied_at: fmtDate(addDays(END, -(8 + i * 6))),
    resume_id: [ids.resumeB, ids.resumeF, ids.resumeG][i % 3],
    linkedin_url: `https://linkedin.com/jobs/view/${900000 + i}`,
    job_post_url: `https://boards.greenhouse.io/${company.toLowerCase()}/${i}`,
  }));

  // ── Timeline generation ──
  const DIARY = [
    'Solid morning. Protected deep work before noon.',
    'Low energy after short sleep — kept habits light.',
    'Gym day. Mood climbed by evening.',
    'Weekend reset. Walked more, spent a bit freely.',
    'Family call tonight. Anchored the day.',
    'Interview prep block paid off.',
    'Quiet day. Protected the streak.',
    'Focus block 90m. Phone stayed in another room.',
  ];
  const LEARNING = ['System design', 'DSA graphs', 'React performance', 'Postgres indexing', 'Auth flows', 'Product writing'];
  const expenseCats = [
    [ids.catFood, 'Food & Dining', 90, 480],
    [ids.catTransport, 'Transport', 40, 280],
    [ids.catFun, 'Entertainment', 150, 900],
    [ids.catHealth, 'Health', 120, 700],
    [ids.catShop, 'Shopping', 300, 2200],
  ];
  const habitDefs = [
    [ids.hWater, 8, 0.9], [ids.hMed, 7, 0.78], [ids.hJournal, 21, 0.7],
    [ids.hPhone, 6, 0.68], [ids.hRead, 20, 0.62], [ids.hProtein, 13, 0.74],
    [ids.hRun, 6, 0.48], [ids.hGym, 18, 0.52],
  ];

  const dailyLogs = []; const habitLogs = []; const sessions = []; const studySessions = [];
  const money = []; const wins = []; const commitments = []; const journals = [];
  const xpLogs = []; const calendar = []; const dsaLogs = []; const urges = [];
  const disciplineLogs = []; const netWorth = []; const tasks = []; const notes = [];
  const typing = []; const reaction = []; const speaking = []; const mindset = [];
  const reading = []; const aptitude = []; const pit = []; const sysDesign = [];

  let prev = { lateNight: false }; let streak = 0; let nw = 380000;
  const datesByHabit = new Map(habits.map((h) => [h.id, new Set()]));

  for (let i = 0; i < DAYS; i++) {
    const date = addDays(START, i);
    const dateStr = fmtDate(date);
    const dow = date.getUTCDay();
    const weekend = dow === 0 || dow === 6;
    const weekWave = 6.2 + 0.9 * Math.sin((2 * Math.PI * i) / 7);
    const sleepHours = clamp(Number((gauss(weekend ? 7.8 : 6.9, 0.85) + (prev.lateNight ? -0.8 : 0)).toFixed(2)), 4.5, 9.5);
    const sleepOk = sleepHours >= 6.5;
    const mood = clamp(Math.round((weekWave + (sleepOk ? 0.6 : -1.2) + gauss(0, 0.7)) * 0.5), 1, 5);
    const energy = clamp(Math.round(mood * 0.7 + sleepHours * 0.25 + gauss(0, 0.5)), 1, 5);
    const brainFog = clamp(Math.round((6 - energy) * 0.55 + gauss(0, 0.4)), 1, 3);
    const gymPlan = [1, 3, 5].includes(dow) || (dow === 2 && rand() < 0.35);
    const gymDone = gymPlan && energy >= 4 && rand() < (sleepOk ? 0.88 : 0.45);
    const gymDuration = gymDone ? randInt(35, 75) : null;

    let habitsCompleted = 0;
    for (const [hid, hour, baseRate] of habitDefs) {
      const rate = sleepOk ? baseRate : baseRate * 0.55;
      const done = (hid === ids.hGym && gymDone) || (hid === ids.hRun && gymDone && rand() < 0.3) || rand() < rate;
      if (!done) continue;
      habitsCompleted += 1;
      const completedAt = atLocal(dateStr, hour, randInt(0, 40));
      habitLogs.push({ habit_id: hid, user_id: uid, completed_at: completedAt, status: 'done', session: hour < 12 ? 'morning' : 'evening' });
      const ist = new Date(new Date(completedAt).getTime() + 5.5 * 3600 * 1000).toISOString().slice(0, 10);
      datesByHabit.get(hid).add(ist);
    }
    streak = habitsCompleted >= 4 ? streak + 1 : 0;

    const breakfastDone = rand() < (weekend ? 0.55 : 0.8);
    const steps = Math.round(clamp(gauss(gymDone ? 9500 : weekend ? 7000 : 5500, 1800), 1200, 18000));
    const waterBottles = clamp(Math.round(gauss(habitsCompleted >= 1 ? 7 : 3.5, 1.4)), 1, 12);
    const learningDone = energy >= 5 && rand() < (weekend ? 0.35 : 0.72);
    const learningTopic = learningDone ? pick(LEARNING) : null;
    const focusCount = energy >= 5 ? (rand() < 0.95 ? randInt(2, 4) : 2) : energy >= 3 && rand() < 0.75 ? randInt(1, 2) : rand() < 0.35 ? 1 : 0;
    const focusMinutes = Array.from({ length: focusCount }, () => randInt(25, 95));
    const focusScore = clamp(Math.round(focusMinutes.reduce((a, b) => a + b, 0) / 10 + (gymDone ? 8 : 0) + mood), 0, 100);
    const lateNight = sleepHours < 6.2 && rand() < 0.4;
    const headache = brainFog >= 7 && rand() < 0.25;
    const journalText = rand() < 0.72 ? pick(DIARY) : null;

    let hourCursor = 9;
    for (const mins of focusMinutes) {
      const started = atLocal(dateStr, hourCursor, randInt(0, 20));
      const ended = new Date(new Date(started).getTime() + mins * 60_000).toISOString();
      sessions.push({
        user_id: uid, started_at: started, ended_at: ended, duration_minutes: mins, session_type: 'focus',
        mood_before: clamp(mood - (rand() < 0.3 ? 1 : 0), 1, 5),
        mood_after: clamp(mood + (mins >= 45 ? 1 : 0), 1, 5),
        energy_level: energy, distraction_src: energy < 4 && rand() < 0.4 ? 'phone' : null,
        playlist_used: rand() < 0.5 ? 'Deep Work' : null, source_type: 'admin_simulated', created_at: started,
      });
      hourCursor += Math.ceil(mins / 60) + 1;
    }
    if (learningDone) {
      studySessions.push({
        user_id: uid, topic: learningTopic, duration_minutes: randInt(30, 90),
        started_at: atLocal(dateStr, 16, randInt(0, 30)), session_intent: 'skill building',
        session_reflection: energy >= 4 ? 'Absorbed well' : 'Slow but steady', energy_after: energy,
      });
    }

    dailyLogs.push({
      user_id: uid, date: dateStr,
      sleep_start: `${pad(lateNight ? randInt(0, 1) : randInt(22, 23))}:${pad(randInt(0, 59))}:00`,
      sleep_end: `${pad(randInt(5, 9))}:${pad(randInt(0, 45))}:00`,
      sleep_hours: sleepHours, gym_done: gymDone, gym_duration: gymDuration, breakfast_done: breakfastDone,
      steps, protein_grams: gymDone ? randInt(90, 160) : randInt(50, 110),
      learning_done: learningDone, learning_topic: learningTopic, journal_entry: journalText,
      mood, energy_level: energy, brain_fog: brainFog, headache,
      water_bottles: waterBottles, focus_score: focusScore, habits_completed: habitsCompleted,
      routines_completed: habitsCompleted >= 3 ? 1 : 0, rc_count: 0, rc_entries: [],
      masturbation_count: 0, masturbation_times: [], source_type: 'admin_simulated',
      created_at: atLocal(dateStr, 21, 30),
    });

    if (journalText || rand() < 0.6) {
      const mode = dow === 0 ? 'weekly' : pick(['write', 'free_write', 'morning', 'www', 'cbt']);
      let payload;
      if (mode === 'www') {
        payload = { wins: [{ text: gymDone ? 'Trained as planned' : 'Kept the day honest' }, { text: habitsCompleted >= 3 ? 'Habit stack mostly done' : 'Showed up' }, { text: learningDone ? `Learned: ${learningTopic}` : 'Protected rest' }] };
      } else if (mode === 'cbt') {
        payload = { fields: { situation: weekend ? 'Weekend spend urge' : 'Midday distraction', automaticThought: 'I am falling behind', emotion: mood <= 2 ? 'anxious' : 'frustrated', balancedThought: 'One focused block still moves the needle' } };
      } else if (mode === 'weekly') {
        payload = { body: 'Week review: sleep consistency mattered. Gym days lifted mood. Spend spikes on weekends.', summary: 'Protect sleep + morning stack.' };
      } else {
        payload = { body: journalText || pick(DIARY) };
      }
      journals.push({ user_id: uid, date: dateStr, encrypted_content: serializeJournal(mode, payload), mood, sleep_hours: sleepHours, energy_level: energy, created_at: atLocal(dateStr, 21, 45) });
    }

    const expenseBias = weekend ? 1.35 : mood <= 2 ? 1.25 : 1;
    const expenseCount = rand() < 0.6 * expenseBias ? randInt(1, weekend ? 3 : 2) : 0;
    for (let e = 0; e < expenseCount; e++) {
      const [cid, label, lo, hi] = pick(expenseCats);
      const amt = Math.round(Math.abs(gauss((lo + hi) / 2, (hi - lo) / 4) * expenseBias));
      money.push({
        user_id: uid, date: dateStr, category: label, category_id: cid, amount: -amt, source: 'seed',
        description: label, currency: 'INR', account_id: rand() < 0.75 ? ids.accBank : ids.accCash,
        type: 'expense', tags: [], emotion_tag: mood <= 2 ? 'stressed' : weekend ? 'social' : 'neutral',
        time_of_day: pick(['morning', 'afternoon', 'evening']), created_at: atLocal(dateStr, randInt(11, 21), randInt(0, 50)),
      });
      nw -= amt * 0.12;
    }
    if ((dow === 1 && i % 14 < 7 && rand() < 0.85) || rand() < 0.015) {
      const amt = pick([20000, 25000, 40000, 50000]);
      money.push({
        user_id: uid, date: dateStr, category: 'Salary', category_id: ids.catIncome, amount: amt, source: 'seed',
        description: 'Freelance / stipend', currency: 'INR', account_id: ids.accBank, type: 'income',
        tags: [], emotion_tag: 'positive', time_of_day: 'morning', created_at: atLocal(dateStr, 10, 0),
      });
      nw += amt * 0.35;
    }
    if (date.getUTCDate() === 1) {
      money.push({
        user_id: uid, date: dateStr, category: 'Housing', category_id: ids.catRent, amount: -22000, source: 'seed',
        description: 'Flat rent', currency: 'INR', account_id: ids.accBank, type: 'expense',
        tags: ['rent'], emotion_tag: 'neutral', time_of_day: 'morning', is_recurring: true, created_at: atLocal(dateStr, 9, 0),
      });
    }
    if (i % 14 === 0) {
      netWorth.push({ user_id: uid, snapshot_date: dateStr, total_inr: Math.round(nw), assets_inr: Math.round(nw + 90000), liabilities_inr: 90000, notes: 'biweekly snapshot' });
    }

    if ((gymDone || focusMinutes.some((m) => m >= 60) || streak >= 7) && rand() < 0.32) {
      wins.push({ user_id: uid, date: dateStr, description: gymDone ? 'Hit gym plan' : streak >= 7 ? `${streak}-day habit streak` : 'Deep focus win', source_type: 'admin_simulated', created_at: atLocal(dateStr, 20, 0) });
    }
    const targets = [
      { id: 'gym', label: 'Gym', met: gymDone }, { id: 'habits', label: 'Core habits', met: habitsCompleted >= 4 },
      { id: 'learning', label: 'Learning', met: learningDone }, { id: 'sleep', label: 'Sleep 7h+', met: sleepHours >= 7 },
    ];
    const met = targets.filter((t) => t.met).length;
    commitments.push({
      user_id: uid, date: dateStr, targets, met_count: met, total_count: targets.length,
      fulfillment_pct: Number(((met / targets.length) * 100).toFixed(1)),
      evaluated_at: atLocal(dateStr, 22, 0), source_type: 'admin_simulated', created_at: atLocal(dateStr, 8, 0),
    });
    const xp = (gymDone ? 40 : 0) + habitsCompleted * 12 + (learningDone ? 25 : 0) + Math.round(focusMinutes.reduce((a, b) => a + b, 0) / 5) + (breakfastDone ? 5 : 0);
    if (xp > 0) {
      xpLogs.push({ user_id: uid, date: dateStr, xp_earned: xp, breakdown: { gym: gymDone ? 40 : 0, habits: habitsCompleted * 12 }, multiplier: streak >= 7 ? 1.2 : 1.0, created_at: atLocal(dateStr, 23, 0) });
    }

    if (rand() < 0.5) {
      const hour = weekend ? randInt(10, 18) : pick([9, 11, 14, 16, 19]);
      const start = atLocal(dateStr, hour, 0);
      calendar.push({
        user_id: uid, title: pick(['Deep work', 'Gym', 'Mentor call', 'Family dinner', 'Interview prep', 'Study block', 'Standup']),
        start_time: start, end_time: new Date(new Date(start).getTime() + randInt(45, 120) * 60_000).toISOString(),
        completed: rand() < 0.6, all_day: false, event_type: pick(['event', 'task', 'reminder']),
        source_type: 'admin_simulated', description: '', location: pick(['Home', 'Gym', 'Cafe', 'Online', null]),
        system_type: pick(['work', 'health', 'finance', 'social', 'reflection', 'general']),
        tags: [], color: '#ff6b35', reminder_minutes: 30, timezone: 'Asia/Kolkata',
      });
    }

    // Discipline denser
    if (mood <= 3 && rand() < 0.55 || rand() < 0.22) {
      const started = atLocal(dateStr, randInt(14, 22), randInt(0, 50));
      const dur = randInt(180, 1200);
      urges.push({
        user_id: uid, category: pick(['phone_scroll', 'junk_food', 'procrastination']),
        started_at: started, resolved_at: new Date(new Date(started).getTime() + dur * 1000).toISOString(),
        trigger_tags: [weekend ? 'weekend' : 'weekday'], intensity: randInt(1, 5),
        outcome: pick(['resisted', 'acted', 'partial', 'still_riding']), duration_to_resolve_sec: dur,
        note: pick(['Surfed the urge', 'Went for a walk', 'Opened Instagram anyway', 'Replaced with pushups', 'HALT: hungry', 'Put phone in kitchen']),
        status: 'resolved',
      });
      disciplineLogs.push({
        user_id: uid, event_type: pick(['urge', 'checkin', 'reset']), trigger_type: 'habit',
        craving_intensity: randInt(1, 5), time_of_day: pick(['afternoon', 'evening', 'night']),
        notes: pick(['HALT check done', 'Replacement habit used', 'Logged craving', 'Urge surfing 10m', 'Cold shower reset']), created_at: started,
      });
    }

    // Lab — denser typing/reaction; speaking Tue/Fri; mindset often
    if (rand() < 0.72) {
      const wpm = clamp(Math.round(gauss(62, 10)), 35, 110);
      typing.push({
        user_id: uid, wpm, accuracy_pct: clamp(Number(gauss(94, 3).toFixed(1)), 80, 100),
        duration_sec: pick([30, 60, 60, 120]),
        taken_at: atLocal(dateStr, 15, randInt(0, 40)),
      });
    }
    if (rand() < 0.65) {
      const mean = clamp(Math.round(gauss(280, 40)), 120, 520);
      reaction.push({
        user_id: uid, trial_ms: [mean - 20, mean, mean + 15, mean - 10, mean + 5],
        mean_ms: mean, test_invalid: false, taken_at: atLocal(dateStr, 15, randInt(10, 50)),
      });
    }
    if (dow === 2 || dow === 5 || (weekend && rand() < 0.4)) {
      speaking.push({
        user_id: uid,
        confidence_score: clamp(Math.round(gauss(72, 8)), 40, 98),
        clarity_score: clamp(Math.round(gauss(75, 7)), 40, 98),
        pace_score: clamp(Math.round(gauss(70, 9)), 40, 98),
        prompt_id: null, audio_url: null,
        notes: pick(['Felt clearer', 'Rushed the opening', 'Good eye contact practice', 'Paused less']),
        logged_at: atLocal(dateStr, 18, 0),
      });
    }
    if (rand() < 0.48) {
      mindset.push({
        user_id: uid, state: pick(['clarity', 'growth', 'focus', 'scarcity', 'abundance', 'fear', 'noise', 'aimlessness']),
        note: pick(['After gym', 'Pre-interview', 'Sunday review', 'Post deep work', 'Family dinner calm']),
        logged_at: atLocal(dateStr, 20, randInt(0, 30)),
      });
    }
    if (dow === 0 || (learningDone && rand() < 0.25)) {
      reading.push({
        user_id: uid, title: pick(['Designing Data-Intensive Applications', 'Atomic Habits', 'The Almanack of Naval', 'Staff Engineer', 'Thinking Fast and Slow']),
        pages: randInt(8, 35), notes: pick(['Solid chapter', 'Skimmed examples', 'Took notes in Obsidian']),
        logged_at: atLocal(dateStr, 21, 0),
      });
    }
    if (i % 5 === 0) {
      aptitude.push({
        user_id: uid, category: pick(['quantitative', 'logical', 'verbal', 'spatial']),
        score: clamp(Math.round(gauss(78, 8)), 45, 99), created_at: atLocal(dateStr, 17, 0),
      });
    }
    if (i % 7 === 0) {
      pit.push({
        user_id: uid, challenge_id: `ch-${randInt(1, 20)}`, label: pick(['Cold shower', 'No sugar day', 'Inbox zero', '5km run']),
        xp_earned: randInt(15, 60), created_at: atLocal(dateStr, 19, 0),
      });
    }
    if (i % 10 === 0) {
      sysDesign.push({
        user_id: uid, prompt: pick(['Design a URL shortener', 'Design a rate limiter', 'Design WhatsApp']),
        response: 'Outlined components, data model, scaling path, and failure modes.',
        score: clamp(Math.round(gauss(7, 1.2)), 4, 10), created_at: atLocal(dateStr, 16, 0),
      });
    }

    if (learningDone && rand() < 0.3) {
      const [title, difficulty, topic, platform] = pick([
        ['Two Sum', 'easy', 'arrays', 'leetcode'], ['LRU Cache', 'medium', 'design', 'leetcode'],
        ['Course Schedule', 'medium', 'graphs', 'leetcode'], ['Word Search II', 'hard', 'trie', 'leetcode'],
      ]);
      dsaLogs.push({ user_id: uid, problem_title: title, difficulty, topic, platform, solved_at: atLocal(dateStr, 17, randInt(0, 40)) });
    }

    prev = { lateNight };
  }

  // Sync completedDates onto habits
  for (const h of habits) {
    h.meta.completedDates = [...(datesByHabit.get(h.id) || [])].sort();
  }

  const personality = [{
    user_id: uid, openness: 78, conscientiousness: 82, extraversion: 55, agreeableness: 70, neuroticism: 38,
    values: { growth: 9, family: 8, craft: 9, freedom: 7 }, created_at: atLocal(fmtDate(END), 12, 0),
  }];
  const labStreaks = [
    { user_id: uid, metric: 'typing', current_streak: 12, longest_streak: 21, last_logged_day: fmtDate(END), updated_at: new Date().toISOString() },
    { user_id: uid, metric: 'reaction', current_streak: 8, longest_streak: 14, last_logged_day: fmtDate(END), updated_at: new Date().toISOString() },
    { user_id: uid, metric: 'speaking', current_streak: 4, longest_streak: 9, last_logged_day: fmtDate(END), updated_at: new Date().toISOString() },
    { user_id: uid, metric: 'decisions', current_streak: 6, longest_streak: 11, last_logged_day: fmtDate(END), updated_at: new Date().toISOString() },
  ];
  const badges = [
    { user_id: uid, metric: 'typing', tier: 'silver', granted_at: atLocal(fmtDate(addDays(END, -20)), 12, 0) },
    { user_id: uid, metric: 'reaction', tier: 'bronze', granted_at: atLocal(fmtDate(addDays(END, -40)), 12, 0) },
    { user_id: uid, metric: 'speaking', tier: 'bronze', granted_at: atLocal(fmtDate(addDays(END, -28)), 12, 0) },
  ];
  const decisions = Array.from({ length: 18 }, (_, n) => {
    const day = fmtDate(addDays(END, -(n * 7 + randInt(0, 3))));
    return {
      user_id: uid, prompt_id: null,
      domain: pick(['money', 'opportunity', 'women', 'identity', 'society', 'fear']),
      response_text: pick([
        'Chose deep work over reactive Slack.',
        'Skipped dessert — sleep priority.',
        'Moved SIP date earlier this month.',
        'Called home before doomscrolling.',
        'Booked interview prep block instead of Netflix.',
        'Said no to a low-leverage coffee chat.',
      ]),
      quality_self: clamp(Math.round(gauss(3.5, 0.9)), 1, 5),
      responded_at: atLocal(day, 21, randInt(0, 40)),
    };
  });
  const beliefs = [
    { user_id: uid, domain: 'opportunity', prompt_id: randomUUID(), response_text: 'Craft compounds when I protect mornings.', quarter_anchor: fmtDate(addDays(END, -60)) },
    { user_id: uid, domain: 'identity', prompt_id: randomUUID(), response_text: 'Sleep is non-negotiable training.', quarter_anchor: fmtDate(addDays(END, -60)) },
    { user_id: uid, domain: 'money', prompt_id: randomUUID(), response_text: 'Pay myself first — SIP before lifestyle.', quarter_anchor: fmtDate(addDays(END, -30)) },
    { user_id: uid, domain: 'society', prompt_id: randomUUID(), response_text: 'Presence with family beats status posts.', quarter_anchor: fmtDate(addDays(END, -30)) },
    { user_id: uid, domain: 'fear', prompt_id: randomUUID(), response_text: 'Fear shrinks when I ship weekly.', quarter_anchor: fmtDate(addDays(END, -15)) },
  ];

  const taskRows = [
    'Polish Reports UX', 'Money category cleanup', 'Family vault docs scan', 'Interview prep sheet', 'Habit stack review', 'Net-worth check-in',
  ].map((title) => {
    const due = fmtDate(addDays(END, -randInt(0, 25)));
    return { user_id: uid, title, description: 'From weekly planning', due_date: due, completed: rand() < 0.5, source: 'seed', priority: pick(['normal', 'high', 'low']), created_at: atLocal(due, 9, 0), updated_at: atLocal(due, 18, 0) };
  });
  const noteRows = Array.from({ length: 14 }, (_, n) => {
    const day = fmtDate(addDays(END, -randInt(0, DAYS - 1)));
    const body = pick(DIARY);
    return { user_id: uid, title: pick(['Standup notes', 'Interview debrief', 'Weekend plan', 'Reading dump', 'Idea scratch']), content: body, body_text: body, type: 'note', source_type: 'admin_simulated', status: 'ready', completed: false, meta: { seed: true }, created_at: atLocal(day, 14, randInt(0, 50)), updated_at: atLocal(day, 14, randInt(0, 50)) };
  });

  const dsaProblems = [
    ['Two Sum', 'easy', 'arrays'], ['Valid Parentheses', 'easy', 'stack'], ['LRU Cache', 'medium', 'design'],
    ['Course Schedule', 'medium', 'graphs'], ['Merge Intervals', 'medium', 'intervals'], ['Word Search II', 'hard', 'trie'],
  ].map(([title, difficulty, topic]) => ({
    user_id: uid, title, platform: 'leetcode', difficulty, topic,
    solved_at: atLocal(fmtDate(addDays(END, -randInt(1, DAYS - 1))), 18, 0),
  }));

  const wealth = [
    { user_id: uid, asset_name: 'Nifty ETF', asset_type: 'mutual_fund', units: 48, current_value: 62000, invested_value: 54000 },
    { user_id: uid, asset_name: 'SGB Gold', asset_type: 'gold', units: 12, current_value: 78000, invested_value: 70000 },
    { user_id: uid, asset_name: 'Emergency FD', asset_type: 'fixed_deposit', units: 1, current_value: 100000, invested_value: 100000 },
  ];
  const savingsGoals = [
    { user_id: uid, name: 'Emergency fund', target_amount: 300000, current_amount: 125000, deadline: fmtDate(addDays(END, 120)), status: 'active' },
    { user_id: uid, name: 'Japan trip', target_amount: 150000, current_amount: 48000, deadline: fmtDate(addDays(END, 200)), status: 'active' },
  ];
  const financialGoals = [
    { user_id: uid, name: 'MacBook Pro', target_amount: 180000, current_amount: 52000, deadline: fmtDate(addDays(END, 90)), priority: 'high', status: 'active', icon: '💻' },
    { user_id: uid, name: 'SIP corpus', target_amount: 500000, current_amount: 128000, deadline: fmtDate(addDays(END, 365)), priority: 'medium', status: 'active', icon: '📊' },
  ];
  const moneyLent = [
    { user_id: uid, person_name: 'Rohan', amount: 2500, direction: 'lent', reason: 'Groceries split', date_given: fmtDate(addDays(END, -18)), date_due: fmtDate(addDays(END, 8)), status: 'pending', account_id: ids.accCash },
    { user_id: uid, person_name: 'Ananya', amount: 5000, direction: 'borrowed', reason: 'Short bridge', date_given: fmtDate(addDays(END, -35)), date_settled: fmtDate(addDays(END, -4)), status: 'settled', account_id: ids.accBank },
  ];

  const totalXp = xpLogs.reduce((a, r) => a + r.xp_earned, 0);
  console.log('planned:', {
    habits: habits.length, habit_logs: habitLogs.length, sessions: sessions.length, journals: journals.length,
    money: money.length, family: familyMembers.length, typing: typing.length, reaction: reaction.length,
    speaking: speaking.length, mindset: mindset.length, urges: urges.length, goals: goals.length,
    jobs: jobApps.length, reading: reading.length, decisions: decisions.length,
  });

  if (!CONFIRM) {
    console.log('\nDry-run. Write with: node scripts/seed-realistic-life.mjs --confirm');
    return;
  }

  console.log('\nWiping…');
  await wipe(uid, { full: false });

  console.log('Inserting…');
  await batchInsert('accounts', accounts);
  await batchInsert('money_categories', categories);
  await batchInsert('budgets', budgets);
  await batchInsert('recurring', recurring);
  await batchInsert('savings_goals', savingsGoals);
  await batchInsert('financial_goals', financialGoals);
  await softInsert('wealth_assets', wealth);
  await batchInsert('money_lent', moneyLent);
  await softInsert('account_balances', [
    { user_id: uid, account_name: 'HDFC Salary', balance: 214500, currency: 'INR', color: '#ff6b35' },
    { user_id: uid, account_name: 'Cash Wallet', balance: 3200, currency: 'INR', color: '#10b981' },
    { user_id: uid, account_name: 'Groww Demat', balance: 128400, currency: 'INR', color: '#6b7280' },
  ]);

  console.log(`  habits: ${await batchInsert('habits', habits)}`);
  console.log(`  routines: ${await batchInsert('routines', routines)}`);
  console.log(`  routine_habits: ${await batchInsert('routine_habits', routineHabits)}`);
  console.log(`  goals: ${await batchInsert('goals', goals)}`);
  await softInsert('resumes', resumes);
  await softInsert('job_applications', jobApps);

  await softInsert('family_members', familyMembers);
  await softInsert('family_health', familyHealth);
  await softInsert('family_insurance', familyInsurance);
  await softInsert('family_documents', familyDocs);
  await softInsert('family_finance', familyFinance);
  await softInsert('family_emergency_contacts', familyEmergency);
  await softInsert('family_vehicles', familyVehicles);
  await softInsert('family_relationships', familyRelationships);
  await softInsert('family_reminders', familyReminders);

  console.log(`  daily_logs: ${await batchInsert('daily_logs', dailyLogs)}`);
  console.log(`  habit_logs: ${await batchInsert('habit_logs', habitLogs)}`);
  console.log(`  sessions: ${await batchInsert('sessions', sessions)}`);
  await softInsert('study_sessions', studySessions);
  console.log(`  money_transactions: ${await batchInsert('money_transactions', money)}`);
  await softInsert('journal_entries', journals);
  console.log(`  calendar_events: ${await batchInsert('calendar_events', calendar)}`);
  console.log(`  wins: ${await batchInsert('wins', wins)}`);
  console.log(`  daily_commitments: ${await batchInsert('daily_commitments', commitments)}`);
  console.log(`  xp_log: ${await batchInsert('xp_log', xpLogs)}`);
  await softInsert('dsa_problems', dsaProblems);
  await softInsert('dsa_logs', dsaLogs);
  console.log(`  urge_events: ${await batchInsert('urge_events', urges)}`);
  console.log(`  discipline_logs: ${await batchInsert('discipline_logs', disciplineLogs)}`);
  console.log(`  net_worth: ${await batchInsert('net_worth_snapshots', netWorth)}`);
  console.log(`  tasks: ${await batchInsert('tasks', taskRows)}`);
  console.log(`  notes: ${await batchInsert('notes', noteRows)}`);

  // Lab
  await softInsert('lab_typing_tests', typing);
  await softInsert('lab_reaction_tests', reaction);
  await softInsert('lab_speaking_logs', speaking);
  await softInsert('lab_mindset_logs', mindset);
  await softInsert('lab_reading_log', reading);
  await softInsert('lab_aptitude_scores', aptitude);
  await softInsert('lab_pit_logs', pit);
  await softInsert('lab_system_design_logs', sysDesign);
  await softInsert('lab_personality_logs', personality);
  await softInsert('lab_decision_scenarios', decisions);
  await softInsert('lab_beliefs', beliefs);
  await softInsert('lab_streaks', labStreaks);
  await softInsert('lab_mastery_badges', badges);

  // Discipline streak (UI clocks from started_at)
  await softInsert('discipline_streaks', [{
    user_id: uid,
    addiction_type: 'phone_scroll',
    replacement_habit: 'Pushups + walk',
    streak_days: 9,
    longest_streak: 21,
    total_resets: 4,
    started_at: atLocal(fmtDate(addDays(END, -9)), 8, 0),
    updated_at: new Date().toISOString(),
  }]);

  // user_xp
  const xpPayload = {
    user_id: uid, total_xp: totalXp,
    current_rank: clamp(Math.floor(totalXp / 2000) + 1, 1, 10),
    power_level: clamp(Math.floor(totalXp / 100), 0, 999),
    longest_streak: 21, clean_streak: 9, last_xp_date: fmtDate(END), updated_at: new Date().toISOString(),
  };
  const { data: xpEx } = await supabase.from('user_xp').select('user_id').eq('user_id', uid).maybeSingle();
  if (xpEx) await supabase.from('user_xp').update(xpPayload).eq('user_id', uid);
  else await supabase.from('user_xp').insert(xpPayload);
  console.log('  user_xp: upserted', totalXp);

  console.log('\nDone. Hard refresh localhost — Habits / Family / Lab / Focus / Discipline / Journal / Goals.');
}

main().catch((e) => { console.error(e); process.exit(1); });
