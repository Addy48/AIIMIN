# 03 — Information Architecture

> **Depends:** [[01_PRD]] [[00_FEATURE_SELECTION]]  
> **Status:** Revised 2026-07-19 — Journal/Notes/Vault-first nav  
> **Law:** No large-device layouts. Sheets + lists + Keep grid.

---

## 1. Mental model

```
HOME (ritual)   JOURNAL (voice+type)   NOTES (Keep)   VAULT (family·drive·résumés)   MORE (rest)
```

Global: `+` Quick Add · Search · Offline banner · Paywall · AI sheet

---

## 2. Full hierarchy

```
AppRoot
├── Splash / AuthStack / Onboarding (unchanged pattern)
└── MainTabShell
    ├── HomeTab
    │   ├── HomeRoot
    │   │   ├── ScoreHero + streak
    │   │   ├── HabitTickStrip (one-hand)
    │   │   ├── AgendaPeek (next 1–3 events) → CalendarAgenda
    │   │   ├── MicroLog CTA
    │   │   └── WeekPulse
    │   ├── HabitQuickManage {sheet}
    │   └── DayComplete {modal}
    │
    ├── JournalTab                    ← FIRST-CLASS
    │   ├── JournalFeed
    │   ├── JournalCompose            ← default: keyboard + VoiceRecordBar
    │   │   ├── Type mode (fullscreen)
    │   │   ├── Voice mode (hold/tap record → transcript → edit)
    │   │   └── Mode chips (Today, Free, CBT… secondary)
    │   ├── JournalEntryDetail
    │   └── JournalAI {sheet} (gated)
    │
    ├── NotesTab                      ← KEEP-STYLE
    │   ├── KeepGrid (2-col cards, color, pin, labels)
    │   ├── KeepList (density toggle)
    │   ├── QuickNoteCompose {sheet or fullscreen lite}
    │   │   ├── Title + body (plain / checklist)
    │   │   ├── Color chip · Pin · Reminder lite
    │   │   └── Attach image (optional)
    │   ├── NoteDetail (card expand shared-element)
    │   └── SearchNotes
    │
    ├── VaultTab                      ← PRIORITY
    │   ├── VaultHub (segments: Family | Drive | Resumes)
    │   ├── Family
    │   │   ├── FamilyHome
    │   │   ├── MembersLite
    │   │   ├── DocumentsList (priority)
    │   │   ├── DocumentViewer / Download
    │   │   ├── DocumentUpload {sheet}
    │   │   ├── EmergencyContacts
    │   │   └── Insurance/Health lite rows (list, not desktop tables)
    │   ├── Drive
    │   │   ├── DriveConnect
    │   │   ├── FolderPicker
    │   │   ├── SyncStatus + last sync
    │   │   ├── DriveFileList
    │   │   └── ImportToNotes / ImportToVault
    │   └── Resumes
    │       ├── ResumeList (saved)
    │       ├── ResumePreview
    │       └── Download / Share (system sheet)  ← NO placements kanban
    │
    └── MoreTab
        ├── MoreGrid
        ├── Goals (list + check-in)
        ├── HabitsManage (CRUD)
        ├── Focus (setup / running / summary)
        ├── Discipline (urge + toolkit)
        ├── CalendarAgenda (+ Day strip, EventCreate sheet)
        │   └── NOT MonthGrid / WeekGrid
        ├── Money (pulse + QuickAdd)
        ├── Account / Theme / Subscription / Devices / Data / Legal
        └── OpenDesktopCTA
```

### Dropped from IA

Career pipeline · Study primary · Sports primary · Track tab · Tools mega-grid · Calendar month/week · Notes rich desktop editor as default.

---

## 3. Navigation rules

1. Exactly **5** tabs; Journal & Notes & Vault are peer priorities.  
2. Calendar reachable: Home peek → Agenda · More → Calendar. Never pretend full calendar OS.  
3. Long write = Journal fullscreen; quick thought = Notes Keep sheet.  
4. Vault documents use list + viewer — no multi-column family desktop.  
5. Resumes = download/share only.  
6. Drive always shows connection state on Vault hub (not buried 4 levels deep).  
7. Tab reselect pops to that tab’s root.  
8. Predictive back everywhere.

---

## 4. Deep links

| Link | Screen |
|------|--------|
| `/app/home` | HomeRoot |
| `/app/journal` · `/app/journal/new` · `?voice=1` | Journal |
| `/app/notes` · `/app/notes/new` | Keep |
| `/app/vault` · `/app/vault/family` · `/app/vault/drive` · `/app/vault/resumes` | Vault |
| `/app/calendar` | Agenda only |
| `/app/focus` · `/app/discipline/urge` · `/app/money/add` | More stacks |
| `/app/you` | Account |

---

## 5. Home information order

1. Score + streak  
2. Habit ticks  
3. Next events (AgendaPeek)  
4. “Continue journal” / empty voice CTA if no entry today  
5. Week pulse  

---

## 6. Notes model (Keep)

| Field | Mobile |
|-------|--------|
| color | 8 brand-safe chips |
| pinned | bool |
| checklist | optional items |
| labels | few chips |
| body | short text first; “Open on desktop” if huge |

---

## 7. New / emphasized components

`VoiceRecordBar` · `Waveform` · `KeepNoteCard` · `KeepColorRow` · `AgendaPeek` · `VaultDocRow` · `DriveStatusBanner` · `ResumeCard` · `MicPermissionCard`

---

*Next: [[04_APP_FLOW]] · [[05_NATIVE_UX]] · [[08_FEATURES]]*
