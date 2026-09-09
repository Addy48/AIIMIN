# Passive Life Score Engine Architecture Plan: Frictionless Autonomic Calculation

## 1. Problem Definition & The "Zero-Input" Mandate
Currently, the companion app displays a placeholder Life Score (often defaulting to 50) unless manual check-ins are logged. This introduces high user friction: users forget to log, the score stagnates, and the metric loses trust.

**The Golden Rule:** The Life Score must compute **100% passively and frictionlessly**, synthesizing real-time on-device telemetry without requiring a single tap from the user, while offering **100% transparent mathematical breakdowns**.

---

## 2. Multi-Signal Mathematical Framework

```
+-------------------------------------------------------------------------+
|                  PASSIVE LIFE SCORE COMPOSITION (100 PTS)                |
+-------------------------------------------------------------------------+
|  1. PHYSICAL VIGOR (30%)         2. DIGITAL FOCUS (30%)                 |
|  - Daily Steps vs Baseline       - Total Screen Time (Max Ceiling)      |
|  - Hourly Movement Consistency   - Midnight Bleed Penalty (00:00-05:00) |
|  - Cadence / Active Minutes      - Unlock Frequency / Session Length    |
+-------------------------------------------------------------------------+
|  3. CIRCADIAN INTEGRITY (25%)    4. FINANCIAL VELOCITY (15%)            |
|  - Sleep/Rest Window Silence     - Daily Outflow vs Weekly Baseline     |
|  - First Morning Unlock Delay    - High-Friction Impulse Spikes         |
|  - Routine Boundary Adherence    - Transaction Ingest Consistency       |
+-------------------------------------------------------------------------+
```

### Component 1: Physical Vigor (30 Points Max)
Derived directly from `HardwareStepCounter` + `HealthConnectRepository`:
- **Base Milestone (18 pts):** Scaled logarithmically from 0 to 10,000 steps:
  $$\text{Score}_{\text{steps}} = 18 \times \min\left(1.0, \frac{\text{steps}}{8000}\right)$$
- **Consistency Bonus (7 pts):** Awarded if user records > 250 steps in at least 6 separate hours between 08:00 and 20:00 (prevents 10k steps done all at once with 10 hours of uninterrupted sitting).
- **Morning Momentum (5 pts):** Awarded if $\ge 1,500$ steps logged before 11:00 AM.

### Component 2: Digital Focus & Discipline (30 Points Max)
Derived from `ScreenTime.kt` and `UsageStatsManager`:
- **Screen Time Baseline (18 pts):** Starts at 18. Linear decay for every hour exceeding 2.5 hours of personal screen time:
  $$\text{Score}_{\text{screen}} = \max\left(0, 18 - 3 \times \max(0, \text{Hours}_{\text{screen}} - 2.5)\right)$$
- **Midnight Bleed Penalty (-12 pts to 0 pts):** Screen time between 00:00 and 05:00 incurs a severe penalty:
  $$\text{Penalty}_{\text{midnight}} = -4 \times \text{Hours}_{\text{post-midnight}}$$
- **Unlock Cadence (12 pts):** Evaluated against unlock count. Under 40 unlocks/day = 12 pts; 40–80 unlocks = 8 pts; > 80 unlocks = 3 pts.

### Component 3: Circadian Integrity (25 Points Max)
Derived from screen state transitions (screen on/off timestamps, device idle events):
- **Digital Sunset & Dark Window (15 pts):** Continuous screen inactivity of at least 6.5 hours during the natural sleep window (22:30–07:30).
- **Morning Buffer (10 pts):** Time elapsed between device waking and active screen usage. If the user delays first unlock by $\ge 30$ minutes after waking = +10 pts; immediate unlock within 2 minutes = 2 pts.

### Component 4: Financial Velocity & Discipline (15 Points Max)
Derived from `TransactionalSmsScanner` and parsed credit/debit alerts:
- **Impulse Control (10 pts):** Evaluates discretionary debit frequency. 0–2 transactions/day = 10 pts; > 5 small unclassified UPI debits = 4 pts.
- **Runway & Ingest Health (5 pts):** Verified reconciliation of daily transactions without unreviewed spam or pending reconciliation errors.

---

## 3. Detailed Transparent Breakdown (UI Experience)

In `ScoreScreen.kt`, tapping the circular score figure expands into the **Telemetry Breakdown Sheet**:

```
+-------------------------------------------------------------+
| LIFE SCORE: 76 / 100                      [ STABLE TREND ^ ]|
| Calculated passively 4 mins ago                             |
+-------------------------------------------------------------+
| [Physical Vigor]               24 / 30                      |
| • 7,420 steps logged today                     (+16.7 pts)  |
| • 7 active movement hours                      (+4.3 pts)   |
| • Morning momentum reached                     (+3.0 pts)   |
|                                                             |
| [Digital Focus]                19 / 30                      |
| • Screen time 2h 45m (Under target)            (+16.5 pts)  |
| • Unlocks: 38 (Moderate focus)                 (+7.5 pts)   |
| • Midnight bleed: 42 mins past 00:00           (-5.0 pts)   |
|                                                             |
| [Circadian Integrity]          21 / 25                      |
| • 7h 10m uninterrupted night rest              (+14.0 pts)  |
| • 22m morning screen delay                     (+7.0 pts)   |
|                                                             |
| [Financial Velocity]           12 / 15                      |
| • 2 transactions processed                     (+10.0 pts)  |
| • 0 unreviewed anomalies                       (+2.0 pts)   |
+-------------------------------------------------------------+
| [ EXPORT BREAKDOWN JSON ]          [ RE-CALIBRATE BASELINE ]|
+-------------------------------------------------------------+
```

---

## 4. Architectural Implementation Blueprint

### Database Schema (Local SQLite & Supabase Sync)
```sql
CREATE TABLE life_score_snapshots (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    date TEXT NOT NULL, -- YYYY-MM-DD
    timestamp INTEGER NOT NULL,
    total_score INTEGER NOT NULL, -- 0 to 100
    physical_subscore REAL NOT NULL,
    digital_subscore REAL NOT NULL,
    circadian_subscore REAL NOT NULL,
    financial_subscore REAL NOT NULL,
    breakdown_json TEXT NOT NULL,
    is_synced INTEGER DEFAULT 0
);
CREATE INDEX idx_life_score_date ON life_score_snapshots(date);
```

### Worker Schedule
- `LifeScoreWorker` runs every 30 minutes via Android `WorkManager` (low battery constraints).
- Real-time updates triggered on:
  - Significant step count delta (> 500 steps).
  - Screen unlock event.
  - New transactional SMS received.
- Midnight rollover: At 00:00:01, seals the day's final score and seeds the new day with a baseline score of 100 (which decays or earns as the day unfolds).

