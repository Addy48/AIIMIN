# Craft Status Report — Tracks A–J

**Date:** 2026-07-15  
**Branch reality:** local `main` dirty tree — **not committed, not pushed, not on Vercel/EC2** until Adi asks.  
**Canonical plan:** [[Craft-Master-Plan-AJ]]

---

## Executive verdict

| Layer | Status |
|-------|--------|
| **CODE (A–J)** | Complete locally. Static acceptance checklist **26/26 PASS**. |
| **SCHEMA (C/`043`)** | **Applied** on Supabase project `yubxgftugxbwtywyhcsv` (`note_drive_watches` table verified). |
| **BUILD** | `frontend npm run build` → **exit 0** (2026-07-15). |
| **PROTOCOL screenshots** | **Partial.** Playwright captured login shells at 500/800/1100/1440. Auth-gated routes (`/overview`, `/onboarding`, `/m`) all redirect → `/login` without session. **Logged-in visual QA still required** for Priority+, life-mode step, Logger, Discipline, Goals Achieved, Celebration tiers, light ivory. |
| **SHIPPED** | **No.** Commit/push not requested this turn. |

---

## Track-by-track

### A — Discipline
- **CODE:** Yes. Rich Engine restored; Urge modal 15:00, breathe cycle, early exit (“It passed”), +5m extend, API `startUrge` / surf complete.
- **PROTOCOL:** No logged-in shots.
- **SHIPPED:** No.
- **Files:** `frontend/src/pages/Discipline.jsx`, related discipline CSS/API.

### B — Journal
- **CODE:** Yes. Studio capture + drawer tier (`historyAsDrawer` / `journal-studio__drawer`).
- **PROTOCOL:** No.
- **SHIPPED:** No.

### C — Notes + OCR + Drive
- **CODE:** Yes. `pdf-parse/lib/pdf-parse.js`; Drive routes before `/:id`; UI sync; `drive.readonly` in Google OAuth.
- **SCHEMA:** `043` **applied** 2026-07-15. Table columns: id, user_id, folder_id, folder_name, enabled, last_synced_*, created_at, updated_at.
- **Still soft-blocked for prod Drive:** (1) commit+push API + EC2 redeploy, (2) Adi reconnects Google once for Drive scope.
- **PROTOCOL:** No Notes UI shots.
- **SHIPPED:** No.

### D — Device / iPad
- **CODE:** Yes. `DeviceGate` phones → `/m`; tablets stay full OS; `?forceDesktop=1` bypass.
- **PROTOCOL:** Unauth `/m` redirects to login (shots show login). Real phone/tablet QA pending.
- **SHIPPED:** No.

### E — Goals Achieved
- **CODE:** Yes. Pipeline includes `Achieved`; Grid excludes; Archive = Achieved only; WON count uses Achieved.
- **PROTOCOL:** No.
- **SHIPPED:** No.

### F — Celebration
- **CODE:** Yes. CSS tiers: compact &lt;768; framed 768–1099; full-stage ≥1100.
- **PROTOCOL:** No (needs upgrade flow).
- **SHIPPED:** No.

### G — Nav Priority+
- **CODE:** Yes. Width measure + `More (N)`; Reports in `NAV_REGISTRY`; Cmd+K has Sports + Account (+ Reports, Settings, primary sections).
- **PROTOCOL:** Partial (login widths only — masthead not visible logged out).
- **SHIPPED:** No.

### H — Onboarding life-mode
- **CODE:** Yes. Step after wake / before baseline; `lifeModeId` starts `null`; Custom must be clicked; `applyPersonaPreset` before Today. Existing pins never auto-wiped.
- **PROTOCOL:** Unauth `/onboarding` → login. Need new-account or forced onboarding session to screenshot life-mode card.
- **SHIPPED:** No.

### I — Light tokens
- **CODE:** Yes. `[data-theme="aiimin-light"]` canvas `#EDE4D3`, body `#14171A`. `Palette.md` updated. Dark theme blocks not edited for this track.
- **Contrast:** `#14171A` on `#EDE4D3` = **14.26:1**.
- **PROTOCOL:** Need logged-in light theme Today shot.
- **SHIPPED:** No.

### J — Today capture (J0=A)
- **CODE:** Yes. Universal Logger only on Today; Quick Capture shim; widget migrate drops `quick_capture`. Restored missing Design Lab CSS `captureJ0Prototypes.css` (was breaking compile earlier).
- **PROTOCOL:** Need logged-in `/overview` shots at 500/800/1100.
- **SHIPPED:** No.

---

## Verification evidence (this session)

### Build
```text
cd frontend && npm run build
… The build folder is ready to be deployed.
exit_code: 0
```

### Static acceptance
```text
PASS 26/26
(G1 More(N), ResizeObserver, Reports, Cmd+K sports/account/reports/overview,
 H1 life-mode, I1 #EDE4D3 + dark intact, J logger+shim,
 A urge 15m+extend, C pdf-parse+drive.readonly+043 file,
 D /m+forceDesktop, E Achieved pipeline/archive, F 1100/1099 CSS,
 J0 proto CSS)
```

### Migration
```text
apply_migration note_drive_watches_043 → success
to_regclass was null before; columns verified after
```

### Screenshots on disk
Path: `docs/knowledge/12_SPRINTS/protocol-shots/`  
Captured: `login|m-capture|overview|onboarding|force-desktop` × widths `500|800|1100|1440`  
**Truth:** all authenticated destinations resolved to `/login` (no session in headless browser).

---

## What “complete” still means for you

1. **Hard-refresh local** while signed in — eyeball G/H/I/J + light mode.  
2. Say **`commit`** then **`push`** when you want Vercel + (for API) EC2.  
3. After API ships: **reconnect Google** once so Notes Drive scope sticks.

---

## Touched this close-out (code + vault)

- `captureJ0Prototypes.css` (new — fix Design Lab import)
- Supabase: `note_drive_watches` via migration
- Vault: Notes Changelog, this report, Master Plan live status, Current Context

**Not touched:** auth logic, dark `:root` product tokens for Track I, commit history.
