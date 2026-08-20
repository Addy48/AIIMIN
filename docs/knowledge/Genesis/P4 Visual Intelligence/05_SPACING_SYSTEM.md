---
Purpose: Extract observed spacing scale, rhythm, density — and whether a reusable system exists.
Confidence: 0.84
Evidence Sources: tokens.css spacing; DESIGN.md; native vault 8pt grid; screen padding samples; page CSS
Files Used: frontend/src/styles/tokens.css; DESIGN.md; docs/knowledge/17_NATIVE_APP_V2/06_DESIGN_SYSTEM.md; ScreenChrome.kt; various page paddings (sampled)
Reasoning: Spacing is identity through rhythm; inconsistency reads as “template with different data.”
Dependencies: 06, 12
Consumers: Layout work, native Compose, FE polish
Known Unknowns: Full histogram of every padding value in JSX inline styles not exhaustively counted
Last Updated: 2026-07-22
Pass: 4/6
---

# 05 — Spacing System

## Tokenized web scale (`tokens.css`)

| Token | Value |
|-------|-------|
| `--space-1` | 4px |
| `--space-2` | 8px |
| `--space-3` | 12px |
| `--space-4` | 16px |
| `--space-5` | 24px |
| `--space-6` | 32px |
| `--space-7` | 40px |
| `--space-8` | 48px |
| `--space-9` | 64px |

Layout:

| Token | Value |
|-------|-------|
| `--content-max` | 1320px |
| `--content-pad` | 40px |
| `--section-gap` | `var(--space-6)` (32px) |
| `--nav-height` | 68px |
| `--nav-height-mob` | 64px |
| `--bottom-nav-height` | 64px |

Component heights:

| Token | Value |
|-------|-------|
| `--card-hero` | 120px |
| `--card-tile` | 100px |
| `--row-task` | 48px |
| `--circle-habit` | 48px |

## Native intent (vault)

8-point grid: **4, 8, 12, 16, 24, 32, 48, 64**.  
Horizontal padding: 16 compact / 24 medium.  
Card padding: 16–24.  
Section gap: 24–32.

## Native observed (no central token file)

Common paddings: 16, 20, 24; bottom nav 64; empty states 32–48; auth hero 48.  
`AiiminCard` padding ~20. `ScreenChrome` header 20h×16v.

## Rhythm assessment

| Area | Breathing room | Density | Consistency |
|------|----------------|---------|-------------|
| Brand / waitlist | High | Low | High |
| Journal studio | Medium–high | Editorial | Medium–high |
| Notes studio | Medium | Content | Medium |
| Overview | Medium | Medium–high | Medium |
| Family / Settings | Low–medium | High card stacks | Low (inline) |
| Focus Room | Atmospheric | Low chrome, high emotion | One-off |
| `/m` | Medium | Capture-sparse | Hardcoded but coherent |
| Native Home | Medium | Glanceable | Medium |
| Native Settings | Medium | List density | Generic M3 |

## Alignment & whitespace

- Desktop Overview uses main + sticky rail — good structural rhythm when widgets simplified
- Many pages use `.page-container` shared padding — **same chassis**, different data
- Family.css defines better tab rhythm but **is not imported** — dead system

## Can spacing become a reusable system?

**Yes — tokens already exist on web.** Gap is **enforcement**:

1. Prefer `--space-*` over magic numbers in JSX
2. Native needs a `Spacing.kt` / CompositionLocal mirroring the 8pt scale
3. Cap decorative outer card padding inflation (20–24px everywhere flattens hierarchy)

## Board challenge

- **Principal Product Designer:** Dense Life OS is intentional — do not “air out” Today into a marketing landing. DNA wants **cockpit with calm read surfaces**, not gallery whitespace everywhere.
- **Mobile Specialist:** 48dp touch / 44px icon buttons on touch tiers (`DESIGN.md`) — spacing must protect targets, not just aesthetics.
