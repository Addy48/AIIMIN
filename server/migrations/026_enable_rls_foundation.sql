-- SEC-12: Enable RLS on foundation + sports tables (API-only access via Express pool)
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.discipline_streaks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.discipline_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.replacement_habits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.habit_stacks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sports_favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sports_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sports_legends ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sports_news_feed ENABLE ROW LEVEL SECURITY;
