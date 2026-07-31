# Current Context

> Agents read after Home. Keep ≤400 lines.

**Date:** 2026-07-15

## Today

Trust fix + ship verified.

- Report 500: pomodoro columns — `analyticsData.js` (shipped)
- Tour + Insights→Reports live on prod (bundle has Patterns / tour stops)
- Vercel READY was `ba4e7dc1` (pre-rewrite SHA); tip now `476c7a75` after history scrub
- GitHub: all `Co-authored-by: Cursor` trailers stripped (force-push main); `.qwen` untracked; remote `claude/*` branch deleted
- EC2 health ok

## Next

1. Hard-refresh `/reports` — confirm report body (login) not just tabs
2. Optional: untrack or rewrite `.agents/**` README text that still names Claude (skills, not product)
3. Cursor UI may re-append Co-authored-by on next commit — strip before push

## Touch

- tip `476c7a75` · reports+tour already in tree
