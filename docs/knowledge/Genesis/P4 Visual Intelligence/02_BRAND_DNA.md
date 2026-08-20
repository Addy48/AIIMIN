---
Purpose: Extract AIIMIN visual philosophy — invisible rules so 100 future screens remain unmistakably AIIMIN.
Confidence: 0.92
Evidence Sources: Product Bible; Knowledge Context; DESIGN.md; Palette lock; Brand.jsx; craft plan; native design system; anti-looks table
Files Used: docs/AIIMIN_PRODUCT_BIBLE/02_PHILOSOPHY.md; AIIMIN_KNOWLEDGE_CONTEXT/02_PRODUCT_PHILOSOPHY.md; DESIGN.md; Palette.md; Brand.jsx; docs/knowledge/17_NATIVE_APP_V2/06_DESIGN_SYSTEM.md
Reasoning: Brand DNA is more than color — shape, rhythm, density, emotion, narrative, energy.
Dependencies: 00, 01, 16, 17
Consumers: Every future designer and AI agent building UI
Known Unknowns: Exact density dial per persona (student vs founder) not fully tokenized
Last Updated: 2026-07-22
Pass: 4/6
---

# 02 — Brand DNA

## Philosophy in one sentence

**AIIMIN looks like a behavioral operating system for humans under load: warm momentum, honest scores, editorial calm on read surfaces, capture-first chrome on write surfaces — never purple AI SaaS theater.**

Brand frame: **Human Momentum**. Tagline: **One screen. Every day.**

## The invisible rules (follow these)

### 1. Orange acts. Green completes. Neutrals carry.

- Accent `#ff6b35` (light calm `#E85A24`) = CTA, selection, focus, urge intervention
- Success `#10b981` (light may deepen to `#1E5C3A`) = done, streak success, completion
- Neutrals dominate **≥90%** of pixels (native 60/30/10 guidance)
- Decorative purple/cyan/rainbow = **identity leak**

### 2. Warm paper, not cool gray

Light mode canvas is **warm ivory** `#EDE4D3` (or elevated `#F7F1E6`), not `#F5F5F5` / `#f9f9f9` cool SaaS.
Dark mode is charcoal graphite, not pure Vercel `#0A0A0A` void (legacy conflict — DNA prefers `#1a1a1a` family).

### 3. Shape language

- **Arch Bracket** geometry owns brand moments (splash, nav chip, OAuth, manifesto)
- Product UI: restrained radii — chips **pill (999)**; cards prefer token scale (8–16) over carnival 24px everywhere
- Prefer **1px borders + tonal surfaces** over multi-layer drop shadows (`DESIGN.md`)
- Squircle mark chip is brand-only; do not turn every card into a squircle

### 4. Rhythm & density

| Surface | Density | Breath |
|---------|---------|--------|
| Today / command desktop | Medium–high information | Still one primary focus |
| Journal / Notes write | Editorial / content-first | ~62–70ch measure |
| `/brand` | Low, manifesto | Large type, atmosphere |
| `/m` & native capture | Sparse controls | Thumb zones, no analytics chrome |
| Reports | Print/editorial | Artifact quality |

### 5. Emotion dial

| Emotion | Allowed | Forbidden |
|---------|---------|-----------|
| Confidence | Honest Life Score, mono numbers | Fake gamification theater |
| Warmth | Ivory, ember, peach washes | Cream+terracotta AI editorial cliché (explicitly rejected) |
| Energy | Orange CTAs, short springs | Infinite Lottie / confetti every tick |
| Calm | Read surfaces, Insights | Clinical blue therapist UI |
| Precision | 1px borders, JetBrains Mono stats | Hairline broadsheet newspaper layout |

### 6. Typography voice

- **Bodoni Moda** — wordmark / brand manifesto only
- **Familjen Grotesk** — display / ritual headlines
- **Figtree** — product body, nav, buttons, page titles
- **JetBrains Mono** — scores, money, timers, OS IDs
- Not Inter-as-identity. Not Playfair-as-default product H1.

### 7. Narrative

Screens tell **momentum of a life**, not “features of a SaaS.”
Copy and empty states teach shortcuts and next behaviors — not engagement bait.

### 8. Motion personality

Calm, interruptible, explanatory. 150–250ms UI product; peaks rare. Opacity + transform. No hover-lift carnivals on dense lists.

### 9. Device DNA

Visual language encodes the product rule: **phone captures; desktop commands**. A phone screen that looks like a full analytics dashboard is **anti-DNA**.

### 10. Anti-looks (sacred rejects)

From Knowledge Context / product locks:

- Purple AI SaaS gradients
- Warm cream + terracotta serif AI default
- Broadsheet dense newspaper columns
- GoodNotes PWA aesthetic
- AI therapist pastel calm
- Competitor logo pastiche (Vercel triangle, etc.)

## If someone builds 100 future screens

Checklist before merge:

1. Could this be AIIMIN with the logo removed? (orange/green/ivory or charcoal + Arch moments)
2. Did I introduce a new brand color? → **Stop**
3. Is Inter/Playfair/purple doing identity work? → **Replace**
4. Does this page have one signature layout cue? Or same card grid as yesterday?
5. Is motion explaining state — or decorating emptiness?
6. Phone surface — capture only?
7. Does completion use green and action use orange?

## DNA statement for agents

```
AIIMIN = Human Momentum Life OS.
Visual: charcoal + warm ivory + burnt orange action + green done.
Mark: Arch Bracket + ember.
Type: Figtree body · Familjen display · Bodoni wordmark · JetBrains scores.
Chrome: 1px border, tonal elevation, pill chips, restrained motion.
Never: purple AI, Inter identity, forest-green brand, glass carnival, analytics on /m.
```
