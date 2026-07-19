# 13 — Offline-First Architecture

> **Depends:** [[12_SYNC]] · android-data-layer / Ninja offline guidance  
> **Status:** Complete draft · 2026-07-19

---

## 1. What works offline (P0)

| Feature | Offline behavior |
|---------|------------------|
| Habit tick/create lite | Full |
| Daily log fields | Full queue |
| Journal draft/save / voice | Full local (audio queued) |
| Keep notes | Full local |
| Family doc metadata | Cached; open recent blobs if stored |
| Drive browse | Online preferred; show last list offline |
| Resumes list | Cached metadata; download needs net |
| Focus timer | Full; sync summary later |
| Discipline urge | Full queue |
| Finance quick-add | Full queue |
| Goals check-in | Full queue |
| Home / Score | **Read cached** + stale label |
| Calendar agenda | Read cached upcoming |
| AI | **Blocked** with reason |
| Paywall refresh | Blocked |

---

## 2. Storage

- Room DB primary  
- DataStore prefs  
- File store for drafts/images (encrypted if sensitive)  
- Size caps + LRU eviction for cached packs  

---

## 3. Queue

MutationOutbox: id · type · payload · retries · next_attempt · status  

WorkManager: network-connected constraint · battery not low optional.

---

## 4. Retry / backoff

1s · 5s · 30s · 2m · 10m · dead-letter → user “Sync issue”

---

## 5. Background

- Upload outbox when online  
- Download delta on foreground  
- Optional periodic sync ≤15min Android quota-friendly  

---

## 6. Conflicts

Surface via [[12_SYNC]] · never silent-drop journal.

---

## 7. UX

Sticky OfflineBanner · per-field “saved on device” · disable AI entry points.

---

## 8. Testing

Airplane mode checklist for each P0 write · kill app mid-queue · reboot resume.

---

*Next: [[14_SECURITY]]*
