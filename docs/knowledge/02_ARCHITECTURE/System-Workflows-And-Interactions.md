---
authority: engineering
derived_from: Genesis/P8 Master Specification
status: active
owner: eng
lifecycle: living
last_reviewed: 2026-09-26
can_override_genesis: false
knowledge_layer: KL-BUILD
graph_role: leaf
note_type: NT-ENG-LEAF
migration_batch: W4
fm_source: manual
---

# AIIMIN — Comprehensive System Workflows & Inter-Client Architecture

**Last updated:** 2026-09-26  
**Owner:** Aaditya Upadhyay  
**Product:** Personal Life OS (Web + Native Android Companion + Shared Telemetry Core)

This authoritative architectural reference defines the complete end-to-end data pipelines, security models, offline-first sync engines, and cross-platform interactions across the AIIMIN monorepo.

---

## Unified Architecture Diagram & Interactive Visualizer

<p align="center">
  <a href="../../architecture/aiimin_architecture.html">
    <img src="../../architecture/aiimin_architecture.png" alt="AIIMIN Personal Life OS — Unified Architecture" width="100%" />
  </a>
</p>

All system architecture diagrams are available as standalone SVGs, 2× retina PNGs, and a theme-toggleable interactive visualizer inside the repository:

- **Interactive Architecture Visualizer:** [`docs/architecture/aiimin_architecture.html`](../../architecture/aiimin_architecture.html)
- **High-Resolution Architecture Vector Asset:** [`docs/architecture/aiimin_architecture.png`](../../architecture/aiimin_architecture.png)
- **Multi-Workflow Interactive Viewer:** [`docs/diagrams/interactive-system-visualizer.html`](../diagrams/interactive-system-visualizer.html)
- **Web Life OS Flow Diagram:** [`docs/diagrams/web-life-os-workflow.svg`](../diagrams/web-life-os-workflow.svg) · [`web-life-os-workflow.png`](../diagrams/web-life-os-workflow.png)
- **Native Android Flow Diagram:** [`docs/diagrams/native-android-companion-workflow.svg`](../diagrams/native-android-companion-workflow.svg) · [`native-android-companion-workflow.png`](../diagrams/native-android-companion-workflow.png)
- **Unified Cross-Platform Sync Diagram:** [`docs/diagrams/unified-app-web-sync-workflow.svg`](../diagrams/unified-app-web-sync-workflow.svg) · [`unified-app-web-sync-workflow.png`](../diagrams/unified-app-web-sync-workflow.png)

---

## 1. Web Life OS Architecture & End-to-End Pipeline

The Web Life OS (`frontend/`) is the desktop and tablet analytical command center built with React 19, Tailwind CSS, and the Drafting Table design tokens (`#1a1a1a`, `#2d2d2d`, `#749dc4`, `#ff6b35`, `#10b981`).

![Web Life OS Full Flowchart](../diagrams/web-life-os-workflow.png)

### Pipeline Stages

1. **Public Surfaces (`/`, `/waitlist`, `/brand`, `/privacy`):** Public landing, waitlist management, brand guidelines, and immutable Genesis legal hub.
2. **Security & Gate (`AADI0837`, Argon2id PIN):** Uppercase OS-ID real-time scanner (`<80ms`), Argon2id 6-digit PIN keypad, device routing (`TierRouteGuard` / `DeviceGate`).
3. **State & Cache (Better Auth, TanStack Query):** HttpOnly stateless session tokens, TanStack Query v5 with `staleTime: 60s` and window-focus protection.
4. **Life OS Workspaces (12+ Modules):** Overview (8-axis Life Score), Habits, Finance, Sports, Mindset Journal, Discipline Urges, Behavioral Lab, Family Vault.
5. **Core Hub & Persistence (Express API, Redis, Supabase):** Express API gateway (`api.aiimin.in`), sub-5ms Redis cache, Supabase PostgreSQL with tenant RLS isolation.

### Module Responsibilities
1. **Public & Onboarding:** Public landing, waitlist management, brand guidelines, and immutable Genesis legal hub.
2. **Access Gate:** Uppercase OS-ID real-time scanner (`<80ms`), Argon2id 6-digit PIN keypad, device routing (phone directed to `/m`, tablets/desktops to full OS shell).
3. **Session Management:** Better Auth HttpOnly stateless tokens, TanStack Query v5 with window-focus protection.
4. **Life OS Workspaces:**
   - `Overview (/overview)`: 8-axis Life Score radar (0-100), Trajectory Projection engine, daily quick logs.
   - `Habits (/habits)`: 7-day completion matrix, streak momentum counter, optimistic cache updates.
   - `Finance (/finance)`: Net worth telemetry, transaction categorizer, monthly burn velocity.
   - `Sports (/sports)`: Multi-league fixtures and live scores (Cricket, Football, Basketball, F1).
   - `Journal (/journal)`: Multi-mode reflections, voice note transcription, AES-256-GCM encrypted notes.
   - `Discipline (/discipline)`: Urge surfing delay timer, trigger taxonomy, friction tracking.
   - `Lab (/lab)`: Vocal biomarkers, typing telemetry, cognitive hypothesis sandbox.
   - `Family (/family)`: Encrypted vital records, insurance policies, emergency contacts.

---

## 2. Native Android Companion Architecture & Sync Engine

The Native Android App (`native-android-v3/` / `app/`) is an offline-first companion built in Kotlin with Jetpack Compose, targeting sub-second data capture and hardware-grade security.

![Native Android Companion Flowchart](../diagrams/native-android-companion-workflow.png)

### Native Pipeline Stages

1. **Hardware Security Gate:** Android Keystore StrongBox TEE with AES-256-GCM hardware master key isolation; BiometricPrompt (Fingerprint / Face unlock with fallback to 6-digit PIN).
2. **Jetpack Compose UI & Widgets:** 120Hz V-Sync native interface; Glance interactive home screen and lockscreen widgets; sub-10ms instant habit logging.
3. **Sensor Telemetry:** Android Health Connect background ingestion (steps, active calories, sleep stages, resting heart rate); low-latency vocal biomarker engine.
4. **Offline-First Database:** SQLCipher Room SQLite database (`HabitEntity`, `DailyLogEntity`, `SyncQueueEntity`); reactive StateFlow on `Dispatchers.IO` with zero main-thread jitter.
5. **WorkManager & Network:** `SyncCompanionWorker` periodic (15m) + immediate expedited sync; Retrofit 2 + OkHttp 4 with Bearer auth and TLS 1.3 certificate pinning.

### Hardware & Offline Invariants
- **StrongBox TEE:** All cryptographic keys and session credentials reside in the hardware-isolated Trusted Execution Environment.
- **Glance Home Widgets:** Home screen habit toggles and urge delay timers execute without launching the main activity.
- **Health Connect Aggregation:** Continuous background sensor collection aggregates daily step count, active calories, and sleep duration directly into local database entities.
- **Offline Outbox Pattern:** All mutations are written to `SyncQueueEntity` first and drained to `/api/mobile/sync` via `WorkManager` with exponential backoff.

---

## 3. Unified Cross-Platform Interaction Matrix

The Web Life OS and Native Android Companion operate as two synchronized halves of a unified Life OS.

![Unified Cross-Platform Interaction Matrix](../diagrams/unified-app-web-sync-workflow.png)

### Synchronization Architecture

```mermaid
sequenceDiagram
  autonumber
  actor User as Aaditya (OS-ID: AADI0837)
  participant Mobile as 📱 Android Companion (Kotlin Compose)
  participant Room as 🗄️ Local Room DB (Outbox)
  participant Cloud as ⚡ Express API (api.aiimin.in)
  participant Redis as 💾 Redis Cache
  participant Postgres as 🗄️ Supabase Postgres (RLS)
  participant Web as 🖥️ Web Life OS (React 19)

  Note over User,Mobile: 1. Action: Logs habit & sensor steps on mobile
  User->>Mobile: 1-Tap Habit Log on Home Widget
  Mobile->>Room: Write HabitEntity & Queue SyncOutbox
  Mobile->>Cloud: POST /api/mobile/sync (Batch payload + Bearer Token)
  Cloud->>Postgres: Upsert into habits & daily_logs (WHERE user_id = $1)
  Cloud->>Redis: Invalidate cache (DEL user:AADI0837:habits)
  Cloud-->>Mobile: 200 OK (Vector Clock updated)

  Note over User,Web: 2. Web Life OS reflects state
  User->>Web: Opens /overview or /habits
  Web->>Cloud: GET /api/habits
  Cloud->>Redis: Cache Miss -> Query Postgres -> Fill Cache
  Cloud-->>Web: Fresh data with mobile habit check & step telemetry
  Web-->>User: Radar score updates dynamically
```

### Division of Labor

| Surface | Primary Role | Key Capabilities |
| :--- | :--- | :--- |
| **📱 Native Android Companion** | Frictionless Capture & Sensor Hub | StrongBox TEE, Biometric unlock, Health Connect steps/sleep, Glance home widgets, offline outbox. |
| **🖥️ Web Life OS** | Analytical Command Center & Planning | 8-axis Life Score radar, trajectory projection model, net worth ledger, career pipeline, weekly review PDFs, soundscapes. |
| **⚡ Shared Core Hub** | Identity, Caching & Master Source | Better Auth OS-ID resolution, Express gateway, sub-5ms Redis caching, Supabase Postgres with RLS. |

---

## Architectural Locks & Governance

1. **Identity Anchor:** Single canonical OS-ID (`AADI0837`) links all clients without redundant auth silos.
2. **Palette Compliance:** Dark `#14171A` / `#1E2228`, Drafting Table Steel `#749DC4`, Spark `#FF6B35`, Success Emerald `#10B981`.
3. **No Direct PostgREST from Clients:** All client interactions flow strictly through the authenticated API Gateway (`server/` / `api.aiimin.in`).
4. **Tenant Isolation:** All database tables enforce `auth.uid() = user_id` Row Level Security.
