# 05 — Navigation Audit

## Purpose
Evaluate how users move through AIIMIN: findability, predictability, cross-device nav continuity, and hidden destinations.

## Confidence
★★★★★ — Code routes and nav components verified; older `navigation.md` flagged stale where contradicted.

## Evidence Sources
`App.js`, `navItems.js`, `Navbar.jsx`, `BottomNav.jsx`, `TabRail.jsx`, `BrandLockup.jsx`, `DeviceGate.jsx`, `CommandPalette.jsx`, `AiiminRoot.kt`, Device-Tiers.

## Files Used
Above + `MobileBottomNav.jsx`, `MoreScreen.kt`.

## Reasoning
Navigation is a journey skeleton. Failures here multiply every other friction.

## Dependencies
[[03_INFORMATION_ARCHITECTURE]]

## Consumers
Nav craft tracks G/H; native shell; docs refresh.

## Known Unknowns
Heatmaps of pin usage; % users who find Space→L.

---

## Navigation systems (count them)

AIIMIN currently teaches **multiple navigators**:

| # | System | Where |
|---|--------|-------|
| 1 | Masthead pinned links + More | Desktop |
| 2 | TabRail icons | Tablet |
| 3 | BottomNav (4 pins + More) | Tablet-width dashboard (not phone `/m`) |
| 4 | Phone `/m` bottom tabs | Today / Score / Account |
| 5 | Native 5 tabs | Home / Journal / Notes / Vault / More |
| 6 | Command Palette | Global jump + logs |
| 7 | Avatar → Account | Profile island |
| 8 | Brand lockup split | Mark→Brand, text→Today |
| 9 | In-page tabs | Finance, Family, Reports, Lab… |
| 10 | More→browser escapes | Native web features |

**Challenge:** Power-user flexibility vs learnability. Consensus: too many navigators for one mental model; Palette should be accelerator, not compensation for IA sprawl.

---

## Desktop / tablet behavior

- Pins default: Today, Habits, Goals, Journal, Notes (max 12).
- Overflow “More” hides domains — Career/Lab/Discipline easily become invisible.
- Tablet: TabRail + capped masthead (Device-Tiers: max 8 + More).
- BottomNav on non-phone dashboard widths — easy to confuse with phone product.

---

## Brand lockup (LOCKED product rule)

- Logo mark → `/brand`
- AIIMIN wordmark → `/overview`

**UX read:** Clever brand system; untaught. Users may think entire lockup is Home. First-time confusion minor; brand education major.

Stale audit docs that say lockup → overview only are wrong.

---

## Command Palette as nav

23 actions: 17 navigation + 6 quick logs. Strong for power users; weak as primary wayfinding for newcomers (must know ⌘K).

Targets include Settings and Account separately — reinforces dual preference homes.

---

## Phone web `/m`

DeviceGate redirects authed phones to `/m`.
Tabs: Today, Score, Account (+ Get App).
**Cannot** reach Habits/Goals/Lab via this shell — correct per product lock, shocking if user expected full OS from ads.

---

## Native

Index-based tabs 0–4; no NavHost deep links found.
More pane nests Focus/Discipline/Goals/Settings.
Globe tiles open desktop features in browser — honest escape hatch, breaks immersion.

---

## Dead ends & traps

| Trap | Why |
|------|-----|
| `/insights` | Redirect only → Reports |
| `/settings` vs `/account` | Split brain |
| Native note cards | No detail route after save |
| Native habits | No create; empty points to desktop |
| Guest blocked writes | Banner explains; still feels broken if ignored |
| TierRouteGuard | Navigation exists as denial |

---

## Predictability score (expert judgment)

| Dimension | Score /10 | Note |
|-----------|----------:|------|
| Desktop domain findability | 6 | Pins help; overflow hides |
| Cross-device continuity | 3 | Three IAs |
| Deep link / share entry | 2 | Native deep links unspecified/unimplemented |
| Keyboard power nav | 8 | ⌘K excellent |
| First-week learnability | 4 | Tour required |

---

## Cross-link
[[03_INFORMATION_ARCHITECTURE]] · [[12_PLATFORM_CONTINUITY]] · [[14_FRICTION_ANALYSIS]]
