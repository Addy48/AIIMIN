# AIIMIN Interaction Audit — Master Report

**Audit date:** 2026-07-11  
**Scope:** Full frontend (`frontend/src/`) + auth callback surfaces  
**Method:** Route map (`App.js`) → page/component traversal → pattern grep (buttons, inputs, modals, forms, shortcuts)

---

## Executive Summary

This audit reverse-engineers the **user-facing interaction model** of AIIMIN — every navigable route, control, modal, shortcut, and server-triggered flow that shapes what the user can do. Implementation details are intentionally excluded; behavior and user steps are the artifact.

**Headline findings:**

| Finding | Detail |
|---------|--------|
| **No `/m` route in code** | Product rule says mobile `/m` = capture-only; current codebase uses **responsive routes** (`/journal`, etc.) + `BottomNav` on `<768px`. No separate mobile router. |
| **Highest friction** | Onboarding (9 steps + PIN), Family Vault (65+ inputs), Finance multi-tab entry, Lab module launcher (15 modules), Placements pipeline |
| **Lowest friction** | Journal mood-only capture, habit today-toggle, command-palette quick logs |
| **Top duplicate patterns** | PIN numpad (Login + Onboarding), mood 1–10 pickers (5+ surfaces), theme swatches (Login/Settings/Account), persona/nav presets |
| **Top inference opportunities** | Mood from text/voice, finance category from merchant, goal status from milestones, wake time from calendar, journal mode from sentiment |
| **Global shortcuts** | `⌘/Ctrl+K` command palette, `Space→L` universal logger, `Esc` closes overlays, Lab vocal `Space` for mic |

**Deliverables:**

| File | Contents |
|------|----------|
| [interaction_inventory.md](./interaction_inventory.md) | Full INT-001…INT-578 schema per interaction |
| [forms.md](./forms.md) | All forms, fields, validation |
| [dropdowns.md](./dropdowns.md) | Selects, menus, audit |
| [navigation.md](./navigation.md) | Route tree + nav graph |
| [friction.md](./friction.md) | Screen heatmap + top 100 expensive interactions |
| [fields.md](./fields.md) | Master field table |
| [interaction_graph.md](./interaction_graph.md) | Relationships + component deps |
| [duplicate_patterns.md](./duplicate_patterns.md) | Repeated UX patterns |
| [../interaction-telemetry.md](../interaction-telemetry.md) | Event taxonomy + funnels |

---

## Section 1 — Global Counts

| Metric | Count | Notes |
|--------|------:|-------|
| **Routes (declared)** | 37 | `App.js` `<Route>` elements incl. redirects |
| **Distinct page components** | 59 | `pages/**/*.jsx` |
| **Frontend source files** | 515 | `.jsx/.js/.tsx/.ts` under `frontend/src` |
| **Files with `onClick`** | 186 | |
| **`onClick` handler refs** | 692 | Includes non-button elements |
| **`<button>` tags** | 587 | |
| **`<input>` tags** | 180 | |
| **`<textarea>` tags** | 44 | |
| **Modal/dialog/sheet files** | 35 | Dialog, Modal, Drawer, ConfirmDialog, etc. |
| **Form submit surfaces** | 23 | `<form>` or `onSubmit` |
| **Dropdown/select surfaces** | 53 | Select, dropdown-menu, custom pickers |
| **Documented interactions (INT-*)** | **578** | Unique user-action entries in inventory |
| **Keyboard shortcuts (global/product)** | 8 | See navigation.md |
| **Navigation paths (nav registry)** | 12 | `NAV_REGISTRY` primary routes |
| **Upload interactions** | 12 | Resume, family docs, avatar, file-upload kokonutui |
| **AI interaction surfaces** | 24 | Command palette AI log, journal analyze, lab vocal, insights, ATS, etc. |
| **Confirm dialogs** | 18 | Delete account, habit delete, event delete, etc. |

---

## Section 6 — Interaction Density by Feature

| Feature | INT IDs | Avg Friction | Primary surfaces |
|---------|--------:|-------------:|------------------|
| Auth & Waitlist | INT-001–048 | 6.2 | Login, Onboarding, Waitlist |
| Global Shell | INT-049–098 | 3.1 | Navbar, BottomNav, CommandPalette |
| Overview / Today | INT-099–158 | 4.0 | Overview widgets, DailyLog, Logger |
| Journal | INT-159–208 | 3.8 | Capture, modes, sidebar |
| Habits | INT-209–248 | 3.2 | Toggle, create modal, matrix |
| Goals | INT-249–278 | 4.5 | Goal modal, milestones |
| Finance | INT-279–328 | 5.8 | Tabs, EntryForm, budgets |
| Calendar | INT-329–358 | 4.2 | Views, EventModal |
| Family | INT-359–408 | 6.5 | Members, docs, emergency |
| Focus / Pomodoro | INT-409–428 | 3.5 | Timer, reflection |
| Lab | INT-429–398* | 5.0 | 15 modules |
| Placements / Career | INT-399–428 | 5.5 | Pipeline, ATS, intake |
| Account / Settings | INT-429–458 | 4.0 | 8 sections |
| Insights / Reports | INT-459–472 | 3.0 | Read-mostly |
| Legal / Brand | INT-473–487 | 1.5 | Links only |

*Lab INT range overlaps in inventory sub-sections — see interaction_inventory.md Lab block INT-429–478.

---

## Section 7 — Accessibility & Interruptibility Summary

| Pattern | Coverage | Gap |
|---------|----------|-----|
| `Esc` closes modals | CommandPalette, Modal, ConfirmDialog, Navbar mobile | Not universal on all Lab modules |
| Focus trap (mobile nav) | Navbar drawer | BottomNav sheet partial |
| `aria-label` on icon buttons | Navbar, BottomNav | Many Lab/custom buttons lack labels |
| Keyboard form submit | Login, Onboarding PIN | Finance inline edits mouse-only |
| Guest mode banner | DashboardLayout | Blocks save on many writes |

**Interruptibility:** Most capture flows (journal, command palette logs) are interruptible. Onboarding PIN steps and Focus timer sessions are **partially interruptible** (state lost on refresh mid-PIN).

**Auto-recovery:** Journal drafts (local suggestions), goals cache (`localStorage`), week tasks (`localStorage`), nav prefs — yes. Server-backed forms — no without explicit save.

---

## Section 8 — AI Touchpoint Matrix

| Surface | User action | AI role today | Automation potential |
|---------|-------------|---------------|-------------------|
| Command Palette → Smart AI Log | Free text/voice | Classify → win/note/mood/task/journal | **Full** |
| Journal capture | Text + mood | Post-save analyze, auto-tag mode | **Partial** (infer mood/mode) |
| Journal structured modes | CBT/WWW/etc. | Theme/distortion tags | **Partial** |
| Overview Universal Logger | Space→L chord | AI categorize daily log | **Partial** |
| Lab Vocal Mastery | 60s recording | Review/feedback | **Full** |
| Placements ATS | Resume + JD upload | Match score | **Full** |
| Insights page | Filter + view | Generated copy | **Partial** |
| Monday Insight widget | Read | AI summary | **No** (read-only) |

---

## Cross-References

- **Friction heatmap:** [friction.md §2](./friction.md)
- **Top 100 expensive:** [friction.md §3](./friction.md)
- **Duplicate patterns:** [duplicate_patterns.md](./duplicate_patterns.md)
- **Telemetry & funnels:** [interaction-telemetry.md](../interaction-telemetry.md)
- **Field inference:** [fields.md §5](./fields.md)

---

## Audit Limitations

1. **Kokonutui / Design Lab prototypes** in Account → Design are **internal design tools**, not shipped user flows — included but flagged as `design-internal`.
2. **TierRouteGuard** blocks navigation to gated routes — interaction exists as redirect/toast, not feature UI.
3. **Dynamic lists** (habit rows, goal cards, calendar events) documented as **pattern + instance multiplier** where identical.
4. **Server-only flows** (OAuth redirect, email verify link) documented at callback page only.
