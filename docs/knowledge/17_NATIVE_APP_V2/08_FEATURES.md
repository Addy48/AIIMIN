# 08 — Feature Documentation (Native) — revised

> **Status:** Revised 2026-07-19 · aligns [[00_FEATURE_SELECTION]] [[03_INFORMATION_ARCHITECTURE]]

---

## F01 Home

Ritual cockpit: score, habit strip, AgendaPeek, micro-log, week pulse, shortcut into Journal voice if no entry today.  
**Offline:** cached score/habits; queue ticks/logs.

---

## F04 Journal — **typing + voice first**

**Purpose:** Fast emotional/cognitive capture on phone.  
**UX:**

- Compose opens with **keyboard ready** + persistent **VoiceRecordBar**  
- Voice: tap/hold → waveform → live/partial transcript → user edits → Save  
- Modes (Today, Free, CBT…) as **secondary chips**, not the first gate  
- Feed of past entries; swipe actions archive  

**Permissions:** `RECORD_AUDIO` with rationale; deny → type-only, no shame.  
**Backend/API:** journal CRUD + optional `audio_object_url` / transcript field.  
**Offline:** audio + draft queued; transcript may finalize on reconnect.  
**Analytics:** `journal_save` {input: type|voice|mixed}, `journal_voice_start`.  
**Edge:** noisy room → keep audio, mark transcript low-confidence.  
**Security:** optional hide content in recents; no audio in crash logs.  
**Future:** on-device STT when quality allows.

---

## F05 Notes — **Keep-style quick notes**

**Purpose:** Frictionless scraps, lists, pins — Google Keep energy, AIIMIN brand.  
**UX:**

- 2-column **card grid** (list toggle)  
- Tap empty / `+` → quick compose sheet (title, body, checklist)  
- Color chips, pin, labels, light reminder  
- Shared-element expand to detail  
- Search always available  
- Long documents: preview + **Open on desktop**  

**Not:** Notion pages, Drive-first editor, desktop sidebar.  
**API:** notes with `color`, `pinned`, `checklist_json`, `labels`.  
**Drive:** “Import from Drive” into a Keep card (see F24).  
**Offline:** full CRUD local.  
**Analytics:** `keep_note_create`, `keep_pin`.

---

## F09 Calendar — **capabilities without full calendar**

**Include:** Agenda list · next-up on Home · create/edit event sheet · day strip · reminder → notif · Google Calendar sync **status** + pull upcoming.  
**Exclude:** Month grid OS · week multi-column · drag-resize · complex recurrence UI (simple repeat only or desktop).  
**UX copy:** “Upcoming” not “Calendar OS”.  
**Analytics:** `agenda_view`, `event_create`.

---

## F11 Career — **resumes only**

**Purpose:** Grab saved resume on the go.  
**UX:** Vault → Resumes → list → preview → Download / Share system sheet.  
**Exclude:** Placements kanban, application CRM, interview boards.  
**API:** list resume files from existing storage; signed download URLs.  
**Analytics:** `resume_download`.

---

## F23 Family — **PRIORITY**

**Purpose:** Life admin docs on the device you carry.  
**UX:** Vault → Family → Documents first; members; emergency contacts; insurance/health as simple rows.  
**Upload/download/view**; sensitive fields reveal-with-biometric optional.  
**Exclude:** Desktop multi-tab family finance cockpit on phone.  
**Permissions:** storage/photo picker for upload.  
**Security:** encrypt at rest server; local cache limited; FLAG_SECURE on viewer optional.  
**Analytics:** `family_doc_open`, `family_doc_upload`.  
**Offline:** metadata + recently opened docs cached.

---

## F24 Google Drive — **usable link**

**Purpose:** Connect Drive so Notes/Vault aren’t dead ends.  
**UX (Vault → Drive):**

1. Connect Google (Custom Tab / OAuth) — clear connected account  
2. Pick folder(s) to watch / import  
3. Sync status: last success, errors, Retry  
4. File list → Import to Keep note **or** Family doc  
5. Disconnect  

**Not buried** under Account → Integrations → …  
**API:** existing Drive watch + mobile-friendly status endpoints.  
**Edge:** token expiry → reconnect CTA.  
**Analytics:** `drive_connect`, `drive_import`.

---

## F02 Habits / F03 Goals / F06 Score / F07 Focus / F08 Discipline / F10 Money

Unchanged intent; **entry via Home strip or More** — not competing primary tabs.

---

## F12 Study / F13 Sports

**Demoted** — optional later under More; not roadmap P1.

---

## F14 Quick Add + AI

`+` → habit, log, Keep note, journal voice, expense, urge, event.  
AI route confirms chips.

---

## F15–F22

Auth, onboarding, account, gamification lite, search, paywall, notifications, widgets — as prior; search indexes Keep notes + journal + vault docs + resumes.

---

## Component additions (logic)

| Component | Role |
|-----------|------|
| VoiceRecordBar | Journal/mic micro-log |
| Waveform | Recording feedback |
| KeepNoteCard | Grid card |
| KeepColorRow | Brand-safe colors |
| AgendaPeek | Home next events |
| VaultDocRow | Family docs |
| DriveStatusBanner | Always-visible Drive health |
| ResumeCard | Download/share |
| MicPermissionCard | Soft permission education |

Motion: keep expand shared-element; voice pulse; doc open fade — [[07_MOTION]].

---

*Sync [[02_USER_JOURNEYS]] · [[05_NATIVE_UX]] · [[20_ROADMAP]]*
