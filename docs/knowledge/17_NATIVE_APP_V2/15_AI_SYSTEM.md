# 15 — AI System Design (Native + shared)

> **Depends:** [[08_FEATURES]] [[09_BACKEND]] [[14_SECURITY]]  
> **Status:** Complete draft · 2026-07-19

---

## 1. Mobile AI jobs (scoped)

1. Universal log routing (NL → domain chips)  
2. Journal prompts / light rewrite  
3. Optional study explain (wrong MCQ)  
4. Week pulse narrative (short)  

**Not on mobile v1:** full Lab causal graphs, unbounded chat OS.

---

## 2. Architecture

```
Client → API /ai/* → Orchestrator → {retriever, tools, model router} → stream/json
                              ↘ cost ledger + redacted logs
```

---

## 3. Memory / context

- Short session memory per request  
- Retrieval: recent journal/notes embeddings (user-scoped)  
- No cross-user  

---

## 4. Embeddings / vector

Store in Postgres+pgvector or dedicated store · embed on write async · model versioned.

---

## 5. Prompt architecture

System: Human Momentum, no clinical claims, confirm writes.  
Developer: schema for tool calls.  
User: content.  
Output: JSON schemas for routers.

---

## 6. Tool calling

`create_habit_tick` · `draft_journal` · `add_expense` — always client confirm on mobile.

---

## 7. Model routing

| Task | Prefer | Fallback |
|------|--------|----------|
| Route log | Fast cheap (Groq/Gemini flash) | Rules-based |
| Journal prompt | Mid quality | Template |
| Explain MCQ | Mid | Static explanation field |
| Weekly narrative | Higher | Local template |

Use existing provider map from vault Intelligence docs.

---

## 8. Streaming

SSE/WebSocket to mobile · cancel button · partial render.

---

## 9. Cost / latency

Per-user daily token budget · cache identical routes · target p95 < 3s for route · degrade gracefully.

---

## 10. Safety

Prompt injection defenses · PII scrub logs · discipline crisis → static resources not model therapy.

---

*Next: [[16_ANALYTICS]]*
