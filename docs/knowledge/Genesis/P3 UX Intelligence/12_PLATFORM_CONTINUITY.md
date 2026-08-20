# 12 — Platform Continuity

## Purpose
Determine whether website, Android native, phone web `/m`, HTML prototypes, and future desktop/tablet experiences feel like one ecosystem or unrelated products.

## Confidence
★★★★★ — Device-Tiers + code shells + native IA + prototype screens compared directly.

## Evidence Sources
Device-Tiers.md; App.js `/m`; MobileBottomNav; AiiminRoot; Product Guide; Current-Context prototypes; index-opus.html; live waitlist.

## Files Used
Listed above; BrandLockup; WelcomeGate.kt.

## Reasoning
Continuity = shared purpose, vocabulary, identity, and predictable capability differences — not identical UI.

## Dependencies
[[03_INFORMATION_ARCHITECTURE]] · [[05_NAVIGATION_AUDIT]]

## Consumers
Native roadmap, marketing honesty, prototype governance.

## Known Unknowns
iOS native; desktop Electron/future; tablet longitudinal usage.

---

## Surface inventory

| Surface | Role (declared) | Role (felt) | Nav model |
|---------|-----------------|-------------|-----------|
| Desktop web ≥1100 | Full Life OS | Full Life OS + density | Masthead pins |
| Tablet web | Full Life OS touch | Full OS + TabRail | Rail + masthead |
| Phone web `/m` | Capture stopgap | Logbook + Score | 3 tabs |
| Capacitor `/m` wrapper | Same as phone web | WebView capture | Same |
| Native Android V2 | Rich companion | Write/glance satellite | 5 tabs |
| Waitlist / Brand | Marketing / philosophy | Premium story | Marketing scroll |
| HTML prototype | Vision lab | Different OS (Tasks/Projects/AI) | 5-ish tabs different labels |

---

## One ecosystem test

| Glue | Status |
|------|--------|
| Account / OS-ID / PIN | Shared — strong |
| Palette accent `#ff6b35` | Shared — strong |
| Life Score concept | Shared — medium (compute often desktop) |
| Journal / notes / habits concepts | Shared words — divergent behaviors |
| Today as hub | Desktop yes; native Home ≠ Today; `/m` Today = log |
| Capture → score → insight loop | Desktop aspirational; phone partial; prototype different |
| Voice / AI log | Desktop stronger; native STT partial |

**Verdict: Multiple related products sharing an account and palette — not yet one ecosystem.**

---

## Continuity breaks (ranked)

1. **Three phone mental models** — `/m` vs native vs “responsive desktop forced”
2. **Prototype vocabulary** — Tasks/Projects/Knowledge ≠ Habits/Goals/Lab
3. **Marketing “Life OS” vs phone capture honesty** — bittersweet
4. **Native “pocket Life OS” vs edit-on-desktop** — dual message
5. **Notes semantics** — sources vs Keep
6. **Stale docs** — Product Guide native not shipped vs APK 2.2.1; old audit no `/m`

---

## Future desktop / tablet

Tablet already runs full OS — continuity with desktop is best pair in the matrix.
Future desktop installers should inherit web IA, not prototype IA, unless intentional migration with teaching.

---

## What “one ecosystem” would require (UX, not eng)

1. Shared **job story**: Desktop structures; phone captures/glances; native adds offline ritual — said identically everywhere.
2. Shared **object names** and verbs (tick, log, urge, score).
3. Shared **empty-state philosophy** (never dead-end without path).
4. Prototype either aligns to production nouns or stays clearly labeled “exploration.”
5. Capability matrix visible in Account (“Your devices”).

---

## Cross-link
[[04_USER_JOURNEYS]] · [[18_RISK_REGISTER]] · [[17_UX_OPPORTUNITIES]]
