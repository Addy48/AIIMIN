---
authority: product
derived_from: Roadmap/AIIMIN-V1-Blueprint
status: active
owner: founder
lifecycle: living
last_reviewed: 2026-08-20
can_override_genesis: false
knowledge_layer: KL-PROD
graph_role: leaf
note_type: NT-APPENDIX
tags:
  - type/appendix
  - domain/product
  - status/living
---

# Blueprint appendix — Design, motion, components (§4–6)

> Parent spine: [[Roadmap/AIIMIN-V1-Blueprint]] · Full dump: [[Roadmap/Blueprint-Appendices/00_FULL_ARCHIVE]]

## 4. Design system

### 4.1 Token architecture (P8 Ch11)

```text
primitive  →  semantic  →  component
(#ff6b35)     (color.action)  (button.primary.bg)
```

Native (Compose) and web (CSS custom properties) both bind at the **semantic** tier. No client may introduce a cousin palette.

### 4.2 Locked colors (P8 Ch11 — immutable)

| Semantic | Hex | Use |
|----------|-----|-----|
| `color.action` | `#ff6b35` | Primary action, waterline, focus ring accent |
| `color.done` | `#10b981` | Settled / completed / positive |
| `color.muted` | `#6b7280` | Incomplete, secondary meta |
| `color.canvas.dark` | `#1a1a1a` | Dark app background (current) |
| `color.surface.dark` | `#2d2d2d` | Dark card (current) |
| `color.canvas.light` | `#f9f9f9` | Light background |
| `color.surface.light` | `#ffffff` | Light card |

**Danger** is not fixed in P8 by hex; V1 uses a **desaturated red** (`#d9534f`-class) defined in §4.3 ramp — semantic only, never decorative.

### 4.3 Soft Monotone dark ramp `[ADR REQUIRED — ADR-B3]`

**Problem (user feedback):** current dark mode fatigues eyes. Causes: near-black canvas against near-white text (contrast ratio too high for long reads), multiple saturated domain colors (calendar/event chips), and `#2d2d2d` cards on `#1a1a1a` giving low surface separation while text sits at 100% white.

**Proposal:** keep all brand/semantic colors; replace only the neutral ramp and text opacities. Three dark levels.

| Token | `dark` (default) | `dim` (new) | `light` |
|-------|------------------|-------------|---------|
| `color.canvas` | `#202124` | `#17181a` | `#f9f9f9` |
| `color.surface` | `#2a2c30` | `#202225` | `#ffffff` |
| `color.surface.raised` | `#32343a` | `#282a2e` | `#ffffff` |
| `color.border.subtle` | `#3a3d44` | `#2c2f34` | `#e8e8e8` |
| `color.border.strong` | `#4a4e57` | `#3a3d44` | `#d4d4d4` |
| `color.text.primary` | `rgba(255,255,255,.90)` | `rgba(255,255,255,.86)` | `#1a1a1a` |
| `color.text.secondary` | `rgba(255,255,255,.66)` | `rgba(255,255,255,.62)` | `#4b5563` |
| `color.text.muted` | `#9099a4` | `#828b96` | `#6b7280` |
| `color.action` | `#ff6b35` | `#ff6b35` | `#ff6b35` |
| `color.done` | `#10b981` | `#10b981` | `#10b981` |
| `color.danger` | `#e0685f` | `#d9605a` | `#c0483f` |
| `color.hold` | `#c9922f` | `#bd8a2c` | `#a3701c` |
| `color.uncertain` | `#7d8794` | `#75808d` | `#7b828c` |

**Notes**
- Neutrals are **tinted 2–4° toward the brand warm hue** — subtle cohesion, no visible color cast (`frontend-design` guidance).
- Body text capped at 90% white on dark; never `#ffffff` on `#1a1a1a`.
- `dim` is an explicit third option in Personalization, **not** an automatic OLED hack.
- `light` canvas remains `#f9f9f9` per P8 (supersedes older ivory).
- **Backward compatibility:** if the ADR is refused, V1 ships with `#1a1a1a`/`#2d2d2d` and applies only the text-opacity cap and monotone chip rules below — those need no ADR.

### 4.4 Monotone discipline rules (no ADR needed)

| Rule | Detail |
|------|--------|
| MD-01 | Domain/event types are conveyed by **shape + label + 3px accent edge**, not full-color chips |
| MD-02 | Charts use one neutral ramp + `color.action` for the active series; categorical color only where legally required for legibility, max 3 hues |
| MD-03 | Color alone never carries status (P8 Ch11) — always icon or text as well |
| MD-04 | Maximum **one** `color.action` element per visual group ("do this now") |
| MD-05 | No gradients on product surfaces; `/brand` may use atmosphere |
| MD-06 | No glass/blur cards as personality; blur only for genuine layering (sheet scrim) |

### 4.5 Typography (P8 Ch11 — LOCKED families)

| Role | Family | Where |
|------|--------|-------|
| Wordmark / manifesto | **Bodoni Moda** | Brand lockup, `/brand` only |
| Ritual / display | **Familjen Grotesk** | Brand moments, key OS headlines |
| Product UI | **Figtree** | All nav, body, buttons, labels |
| Measure | **JetBrains Mono** | Scores, money, timers, OS-ID, AEI |

A fifth identity face is forbidden. Inter as brand identity is forbidden.

**Type scale (product UI, fluid):**

| Token | Size (clamp) | Weight | Use |
|-------|--------------|--------|-----|
| `text.display` | clamp(28px, 4vw, 40px) | 600 | Ritual/brand headline |
| `text.h1` | clamp(22px, 2.6vw, 28px) | 600 | Page title |
| `text.h2` | 20px | 600 | Section |
| `text.h3` | 17px | 600 | Card title |
| `text.body` | 15px | 400 | Body |
| `text.body.sm` | 13.5px | 400 | Secondary |
| `text.label` | 12.5px | 500, +0.02em | Labels, chips |
| `text.measure.lg` | 34px | 500 mono | Life Score, AEI |
| `text.measure` | 15px | 500 mono | Money, timers |

**Font scale accessibility control:** Personalization slider ×0.9 / ×1.0 / ×1.15 / ×1.3 applied via root font-size; all sizes use relative units so the slider works. Native mirrors with `fontScale` clamp (respects OS setting; user override allowed up to 1.3).

### 4.6 Spacing, layout, radius

Spacing tokens (8pt-derived, existing `tokens.css`): `4, 8, 12, 16, 24, 32, 40, 48, 64`.

| Token | Value |
|-------|-------|
| `content.max` | 1320px |
| `content.pad` | 40px desktop / 20px tablet / 16px phone |
| `section.gap` | 32px |
| `nav.height` | 68px desktop / 64px mobile |
| `bottomnav.height` | 64px + safe area |
| `radius.sm` | 8px (chips, inputs) |
| `radius.md` | 12px (cards) |
| `radius.lg` | 18px (sheets) |
| `radius.full` | 999px (avatars, pills) |
| `touch.min` | 44×44 (48 native) |

**Rhythm rule:** vary spacing intentionally — tight groups (8/12) inside generous separations (32/48). Uniform padding everywhere is a slop signal.

### 4.7 Density modes (P8 Ch11 tone→density)

| Mode | Token | Applied to |
|------|-------|------------|
| Breath | `density.capture` | Logger, Journal editor, Voice session, Onboarding |
| Scan | `density.review` | Today reads, lists, Reports |
| Command | `density.command` | ⌘K results, Transactions table, Calendar week |
| Ritual | `density.brand` | `/brand`, splash, tier upgrade |

### 4.8 Elevation

| Layer | Web | Native | Use |
|-------|-----|--------|-----|
| Base | flat on canvas | 0dp | Capture surfaces, scan lists |
| Raised | 1px border + `0 1px 2px rgba(0,0,0,.18)` | 1dp | Cards, EntityPresent |
| Overlay | `0 12px 32px rgba(0,0,0,.32)` | 3dp | Sheets, Offer stack, palette |
| Veil | overlay + scrim `rgba(0,0,0,.56)` | 6dp + scrim | Irreversible confirms |

Capture (Breath) surfaces get **no decorative elevation** beyond Base.

### 4.9 Iconography & illustration

- Single icon family, 1.5px stroke, 20/24px grid (current: Lucide) — no mixed sets.
- **No large rounded icon tiles above every heading** (slop signal).
- Illustration is limited to: Depth hero figure (abstract), empty-state line marks, `/brand` diagrams. No mascots, no 3D blobs, no stock photos of people.
- Emoji is never IA (P5 forbidden).

### 4.10 Data visualization subset

Permitted in V1: line/area (trend), bar (period compare), dot-grid heatmap (habits, topic coverage), radial ring (score/AEI, one per screen), horizontal stacked bar (budget), sparkline **only when the number alone is ambiguous** (never decorative).

Every chart ships with: loading skeleton, empty state, error state, and a **text alternative** summarizing the trend (accessibility law INV-C-*).

---


## 5. Motion, gesture, and interaction system

### 5.1 Motion law (P8 Ch12)

| Law | Meaning |
|-----|---------|
| After-Settle | Celebration/feedback motion happens **after** truth is committed |
| Honest Hold | Pending never animates like success |
| One Motion | One meaningful motion per interaction, not layered flourishes |
| Interruptibility | Any animation is cancellable by user input |
| Meaning Without Animation | Reduced motion loses no information |
| Proportional Celebration | Habit tick ≠ tier upgrade ≠ nothing |
| Platform Body | Platform easing/back gestures win |

### 5.2 Duration bands + easing

| Band | Duration | Easing | Examples |
|------|----------|--------|----------|
| Instant | 0–80ms | linear | Press state, checkbox fill |
| Productivity | 150–250ms | `cubic-bezier(.16,1,.3,1)` (ease-out-expo-ish) | Row swipe settle, chip add, toast |
| Orient | 250–400ms | `cubic-bezier(.32,.72,0,1)` | Screen push, sheet open, depth transition |
| Ritual | 400–900ms | `cubic-bezier(.16,1,.3,1)` | Splash, tier upgrade, Sunday replay |

Forbidden: bounce/elastic easing; animating `width/height/margin/padding` (transform + opacity only; use `grid-template-rows` for expansion); idle "breathing" AI glow; casino motion on Scan surfaces.

### 5.3 Named transitions

| ID | Interaction | Motion |
|----|-------------|--------|
| MO-01 | Screen forward | translateX +12px + fade, 220ms |
| MO-02 | Screen back | reverse, 200ms (platform gesture wins) |
| MO-03 | Bottom sheet | translateY 100%→0, 280ms Orient |
| MO-04 | Sheet dismiss by drag | follows finger; settle 200ms |
| MO-05 | Habit/task complete | scale .96→1 + fill + strikethrough, 150ms + haptic light |
| MO-06 | Depth change | figure translateY + field gradient, 400ms, After-Settle |
| MO-07 | Life Score ring | stroke-dashoffset draw 700ms **once per session** |
| MO-08 | AEI ring | same, 700ms, once |
| MO-09 | Toast / Hand-back | translateY 8px + opacity 250ms; dwell 6s (undo) |
| MO-10 | Offer stack appear | stagger 60ms per chip, max 5 |
| MO-11 | List enter | fadeUp 24px + blur(4px)→0, stagger 60ms, max 8 rows |
| MO-12 | Theme change | cross-fade tokens 350ms |
| MO-13 | Tier upgrade | 3-beat: hold → land → unlock list, ~1.2s |
| MO-14 | Sync Hold → Settle | pill morph + count decrement, 200ms |
| MO-15 | Veil enter | scrim fade 180ms + dialog scale .98→1 |
| MO-16 | Voice waveform | live amplitude only while recording; stops on stop |

### 5.4 Reduced motion contract

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after { animation-duration: 1ms !important; transition-duration: 1ms !important; }
}
```
Plus behavioral fallbacks: depth = static position + label; ring = final value immediately; stagger = simultaneous; waveform = static level meter with numeric dB-free "recording" state.

### 5.5 Gesture grammar (V1, cross-surface)

| Gesture | Meaning | Where | Required non-gesture equivalent |
|---------|---------|-------|--------------------------------|
| Tap | Primary activate | Everywhere | — |
| Swipe right on row | **Complete / settle** | Habits, tasks, open loops, UPI review approve | Checkbox / button |
| Swipe left on row | **Snooze / archive** | Reminders, notifications, loops, UPI review skip | Row menu |
| Long-press row | Context menu (link, edit, delete) | Lists, person, transaction | Overflow "⋯" button |
| Pull down | Refresh / sync now | Today, Money, Calendar, Vault | Sync button in header |
| Drag handle | Reorder | Habits, Today widgets, nav pins | Move up/down in menu |
| Drag sheet | Expand/collapse/dismiss | All sheets | Close button |
| Horizontal carousel | Browse peer items | Open loops, people owing, drills | Arrow buttons (desktop) / list view |
| Pinch | Zoom | Document viewer only | Zoom buttons |
| Two-finger swipe | — | **Unused** (reserved) | — |
| Shake | — | **Never** used | — |

Rules: no gesture is the **only** path (IP-16); platform back/predictive back always wins (IP-14); back from Veil = **cancel**; back with an unsettled Pulse = **Drift**, never silent discard.

### 5.6 Haptics (native)

| Event | Pattern |
|-------|---------|
| Habit/loop complete | Light impact |
| Settle after sync | Light impact (once per batch, not per item) |
| Veil open | Warning tick |
| Destructive confirmed | Medium impact |
| Voice session start/stop | Light / medium |
| Error | Double light (never long buzz) |
| Depth surface reached | Medium — **once per day maximum** |

Respect system haptic setting; user toggle in Personalization.

### 5.7 When to click vs when to gesture

| Situation | Choose |
|-----------|--------|
| Repeated micro-action in a list | Swipe (with tap fallback) |
| Navigating to a detail | Tap |
| Any irreversible act | **Tap into Veil** — never gesture-only |
| Desktop bulk work | Click + keyboard, ⌘K, multi-select |
| Editing a small object | Sheet, not a new page |
| Editing a big object (goal, report) | Page |
| Reordering | Drag with handle |

### 5.8 Keyboard model (desktop)

| Key | Action |
|-----|--------|
| `⌘/Ctrl K` | Command palette |
| `L` | Logger focus (when no field focused) |
| `⌘/Ctrl Enter` | Save/settle in editors |
| `Esc` | Dismiss sheet/overlay; from Veil = cancel |
| `⌘/Ctrl Z` | Hand-back (undo) where reversible |
| `G` then `T/H/M/C/F/R` | Go to Today/Habits/Money/Calendar/Family/Reports |
| `/` | Search within current surface |
| `?` | Shortcut cheat sheet |
| `Tab` | Visible focus ring (2px `color.action`, 2px offset) |

All shortcuts documented in-app (Interaction inventory flagged "undocumented shortcuts" as debt — closed in V1).

---


## 6. Component library

Tiers follow UX-Architecture Phase 3 (T0–T10). For each component: **variants · states · motion · a11y · platform delta · usage rule**.

### 6.1 T0 Primitives

| Component | Variants | States | Notes |
|-----------|----------|--------|-------|
| `Button` | primary, secondary, ghost, danger, icon | default, hover, focus-visible, active, loading, disabled | Only **one** primary per group; loading shows spinner + keeps label; min 44px touch |
| `Input` | text, number, money (mono), search, PIN | default, focus, invalid, disabled, readonly | Label always present (no placeholder-as-label); error text below, `aria-describedby` |
| `Textarea` | plain, autogrow | as Input | `⌘Enter` saves |
| `Select` | native, custom listbox | + open | Custom only when native cannot (e.g. avatars); keyboard arrow support |
| `Checkbox` / `Toggle` | — | + indeterminate | Toggle = instant effect; Checkbox = form scope |
| `Chip` | filter, correction, tag, tier | selectable, selected, removable | Correction chips are the primary AI adjust mechanism |
| `Badge` | neutral, done, hold, danger, tier | — | Never color-only; includes text |
| `Avatar` | initials, photo, group | — | Initials derive from person name; deterministic neutral background |
| `Tooltip` | — | — | Never the only source of critical info |
| `Divider`, `Skeleton`, `Spinner` | — | — | Skeleton preferred over spinner for content |

### 6.2 T1 Feedback / overlay family

| Component | Purpose | Rules |
|-----------|---------|-------|
| `EmptyState` | Teach the next legal verb | Must contain: what this is, one action, why it's empty. No shame, no illustration-only |
| `StatusAlert` | inline honest status | variants: info, hold, warning, error, offline |
| `Toast` | ephemeral ack + Hand-back | 6s when undo present; never for errors requiring action |
| `Sheet` | small edits, session runners | drag handle, 3 sizes (peek/half/full), scrim, focus trap |
| `Dialog` | confirmations | non-destructive: Cancel/Confirm |
| `VeilGate` | irreversible acts | shows consequence, entity name, count; **Typed Veil** at peak (type `DELETE` / `WIPE ALL DATA`); no Hand-back after typed confirm |
| `Drawer` | side detail (desktop) | never used to hold primary nav |
| `LiveRegion` | announce async state | `aria-live=polite`; assertive only for errors |
| `ConflictResolver` | sync conflicts | shows both versions + timestamps + source; user chooses; "keep both" where lossless |

`window.confirm` is forbidden anywhere (P5).

### 6.3 T2 Navigation

| Component | Rules |
|-----------|-------|
| `BrandLockup` | **Split targets locked**: mark → `/brand`, wordmark → `/overview`. Never unified. |
| `Masthead` | pins (max 12), overflow More, utility cluster |
| `TabRail` | tablet; icon + expandable label |
| `BottomNav` | native 5 tabs; `/m` 2 items; active = weight + `color.action` underline (not glow) |
| `CommandPalette` | sections: Go, Capture, Search results, Actions; fuzzy; recent first; keyboard-complete |
| `Breadcrumb` | only where depth 3 (Family Documents, Person) |
| `SyncPill` | `Synced 2m ago` / `3 held` / `Offline` — tappable → Sync tray |

### 6.4 T3 Capture (sacred)

| Component | Rules |
|-----------|-------|
| `Logger` | Single free-text field; Enter-to-save must always work; no required category; AI runs **after** raw save |
| `OfferStack` | AI structure proposals; each shows domain, parsed fields, **confidence band**, provenance ("from your text"); Accept / Adjust / Dismiss |
| `CorrectionChip` | one-tap field fix |
| `MoodSelector` | 1–5, single row; **no second mood picker anywhere** |
| `PinEntry` | 6 digits, auto-advance, auto-submit, never in telemetry |
| `VoiceCapture` | record/stop, live level, local-first; shows where audio lives |
| `ScanCapture` | camera → crop → OCR → draft (transaction or document) |

### 6.5 T4 Domain rows

`HabitRow` (circle + streak + swipe), `TaskRow`, `TransactionRow` (mono amount, category, person link), `LendRow` (direction, person, outstanding, due), `PersonRow` (avatar, role, last interaction, owed amount), `DocumentRow` (type glyph, expiry badge, shared-with), `EventRow`, `NotificationRow`, `LoopRow` (open loop with one action), `DrillRow` (English drill with duration + skill tag).

All rows: 44px+, swipe grammar per §5.5, long-press menu, keyboard focusable, single-line truncation with tooltip/detail.

### 6.6 T5 Metric family (MERGE target D11)

**One** metric component with variants — replaces the current three (Hero/Tile/Metric).

| Variant | Use |
|---------|-----|
| `Metric.ring` | Life Score, AEI, steps goal (max one ring per screen) |
| `Metric.stat` | number + label + delta |
| `Metric.bar` | budget usage, skill level |
| `Metric.trend` | value + 7/30-day sparkline (only when trend matters) |

Rules: `AnimatedNumber` counts once per session; never fabricate precision; always show the period ("this week"); no gradient text on numbers.

### 6.7 T6 Charts

`LineChart`, `BarChart`, `DotHeatmap`, `StackedBar`, `RadialProgress`. Each: L/E/Err states + text alternative + keyboard-accessible data table fallback.

### 6.8 T7 Domain shells

`FocusRoom` (timer + intent + stats), `FinanceWorkspace` (tabs + filters + import), `CareerKanban` (drag columns), `CalendarGrid` (month/week/day/agenda), `DocumentViewer` (§8.8), `SessionRunner` (English §8.9), `VaultShell` (locked container).

### 6.9 T8 Marketing

Waitlist components stay isolated (`components/waitlist/*`) — must never be imported into product surfaces (prevents template drift).

### 6.10 T9 Experimental — REMOVE in V1

`kokonutui/*`, `DesktopWindow` — audited out of the shell (Phase 3 classification). Any needed pattern is re-implemented in the canonical tiers.

### 6.11 T10 Native kit (Compose)

Mirror of semantic tokens: `AiiminTheme` (color/typography/shape), `AiiminButton`, `AiiminCard`, `MetricRing`, `SwipeRow`, `AiiminSheet`, `VeilDialog`, `SyncBanner`, `DepthHero`, `PinPad`, `BiometricGate`, `SessionRunner`, `DocPreview`.

Contract: same **verbs and states** as web; rendering is platform-native (no WebView UI, no CSS port).

### 6.12 Forbidden components (P5 / Phase 3)

Decorative AI sparkle badges · second confirm system · any Life-Score chrome on `/m` · forced sidebar as primary nav · duplicate mood/theme/arc editors · `window.confirm` · glass-card grid as identity · DEMO/LIVE vanity chrome on Today.

---

