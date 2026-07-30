# ADR — Notes Source-Grounded

**Date:** 2026-07-13  
**Status:** accepted (schema pending implementation)

## Context

`Notes.jsx` is a localStorage card grid. Users need PDF/voice/text reference storage with entity links to Goals/Habits — without competing with native stylus apps.

## Decision

1. New `notes` table: source_type, title, ocr/transcript, embedding, status.
2. List+detail UI with 1px borders and status chips — not thumbnail card carnival.
3. Entity links via shared `anchor_edges` with confirm-on-first-link.
4. Import: file picker + drag-drop first; Drive folder watch as follow-on. No handwriting canvas; no in-app PDF annotation.
5. Voice notes share capture primitive with Journal; spaced recall (C3) is audio-only Leitner, not gamified.

## Rejected

GoodNotes-style canvas; second linking table; iOS Web Share Target as primary; collaboration UI.

## Consequences

Route `/notes` already exists — replace implementation. Tier gating explore remains until product says otherwise.
