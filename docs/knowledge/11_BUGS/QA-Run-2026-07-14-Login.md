# QA Run — Login (2026-07-14) — status after crush pass

> Selfloop: `2026-07-14T20-06-37-663Z`  
> **Still uncommitted / not on prod until you say ship.**

## What this pass added (beyond first round)

| Fix | Addresses |
|-----|-----------|
| Sign up / Sign in = real bordered chips ≥44×88, **no negative margin** | 2 + signup twin |
| Forgot PIN = surface button 48px, same language as Back | 25, 30, 39, 45, 47 |
| Pills = dark glass `rgba(0,0,0,0.42)` + white text + 112px bottom pad | 4, 26, 38 |
| PIN slots = `#4b5563` 2.5px border, white fill, 16px solid mask, pulse active | 7–8, 10, 13, 19–22, 29, 43, 46 |
| Numpad bottom = **Clear \| 0 \| Del** (full 3-col — kills empty-cell asymmetry) | 11, 27, 31–32, 35, 44 |
| Error = `#991b1b` on `#fef2f2` box | 42 |
| Subtitle = `#1a1a1a` / weight 600 | 36 |
| Rate limit `Retry-After` header + `retryAfterSec` body | 40 (still needs EC2) |
| Wrong PIN still rejects; copy “Incorrect PIN…” | 41 by design |

## Remaining honesty

| Blocker | Status |
|---------|--------|
| Live `aiimin.in` | **Old until commit + Vercel** |
| Live `api.aiimin.in` rate limit | **Old until EC2** |
| Selfloop re-proof | **0** until ship + re-run |
| #41 accept wrong PIN | **Never** — security |

## Ship when you say

`commit + push` (or `ship`) → Vercel UI + EC2 API → re-run Selfloop.
