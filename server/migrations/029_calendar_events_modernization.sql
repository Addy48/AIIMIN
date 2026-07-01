CREATE TABLE IF NOT EXISTS public.calendar_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  google_event_id TEXT,
  title TEXT NOT NULL,
  description TEXT,
  start_time TIMESTAMPTZ NOT NULL,
  end_time TIMESTAMPTZ NOT NULL,
  all_day BOOLEAN DEFAULT FALSE,
  completed BOOLEAN DEFAULT FALSE,
  event_type TEXT DEFAULT 'event',
  source_type TEXT DEFAULT 'user',
  system_type TEXT DEFAULT 'general',
  tags TEXT[] DEFAULT '{}',
  color TEXT,
  location TEXT,
  reminder_minutes INTEGER,
  recurrence_rule JSONB,
  synced_to_log BOOLEAN DEFAULT FALSE,
  timezone TEXT,
  deleted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_calendar_events_user_google_event
  ON public.calendar_events (user_id, google_event_id)
  WHERE google_event_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_calendar_events_user_start_not_deleted
  ON public.calendar_events (user_id, start_time DESC)
  WHERE deleted_at IS NULL;

ALTER TABLE public.calendar_events
  ADD COLUMN IF NOT EXISTS description TEXT,
  ADD COLUMN IF NOT EXISTS location TEXT,
  ADD COLUMN IF NOT EXISTS system_type TEXT DEFAULT 'general',
  ADD COLUMN IF NOT EXISTS tags TEXT[] DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS color TEXT,
  ADD COLUMN IF NOT EXISTS reminder_minutes INTEGER,
  ADD COLUMN IF NOT EXISTS recurrence_rule JSONB,
  ADD COLUMN IF NOT EXISTS source_type TEXT DEFAULT 'user',
  ADD COLUMN IF NOT EXISTS event_type TEXT DEFAULT 'event',
  ADD COLUMN IF NOT EXISTS all_day BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS completed BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS synced_to_log BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS timezone TEXT;

UPDATE public.calendar_events
SET source_type = CASE
  WHEN google_event_id IS NOT NULL THEN 'imported_calendar'
  ELSE COALESCE(source_type, 'user')
END
WHERE source_type IS NULL OR source_type NOT IN ('user', 'admin_simulated', 'imported_calendar');

UPDATE public.calendar_events
SET event_type = CASE
  WHEN COALESCE(event_type, '') IN ('personal', 'work') THEN 'event'
  WHEN COALESCE(event_type, '') = '' THEN 'event'
  ELSE LOWER(event_type)
END;

UPDATE public.calendar_events
SET system_type = CASE
  WHEN LOWER(COALESCE(system_type, '')) = 'physical' THEN 'health'
  WHEN LOWER(COALESCE(system_type, '')) IN ('cognitive', 'behavior') THEN 'work'
  WHEN LOWER(COALESCE(system_type, '')) IN ('work', 'health', 'finance', 'social', 'reflection', 'general')
    THEN LOWER(system_type)
  ELSE 'general'
END;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'calendar_events_source_type_check'
  ) THEN
    ALTER TABLE public.calendar_events
      ADD CONSTRAINT calendar_events_source_type_check
      CHECK (source_type IN ('user', 'admin_simulated', 'imported_calendar'));
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'calendar_events_system_type_check'
  ) THEN
    ALTER TABLE public.calendar_events
      ADD CONSTRAINT calendar_events_system_type_check
      CHECK (system_type IN ('work', 'health', 'finance', 'social', 'reflection', 'general'));
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'calendar_events_event_type_check'
  ) THEN
    ALTER TABLE public.calendar_events
      ADD CONSTRAINT calendar_events_event_type_check
      CHECK (event_type IN ('event', 'task', 'reminder', 'todo', 'google'));
  END IF;
END $$;
