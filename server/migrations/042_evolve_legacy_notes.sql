-- 042: evolve legacy notes into source-grounded craft schema
ALTER TABLE public.notes ADD COLUMN IF NOT EXISTS source_type TEXT;
ALTER TABLE public.notes ADD COLUMN IF NOT EXISTS body_text TEXT;
ALTER TABLE public.notes ADD COLUMN IF NOT EXISTS ocr_text TEXT;
ALTER TABLE public.notes ADD COLUMN IF NOT EXISTS transcript TEXT;
ALTER TABLE public.notes ADD COLUMN IF NOT EXISTS status TEXT;
ALTER TABLE public.notes ADD COLUMN IF NOT EXISTS source_filename TEXT;
ALTER TABLE public.notes ADD COLUMN IF NOT EXISTS meta JSONB DEFAULT '{}'::jsonb;
ALTER TABLE public.notes ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

UPDATE public.notes
SET body_text = COALESCE(body_text, content)
WHERE body_text IS NULL AND content IS NOT NULL;

UPDATE public.notes
SET source_type = COALESCE(NULLIF(source_type, ''), 'text')
WHERE source_type IS NULL OR source_type = '';

UPDATE public.notes
SET status = COALESCE(NULLIF(status, ''), CASE WHEN COALESCE(completed, false) THEN 'linked' ELSE 'unlinked' END)
WHERE status IS NULL OR status = '';

DO $$ BEGIN
  ALTER TABLE public.notes DROP CONSTRAINT IF EXISTS notes_source_type_check;
  ALTER TABLE public.notes ADD CONSTRAINT notes_source_type_check
    CHECK (source_type IS NULL OR source_type IN ('pdf', 'voice', 'text'));
EXCEPTION WHEN others THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE public.notes DROP CONSTRAINT IF EXISTS notes_status_check;
  ALTER TABLE public.notes ADD CONSTRAINT notes_status_check
    CHECK (status IS NULL OR status IN ('indexing', 'linked', 'unlinked'));
EXCEPTION WHEN others THEN NULL;
END $$;

CREATE INDEX IF NOT EXISTS idx_notes_user_created ON public.notes (user_id, created_at DESC);
