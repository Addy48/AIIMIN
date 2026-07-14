-- 044: notes.user_id FK was auth.users (legacy); Better Auth ids live in public.users.
-- CREATE TABLE IF NOT EXISTS in 041 never replaced the legacy table; 042 only added columns.
-- Also set content DEFAULT '' so dual-write never trips NOT NULL on empty/voice rows.

ALTER TABLE public.notes DROP CONSTRAINT IF EXISTS notes_user_id_fkey;

ALTER TABLE public.notes
  ADD CONSTRAINT notes_user_id_fkey
  FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;

ALTER TABLE public.notes
  ALTER COLUMN content SET DEFAULT '';

UPDATE public.notes
SET content = COALESCE(content, body_text, ocr_text, transcript, '')
WHERE content IS NULL;

ALTER TABLE public.notes
  ALTER COLUMN content SET NOT NULL;
