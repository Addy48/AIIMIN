import { Pool } from 'pg';
import { getDatabaseUrl } from './lib/load-env.mjs';

const pool = new Pool({
  connectionString: getDatabaseUrl(),
  ssl: { rejectUnauthorized: false },
});

const client = await pool.connect();

// SQL for each missing table - simplified without triggers/functions
const createStatements = [
  // user_profiles
  `CREATE TABLE IF NOT EXISTS public.user_profiles (
    user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    persona_tags TEXT[] DEFAULT '{}',
    favorite_sports TEXT[] DEFAULT '{}',
    favorite_teams JSONB DEFAULT '{}',
    dashboard_modules TEXT[] DEFAULT '{}',
    ai_tone TEXT DEFAULT 'motivating',
    ai_features_enabled BOOLEAN DEFAULT true,
    onboarding_complete BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
  );`,

  // discipline_streaks
  `CREATE TABLE IF NOT EXISTS public.discipline_streaks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    addiction_type TEXT NOT NULL DEFAULT '',
    replacement_habit TEXT,
    streak_days INT DEFAULT 0,
    longest_streak INT DEFAULT 0,
    total_resets INT DEFAULT 0,
    started_at TIMESTAMPTZ,
    last_reset_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
  );`,

  // discipline_logs
  `CREATE TABLE IF NOT EXISTS public.discipline_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    streak_id UUID REFERENCES public.discipline_streaks(id) ON DELETE CASCADE,
    event_type TEXT NOT NULL CHECK (event_type IN ('reset', 'urge', 'milestone', 'reflection')),
    trigger_type TEXT CHECK (trigger_type IN ('stress', 'boredom', 'social_pressure', 'physical', 'other')),
    hal_check JSONB DEFAULT '{}',
    craving_intensity INT CHECK (craving_intensity BETWEEN 1 AND 5),
    time_of_day TEXT CHECK (time_of_day IN ('morning', 'afternoon', 'evening', 'night')),
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
  );`,

  // replacement_habits
  `CREATE TABLE IF NOT EXISTS public.replacement_habits (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    habit_name TEXT NOT NULL,
    linked_to_addiction TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
  );`,

  // cbt_records
  `CREATE TABLE IF NOT EXISTS public.cbt_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    situation TEXT,
    automatic_thought TEXT,
    emotion_intensity INT CHECK (emotion_intensity BETWEEN 1 AND 10),
    evidence_for TEXT,
    evidence_against TEXT,
    balanced_thought TEXT,
    ai_grade TEXT CHECK (ai_grade IN ('excellent', 'good', 'needs_work')),
    journal_entry_id UUID REFERENCES public.journal_entries(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW()
  );`,

  // www_entries
  `CREATE TABLE IF NOT EXISTS public.www_entries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    win_1 TEXT,
    win_1_why TEXT,
    win_2 TEXT,
    win_2_why TEXT,
    win_3 TEXT,
    win_3_why TEXT,
    date DATE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
  );`,

  // habit_stacks
  `CREATE TABLE IF NOT EXISTS public.habit_stacks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    habit_ids UUID[] NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
  );`,

  // financial_health_scores
  `CREATE TABLE IF NOT EXISTS public.financial_health_scores (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    score INT CHECK (score BETWEEN 0 AND 100),
    emergency_fund_pct DECIMAL(5,2),
    savings_rate DECIMAL(5,2),
    budget_adherence DECIMAL(5,2),
    debt_to_income DECIMAL(5,2),
    month_year TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
  );`,

  // cognitive_benchmarks
  `CREATE TABLE IF NOT EXISTS public.cognitive_benchmarks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    n_back_score DECIMAL(5,2),
    digit_span_score DECIMAL(5,2),
    reaction_speed_ms INT,
    overall_score DECIMAL(5,2),
    test_date DATE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
  );`,
];

console.log('🔄 Creating missing tables...\n');

for (const stmt of createStatements) {
  const tableName = stmt.match(/public\.(\w+)/)?.[1];
  try {
    await client.query(stmt);
    console.log('✅', tableName);
  } catch (err) {
    console.log('❌', tableName, '-', err.message.substring(0, 80));
  }
}

// Now add RLS policies
console.log('\n🔄 Adding RLS policies...\n');

const rlsStatements = [
  `ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
   CREATE POLICY "users_own_profile" ON public.user_profiles FOR SELECT USING (auth.uid() = user_id);
   CREATE POLICY "users_insert_profile" ON public.user_profiles FOR INSERT WITH CHECK (auth.uid() = user_id);
   CREATE POLICY "users_update_profile" ON public.user_profiles FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);`,

  `ALTER TABLE public.discipline_streaks ENABLE ROW LEVEL SECURITY;
   CREATE POLICY "users_own_discipline_streaks" ON public.discipline_streaks FOR ALL USING (auth.uid() = user_id);`,

  `ALTER TABLE public.discipline_logs ENABLE ROW LEVEL SECURITY;
   CREATE POLICY "users_own_discipline_logs" ON public.discipline_logs FOR ALL USING (auth.uid() = user_id);`,

  `ALTER TABLE public.replacement_habits ENABLE ROW LEVEL SECURITY;
   CREATE POLICY "users_own_replacement_habits" ON public.replacement_habits FOR ALL USING (auth.uid() = user_id);`,

  `ALTER TABLE public.cbt_records ENABLE ROW LEVEL SECURITY;
   CREATE POLICY "users_own_cbt_records" ON public.cbt_records FOR ALL USING (auth.uid() = user_id);`,

  `ALTER TABLE public.www_entries ENABLE ROW LEVEL SECURITY;
   CREATE POLICY "users_own_www_entries" ON public.www_entries FOR ALL USING (auth.uid() = user_id);`,

  `ALTER TABLE public.habit_stacks ENABLE ROW LEVEL SECURITY;
   CREATE POLICY "users_own_habit_stacks" ON public.habit_stacks FOR ALL USING (auth.uid() = user_id);`,

  `ALTER TABLE public.financial_health_scores ENABLE ROW LEVEL SECURITY;
   CREATE POLICY "users_own_financial_health_scores" ON public.financial_health_scores FOR ALL USING (auth.uid() = user_id);`,

  `ALTER TABLE public.cognitive_benchmarks ENABLE ROW LEVEL SECURITY;
   CREATE POLICY "users_own_cognitive_benchmarks" ON public.cognitive_benchmarks FOR ALL USING (auth.uid() = user_id);`,
];

for (const stmt of rlsStatements) {
  const tableName = stmt.match(/public\.(\w+)/)?.[1];
  try {
    await client.query(stmt);
    console.log('✅ RLS:', tableName);
  } catch (err) {
    console.log('❌ RLS:', tableName, '-', err.message.substring(0, 80));
  }
}

// Final verification
const { rows } = await client.query(`
  SELECT table_name FROM information_schema.tables
  WHERE table_schema = 'public' AND table_name = ANY($1)
  ORDER BY table_name
`, [tables]);

console.log('\n📊 Final status:', rows.length, '/', tables.length, 'tables created');

await client.release();
await pool.end();