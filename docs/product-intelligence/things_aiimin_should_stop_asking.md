# Things AIIMIN Should Stop Asking (Phase 5 — Kill List)

**Status:** Exhaustive field + pattern verdicts  
**Date:** 2026-07-11  
**Verdicts:** **Kill** | **Infer** | **System** | **Keep** | **Ask later**

Every removed field is a **retention win**: fewer decisions per session, lower abandonment, higher daily capture rate.

---

## Verdict Legend

| Verdict | Meaning |
|---------|---------|
| **Kill** | Remove from UI; derive, default, or eliminate |
| **Infer** | AI/populate silently; user corrects via chip |
| **System** | OS/behavior/telemetry maintains; no user prompt |
| **Keep** | User must provide; high value or legal/safety |
| **Ask later** | Defer to progressive disclosure or post-activation |

---

## Auth & Security

| Field / Pattern | Verdict | Why (retention win) |
|-----------------|---------|---------------------|
| email | **Keep** (OAuth reduces) | Required for identity; OAuth eliminates typing |
| password | **Keep** (passkey future) | Security; reduce with magic link |
| confirmPassword | **Kill** | Redundant with passkey/magic link — 1 fewer field on signup |
| PIN (4) login | **Keep** → **System** biometric | PIN memory burden; biometric = 0 recall |
| PIN (6) onboarding | **Ask later** | Blocks activation; defer to Settings — saves 12 taps (INT-006) |

---

## Onboarding

| Field / Pattern | Verdict | Why |
|-----------------|---------|-----|
| fullName | **Infer** | OAuth prefill — skip step when present |
| username | **Ask later** | Availability wait (INT-010); not needed day 1 |
| selectedGoals[] | **Infer** + **Ask later** | Decision fatigue (INT-011); infer from week 1 behavior |
| selectedHabits[] | **Infer** | Duplicate of goals mapping (INT-012); seed from goals |
| wakeTime | **Kill** | Low confidence (INT-013); infer from open patterns |
| lifeArc | **Ask later** | Blank page syndrome (INT-014); AI draft after captures |
| 9-step wizard | **Kill** pattern | Compress to 3 steps: auth → capture → done |

---

## Waitlist

| Field / Pattern | Verdict | Why |
|-----------------|---------|-----|
| email | **Keep** | Acquisition anchor |
| name | **Kill** | Optional; personalize later — faster submit |

---

## Daily Log

| Field / Pattern | Verdict | Why |
|-----------------|---------|-----|
| mood | **Infer** | 5 duplicate surfaces; NLP from journal |
| sleep_hours | **Infer** | Wearable + pattern; manual override only |
| gym | **Infer** | Calendar + habit toggle |
| learning_hours | **System** | Sum from Focus sessions |
| breakfast | **Kill** | Low importance; noise in daily form |
| steps | **System** | Passive phone/wearable |
| water | **Kill** | Low signal; rarely used |
| energy | **Infer** | Model from sleep + mood |
| brain_fog | **Infer** | Journal NLP |
| headache | **Ask later** | Symptom only when mentioned |
| wins | **Keep** capture / **Infer** route | Merge to Command Palette |
| DSA | **System** | Lab auto-log |
| reset_counter | **System** | Discipline engine maintains |
| Multi-metric form (INT-099) | **Kill** pattern | Replace with 1-tap confirm card |

---

## Journal

| Field / Pattern | Verdict | Why |
|-----------------|---------|-----|
| body | **Keep** | Core capture — the product |
| mood | **Infer** | Sentiment NLP; mood strip becomes confirm-only |
| mode choice (CBT/WWW/etc.) | **Kill** | INT-166; AI tags post-save |
| mode fields (CBT) | **Infer** | INT-167; therapeutic structure from AI |
| Journal Mode selector | **Kill** | Default = capture; structured optional |

---

## Habits

| Field / Pattern | Verdict | Why |
|-----------------|---------|-----|
| name | **Keep** | Identity (NL create ok) |
| emoji | **Kill** | Auto from name — 1 fewer picker |
| category | **Kill** | Infer from name NLP |
| color | **Kill** | System palette from category |
| description | **Ask later** | Optional; AI can draft |
| 5-field create modal (INT-213) | **Kill** pattern | NL: "meditate 10 min daily" |

---

## Goals

| Field / Pattern | Verdict | Why |
|-----------------|---------|-----|
| title | **Keep** (NL parse) | Required intent — parse from sentence |
| pillar | **Infer** | Title NLP — 1 fewer dropdown |
| priority | **Kill** | INT-265 overhead; infer from deadline/behavior |
| targetDate | **Infer** | Parse "by September" from NL |
| why | **Ask later** | AI drafts from context |
| milestones[].text | **Infer** | AI proposes; user confirms batch |
| 7-field modal (INT-265) | **Kill** pattern | Single NL input → review card |

---

## Finance

| Field / Pattern | Verdict | Why |
|-----------------|---------|-----|
| amount | **Keep** | Core value |
| type | **Infer** | "spent" vs "earned" NLP |
| category | **Kill** | INT-285 biggest win; merchant NLP 85% |
| account | **Infer** | Last-used default |
| date | **System** | Today default — rarely changed |
| note | **Ask later** | Optional voice tail |
| 6-field EntryForm | **Kill** pattern | Voice/NL primary path |

---

## Calendar

| Field / Pattern | Verdict | Why |
|-----------------|---------|-----|
| title | **Keep** (NL) | Parsed from quick-add |
| start/end | **Infer** | Duration defaults |
| allDay | **Infer** | When no time in NL |
| recurrence | **Ask later** | Only when pattern detected |
| color | **Kill** | System from category |
| EventModal 6-field (INT-333) | **Kill** pattern | Quick-add default; modal for edge cases |

---

## Family

| Field / Pattern | Verdict | Why |
|-----------------|---------|-----|
| member.name | **Keep** | Required |
| member.relation | **Keep** | Emergency context |
| member.DOB | **Ask later** | Progressive disclosure |
| member.blood_group | **Ask later** | Emergency wizard only |
| member.phone | **Ask later** | Import contacts optional |
| document.file | **Keep** | Upload required |
| document.label | **Infer** | Filename/OCR |
| emergency.* bulk edit (INT-024) | **Ask later** pattern | Wizard not upfront — 65+ field wall |

---

## Placements

| Field / Pattern | Verdict | Why |
|-----------------|---------|-----|
| company | **Keep** (URL parse) | |
| role | **Infer** | JD parse |
| stage | **Infer** | Email parse future |
| application_date | **System** | Today default |
| notes | **Ask later** | |
| link | **Infer** | Clipboard detect |
| resume PDF | **Keep** | ATS requires |
| job description | **Infer** | URL fetch |
| 7-field intake (INT-493) | **Kill** pattern | URL paste primary |

---

## Focus, Discipline, Notes

| Field | Verdict | Why |
|-------|---------|-----|
| session rating | **Kill** | Low value; infer from duration |
| session notes | **Infer** | AI summary |
| linked goalId | **Infer** | Last active goal |
| trigger (discipline) | **Keep** | Core signal |
| intensity | **Kill** | Optional noise |
| replacement_habit | **Infer** | Suggest from habits |
| note title | **Kill** | First-line derive |
| note body | **Keep** | Content |

---

## Account, Settings, Feedback

| Field | Verdict | Why |
|-------|---------|-----|
| displayName | **Infer** | OAuth sync |
| location | **Kill** | IP geo coarse |
| bio | **Ask later** | |
| avatar | **Infer** | OAuth |
| theme | **System** | OS `prefers-color-scheme` |
| pinnedNav[] | **System** | Usage frequency |
| persona preset | **Infer** | Behavior clusters |
| feedback message | **Keep** | |
| feedback category | **Kill** | Infer from page |

---

## Lab & Command Palette

| Field | Verdict | Why |
|-------|---------|-----|
| substance (addiction) | **Keep** | Safety taxonomy |
| intensity (addiction) | **Kill** | |
| trigger (addiction) | **Infer** | Shared with Discipline |
| ai_log text | **Keep** | Primary AI surface |
| win/note separate fields | **Kill** | Merge to ai_log |
| 14-module launcher (INT-432) | **Kill** pattern | Palette routes to module |

---

## Duplicate Patterns (Cross-Cutting Kills)

| Pattern | Verdict | Surfaces | Retention impact |
|---------|---------|----------|------------------|
| Mood 1–10 picker ×5 | **Kill** → single primitive | Journal, Palette, DailyLog, MoodTracker, Discipline | Eliminate 4 redundant UIs |
| Theme swatch ×3 | **System** | Login, Settings, Account | Ask zero times |
| PIN numpad ×3 | **System** biometric | Login, Onboarding | −12 taps onboarding |
| Life Arc editor ×3 | **Kill** duplicates | Onboarding, Identity, Profile | Single source |
| Title fields (Goals, Notes, Calendar, Events) | **Kill** or **Infer** | Multiple | NL capture universal |
| Tags / Category manual | **Kill** | Habits, Finance, Feedback | NLP classification |
| Priority dropdown | **Kill** | Goals | Behavior inference |
| Journal Mode | **Kill** | Journal | Post-capture AI |

---

## Top 10 Kill List (Highest Retention ROI)

| Rank | Item | Est. fields saved / session | Verdict |
|------|------|----------------------------|---------|
| 1 | Finance category dropdown | 1 × every tx | **Kill** → Infer |
| 2 | Goals priority + pillar | 2 × every goal | **Kill** / **Infer** |
| 3 | Mood picker duplicates | 1–4 × daily | **Infer** |
| 4 | Journal mode selector | 1 × journal | **Kill** |
| 5 | Habits emoji/category/color | 3 × habit create | **Kill** |
| 6 | Notes title | 1 × note | **Kill** |
| 7 | Onboarding wake time | 1 once | **Kill** |
| 8 | Settings theme | 1 once | **System** |
| 9 | Calendar color | 1 × event | **Kill** |
| 10 | Feedback category | 1 × feedback | **Kill** |

---

## Related Documents

- [[PRODUCT_INTELLIGENCE_LAYER]] — full field matrix
- [[INTERACTION_COMPRESSION_SCORE]] — quantified savings
- [[../AIIMIN_PRODUCT_BIBLE/07_AUTOMATION_RULES]] — infer vs ask rules
