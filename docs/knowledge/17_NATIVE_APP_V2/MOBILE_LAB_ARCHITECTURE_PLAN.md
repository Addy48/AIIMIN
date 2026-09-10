# Mobile Lab Architecture Plan: Sensor-Native Behavioral Prototyping

## 1. Executive Summary & Problem Definition
The current Lab section in AIIMIN was conceived for high-density desktop surfaces (graph exploration, prompt engineering sandboxes, and broad workspace diagnostics). On native mobile (Android/iOS), attempting to replicate desktop canvas/dense grids yields a clumsy, high-friction, and largely useless experience. 

Mobile is **not a miniature workstation**; it is an **ambient, continuous biometric and situational sensor**. 

This plan details the redesign of the Mobile Lab into a **Personal Telemetry & Micro-Experimentation Foundry**. Instead of passive markdown notes or clumsy node graphs, the Mobile Lab leverages phone-native capabilities: real-time sensor streams, hardware counters, ambient state detection, and rapid 60-second behavioural micro-experiments.

---

## 2. Core Pillars of the Mobile-Native Lab

```
+-------------------------------------------------------------------------+
|                         MOBILE LAB ARCHITECTURE                         |
+-------------------------------------------------------------------------+
|  1. LIVE SENSOR RUNTIME        2. EXPERIMENTAL PROTOCOLS                |
|  - Real-time Step Counter      - Dopamine Fasting Protocols             |
|  - Hardware Cadence (Hz)       - Focus Sprint Micro-Tests (60s Pulse)   |
|  - Screen Session Switch Rate  - Sleep Latency / Blue Light Correlation |
|  - Ambient Decibel Sampler     - Physical Movement Intervention Triggers|
+-------------------------------------------------------------------------+
|  3. ON-DEVICE DIAGNOSTICS      4. CONTINUOUS CORRELATION ENGINE         |
|  - Raw SMS Ingest Sandbox      - Screen Time vs Step Deficit            |
|  - Notification Audit Log      - Late-Night Usage vs Next-Day Score     |
|  - Battery / Thermal Profile   - Financial Friction Velocity            |
+-------------------------------------------------------------------------+
```

### Pillar 1: The Live Sensor Runtime (Hardware Sandbox)
Instead of static numbers, the Lab acts as the developer/power-user view into the user's biological and digital telemetry:
- **Step Cadence Visualizer:** Displays live accelerometer events and step detector ticks with sub-second responsiveness.
- **Attention Fragmentometer:** Computes the "Switch Frequency" (number of app switches per 10 minutes of screen time). A user switching between apps 40 times in 15 minutes is experiencing severe dopamine fragmentation.
- **Ambient Noise & Light Metering:** Optional zero-audio-storage RMS decibel sampling to score workplace focus suitability (e.g. "Optimal Deep Work: 38dB ambient").

### Pillar 2: Micro-Experimentation Protocols
Users do not run month-long scientific papers on their phones; they test 24-to-72-hour behavioral hypotheses:
- **Protocol Alpha: "Digital Sunset":** Grayscale screen toggle + hard screen lock after 23:00. Lab tracks sleep latency delta.
- **Protocol Beta: "Cadence Recovery":** When sedentary time exceeds 90 minutes during work hours, triggers a vibration pulse requiring a 200-step walk to silence.
- **Protocol Gamma: "Impulse Delay Sandbox":** When financial transaction SMS is detected or payment app is opened, prompts an optional 60-second cooling-off micro-journal.

### Pillar 3: On-Device Edge Diagnostics & Raw Ingest
A dedicated developer/power-user debugging panel directly inside the mobile app:
- **SMS Telemetry Inspector:** Allows inspecting raw transactional SMS payloads, viewing extracted merchant/amount/direction matches, running regex regression tests locally, and copying anonymized logs (already scaffolded via `exportTransactionalMessages`).
- **Sync Diagnostics:** Displays real-time WebSocket/batch sync states, SQLite pending outbox queue depth, network latency to `api.aiimin.in`, and conflict resolution logs.
- **Battery & Thermal Watchdog:** Monitors foreground and background worker consumption to guarantee zero battery drain (< 1.5% battery impact per 24h).

---

## 3. Screen Structure & User Experience (Drafting Table Dark)

The Mobile Lab interface adheres strictly to the **Drafting Table Dark** design tokens (`#141414`, `#1E1E1E`, `#262626`, `#333333`, `#EDEDED`, steel `#749DC4`, spark `#FF6B35`):

1. **Header Bar:**
   - Title: `LAB // TELEMETRY & EXPERIMENTS` (Mono uppercase, steel accent).
   - Mode Selector: `[ ACTIVE PROTOCOLS ] [ HARDWARE TELEMETRY ] [ SANDBOX ]`
2. **Telemetry Dashboard:**
   - Real-time sparkline graph showing app switches vs steps per hour over the last 12 hours.
   - Fragmentation Index gauge: `LOW | ELEVATED | CRITICAL`.
3. **Active Protocol Card:**
   - Displays ongoing micro-experiment (e.g., "Protocol #4: 5,000 steps before 13:00").
   - Live progress indicator with real-time countdown and delta against baseline.
4. **Action Toolbar:**
   - `[ Launch Micro-Experiment ]` (Opens lightweight sheet with preset 1-day protocols).
   - `[ Export Diagnostic Report ]` (Anonymized telemetry dump for debugging).

---

## 4. Implementation Phasing (For Future Implementation)

1. **Phase A (Diagnostics & Sandbox):** Move SMS review and sync diagnostics into a clean Lab debug surface. Expose live hardware counters.
2. **Phase B (Fragmentation & Sensor Telemetry):** Wire Android `UsageEvents` listener to calculate App Switch Frequency and display live ambient telemetry.
3. **Phase C (Protocols & Interventions):** Add local SQLite storage for experiment runs (`experiment_runs` table), tracking baseline vs intervention metrics over 48-hour periods.

---

## 5. Critical Missing Dimensions & Strategic Blind Spots

### A. The Google Play SMS Policy Trap & Dual-Channel Ingest
* **The Pitfall:** Relying solely on `READ_SMS` / `RECEIVE_SMS` creates a catastrophic roadblock for app distribution. Google Play strictly bans SMS permissions for any app that is not the device's Default SMS Handler.
* **The Missing Architecture:** **Dual-Channel Financial Ingestion Pipeline**:
  1. **Notification Interception Channel (Primary, Play-Compliant):**
     Using `NotificationListenerService`, the app captures rich push notifications directly from UPI payment apps (PhonePe, Google Pay, Paytm, CRED, BHIM, Navi).
     - *Advantages:* Instant receipt (< 50ms latency), completely immune to telecom carrier SMS filtering/DND blocks, and 100% compliant with Google Play Store policies.
  2. **SMS Scanner Channel (Secondary, Sideload-Only):**
     Retained as a background fallback reconciler for legacy credit card / debit card / ATM bank messages that do not fire UPI notifications.

### B. Client-Side Zero-Knowledge Sanitization & Privacy Shield
* **The Pitfall:** Syncing raw financial text or account identifiers to backend databases creates massive compliance (RBI/GDPR), privacy, and security liabilities.
* **The Missing Architecture:**
  - **Local PII Redaction Pipeline:** Raw SMS strings **never leave the device**.
  - On-device extraction discards bank account balances, full names, and card fragments.
  - Payees and merchants are salted and cryptographically hashed locally before synchronization:
    $$\text{Synced Entity} = \text{HMAC-SHA256}(\text{MerchantName}, \text{DeviceSalt})$$
  - Only normalized categorizations (`FOOD`, `COMMUTE`, `UTILITY`) and anonymized amounts are synced to PostgreSQL.

### C. Offline Vector Clocks & Outbox Reconciliation
* **The Pitfall:** If a user edits their Life Arc or goals on the web dashboard while the mobile companion was offline, naive synchronization can cause the mobile app's queued outbox to overwrite the web's newer state.
* **The Missing Architecture:**
  - Enforce field-level **Last-Write-Wins (LWW) with Lamport Timestamps** in `server/routes/mobile.js` and `GraphSyncRepository.kt`.
  - Stale mobile outbox mutations are rejected with HTTP 409 and reconciled against the server's authoritative version.


