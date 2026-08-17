# 14 — Friction Analysis

## Purpose
Catalog unnecessary steps, confusing decisions, interruptions, hesitations, and dead ends — ranked Critical → Minor — with evidence IDs.

## Confidence
★★★★★ — Anchored to interaction-audit friction composites + 2026-07-22 platform findings.

## Evidence Sources
`docs/interaction-audit/friction.md`; master audit; native UX exploration; Device-Tiers; kill list.

## Files Used
friction.md top 100; journey maps in [[04_USER_JOURNEYS]].

## Reasoning
Rare high-stakes friction ≠ daily friction. Both ranked; daily weighted higher for five-year pain.

## Dependencies
[[07_COGNITIVE_LOAD]] · [[04_USER_JOURNEYS]]

## Consumers
Kill list execution, sprint prioritization.

## Known Unknowns
Live rage-click / hesitation telemetry (proposed).

---

## Screen heatmap (from audit)

| Rank | Screen | Avg friction |
|-----:|--------|-------------:|
| 1 | Onboarding | 6.8 |
| 2 | Family Vault | 6.5 |
| 3 | Finance | 5.8 |
| 4 | Placements | 5.5 |
| 5 | Lab | 5.0 |
| … | … | … |
| Low | Habit toggle / legal / sports read | ≤3.2 |

---

## Ranked friction register

### Critical

| ID | Friction | Type | Evidence |
|----|----------|------|----------|
| F-C1 | Activation length (PIN + 10 onboarding + verify + tour) | Unnecessary steps / fatigue | TOTAL_STEPS=10; INT-006/011/012/014 |
| F-C2 | Plan-day requires mental merge across 4 surfaces | Context switch | Intent graph |
| F-C3 | Three divergent phone/desktop IAs | Relearning | Device-Tiers + native + `/m` |
| F-C4 | Mood asked on 5 surfaces | Duplicate decision | duplicate_patterns |
| F-C5 | Native habits cannot be created | Dead end for phone-only | HomeScreen empty copy |

### Major

| ID | Friction | Type | Evidence |
|----|----------|------|----------|
| F-M1 | Finance 6-field every tx | Daily cost | INT-285 composite 80 |
| F-M2 | Family emergency 20+ fields | Anxiety wall | INT-024 |
| F-M3 | Lab 14-module launcher | Choice overload | INT-432 |
| F-M4 | Journal mode before write | Hesitation | INT-166; Bible kill |
| F-M5 | Dual Settings/Account | Confusing decision | CommandPalette targets both |
| F-M6 | Native notes not editable after save | Dead end | NotesScreen |
| F-M7 | AI log misroute without strong correct | Trust hesitation | Logger journey |
| F-M8 | TierRouteGuard repeated denial | Interruption | ×8 routes |
| F-M9 | Google auth leaves native to browser | Context break | WelcomeGate |
| F-M10 | Space→L undiscoverable | Hidden power | loggerShortcut |

### Medium

| ID | Friction | Type | Evidence |
|----|----------|------|----------|
| F-Med1 | Goals 7-field create | Planning overhead | INT-265 |
| F-Med2 | Calendar full EventModal | Cognitive | INT-333 |
| F-Med3 | DailyLog multi-metric | Daily cost | INT-099 |
| F-Med4 | Insights → Reports redirect | Confusion | Insights.jsx |
| F-Med5 | Career vs Placements naming | Hesitation | navItems |
| F-Med6 | Pull-to-refresh only on native Home | Broken expectation | SyncBanner text vs reality |
| F-Med7 | Widget customize rabbit hole | Procrastination | Overview picker |
| F-Med8 | Email verify gate | Context switch | VerifyEmail |

### Minor

| ID | Friction | Type | Evidence |
|----|----------|------|----------|
| F-Min1 | Brand lockup split untaught | Mild confusion | BrandLockup |
| F-Min2 | XP modal interrupt | Interruption | gamification |
| F-Min3 | PWA install prompt | One-time | INT-067 |
| F-Min4 | Guest glass banner | Visual interrupt | DashboardLayout |

---

## Interruptions

- PulseCheck modal on Today
- XP level-up
- Tier upgrade modal
- ProductTour invite
- Biometric on every native resume (security — justified but felt)
- Waitlist pending full-screen for signed-in no-access

---

## Dead ends

- Native note cards non-tappable
- Native habit empty without in-app create
- Guest write attempts
- Gated routes without contextual preview of value
- Prototype features not in prod (Tasks/Projects) if users saw prototype first

---

## Protect list (anti-friction)

Do not “enrich” these:
- Habit today toggle (12)
- Journal mood-only (15)
- ⌘K open (12)
- Palette quick logs (~18)

---

## Cross-link
[[17_UX_OPPORTUNITIES]] · [[18_RISK_REGISTER]] · [[19_EXECUTIVE_SCORECARD]]
