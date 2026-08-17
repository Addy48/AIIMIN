---
Purpose: Quantitative repository metrics from filesystem inventory this pass.
Confidence: 0.86
Generated From: Shell find/du/wc; component folder Python count; agent inventories
Dependencies: [01_REPOSITORY_MAP.md](01_REPOSITORY_MAP.md), [04_SCREEN_INVENTORY.md](04_SCREEN_INVENTORY.md), [05_COMPONENT_LIBRARY.md](05_COMPONENT_LIBRARY.md), [08_API_MAP.md](08_API_MAP.md)
Consumers: Planning; progress baselining
Last Updated: 2026-07-22
Pass: 1/6
---

# 14 — Repository Statistics

Counts are **approximate snapshots** from 2026-07-22 local workspace.

## Screens & routes (web)

| Metric | Count |
|--------|------:|
| React page files under `frontend/src/pages` | 63 |
| Distinct React Router paths (App.js inventory) | ~40+ including legal/mobile/auth |
| Mobile `/m` routes | 3 |
| Account sections (`?section=`) | 8 |
| Native `*Screen.kt` found | 12 (+ chrome) |

## Components & frontend code

| Metric | Count |
|--------|------:|
| Component JSX files | 342 |
| Component folders | 40 (+ root) |
| Hooks files | 32 |
| Context providers | 7 |
| Frontend `src/api` helpers | 8 |
| Frontend `src/services` files | 3 |
| Frontend src JS/JSX/CSS files | 582 |
| KokonutUI files | 45 |
| ui/ primitives | 27 |

### Largest component folders

kokonutui 45 · charts 33 · ui 27 · root 21 · lab 20 · waitlist/landing 15 · dashboard 13 · journal 12 · calendar 12 · finance 11

## Backend

| Metric | Count |
|--------|------:|
| Route modules `server/routes` | 30 |
| Service modules `server/services` | 26 |
| Server JS files | 106 |
| Explicit HTTP handlers (approx) | ~195 + Better Auth catch-all |
| Jobs | 3 |
| Server migrations (023–048 set) | 26 files |
| Supabase migration files | 5 |

## Docs

| Metric | Count |
|--------|------:|
| Markdown under `docs/knowledge` | 158 |
| Markdown under all `docs/` | 208 |
| Vault DB notes | 8 |
| Vault API notes | 8 |

## Assets

| Metric | Count |
|--------|------:|
| Images under `frontend/public` (png/jpg/svg/webp/ico) | 25 |
| Today HTML prototypes | 12 (+ gallery) |

## Approximate sizes

| Path | Size |
|------|------|
| `frontend/src` | 5.0M |
| `frontend/public` | 2.1M |
| `frontend/` (incl. heavy artifacts) | up to ~2.2G observed |
| `server/` | 928K |
| `api/` | 8.0K |
| `docs/` | 6.2M |
| `deploy/` | 124K |
| `scripts/` | 244K |
| `prototypes/` | 188K |
| `native-android/app` | 382M |

## Most reused components

Full static ranking **not completed** this pass. Multi-file references observed for BrandLockup, EmptyState, FeatureGate, TierRouteGuard, PageHeader, ConfirmDialog patterns, MetricTile, HabitCircle, Shipped wrappers.

## Design Context pack

| Metric | Value |
|--------|-------|
| Documents | 17 (MANIFEST + 00–15) |
| Pass | 1/6 |

## Cross-references

- Tree → [01_REPOSITORY_MAP.md](01_REPOSITORY_MAP.md)
- Features → [03_FEATURE_INVENTORY.md](03_FEATURE_INVENTORY.md)
