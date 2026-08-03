---
authority: operations
derived_from: Genesis · Roadmap/AIIMIN-V1-Blueprint
status: active
owner: founder
lifecycle: living
last_reviewed: 2026-08-03
can_override_genesis: false
knowledge_layer: KL-OPS
graph_role: context
note_type: NT-CONTEXT
tags:
  - type/hub
  - domain/ops
  - status/living
---

# Current Context

> [!tip] Agent boot
> [[00_HOME]] → [[00_ROUTING]] → this note → only the `Touch` paths below. Proof-or-stop.

**Date:** 2026-08-03 · Branch `feat/drafting-table-prototype` · HEAD `941e7267`

## Stage

Two tracks running in parallel, in separate chats:

1. **Native Android app — building from scratch**, Kotlin + Compose, screen by screen.
   → [[15_MEMORY/Handoff-Native-App-Build]]
2. **Website hardening · Vercel · AWS · machine.** → [[15_MEMORY/Handoff-Website-Hardening]]

Plus this track: the vault (done — see below).

> [!important] Stack decided 2026-08-03
> Mobile app = **Kotlin + Jetpack Compose, native, Android-first, from scratch** at
> `native-android-v3/`. Chosen over Expo/RN and Compose Multiplatform for the native ceiling.
> `native-android/` (V2, `2.1.8-native`) is the **old app** — its design is superseded; keep
> it only as reference for `sync/`, `session/`, `security/`, `data/network/`. Its 382 MB of
> build caches were deleted (420 MB → 38 MB); the 40 hand-written Kotlin files remain.

Full picture: [[17_NATIVE_APP_V2/AIIMIN_MASTER_STATUS_AND_NEXT_STAGE]]
Guardrails (G1–G10, non-negotiable): [[17_NATIVE_APP_V2/AIIMIN_APP_BUILD_AGENT_PLAN]] §0

## Done — do not redo

- **Drafting Table prototype — complete.** 10 screens, one self-contained file
  `frontend/prototypes/AIIMIN-Drafting-Table.html`. Rebuild:
  `node frontend/scripts/build-proto.mjs`. Dev route `/proto/draft`.
  Palette + typography are **founder-approved and LOCKED** (G4).
- **Prototype bake-off (TIDE / RELAY / ATLAS) — closed.** Superseded by the Drafting Table
  direction. Do not resume it; the earlier `personal-os/CLAUDE_MASTER_BOOT.md` mission is spent.
- **Supabase-shim crash fixed & committed.** `frontend/src/utils/supabase.js` lacked
  `.abortSignal()`, which threw on every authed page load and caused an ErrorBoundary
  remount loop. `abortSignal()` and `range()` added.
- **Vault consolidated to one source of truth (2026-08-03).** The second vault at
  `~/Documents/AIIMIN VAULT` is retired to `99_ARCHIVE/documents-vault-2026-08-03/`.
  → [[16_DOCUMENTATION/VAULT-CONSOLIDATION-2026-08-03]]

## Queue

1. **Vault** — single source of truth. **Done**; two approvals pending (§ report §6).
2. **App (own chat)** — foundation → Capture → capture-first Today → Money → Config → OS-ID
   → Onboarding → Journal → Lab → Score (Score blocked on taxonomy).
3. **Website (own chat)** — reproduce and fix Journal + Notes; then Finance MTD ₹0, Life
   Score taxonomy, remove Weekly Pulse from entry, Goals count, waitlist count masking; then
   the P2 untested list.
4. **Vercel** — last deploy failed; start from `frontend/scripts/verify-production-env.mjs`.
5. **AWS** — free-credit burn report via `aws-api` MCP (read-only).
6. **MacBook** — performance audit. Memory pressure (8 GB RAM, ~70 % swap), **not** storage
   (58 GB free).

## Blocked on founder

- Voice scope (transcription-first vs full suite).
- AI keys — Groq, Gemini, OpenRouter (all free tier), none created yet.
- **Vercel** — the real build log needs `npm i -g vercel` or the Vercel connector
  authorised. The old hypothesis is dead: verified 2026-08-03 that
  `frontend/scripts/verify-production-env.mjs` exits 0 and the CRA build succeeds under
  `CI=true`. No `engines`/`.nvmrc` is pinned, so Vercel picks its own Node.
- **Notes** — needs a live login to capture the failing call. Everything checkable from
  outside is clean: the exact INSERT succeeds, the route is deployed (401 unauth), RLS is
  bypassed (`postgres`, `rolbypassrls`), and the single user is `emailVerified`.

**No longer blocked:** the Life Score taxonomy is decided —
[[10_DECISIONS/2026-08-03-life-score-taxonomy]]. The Score screen can be built.

## Touch

- `docs/knowledge/00_ROUTING.md`
- `docs/knowledge/17_NATIVE_APP_V2/AIIMIN_MASTER_STATUS_AND_NEXT_STAGE.md`
- `docs/knowledge/17_NATIVE_APP_V2/AIIMIN_APP_BUILD_AGENT_PLAN.md`
- `frontend/prototypes/AIIMIN-Drafting-Table.html`
- `frontend/scripts/verify-production-env.mjs`
- `server/routes/` · `frontend/src/` (website fixes only)
- `docs/knowledge/Genesis/` (read-only)
