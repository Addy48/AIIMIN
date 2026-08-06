#!/usr/bin/env node
/**
 * Full-feature synthetic history for one live OS account.
 *
 * Covers: daily_logs, habits(+logs), routines, money stack, journal/diary,
 * focus/study sessions, career (resumes + jobs), goals, family OS,
 * calendar, DSA, XP, wins, commitments, tasks, notes, urges.
 *
 * Usage:
 *   node scripts/seed-demo-history.mjs
 *   node scripts/seed-demo-history.mjs --confirm
 *   node scripts/seed-demo-history.mjs --wipe-only --confirm
 *
 * Env: SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY
 * Optional: SEED_USERNAME=AADI0837 | SEED_USER_ID | SEED_DAYS=150 | SEED_END=2026-07-17
 */
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { resolve } from 'node:path';
import { randomUUID } from 'node:crypto';

dotenv.config({ path: process.env.DOTENV_CONFIG_PATH || resolve(process.cwd(), '.env') });
try {
  dotenv.config({ path: resolve(process.cwd(), '.env.local'), override: true });
} catch {
  /* optional */
}

const CONFIRM = process.argv.includes('--confirm');
const WIPE_ONLY = process.argv.includes('--wipe-only');
const DAYS = Number(process.env.SEED_DAYS || 180);
const END = parseDate(process.env.SEED_END || '2026-07-17');
const START = addDays(END, -(DAYS - 1));

const SUPABASE_URL = process.env.SUPABASE_URL;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!SUPABASE_URL || !SERVICE_KEY) {
  console.error('Need SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY in root .env');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_KEY, {
  auth: { persistSession: false, autoRefreshToken: false },
});

const LEARNING = [
  'System design',
  'DSA graphs',
  'React performance',
  'Postgres indexing',
  'Auth flows',
  'Product writing',
  'Trading psychology',
  'Kalman filters',
];
const DIARY = [
  'Morning felt sharp after 7h sleep. Protected deep work before noon.',
  'Low mood midweek. Short walk + water fixed more than I expected.',
  'Gym streak holding. Energy climbs on training days — obvious now.',
  'Spent freely on weekend food. Not regret, just notice the pattern.',
  'Family call tonight. Anchored the day.',
  'Job hunt week: one application, one resume tweak.',
  'Quiet diary day. Kept habits, skipped heroics.',
  'Focus block 90m. Phone stayed in another room.',
];
const COMPANIES = [
  ['Stripe', 'Software Engineer'],
  ['Razorpay', 'Backend Engineer'],
  ['Google', 'SWE Intern'],
  ['Atlassian', 'Full Stack Engineer'],
  ['Notion', 'Product Engineer'],
  ['Zerodha', 'Frontend Engineer'],
  ['Microsoft', 'SDE'],
  ['Flipkart', 'SDE-1'],
  ['Postman', 'Developer Experience'],
  ['Cred', 'Full Stack'],
];
const DSA = [
  ['Two Sum', 'easy', 'arrays', 'leetcode'],
  ['Valid Parentheses', 'easy', 'stack', 'leetcode'],
  ['LRU Cache', 'medium', 'design', 'leetcode'],
  ['Course Schedule', 'medium', 'graphs', 'leetcode'],
  ['Word Search II', 'hard', 'trie', 'leetcode'],
  ['Merge Intervals', 'medium', 'intervals', 'leetcode'],
  ['Binary Search', 'easy', 'search', 'leetcode'],
  ['Dijkstra practice', 'medium', 'graphs', 'gfg'],
];

function parseDate(s) {
  const [y, m, d] = s.split('-').map(Number);
  return new Date(Date.UTC(y, m - 1, d));
}
function fmtDate(d) {
  return d.toISOString().slice(0, 10);
}
function addDays(d, n) {
  const x = new Date(d);
  x.setUTCDate(x.getUTCDate() + n);
  return x;
}
function clamp(n, lo, hi) {
  return Math.max(lo, Math.min(hi, n));
}
function rand() {
  return Math.random();
}
function randInt(lo, hi) {
  return Math.floor(rand() * (hi - lo + 1)) + lo;
}
function pick(arr) {
  return arr[randInt(0, arr.length - 1)];
}
function gauss(mean, sd) {
  const u = 1 - rand();
  const v = 1 - rand();
  return mean + sd * Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
}
function pad(n) {
  return String(n).padStart(2, '0');
}
function atLocal(dateStr, hour, minute = 0) {
  const [y, m, d] = dateStr.split('-').map(Number);
  return new Date(Date.UTC(y, m - 1, d, hour - 5, minute - 30)).toISOString();
}
function serializeJournal(mode, payload) {
  return JSON.stringify({ v: 2, mode, seed: true, ...payload });
}

async function resolveUser() {
  if (process.env.SEED_USER_ID) {
    const { data, error } = await supabase
      .from('users')
      .select('id, email, username, full_name')
      .eq('id', process.env.SEED_USER_ID)
      .maybeSingle();
    if (error) throw error;
    if (!data) throw new Error(`No user SEED_USER_ID=${process.env.SEED_USER_ID}`);
    return data;
  }
  const username = process.env.SEED_USERNAME || 'AADI0837';
  const { data, error } = await supabase
    .from('users')
    .select('id, email, username, full_name')
    .eq('username', username)
    .maybeSingle();
  if (error) throw error;
  if (!data) throw new Error(`No user username=${username}`);
  return data;
}

async function batchInsert(table, rows, chunkSize = 400) {
  if (!rows.length) return 0;
  let n = 0;
  for (let i = 0; i < rows.length; i += chunkSize) {
    const chunk = rows.slice(i, i + chunkSize);
    const { error } = await supabase.from(table).insert(chunk);
    if (error) throw new Error(`${table}: ${error.message}`);
    n += chunk.length;
  }
  return n;
}

async function softInsert(table, rows) {
  try {
    const n = await batchInsert(table, rows);
    console.log(`  ${table}: ${n}`);
    return n;
  } catch (err) {
    console.warn(`  ${table}: SKIPPED — ${err.message}`);
    return 0;
  }
}

async function del(label, query) {
  const { error } = await query;
  if (error) throw new Error(`wipe ${label}: ${error.message}`);
  console.log(`  wiped ${label}`);
}

async function wipeSeed(userId) {
  const startStr = fmtDate(START);
  const endStr = fmtDate(END);
  const startIso = `${startStr}T00:00:00.000Z`;
  const endIso = `${endStr}T23:59:59.999Z`;

  // Children / time-series first
  await del(
    'habit_logs window',
    supabase.from('habit_logs').delete().eq('user_id', userId).gte('completed_at', startIso).lte('completed_at', endIso),
  );
  const { data: seedRoutines } = await supabase
    .from('routines')
    .select('id')
    .eq('user_id', userId)
    .like('name', 'Seed %');
  if (seedRoutines?.length) {
    const ids = seedRoutines.map((r) => r.id);
    await del('routine_habits', supabase.from('routine_habits').delete().in('routine_id', ids));
    await del('routines', supabase.from('routines').delete().in('id', ids));
  }

  await del(
    'habit_stacks',
    supabase.from('habit_stacks').delete().eq('user_id', userId).like('name', 'Seed %'),
  );
  await del(
    'replacement_habits',
    supabase.from('replacement_habits').delete().eq('user_id', userId).like('habit_name', 'Seed %'),
  );
  await del(
    'habits meta.seed',
    supabase.from('habits').delete().eq('user_id', userId).contains('meta', { seed: true }),
  );

  await del(
    'daily_logs seed',
    supabase
      .from('daily_logs')
      .delete()
      .eq('user_id', userId)
      .eq('source_type', 'admin_simulated')
      .gte('date', startStr)
      .lte('date', endStr),
  );
  await del(
    'sessions seed',
    supabase
      .from('sessions')
      .delete()
      .eq('user_id', userId)
      .eq('source_type', 'admin_simulated')
      .gte('started_at', startIso)
      .lte('started_at', endIso),
  );
  await del(
    'study_sessions window',
    supabase.from('study_sessions').delete().eq('user_id', userId).gte('started_at', startIso).lte('started_at', endIso),
  );
  await del(
    'wins seed',
    supabase
      .from('wins')
      .delete()
      .eq('user_id', userId)
      .eq('source_type', 'admin_simulated')
      .gte('date', startStr)
      .lte('date', endStr),
  );
  await del(
    'daily_commitments seed',
    supabase
      .from('daily_commitments')
      .delete()
      .eq('user_id', userId)
      .eq('source_type', 'admin_simulated')
      .gte('date', startStr)
      .lte('date', endStr),
  );
  await del(
    'journal_entries seed',
    supabase
      .from('journal_entries')
      .delete()
      .eq('user_id', userId)
      .gte('date', startStr)
      .lte('date', endStr)
      .filter('encrypted_content', 'ilike', '%"seed":true%'),
  );
  await del(
    'money_transactions seed',
    supabase
      .from('money_transactions')
      .delete()
      .eq('user_id', userId)
      .eq('source', 'seed')
      .gte('date', startStr)
      .lte('date', endStr),
  );
  await del('recurring seed', supabase.from('recurring').delete().eq('user_id', userId).like('name', 'Seed %'));
  await del('money_lent seed', supabase.from('money_lent').delete().eq('user_id', userId).like('person_name', 'Seed %'));
  await del(
    'savings_goals seed',
    supabase.from('savings_goals').delete().eq('user_id', userId).like('name', 'Seed %'),
  );
  await del(
    'financial_goals seed',
    supabase.from('financial_goals').delete().eq('user_id', userId).like('name', 'Seed %'),
  );
  await del(
    'wealth_assets seed',
    supabase.from('wealth_assets').delete().eq('user_id', userId).like('asset_name', 'Seed %'),
  );
  await del(
    'net_worth_snapshots window',
    supabase
      .from('net_worth_snapshots')
      .delete()
      .eq('user_id', userId)
      .gte('snapshot_date', startStr)
      .lte('snapshot_date', endStr),
  );
  await del(
    'account_balances seed',
    supabase.from('account_balances').delete().eq('user_id', userId).like('account_name', 'Seed %'),
  );
  const { data: seedCats } = await supabase
    .from('money_categories')
    .select('id')
    .eq('user_id', userId)
    .like('name', 'Seed %');
  if (seedCats?.length) {
    const cids = seedCats.map((c) => c.id);
    await del('budgets seed', supabase.from('budgets').delete().eq('user_id', userId).in('category_id', cids));
    await del('money_categories seed', supabase.from('money_categories').delete().in('id', cids));
  }
  await del('accounts seed', supabase.from('accounts').delete().eq('user_id', userId).like('name', 'Seed %'));

  await del('job_applications seed', supabase.from('job_applications').delete().eq('user_id', userId).like('notes', '%[seed]%'));
  await del('resumes seed', supabase.from('resumes').delete().eq('user_id', userId).like('title', 'Seed %'));

  await del('goals meta.seed', supabase.from('goals').delete().eq('user_id', userId).contains('meta', { seed: true }));

  // Family: wipe by SEED phone marker + dependents
  const { data: seedMembers } = await supabase
    .from('family_members')
    .select('id')
    .eq('user_id', userId)
    .like('phone', 'SEED-%');
  if (seedMembers?.length) {
    const mids = seedMembers.map((m) => m.id);
    for (const t of ['family_health', 'family_insurance', 'family_documents', 'family_finance']) {
      await del(t, supabase.from(t).delete().eq('user_id', userId).in('member_id', mids));
    }
    await del('family_members', supabase.from('family_members').delete().in('id', mids));
  }
  await del(
    'family_reminders seed',
    supabase.from('family_reminders').delete().eq('user_id', userId).eq('source_type', 'admin_simulated'),
  );
  await del(
    'family_emergency seed',
    supabase.from('family_emergency_contacts').delete().eq('user_id', userId).like('phone', 'SEED-%'),
  );
  await del(
    'family_vehicles seed',
    supabase.from('family_vehicles').delete().eq('user_id', userId).like('registration_number', 'SEED%'),
  );
  await del(
    'family_relationships seed',
    supabase.from('family_relationships').delete().eq('user_id', userId).like('notes', '%[seed]%'),
  );

  await del(
    'calendar_events seed',
    supabase
      .from('calendar_events')
      .delete()
      .eq('user_id', userId)
      .eq('source_type', 'admin_simulated')
      .gte('start_time', startIso)
      .lte('start_time', endIso),
  );
  await del(
    'dsa_logs window',
    supabase.from('dsa_logs').delete().eq('user_id', userId).gte('solved_at', startIso).lte('solved_at', endIso),
  );
  await del(
    'dsa_problems seed',
    supabase.from('dsa_problems').delete().eq('user_id', userId).like('title', 'Seed %'),
  );
  await del(
    'urge_events window',
    supabase.from('urge_events').delete().eq('user_id', userId).gte('started_at', startIso).lte('started_at', endIso),
  );
  await del(
    'discipline_logs window',
    supabase.from('discipline_logs').delete().eq('user_id', userId).gte('created_at', startIso).lte('created_at', endIso),
  );
  await del('xp_log window', supabase.from('xp_log').delete().eq('user_id', userId).gte('date', startStr).lte('date', endStr));
  await del('tasks seed', supabase.from('tasks').delete().eq('user_id', userId).eq('source', 'seed'));
  await del('notes seed', supabase.from('notes').delete().eq('user_id', userId).eq('source_type', 'admin_simulated'));
}

function buildStatic(userId) {
  const ids = {
    accBank: randomUUID(),
    accCash: randomUUID(),
    accInvest: randomUUID(),
    catFood: randomUUID(),
    catTransport: randomUUID(),
    catRent: randomUUID(),
    catFun: randomUUID(),
    catIncome: randomUUID(),
    catHealth: randomUUID(),
    catShop: randomUUID(),
    habitWater: randomUUID(),
    habitMed: randomUUID(),
    habitRun: randomUUID(),
    habitRead: randomUUID(),
    habitJournal: randomUUID(),
    habitGym: randomUUID(),
    habitNoPhone: randomUUID(),
    habitProtein: randomUUID(),
    routineMorning: randomUUID(),
    resumeGeneral: randomUUID(),
    resumeBackend: randomUUID(),
    resumeFrontend: randomUUID(),
    memberMom: randomUUID(),
    memberDad: randomUUID(),
    memberSib: randomUUID(),
  };

  const accounts = [
    {
      id: ids.accBank,
      user_id: userId,
      name: 'Seed HDFC Salary',
      type: 'bank',
      currency: 'INR',
      balance: 185000,
      icon: '🏦',
      color: '#ff6b35',
      is_default: true,
    },
    {
      id: ids.accCash,
      user_id: userId,
      name: 'Seed Cash Wallet',
      type: 'cash',
      currency: 'INR',
      balance: 4500,
      icon: '💵',
      color: '#10b981',
    },
    {
      id: ids.accInvest,
      user_id: userId,
      name: 'Seed Groww',
      type: 'investment',
      currency: 'INR',
      balance: 92000,
      icon: '📈',
      color: '#6b7280',
    },
  ];

  const categories = [
    { id: ids.catFood, user_id: userId, name: 'Seed Food', icon: '🍽️', color: '#ff6b35', type: 'expense' },
    { id: ids.catTransport, user_id: userId, name: 'Seed Transport', icon: '🚗', color: '#6b7280', type: 'expense' },
    { id: ids.catRent, user_id: userId, name: 'Seed Rent', icon: '🏠', color: '#2d2d2d', type: 'expense' },
    { id: ids.catFun, user_id: userId, name: 'Seed Fun', icon: '🎮', color: '#ff6b35', type: 'expense' },
    { id: ids.catHealth, user_id: userId, name: 'Seed Health', icon: '💊', color: '#10b981', type: 'expense' },
    { id: ids.catShop, user_id: userId, name: 'Seed Shopping', icon: '🛍️', color: '#6b7280', type: 'expense' },
    { id: ids.catIncome, user_id: userId, name: 'Seed Income', icon: '💰', color: '#10b981', type: 'income' },
  ];

  const budgets = [
    { user_id: userId, category_id: ids.catFood, amount: 12000, period: 'monthly', start_date: fmtDate(START), alert_threshold: 80 },
    { user_id: userId, category_id: ids.catTransport, amount: 4000, period: 'monthly', start_date: fmtDate(START), alert_threshold: 80 },
    { user_id: userId, category_id: ids.catFun, amount: 5000, period: 'monthly', start_date: fmtDate(START), alert_threshold: 90 },
    { user_id: userId, category_id: ids.catHealth, amount: 3000, period: 'monthly', start_date: fmtDate(START), alert_threshold: 80 },
  ];

  const recurring = [
    {
      user_id: userId,
      name: 'Seed Netflix',
      amount: 649,
      category_id: ids.catFun,
      frequency: 'monthly',
      next_due_date: fmtDate(addDays(END, 5)),
      active: true,
      account_id: ids.accBank,
      type: 'expense',
    },
    {
      user_id: userId,
      name: 'Seed Rent',
      amount: 22000,
      category_id: ids.catRent,
      frequency: 'monthly',
      next_due_date: fmtDate(addDays(END, 3)),
      active: true,
      account_id: ids.accBank,
      type: 'expense',
    },
    {
      user_id: userId,
      name: 'Seed Gym membership',
      amount: 1499,
      category_id: ids.catHealth,
      frequency: 'monthly',
      next_due_date: fmtDate(addDays(END, 12)),
      active: true,
      account_id: ids.accBank,
      type: 'expense',
    },
  ];

  const savingsGoals = [
    {
      user_id: userId,
      name: 'Seed Emergency fund',
      target_amount: 300000,
      current_amount: 125000,
      deadline: fmtDate(addDays(END, 120)),
      status: 'active',
    },
    {
      user_id: userId,
      name: 'Seed Japan trip',
      target_amount: 150000,
      current_amount: 42000,
      deadline: fmtDate(addDays(END, 200)),
      status: 'active',
    },
  ];

  const financialGoals = [
    {
      user_id: userId,
      name: 'Seed Laptop upgrade',
      target_amount: 120000,
      current_amount: 38000,
      deadline: fmtDate(addDays(END, 90)),
      priority: 'high',
      status: 'active',
      icon: '💻',
    },
    {
      user_id: userId,
      name: 'Seed Mutual fund SIP',
      target_amount: 500000,
      current_amount: 92000,
      deadline: fmtDate(addDays(END, 365)),
      priority: 'medium',
      status: 'active',
      icon: '📊',
    },
  ];

  const wealth = [
    {
      user_id: userId,
      asset_name: 'Seed Nifty ETF',
      asset_type: 'mutual_fund',
      units: 42,
      current_value: 58000,
      invested_value: 51000,
    },
    {
      user_id: userId,
      asset_name: 'Seed Gold SGB',
      asset_type: 'gold',
      units: 10,
      current_value: 72000,
      invested_value: 68000,
    },
    {
      user_id: userId,
      asset_name: 'Seed FD',
      asset_type: 'fixed_deposit',
      units: 1,
      current_value: 100000,
      invested_value: 100000,
    },
  ];

  const moneyLent = [
    {
      user_id: userId,
      person_name: 'Seed Roommate',
      amount: 2500,
      direction: 'lent',
      reason: 'Groceries split',
      date_given: fmtDate(addDays(END, -20)),
      date_due: fmtDate(addDays(END, 10)),
      status: 'pending',
      account_id: ids.accCash,
    },
    {
      user_id: userId,
      person_name: 'Seed Cousin',
      amount: 8000,
      direction: 'borrowed',
      reason: 'Short bridge',
      date_given: fmtDate(addDays(END, -40)),
      date_settled: fmtDate(addDays(END, -5)),
      status: 'settled',
      account_id: ids.accBank,
    },
  ];

  const accountBalances = [
    { user_id: userId, account_name: 'Seed HDFC Salary', balance: 185000, currency: 'INR', color: '#ff6b35' },
    { user_id: userId, account_name: 'Seed Cash Wallet', balance: 4500, currency: 'INR', color: '#10b981' },
    { user_id: userId, account_name: 'Seed Groww', balance: 92000, currency: 'INR', color: '#6b7280' },
  ];

  const habits = [
    { id: ids.habitWater, user_id: userId, name: 'Seed Drink Water', emoji: '💧', category: 'Health', frequency: 'daily', status: 'active', meta: { seed: true, color: '#06B6D4', description: 'Hydration target', target: 7, completedDates: [] } },
    { id: ids.habitMed, user_id: userId, name: 'Seed Meditation', emoji: '🧘', category: 'Mindset', frequency: 'daily', status: 'active', meta: { seed: true, color: '#8B5CF6', description: '10 min stillness', target: 7, completedDates: [] } },
    { id: ids.habitRun, user_id: userId, name: 'Seed Morning Run', emoji: '🏃', category: 'Health', frequency: 'daily', status: 'active', meta: { seed: true, color: '#22C55E', description: 'Easy aerobic miles', target: 5, completedDates: [] } },
    { id: ids.habitRead, user_id: userId, name: 'Seed Read 20 pages', emoji: '📚', category: 'Learning', frequency: 'daily', status: 'active', meta: { seed: true, color: '#3B82F6', description: 'Books / papers', target: 7, completedDates: [] } },
    { id: ids.habitJournal, user_id: userId, name: 'Seed Diary write', emoji: '✍️', category: 'Mindset', frequency: 'daily', status: 'active', meta: { seed: true, color: '#F59E0B', description: 'Daily reflection', target: 7, completedDates: [] } },
    { id: ids.habitGym, user_id: userId, name: 'Seed Gym', emoji: '🏋️', category: 'Health', frequency: 'daily', status: 'active', meta: { seed: true, color: '#EF4444', description: 'Strength session', target: 4, completedDates: [] } },
    { id: ids.habitNoPhone, user_id: userId, name: 'Seed No phone first hour', emoji: '📵', category: 'Focus', frequency: 'daily', status: 'active', meta: { seed: true, color: '#EC4899', description: 'Protect morning', target: 7, completedDates: [] } },
    { id: ids.habitProtein, user_id: userId, name: 'Seed Protein target', emoji: '🥩', category: 'Health', frequency: 'daily', status: 'active', meta: { seed: true, color: '#F97316', description: 'Hit macros', target: 7, completedDates: [] } },
  ];

  const routines = [{ id: ids.routineMorning, user_id: userId, name: 'Seed Morning Stack', time_of_day: 'morning' }];
  const routineHabits = [
    { routine_id: ids.routineMorning, habit_id: ids.habitNoPhone, position: 0 },
    { routine_id: ids.routineMorning, habit_id: ids.habitWater, position: 1 },
    { routine_id: ids.routineMorning, habit_id: ids.habitMed, position: 2 },
    { routine_id: ids.routineMorning, habit_id: ids.habitJournal, position: 3 },
  ];
  const habitStacks = [
    {
      user_id: userId,
      name: 'Seed AM Focus Stack',
      habit_ids: [ids.habitNoPhone, ids.habitMed, ids.habitRead],
    },
  ];
  const replacementHabits = [
    {
      user_id: userId,
      habit_name: 'Seed Walk outside',
      habit_id: ids.habitRun,
      linked_to_addiction: 'phone_scroll',
    },
  ];

  const goals = [
    {
      user_id: userId,
      metric: 'Ship AIIMIN tester E2E',
      target: 100,
      frequency: 'monthly',
      start_date: fmtDate(START),
      meta: {
        seed: true,
        title: 'Ship AIIMIN tester E2E',
        pillar: 'career',
        priority: 'High',
        status: 'On Track',
        category: 'career',
        targetDate: fmtDate(addDays(END, 45)),
        why: 'Close the loop before public launch.',
        milestones: [
          { text: 'Login E2E green', done: true },
          { text: 'Finance seed verified', done: true },
          { text: 'Habits heatmap live', done: false },
          { text: 'Tester checklist signed', done: false },
        ],
        progress: 50,
      },
    },
    {
      user_id: userId,
      metric: 'Read 12 books this year',
      target: 12,
      frequency: 'yearly',
      start_date: fmtDate(START),
      meta: {
        seed: true,
        title: 'Read 12 books this year',
        pillar: 'academic',
        priority: 'Medium',
        status: 'Active',
        category: 'learning',
        targetDate: fmtDate(addDays(END, 200)),
        why: 'Keep learning depth high.',
        milestones: [
          { text: 'Finish Atomic Habits', done: true },
          { text: 'Finish Designing Data-Intensive Apps', done: false },
          { text: 'Quarterly reading review', done: false },
        ],
        progress: 33,
      },
    },
    {
      user_id: userId,
      metric: '150 gym sessions',
      target: 150,
      frequency: 'yearly',
      start_date: fmtDate(START),
      meta: {
        seed: true,
        title: '150 gym sessions',
        pillar: 'health',
        priority: 'High',
        status: 'On Track',
        category: 'health',
        targetDate: fmtDate(addDays(END, 180)),
        why: 'Strength compounds.',
        milestones: [
          { text: 'Hit 40 sessions', done: true },
          { text: 'Hit 80 sessions', done: false },
          { text: 'Hit 150 sessions', done: false },
        ],
        progress: 28,
      },
    },
    {
      user_id: userId,
      metric: 'Land SWE offer',
      target: 1,
      frequency: 'yearly',
      start_date: fmtDate(START),
      meta: {
        seed: true,
        title: 'Land SWE offer',
        pillar: 'career',
        priority: 'High',
        status: 'At Risk',
        category: 'career',
        targetDate: fmtDate(addDays(END, 90)),
        why: 'Career optionality.',
        milestones: [
          { text: 'Resume v3 ready', done: true },
          { text: '10 applications', done: true },
          { text: '3 interviews', done: false },
          { text: 'Offer signed', done: false },
        ],
        progress: 40,
      },
    },
    {
      user_id: userId,
      metric: 'Daily journaling streak 60',
      target: 60,
      frequency: 'monthly',
      start_date: fmtDate(START),
      meta: {
        seed: true,
        title: 'Daily journaling streak 60',
        pillar: 'personal',
        priority: 'Medium',
        status: 'Active',
        category: 'mindset',
        targetDate: fmtDate(addDays(END, 60)),
        why: 'Clarity compounds.',
        milestones: [
          { text: '14-day streak', done: true },
          { text: '30-day streak', done: false },
          { text: '60-day streak', done: false },
        ],
        progress: 25,
      },
    },
    {
      user_id: userId,
      metric: 'Emergency fund ₹3L',
      target: 300000,
      frequency: 'yearly',
      start_date: fmtDate(START),
      meta: {
        seed: true,
        title: 'Emergency fund ₹3L',
        pillar: 'personal',
        priority: 'High',
        status: 'On Track',
        category: 'finance',
        targetDate: fmtDate(addDays(END, 150)),
        why: 'Sleep better with runway.',
        milestones: [
          { text: '₹1L parked', done: true },
          { text: '₹2L parked', done: false },
          { text: '₹3L parked', done: false },
        ],
        progress: 42,
      },
    },
  ];

  const resumes = [
    {
      id: ids.resumeGeneral,
      user_id: userId,
      title: 'Seed General SWE Resume',
      target_role: 'Software Engineer',
      link_url: 'https://example.com/seed-resume-general.pdf',
    },
    {
      id: ids.resumeBackend,
      user_id: userId,
      title: 'Seed Backend Resume',
      target_role: 'Backend Engineer',
      link_url: 'https://example.com/seed-resume-backend.pdf',
    },
    {
      id: ids.resumeFrontend,
      user_id: userId,
      title: 'Seed Frontend Resume',
      target_role: 'Frontend Engineer',
      link_url: 'https://example.com/seed-resume-frontend.pdf',
    },
  ];

  const jobApps = COMPANIES.map(([company, role], i) => {
    const applied = fmtDate(addDays(END, -(10 + i * 7)));
    const statuses = ['applied', 'wishlist', 'interview', 'rejected', 'offer', 'applied'];
    const resumeId = i % 3 === 0 ? ids.resumeBackend : i % 3 === 1 ? ids.resumeFrontend : ids.resumeGeneral;
    return {
      user_id: userId,
      company_name: company,
      role_title: role,
      status: statuses[i % statuses.length],
      notes: `[seed] Applied via careers page. Round notes TBD.`,
      applied_at: applied,
      resume_id: resumeId,
      linkedin_url: `https://linkedin.com/jobs/view/seed-${i}`,
      job_post_url: `https://example.com/jobs/seed-${i}`,
    };
  });

  const familyMembers = [
    {
      id: ids.memberMom,
      user_id: userId,
      name: 'Seed Mom',
      relation: 'mother',
      dob: '1975-04-12',
      blood_group: 'B+',
      phone: 'SEED-9000000001',
    },
    {
      id: ids.memberDad,
      user_id: userId,
      name: 'Seed Dad',
      relation: 'father',
      dob: '1972-09-03',
      blood_group: 'O+',
      phone: 'SEED-9000000002',
    },
    {
      id: ids.memberSib,
      user_id: userId,
      name: 'Seed Sibling',
      relation: 'sibling',
      dob: '2004-01-22',
      blood_group: 'B+',
      phone: 'SEED-9000000003',
    },
  ];

  const familyHealth = [
    {
      user_id: userId,
      member_id: ids.memberMom,
      allergies: 'None known',
      conditions: 'Hypertension (managed)',
      medications: 'Amlodipine',
      doctor_name: 'Dr Seed',
      doctor_phone: 'SEED-DOC-1',
    },
    {
      user_id: userId,
      member_id: ids.memberDad,
      allergies: 'Penicillin',
      conditions: 'None',
      medications: '',
      doctor_name: 'Dr Seed',
      doctor_phone: 'SEED-DOC-1',
    },
  ];

  const familyInsurance = [
    {
      user_id: userId,
      member_id: ids.memberDad,
      policy_name: 'Seed Family Floater',
      provider: 'Seed Health Insure',
      policy_number: 'SEED-POL-1001',
      premium_amount: 18000,
      renewal_date: fmtDate(addDays(END, 60)),
      nominee: 'Seed Mom',
    },
  ];

  const familyDocs = [
    {
      user_id: userId,
      member_id: ids.memberDad,
      doc_type: 'passport',
      doc_number: 'SEEDPASS001',
      expiry_date: fmtDate(addDays(END, 800)),
      issue_date: '2019-06-01',
      issuing_country: 'IN',
      notes: '[seed]',
    },
  ];

  const familyFinance = [
    {
      user_id: userId,
      member_id: ids.memberDad,
      account_type: 'savings',
      institution_name: 'Seed SBI',
      account_number: 'SEED-XXXX-7788',
      current_balance: 250000,
      notes: '[seed]',
    },
  ];

  const familyEmergency = [
    {
      user_id: userId,
      name: 'Seed Uncle',
      relation_or_role: 'uncle',
      phone: 'SEED-9000000099',
      notes: 'Primary emergency',
      is_pinned: true,
    },
  ];

  const familyVehicles = [
    {
      user_id: userId,
      make_model: 'Seed Honda City',
      registration_number: 'SEEDMH12AB1234',
      insurance_provider: 'Seed Auto',
      insurance_expiry: fmtDate(addDays(END, 90)),
      puc_expiry: fmtDate(addDays(END, 40)),
      service_due_date: fmtDate(addDays(END, 25)),
    },
  ];

  const familyRelationships = [
    {
      user_id: userId,
      name: 'Seed Best Friend',
      relation_type: 'friend',
      birthday: '2001-11-08',
      last_contacted: fmtDate(addDays(END, -4)),
      notes: '[seed] Weekly catch-up',
    },
  ];

  const familyReminders = [
    {
      user_id: userId,
      title: 'Seed Mom birthday prep',
      description: 'Call + gift',
      due_date: fmtDate(addDays(END, 14)),
      is_auto_generated: false,
      source_type: 'admin_simulated',
      completed: false,
    },
    {
      user_id: userId,
      title: 'Seed Insurance renewal',
      description: 'Family floater',
      due_date: fmtDate(addDays(END, 55)),
      is_auto_generated: true,
      source_type: 'admin_simulated',
      completed: false,
    },
  ];

  const dsaProblems = DSA.map(([title, difficulty, topic, platform]) => ({
    user_id: userId,
    title: `Seed ${title}`,
    platform,
    difficulty,
    topic,
    solved_at: atLocal(fmtDate(addDays(END, -randInt(1, DAYS - 1))), 18, 0),
  }));

  return {
    ids,
    accounts,
    categories,
    budgets,
    recurring,
    savingsGoals,
    financialGoals,
    wealth,
    moneyLent,
    accountBalances,
    habits,
    routines,
    routineHabits,
    habitStacks,
    replacementHabits,
    goals,
    resumes,
    jobApps,
    familyMembers,
    familyHealth,
    familyInsurance,
    familyDocs,
    familyFinance,
    familyEmergency,
    familyVehicles,
    familyRelationships,
    familyReminders,
    dsaProblems,
  };
}

function buildTimeline(userId, ids) {
  const expenseCats = [
    [ids.catFood, 'Seed Food', 80, 450],
    [ids.catTransport, 'Seed Transport', 40, 280],
    [ids.catFun, 'Seed Fun', 120, 900],
    [ids.catHealth, 'Seed Health', 100, 700],
    [ids.catShop, 'Seed Shopping', 300, 2500],
  ];

  const dailyLogs = [];
  const habitLogs = [];
  const sessions = [];
  const studySessions = [];
  const money = [];
  const wins = [];
  const commitments = [];
  const journals = [];
  const xpLogs = [];
  const calendar = [];
  const dsaLogs = [];
  const urges = [];
  const disciplineLogs = [];
  const netWorth = [];
  const tasks = [];
  const notes = [];

  let prev = { lateNight: false };
  let streak = 0;
  let nw = 350000;

  const habitDefs = [
    [ids.habitWater, 8, 0.92],
    [ids.habitMed, 7, 0.8],
    [ids.habitJournal, 21, 0.72],
    [ids.habitNoPhone, 6, 0.7],
    [ids.habitRead, 20, 0.65],
    [ids.habitProtein, 13, 0.75],
    [ids.habitRun, 6, 0.5],
    [ids.habitGym, 18, 0.55],
  ];

  for (let i = 0; i < DAYS; i++) {
    const date = addDays(START, i);
    const dateStr = fmtDate(date);
    const dow = date.getUTCDay();
    const weekend = dow === 0 || dow === 6;

    const weekWave = 6.2 + 0.9 * Math.sin((2 * Math.PI * i) / 7);
    const sleepHours = clamp(
      Number((gauss(weekend ? 7.8 : 6.9, 0.85) + (prev.lateNight ? -0.8 : 0)).toFixed(2)),
      4.5,
      9.5,
    );
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
      const forceGym = hid === ids.habitGym && gymDone;
      const forceRun = hid === ids.habitRun && gymDone && rand() < 0.3;
      const done = forceGym || forceRun || rand() < rate;
      if (!done) continue;
      habitsCompleted += 1;
      habitLogs.push({
        habit_id: hid,
        user_id: userId,
        completed_at: atLocal(dateStr, hour, randInt(0, 40)),
        status: 'done',
        session: hour < 12 ? 'morning' : 'evening',
      });
    }
    streak = habitsCompleted >= 4 ? streak + 1 : 0;

    const breakfastDone = rand() < (weekend ? 0.55 : 0.8);
    const steps = Math.round(clamp(gauss(gymDone ? 9500 : weekend ? 7000 : 5500, 1800), 1200, 18000));
    const waterBottles = clamp(Math.round(gauss(habitsCompleted >= 1 ? 7 : 3.5, 1.4)), 1, 12);
    const learningDone = energy >= 5 && rand() < (weekend ? 0.35 : 0.7);
    const learningTopic = learningDone ? pick(LEARNING) : null;

    const focusCount =
      energy >= 5 ? (rand() < 0.9 ? randInt(1, 3) : 1) : energy >= 3 && rand() < 0.55 ? 1 : 0;
    const focusMinutes = Array.from({ length: focusCount }, () => randInt(25, 95));
    const focusScore = clamp(
      Math.round(focusMinutes.reduce((a, b) => a + b, 0) / 10 + (gymDone ? 8 : 0) + mood),
      0,
      100,
    );

    let hourCursor = 9;
    for (const mins of focusMinutes) {
      const started = atLocal(dateStr, hourCursor, randInt(0, 20));
      const ended = new Date(new Date(started).getTime() + mins * 60_000).toISOString();
      sessions.push({
        user_id: userId,
        started_at: started,
        ended_at: ended,
        duration_minutes: mins,
        session_type: 'focus',
        mood_before: clamp(mood - (rand() < 0.3 ? 1 : 0), 1, 5),
        mood_after: clamp(mood + (mins >= 45 ? 1 : 0), 1, 5),
        energy_level: energy,
        distraction_src: energy < 5 && rand() < 0.4 ? 'phone' : null,
        playlist_used: rand() < 0.5 ? 'Deep Work' : null,
        source_type: 'admin_simulated',
        created_at: started,
      });
      hourCursor += Math.ceil(mins / 60) + 1;
    }

    if (learningDone) {
      studySessions.push({
        user_id: userId,
        topic: learningTopic,
        duration_minutes: randInt(30, 90),
        started_at: atLocal(dateStr, 16, randInt(0, 30)),
        session_intent: 'skill building',
        session_reflection: energy >= 6 ? 'Absorbed well' : 'Slow but steady',
        energy_after: clamp(energy + randInt(-1, 1), 1, 5),
      });
    }

    const lateNight = sleepHours < 6.2 && rand() < 0.4;
    const headache = brainFog >= 7 && rand() < 0.25;
    const journalText = rand() < 0.7 ? pick(DIARY) : null;

    dailyLogs.push({
      user_id: userId,
      date: dateStr,
      sleep_start: `${pad(lateNight ? randInt(0, 1) : randInt(22, 23))}:${pad(randInt(0, 59))}:00`,
      sleep_end: `${pad(randInt(5, 9))}:${pad(randInt(0, 45))}:00`,
      sleep_hours: sleepHours,
      gym_done: gymDone,
      gym_duration: gymDuration,
      breakfast_done: breakfastDone,
      steps,
      protein_grams: gymDone ? randInt(90, 160) : randInt(50, 110),
      learning_done: learningDone,
      learning_topic: learningTopic,
      journal_entry: journalText,
      mood,
      energy_level: energy,
      brain_fog: brainFog,
      headache,
      water_bottles: waterBottles,
      focus_score: focusScore,
      habits_completed: habitsCompleted,
      routines_completed: habitsCompleted >= 3 ? 1 : 0,
      rc_count: 0,
      rc_entries: [],
      masturbation_count: 0,
      masturbation_times: [],
      source_type: 'admin_simulated',
      created_at: atLocal(dateStr, 21, 30),
    });

    // Diary / journal — max 1 row per date (unique user_id+date)
    if (journalText || rand() < 0.55) {
      const mode = pick(['write', 'free_write', 'morning', 'www', 'cbt']);
      let payload;
      if (mode === 'www') {
        payload = {
          wins: [
            { text: gymDone ? 'Trained as planned' : 'Kept the day honest' },
            { text: habitsCompleted >= 3 ? 'Habit stack mostly done' : 'Showed up anyway' },
            { text: learningDone ? `Learned: ${learningTopic}` : 'Protected rest' },
          ],
        };
      } else if (mode === 'cbt') {
        payload = {
          fields: {
            situation: weekend ? 'Weekend social spend urge' : 'Midday distraction',
            automaticThought: 'I am falling behind',
            emotion: mood <= 2 ? 'anxious' : 'frustrated',
            balancedThought: 'One focused block still moves the needle',
          },
        };
      } else {
        payload = { body: journalText || pick(DIARY) };
      }
      // Sundays: weekly review instead
      if (dow === 0) {
        journals.push({
          user_id: userId,
          date: dateStr,
          encrypted_content: serializeJournal('weekly', {
            body: `Week review: sleep consistency mattered. Gym days lifted mood. Spend spikes on weekends.`,
            summary: 'Protect sleep + morning stack.',
          }),
          mood,
          sleep_hours: sleepHours,
          energy_level: energy,
          created_at: atLocal(dateStr, 20, 0),
        });
      } else {
        journals.push({
          user_id: userId,
          date: dateStr,
          encrypted_content: serializeJournal(mode, payload),
          mood,
          sleep_hours: sleepHours,
          energy_level: energy,
          created_at: atLocal(dateStr, 21, 45),
        });
      }
    }

    // Money
    const expenseBias = weekend ? 1.35 : mood <= 4 ? 1.25 : 1;
    const expenseCount = rand() < 0.58 * expenseBias ? randInt(1, weekend ? 3 : 2) : 0;
    for (let e = 0; e < expenseCount; e++) {
      const [cid, label, lo, hi] = pick(expenseCats);
      const amt = Math.round(Math.abs(gauss((lo + hi) / 2, (hi - lo) / 4) * expenseBias));
      money.push({
        user_id: userId,
        date: dateStr,
        category: label.replace(/^Seed /, ''),
        category_id: cid,
        amount: -amt,
        source: 'seed',
        description: `Seed ${label}`,
        currency: 'INR',
        account_id: rand() < 0.75 ? ids.accBank : ids.accCash,
        type: 'expense',
        tags: ['seed'],
        emotion_tag: mood <= 4 ? 'stressed' : weekend ? 'social' : 'neutral',
        time_of_day: pick(['morning', 'afternoon', 'evening']),
        created_at: atLocal(dateStr, randInt(11, 21), randInt(0, 50)),
      });
      nw -= amt * 0.15;
    }
    if ((dow === 1 && i % 14 < 7 && rand() < 0.85) || rand() < 0.015) {
      const amt = pick([15000, 25000, 40000, 50000]);
      money.push({
        user_id: userId,
        date: dateStr,
        category: 'Income',
        category_id: ids.catIncome,
        amount: amt,
        source: 'seed',
        description: 'Seed income deposit',
        currency: 'INR',
        account_id: ids.accBank,
        type: 'income',
        tags: ['seed'],
        emotion_tag: 'positive',
        time_of_day: 'morning',
        created_at: atLocal(dateStr, 10, 0),
      });
      nw += amt * 0.4;
    }
    // Monthly rent on ~1st
    if (date.getUTCDate() === 1) {
      money.push({
        user_id: userId,
        date: dateStr,
        category: 'Rent',
        category_id: ids.catRent,
        amount: -22000,
        source: 'seed',
        description: 'Seed Rent',
        currency: 'INR',
        account_id: ids.accBank,
        type: 'expense',
        tags: ['seed', 'rent'],
        emotion_tag: 'neutral',
        time_of_day: 'morning',
        is_recurring: true,
        created_at: atLocal(dateStr, 9, 0),
      });
      nw -= 5000;
    }

    if (i % 14 === 0) {
      netWorth.push({
        user_id: userId,
        snapshot_date: dateStr,
        total_inr: Math.round(nw),
        assets_inr: Math.round(nw + 80000),
        liabilities_inr: 80000,
        notes: 'seed snapshot',
      });
    }

    if (gymDone || focusMinutes.some((m) => m >= 60) || streak >= 7) {
      if (rand() < 0.3) {
        wins.push({
          user_id: userId,
          date: dateStr,
          description: gymDone ? 'Hit gym plan' : streak >= 7 ? `${streak}-day habit streak` : 'Deep focus win',
          source_type: 'admin_simulated',
          created_at: atLocal(dateStr, 20, 0),
        });
      }
    }

    const targets = [
      { id: 'gym', label: 'Gym', met: gymDone },
      { id: 'habits', label: 'Core habits', met: habitsCompleted >= 4 },
      { id: 'learning', label: 'Learning', met: learningDone },
      { id: 'sleep', label: 'Sleep 7h+', met: sleepHours >= 7 },
    ];
    const met = targets.filter((t) => t.met).length;
    commitments.push({
      user_id: userId,
      date: dateStr,
      targets,
      met_count: met,
      total_count: targets.length,
      fulfillment_pct: Number(((met / targets.length) * 100).toFixed(1)),
      evaluated_at: atLocal(dateStr, 22, 0),
      source_type: 'admin_simulated',
      created_at: atLocal(dateStr, 8, 0),
    });

    const xp =
      (gymDone ? 40 : 0) +
      habitsCompleted * 12 +
      (learningDone ? 25 : 0) +
      Math.round(focusMinutes.reduce((a, b) => a + b, 0) / 5) +
      (breakfastDone ? 5 : 0);
    if (xp > 0) {
      xpLogs.push({
        user_id: userId,
        date: dateStr,
        xp_earned: xp,
        breakdown: { gym: gymDone ? 40 : 0, habits: habitsCompleted * 12, learning: learningDone ? 25 : 0 },
        multiplier: streak >= 7 ? 1.2 : 1.0,
        created_at: atLocal(dateStr, 23, 0),
      });
    }

    // Calendar: ~every other day an event
    if (rand() < 0.45) {
      const hour = weekend ? randInt(10, 18) : pick([9, 11, 14, 16, 19]);
      const start = atLocal(dateStr, hour, 0);
      const end = new Date(new Date(start).getTime() + randInt(45, 120) * 60_000).toISOString();
      calendar.push({
        user_id: userId,
        title: pick([
          'Seed Deep work',
          'Seed Gym',
          'Seed Mentor call',
          'Seed Family dinner',
          'Seed Interview prep',
          'Seed Study block',
          'Seed Standup',
        ]),
        start_time: start,
        end_time: end,
        completed: rand() < 0.6,
        all_day: false,
        event_type: pick(['event', 'task', 'reminder']),
        source_type: 'admin_simulated',
        description: '[seed] synthetic calendar block',
        location: pick(['Home', 'Gym', 'Cafe', 'Online', null]),
        system_type: pick(['work', 'health', 'finance', 'social', 'reflection', 'general']),
        tags: ['seed'],
        color: '#ff6b35',
        reminder_minutes: 30,
        timezone: 'Asia/Kolkata',
      });
    }

    if (learningDone && rand() < 0.35) {
      const [title, difficulty, topic, platform] = pick(DSA);
      dsaLogs.push({
        user_id: userId,
        problem_title: `Seed ${title}`,
        difficulty,
        topic,
        platform,
        solved_at: atLocal(dateStr, 17, randInt(0, 40)),
      });
    }

    if (mood <= 3 && rand() < 0.4) {
      const started = atLocal(dateStr, randInt(14, 22), randInt(0, 50));
      const dur = randInt(180, 1200);
      urges.push({
        user_id: userId,
        category: pick(['phone_scroll', 'junk_food', 'procrastination']),
        started_at: started,
        resolved_at: new Date(new Date(started).getTime() + dur * 1000).toISOString(),
        trigger_tags: ['seed', weekend ? 'weekend' : 'weekday'],
        intensity: randInt(1, 5),
        outcome: pick(['resisted', 'acted', 'partial', 'still_riding']),
        duration_to_resolve_sec: dur,
        note: 'seed urge',
        status: 'resolved',
      });
      disciplineLogs.push({
        user_id: userId,
        event_type: pick(['urge', 'checkin', 'reset']),
        trigger_type: 'seed',
        craving_intensity: randInt(1, 5),
        time_of_day: pick(['afternoon', 'evening', 'night']),
        notes: 'seed discipline log',
        created_at: started,
      });
    }

    prev = { lateNight };
  }

  // (weekly journals folded into per-day unique rows above)

  const taskTitles = [
    'Seed polish Reports UX',
    'Seed money category cleanup',
    'Seed family vault docs',
    'Seed interview prep sheet',
    'Seed habit stack review',
    'Seed net-worth check-in',
  ];
  for (const title of taskTitles) {
    const due = fmtDate(addDays(END, -randInt(0, 25)));
    tasks.push({
      user_id: userId,
      title,
      description: 'Seeded task for feature trials',
      due_date: due,
      completed: rand() < 0.5,
      source: 'seed',
      priority: pick(['normal', 'high', 'low']),
      created_at: atLocal(due, 9, 0),
      updated_at: atLocal(due, 18, 0),
    });
  }

  for (let n = 0; n < 12; n++) {
    const day = fmtDate(addDays(END, -randInt(0, DAYS - 1)));
    const body = pick(DIARY);
    notes.push({
      user_id: userId,
      title: `Seed note ${n + 1}`,
      content: body,
      body_text: body,
      type: 'note',
      source_type: 'admin_simulated',
      status: 'ready',
      completed: false,
      meta: { seed: true },
      created_at: atLocal(day, 14, randInt(0, 50)),
      updated_at: atLocal(day, 14, randInt(0, 50)),
    });
  }

  const totalXp = xpLogs.reduce((a, r) => a + r.xp_earned, 0);
  return {
    dailyLogs,
    habitLogs,
    sessions,
    studySessions,
    money,
    wins,
    commitments,
    journals,
    xpLogs,
    calendar,
    dsaLogs,
    urges,
    disciplineLogs,
    netWorth,
    tasks,
    notes,
    totalXp,
  };
}

async function upsertUserXp(userId, totalXp) {
  const payload = {
    user_id: userId,
    total_xp: totalXp,
    current_rank: clamp(Math.floor(totalXp / 2000) + 1, 1, 10),
    power_level: clamp(Math.floor(totalXp / 100), 0, 999),
    longest_streak: 21,
    clean_streak: 9,
    last_xp_date: fmtDate(END),
    updated_at: new Date().toISOString(),
  };
  const { data: existing } = await supabase.from('user_xp').select('user_id').eq('user_id', userId).maybeSingle();
  if (existing) {
    const { error } = await supabase.from('user_xp').update(payload).eq('user_id', userId);
    if (error) throw error;
  } else {
    const { error } = await supabase.from('user_xp').insert(payload);
    if (error) throw error;
  }
}

async function main() {
  const user = await resolveUser();
  console.log('=== AIIMIN full demo seed ===');
  console.log(`user: ${user.username} <${user.email}>`);
  console.log(`user_id: ${user.id}`);
  console.log(`window: ${fmtDate(START)} .. ${fmtDate(END)} (${DAYS} days)`);
  console.log(`mode: ${WIPE_ONLY ? 'wipe-only' : CONFIRM ? 'wipe+seed' : 'dry-run'}`);

  const staticRows = buildStatic(user.id);
  const timeline = buildTimeline(user.id, staticRows.ids);

  const plan = {
    accounts: staticRows.accounts.length,
    money_categories: staticRows.categories.length,
    budgets: staticRows.budgets.length,
    recurring: staticRows.recurring.length,
    savings_goals: staticRows.savingsGoals.length,
    financial_goals: staticRows.financialGoals.length,
    wealth_assets: staticRows.wealth.length,
    money_lent: staticRows.moneyLent.length,
    account_balances: staticRows.accountBalances.length,
    habits: staticRows.habits.length,
    routines: staticRows.routines.length,
    routine_habits: staticRows.routineHabits.length,
    habit_stacks: staticRows.habitStacks.length,
    goals: staticRows.goals.length,
    resumes: staticRows.resumes.length,
    job_applications: staticRows.jobApps.length,
    family_members: staticRows.familyMembers.length,
    family_related: staticRows.familyHealth.length + staticRows.familyReminders.length,
    dsa_problems: staticRows.dsaProblems.length,
    daily_logs: timeline.dailyLogs.length,
    habit_logs: timeline.habitLogs.length,
    sessions: timeline.sessions.length,
    study_sessions: timeline.studySessions.length,
    money_transactions: timeline.money.length,
    journal_entries: timeline.journals.length,
    calendar_events: timeline.calendar.length,
    wins: timeline.wins.length,
    daily_commitments: timeline.commitments.length,
    xp_log: timeline.xpLogs.length,
    dsa_logs: timeline.dsaLogs.length,
    urge_events: timeline.urges.length,
    discipline_logs: timeline.disciplineLogs.length,
    net_worth_snapshots: timeline.netWorth.length,
    tasks: timeline.tasks.length,
    notes: timeline.notes.length,
    user_xp: timeline.totalXp,
  };
  console.log('planned:');
  for (const [k, v] of Object.entries(plan)) console.log(`  ${k}: ${v}`);

  if (!CONFIRM) {
    console.log('\nDry-run only. Write with:');
    console.log('  node scripts/seed-demo-history.mjs --confirm');
    return;
  }

  console.log('\nWiping previous seed…');
  await wipeSeed(user.id);
  if (WIPE_ONLY) {
    console.log('Wipe complete.');
    return;
  }

  console.log('Inserting static…');
  console.log(`  accounts: ${await batchInsert('accounts', staticRows.accounts)}`);
  console.log(`  money_categories: ${await batchInsert('money_categories', staticRows.categories)}`);
  console.log(`  budgets: ${await batchInsert('budgets', staticRows.budgets)}`);
  console.log(`  recurring: ${await batchInsert('recurring', staticRows.recurring)}`);
  console.log(`  savings_goals: ${await batchInsert('savings_goals', staticRows.savingsGoals)}`);
  console.log(`  financial_goals: ${await batchInsert('financial_goals', staticRows.financialGoals)}`);
  await softInsert('wealth_assets', staticRows.wealth); // FK auth.users (empty)
  console.log(`  money_lent: ${await batchInsert('money_lent', staticRows.moneyLent)}`);
  await softInsert('account_balances', staticRows.accountBalances); // FK auth.users
  console.log(`  habits: ${await batchInsert('habits', staticRows.habits)}`);
  console.log(`  routines: ${await batchInsert('routines', staticRows.routines)}`);
  console.log(`  routine_habits: ${await batchInsert('routine_habits', staticRows.routineHabits)}`);
  console.log(`  habit_stacks: ${await batchInsert('habit_stacks', staticRows.habitStacks)}`);
  console.log(`  replacement_habits: ${await batchInsert('replacement_habits', staticRows.replacementHabits)}`);
  console.log(`  goals: ${await batchInsert('goals', staticRows.goals)}`);
  await softInsert('resumes', staticRows.resumes); // FK auth.users
  await softInsert('job_applications', staticRows.jobApps); // FK auth.users
  await softInsert('family_members', staticRows.familyMembers);
  await softInsert('family_health', staticRows.familyHealth);
  await softInsert('family_insurance', staticRows.familyInsurance);
  await softInsert('family_documents', staticRows.familyDocs);
  await softInsert('family_finance', staticRows.familyFinance);
  await softInsert('family_emergency_contacts', staticRows.familyEmergency);
  await softInsert('family_vehicles', staticRows.familyVehicles);
  await softInsert('family_relationships', staticRows.familyRelationships);
  await softInsert('family_reminders', staticRows.familyReminders);
  console.log(`  dsa_problems: ${await batchInsert('dsa_problems', staticRows.dsaProblems)}`);

  console.log('Inserting timeline…');
  console.log(`  daily_logs: ${await batchInsert('daily_logs', timeline.dailyLogs)}`);
  console.log(`  habit_logs: ${await batchInsert('habit_logs', timeline.habitLogs)}`);
  // Mirror dates into habits.meta.completedDates for any client still reading meta only
  const datesByHabit = new Map();
  for (const log of timeline.habitLogs) {
    const day = String(log.completed_at).slice(0, 10);
    if (!datesByHabit.has(log.habit_id)) datesByHabit.set(log.habit_id, new Set());
    // completed_at is ISO — convert via IST wall for meta keys
    const d = new Date(log.completed_at);
    const ist = new Date(d.getTime() + 5.5 * 3600 * 1000).toISOString().slice(0, 10);
    datesByHabit.get(log.habit_id).add(ist);
  }
  for (const h of staticRows.habits) {
    const dates = [...(datesByHabit.get(h.id) || [])].sort();
    const meta = { ...(h.meta || {}), completedDates: dates };
    const { error } = await supabase.from('habits').update({ meta }).eq('id', h.id);
    if (error) console.warn(`  habit meta sync ${h.name}: ${error.message}`);
  }
  console.log(`  habits meta.completedDates: synced for ${staticRows.habits.length} habits`);
  console.log(`  sessions: ${await batchInsert('sessions', timeline.sessions)}`);
  await softInsert('study_sessions', timeline.studySessions);
  console.log(`  money_transactions: ${await batchInsert('money_transactions', timeline.money)}`);
  await softInsert('journal_entries', timeline.journals);
  console.log(`  calendar_events: ${await batchInsert('calendar_events', timeline.calendar)}`);
  console.log(`  wins: ${await batchInsert('wins', timeline.wins)}`);
  console.log(`  daily_commitments: ${await batchInsert('daily_commitments', timeline.commitments)}`);
  console.log(`  xp_log: ${await batchInsert('xp_log', timeline.xpLogs)}`);
  await softInsert('dsa_logs', timeline.dsaLogs);
  await softInsert('urge_events', timeline.urges);
  await softInsert('discipline_logs', timeline.disciplineLogs);
  console.log(`  net_worth_snapshots: ${await batchInsert('net_worth_snapshots', timeline.netWorth)}`);
  console.log(`  tasks: ${await batchInsert('tasks', timeline.tasks)}`);
  console.log(`  notes: ${await batchInsert('notes', timeline.notes)}`);
  try {
    await upsertUserXp(user.id, timeline.totalXp);
    console.log('  user_xp: upserted');
  } catch (err) {
    console.warn(`  user_xp: SKIPPED — ${err.message}`);
  }

  console.log('\nDone. Open localhost logged in as AADI0837 — hard refresh Habits / Focus / Journal / Goals.');
  console.log('Wipe later: node scripts/seed-demo-history.mjs --wipe-only --confirm');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
