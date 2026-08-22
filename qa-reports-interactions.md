# Reports interaction evidence

**Date:** 2026-08-22
**Environment:** Local development-only fixture at `/reports-demo?demo=1`; no authenticated account or production data was modified.

## Pro interaction receipt

The Pro fixture rendered four filter selects, three findings, sixteen metric rows, and the reversible experiment form. Opening the first finding exposed its effect (`0.41 association`), Spearman method, two stable demo source IDs, and the limitation that association is not causation. Selecting the Cognitive domain produced the explicit empty state, “No finding meets the current filters and sample thresholds. The correct result is not to invent a pattern.” Searching the metric index for `sleep` reduced the visible metric rows to one.

## Elite interaction receipt

The Elite fixture rendered all six numbered chapters: Situation, Systems, Patterns, Investigate, Forecast, and Action. Selecting Forecast changed the active chapter and rendered the scenario assumptions, including representative recent window, no major disruption, and missing days remaining unknown rather than zero. Selecting Action changed the active chapter, rendered the experiment builder, and clicking “Save draft experiment” produced the local reversible `Untitled test` draft. No draft was persisted to a backend account.

## Runtime and responsive receipt

The updated console probe exercised Explore, Core, Pro, and Elite in both `aiimin-dark` and `aiimin-light` at exact 390px emulation. Every combination rendered a workspace, score, and evidence footer, remained bounded to `390px` document/body width, and produced zero console errors after demo mode was changed to skip the authenticated profile fetch. This is local fixture evidence only; authenticated production behavior still requires release and post-deployment validation.
