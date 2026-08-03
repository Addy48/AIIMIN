---
authority: operations
derived_from: Genesis · 10_DECISIONS
status: active
owner: founder
lifecycle: living
last_reviewed: 2026-08-03
can_override_genesis: false
knowledge_layer: KL-META
graph_role: hub
note_type: NT-GUIDE
tags:
  - type/guide
  - status/living
---

# Decisions, and why

> The point of this note: when a future you (or an agent) asks "why is it like that?",
> the answer exists in one place and nobody re-litigates it.

## Locked — do not reopen

### App stack — Kotlin + Jetpack Compose, from scratch
**Decided 2026-08-03.** Native, Android-first, at `native-android-v3/`.

Chosen over Expo/React Native and Compose Multiplatform for the native ceiling — real
gestures, haptics, no webview, full control of the Drafting Table look. You said "no corner
cutting"; this is the option that honours that.

Cost accepted: the design system is rebuilt in Compose from zero, and Android-only for now.
`native-android/` (V2) is the **old app** — read its `sync/`, `session/`, `security/`,
`data/network/` for the working API contract, **never its `ui/`**.
→ [[15_MEMORY/Handoff-Native-App-Build]]

### Life Score — five dimensions
**Decided 2026-08-03.** `physical · cognitive · discipline · financial · emotional`, shown as
**BODY · MIND · DISCIPLINE · MONEY · MOOD**.

It was never a real three-way choice. Only this set has an engine behind it
(`server/services/lifeHealthEngine.js`). The Today-surface set
(Body/Mental/Goals/Money/Sleep) had no maths — and mixed a dimension, a base metric and a
feature. The prototype set had **six** entries, not five. Picking either would have meant
rewriting the report engine to gain nothing.

Keys are the contract; labels are presentation. That's how you keep the warmer naming without
touching arithmetic. → [[10_DECISIONS/2026-08-03-life-score-taxonomy]]

### Design — Drafting Table, locked
Palette and typography are founder-approved and **not open for redesign**. Craft, layout and
motion **are** open.

Steel accent `#749dc4` dark / `#416180` light. `#ff6b35` is the peak-A brand spark — **one**
warm node, never a UI accent. Barlow Condensed for chrome, Barlow for body, **JetBrains Mono
for every numeral**. Square corners, hairline borders, radius on buttons only.

Source of truth: `frontend/prototypes/AIIMIN-Drafting-Table.html`, tokens at
`frontend/src/prototypes/drafting-table/tokens.css`. → [[08_DESIGN/Palette]]

### Genesis is constitutional
Today is capture-first. There is **no Dashboard surface** — refused as a primary home
(GOV-165), along with Tasks boards, Projects boards, and collages of read-only modules. Every
surface declares one job (P8-R-124). Genesis is immutable; nothing overrides it except you, in
chat. → [[Maps of Content/Genesis]]

### The vault — one source, generated view
`docs/knowledge/` is canonical. Your personal vault is a **symlink** to it plus your own
private notes — not a second copy. This exists because two hand-authored vaults drifted for a
month and one ended up claiming Clerk was the auth.
→ [[16_DOCUMENTATION/VAULT-CONSOLIDATION-2026-08-03]]

### Weekly Pulse (WHO-5) — rejected
Removed from the entry flow. Never stack it with the onboarding tour.

## Closed — historical only

**The three-prototype bake-off (TIDE / RELAY / ATLAS).** Superseded by the Drafting Table
direction. TIDE and RELAY were built; ATLAS never was and never will be. Do not resume it.
The `frontend/prototypes/personal-os/` mission is spent.

**"React first, native later."** The old recommendation to promote `/proto/draft` → `/m` and
port to native afterwards. Superseded by the Kotlin decision above.

## Still open — your call

| Question | What it blocks |
|---|---|
| **Voice scope** — ship transcription into Capture first, or build the full voice + English-practice suite in one pass | P3 feature line |
| **AI keys** — Groq, Gemini, OpenRouter (all free tier), none created yet | every AI feature |
| **`frontend/prototypes/personal-os/`** — 120 untracked files, 11 MB from the closed bake-off: archive outside the repo, commit, or trim | repo cleanliness |
| **`native-android/` (V2)** — keep the directory, or move it to a tag/branch and delete | public repo clarity |

Full list: [[17_NATIVE_APP_V2/AIIMIN_MASTER_STATUS_AND_NEXT_STAGE]] §9

## See also

[[Guides/Start-Here]] · [[Guides/How-It-Works]] · [[Dashboards/09_Decisions-Dashboard]]
