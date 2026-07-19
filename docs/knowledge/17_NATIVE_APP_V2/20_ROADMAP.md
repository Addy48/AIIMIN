# 20 — Implementation Roadmap

> **Depends:** entire pack 01–19  
> **Status:** Complete draft · 2026-07-19  
> **Code starts only after Phase 0 exit + founder sign-off.**

---

## Phase 0 — Planning (NOW → exit)

**Deliverables:** Docs 00–20 complete (this pack) · Feature selection locked · Legal placeholders filled by founder · Stack lock (Doc 19)  
**Effort:** 1–2 weeks remaining polish / counsel pass  
**Exit criteria:**

- [ ] Founder accepts [[00_FEATURE_SELECTION]]  
- [ ] D1–D14 answered  
- [ ] Legal entity fields filled  
- [ ] No Capacitor-as-V2 confusion  
- [ ] Sign-off table below  

**Risk:** Scope creep back to “build WebView.” Mitigation: architecture gate.

---

## Phase 1 — Foundation (Android)

**Duration:** 8–12 weeks · 1–2 mobile eng + shared API  

| Milestone | Outcome |
|-----------|---------|
| M1 | App shell **Home·Journal·Notes·Vault·More**, design system, auth Custom Tabs |
| M2 | Room + sync batch MVP |
| M3 | Home + Habits strip + Score offline |
| M4 | Journal type compose + Keep grid skeleton + Account + Sentry + Play internal |

**Dependencies:** API idempotency + devices endpoints  
**Critical path:** Auth → Sync → Habits  
**Risk:** Auth WebView mistakes — use Custom Tabs only.

---

## Phase 2 — Core companion

**Duration:** +8–12 weeks  

**Journal voice+type** · **Keep notes** · Goals lite · Focus · Discipline · **Calendar agenda** · Quick Add · Entitlements  

**Exit:** Closed beta.

---

## Phase 3 — Vault + polish

**Duration:** +6–10 weeks  

**Family docs (priority)** · **Drive connect/import UX** · **Resumes download/share** · Money quick-add · AI route · Widgets · Push decision · Paywall  

---

## Phase 4 — Scale

**Duration:** +8–12 weeks  

iOS decision · Performance · Conflict UX · Public launch  

**Not in critical path:** Placements kanban · Calendar month · Lab primary.

---

## Phase 5 — Launch

Store listing · Data safety · Legal URLs live · LC checklist aligned · Monitoring · Staged rollout  

---

## Effort summary

| Phase | Calendar |
|-------|----------|
| 0 | 1–2 w |
| 1 | 8–12 w |
| 2 | 8–12 w |
| 3 | 6–10 w |
| 4 | 8–12 w |
| 5 | 2–4 w |
| **Total to public Android** | **~7–12 months** (1–2 eng) |

---

## Critical path

```
Phase0 → Auth → Sync/Room → Home/Habits → Journal type+voice → Keep notes → Vault (Family/Drive/Resumes) → Agenda lite → Beta → Store
```

---

## Parallel workstreams

| Stream | Owner |
|--------|-------|
| API sync/entitlements | Backend |
| Compose app | Mobile |
| Content (study packs optional) | Product |
| Legal finalize | Founder+counsel |
| ASO/listing | Growth |

---

## Sign-off

| Role | Phase 0 | Phase 1 start |
|------|---------|---------------|
| Founder | ☐ | ☐ |
| Architect | ☐ | ☐ |
| Mobile lead | ☐ | ☐ |
| Legal counsel | ☐ (policies) | ☐ |

---

*Pack complete for drafting purposes. Implementation begins only on explicit founder order after Phase 0 exit.*
