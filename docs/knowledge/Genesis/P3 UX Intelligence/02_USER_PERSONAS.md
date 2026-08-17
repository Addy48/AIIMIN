# 02 — User Personas

## Purpose
Define who AIIMIN’s experience is designed for, who it accidentally serves, and who it harms — grounded in product docs and interaction costs, not invented demographics.

## Confidence
★★★★☆ — Personas documented in Product Guide + Personas.md + PRODUCT.md. No large-N research file on disk (`07_USER_RESEARCH.md` indexed but missing from Knowledge Context).

## Evidence Sources
`docs/knowledge/01_PRODUCT/AIIMIN-Product-Guide.md`; `docs/knowledge/15_MEMORY/Personas.md`; `PRODUCT.md`; `HUMAN_INTENT_GRAPH.md`; friction heatmap; native UX pack.

## Files Used
Product Guide §5; Personas.md; Onboarding life-mode step; nav persona presets.

## Reasoning
Personas must map to journeys and friction, not marketing adjectives.

## Dependencies
[[00_EXECUTIVE_SUMMARY]] · [[04_USER_JOURNEYS]]

## Consumers
IA, onboarding, pricing messaging, native prioritization.

## Known Unknowns
Real tester cohort composition beyond founder device; household multi-user reality vs personal-OS design.

---

## Primary personas (product-declared)

| Persona | Goals in AIIMIN | Surfaces that fit | Friction traps |
|---------|-----------------|-------------------|----------------|
| **Student** | Study rhythm, placements, habits, money, focus | Habits, Focus, Placements, Lab, Calendar | Lab choice overload; Placements CRM entry; onboarding goal multi-select |
| **Working professional** | Calendar, finance, family, goals | Calendar, Finance, Family, Goals | Finance 6-field form; Family vault wall |
| **Founder / builder** | Execution, experiments, discipline | Overview, Lab, Discipline, Focus, Finance | Widget density; “ops” tone may feel like work about work |
| **Family / household** | Shared routines, vault, money | Family, Finance, Calendar | Product is still personal OS — collaboration limited; vault setup anxiety |
| **Athlete / fitness** | Training consistency, recovery | Habits, Sports, Discipline, Goals | Sports often read-only; recovery vs streak tension |

**Audience compressed (`PRODUCT.md`):** Students and early-career builders under high cognitive load.

**Owner persona (`Personas.md`):** Solo builder; prefers truth + data over motivational fluff — explains sparring tone and Life Score honesty doctrine.

---

## Secondary / situational personas

| Persona | Need | Experience risk |
|---------|------|-----------------|
| **Waitlist visitor** | Pricing clarity, OS-ID reserve, trust | Cutoff urgency can feel hype if product still dense |
| **Guest explorer** | Try without save | Guest banner glass + “data will not be saved”; GuestTour pricing contradiction |
| **Phone-only user** | Capture on the go | Cannot create habits on native; `/m` is capture-only — fails if they never use desktop |
| **Returning monthly user** | Re-orient after absence | Dense Today + many routes; no strong “what changed while you were gone” |

---

## Anti-personas (explicit)

- Casual wellness browsers wanting passive content feeds
- Teams needing multi-user collaboration (v1 personal OS)
- Users wanting ad-supported free tools with social graphs

**UX implication:** Features that look social (leaderboards, shared streaks) should stay out — Bible kill list agrees.

---

## Intent personas (stronger than demographic)

From `HUMAN_INTENT_GRAPH.md`, people arrive as intents:

| Intent cluster | Example | Best current path | Worst current path |
|----------------|---------|-------------------|--------------------|
| Emotional | Vent, process setback | Journal capture | Journal mode gate + mood×5 |
| Temporal | Plan day, review week | Overview scan | Mental merge across 4 routes |
| Behavioral | Build / break habit | Habit toggle; Discipline | Discipline trigger under stress |
| Practical | Money, schedule, docs | Finance / Calendar / Family | High field counts |
| Identity | Career, life direction | Placements, Identity arc | Arc blank-page syndrome |

**IA claim (challenged):** Demographic personas drive nav presets; intent personas should drive capture routing. Doctrine agrees; IA still demographic/domain-first.

---

## Persona × five-year outlook

| Persona | 5-year success look | 5-year failure look |
|---------|---------------------|---------------------|
| Student | Capture habit through exams; Career pipeline useful; Focus trusted | Abandoned after placements season; Lab unused clutter |
| Professional | Finance + calendar + family vault as private OS | Feels like unpaid admin work |
| Founder | Life Score + discipline + journal as sparring partner | Becomes another productivity cult |
| Phone-only | Native create+capture parity | Permanent second-class; churn |

---

## Cross-link
[[04_USER_JOURNEYS]] · [[07_COGNITIVE_LOAD]] · [[16_BEHAVIORAL_DESIGN]]
