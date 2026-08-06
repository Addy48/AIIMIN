# Current Context

> Agents read after Home. Keep ≤400 lines.

**Date:** 2026-07-18

## Today

- **Seed:** `scripts/seed-realistic-life.mjs` — one account (`SEED_USERNAME` / AADI0837). Removable: `node scripts/seed-realistic-life.mjs --wipe-only --confirm`. Docs [[16_DOCUMENTATION/Seed-Demo-History]].
- **Reports:** Folio → **Life OS Review**; PDF download via `pdf().toBlob()`.
- Finance / Lab / Focus / Discipline / calendar / habits UI + auth DB P0 in this commit batch.

## Next

1. Use wipe-only when site needs fresh for AADI0837; re-seed with `--confirm` when testing again
2. Keep local API on `:3001` for OS-ID / habits
3. Do not push unless asked

## Touch

- `scripts/seed-realistic-life.mjs` · `docs/knowledge/16_DOCUMENTATION/Seed-Demo-History.md`
- `frontend/src/components/PDFReportGenerator.jsx` · Finance / Lab / Focus / Discipline
- `server/migrations/045_*` … `047_*` · `server/routes/{db,lab,focus,habits}.js`
