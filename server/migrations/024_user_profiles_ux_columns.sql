-- UX profile columns: feature tips, tier upgrade tracking, streak milestones
ALTER TABLE public.user_profiles
  ADD COLUMN IF NOT EXISTS seen_tips TEXT[] DEFAULT ARRAY[]::TEXT[],
  ADD COLUMN IF NOT EXISTS prev_tier TEXT DEFAULT 'explore',
  ADD COLUMN IF NOT EXISTS last_celebrated_milestone INTEGER DEFAULT 0;
