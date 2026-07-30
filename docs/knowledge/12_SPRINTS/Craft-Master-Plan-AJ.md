# AIIMIN Craft Master Plan (Tracks A–J)

> **Single source of truth** for this craft program.  
> Local ≠ shipped. Shipped only after Adi asks commit + push.  
> **Completion protocol:** every “done” claim needs (1) `VERIFIED:` line, (2) pasted command output, (3) screenshot refs at acceptance widths, (4) touched / not-touched files.

**Last updated:** 2026-07-15

Related: [[Craft-Program-Master-Status]] · [[Craft-Status-Report-2026-07-15]] · [[15_MEMORY/Current-Context]]

---

## Skills gate

- impeccable: PRODUCT.md + DESIGN.md (locked palette)
- design-taste / frontend-design for product UI (not landing)
- caveman chat; vault prose clear
- verification-before-completion + this protocol supersede soft “done”

---

## Tracks map

| Track | Name | Goal |
|-------|------|------|
| **A** | Discipline | Engine UI restored + urge improve (no gut rewrite) |
| **B** | Journal | Capture / speech / drawer craft |
| **C** | Notes | Source-grounded + OCR + Drive folder watch |
| **D** | Device / iPad | Phone `/m` capture only; tablet + desktop full OS |
| **E** | Goals | Pipeline **Achieved** matches WON count |
| **F** | Celebration | Full-screen desktop / framed card tablet / compact phone |
| **G** | Nav Priority+ | Width overflow `More (N)`; Reports pinnable; Cmd+K nav |
| **H** | Onboarding | Life-mode required before Today (no silent Custom) |
| **I** | Light tokens | Warm ivory bg + charcoal body; **dark untouched** |
| **J** | Today capture | **J0 = A** — Universal Logger only (tiles gone) |

---

## Execute order (locked)

```
1. G0 → G1 → G2
2. H0 → H1            (parallel with G OK)
3. I0 → I1            (after G/H layout)
4. J0 decided (=A) → finish J1 protocol evidence
5. Harden A–F / device / Notes 043 under same protocol
6. Build verify
7. Commit / push ONLY if Adi asks
```

---

## Status legend

- `CODE` — implemented locally  
- `PROTOCOL` — verified with build paste + screenshots this session  
- `SHIPPED` — commit+push requested and done  
- `BLOCKED` — needs Adi / external (migration approve, device QA, screenshots)

### Live status (2026-07-15)

| Track | CODE | PROTOCOL | SHIPPED | Notes |
|-------|------|----------|---------|-------|
| A Discipline | yes | no | no | Urge 15m + extend + API |
| B Journal | yes | no | no | Drawer tier |
| C Notes+OCR+Drive | yes | no | no | **`043` applied** Supabase; need API deploy + Google reconnect |
| D Device `/m` | yes | no | no | DeviceGate |
| E Goals Achieved | yes | no | no | Pipeline includes Achieved |
| F Celebration | yes | no | no | CSS tiers |
| G Nav | yes | partial | no | More(N)+Reports+Cmd+K; need signed-in shots |
| H Onboarding | yes | no | no | Life-mode step coded |
| I Light tokens | yes | partial | no | `#EDE4D3` contrast 14.26:1 |
| J Capture A | yes | no | no | Logger only; missing proto CSS restored |

Full narrative: [[Craft-Status-Report-2026-07-15]]

---

## Track acceptance (detail)

### A — Discipline

- Keep rich Engine UI (not stripped slab)
- Urge: 15m timer, early exit, extend, API sync
- Softer slip copy; crisis link stays
- Reject: recovery XP / AI therapist / full Module rewrite

### B — Journal

- Capture + speech polish; drawer ≤1099 OK
- No second linking system beyond AnchorEdge plan

### C — Notes

- OCR path: `pdf-parse/lib/pdf-parse.js` (not broken index)
- Drive watch routes **before** `/:id`
- Schema: `server/migrations/043_note_drive_watches.sql`
- Soft-block until Adi applies `043` + reconnect Google with `drive.readonly` + API deploy

### D — Device

- Phone → `/m` capture only (`DeviceGate`)
- iPad/tablet stays full OS (incl. Split View)
- `?forceDesktop=1` escape hatch
- No analytics/tools on `/m`

### E — Goals

- Pipeline view shows Achieved column when WON > 0
- Grid excludes achieved; Archive = achieved only

### F — Celebration

- ≥1100 full viewport; 768–1099 framed card; &lt;768 compact card

### G — Nav Priority+

- Pins free-order 1–12; overflow by **width measure** into `More (N)` (overflow = pin tail + unpinned actives)
- Reports in `NAV_REGISTRY` (pinnable)
- Cmd+K: every primary section + Reports + Sports + Account + Settings
- Reject: sidebar; forced IA pin groups; wipe existing pins

### H — Onboarding

- Explicit life-mode pick (Student / Professional / Founder / Family / Athlete / Custom)
- Custom must be clicked — never silent default landing
- Applies `applyPersonaPreset` before `/overview`
- Existing accounts: **no** retroactive pin rewrite

### I — Light tokens

- Canvas `#EDE4D3`; body `#14171A`; cards `#FFFFFF`
- Contrast paste ≥4.5:1 for body (body: **14.26:1** measured)
- Update `Palette.md`; do **not** edit dark `:root` / dark theme blocks

### J — Today capture

- **J0 = A** locked
- Universal Logger only on Today hero; Quick Capture tiles deprecated (shim re-export)
- Widget migrate drops `quick_capture`, forces `logger`

---

## Rejects (locked)

- No sidebar nav  
- No forced pin taxonomy  
- No dark-token edits in Track I  
- No retroactive pin wipe for existing accounts (H)  
- No clinical/recovery XP / AI therapist  
- No native handwriting / PDF annotation canvas  

---

## Protocol breakpoints (screenshots)

| Surface | Widths |
|---------|--------|
| Nav Priority+ | ~500, ~800, ~1100, ~1440 |
| Onboarding life-mode | ~500, ~800 |
| Light theme Today | ~1100 (before/after if possible) |
| Universal Logger | ~500, ~800, ~1100 |
| Celebration | phone / tablet / desktop |
| Device `/m` | phone UA or &lt;768 |

---

## File anchors

| Area | Path |
|------|------|
| Master status (audit) | `docs/knowledge/12_SPRINTS/Craft-Program-Master-Status.md` |
| Nav registry / presets | `frontend/src/constants/navItems.js` |
| Masthead | `frontend/src/components/Navbar.jsx` |
| Cmd+K | `frontend/src/components/system/CommandPalette.jsx` |
| Onboarding | `frontend/src/pages/Onboarding.jsx` |
| Light tokens | `frontend/src/styles/tokens.css`, `docs/knowledge/08_DESIGN/Palette.md` |
| Logger | `frontend/src/components/dashboard/UniversalLogger.jsx` |
| Device | `frontend/src/components/device/DeviceGate.jsx`, `useDeviceTier.js` |
| Notes Drive | `server/routes/notes.js`, `server/migrations/043_note_drive_watches.sql` |
| Goals | `frontend/src/pages/Goals.jsx` |
| Celebration | `TierUpgradeCelebration.jsx` + css |
| Discipline | `frontend/src/pages/Discipline.jsx` |

---

## Soft-blocked on Adi

1. Signed-in visual QA / protocol shots (Priority+, life-mode, logger, light theme, device)
2. Explicit **commit + push** (and EC2 if API) when ready to ship  
3. Reconnect Google (Drive scope) **after** API with `drive.readonly` is live  
