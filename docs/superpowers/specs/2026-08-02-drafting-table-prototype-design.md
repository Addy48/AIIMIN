# Drafting Table — mobile prototype (React recreation)

Date: 2026-08-02
Branch: `feat/drafting-table-prototype`
Status: building

## Goal

Recreate the **AIIMIN "Drafting Table"** mobile design (from
`~/Downloads/design_handoff_aiimin_drafting_table/`) as a **self-contained,
local-state React prototype** inside `frontend/`. Purpose: click through every
screen to verify the direction is right **before** the real app build (next
session). No backend wiring. No production auth/guards.

## Scope (this session)

The handoff's **validated core loop = 9 screens**. That is what is designed, so
that is what we build — pixel-faithful:

1. Day Sheet (home)  2. Live Score  3. Money (Overview/Budgets/Ledger tabs)
4. Capture  5. Lab (correlations)  6. OS-ID  7. Settings/Config
8. Onboarding (step 3/6)  9. Edge States (reference)

Plus, because the founder asked for tiers to be **interswitchable in testing**:
a dev toolbar **TIER switcher** (Explore/Core/Pro/Elite) that updates the OS-ID
+ Config tier badge live. Full paywall gating on locked features is a later
slice (decorates finished screens once modules exist).

### Explicitly NOT this session
Genesis modules (Goals, Journal, Focus, Discipline, Sports, Career, Family
Vault) — **undesigned in the handoff**. Building them now = inventing design.
They arrive in the real build once designed. Same for Reports/PDF,
notifications, WhatsApp capture, search, onboarding steps 1–2/4–6.

## Decisions (from founder)
- **Mount:** replace the thin `/m` shell eventually; for the prototype, mount at
  a public route `/proto/draft` so it opens without login. Isolated namespace
  `frontend/src/prototypes/drafting-table/` so next chat can promote cleanly.
- **Data:** local state only — the handoff's own state model + score formula.

## Design system (from README + industry-styles.css)
- **Themes** are the same markup, swapped token block. Dark "Drafting Table"
  default; light "Industry sheet" toggle. Tokens scoped to `.dt-root` (NOT
  `:root`) so they don't clobber the app's global `--color-*` bridge.
  - Dark: bg `#15171a` surface `#1c1f23` text `#e4e5e7` accent `#749dc4`
    hair `#26292e` rule `#353a41` muted `#8b9098` tint `#1b232c` danger `#e8735c`.
  - Light: bg `#f2f2f3` surface `#ffffff` text `#1d1f20` accent `#416180`
    hair `#d4d4d7` rule `#b7b7ba` muted `#6c6c6f` tint `#eef6ff` danger `#9e3526`.
- **Type:** Barlow Condensed 600 (chrome/labels, uppercase, .14–.24em),
  Barlow 400–500 (body), **JetBrains Mono** (every numeral). Life score
  `700 72px/.82`, letter-spacing `-.04em`.
- **Spacing** (0.85×): 3.4 / 6.8 / 10.2 / 13.6 / 20.4 / 27.2 px.
- **Radius:** cards/cells = **0** (square). Radius (2/4/7) on buttons only.
- **Blueprint frame:** hairline/accent border + four `+` registration marks at
  `-6px` corners; legend label breaks the top border (`top:-8px`, bg-padded).
- **Motion:** screen enter 280ms `cubic-bezier(.16,1,.3,1)` 8px rise+fade,
  children stagger 40ms cap 200ms; press `scale(.97)` 110ms; figure re-mount
  260ms opacity tick; skeleton 1400ms sweep (never a spinner); toast up 260ms,
  auto-dismiss 4.2s, carries UNDO. `prefers-reduced-motion` + in-app toggle.
- **Icons:** Lucide at stroke-width 1.5 (replace the hand-drawn placeholders).

## State (ported verbatim from the prototype)
`theme · screen · moneyTab · mins[5] · rails[3] · rung · pair · capText ·
chips[5] · ledger[] · captures[] · holds[] · spent · showAction · reduceMotion ·
synced · chosenId · toast · lastLedger` — plus `tier` (added for the switcher).

**Score formula (placeholder curve):**
`round(70.7 + minimumsDone*1.9 + (rung-3)*1.6 + (railAverage-70)*0.12)` → 78 at
defaults. Delta = score-78. Bands: 85+ excellent, 70–84 strong, 55–69 fair.

## File layout
```
frontend/src/prototypes/drafting-table/
  tokens.css              scoped .dt-root token sheet + keyframes + utility classes
  data.js                 MIN_LABELS, RAIL_LABELS, PAIRS, CHIP_DEFS, seed ledger/captures/holds, TIERS
  score.js                computeScore + band/delta helpers
  DraftingTableApp.jsx    state machine, phone frame, dev toolbar (screen jump + theme + TIER), bottom nav, toast host
  components/
    Blueprint.jsx         framed box with corner marks + optional legend label
    BottomNav.jsx         5-tab bar with lucide icons
    Sparkline.jsx         14-bar life-score sparkline
  screens/
    DaySheet.jsx  LiveScore.jsx  Money.jsx  Capture.jsx  Lab.jsx
    OsId.jsx  Config.jsx  Onboarding.jsx  EdgeStates.jsx
  index.js
```
Mount: `frontend/src/App.js` public route `/proto/draft`.

## Verification
Run `npm start`, open `/proto/draft`, screenshot each screen (both themes),
confirm: minimums recompute score, rail tap wraps 100→40 by 5, rung sets mark,
money tabs switch, capture typing reveals Offer → SETTLE writes ledger + UNDO,
Lab row selection, theme toggle, reduce-motion toggle, tier switch updates badge.
