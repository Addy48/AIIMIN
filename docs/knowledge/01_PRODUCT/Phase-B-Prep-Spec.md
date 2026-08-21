---
authority: product
derived_from: Massive-Upgrade-Research-Pack · Roadmap/Blueprint-Appendices/04_Data-API-AI · Build-Next-Now
status: active
owner: founder
lifecycle: living
last_reviewed: 2026-08-20
can_override_genesis: false
knowledge_layer: KL-PROD
graph_role: plan
note_type: NT-SPEC
tags:
  - type/spec
  - domain/product
  - status/living
  - phase/B
---

# Phase B Prep Spec — Link core (eng tickets)

> **Job:** Ready-to-build tickets for the main climb. **No schema applied until founder explicitly asks.**  
> **Card:** [[Build-Next-Now]] · **Research:** [[Massive-Upgrade-Research-Pack]] §3–4 · **Schema draft:** [[Roadmap/Blueprint-Appendices/04_Data-API-AI]] §9.3  
> **IA lock:** People live under Family (OD-02 / ADR-B1) — not a new top-level hub.

## Acceptance (Phase B “shipped”)

1. At least one typed `graph_edges` row writable + readable for the founder account.  
2. Person card under `/family` shows ≥1 cross-domain link (money or loop).  
3. Today shows an Open Loops queue (open / close via Settle).  
4. Depth state is **server-driven** (not client invent).  
5. **One provenance golden path** cites `sources[]` end-to-end (default recommendation: **Money**).

Marketing may upgrade “linked truth” from **TARGET** → **FACT** only after (5).

---

## Ticket B0 — Founder gates (blockers)

| ID | Decision | Default if silent |
|----|----------|-------------------|
| B0.1 | First provenance path | **Money** |
| B0.2 | Career stay parked | Yes |
| B0.3 | Explicit **schema** go-ahead | Required before B1 migration |

---

## Ticket B1 — Schema + RLS (`people`, `graph_edges`)

**Source of truth for DDL:** Blueprint Appendix 04 §9.3 (do not invent a second vocabulary).

| Step | Work | Notes |
|------|------|-------|
| B1.a | Migration: `people` + `graph_edges` | `USER_SCOPED_TABLES` + RLS same PR |
| B1.b | Edge type allow-list | Align research §3.1: `spent_with`, `about_person`, `supports_goal`, `opens_loop`, `closes_loop`, `from_document`, `correlates_with`, plus Blueprint legacy aliases mapped in code |
| B1.c | Seed zero rows | Empty LIVE — never SEED labelled LIVE |

**Blocked until:** founder says apply schema.

---

## Ticket B2 — API

| Endpoint (proposed) | Job |
|---------------------|-----|
| `GET/POST /api/people` | CRUD person (Family IA) |
| `GET /api/people/:id/context` | Edges + linked entities for Person card |
| `POST /api/graph/edges` | Create typed edge (auth user only) |
| `GET /api/graph/context` | Neighbourhood for a src/dst |
| Extend `/mobile/bootstrap` | `open_loops`, `depth` fields (Blueprint already names) |

All session-cookie auth. Never client-supplied user id.

---

## Ticket B3 — Web UI (primary graph home)

| Surface | Build |
|---------|--------|
| Family → People | Person card: lends / spends / loops / care |
| Today / Overview | Open Loops strip; Depth chip from server |
| Money (golden path) | Insight / Offer drawer with `sources[]` + confidence |

**REJECT:** `/people` as top-level nav.

---

## Ticket B4 — Native V3 (light)

| Surface | Build |
|---------|--------|
| Day | Open Loops count + deep link to web or in-app settle |
| Money | Approve still human; edge `spent_with` only after Approve |
| Lab | Keep SEED · DEMO honest until `correlates_with` is server real |

---

## Ticket B5 — Provenance golden path (Money)

1. Capture or UPI draft → human Approve.  
2. Write tx + optional `spent_with` → Person.  
3. One insight: “Spent with X this week” with `sources[]` = edge ids + tx ids.  
4. UI drawer lists sources; no cite → no insight.

---

## Order of work (after B0)

`B1` → `B2` → `B3` Person card + Today loops → `B5` Money cite → Depth polish → native light (`B4`).

---

## Explicit out of Phase B

UPI OCR review queues · Health Connect · Knock registry · OS maturity ladder · semantic search — Phase C/D/E.

---

### Changelog

### 2026-08-20 — Spec written
- **What:** Eng ticket breakdown for Phase B without applying schema.
- **Why:** Keep-going Day 6 prep; founder asked where build-next research lives.
- **Files:** `docs/knowledge/01_PRODUCT/Phase-B-Prep-Spec.md`
- **Status:** shipped-docs
