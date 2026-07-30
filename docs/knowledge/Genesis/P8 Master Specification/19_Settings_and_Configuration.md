# Chapter 19 — Settings & Configuration

| Field | Value |
|-------|-------|
| **Status** | FROZEN |
| **Version** | P8 v1.0 |
| **Chapter** | 19 — Settings & Configuration |
| **Subsystem** | Batch 7 — Continuity of Control (with Ch 20, Ch 21) |
| **Approval** | Founder Approved — Freeze Certificate 2026-07-23 |
| **Last Modified** | 2026-07-23 |
| **Supersedes** | P8 v0.3-patched |

This chapter is normative.

Any modification requires a Founder ADR.

```yaml
chapter: 19
title: Settings & Configuration
p8_version: P8 v1.0
status: FROZEN
authored: 2026-07-23
remediated: 2026-07-23
freeze_blocker_pass: 2026-07-23
freeze_date: 2026-07-23
governance_source: P7 Governance v1.0 (FROZEN)
depends_on:
  - Chapter 01 — Product Identity (FROZEN v1.0)
  - Chapter 13 — Platform Specifications (FROZEN v1.0)
  - Chapter 15 — Privacy & Security (FROZEN v1.0)
  - Chapter 16 — Notification System (FROZEN v1.0)
  - Chapter 17 — Intelligence & Automation (FROZEN v1.0)
  - Chapter 18 — Personalization & Adaptation (FROZEN v1.0)
architectural_question: "What must remain true of configuration and settings for as long as AIIMIN exists?"
```

---

## 1. Purpose

Define **configuration law**: who owns settings; what may be configured; mutable vs immutable bounds; precedence; inheritance; restoration and reset; migration and compatibility; discoverability of consequential controls; invalid-configuration handling; import/export of configuration; and conflict resolution.

This chapter owns **how configuration of participation may change**. It MUST NOT own preference sovereignty doctrine (Chapter 18), life-entity ownership (Chapter 15), surface layout, or settings pages.

Settings exist to steward participation — not as a second daily Life OS.

---

## 2. Scope

### Includes

- Settings ownership and configuration scope
- Defaults and precedence
- Mutable vs immutable configuration
- Inheritance across execution environments
- Restoration, reset, migration, compatibility
- Discoverability of consequential controls
- Safety constraints and invalid configuration
- Configuration import/export and conflict resolution
- Chapter-local non-regression
- Canonical rules `P8-R-289`…`P8-R-305`, `P8-R-340`, `P8-R-341`

### Excludes

| Topic | Owner |
|-------|-------|
| Preference sovereignty / learned fit | Chapter 18 |
| Life-entity ownership, export/delete of graph | Chapter 15 |
| Attention worthiness / mute precedence | Chapter 16 |
| Delegation / automation authority | Chapter 17 |
| Settings surface composition / pages | Implementation / future surface work |
| Immutable configuration class list | FB-P8-025 |

---

## 3. Canonical Model

### 3.1 Terms (canonical)

| Term | Meaning |
|------|---------|
| **Configuration** | Declared controls that shape how the person participates — not life-entity content itself |
| **Setting** | A single configurable control within configuration |
| **System default** | Product-provided starting value before personal choice |
| **Personal default** | Starting value for a person (Chapter 18) |
| **Explicit setting** | Value the person has intentionally set |
| **Immutable configuration** | Controls that MUST NOT be alterable in ways that break product identity, life-entity meaning, or frozen constitutional obligations |
| **Mutable configuration** | Controls the person may change within declared purpose |
| **Reset** | Return of configuration toward defaults without deleting the personal life graph |
| **Restoration** | Return of a prior lawful configuration state |
| **Configuration conflict** | Two lawful sources disagree on a setting value |
| **Inherited lawful environment configuration** | A configuration-source under this chapter: lawful values inherited from an admitted execution environment (Chapter 13). Not preference sovereignty (Chapter 18). |

### 3.2 Axiom

**The person governs mutable configuration of their participation. AIIMIN stewards configuration — not the life graph.**

Explicit preferences outrank defaults (Chapter 18). Configuration-source precedence in this chapter MUST NOT amend Chapter 18. Configuration MUST NOT redefine product identity, life-entity meaning, or Outcomes. Settings MUST NOT become the daily path for Capture, Connect, or Coach (GOV-100). Non-person actors MUST NOT mutate configuration without explicit authorization.

Concrete immutable-class lists: FB-P8-025.

**Governance:** GOV-100, GOV-040, GOV-014, GOV-001

---

## 4. Canonical Rules

### §4.1 — Ownership and scope

**P8-R-289** — The person governs mutable configuration of their participation. AIIMIN is steward of configuration — not owner of the personal life graph (Chapter 15).

**Referenced GOV IDs:** GOV-014, GOV-001

---

**P8-R-290** — Configuration scope MUST be limited to declared product purpose. Settings MUST NOT expand authorization beyond Chapter 15 / Chapter 17.

**Referenced GOV IDs:** GOV-023, GOV-140

---

**P8-R-341** — Automation, delegated AI, agents, extensions, integrations, or any non-person actor MUST NOT modify configuration unless explicitly authorized by the person and operating under the constitutional authority chapter that governs that actor. Delegated automation and agents operate under Chapter 17. External capabilities, extensions, and integrations operate under Chapter 21. No actor MAY operate outside its governing chapter. No actor is required to satisfy Chapter 17 and Chapter 21 simultaneously.

**Referenced GOV IDs:** GOV-140, GOV-027, GOV-014

---

**P8-R-291** — Settings MUST NOT become the daily path for Capture, Connect, or Coach. Daily essential actions MUST remain reachable without configuration ceremony (GOV-100; Chapter 18 `P8-R-284`).

**Referenced GOV IDs:** GOV-100, GOV-028

---

### §4.2 — Defaults, precedence, inheritance

**P8-R-292** — Explicit settings and explicit preferences MUST outrank personal defaults and system defaults (Chapter 18 `P8-R-271`).

**Referenced GOV IDs:** GOV-027, GOV-035

---

**P8-R-293** — Precedence of configuration sources MUST be: explicit person intent → inherited lawful environment configuration → personal default → system default — unless a higher constitutional obligation forbids the lower value. This order is Chapter 19 configuration-source law. It MUST NOT weaken explicit person intent. It MUST NOT amend Chapter 18 preference sovereignty.

**Referenced GOV IDs:** GOV-027, GOV-025

---

**P8-R-340** — Inherited lawful environment configuration is a configuration-source under this chapter only. It MUST NOT redefine preference sovereignty (Chapter 18). It MUST NOT weaken explicit person intent. It MUST NOT amend Chapter 18 authority.

**Referenced GOV IDs:** GOV-027, GOV-025, GOV-153

---

**P8-R-294** — Inheritance of configuration across execution environments MUST NOT fork product identity, life-entity meaning, verbs, or Outcomes (Chapter 13).

**Referenced GOV IDs:** GOV-153, GOV-040

---

### §4.3 — Mutable vs immutable

**P8-R-295** — Configuration MUST NOT alter product identity, life-entity meaning, or Outcome definitions. Those remain Chapters 01, 05, and 13.

**Referenced GOV IDs:** GOV-001, GOV-040

---

**P8-R-296** — Immutable configuration MUST NOT be presented as freely mutable. Which concrete controls are immutable remains FB-P8-025 — this rule freezes the distinction, not the class list.

**Referenced GOV IDs:** GOV-025, GOV-001

---

### §4.4 — Reset, restoration, migration, compatibility

**P8-R-297** — Reset or restoration of configuration MUST NOT delete the personal life graph or substitute for export/delete rights (Chapter 15).

**Referenced GOV IDs:** GOV-014

---

**P8-R-298** — Migration of configuration MUST preserve explicit settings or disclose irreversible loss before commit.

**Referenced GOV IDs:** GOV-132, GOV-035

---

**P8-R-299** — Unknown or incompatible settings MUST be ignored or quarantined safely. They MUST NOT silently corrupt lawful configuration or life-entity state.

**Referenced GOV IDs:** GOV-089, GOV-132

---

**P8-R-300** — Invalid configuration MUST fail closed to a safe lawful state. Invalidity MUST NOT be presented as success.

**Referenced GOV IDs:** GOV-089, GOV-132

---

### §4.5 — Discoverability, safety, import/export, conflicts

**P8-R-301** — Settings that affect privacy scope, authorization, authentication, billing, or non-suppressible notice MUST be discoverable without burying them behind unrelated configuration debt.

**Referenced GOV IDs:** GOV-100, GOV-015, GOV-064

---

**P8-R-302** — Configuration import/export MUST be available for the person's configuration without hostaging life-graph export or delete (Chapter 15).

**Referenced GOV IDs:** GOV-014

---

**P8-R-303** — When configuration sources conflict, explicit person intent MUST prevail unless a frozen constitutional obligation forbids that value.

**Referenced GOV IDs:** GOV-027, GOV-025

---

**P8-R-304** — Configuration MUST NOT smuggle refused environment capabilities under another name (Chapter 13).

**Referenced GOV IDs:** GOV-013, GOV-153

---

**P8-R-305** — Evolution of configuration controls in this chapter MUST NOT regress this chapter's ownership of mutable configuration, configuration-source precedence without amending Chapter 18, non-person mutation limits, reset≠delete distinction, fail-closed invalid handling, or discoverability of consequential controls. Global ownership, export, delete, and anti-surveillance non-regression remain Chapter 15 (`P8-R-233`).

**Referenced GOV IDs:** GOV-014, GOV-058

---

## 5. Referenced GOV IDs

| GOV ID | Title | Status in P7 | Used in Ch 19 |
|--------|-------|--------------|---------------|
| GOV-001 | Personal Life OS | Approved | Yes |
| GOV-013 | Phone web /m capture-only ceiling | Approved | Yes |
| GOV-014 | Export and delete always | Approved | Yes |
| GOV-015 | Destructive confirm | Approved | Yes |
| GOV-023 | Human-problem gate | Approved | Yes |
| GOV-025 | Article supremacy | Approved | Yes |
| GOV-027 | Intent over interface | Approved | Yes |
| GOV-028 | Capture first | Approved | Yes |
| GOV-035 | Correctable inference | Approved | Yes |
| GOV-040 | Shared primitives | Approved | Yes |
| GOV-058 | No surveillance feeling | Approved | Yes |
| GOV-064 | Notifications deserve attention | Needs Discussion | Cross-ref |
| GOV-089 | No silent failed sync as success | Approved | Yes |
| GOV-100 | Settings are a penalty box | Approved | Yes |
| GOV-132 | Latency honesty | Approved | Yes |
| GOV-140 | No auth/billing change without user | Approved | Yes |
| GOV-153 | Growth axiom | Approved | Yes |

---

## 6. Dependencies

| Direction | Chapter | Relationship |
|-----------|---------|--------------|
| Upstream | 15, 16, 17, 18 | Ownership, notice, automation, preference |
| Upstream | 13 | Environment inheritance / no capability smuggle |
| Downstream | 20 | Onboarding may establish initial settings |
| Downstream | 21 | Extensions may expose configuration only within this law |

---

## 7. Edge Cases

| Condition | Expected behavior |
|-----------|-------------------|
| Setting renames a verb meaning | Violates P8-R-295 |
| Reset wipes journal entities | Violates P8-R-297 |
| Unknown setting silently alters finance entity | Violates P8-R-299 / P8-R-300 |
| Privacy-scope control buried in unrelated cluster | Violates P8-R-301 |
| Config import blocks life-graph export | Violates P8-R-302 |
| Environment inheritance treated as preference rewrite | Violates P8-R-340 / P8-R-293 |
| Agent changes settings without explicit grant | Violates P8-R-341 |

---

## 8. Founder Decision Blocks

| ID | Issue | Why blocked |
|----|-------|-------------|
| FB-P8-025 | Immutable vs mutable configuration class list | Multiple valid architectures; obligation frozen in `P8-R-296` |

---

## 9. Acceptance Criteria

| ID | Criterion | Measure |
|----|-----------|---------|
| AC-01 | Rules `P8-R-289`…`305` plus `340`–`341` | Grep count = 19 |
| AC-02 | No settings-page / UI layout normative | Review |
| AC-03 | Preference doctrine cited from Ch 18, not redefined | Conflict PASS |
| AC-04 | Status is FROZEN | Header |

---

## Internal Notes

- GOV-100 applied as constitutional participation law, not layout law.
- Mute controls are configured here; worthiness/precedence remain Chapter 16.

---

## Changelog

### 2026-07-23 — Official freeze (P8 v1.0)

- **What:** Batch 7 Continuity of Control frozen. Certificate issued.
- **Why:** Founder Final Ratification PASS.
- **Status:** frozen

### 2026-07-23 — Freeze-blocker patch (P8-R-341)

- **What:** Replaced conjunctive Ch17∧Ch21 gate with actor-applicable authority chapter.
- **Why:** Hostile Audit freeze blocker 1.
- **Status:** draft remediation

### 2026-07-23 — Founder remediation v0.2

- **What:** Bound environment inheritance as Ch19 configuration-source (`P8-R-293`/`340`); added non-person configuration mutation authority (`P8-R-341`); non-regression extended.
- **Why:** Founder Review Batch 7 remediations 1–2.
- **Status:** draft remediation

### 2026-07-23 — Batch 7 draft v0.1

- **What:** Initial draft Chapter 19. Rules P8-R-289…305.
- **Why:** Begin Batch 7 — Continuity of Control.
- **Status:** draft
