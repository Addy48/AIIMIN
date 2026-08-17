# 06 — AI Model

## How AI should behave in AIIMIN

AIIMIN's AI is not a chatbot bolted onto forms. It is a **mixed-initiative layer** that routes intent, infers structure, generates insight, and proposes action — with the user always one tap from correction.

## Roles

| Role | Description | Surfaces |
|------|-------------|----------|
| **Router** | Classify free text → correct table/entity | Command Palette, Universal Logger |
| **Inferencer** | Fill fields silently when confidence high | Finance category, mood, pillar |
| **Analyzer** | Post-capture enrichment | Journal analyze, ATS, Vocal Mastery |
| **Coach** | Narrative + recommendation | Insights, Monday widget, morning briefing |
| **Composer** | Draft milestones, arc, summaries | Goals, Identity, Focus reflection |

## Confidence bands

| Confidence | Behavior | UI |
|------------|----------|-----|
| ≥70% | Auto-fill; save | Small "edit" chip |
| 40–70% | Pre-fill; require confirm | Highlighted chip row |
| <40% | Ask minimal question | Single field or voice |
| Safety/legal | Never infer | Always ask (meds, allergies, PIN) |

## Input stack order

When AI processes a capture:

1. Parse intent (Human Intent Graph)
2. Identify target entities (Information Graph)
3. Check Kill List — which fields can be skipped
4. Write to table(s) with inferred fields
5. Emit telemetry event
6. Surface coaching only if interruptibility window open

## What AI must not do

- Diagnose mental health conditions
- Auto-share journal content
- Change auth or billing without explicit user action
- Block capture behind mode/category choices
- Invent finance transactions without user utterance

## Provider map

See vault: `docs/knowledge/09_FEATURES/Intelligence/AI-Provider-Map.md`

## Related

- [[07_AUTOMATION_RULES]]
- [[../product-intelligence/FUTURE_AIMIN_FRAMEWORK]]
- Horvitz CHI 1999 mixed-initiative principles
