# 05 — Native Mobile UX (revised)

> **Status:** Revised 2026-07-19 · Journal/Notes/Vault-first  
> Skills: mobile-app-ui-design · android-ux · compose

---

## 1. Product feel

Calm precision + warm momentum.  
Journal = intimate fullscreen. Notes = playful Keep cards. Vault = trustworthy list. Home = glance.

---

## 2. Navigation

| Tab | Pattern |
|-----|---------|
| Home | Scroll ritual; no nested chrome |
| Journal | Feed + compose; mic always reachable |
| Notes | Keep grid; long-press pin/color |
| Vault | Segmented Family / Drive / Resumes |
| More | Settings-style rows + tool shortcuts |

Bottom bar: 5 items icon+label. No hamburger.

---

## 3. Journal UX (voice + type first)

1. Land on compose or feed with big **Write** / **Speak**.  
2. Type: IME up, comfortable line height, autosave drafts.  
3. Voice: `VoiceRecordBar` sticky bottom — tap record, waveform, stop → transcript into editor.  
4. Never force mode picker before first word.  
5. Permission denied → banner “Type instead” + Settings link.

---

## 4. Notes UX (Keep-style)

- Masonry/2-col cards; pinned section on top  
- Color = subtle left edge or fill tint (palette-locked chips)  
- Checklist toggle inside card  
- Empty: one CTA “First quick note”  
- Avoid rich-text toolbars on phone; bold/list minimum if needed  

---

## 5. Vault UX

- DriveStatusBanner always on Drive segment  
- Family Documents = default Family landing  
- Doc tap → viewer; share/download  
- Resumes = clean cards, Download primary  
- Biometric to reveal sensitive docs optional  

---

## 6. Calendar UX (lite)

- Home: AgendaPeek 1–3 rows  
- Full screen: Agenda + horizontal day chips — **not** month heatmap  
- Create = sheet (title, time, type)  
- “More on desktop” for complex recurrence  

---

## 7. Gestures

| Gesture | Where | Action |
|---------|-------|--------|
| Swipe back | stacks | pop |
| Long-press | Keep card | pin / color / delete |
| Swipe | Journal row | archive |
| Pull | feeds | refresh |
| Hold | mic | record (optional alternate) |

---

## 8. FAB / +

Single shell `+` → Quick Add (note, journal voice, log, expense, urge, event).  
Not five FABs.

---

## 9. Search

Recent notes + journal + vault doc titles + resumes; never blank.

---

## 10. Platform

Android predictive back · edge-to-edge · 48dp · iOS detents for Keep compose sheet.

---

## 11. Kill list

Month calendar OS · placements board · desktop notes editor · Tools junk drawer as primary · burying Drive under Account.

---

*See [[06_DESIGN_SYSTEM]] · [[07_MOTION]]*
