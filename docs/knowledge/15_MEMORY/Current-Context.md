# Current Context

> Agents read after Home. Keep ≤400 lines. Update every work session.

**Date:** 2026-07-12

## Today

- Vercel ERROR root cause: `EntryForm.jsx` broken ternary (sibling JSX without fragment)
- Fix: wrap account picker + hint in `<>...</>`
- Local `npm run build` PASS
- QA SHA was `e3212bc9` / docs `e8a39332` — both ERROR on Vercel until this fix ships

## Ship now

1. Commit EntryForm fix + context
2. Push `main`
3. Confirm Vercel READY
4. EC2 API deploy (SSH or Action)

## Links

- Failed dpl: `dpl_7obBuprXNPaNJQ4ZAiw3ubvng8A1` (EntryForm SyntaxError L181)
- QA tracker: `11_BUGS/QA-Run-2026-07-12.md`
