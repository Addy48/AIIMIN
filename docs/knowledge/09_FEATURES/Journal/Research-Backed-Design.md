---
authority: engineering
derived_from: Genesis · Roadmap/AIIMIN-V1-Blueprint
status: active
owner: founder
lifecycle: living
last_reviewed: 2026-07-31
can_override_genesis: false
knowledge_layer: KL-BUILD
note_type: NT-SPEC
tags:
  - type/spec
  - domain/journal
  - status/living
---

# Journal — Research-Backed Design (post-2020)

> [!abstract] Satellite note
> Not the primary feature MOC. Primary contracts live in the folder’s main feature note + [[09_FEATURES/Index]].


> Flagship capture surface for Android Life OS. Complements Notes (structured knowledge) and Daily Log (metrics). **Private reflection** under P8-R-219 — never in analytics, never in push, never in cross-user insight prompts unless the user explicitly asks AI on that entry.

## Evidence base (cite before claiming)

| Finding | Source | Product implication |
|---------|--------|---------------------|
| Journaling / expressive writing shows small–moderate benefit as adjunct for anxiety/PTSD/depression symptoms; heterogeneity high | Sohal et al., *Fam Med Community Health* 2022 (meta-analysis of 20 RCTs) · [DOI 10.1136/fmch-2021-001154](https://doi.org/10.1136/fmch-2021-001154) | Offer as **optional self-tool**, never as therapy; plain language; no diagnostic claims |
| Expressive writing effects often **delayed**; short intervals between sessions (1–3 days) stronger than weekly | Guo et al., *Br J Clin Psychol* 2023 · [DOI 10.1111/bjc.12408](https://doi.org/10.1111/bjc.12408) | Default cadence: **brief sessions every 1–3 days**, not “write daily forever”; evening debrief optional |
| Writing treatments help PTSD symptoms vs wait-list; not a psychotherapy replacement | Guo et al. / network meta-analysis, *Psychol Med* 2021 | Frame: “process what happened,” never “treat trauma” |
| Gratitude journaling appears in several positive outcomes within the 2022 journaling meta | Sohal 2022 (gratitude subset) | Keep **What Went Well / 3 goods** as a light mode — not the only mode |
| Implementation intentions (if–then) underused in habit apps; reminder-only creates dependency | Wicaksono, PhD Birmingham 2022; WI 2023 habit-app analysis | Habit + Journal prompts: **cue → response** (“After brush teeth → 3-line journal”), taper reminders |
| Notification personalization + delay modes reduce fatigue | Janzen et al. 2022 (Reflective Spring Cleaning); Schneegass et al. 2020 NotiModes | Journal reminders: quiet hours, digest, max 1/day, user-chosen time |

## Modes (evidence-mapped)

| Mode | Evidence link | Session target | Gate? |
|------|---------------|----------------|-------|
| **Free write** | Capture-first (Genesis); expressive writing baseline | 5–15 min or 150–300 words | Never gate |
| **Expressive (feelings about one event)** | Pennebaker-style EW; Guo 2023 | 3 sessions over ~1 week when user chooses “process something” | Chip after open, not before |
| **What Went Well (3 goods)** | Gratitude subset of Sohal 2022 | 2–5 min | Optional evening |
| **Evening debrief** | Supports delayed effect + day closure | 5 min: what happened / what mattered / tomorrow one thing | Soft prompt after 20:00 |
| **CBT thought record (structured)** | Common clinical worksheet; **product is not therapy** | Situation → thought → feeling → evidence → reframe | Labeled “structured reflection,” not “therapy” |
| **Weekly review** | Retrospection for goals/habits link | 10–15 min Sunday | From Reports + Journal |

**Kill:** mode picker before first keystroke · clinical/diagnostic labels · shame if skipped · AI auto-read of all journals.

## UX rules that make it effective

1. **Catch → Settle first.** Blank page or one prompt; mode is a chip after first line.
2. **Short interval packs.** “3 evenings this week” pack for expressive mode (Guo 2023), not infinite streak guilt.
3. **Streak freeze applies** (Blueprint §8.11) — never “you broke journaling.”
4. **AI only on ask** for that entry; minimum text sent; journal excluded from weekly insight aggregates.
5. **Depth link:** completing a journal session can fill one daily-minimum slot (user choice).
6. **Android:** biometric lock option for Journal tab; draft survives process death.

## Weak claims — do not ship

| Claim | Why weak |
|-------|----------|
| “Contacts/friends improve wellbeing via our People tab” | No direct causal evidence for our feature; People is **life-admin linking**, not a social-health intervention |
| “Journaling cures depression/anxiety” | Meta-analyses show small adjunct effects, high heterogeneity |
| “Streaks always increase retention” | Reminder dependency + shame dropout documented in habit-app research |
| “More notifications = more journaling” | Notification fatigue research says opposite |

## Changelog

### 2026-07-31 — Research-backed Journal flagship
- **What:** Evidence map + mode architecture for Android Journal
- **Why:** Founder ask — flagship, post-2020 research, no weak social claims
- **Files:** this note; Blueprint §8.2 expansion; prototype v6
- **Status:** partial (spec); code wave later
---

## Mobbin alternatives (inspiration sources)

Use these instead of Mobbin paid when blocked. Adapt to AIIMIN palette (`#1a1a1a` / `#2d2d2d` / `#ff6b35`); reject purple SaaS, cream-editorial-as-OS, navy+cyan “Focus & Flow” cousin brands.

| Source | URL | Look for |
|--------|-----|----------|
| **Refero** | https://refero.design | Full flows: onboarding, settings, finance, notes |
| **Page Flows** | https://pageflows.com | Onboarding + permission priming sequences |
| **Pttrns** | https://pttrns.com | Classic iOS/Android pattern library |
| **UI Garage** | https://uigarage.net | Screen dumps by category |
| **Mobbin (free samples)** | https://mobbin.com | Only if plan available |
| **Material 3 / Android** | https://m3.material.io · predictive back docs | Edge-to-edge, nav bars, sheets |
| **Android UI kits (Figma community)** | search “Material You Android UI kit” | Density, lists, toggles |
| **Screenlane** | https://www.screenlane.com | Web + mobile SaaS screens |
| **Landingfolio / Land-book** | https://land-book.com | Marketing only — isolate from product UI |
| **Dribbble / Behance** | filter “Android settings” “habit tracker dark” | Mood only; never copy |
| **GPT exploration boards** (founder) | `assets/*today*`, `*settings*`, `*other_pages*` | Structure: grouped settings, profile card, filter chips — **recolor to Soft Neutral AIIMIN** |

**Adaptation rule:** steal **information architecture and interaction rhythm**, not palettes or illustration mascots.
