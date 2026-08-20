# 10 — Microcopy Audit

## Purpose
Audit titles, buttons, labels, errors, empties, and system messages for clarity, warmth, consistency, and brand personality.

## Confidence
★★★★☆ — Representative samples from primary flows; not exhaustive string inventory of all 515 frontend files.

## Evidence Sources
Login, Onboarding, ProductTour, Overview, UniversalLogger, Waitlist, Brand, Family empties, SyncBanner, mobileShellCopy, GuestTour, ErrorBoundary.

## Files Used
Cited components below.

## Reasoning
Microcopy is the personality users actually meet. Doctrine voice ≠ shell voice.

## Dependencies
[[01_FIRST_IMPRESSION]] · [[09_EMOTIONAL_DESIGN]]

## Consumers
Copy batch (UI brief P3), onboarding rewrite.

## Known Unknowns
Full i18n; tone across Lab modules.

---

## Brand voice spectrum (observed)

| Voice | Examples | Fit |
|-------|----------|-----|
| **Human Momentum / coach** | “Urge surf, not streak shame”; “Journal stays yours” | Best brand |
| **Ops / military** | “Day Control.” “Operational Intelligence” “Mission Control” | Conflicts with calm OS |
| **Marketing urgency** | Tester cutoff 31 July; Reserve my spot | Acquisition only |
| **System generic** | “Failed to add member”; “Loading account…” | Trust-neutral but cold |
| **Playful emoji** | Onboarding 💼🏃; wins 🔥✏️💰; GuestTour 👋 | Slop risk |
| **Honest constraint** | “Log the day here. Full Life OS on iPad or desktop.” | Excellent honesty |
| **Desktop deferral** | “Edit on desktop”; “No habits yet — create on desktop” | Honest; demotivating if overused |

---

## Consistency

| Topic | Issue |
|-------|-------|
| Product name job | Life OS vs intelligent workspace vs Day Control vs Personal dashboard (SEO) |
| Insights vs Reports | URL/name drift |
| Career vs Placements | Label ≠ path |
| Notes | Tour: sources ≠ native Keep notes |
| Subscriptions | GuestTour denies; Account sells tiers |
| PIN length | Historical audit mentioned 4 vs 6 — verify all paths say 6 |

---

## Clarity winners

- Universal Logger: “Tell AIIMIN what happened” / “One box. Describe your day — habits, mood, journal, money. AI sorts it.”
- Verify email: explains *why* (save data / write actions)
- SyncBanner pending/error/last synced (native)
- ProductTour chaptering (Home base, Consistency, Reflection…)

## Clarity losers

- “Operational Intelligence” — unclear user benefit
- OS-ID — needs one-line “why unique handle”
- Life Score 50 baseline — explain honesty vs gamification
- Tier blocks — feature context sometimes thin

---

## Warmth & humanity

**High:** Tour journal/discipline lines; Brand lede; Discipline coaching.
**Low:** Family CRUD toasts; ErrorBoundary “encountered an issue”; Finance empty sometimes procedural.

---

## Errors & empties

| Pattern | Quality | Example |
|---------|---------|---------|
| Actionable empty | Good | Family “Add Member”; Finance add account |
| Desktop-dependent empty | Honest/poor | Native habits |
| Generic toast | Weak | Failed to update document |
| Crash boundary | Weak-human | Try Again |

---

## Notifications / system

XP level-up — celebratory; can feel childish next to Human Momentum.
Monday Insight — coach voice when present.
PulseCheck — check-in voice; ensure non-guilt.

---

## Personality verdict

AIIMIN’s best microcopy sounds like a **rigorous friend**. Its default shell sounds like a **mission control dashboard**. Five-year love depends on the friend winning.

---

## Cross-link
[[13_AI_SLOP_ANALYSIS]] · [[17_UX_OPPORTUNITIES]]
