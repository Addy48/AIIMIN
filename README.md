# AIIMIN

**Personal Life OS** — unified daily rhythm, 5D behavioral intelligence, money ledger, calendar, deep focus, private journal, and gamification. One authenticated account across three dedicated client surfaces.

<p align="center">
  <a href="https://aiimin.in"><img src="https://img.shields.io/badge/Live-aiimin.in-ff6b35?style=for-the-badge" alt="Live" /></a>
  <a href="https://api.aiimin.in/api/health"><img src="https://img.shields.io/badge/API-healthy-10b981?style=for-the-badge" alt="API" /></a>
  <img src="https://img.shields.io/badge/Auth-Better%20Auth-000?style=for-the-badge" alt="Better Auth" />
  <img src="https://img.shields.io/badge/React-19-61dafb?style=for-the-badge&logo=react" alt="React" />
  <img src="https://img.shields.io/badge/Kotlin-Compose-7F52FF?style=for-the-badge&logo=kotlin" alt="Kotlin" />
  <img src="https://img.shields.io/badge/Storage-SQLCipher%20Room-003B57?style=for-the-badge" alt="SQLCipher" />
  <img src="https://img.shields.io/badge/Security-StrongBox%20TEE-10b981?style=for-the-badge" alt="StrongBox" />
</p>

---

## System Topology: One Monorepo, Three Clients

AIIMIN is structured as a single unified monorepo hosting **three dedicated clients** with distinct operational roles, anchored by a shared Node.js API, sub-5ms Redis caching layer, and Supabase PostgreSQL with Row Level Security (RLS).

| Client Surface | Repository Path | Technology Stack | Primary Purpose |
| :--- | :--- | :--- | :--- |
| **Web Life OS** | `frontend/` | React 19 · Tailwind · TanStack Query · Recharts | **Macro Strategic Cockpit** on desktop & iPad: 12 workspaces, 5D Life Score correlation matrix, financial runway simulations, intelligence dossiers, and weekly retrospectives. |
| **Native Android Companion** | `app/` | Native Kotlin · Jetpack Compose · Room SQLCipher | **Tactical Physical Sensor**: Sub-2s lockscreen capture, 100% offline-first encrypted storage, Focus Shield app blocking (zero-VPN), and Health Connect biometric ingestion. |
| **Capacitor Mobile Shell** | `frontend/android/`<br/>`frontend/src/components/mobile/` | Capacitor 6 · React `/m` Shell | **Data Collection Gateway**: Ultra-fast mobile web fallback route (`/m`) strictly reserved for frictionless data capture. |
| **API Core & Auth** | `server/` · `api/` | Express · Better Auth · Redis · Supabase PostgreSQL | **Central Neural Backbone**: OS-ID handle resolution, multi-tier route guards, deterministic CRDT outbox reconciliation, and statistical Spearman correlation engines. |

> ⚠️ **Strict Boundary Rule:** Never mix commits across Web (`frontend/`), Capacitor (`frontend/android/`), and Native Android (`app/`). See [CONTRIBUTING.md](CONTRIBUTING.md).

---

## System Architecture & Topology

<p align="center">
  <a href="./docs/architecture/aiimin_architecture.html">
    <img src="./docs/architecture/aiimin_architecture.png" alt="AIIMIN Personal Life OS — Unified Architecture" width="100%" />
  </a>
</p>

### Interactive Architecture Visualizer

We provide a standalone, high-performance interactive system visualizer with light/dark theme controls, guided component inspections, and real-time data traces:

**[`docs/architecture/aiimin_architecture.html`](docs/architecture/aiimin_architecture.html)**

> Open this standalone HTML file in any modern browser to explore interactive system diagrams, component breakdowns, guided architectural tours, and live data traces.

---

## Architecture Subsystems & Interaction Workflows

### 1. Unified Cross-Platform Interaction & Sync Metrics

Production telemetry and bidirectional synchronization protocol between the Native Android companion and Desktop Web client. Details the SQLite `sync_outbox` queue (monotonic UUIDv7, Lamport vector clocks), WorkManager batch network dispatch, Express idempotency gate (Redis `SETNX`), deterministic Last-Write-Wins (LWW) conflict resolver, and reactive TanStack Query invalidation via Redis Pub/Sub (<120ms P95 latency SLA, 0.00% conflict error rate, <0.7% daily battery drain).

<p align="center">
  <a href="./docs/diagrams/interactive-system-visualizer.html">
    <img src="./docs/diagrams/unified-app-web-sync-workflow.png" alt="Unified Cross-Platform Sync Workflow" width="100%" />
  </a>
</p>

---

### 2. Web Life OS Request & Workspace Execution Flow

End-to-end request lifecycle and workspace execution across the Web SPA. Traces browser vanity routing (`/`, `/waitlist`), mobile/desktop viewport detection, debounced OS-ID uppercase resolution (`AADI0837`, <80ms), 6-digit PIN Argon2id authentication, `TierRouteGuard` access control (Explore / Pro / Sovereign), concurrent execution of the 12 dashboard workspaces, TanStack Query optimistic mutation rollback, and Express API middleware on `api.aiimin.in`.

<p align="center">
  <a href="./docs/diagrams/interactive-system-visualizer.html">
    <img src="./docs/diagrams/web-life-os-workflow.png" alt="Web Life OS Request Pipeline" width="100%" />
  </a>
</p>

---

### 3. Native Android Companion Architecture & Local Security Enclave

Hardware-isolated security architecture and sensor ingestion pipeline for the Android Kotlin companion. Documents the AndroidKeyStore StrongBox TEE hardware enclave (AES-256-GCM silicon keys), Class 3 `BiometricPrompt` with `CryptoObject` cipher binding, 256-bit AES-CBC SQLCipher Room SQLite offline database, 120Hz V-Sync Jetpack Compose UI, Glance interactive Home Screen Widgets, Google Health Connect passive sensor aggregation, and WorkManager background batch synchronization.

<p align="center">
  <a href="./docs/diagrams/interactive-system-visualizer.html">
    <img src="./docs/diagrams/native-android-companion-workflow.png" alt="Native Android Companion Workflow" width="100%" />
  </a>
</p>

---

## Repository Layout

```
AIIMIN/
├── docs/
│   ├── diagrams/                              # System Architecture Visualizer & Workflow Diagrams
│   │   ├── interactive-system-visualizer.html # Interactive browser viewer (Dark / Light theme)
│   │   ├── web-life-os-workflow.svg / .png
│   │   ├── native-android-companion-workflow.svg / .png
│   │   └── unified-app-web-sync-workflow.svg / .png
│   └── knowledge/                             # Authoritative Knowledge Vault (Obsidian)
│       ├── 00_HOME.md                         # Knowledge vault entrypoint
│       ├── 02_ARCHITECTURE/                   # System design & monorepo specifications
│       │   ├── System-Workflows-And-Interactions.md
│       │   ├── Monorepo.md
│       │   └── Overview.md
│       ├── 08_DESIGN/                         # Drafting Table tokens, palettes, typography
│       └── 15_MEMORY/                         # Current context and execution history
├── frontend/                                  # Web Life OS Client (React 19 + Tailwind)
│   ├── src/pages/                             # Overview, Today, Finance, Journal, Lab, Sports, ...
│   ├── src/components/waitlist/               # Waitlist landing sections & QA Studio
│   ├── src/components/mobile/                 # ⚠ Capacitor /m capture shell only
│   └── android/                               # ⚠ Capacitor Gradle WebView wrapper
├── app/                                       # Native Android Companion — Kotlin + Jetpack Compose
│   └── src/main/java/in/aiimin/app/           # Room DB, TEE Keystore, Focus Shield, Today surface
├── server/                                    # Node.js Express API Core (api.aiimin.in)
├── api/                                       # Vercel serverless gateway
├── scripts/                                   # Automation, diagram generators, seeders, QA probes
└── CONTRIBUTING.md                            # Monorepo boundary governance & commit rules
```

---

## Tech Stack & Design Tokens

### Stack Matrix

| Subsystem | Technologies |
| :--- | :--- |
| **Web Frontend** | React 19, React Router v6, Tailwind CSS, TanStack Query, Recharts, Framer Motion, CRACO |
| **Native Android** | Kotlin 2.0, Jetpack Compose, Room (SQLCipher v4.5), Retrofit 2, Coroutines Flow, WorkManager, AndroidX Glance |
| **Backend API** | Node.js, Express, Hono, Better Auth (OS-ID Resolver), Redis Caching Layer |
| **Database & Auth** | Supabase PostgreSQL with Row Level Security (RLS), Better Auth Bearer Tokens, StrongBox TEE Hardware Keystore |
| **Infrastructure** | Vercel (Web SPA & Landing), AWS EC2 (`api.aiimin.in`), Cloudflare SSL / DNS |

### Drafting Table Design Tokens (LOCKED)

| Token Name | Dark Value | Light Value | Semantic Purpose |
| :--- | :--- | :--- | :--- |
| **Base Background** | `#1a1a1a` | `#f9f9f9` | Canvas background |
| **Card Surface** | `#2d2d2d` | `#ffffff` | Elevated component surface |
| **Drafting Steel** | `#749dc4` / `#416180` | `#416180` | Structural borders, guides, secondary accents |
| **Spark Accent** | `#ff6b35` | `#ff6b35` | Primary action buttons, active indicators |
| **Verified Green** | `#10b981` | `#10b981` | Completed habits, verified security status |
| **Muted Text** | `#9ca3af` | `#6b7280` | Tertiary labels and helper notes |

---

## Quick Start

### 1. Web Life OS

```bash
git clone https://github.com/Addy48/AIIMIN.git
cd AIIMIN/frontend
npm install
npm start # http://localhost:3000
```

### 2. Backend API (Local)

```bash
cd AIIMIN/server
npm install
# Set DATABASE_URL, BETTER_AUTH_SECRET, REDIS_URL in .env
npm run dev # http://localhost:3001
```

### 3. Native Android Companion

```bash
cd AIIMIN/app
export JAVA_HOME="$(/usr/libexec/java_home -v 17)" # macOS
./gradlew :app:assembleDebug
adb install -r app/build/outputs/apk/debug/app-debug.apk
```

---

## Documentation Index

- **System Workflows & Deep Architecture:** [`docs/knowledge/02_ARCHITECTURE/System-Workflows-And-Interactions.md`](docs/knowledge/02_ARCHITECTURE/System-Workflows-And-Interactions.md)
- **Monorepo Boundaries & Client Isolation:** [`docs/knowledge/02_ARCHITECTURE/Monorepo.md`](docs/knowledge/02_ARCHITECTURE/Monorepo.md)
- **Product Blueprint & V1 Contract:** [`docs/knowledge/Roadmap/AIIMIN-V1-Blueprint.md`](docs/knowledge/Roadmap/AIIMIN-V1-Blueprint.md)
- **Design System Spec:** [`docs/knowledge/08_DESIGN/Palette.md`](docs/knowledge/08_DESIGN/Palette.md)
- **Contributing Guidelines:** [`CONTRIBUTING.md`](CONTRIBUTING.md)

---

## License

Portfolio & personal Life OS product by Aaditya Upadhyay. Source code available for review; not licensed for external redistribution.
