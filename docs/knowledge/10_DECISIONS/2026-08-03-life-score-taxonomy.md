---
authority: engineering
derived_from: server/services/lifeHealthEngine.js
status: accepted
owner: founder
lifecycle: living
last_reviewed: 2026-08-03
can_override_genesis: false
knowledge_layer: KL-BUILD
graph_role: leaf
note_type: NT-ADR
tags:
  - type/decision
  - domain/product
  - status/accepted
---

# ADR — Life Score taxonomy (canonical 5 dimensions)

**Status:** accepted · 2026-08-03 · supersedes all other dimension namings
**Decides:** the founder question blocking the Score screen on app and web.

## Decision

The Life Score has exactly **five dimensions**, with these **stable keys**:

```
physical · cognitive · discipline · financial · emotional
```

Display labels, used on every surface, app and web:

| Key | Display label | Never call it |
|---|---|---|
| `physical` | **BODY** | Movement, Health, Fitness |
| `cognitive` | **MIND** | Mental, Brain, Learning |
| `discipline` | **DISCIPLINE** | Order, Habits, Consistency |
| `financial` | **MONEY** | Finance, Wealth |
| `emotional` | **MOOD** | People, Emotional, Reflection |

**Keys are the contract. Labels are presentation.** Store, transmit and compute with the
keys; render the labels. Never invent a third name for either.

## Why — this was not a three-way choice

Only one of the three competing sets is implemented. Verified 2026-08-03:

| Candidate | Where it lives | Backing |
|---|---|---|
| **physical / cognitive / discipline / financial / emotional** | `server/services/lifeHealthEngine.js` | **A real engine.** Weighted sub-metrics, a global score, a timeline. Consumed by `/intelligence/lhs`, `/intelligence/report`, `services/reportGenerator.js`, `services/weeklyReviewEngine.js`, `frontend/src/hooks/useLHSData.js`. |
| Body / Mental / Goals / Money / Sleep (Today surface) | display strings | **None.** No engine computes "Goals" or "Sleep" as a dimension — `sleepScore` is a *base metric* that feeds `physical`. This set mixes a dimension, a base metric and a feature. |
| Craft / Body / Order / Mind / Money / People (prototype) | prototype visuals | **None**, and it has **six** entries, not five. Invented for the Drafting Table layout. |

Picking either of the unimplemented sets would mean rewriting the Life Health engine, the
report generator, the weekly review engine and every stored score — to gain nothing. The
implemented set wins on evidence, not taste.

The one real complaint about it — that `physical/cognitive/emotional` reads clinical — is a
**labelling** problem, and labelling is exactly what the display layer above fixes. The
prototype's warmth is preserved (BODY, MIND, MONEY, MOOD are short, uppercase and mono-
friendly, which is the Drafting Table voice) without touching the maths.

## The model (do not re-derive)

`server/services/lifeHealthEngine.js` — authoritative:

| Dimension | Composition | Weight in global score |
|---|---|---|
| `physical` | sleep 0.4 · activity 0.4 · nutrition-water 0.2 | **0.25** |
| `cognitive` | focus 0.7 · learning 0.3 | **0.20** |
| `discipline` | habit completion 0.5 · routine adherence 0.3 · focus 0.2 | **0.25** |
| `financial` | budget adherence 0.7 · savings rate 0.3 | **0.15** |
| `emotional` | mood stability 0.5 · journal consistency 0.5 | **0.15** |

Weights sum to 1.00. All values clamped 0–100.

**The app must not compute its own score.** The prototype placeholder
(`round(70.7 + done*1.9 + (rung-3)*1.6 + (railAvg-70)*0.12)`) is a stand-in and must be
deleted on wiring. Both clients read the server figure, so the number on the phone always
equals the number on the web for the same day — that was the "47/49/54" bug.

## Consequences

1. **Web:** relabel the Today surface's six-area grid to the five canonical dimensions with
   the labels above. "Goals" and "Sleep" stop being dimensions — Goals is a feature, Sleep is
   a base metric shown under BODY.
2. **App:** the Score screen is **unblocked**. Build it against these five keys; read
   `GET /intelligence/lhs`, render the labels, never recompute.
3. **Prototype:** its six-area grid is now known to be non-canonical. The Drafting Table
   *visual* language stays locked; only the dimension names and the count change (6 → 5).
4. Any new dimension is a schema + engine change and needs a new ADR. Do not add one in a UI.

## Open

Nothing blocking. Sub-metric weights are tunable later without changing this taxonomy — that
is the point of fixing the keys.

## Related

- [[00_ROUTING]] · [[17_NATIVE_APP_V2/AIIMIN_MASTER_STATUS_AND_NEXT_STAGE]] §9
- [[15_MEMORY/Handoff-Native-App-Build]] · [[15_MEMORY/Handoff-Website-Hardening]]
