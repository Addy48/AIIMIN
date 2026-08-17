# 12 — Decision Log

```yaml
purpose: Unified decision log (ADR + implicit locks + kill-list). Cross-index to 03.
confidence: ★★★★☆
generated_from:
  - docs/knowledge/10_DECISIONS/*
  - AIIMIN_KNOWLEDGE_CONTEXT/03_PRODUCT_DECISIONS.md
  - docs/AIIMIN_PRODUCT_BIBLE/15_THINGS_NEVER_TO_BUILD.md
related_notes: [03_PRODUCT_DECISIONS.md, 14_CONTRADICTIONS.md, 13_OPEN_QUESTIONS.md]
dependencies: [03_PRODUCT_DECISIONS.md]
consumers: Agents before irreversible changes
importance: ★★★★★
```

---

## HOW TO USE

1. Check **locked** decisions first — require owner ask to change
2. Check **ADRs** for domain architecture
3. Check **kill/reject** before proposing UI fields
4. If conflict → `14_CONTRADICTIONS.md` authority order

Authority order when docs disagree:
1. Explicit owner ask (runtime)
2. Locked product locks (palette, `/m`, auth/schema, navbar)
3. Formal ADRs
4. Product Bible + Product Guide (2026-07-11/18)
5. Feature MOC + changelog newest entry
6. MASTER_PLAN / Progress Summary (stale risk)

---

## LOG — CHRONOLOGICAL

| Date | ID | Decision | Status |
|------|-----|----------|--------|
| 2026-06-25 | MP-0 | Phase 0 foundation + (then) blue design overhaul | design superseded; foundation partial |
| 2026-07-05 | AUTH-BA | Adopt Better Auth; delete Clerk | shipped |
| 2026-07-05 | MAIL-R | Resend only | shipped |
| 2026-07-08 | MARK-AB | Arch Bracket mark | shipped |
| 2026-07-09 | NAME-ARC | North Star → Life Arc | shipped |
| 2026-07-10 | ADR-VOS | Vault Brain OS | shipped |
| 2026-07-11 | DOC-BIBLE | Product Bible Phase 8 doctrine | shipped (doctrine) |
| 2026-07-11 | KILL-* | Kill/Infer field program | planned |
| 2026-07-13 | ADR-NOTES | Source-grounded Notes + AnchorEdge | accepted_pending |
| 2026-07-13 | ADR-DISC | UrgeEvent + pattern language | accepted_pending |
| 2026-07-17 | BRAND-HM | Human Momentum `/brand`; navbar lock | locked/shipped |
| 2026-07-18 | REP-LOS | Folio → Life OS Review; Elite web thesis | naming shipped; Elite craft |
| 2026-07-18 | LHS-API | Life Score API-first | shipped |
| 2026-07-19 | MONO-3 | Three-client monorepo law | shipped (docs+process) |
| 2026-07-19 | NAT-CEIL | Native ≠ capture-only ceiling | documented |
| 2026-07-19 | CAP-LEG | Capacitor legacy | documented |

Full detail tables: `03_PRODUCT_DECISIONS.md`

---

## DECISION TYPES COUNT (PASS 2)

| Type | Approx count |
|------|--------------|
| Locked product locks | 9 |
| Formal ADRs | 4 (+privacy clause) |
| Architecture platform | 8 |
| Feature thesis | 9 |
| Kill/infer planned | 6 |
| Explicit rejections | 10 |
| Stale-to-ignore claims | 4 clusters |

---

## PENDING SCHEMA-BOUND DECISIONS

| Decision | Blocker |
|----------|---------|
| UrgeEvent migration | Explicit schema ask + migration |
| `anchor_edges` rollout | Explicit schema ask |
| Mood primitive unification | Schema + multi-surface rewrite |
| Discipline FE full API | Migration completion |

**Process lock:** Product intelligence does not authorize migrations alone.
