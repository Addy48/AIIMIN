-- 041 craft program: urge_events, anchor_edges, notes, voice_recall
-- Non-clinical; urge notes excluded from analytics by app contract

CREATE TABLE IF NOT EXISTS public.urge_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    category TEXT NOT NULL DEFAULT 'custom',
    started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    resolved_at TIMESTAMPTZ,
    trigger_tags JSONB NOT NULL DEFAULT '[]'::jsonb,
    intensity SMALLINT CHECK (intensity IS NULL OR (intensity >= 1 AND intensity <= 5)),
    outcome TEXT CHECK (outcome IS NULL OR outcome IN ('resisted', 'acted', 'partial', 'still_riding')),
    duration_to_resolve_sec INT,
    linked_replacement_habit_id UUID,
    note TEXT,
    status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'resolved')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_urge_events_user_started
    ON public.urge_events (user_id, started_at DESC);

CREATE TABLE IF NOT EXISTS public.anchor_edges (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    source_type TEXT NOT NULL,
    source_id TEXT NOT NULL,
    target_type TEXT NOT NULL,
    target_id TEXT NOT NULL,
    relationship TEXT NOT NULL DEFAULT 'reinforces'
        CHECK (relationship IN ('triggers', 'reinforces', 'blocks')),
    confidence REAL,
    confirmed BOOLEAN NOT NULL DEFAULT false,
    meta JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (user_id, source_type, source_id, target_type, target_id, relationship)
);

CREATE INDEX IF NOT EXISTS idx_anchor_edges_user
    ON public.anchor_edges (user_id, source_type, target_type);

CREATE TABLE IF NOT EXISTS public.notes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    source_type TEXT NOT NULL DEFAULT 'text'
        CHECK (source_type IN ('pdf', 'voice', 'text')),
    title TEXT NOT NULL DEFAULT 'Untitled',
    body_text TEXT,
    ocr_text TEXT,
    transcript TEXT,
    status TEXT NOT NULL DEFAULT 'unlinked'
        CHECK (status IN ('indexing', 'linked', 'unlinked')),
    source_filename TEXT,
    meta JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_notes_user_created
    ON public.notes (user_id, created_at DESC);

CREATE TABLE IF NOT EXISTS public.voice_recall_queue (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    source_type TEXT NOT NULL CHECK (source_type IN ('journal', 'notes')),
    source_id UUID NOT NULL,
    box SMALLINT NOT NULL DEFAULT 1 CHECK (box >= 1 AND box <= 4),
    next_review_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    last_outcome TEXT CHECK (last_outcome IS NULL OR last_outcome IN ('clean', 'think')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (user_id, source_type, source_id)
);

CREATE INDEX IF NOT EXISTS idx_voice_recall_due
    ON public.voice_recall_queue (user_id, next_review_at);

ALTER TABLE public.urge_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.anchor_edges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.voice_recall_queue ENABLE ROW LEVEL SECURITY;
