---
Purpose: Mandatory audit — does every major page have its own personality, or the same layout with different data?
Confidence: 0.88
Evidence Sources: Page files + dedicated CSS; native screens; nav registry; brand/waitlist; craft notes
Files Used: Overview.jsx; Journal + journalStudio.css; Notes + notesStudio.css; Finance.jsx; Family.jsx; Discipline + CSS; FocusRoom.jsx; Calendar; Settings; Account; Brand.jsx; WaitlistLanding; Lab; Reports; native Home/Journal/Notes/Vault/More/Settings/Auth/Focus/Discipline/Goals; /m styles
Reasoning: Page identity is the difference between a Life OS and a multi-route dashboard template.
Dependencies: 01, 06, 07
Consumers: Product design, page redesign prioritization (opportunity only)
Known Unknowns: Live interactive feel per page not screenshot-verified this pass; Sports/Placements sampled lighter
Last Updated: 2026-07-22
Pass: 4/6
---

# 08 — Page Identity

## Scoring key

| Score | Meaning |
|-------|---------|
| 5 | Unmistakable AIIMIN layout ritual |
| 4 | Clear studio / brand personality |
| 3 | Some unique cues on shared chassis |
| 2 | Shared chassis + mild accenting |
| 1 | Generic template |

## Web Life OS

| Page | Route | Personality | Score | Evidence |
|------|-------|-------------|-------|----------|
| **Brand** | `/brand` | Always-light Human Momentum manifesto, ember atmosphere | **5** | brandPage.css; Bodoni/Familjen |
| **Waitlist** | landing | Dot-grid, Arch lockup, Figtree/Familjen, orange CTA | **5** | waitlistLanding.css |
| **Notes** | `/notes` | Full-bleed studio, masthead toolbar, breakout margins | **4** | notesStudio.css |
| **Journal** | `/journal` | Accent radial header, pill chips, prose editor | **4** | journalStudio.css |
| **Focus** | `/focus` | Cinematic glow, mode colors, large timer ritual | **4** | FocusRoom.jsx |
| **Today / Overview** | `/overview` | Command grid + rail + logger; simplified widgets | **3** | Overview + todayCapture |
| **Discipline** | `/discipline` | Toolkit grids; urge overlay distinctive | **3** | disciplineStudio urge |
| **Login / Auth** | `/login` | Mixed serif/sans; dark identity moments | **3** | Login.jsx |
| **Reports** | `/reports` | Report chrome; print skins stronger in prototypes | **3** | reports + prototypes |
| **Lab** | `/lab` | Tool gallery; accent tiles; risk of playground look | **2–3** | LabFullPage |
| **Finance** | `/finance` | Shared chassis + metric components | **2** | little page CSS |
| **Habits / Goals** | `/habits` `/goals` | Task/OS patterns | **2** | shared patterns |
| **Calendar** | `/calendar` | Glass toolbars, day cells | **2** | CalendarToolbar |
| **Family** | `/family` | Heavy inline cards; orphan family.css unused | **2** | Family.jsx |
| **Settings** | `/settings` | Stacked section cards; purple section accent | **1–2** | Settings.jsx |
| **Account** | `/account` | Sidebar sections; Design Lab archive | **2** | account/* |
| **Career / Sports** | `/placements` `/sports` | Domain content on shared chassis | **2** | sampled |
| **Insights** | `/insights` | Read surface intent; chrome varies | **2–3** | Insights.jsx |
| **Mobile `/m`** | `/m` | Capture-only shell; locked colors | **3** | mobileCapture.css — identity via constraint |

## Native Android

| Screen | Personality | Score | Evidence |
|--------|-------------|-------|----------|
| Auth / Welcome | Gradient hero, overlapping sheet, mark | **5** | AuthScreen, WelcomeGate |
| Home | LIFE SCORE arc, habit pills, AiiminCard | **4** | HomeScreen |
| Notes | Keep 2-col tinted cards, orange FAB | **4** | NotesScreen |
| Journal | Mode chips, mic, waveform | **3–4** | JournalScreen |
| More | Feature tile hub | **3** | MoreScreen |
| Discipline | Streak + toolkit | **3** | DisciplineUrgeScreen |
| Focus | Big timer, presets | **2–3** | FocusTimerScreen — utilitarian |
| Vault | Segmented lists | **2** | VaultScreen |
| Goals | Read-only cards + progress | **1–2** | GoalsLiteScreen |
| Settings | Stock sections + switches | **1–2** | SettingsScreen |

## Cross-cutting finding

**Studios and brand surfaces have personality. Utility routes share a chassis.**

If logo removed:

- Brand / Waitlist / Notes / Journal / Focus / Native Auth-Home → still AIIMIN-ish  
- Settings / Family / Finance / Goals → could be any dark app  

## Board challenge

- **Editorial Designer:** Family deserves vault-like trust visual language (calm, archival) — currently looks like another card dashboard.
- **Principal Product Designer:** Do not force fake personality with random illustrations. Prefer **one structural cue** per route (rail, measure, hero ritual, keep grid).
- **Creative Director:** Focus cinematic is a peak — protect rarity.

## Mandatory answer

Every page does **not** have its own personality. A minority do. The majority feel like **the same layout with different data** — the central visual risk of AIIMIN today.
