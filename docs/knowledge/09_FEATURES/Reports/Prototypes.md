# Report Prototypes

## Locks (2026-07-17)

| Tier | Locked direction | Notes |
|------|------------------|-------|
| **Core · Snapshot** | **Ivory Light** + **Ivory Dark** | Follows app theme. Device layouts: Phone / iPad / Laptop |
| **Pro · Standard** | **Life OS Review** | White body + ivory header band + 14-day fingerprint + numbered findings |
| **Elite · Intelligence** | **Craft in progress** | Web experience (not longer PDF). Design Lab: 6 interaction prototypes |

## Elite product rule (2026-07-17)

- **Pro = document** (downloadable Life OS Review PDF)
- **Elite = experience** (persistent URL `/reports/[id]`, interactive scroll, fingerprint hover, expandable correlations)
- PDF download on Elite = archive snapshot of the web report, not the product
- Signature element: **90-day Life Fingerprint** strip (Core/Pro do not get this)

## Elite Design Lab prototypes (pick one)

Path: Account → Design Lab → **Elite reports**

| # | Direction | Interaction idea |
|---|-----------|------------------|
| 01 | Fingerprint Brief | Sticky nav + hover fingerprint hero (reference) |
| 02 | Case Dossier | Left chapter rail + evidence drawers |
| 03 | Quarter Timeline | Vertical narrative spine of weeks |
| 04 | Correlation Lab | Graph-first Spearman edges |
| 05 | Command Deck | Sticky fingerprint + open/close instrument panels |
| 06 | Briefing Slides | Full-stage slides + arrow-key nav |

## Elite pause constraints (still valid)

- Do **not** dump raw “Appendix A” daily tables at the user
- Reject font-only / skin-only variants as “new prototypes”
- Do not ship Elite as a longer PDF

## Core device shells

Matches [[02_ARCHITECTURE/Device-Tiers]]:

| Device | Exact viewport (CSS px) | Bezel |
|--------|-------------------------|-------|
| Phone | **390×844** (iPhone 14 logical) | Rounded phone + notch |
| iPad | **1024×768** landscape | Tablet bezel + side cam |
| Laptop | **1440×900** | Window chrome + traffic lights |

Preview **scales the whole frame** to fit your browser — layout math stays at those pixels (not full-window fakes).

## Open

```bash
cd prototypes/reports && python3 -m http.server 8765
```

→ http://localhost:8765

## Production mapping (2026-07-17)

| Plan | Live product |
|------|----------------|
| Explore | Reports nav in More · locked Pro paywall (blurred Elite preview) |
| Core+ | Ivory Snapshot on `/reports` + Today “Your Report” card |
| Pro+ | Snapshot + Correlation Intelligence (top 3) + Life OS Review PDF (monthly pool 6) |
| Elite | Same as Pro until Intelligence web ships · prototypes in Design Lab |

## Changelog

### 2026-07-17 — Elite = web experience; six Design Lab paradigms
- **What:** Elite reframed as interactive web report (not PDF). Six distinct interaction prototypes in Design Lab. Pro PDF upgraded (fingerprint, white/ivory, numbered findings). Reports under More. Today Your Report card. Two-pool AI (daily + report gen).
- **Why:** User critique — Elite must not be “longer Pro”
- **Files:** `EliteReportsPrototypesPanel.jsx`, `YourReportCard.jsx`, `PDFReportGenerator.jsx`, `apiUsageService.js`, vault
- **Status:** local craft
