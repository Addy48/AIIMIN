# AIIMIN — Information Graph (Phase 3)

**Status:** Data-centric relationship model  
**Date:** 2026-07-11  
**Scope:** Conceptual entity graph — not UI navigation

---

## Purpose

This document maps how AIIMIN's life data entities relate, what feeds what, and which product surfaces consume derived intelligence. The graph is **data-first**: nodes are persistent or derived records; edges are creates, updates, aggregates, or AI inferences.

---

## Master Entity Graph

```mermaid
flowchart TB
    subgraph Identity
        ARC[Life Arc / Identity]
        PROF[Profile]
    end

    subgraph Planning
        GOAL[Goals]
        MS[Milestones]
        TASK[Tasks / Week Tasks]
    end

    subgraph Execution
        HAB[Habits]
        CAL[Calendar Events]
        FOCUS[Focus Sessions]
    end

    subgraph Capture
        JOUR[Journal Entries]
        DLOG[Daily Log]
        MOOD[Mood Signals]
        NOTE[Notes]
        CMD[Command Palette Logs]
    end

    subgraph Health
        SLEEP[Sleep Metrics]
        DISC[Discipline Logs]
    end

    subgraph Money
        FIN[Finance Transactions]
        BUD[Budgets]
    end

    subgraph Derived
        LS[Life Score]
        INS[Insights]
        REP[Reports]
        AI[AI Recommendations]
    end

    ARC --> GOAL
    GOAL --> MS
    MS --> TASK
    GOAL --> HAB
    GOAL --> FOCUS
    HAB --> DLOG
    CAL --> FOCUS
    CAL --> DLOG
    JOUR --> MOOD
    JOUR --> DLOG
    CMD --> JOUR
    CMD --> NOTE
    CMD --> DLOG
    FOCUS --> DLOG
  FOCUS --> GOAL
    DLOG --> SLEEP
    DLOG --> MOOD
    DISC --> HAB
    DISC --> DLOG
    FIN --> BUD
    DLOG --> LS
    HAB --> LS
    GOAL --> LS
    FIN --> LS
    JOUR --> INS
    DLOG --> INS
    HAB --> INS
    LS --> INS
    INS --> AI
    LS --> REP
    INS --> REP
    AI --> CAL
    AI --> HAB
    AI --> GOAL
```

---

## Entity Definitions

| Entity | Primary storage | Created by | Updated by |
|--------|-----------------|------------|------------|
| **Life Arc** | Profile / identity | Onboarding, Identity page | User edit, AI draft refresh |
| **Goals** | `goals` table + local cache | Goals modal, onboarding seeds | Milestone completion, status AI |
| **Milestones** | Embedded in goals | Goal create, AI propose | Toggle complete |
| **Tasks** | Week tasks local + calendar | Calendar, quick-add, AI | Complete toggle |
| **Habits** | `habits` table | Onboarding seeds, create modal | Daily toggle |
| **Calendar Events** | `events` + Google sync | EventModal, quick-add, Google pull | Edit, recurrence engine |
| **Journal Entries** | `journal_entries` (encrypted body) | Journal capture, Command Palette | Mood amend, AI analyze |
| **Daily Log** | `daily_logs` | Overview form, mobile capture, inferred | End-of-day sync |
| **Mood** | Journal + daily_log + discipline | 5 duplicate UI surfaces | Should unify to single primitive |
| **Focus Sessions** | Focus/Pomodoro store | Timer complete | Reflection optional |
| **Finance Transactions** | Supabase money tables | EntryForm, voice capture | Edit, delete |
| **Discipline Logs** | Discipline store | Trigger modal | Pattern aggregation |
| **Notes** | localStorage + API | Notes inline, Command Palette | Edit, delete |
| **Life Score** | Derived composite (marketing teaser + future) | Nightly batch / on-save | Recompute on habit/journal/finance |
| **Insights** | AI-generated copy + filters | Scheduled + on-demand | Domain filter |
| **Reports** | Period aggregations | User period select | Export |
| **AI Recommendations** | Ephemeral + notification | Insights, Command Palette, Monday widget | User accept/dismiss |

---

## Data Flow: Goal → Life Score

```mermaid
sequenceDiagram
    participant User
    participant Goals
    participant Milestones
    participant Habits
    participant Focus
    participant DailyLog
    participant LifeScore
    participant Insights

    User->>Goals: Create goal + milestones
    Goals->>Milestones: Decompose progress
    User->>Habits: Daily toggle (linked pillar)
    User->>Focus: Session linked to goalId
    Focus->>DailyLog: learning_hours rollup
    Habits->>DailyLog: gym / streak signals
    Milestones->>LifeScore: completion weight
    DailyLog->>LifeScore: mood, sleep, energy
    LifeScore->>Insights: domain narrative
    Insights->>User: Coaching recommendation
```

**Feeds Life Score today (conceptual weights):**
- Habits completion rate → consistency pillar
- Goals milestone progress → direction pillar
- Daily log mood/sleep → wellbeing pillar
- Finance net flow → stability pillar
- Journal frequency → reflection depth modifier

---

## Data Flow: Journal → Mood → Insights

```mermaid
flowchart LR
    J[Journal body] --> NLP[Sentiment NLP]
    NLP --> M[Mood score]
    M --> DL[Daily Log mood]
    M --> INS[Insights correlations]
    J --> TAG[Mode tags CBT/WWW]
    TAG --> INS
    J --> ARC[Arc theme drift]
```

**Friction note:** Mood is captured independently on Journal, Daily Log, Command Palette, MoodTracker, and Discipline — five surfaces writing related signals. Consolidation target: single `mood_primitive` synced everywhere.

---

## Data Flow: Calendar ↔ Habits ↔ Focus

| Source | Target | Relationship |
|--------|--------|--------------|
| Calendar recurring "gym" | Habit gym toggle | Infer completion (future) |
| Habit scheduled time | Calendar block suggestion | AI proposes block |
| Focus session | Calendar "focus" event | Optional back-write |
| Calendar meeting density | Focus abandon risk | Insights warning |
| Wake time (onboarding) | Calendar morning briefing | Notification scheduling |

---

## Data Flow: Finance → Reports → Life Score

```mermaid
flowchart TB
    TX[Transaction capture] --> CAT[Category NLP]
    CAT --> BUD[Budget variance]
    BUD --> REP[Reports period rollup]
    TX --> REP
    BUD --> LS[Life Score money pillar]
    REP --> INS[Insights spending narrative]
```

---

## API / Table Connections (Conceptual)

| Entity | Table / API group | Downstream readers |
|--------|-------------------|-------------------|
| Goals | `goals`, goals API | Focus, Insights, Reports, Life Score |
| Habits | `habits`, habits API | Overview, Gamification, Daily Log |
| Journal | `journal_entries`, journal API | Insights AI analyze, Daily Log mood |
| Daily Log | `daily_logs`, daily-logs API | Overview, Insights, Reports, Life Score |
| Finance | money tables, finance routes | Reports, Insights, budgets |
| Calendar | `events`, calendar + Google sync | Overview today, Focus |
| Family | members, documents, emergency | Emergency export only (not Life Score) |
| Placements | applications pipeline | Career Insights (future) |
| Discipline | discipline logs | Insights patterns, replacement habits |
| Command Palette | multi-table router | Journal, notes, wins, tasks, finance |

---

## AI Inference Layer (Overlay)

```mermaid
flowchart TB
    subgraph Signals
        TEXT[Free text captures]
        TIME[Temporal patterns]
        CAL[Calendar density]
        WEAR[Wearables future]
        USAGE[Route usage telemetry]
    end

    subgraph Inference Engine
        CLS[Classifier router]
        SENT[Sentiment / mood]
        CAT[Finance category]
        PILL[Pillar / priority]
    end

    subgraph Outputs
        FILL[Auto-filled fields]
        CHIP[Correction chips]
        NUDGE[Proactive nudges]
    end

    TEXT --> CLS
    TEXT --> SENT
    TIME --> PILL
    CAL --> FILL
    WEAR --> FILL
    USAGE --> FILL
    CLS --> FILL
    SENT --> FILL
    CAT --> FILL
    PILL --> FILL
    FILL --> CHIP
    FILL --> NUDGE
```

---

## Orphan / High-Friction Nodes

| Node | Issue | Resolution |
|------|-------|------------|
| Mood (5 surfaces) | Duplicate writes, inconsistent scale | Unify mood primitive |
| Life Arc (3 editors) | Same content in Onboarding, Identity, Profile | Single source of truth |
| Theme (3 pickers) | Login, Settings, Account | OS sync once |
| PIN (3 flows) | 4-digit vs 6-digit confusion | Biometric + unified PIN |
| Placements vs Lab ATS | Resume upload duplicated | Shared resume vault |

---

## Related Documents

- [[PRODUCT_INTELLIGENCE_LAYER]] — per-field analysis
- [[HUMAN_INTENT_GRAPH]] — intent → feature mapping
- [[../AIIMIN_PRODUCT_BIBLE/08_DATA_GRAPH]] — Product Bible summary
- `docs/interaction-audit/interaction_graph.md` — UI component graph
