ALTER TABLE public.user_profiles
  ADD COLUMN IF NOT EXISTS font_scale TEXT DEFAULT 'normal';

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'user_profiles_font_scale_check'
  ) THEN
    ALTER TABLE public.user_profiles
      ADD CONSTRAINT user_profiles_font_scale_check
      CHECK (font_scale IN ('small', 'normal', 'large'));
  END IF;
END $$;

UPDATE public.user_profiles
SET font_scale = 'normal'
WHERE font_scale IS NULL OR font_scale NOT IN ('small', 'normal', 'large');
