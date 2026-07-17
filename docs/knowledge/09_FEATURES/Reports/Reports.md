# Reports

## Contract

- Route: `/reports` — **Explore** sees locked paywall; **Core+** Snapshot; **Pro+** Folio + Patterns/Skills; **Elite** Intelligence web (craft)
- Nav: **Reports under More** (not Account). Badge `INTEL` in More menu. Personas keep Reports active but unpinned by default.
- Today: **Your Report** card on Overview — Snapshot for Core+, CTA Standard/Intelligence for Pro/Elite, locked for Explore.
- Products by plan:
  - **Explore:** No report content. Blurred Elite preview + Pro badge paywall.
  - **Core (₹29):** Ivory Snapshot only (7d). Weekly AI insight uses 1 daily call when triggered. No PDF.
  - **Pro (₹49 founding):** Snapshot + **Correlation Intelligence (top 3)** + Standard Folio PDF (14-day). PDF pool: **6/month** (separate from daily AI). Daily AI: 25.
  - **Elite (₹79 founding):** Everything Pro + Interactive Intelligence Report (30/60/90). Deep pool: **3/month**. Unlimited Standard PDFs. Daily AI: 40 (never burned by Deep gen).
- Two-pool AI: daily feature calls vs monthly `report-gen` (`POST /intelligence/report-gen/consume`). Deep/Folio never touch daily quota.
- Legacy: `/insights` → `Navigate` to `/reports?tab=patterns` (or `skills` if `?tab=skills`) — Patterns/Skills require Pro+
- Data: `GET /api/intelligence/report?days=&start=&end=`
- PDF export: `PDFReportGenerator` — Folio Life OS (white + ivory band + 14-day fingerprint + numbered findings). Pro+ only.

## UI

- Core: Ivory Snapshot only
- Pro+: period chips + tabs Report / Patterns / Skills; Snapshot (+ correlations) on Report tab
- Design Lab: Account → Design → **Elite reports** (6 interaction paradigms)

## Files

- `frontend/src/pages/Reports.jsx`
- `frontend/src/components/reports/IvorySnapshot.jsx`
- `frontend/src/components/overview/YourReportCard.jsx`
- `frontend/src/components/PDFReportGenerator.jsx`
- `frontend/src/pages/account/sections/design/EliteReportsPrototypesPanel.jsx`
- `frontend/src/utils/tierGating.js`
- `server/routes/intelligence.js`
- `server/services/apiUsageService.js`

## Related

- [[09_FEATURES/Reports/Prototypes]]

## Changelog

### 2026-07-17 — Elite web direction + Pro polish + two-pool AI + nav/Today
- **What:** Reports under More; Today Your Report card; Explore paywall; Pro Snapshot correlations; Folio PDF polish; monthly report-gen pool; six Elite interaction prototypes in Design Lab. Brand manifesto + lockup split + auth OS-ID resolve.
- **Why:** User critique 2026-07-17 — Elite ≠ longer PDF; two pools required for Deep gen.
- **Files:** `Navbar.jsx`, `YourReportCard.jsx`, `IvorySnapshot.*`, `PDFReportGenerator.jsx`, `Reports.jsx`, `apiUsageService.js`, `intelligence.js`, `billingService.js`, `EliteReportsPrototypesPanel.jsx`, `Brand.*`, `BrandLockup.jsx`, `Login.jsx`, vault
- **Status:** shipping
- **Notes:** Elite production `/reports/[id]` shell not shipped — pick Design Lab direction first

### 2026-07-17 — Ship Core Ivory + Pro Folio to production
- **What:** `/reports` open to Core+. Core sees Ivory Snapshot (7d). Pro+ keeps Patterns/Skills + Folio Life OS PDF.
- **Status:** shipping
