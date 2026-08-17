# AIIMIN — Research Foundations (Phase 7)

**Status:** Bibliography + synthesis for product intelligence  
**Date:** 2026-07-11

---

## Purpose

Ground AIIMIN's AI-first, low-friction design in established HCI, cognitive science, and passive sensing research — not generic "best journal UI" listicles.

---

## Research Domains → AIIMIN Implications

### 1. Mixed-Initiative Interfaces (CHI / Microsoft Research)

**Key concepts:** Coupling automated agent services with direct manipulation; managing uncertainty about user goals; timing of intervention; expected utility of automation vs user effort.

**Representative references:**
- Horvitz, E. — *Principles of Mixed-Initiative User Interfaces* (CHI 1999)
- Horvitz, E. — *Uncertainty, Action, and Interaction: In Pursuit of Mixed-Initiative Computing* (IEEE Intelligent Systems, 1999)
- Maes, P. & Shneiderman, B. — *Direct Manipulation vs. Interface Agents: A Debate* (Interactions, 1997)
- Horvitz et al. — *The Lumiere Project: Bayesian User Modeling* (UAI 1998) — LookOut scheduling assistant

**AIIMIN implication:** Command Palette AI Log and finance category inference should follow mixed-initiative rules: act when confidence high, offer correction chips when medium, ask only when low. LookOut's calendar intent recognition is the direct ancestor of "paste job URL → auto-fill application."

---

### 2. Stanford HCI — Behavior Change & Personal Informatics

**Key concepts:** Reflection-on-action vs in-action; lapse vs relapse; goal gradient effect; self-monitoring without increasing burden.

**Representative references:**
- Li, I. et al. — *A Stage-Based Model of Personal Informatics Systems* (CHI 2010)
- Epstein, D. et al. — *A Live Field Test of Five Principles for Gathering Personal Data* (CHI 2015)
- Consolvo, S. et al. — *Design Requirements for Technologies that Encourage Physical Activity* (CHI 2009)

**AIIMIN implication:** Habits toggle (low friction) aligns with in-action monitoring; Goals 7-field modal is reflection-before-action — move structuring post-capture. Stage model maps to: onboarding (installation) → daily capture (action) → Insights (reflection) → Reports (integration).

---

### 3. MIT Media Lab — Lifelogging & Memory Reconstruction

**Key concepts:** Capture everything, retrieve selectively; memory externalization; serendipitous recall; privacy paradox in lifelogging.

**Representative references:**
- Gemmell, J. et al. — *MyLifeBits: A Personal Database for Everything* (CACM 2006)
- Dodge, M. & Kitchin, R. — *The Ethics of Forgetting in an Age of Pervasive Computing* (2007)
- MIT Media Lab — Fluid Interfaces / Social Machines group work on memory augmentation

**AIIMIN implication:** Journal + Notes + Command Palette are lifelogging primitives. Future ambient capture must include strong forget/export/delete (already in Account data section). Memory reconstruction = AI weekly digest linking journal themes to goals.

---

### 4. CMU HCII — Intelligent Personal Assistants & Interruptibility

**Key concepts:** Interruptibility models; cost of interruption; notification timing; cognitive load measurement.

**Representative references:**
- Iqbal, S. T. & Horvitz, E. — *Disruption and Recovery of Computing Tasks* (CHI 2007)
- Fogarty, J. et al. — *Predicting Human Interruptibility with Sensors* (CHI 2005)
- Myers, B. A. — *Using Hand-Held Devices to Support Software Engineering Tasks* — CMU tradition of tool integration

**AIIMIN implication:** Focus timer and onboarding PIN are partially interruptible (audit limitation). Proactive AI nudges must use interruptibility model — no coaching modals during active Focus session. Morning briefing = high receptivity window.

---

### 5. Apple / Google Research — Passive Sensing

**Key concepts:** Activity recognition from phone sensors; health kit aggregation; privacy-preserving on-device ML; exposure notification patterns for consent.

**Representative references:**
- Apple — Health Records / HealthKit documentation and WWDC health sessions (activity, sleep)
- Google Research — *Mobile Sensing for Personal Health* (various; See e.g. activity recognition on Android)
- Cormack, G. V. et al. — privacy-preserving federated learning (relevant to on-device infer)

**AIIMIN implication:** sleep_hours, steps, learning_hours should move to passive import with explicit HealthKit permission once. Aligns with Kill List **System** verdicts. On-device inference for mood is preferable to sending raw journal to cloud where possible.

---

### 6. Digital Phenotyping & Mental Health Informatics

**Key concepts:** Behavioral markers from passive data; relapse prediction; ethical constraints on mental health inference; clinician vs consumer boundaries.

**Representative references:**
- Insel, T. — NIMH Research Domain Criteria (RDoC) framework
- Torous, J. et al. — *Digital Phenotyping: A Global Tool for Psychiatry* (World Psychiatry, 2021)
- Mohr, D. C. et al. — *Personal Sensing: Understanding Mental Health Using Ubiquitous Sensors* (Annual Review of Clinical Psychology, 2017)

**AIIMIN implication:** Mood inference from journal is digital phenotyping — require transparency, user correction, no diagnostic claims. Discipline and Lab Addiction modules need higher privacy bar. Insights copy must be coaching not clinical.

---

### 7. UIST — Instrumented Interaction & Input Innovation

**Key concepts:** Novel input modalities; voice as first-class; reducing form complexity through intelligent defaults.

**Representative references:**
- Wobbrock, J. O. et al. — *The Angle Mouse: Target-Acquisition Techniques for 1D Targets* — UIST tradition of input efficiency
- Lee, B. & Oulasvirta, A. — computational interaction frameworks (UIST community)
- Landau, S. — voice UI research at UIST/CHI intersections

**AIIMIN implication:** Voice dictation on Journal and Command Palette should share one STT pipeline (duplicate pattern kill). Chord `Space→L` universal logger is power-user UIST-style efficiency — teach in onboarding.

---

### 8. Cognitive Psychology — Decision Fatigue & Choice Architecture

**Key concepts:** Ego depletion debates; choice overload; defaults and nudges; paradox of choice in onboarding.

**Representative references:**
- Baumeister, R. F. et al. — *Ego Depletion: Is the Active Self a Limited Resource?* (1998; replication debates ongoing)
- Iyengar, S. S. & Lepper, M. R. — *When Choice is Demotivating* (2000)
- Thaler, R. & Sunstein, C. — *Nudge* (2008) — choice architecture

**AIIMIN implication:** Onboarding goal/habit multi-select (INT-011, INT-012) is choice overload — default to AI-suggested 3 habits. Finance 6-field form is decision fatigue (telemetry: `decision_fatigue_signal` at ≥5 dropdown changes). Defaults: today, last account, inferred category.

---

### 9. Information Theory & Quantified Self

**Key concepts:** Signal vs noise in self-tracking; data resolution vs burden; personal analytics meaningfulness.

**Representative references:**
- Wolf, G. — Quantified Self movement (QS conferences, 2011+)
- Choe, E. K. et al. — *Understanding Quantified-Selfers' Practices in Collecting and Exploring Personal Data* (CHI 2014)
- Kay, M. et al. — *Lullaby: A Capture & Access System for Understanding Sleep* (CHI 2008)

**AIIMIN implication:** Daily log fields like water, breakfast are low signal — Kill List. High signal: mood, sleep, habits, finance. Reports should surface fewer, higher-signal metrics (Life Score composite).

---

### 10. Ambient AI & Agentic Interfaces (2024–2026 frontier)

**Key concepts:** Tool-using agents; proactive vs reactive; human-in-the-loop; compound AI systems.

**Representative references:**
- Yang, J. et al. — *ReAct: Synergizing Reasoning and Acting in Language Models* (2023)
- Park, J. S. et al. — *Generative Agents: Interactive Simulacra of Human Behavior* (UIST 2023)
- Industry: Apple Intelligence ambient actions; Google Gemini system integration

**AIIMIN implication:** Command Palette AI Log is proto-agentic router. Future: agent reads Information Graph, writes to multiple tables per utterance, confirms with single chip row. Aligns with FUTURE_AIMIN_FRAMEWORK automation matrix P0.

---

## Synthesis: Research → Design Rules

| Research theme | AIIMIN rule |
|----------------|-------------|
| Mixed-initiative | Infer silently ≥70% confidence; chip 40–70%; ask <40% |
| Personal informatics stages | Separate capture from reflection surfaces |
| Lifelogging ethics | Export, delete, encrypt journal; no surprise inference |
| Interruptibility | No proactive modals during Focus; morning briefing window |
| Passive sensing | HealthKit for sleep/steps; explicit consent |
| Digital phenotyping ethics | No clinical claims; user correction always visible |
| Choice architecture | ≤3 choices per decision screen |
| Quantified self signal | Kill low-signal daily fields |
| Agentic AI | One utterance → multi-table write with confirm |

---

## Related Documents

- [[FUTURE_AIMIN_FRAMEWORK]] — automation stack
- [[../AIIMIN_PRODUCT_BIBLE/10_RESEARCH]] — Product Bible summary
- [[../AIIMIN_PRODUCT_BIBLE/13_PRODUCT_PRINCIPLES]] — non-negotiables
