# ADR — Discipline UrgeEvent

**Date:** 2026-07-13  
**Status:** accepted (schema pending implementation)

## Context

Current Discipline UI is streak-reset shame + localStorage. Research supports urge surfing as the transferable mechanism across compulsive behaviors. Product must stay non-clinical.

## Decision

1. Introduce UrgeEvent (or widen `discipline_logs`) with category, intensity, outcome, duration, linked replacement habit, optional encrypted note.
2. Primary UX = urge-surf timer mid-urge; one-tap outcome; pattern language (“surfed X of Y”), not punitive day streaks.
3. Reinforcement: resisted + linked habit increments habit consistency.
4. Linking uses one `anchor_edges` table shared with Notes/Goals — no second graph.
5. Privacy: urge notes excluded from analytics and AI prompts without per-session consent.
6. `/m` may host surf + outcome only.

## Rejected

Combined addiction score; AI therapist; recovery gamification; proactive JITAI before interruptibility gating.

## Consequences

Schema migration required before A1 ships. Overview/GrowthNodes streak copy must change in A2.
