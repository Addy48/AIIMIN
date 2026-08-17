---
authority: operations
derived_from: Roadmap/Program-V1-Obsidian-Knowledge-OS/08_Founder_Workspace
status: active
owner: founder
lifecycle: living
last_reviewed: 2026-07-26
can_override_genesis: false
program: Program-V1-Obsidian-Knowledge-OS
artifact: workspace-ux
implementation: none
genesis_touch: forbidden
version: 1.0
---

# Workspace UX — Obsidian Interface Design

**How the Founder moves through the vault inside Obsidian itself — chrome, layout, input, device.**

| Field | Value |
|-------|-------|
| Date | 2026-07-26 |
| Mode | **Design only — no `.obsidian` edits applied** |
| Parents | [[08_Founder_Workspace]] · [[05_Vault_Automation_Layer_Spec]] · [[11_Visual_Knowledge_Maps]] · [[09_AI_Workspace]] |
| Scope | Startup · sidebars · bookmarks/favorites · tabs · workspaces · hotkeys · desktop/mobile · search/capture/review UX |
| Not this doc | Job catalog / domain lanes depth → [[08]]; Canvas map catalog → [[11]]; Dataview widgets → [[04]] |
| Vault path | `docs/knowledge/` |

---

## 0. Mission

Obsidian should feel like a **cockpit**, not a file browser.

**Success tests:**

1. Cold open → productive note in **≤2 clicks** ([[08]])  
2. Warm session → any routine surface in **≤1** hotkey or bookmark  
3. Sidebar noise never outranks Context  
4. Mobile = capture + read Context only — not architecture drafting  

---

## 1. UX principles

| ID | Principle | Consequence |
|----|-----------|-------------|
| UX1 | **Context is home base** | Main pane defaults to Current-Context |
| UX2 | **Chrome serves navigation** | Sidebars for structure/links; not for inventing SoT |
| UX3 | **Bookmarks ≤10** | Same pin cap as Founder Workspace |
| UX4 | **Workspaces = modes** | Swap layout for Ops / Law / Build / Hygiene — not 20 custom layouts |
| UX5 | **Hotkeys beat hunting** | Every daily action has a key |
| UX6 | **Tabs are temporary** | Close or pin; no 30-tab graveyard |
| UX7 | **Desktop ≠ mobile** | Full cockpit vs capture slab |
| UX8 | **Search ladder** | Pins → bookmarks → search → graph → folders |
| UX9 | **Capture is one chord** | QuickAdd / template; never blank note in random folder |
| UX10 | **Review has a layout** | Dedicated workspace or tab set — not ad-hoc sprawl |

---

## 2. Startup

### 2.1 App open sequence

```text
1. Obsidian opens vault docs/knowledge/
2. Load workspace layout: "Founder" (default)
3. Main editor: Current-Context.md focused
4. Right split: Executive Dashboard (or Daily Ops if Ops mode last saved)
5. Left sidebar: collapsed OR Bookmarks visible (not Files sprawled)
6. Right sidebar: Backlinks tab selected
7. Founder reads Context (0-click) → optional Executive skim (1-click / already visible)
```

### 2.2 First-run (once)

| Step | Action |
|------|--------|
| 1 | Create/save workspace `Founder` |
| 2 | Set Bookmarks group `Core` (≤10) |
| 3 | Bind hotkey map (§8) |
| 4 | Daily Notes template pointed (Automation) |
| 5 | Default page / startup: open Context (via workspace, not random last file) |

### 2.3 Startup checklist (Founder habit)

- [ ] Context date sane  
- [ ] Next #1 matches intent  
- [ ] Do not still true  
- [ ] Touch nonempty or consciously empty  
- [ ] No mystery tabs from yesterday (close or park)  

### 2.4 “Wrong startup” recovery

| Symptom | Fix |
|---------|-----|
| Opened deep Genesis file | Close → Bookmark Context; don’t edit |
| 15 tabs from last session | Workspace `Founder` reload; close extras |
| Files sidebar full height | Collapse; use Bookmarks |
| Lost Active Program | Context link / bookmark `Active` |

---

## 3. Left sidebar

### 3.1 Preferred stack (top → bottom)

| Order | View | Default state | Role |
|------:|------|---------------|------|
| 1 | **Bookmarks** | Expanded | Primary nav (Core ≤10) |
| 2 | **Files** | Collapsed | Rare deep browse |
| 3 | **Search** | Collapsed | Prefer hotkey Omnisearch/core |
| 4 | **Tags** | Hidden or collapsed | Useless until taxonomy; hex noise risk |

### 3.2 Files pane rules

| Do | Don’t |
|----|-------|
| Expand only when placing a new note | Leave `Genesis/` as standing scroll |
| Use fold to show `Maps of Content`, `Roadmap`, `09_FEATURES` | Browse Archive as SoT |
| Reveal in Finder/OS rarely | Drag files into Genesis |

**Filter / exclude (if plugin or core allows):** prefer not showing `_templates` clutter in daily browse — templates via command palette.

### 3.3 Bookmarks pane = left-rail SoT for motion

Left sidebar’s job is **Bookmarks**, not the whole tree. Files is escape hatch.

### 3.4 Left sidebar on mode switch

| Workspace mode | Left sidebar |
|----------------|--------------|
| Founder (default) | Bookmarks |
| Law | Bookmarks + maybe Files folded to Genesis MOC path only |
| Hygiene | Bookmarks; Files optional for orphan paths |
| Mobile | Sidebar minimal / hidden |

---

## 4. Right sidebar

### 4.1 Preferred tabs

| Tab | When | Use |
|-----|------|-----|
| **Backlinks** | Default | Who links here; verify parent/inbound |
| **Outgoing links** | Link edit sessions | Spot missing Parent / broken |
| **Outline** | Long notes (Home, Feature MOC, specs) | Jump headings |
| **Tags** | Rare | After MD tag taxonomy |
| **Local graph** | After link edits | Depth per [[03]] / [[07]] note class |

### 4.2 Right sidebar rituals

| Ritual | Tabs |
|--------|------|
| Orient on Context | Outline (Today/Next/Do not) |
| Edit Feature MOC | Outline + Backlinks |
| Finish link edit | Local graph → confirm Parent |
| Review ADR | Outgoing links + Backlinks |

### 4.3 What right sidebar is not

- Not a second file browser  
- Not Dataview (dashboards live in editor panes)  
- Not chat with agents (Cursor is separate)  

---

## 5. Bookmarks

### 5.1 Groups

| Group | Max items | Contents |
|-------|----------:|----------|
| **Core** | 10 | Context · Home · Executive · Daily Ops · KG · Genesis MOC · Workspace Index · Active Program · Visual-Maps-Index · (one flex: Eng MOC **or** Product MOC) |
| **Modes** | 6 | Ops · Law · Ship UX · Build · Decide · Hygiene (links to mode entry notes/dashboards) |
| **Active** | 5 | Current Touch targets (rotate weekly) |
| **Rare** | 5 | Deploy · Palette · Proof-or-Stop · Monorepo · GES/Health |

**Hard cap:** Core ≤10. If adding, remove one.

### 5.2 Bookmark hygiene

| Cadence | Action |
|---------|--------|
| Daily | Active group matches Context Touch |
| Weekly | Prune Active; verify Core still ≤10 |
| Monthly | Modes still match [[08]] mode table |

### 5.3 Bookmarks vs favorites vs starred

Obsidian “star” / favorites conflate — **this design uses Bookmarks as the system**.

| Mechanism | Policy |
|-----------|--------|
| **Bookmarks** | Canonical Founder nav |
| **Starred** | Avoid duplicate system; if used, star = same as Core only |
| **Pinned tabs** | Temporary session pins — not permanent nav (see §7) |

---

## 6. Favorites / starred (policy)

| Rule | Detail |
|------|--------|
| Prefer Bookmarks over Stars | One system |
| If Stars already used | Migrate mental model to Bookmarks; don’t maintain both lists |
| Mobile favorites | Mirror Core subset only (Context · Home · Inbox · Capture) |

---

## 7. Tabs

### 7.1 Tab philosophy

Tabs = **working set**, not archive.

| State | Max | Rule |
|-------|----:|------|
| Pinned tabs | ≤4 | Context + Executive/Daily Ops + deep work + optional map/dashboard |
| Unpinned tabs | ≤6 | Close when done |
| Total open | ≤10 | Beyond = reload workspace `Founder` |

### 7.2 Pin policy

| Pin? | Note |
|------|------|
| Yes | Current-Context |
| Yes | Executive **or** Daily Ops (one) |
| Optional | Active Program INDEX / Touch SoT |
| No | Random Feature changelogs, Genesis deep files, Archive |

### 7.3 Tab behaviors

| Action | Habit |
|--------|-------|
| Open from Bookmark | Prefer reuse tab if already open |
| Open from search | Unpinned; close after |
| Split view | Main = Context or SoT; side = glance/dashboard |
| Linked pane | Optional for ADR ↔ Feature |

### 7.4 Anti-patterns

- Leaving Genesis leaf pinned “for later”  
- Duplicate tabs of same note  
- Tabs as todo list (use Context Touch / Tasks)  

---

## 8. Workspaces

### 8.1 Named workspaces (canonical)

| Workspace ID | Name | Layout intent |
|--------------|------|---------------|
| WS-FOUNDER | `Founder` | Default cockpit — Context + Executive/Daily Ops |
| WS-OPS | `Ops` | Context + Daily Ops + Tasks focus |
| WS-LAW | `Law` | Genesis MOC main + Expression hub side; right = Outline |
| WS-BUILD | `Build` | Feature/Eng SoT main + Eng Dashboard or Monorepo side |
| WS-SHIP | `Ship UX` | UX Dashboard / Publication + Feature MOC |
| WS-DECIDE | `Decide` | Decisions Dashboard + ADR draft |
| WS-HYGIENE | `Hygiene` | Risk Dashboard + Graph leaf (GV-ORPHAN instructions) |
| WS-MAP | `Maps` | Visual-Maps-Index + Canvas (when exists) |

**Default on app start:** `Founder` only.

### 8.2 Workspace switch budget

Mode change = **1 action** (command palette “Load workspace X” or hotkey cycle).

Do not create per-feature workspaces.

### 8.3 What workspaces save

- Pane splits  
- Open notes (keep minimal)  
- Sidebar collapsed states  

What they do **not** replace: Current-Context content.

---

## 9. Hotkeys

Logical bindings — exact chords chosen at impl to avoid OS conflicts. Prefer Chord consistency: **leader = unused modifier combo**.

### 9.1 Navigation hotkeys

| Action | Intent ID |
|--------|-----------|
| Open Current-Context | `nav.context` |
| Open Home | `nav.home` |
| Open Executive | `nav.executive` |
| Open Daily Ops | `nav.dailyops` |
| Open Knowledge-Graph MOC | `nav.kg` |
| Open Genesis MOC | `nav.envelope` |
| Open Workspace Index | `nav.wsindex` |
| Open Visual-Maps-Index | `nav.maps` |
| Load workspace Founder | `ws.founder` |
| Load workspace Ops / Law / Build / Hygiene | `ws.ops` … |

### 9.2 Capture & search

| Action | Intent ID |
|--------|-----------|
| QuickAdd palette | `cap.palette` |
| QuickAdd bug | `cap.bug` |
| QuickAdd ADR | `cap.adr` |
| QuickAdd touch append | `cap.touch` |
| QuickAdd inbox | `cap.inbox` |
| Search (Omnisearch or core) | `find.search` |
| Open command palette | `find.command` (core) |

### 9.3 Graph & review

| Action | Intent ID |
|--------|-----------|
| Open graph view | `graph.global` |
| Toggle local graph in right sidebar | `graph.local` |
| Toggle left sidebar | `chrome.left` |
| Toggle right sidebar | `chrome.right` |
| Daily note (if used) | `cap.daily` |

### 9.4 Hotkey rules

1. Document chords in `16_DOCUMENTATION` or Founder MOC when bound.  
2. Don’t bind destructive mass-edit.  
3. Mobile: rely on toolbar / bookmarks — hotkeys secondary.  

---

## 10. Desktop workflow

### 10.1 Canonical desktop day

```text
Open Obsidian (WS-FOUNDER)
  → Read Context (main)
  → Skim Executive (split)
  → Hotkey capture flush
  → Open Touch SoT (tab or replace split)
  → Deep work (right sidebar: Outline/Backlinks)
  → Midday: Daily Ops or Risk (bookmark)
  → Closeout: edit Context; close unpinned tabs
  → Quit or leave WS-FOUNDER clean
```

### 10.2 Desktop pane grammar

| Split | Purpose |
|-------|---------|
| 60/40 Context | Executive | Orient |
| 50/50 SoT | Dashboard | Build while glancing |
| 50/50 SoT | ADR | Decide with evidence |
| Single pane | Focus writing | Hide sidebars optional |

### 10.3 Desktop + Cursor

| Obsidian | Cursor |
|----------|--------|
| Context / vault SoT | Implements code |
| Update Context before agent kickoff | Agents boot Home→Context |
| Do not use Obsidian as IDE | Do not use Cursor chat as Context SoT |

### 10.4 Multi-monitor (optional)

| Screen | Content |
|--------|---------|
| Primary | Obsidian Founder cockpit |
| Secondary | Cursor / browser / Canvas map |

---

## 11. Mobile workflow

### 11.1 Mobile role

**Capture + read Context.** Not full KOS redesign, not frozen-pack editing, not mega dashboards.

### 11.2 Mobile startup

```text
Open vault
  → Bookmark: Context
  → Read Today / Next / Do not
  → Capture via QuickAdd inbox or voice→inbox (if available)
  → Stop
```

### 11.3 Mobile bookmarks (subset)

| Bookmark | Why |
|----------|-----|
| Context | Focus |
| Home | Blockers skim |
| Inbox | Process later on desktop |
| Capture (QuickAdd) | One-chord note |

Max **4** mobile favorites.

### 11.4 Mobile forbidden

| Don’t | Why |
|-------|-----|
| Edit Genesis / UXA | Law/frozen |
| Redesign Canvas | Desktop spatial |
| Long Feature MOC rewrites | Error-prone |
| Rely on Dataview-heavy dashboards | Performance / focus |

### 11.5 Mobile → desktop handoff

Inbox notes processed within **24h** on desktop ([[08]] capture doctrine). Context Touch updated on desktop, not phone, unless trivial append.

---

## 12. Search workflow

### 12.1 Search ladder (UX order)

```text
1. Is it in Core bookmarks? → open
2. Is it in Active bookmarks / Context Touch? → open
3. Hotkey search (Omnisearch/core) → type name
4. Command palette → "Open…" recent
5. Dashboard table (sets: bugs, ADRs)
6. KG / Visual map
7. Files sidebar path fold
8. Graph GV-* (spatial)
```

### 12.2 Search UX settings (design targets)

| Setting | Target |
|---------|--------|
| Omnisearch exclude | `Archive`, `99_ARCHIVE`, `_templates` |
| Core search | Same mental excludes |
| Results open | Unpinned tab |
| Known colliding stems | Prefer path in query / path-qualified links in notes |

### 12.3 Search jobs

| Job | Method |
|-----|--------|
| “Where’s Context?” | Bookmark / `nav.context` |
| “Open Calendar Feature” | Search `Calendar` → Feature MOC path |
| “All open bugs” | Risk Dashboard not search |
| “P9 entry” | Genesis MOC bookmark |

---

## 13. Capture workflow

### 13.1 Desktop capture UX

```text
Hotkey cap.palette
  → choose qa-* 
  → land in correct folder with FM + Parent stub
  → type
  → save
  → optional: add to Context Touch (qa-touch)
```

### 13.2 Capture surfaces

| Surface | Role |
|---------|------|
| QuickAdd | Primary |
| Templates insert | Fallback |
| Daily note | Optional journal — not Product SoT |
| Inbox folder | ≤24h staging |
| New note in Files | **Discouraged** |

### 13.3 Capture UX rules

1. Never create notes under `Genesis/` or frozen packs.  
2. After capture, glance right sidebar Outgoing links for Parent.  
3. If wrong folder — move same session.  

### 13.4 Mobile capture UX

QuickAdd inbox only → desktop process.

---

## 14. Review workflow

### 14.1 Review types → workspace

| Review | Workspace | Tabs/panes |
|--------|-----------|------------|
| Daily closeout | WS-FOUNDER | Context main; optional Daily Ops |
| Weekly ops | WS-OPS or Founder | Roadmap Dashboard · Risk · Decisions → write Context |
| Monthly strategic | WS-FOUNDER + Modes bookmarks | Lane tour via bookmarks; end at Context / Priorities |
| Decision review | WS-DECIDE | Decisions Dashboard + ADR |
| Vault hygiene | WS-HYGIENE | Risk + instructions for GV-ORPHAN |
| Program gate | WS-FOUNDER | Program INDEX + Context |
| Map review | WS-MAP | Visual-Maps-Index + Canvas |

### 14.2 Review UX ritual

```text
1. Load review workspace (1 hotkey/command)
2. Open entry surface (already in layout or 1 bookmark)
3. ≤2 clicks to evidence SoT
4. Write outcomes into Context (or ADR) — not into dashboard
5. Close unpinned tabs
6. Return to WS-FOUNDER
```

### 14.3 Review anti-patterns

- Reviewing inside 12 random tabs  
- Editing frozen packs during “architecture review”  
- Leaving Hygiene workspace as default startup  

---

## 15. Chrome density & appearance (light touch)

| Choice | Guidance |
|--------|----------|
| Theme | Prefer readable; not part of product palette lock — vault chrome separate from app UI |
| Readable line length | Comfortable for Context / specs |
| Stack tabs | Optional if many tabs; still enforce tab caps |
| Ribbon | Keep Graph, Daily Note, Command; hide unused |

---

## 16. Mapping to Founder Workspace

| [[08]] concept | This UX realization |
|----------------|---------------------|
| Pins ≤10 | Bookmarks Core |
| Startup Founder layout | Workspace `Founder` |
| Modes | Workspaces + Modes bookmark group |
| Capture palette | Hotkeys `cap.*` |
| Search ladder | §12 |
| Click budgets | Enforced by chrome design |

---

## 17. Implementation sketch (not authorized)

| Phase | Work |
|-------|------|
| U0 | Save WS-FOUNDER; Bookmarks Core; Context on startup |
| U1 | Bind nav + capture hotkeys; document chords |
| U2 | Create WS-OPS / LAW / BUILD / HYGIENE / DECIDE |
| U3 | Omnisearch excludes; QuickAdd wired |
| U4 | Mobile bookmark subset |
| U5 | WS-MAP when Visual Maps V1 lands |

Do not commit noisy `.obsidian/workspace.json` churn without Founder intent — local UX may stay machine-local.

---

## 18. Risks

| Risk | Mitigation |
|------|------------|
| Bookmark sprawl | Cap 10 Core; weekly prune |
| Workspace explosion | Canonical list only |
| Mobile overreach | Forbidden list §11.4 |
| Startup opens last chaos | Force WS-FOUNDER |
| Hotkey conflicts | Document; adjust per OS |
| `.obsidian` git fights | Prefer local / careful sync policy |

---

## 19. Explicit non-actions (this deliverable)

- No edits to `docs/knowledge/.obsidian/*`  
- No hotkeys bound  
- No bookmarks created  
- No workspace JSON written  
- No Genesis / frozen edits  
- No commits  

---

## 20. Authority statement

Workspace UX is **operations chrome**. It cannot override Genesis, frozen packs, or Current-Context as SoT. Convenience layouts never authorize law edits.

---

## 21. Closeout

| Item | Status |
|------|--------|
| Obsidian Workspace UX design | **COMPLETE** (design) |
| Implementation | **NONE** |
| `.obsidian` config | **UNCHANGED** |
| Genesis / frozen | **UNTOUCHED** |

**Next (Founder):** Accept / amend → authorize **U0** (WS-FOUNDER + Core bookmarks + Context startup).

---

**Stop.**
