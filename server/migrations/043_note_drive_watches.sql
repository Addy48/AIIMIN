-- 043: Notes Drive folder watches + content column safety for OCR pipeline
-- User asked for Drive folder watch on Notes (explicit schema allowance).

CREATE TABLE IF NOT EXISTS public.note_drive_watches (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    folder_id TEXT NOT NULL,
    folder_name TEXT,
    enabled BOOLEAN NOT NULL DEFAULT true,
    last_synced_at TIMESTAMPTZ,
    last_sync_status TEXT,
    last_sync_error TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (user_id, folder_id)
);

CREATE INDEX IF NOT EXISTS idx_note_drive_watches_user
    ON public.note_drive_watches (user_id)
    WHERE enabled = true;

ALTER TABLE public.note_drive_watches ENABLE ROW LEVEL SECURITY;

-- Ensure notes.content exists for legacy dual-write (042 may have added it)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'notes' AND column_name = 'content'
  ) THEN
    ALTER TABLE public.notes ADD COLUMN content TEXT;
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'notes' AND column_name = 'meta'
  ) THEN
    ALTER TABLE public.notes ADD COLUMN meta JSONB NOT NULL DEFAULT '{}'::jsonb;
  END IF;
END $$;
