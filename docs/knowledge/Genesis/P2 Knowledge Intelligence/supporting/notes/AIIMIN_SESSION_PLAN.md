# AIIMIN — Session-Based Agent Execution Plan
## Same plan, split into small Cursor-sized sessions. One session = one chat.

> Owner: Aaditya Upadhyay
> Version: 3.0 — SESSION-SPLIT
> Created: June 30, 2026
> Launch Target: Late August / Early September 2026
> Status: ACTIVE — This file supersedes all previous versions.

---

## WHY THIS VERSION EXISTS

The original plan was one giant file. A Cursor agent reading the whole thing,
plus your whole codebase, plus writing code, burns through context fast and
the chat gets long, slow, and expensive. This version splits the same plan
into 34 small SESSIONS. Each session is sized to comfortably fit in
one fresh Cursor chat without the agent choking on context.

**Rule: one session = one new Cursor chat. Never run two sessions in the same chat.**

---

## AGENT PROTOCOL — PASTE THIS AT THE START OF EVERY NEW CURSOR CHAT

```
Read AIIMIN_SESSION_PLAN.md.
Find my CURRENT SESSION using the SESSION INDEX table and the
"NEXT SESSION TO RUN" line in the AGENT NOTES section at the bottom of the file.
Open that session's tasks. Do ONLY that session. Do not look ahead at later sessions.
When done, run the BUILD CHECK commands for this session.
If build passes, fill in the SESSION END SUMMARY block and tell me to update
AGENT NOTES before I close this chat.
If build fails, do NOT mark the session done. Fix the build first, re-run BUILD CHECK,
and only then summarize.
```

### Status Markers
- [ ] = Not started
- [~] = In progress, agent ran out of room mid-session. Resume note is below the task.
- [x] = Complete and verified (build passed)
- [!] = Blocked — reason written inline

### Hard Rules
1. One session per chat. Always start a fresh Cursor chat for the next session.
2. Never skip the BUILD CHECK at the end of a session. A session is not done until the app builds and runs.
3. If a session breaks the build and you cannot fix it within the same session, mark it [!] BLOCKED, write what broke, and stop. Next chat starts by fixing that, not by moving on.
4. After every session, update the AGENT NOTES block at the bottom of this file (last session done, build status, next session number). This is what lets the next chat know where things stand without re-reading everything.
5. Sessions inside the same phase must run in order (Part 1 before Part 2). Sessions across different phases listed as "parallel-safe" in the index can run in any order once their prerequisites are done.

---

## BUILD CHECK — RUN THIS AFTER EVERY SINGLE SESSION

Run these in order. Do not skip any. This is the standard check, referenced
by number in every session below.

```
# 1. Lint / syntax check (frontend)
cd frontend && npm run lint 2>&1 | tail -40

# 2. Frontend build
cd frontend && npm run build 2>&1 | tail -60

# 3. Backend syntax check (just boot it and kill it)
cd server && timeout 12 node index.js 2>&1 | tail -40
# (or your actual entry file — app.js / server.js, whichever boots the API)

# 4. Quick smoke check (only if dev server already running)
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:3001/api/health

# 5. Git status sanity check — make sure nothing unexpected got touched
git status --short
```

If 1-3 fail: STOP. Fix before doing anything else, including before starting
a new session. A red build blocks all future sessions, full stop.

If 1-3 pass: mark every task in this session [x], fill SESSION END SUMMARY,
move to next session in a new chat.

---

## SESSION INDEX

| # | Phase | Part | Title | Build Check | Status |
|---|---|---|---|---|---|
| 1 | P0 | 1/2 | CRITICAL FIXES | Standard | PARTIAL — Clerk domains manual |
| 2 | P0 | 2/2 | CRITICAL FIXES | Standard | DONE |
| 3 | TYP | 1/3 | TYPOGRAPHY AND DESIGN SYSTEM HARDENING | Standard | DONE |
| 4 | TYP | 2/3 | TYPOGRAPHY AND DESIGN SYSTEM HARDENING | Standard | DONE |
| 5 | TYP | 3/3 | TYPOGRAPHY AND DESIGN SYSTEM HARDENING | Standard | DONE |
| 6 | UX | 1/5 | GLOBAL UX POLISH AND MICRO-INTERACTIONS | Standard | DONE |
| 7 | UX | 2/5 | GLOBAL UX POLISH AND MICRO-INTERACTIONS | Standard | DONE |
| 8 | UX | 3/5 | GLOBAL UX POLISH AND MICRO-INTERACTIONS | Standard | DONE |
| 9 | UX | 4/5 | GLOBAL UX POLISH AND MICRO-INTERACTIONS | Standard | DONE |
| 10 | UX | 5/5 | GLOBAL UX POLISH AND MICRO-INTERACTIONS | Standard | DONE |
| 11 | ACC | 1/2 | ACCOUNT PAGE COMPLETE OVERHAUL | Standard | DONE |
| 12 | ACC | 2/2 | ACCOUNT PAGE COMPLETE OVERHAUL | Standard | DONE |
| 13 | PW | 1/2 | WAITLIST LANDING PAGE | Standard | DONE |
| 14 | PW | 2/2 | WAITLIST LANDING PAGE | Standard | PARTIAL — prod Lighthouse manual |
| 15 | PERF | 1/2 | PERFORMANCE HARDENING | Standard | DONE |
| 16 | PERF | 2/2 | PERFORMANCE HARDENING | Standard | DONE |
| 17 | SEC | 1/2 | SECURITY HARDENING | Standard | DONE |
| 18 | SEC | 2/2 | SECURITY HARDENING | Standard | PARTIAL — RLS audit ongoing |
| 19 | P1 | 1/1 | DISCIPLINE FRONTEND MIGRATION | Standard | DONE |
| 20 | P2 | 1/1 | JOURNAL OVERHAUL | Standard | DONE |
| 21 | P3 | 1/1 | INTERCONNECTED CORE | Standard | DONE |
| 22 | P4 | 1/1 | SPORTS FULL BUILD | Standard | DONE |
| 23 | P5 | 1/1 | GROWTH ENGINE VISUAL OVERHAUL | Standard | DONE |
| 24 | P6 | 1/1 | FINANCE UPGRADES | Standard | DONE |
| 25 | P7 | 1/1 | FAMILY VAULT COMPLETION | Standard | DONE |
| 26 | P8 | 1/1 | LAB INTELLIGENCE UPGRADES | Standard | DONE |
| 27 | P9 | 1/1 | OVERVIEW: MISSION CONTROL | Standard | DONE |
| 28 | P10 | 1/1 | LEGAL PAGES | Standard | DONE |
| 29 | P11 | 1/1 | SUBSCRIPTIONS AND BILLING | Standard | DONE |
| 30 | ENG | 1/2 | RE-ENGAGEMENT AND EMAIL FLOWS | Standard | DONE |
| 31 | ENG | 2/2 | RE-ENGAGEMENT AND EMAIL FLOWS | Standard | DONE |
| 32 | AW | 1/1 | AWS MIGRATION | Standard | PARTIAL — SES SMTP wired; S3/CloudFront manual |
| 33 | MOB | 1/2 | MOBILE STRATEGY | Standard | DONE |
| 34 | MOB | 2/2 | MOBILE STRATEGY | Standard | PARTIAL — launch checklist manual |

---

## SESSION ORDER

Run strictly in this order for Sessions 1 through (P0 + TYP + UX + ACC + PW + PERF + SEC end).
After that block, feature phase sessions (P1 through P11, ENG, AW, MOB) can be done in any
order EXCEPT: P1 before P2 before P3, P11 only after SEC sessions all pass, ENG only after
AW SES setup session and P11 sessions pass. Launch Checklist is always last, no exceptions.



## SESSION 1 — PHASE P0 — Part 1 of 2: CRITICAL FIXES

### START-OF-SESSION CHECK
- [ ] Confirm previous session's BUILD CHECK passed (see AGENT NOTES at bottom).
- [ ] If previous session is marked [!] BLOCKED, fix that first. Do not start this session on a broken build.

### TASKS

### Do this first. Nothing else starts until P0 is 100% complete.
### Estimated Time: 3.5 hours

---

### P0-01 — Fix Clerk Auth in Production
- [ ] Log in to dashboard.clerk.com
- [ ] Navigate to: Your App > Settings > Domains
- [ ] Add https://aiimin.in to allowed origins
- [ ] Add https://www.aiimin.in to allowed origins
- [ ] Navigate to Allowed Redirect URLs
- [ ] Add https://aiimin.in/overview
- [ ] Add https://aiimin.in/login
- [ ] Trigger a Vercel redeploy (push an empty commit or use Redeploy button in Vercel dashboard)
- [ ] Open https://aiimin.in in incognito — loading spinner must be gone
- [ ] Verify Google OAuth login works end-to-end on production

VERIFICATION: Production loads without spinner. Clerk returns 200, not 403. Browser console shows zero Clerk errors.

---

### P0-02 — Self-Host All Fonts
- [ ] Download Inter (woff2 only): weights 300, 400, 500, 600, 700
- [ ] Download JetBrains Mono (woff2 only): weights 400, 500, 600
- [ ] Download Outfit (woff2 only): weights 400, 500, 600, 700, 800
- [ ] Place all files in frontend/public/fonts/ (create folder if not exists)
- [ ] Open frontend/src/styles/tokens.css
- [ ] Remove all @import url('https://fonts.googleapis.com/...') lines
- [ ] Add @font-face blocks for each weight pointing to /fonts/filename.woff2
- [ ] Add font-display: swap to every single @font-face block
- [ ] Open frontend/index.html
- [ ] Add preload link for Inter 400 and 500 (only these two — critical weights):
      <link rel="preload" as="font" type="font/woff2" crossorigin href="/fonts/inter-400.woff2">
- [ ] Open vercel.json and add Cache-Control header for /fonts/*: public, max-age=31536000, immutable
- [ ] Run npm run build locally, verify network tab shows fonts from localhost, not google.com
- [ ] Deploy to Vercel, verify on production

VERIFICATION: Chrome network tab on production shows fonts from aiimin.in/fonts/. Zero requests to fonts.googleapis.com or fonts.gstatic.com. Lighthouse "Ensure text remains visible" check passes.

---

### P0-03 — Fix Clerk SyntaxError (Version Mismatch)
- [ ] In frontend/package.json, find the current @clerk/clerk-react version
- [ ] Run: npm info @clerk/clerk-react dist-tags to get latest stable version
- [ ] Pin to latest stable: npm install @clerk/clerk-react@X.X.X --save-exact
- [ ] Delete node_modules and package-lock.json, run npm install fresh
- [ ] Run npm run build, verify zero Clerk-related errors in build output
- [ ] Deploy to Vercel, verify clerk.browser.js SyntaxError is gone in production console

---

### P0-04 — Fix Border Contrast Tokens
- [ ] Open frontend/src/styles/tokens.css
- [ ] Change --color-border value to #252836
- [ ] Change --color-border-lit (hover border token) to #323650
- [ ] Change --color-text-3 (tertiary text) to #6B6B7B
- [ ] Run app locally, visually inspect all pages for border visibility
- [ ] Every card must be visually distinct from the page background behind it

VERIFICATION: Chrome Lighthouse Accessibility audit. Border contrast passes WCAG AA.

### END-OF-SESSION — RUN BUILD CHECK NOW
Run the standard BUILD CHECK block (top of file). Do not proceed until it passes.

### SESSION END SUMMARY (fill in, then paste into AGENT NOTES at bottom of file)
```
SESSION 1 (P0 — Part 1 of 2): [DONE / BLOCKED]
Build check result: [PASS / FAIL — paste error if FAIL]
Files changed: [list]
Resume note (only if BLOCKED or partially done): [what's left]
NEXT SESSION TO RUN: 2
```

---

## SESSION 2 — PHASE P0 — Part 2 of 2: CRITICAL FIXES

### START-OF-SESSION CHECK
- [ ] Confirm previous session's BUILD CHECK passed (see AGENT NOTES at bottom).
- [ ] If previous session is marked [!] BLOCKED, fix that first. Do not start this session on a broken build.

### TASKS

### P0-05 — Add ARIA Labels to All Icon-Only Buttons
- [ ] Search for icon-only buttons without aria-label:
      grep -rn "<button" frontend/src/ --include="*.jsx" | grep -v "aria-label"
- [ ] Add aria-label to every result that has no text child and no aria-label
- [ ] Priority files: Navbar.jsx, Sidebar.jsx, Overview.jsx, any Card components

VERIFICATION: Lighthouse Accessibility — zero "Buttons do not have an accessible name" failures.

---

### END-OF-SESSION — RUN BUILD CHECK NOW
Run the standard BUILD CHECK block (top of file). Do not proceed until it passes.

### SESSION END SUMMARY (fill in, then paste into AGENT NOTES at bottom of file)
```
SESSION 2 (P0 — Part 2 of 2): [DONE / BLOCKED]
Build check result: [PASS / FAIL — paste error if FAIL]
Files changed: [list]
Resume note (only if BLOCKED or partially done): [what's left]
NEXT SESSION TO RUN: 3
```

---

## SESSION 3 — PHASE TYP — Part 1 of 3: TYPOGRAPHY AND DESIGN SYSTEM HARDENING

### START-OF-SESSION CHECK
- [ ] Confirm previous session's BUILD CHECK passed (see AGENT NOTES at bottom).
- [ ] If previous session is marked [!] BLOCKED, fix that first. Do not start this session on a broken build.

### TASKS

### Prerequisite: P0 complete.
### Research basis: researchbased.md Part 4 (sections 4.1, 4.2, 4.3, 4.4)
### Run in parallel with UX. Both touch tokens.css — one agent at a time on that file.
### Estimated Time: 6 hours

---

### TYP-01 — Enforce Four-Level Surface System
The current codebase uses 1-2 surface colors. This creates flat, AI-generated-looking cards.
Implement the full layered surface system from researchbased.md 4.4.

- [ ] Open frontend/src/styles/tokens.css
- [ ] Add or update these exact CSS variables:
      --color-base:      #0A0C10  (global page background)
      --color-surface-1: #0E1016  (sidebar background)
      --color-surface-2: #111318  (card background)
      --color-surface-3: #161920  (elevated modal, dropdown)
      --color-surface-4: #1A1E2E  (hover state, active state, skeleton loaders)
- [ ] Add text hierarchy variables:
      --color-text-1: #EDEDED   (primary — 15:1 contrast on base)
      --color-text-2: #A1A1AA   (secondary — 7:1 contrast)
      --color-text-3: #6B6B7B   (tertiary, captions — 4.6:1 contrast)
- [ ] Search for hardcoded hex values from old palette:
      grep -rn "#1E2230\|#0A0A0C\|#808080\|#FFFFFF" frontend/src/ --include="*.jsx" --include="*.css"
- [ ] Replace every hardcoded color with the appropriate CSS variable
- [ ] Update sidebar background to --color-surface-1
- [ ] Update all card backgrounds to --color-surface-2
- [ ] Update modal and dropdown backgrounds to --color-surface-3
- [ ] Update all hover states to --color-surface-4

VERIFICATION: Navigate every page. Every card is visually distinct from page background. No card floats without a visible boundary. Zero raw #808080 or #FFFFFF in CSS files.

---

### TYP-02 — Fix Typography Scale (Font Hierarchy Collapse)
Current scale has insufficient visual differentiation between levels.

- [ ] In tokens.css, enforce this exact scale (add utility classes):
      h1 / .text-h1: Outfit 800, 28px — page titles only
      h2 / .text-h2: Outfit 700, 20px — section titles within pages
      h3 / .text-h3: Outfit 600, 16px — card titles, widget headers
      h4 / .text-h4: Inter 600, 14px — widget labels, small headings
      .text-body:    Inter 400, 15px
      .text-sm:      Inter 400, 13px
      .text-caption: Inter 400, 12px, color #6B6B7B
      .text-label:   Inter 500, 11px, uppercase, letter-spacing 0.08em
- [ ] Search for inline font-size styles in JSX and replace with utility classes:
      grep -rn "fontSize:" frontend/src/ --include="*.jsx" | head -40
- [ ] Apply text-h1 to all page-level headings (e.g., the "Habits" title at top of Habits page)

---

### TYP-03 — Tabular Figures on All Numeric Displays
All numbers in AIIMIN must use tabular figures so digits align in tables and lists.

- [ ] Add to global CSS:
      .tabular-nums { font-variant-numeric: tabular-nums; }
- [ ] Apply to: streak count, Life Score, Safe-to-Spend widget, transaction amounts, lab scores, pomodoro timers, all Recharts axis labels
- [ ] Inter needs this explicitly. JetBrains Mono has it by default.

### END-OF-SESSION — RUN BUILD CHECK NOW
Run the standard BUILD CHECK block (top of file). Do not proceed until it passes.

### SESSION END SUMMARY (fill in, then paste into AGENT NOTES at bottom of file)
```
SESSION 3 (TYP — Part 1 of 3): [DONE / BLOCKED]
Build check result: [PASS / FAIL — paste error if FAIL]
Files changed: [list]
Resume note (only if BLOCKED or partially done): [what's left]
NEXT SESSION TO RUN: 4
```

---

## SESSION 4 — PHASE TYP — Part 2 of 3: TYPOGRAPHY AND DESIGN SYSTEM HARDENING

### START-OF-SESSION CHECK
- [ ] Confirm previous session's BUILD CHECK passed (see AGENT NOTES at bottom).
- [ ] If previous session is marked [!] BLOCKED, fix that first. Do not start this session on a broken build.

### TASKS

### TYP-04 — Add Fluid Typography with clamp()
Fixed pixel sizes break at unusual viewport widths.

- [ ] In tokens.css add:
      --text-page-title: clamp(20px, 2.5vw, 28px)
      --text-stat-number: clamp(24px, 3.5vw, 40px)
      --text-hero: clamp(32px, 5vw, 52px)
- [ ] Apply --text-page-title to all page-level headings
- [ ] Apply --text-stat-number to: streak count, Life Score, Safe-to-Spend main number, lab scores
- [ ] Apply --text-hero to landing page headline only

---

### TYP-05 — Noise Texture on Cards (Anti-AI-Slop)
Pure flat dark cards look dull. This eliminates the "AI slop" appearance.
Reference: Craft, Bear, Linear all use subtle noise texture.

- [ ] Generate a base64-encoded SVG noise pattern (use noiseandtexture.com — 200x200, low frequency)
- [ ] Add to global CSS at 3% opacity (barely visible, but present):
      .card, [class*="card"] {
        background-image: url("data:image/svg+xml,...");
        background-size: 200px;
      }
- [ ] Do NOT apply to text inputs, textareas, or code blocks

---

### TYP-06 — Frosted Glass Modals
All modals get backdrop-filter blur.

- [ ] Find all modal components:
      grep -rn "modal\|Modal\|dialog" frontend/src/ --include="*.jsx" -l
- [ ] Add to each modal's overlay CSS:
      background: rgba(10, 12, 16, 0.8);
      backdrop-filter: blur(12px);
      -webkit-backdrop-filter: blur(12px);
- [ ] Modal card itself:
      background: rgba(17, 19, 24, 0.95);
      border: 1px solid rgba(37, 99, 235, 0.2);
- [ ] Test on Safari — webkit prefix is required for iOS support

---

### TYP-07 — Ambient Glow on Key Numbers
Key numbers (Life Score, streak, Safe-to-Spend) must feel important, not just typed.

- [ ] Add CSS class:
      .score-highlight {
        text-shadow: 0 0 20px rgba(37, 99, 235, 0.4);
        font-family: 'JetBrains Mono', monospace;
      }
- [ ] Apply to: Life Score ring center number, discipline streak count, Safe-to-Spend main number

---

### TYP-08 — Gradient Borders on Active Cards
Active goal cards, live sports match cards, current streak card.

- [ ] Add CSS class .card-active with a ::before pseudo-element gradient border:
      Linear gradient 135deg from #2563EB to #10B981
      mask-composite: exclude technique (full CSS in researchbased.md 2.3 Effect 2)
- [ ] Apply to: current streak card, active goal card, live sports match card

---

### TYP-09 — Shimmer Progress Bars
All progress bars get a moving shimmer animation.

- [ ] Add @keyframes shimmer + .progress-bar-fill class to global CSS
      (Full CSS in researchbased.md 2.3 Effect 6)
- [ ] Apply to: goal progress bars, budget category bars, discipline streak bar, lab skill progress, profile completion bar

---

### TYP-10 — text-wrap: balance on Headlines
Prevents typographic widows (single words on last line) on landing page.

- [ ] Add to global CSS: h1, .headline, .hero-headline { text-wrap: balance; }

---

### TYP-11 — Line Height for Reading Areas
- [ ] Add to global CSS: .prose-area, .journal-content, .note-content { line-height: 1.7; }
- [ ] Apply .prose-area class to: Journal entry display, CBT fields, notes view

### END-OF-SESSION — RUN BUILD CHECK NOW
Run the standard BUILD CHECK block (top of file). Do not proceed until it passes.

### SESSION END SUMMARY (fill in, then paste into AGENT NOTES at bottom of file)
```
SESSION 4 (TYP — Part 2 of 3): [DONE / BLOCKED]
Build check result: [PASS / FAIL — paste error if FAIL]
Files changed: [list]
Resume note (only if BLOCKED or partially done): [what's left]
NEXT SESSION TO RUN: 5
```

---

## SESSION 5 — PHASE TYP — Part 3 of 3: TYPOGRAPHY AND DESIGN SYSTEM HARDENING

### START-OF-SESSION CHECK
- [ ] Confirm previous session's BUILD CHECK passed (see AGENT NOTES at bottom).
- [ ] If previous session is marked [!] BLOCKED, fix that first. Do not start this session on a broken build.

### TASKS

### TYP-12 — Anti-AI-Slop Copy Rules (Search and Replace)
Run these greps. Replace every instance found. Context-dependent replacements listed.

- [ ] "Get Started" > replace with specific action ("Start your streak", "Add your first habit", "Begin session")
- [ ] "No data available" > "Nothing here yet." + specific action button
- [ ] "Please wait..." > "Loading [specific content name, e.g., 'your habits']"
- [ ] "An error occurred" > "Something went wrong. Try again >"
- [ ] "Congratulations!" > use actual data: "14 days. Keep going." or equivalent
- [ ] "Your request was successfully processed" > "Done."
- [ ] "Learn More" > replace with what specifically the user learns
- [ ] All emoji feature icons in feature lists (rocket, lightning bolt, etc.) > remove or replace with custom SVG

VERIFICATION: grep for "Get Started", "No data available", "Please wait", "Congratulations" across all JSX. Zero results.

---

### TYP-13 — AI Voice Rules in All AI System Messages
- [ ] Find all files calling Groq or Gemini in server/services/ and server/routes/
- [ ] Add this block to every AI system message:
      "Voice rules: Be direct and specific. Never use: optimize, leverage, synergy, transform, journey, empower. Never passive voice. Use you and your. State specific numbers. Speak like a smart friend."
- [ ] For discipline AI: add "Research shows self-compassion doubles re-engagement speed (Neff & Germer, 2012). Be compassionate but honest. State the streak number. Never say 'don't give up'."
- [ ] For habit AI: add "Never say '21 days to form a habit'. Research shows the actual range is 18 to 254 days, average 66 days (Lally et al., UCL, 2010)."

---

### TYP-14 — Dark Mode Quality Final Check
After all TYP tasks complete, run this verification pass:

- [ ] Verify: no element uses pure #000000 background anywhere
- [ ] Verify: no #808080 text anywhere (fails contrast)
- [ ] Verify: all four surface levels are actually being used (base, surface-1, surface-2, surface-3)
- [ ] Verify: cards sit on surface-2, modals on surface-3, sidebar on surface-1

---

### END-OF-SESSION — RUN BUILD CHECK NOW
Run the standard BUILD CHECK block (top of file). Do not proceed until it passes.

### SESSION END SUMMARY (fill in, then paste into AGENT NOTES at bottom of file)
```
SESSION 5 (TYP — Part 3 of 3): [DONE / BLOCKED]
Build check result: [PASS / FAIL — paste error if FAIL]
Files changed: [list]
Resume note (only if BLOCKED or partially done): [what's left]
NEXT SESSION TO RUN: 6
```

---

## SESSION 6 — PHASE UX — Part 1 of 5: GLOBAL UX POLISH AND MICRO-INTERACTIONS

### START-OF-SESSION CHECK
- [ ] Confirm previous session's BUILD CHECK passed (see AGENT NOTES at bottom).
- [ ] If previous session is marked [!] BLOCKED, fix that first. Do not start this session on a broken build.

### TASKS

### Prerequisite: P0 and TYP complete.
### Research basis: researchbased.md Part 2 (2.1, 2.2, 2.3, 2.4) and Part 5
### Estimated Time: 18-22 hours
### Complete this before any feature phase (P1-P11). These elements touch everything.

---

### UX-01 — Global Page Transition System
Confirmed working pattern for React Router v6 + Framer Motion (from internet research).

- [ ] Create frontend/src/components/layout/PageWrapper.jsx:
      motion.div with initial: {opacity:0, y:8}, animate: {opacity:1, y:0}, exit: {opacity:0, y:-8}
      transition: {duration: 0.2, ease: 'easeOut'}
      position: absolute, width: 100%
- [ ] In App.jsx: import useLocation from react-router-dom, AnimatePresence from framer-motion
- [ ] Get location: const location = useLocation()
- [ ] Wrap Routes with AnimatePresence mode="wait":
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          ...routes...
        </Routes>
      </AnimatePresence>
- [ ] Wrap each page's root element with PageWrapper (or add as HOC in Route elements)
- [ ] CRITICAL: only the content area animates. Sidebar and navbar must NOT animate.
- [ ] Test: navigate between 3 pages. No overlap. Duration exactly 200ms.

---

### UX-02 — Button Press Tactile Feedback
Research: Shneiderman's 8 Golden Rules (1987, 2016) — tactile feedback increases perceived responsiveness.

- [ ] Add to global CSS:
      button.btn-primary, button.btn-action { transition: transform 75ms ease, filter 75ms ease; }
      button.btn-primary:active, button.btn-action:active { transform: scale(0.97); filter: brightness(0.9); }
- [ ] Apply Tailwind equivalent to all primary action buttons:
      active:scale-[0.97] active:brightness-90 transition-all duration-75
- [ ] Affected buttons: Complete Habit, Start Session, Save Journal, Submit Form, Log Urge, Start Streak, Add Habit, Add Goal, Log Transaction
- [ ] Do NOT apply scale to icon-only buttons (makes small touch targets worse)

---

### UX-03 — Form Field Micro-Confirmation
- [ ] Create frontend/src/hooks/useFieldSave.js with states: idle, saving, saved, error
- [ ] On 'saved': border transitions to #2563EB for 600ms then back to default
- [ ] Apply to: inline habit name edit, inline goal title edit, Account profile fields
- [ ] Show "Saved." text (green, 12px, 2 seconds) next to the field — no toast needed

---

### UX-04 — Number Counting Animations
Research: animated numbers increase perceived liveness.

- [ ] Install: npm install react-countup
- [ ] Create frontend/src/components/ui/AnimatedNumber.jsx wrapping CountUp
      Props: value, duration=0.4, suffix='', prefix=''
      Use preserveValue=true so it animates from previous value, not from 0
- [ ] Apply to: discipline streak count, Life Score ring total, Safe-to-Spend widget number, Overview stats, lab scores, finance monthly totals

### END-OF-SESSION — RUN BUILD CHECK NOW
Run the standard BUILD CHECK block (top of file). Do not proceed until it passes.

### SESSION END SUMMARY (fill in, then paste into AGENT NOTES at bottom of file)
```
SESSION 6 (UX — Part 1 of 5): [DONE / BLOCKED]
Build check result: [PASS / FAIL — paste error if FAIL]
Files changed: [list]
Resume note (only if BLOCKED or partially done): [what's left]
NEXT SESSION TO RUN: 7
```

---

## SESSION 7 — PHASE UX — Part 2 of 5: GLOBAL UX POLISH AND MICRO-INTERACTIONS

### START-OF-SESSION CHECK
- [ ] Confirm previous session's BUILD CHECK passed (see AGENT NOTES at bottom).
- [ ] If previous session is marked [!] BLOCKED, fix that first. Do not start this session on a broken build.

### TASKS

### UX-05 — Empty State Designs for All Pages
Research: empty states are the first impression for new users.

- [ ] Create frontend/src/components/ui/EmptyState.jsx
      Props: illustration (SVG element), message (string), subtext (string), actionLabel, onAction
- [ ] Design rule: monochromatic SVG illustrations, 80x80px, geometric only, no cartoon characters
- [ ] Implement for every page:
  - [ ] Habits: "Great things start small. Add your first habit." / "Add a habit"
  - [ ] Goals: "What are you working toward?" / "Add a goal"
  - [ ] Journal: "Write here. No one's reading. Just write." / "Start writing"
  - [ ] Finance: "Your financial picture starts here." / "Log a transaction"
  - [ ] Sports: "Choose your teams. We'll build your feed." / "Set up my sports"
  - [ ] Discipline: "Your streak starts today." / "Mark day one"
  - [ ] Lab: "Pick a module and train your mind." / "Start a session"
- [ ] Rule: only show empty state AFTER data has confirmed empty (not during loading)

---

### UX-06 — Skeleton Loaders on All Pages
Research: skeleton loaders dramatically improve perceived performance vs spinners.

- [ ] Add @keyframes skeleton-shimmer to global CSS:
      shimmer from left to right, background gradient #1A1E2E to #252836 and back
- [ ] Create: SkeletonCard.jsx (card-sized), SkeletonRow.jsx (list row), SkeletonChart.jsx (5 bars)
- [ ] Apply SkeletonCard x3 to loading state of: Habits, Goals, Journal entries list
- [ ] Apply SkeletonRow x5 to: Finance transactions list, Lab session history, Discipline logs
- [ ] Apply SkeletonChart to: Finance bar charts, Lab WPM trend chart, Habit completion chart
- [ ] Rule: NEVER show a full-page spinner on any content-bearing page. Always use skeletons.

VERIFICATION: Chrome DevTools Slow 3G throttle. Every page shows skeleton immediately before data arrives.

---

### UX-07 — Card Entrance Stagger on Page Load
Research: staggered entrance makes pages feel less like they loaded all at once.

- [ ] Create frontend/src/constants/animations.js with listVariants and cardVariants
      staggerChildren: 0.04 (40ms per card), card animation: opacity 0>1, y 12>0, duration 0.2s
- [ ] Apply stagger to list containers, individual cards get cardVariants
- [ ] Rule: Maximum 6 cards staggered. Cards 7+ use initial="visible" immediately.
- [ ] Apply to: Habits list, Goals list, Finance transactions (latest 6), Lab module grid

---

### UX-08 — Scroll-Triggered Reveals
- [ ] Use Framer Motion whileInView prop on Life Score rings and Growth Engine nodes
      initial: {opacity:0, scale:0.95}, whileInView: {opacity:1, scale:1}
      viewport: {once:true, margin:'-50px'}, transition: {duration:0.5}
- [ ] For Growth Engine nodes: add index-based delay (node 0 = 0s, node 1 = 0.1s, etc.)

### END-OF-SESSION — RUN BUILD CHECK NOW
Run the standard BUILD CHECK block (top of file). Do not proceed until it passes.

### SESSION END SUMMARY (fill in, then paste into AGENT NOTES at bottom of file)
```
SESSION 7 (UX — Part 2 of 5): [DONE / BLOCKED]
Build check result: [PASS / FAIL — paste error if FAIL]
Files changed: [list]
Resume note (only if BLOCKED or partially done): [what's left]
NEXT SESSION TO RUN: 8
```

---

## SESSION 8 — PHASE UX — Part 3 of 5: GLOBAL UX POLISH AND MICRO-INTERACTIONS

### START-OF-SESSION CHECK
- [ ] Confirm previous session's BUILD CHECK passed (see AGENT NOTES at bottom).
- [ ] If previous session is marked [!] BLOCKED, fix that first. Do not start this session on a broken build.

### TASKS

### UX-09 — Global prefers-reduced-motion Rule
HIGH priority from Part 5 list. Research: 1 in 4 users has a motion sensitivity.

- [ ] Add at very top of frontend/src/styles/index.css:
      @media (prefers-reduced-motion: reduce) {
        *, *::before, *::after {
          animation-duration: 0.01ms !important;
          animation-iteration-count: 1 !important;
          transition-duration: 0.01ms !important;
          scroll-behavior: auto !important;
        }
      }
- [ ] In Framer Motion components: use useReducedMotion() hook and pass empty variants if true
- [ ] Apply useReducedMotion check to: PageWrapper, Life Score rings, Growth Engine nodes, card stagger

---

### UX-10 — Focus Ring Visibility (Keyboard Navigation)
HIGH priority from Part 5. Dark themes break default browser focus rings.

- [ ] Add to frontend/src/styles/index.css:
      *:focus-visible { outline: 2px solid #2563EB; outline-offset: 3px; border-radius: 4px; }
      *:focus:not(:focus-visible) { outline: none; }
- [ ] Test with keyboard Tab navigation on every page
- [ ] Test with mouse click — no ring should appear on mouse click

---

### UX-11 — Color-Blind Accessible Charts
Research: 8% of males have deuteranopia (red-green color blindness).

- [ ] Find all Recharts components:
      grep -rn "BarChart\|LineChart\|PieChart\|RadarChart" frontend/src/ --include="*.jsx" -l
- [ ] For every multi-series chart: add direct value labels (Recharts LabelList) AND change color pairs:
      Positive/complete: #2563EB (blue)
      Negative/missed: #F59E0B (amber)
      Neutral: #6B6B7B (gray)
      Never use red/green pairs as the only differentiator

---

### UX-12 — Screen Reader Live Announcements
HIGH priority from Part 5. Dynamic changes must be announced to screen readers.

- [ ] Create frontend/src/components/ui/LiveRegion.jsx
      role="status", aria-live="polite", aria-atomic="true", visually hidden via sr-only styles
- [ ] Integrate into App-level context and trigger announcements for:
      Habit complete: "Habit [name] marked complete."
      Journal saved: "Journal entry saved."
      Transaction logged: "Transaction logged."
      Focus session started: "Focus session started."
      Urge logged: "Urge logged successfully."

---

### UX-13 — First-Time Feature Discovery Tips
- [ ] Add seen_tips: TEXT[] DEFAULT ARRAY[]::TEXT[] to user_profiles migration
- [ ] Create frontend/src/components/ui/FeatureTip.jsx (dismissable callout, shows once)
- [ ] On dismiss: PATCH /api/account/seen-tips with the tip ID
- [ ] One tip per page (page ID matches tip ID):
      habits_tip, goals_tip, journal_tip, discipline_tip, finance_tip, lab_tip, sports_tip
- [ ] Never show a tip already in user_profiles.seen_tips

### END-OF-SESSION — RUN BUILD CHECK NOW
Run the standard BUILD CHECK block (top of file). Do not proceed until it passes.

### SESSION END SUMMARY (fill in, then paste into AGENT NOTES at bottom of file)
```
SESSION 8 (UX — Part 3 of 5): [DONE / BLOCKED]
Build check result: [PASS / FAIL — paste error if FAIL]
Files changed: [list]
Resume note (only if BLOCKED or partially done): [what's left]
NEXT SESSION TO RUN: 9
```

---

## SESSION 9 — PHASE UX — Part 4 of 5: GLOBAL UX POLISH AND MICRO-INTERACTIONS

### START-OF-SESSION CHECK
- [ ] Confirm previous session's BUILD CHECK passed (see AGENT NOTES at bottom).
- [ ] If previous session is marked [!] BLOCKED, fix that first. Do not start this session on a broken build.

### TASKS

### UX-14 — Day 1 Post-Onboarding Experience
Research: 3 actions on day 1 increases 30-day retention 2-5x (Amplitude/Mixpanel analytics).

- [ ] In Overview.jsx: check if user created_at is today AND no habit completions AND no journal entries
- [ ] If true: show Day 1 Card with 3 specific tasks and checkboxes
      "Mark a habit complete today" / "Write 3 minutes in your journal" / "Set your first goal"
- [ ] Track completion of each action. On all 3 complete: animate card out, show "Day 1 complete. Good start."
- [ ] Never show this card after day 1

---

### UX-15 — Post-Purchase Congratulations Experience
- [ ] Add prev_tier TEXT DEFAULT 'explore' to user_profiles
- [ ] On billing webhook: update prev_tier to old value before updating subscription_tier
- [ ] On next login after tier upgrade: show full-screen congratulations flow
      1. Expanding ring animation (Framer Motion, single clean pulse)
      2. Card: "Welcome to [Tier]. Here's what just unlocked:" + 5 specific feature bullets
      3. 3 "Try this now" action buttons that navigate to newly unlocked features
- [ ] After 5 seconds or user clicks: navigate to their chosen feature

---

### UX-16 — Streak Milestone Celebrations
Research: variable reward (Skinner, 1938) — milestone celebrations strengthen behavioral reinforcement.

- [ ] Milestone days: 7, 14, 21, 30, 60, 90, 100, 180, 365
- [ ] Check on Discipline page load: if streak_days == milestone AND NOT already celebrated today
      Store last_celebrated_milestone in user_profiles
- [ ] If milestone: show celebration card with the user's actual streak data, not a generic quote
      "Day 30. The average person starts 3 failed attempts before reaching 30 days. You're past that."
- [ ] Single pulse ring animation. One pulse. 1.5 seconds. Respect prefers-reduced-motion.

---

### UX-17 — Swipe-to-Complete on Mobile Habit List
Research: iOS-style swipe is standard for mobile list interactions (Todoist, Habitica, Clear).
Library from internet research: react-swipeable-list (simpler API than @use-gesture for this specific pattern)

- [ ] Install: npm install react-swipeable-list
- [ ] In Habits.jsx: import SwipeableList, SwipeableListItem, SwipeAction, LeadingActions, TrailingActions
- [ ] Wrap each habit item with SwipeableListItem on mobile only (check window.innerWidth < 768)
      Swipe right (LeadingActions): green background #10B981, "Complete" text, triggers markHabitComplete()
      Swipe left (TrailingActions): dark amber background #92400E, "Skip" text, triggers skipHabit()
- [ ] On desktop: remove swipe actions, show normal checkbox interface

### END-OF-SESSION — RUN BUILD CHECK NOW
Run the standard BUILD CHECK block (top of file). Do not proceed until it passes.

### SESSION END SUMMARY (fill in, then paste into AGENT NOTES at bottom of file)
```
SESSION 9 (UX — Part 4 of 5): [DONE / BLOCKED]
Build check result: [PASS / FAIL — paste error if FAIL]
Files changed: [list]
Resume note (only if BLOCKED or partially done): [what's left]
NEXT SESSION TO RUN: 10
```

---

## SESSION 10 — PHASE UX — Part 5 of 5: GLOBAL UX POLISH AND MICRO-INTERACTIONS

### START-OF-SESSION CHECK
- [ ] Confirm previous session's BUILD CHECK passed (see AGENT NOTES at bottom).
- [ ] If previous session is marked [!] BLOCKED, fix that first. Do not start this session on a broken build.

### TASKS

### UX-18 — Section Padding Variety on Landing Page
Research: equal padding everywhere is an AI slop tell. Vary the section rhythm.

- [ ] In WaitlistLanding.jsx, apply these specific paddings per section:
      Hero: padding-top clamp(80px, 12vw, 160px), padding-bottom clamp(60px, 8vw, 120px)
      Problem: padding clamp(40px, 6vw, 80px) 0
      Features: padding clamp(60px, 8vw, 120px) 0
      Personas: padding clamp(40px, 5vw, 80px) 0
      Pricing: padding clamp(60px, 8vw, 100px) 0
      Repeat CTA: padding clamp(80px, 10vw, 140px) 0
- [ ] Alternate section backgrounds between --color-base and --color-surface-1

---

### END-OF-SESSION — RUN BUILD CHECK NOW
Run the standard BUILD CHECK block (top of file). Do not proceed until it passes.

### SESSION END SUMMARY (fill in, then paste into AGENT NOTES at bottom of file)
```
SESSION 10 (UX — Part 5 of 5): [DONE / BLOCKED]
Build check result: [PASS / FAIL — paste error if FAIL]
Files changed: [list]
Resume note (only if BLOCKED or partially done): [what's left]
NEXT SESSION TO RUN: 11
```

---

## SESSION 11 — PHASE ACC — Part 1 of 2: ACCOUNT PAGE COMPLETE OVERHAUL

### START-OF-SESSION CHECK
- [ ] Confirm previous session's BUILD CHECK passed (see AGENT NOTES at bottom).
- [ ] If previous session is marked [!] BLOCKED, fix that first. Do not start this session on a broken build.

### TASKS

### Prerequisite: P0, TYP, UX complete.
### Research basis: researchbased.md Part 3 (3.1 through 3.9)
### Current AccountPage.jsx is 61KB doing everything poorly. Full rebuild.
### Estimated Time: 16-20 hours

---

### ACC-01 — New Architecture: Sidebar Plus Panel Layout
Reference: GitHub Settings, Linear Settings — sidebar nav + scrollable main panel.

- [ ] Create frontend/src/pages/account/ directory
- [ ] Create frontend/src/pages/account/sections/ directory
- [ ] Create AccountPage.jsx (container):
      Left sidebar: 240px fixed on desktop, horizontal pill row on mobile (width < 768px)
      Sidebar background: --color-surface-1 (#0E1016)
      Main panel: flex-1, max-width 760px, overflow-y scroll
      Active sidebar item: left border 2px solid #2563EB, text color #EDEDED
- [ ] URL strategy: /account?section=profile (query param, not nested routes — simpler)
- [ ] Sidebar items: My Profile, Personalization, Notifications, Privacy and Security, Subscription, Data and Export, Legal
- [ ] Section heading style: Outfit 600, 13px, uppercase, #6B6B7B
- [ ] Create 7 section files in sections/ directory

---

### ACC-02 — ProfileSection.jsx
- [ ] Avatar upload: drag-and-drop or click, accept jpg/png/webp max 2MB, preview immediately via FileReader, upload to Vercel Blob on explicit save
- [ ] Inline editable fields: Name (click to edit, blur to save), OS-ID (@username, unique validation server-side), Tagline (max 80 chars with counter), Location (optional), Birthday (date picker)
- [ ] Profile Strength Indicator: progress bar using TYP-09 shimmer, show what is missing
- [ ] Save behavior: auto-save on field blur using useFieldSave hook from UX-03. Show "Saved." micro-confirmation.

---

### ACC-03 — PersonalizationSection.jsx
Build 7 subsections. All save immediately on change.

- [ ] Subsection A (Dashboard): toggle grid for 12 widgets + drag-to-reorder. Install @dnd-kit/core and @dnd-kit/sortable. Save to user_profiles.dashboard_modules via PATCH /api/account
- [ ] Subsection B (AI Tone): 3 radio card options showing a sample AI message per option. Save to user_profiles.ai_tone. Server must include tone in all Groq/Gemini system messages.
- [ ] Subsection C (Domain Priority): 7 draggable chips, drag top 3. Save to user_profiles.domain_priorities as JSONB array. AI prompts must include the top 3 domains.
- [ ] Subsection D (Goals Summary): read-only view of active goals with progress. Show tier limit. Upgrade prompt below list.
- [ ] Subsection E (Sports): chip multi-select for sports, favorite club input, F1 driver input, IPL team dropdown. Save button (not auto-save — this is a considered choice).
- [ ] Subsection F (Display): Theme (Dark/Light/System), Font Scale (Small/Normal/Large adjusts root font-size 14/16/18px), Date format, Currency, Week start, Language. Save on change.
- [ ] Subsection G (Quiet Hours): Two time pickers for quiet period + morning nudge time + evening check-in + weekly digest time. Save on change.

### END-OF-SESSION — RUN BUILD CHECK NOW
Run the standard BUILD CHECK block (top of file). Do not proceed until it passes.

### SESSION END SUMMARY (fill in, then paste into AGENT NOTES at bottom of file)
```
SESSION 11 (ACC — Part 1 of 2): [DONE / BLOCKED]
Build check result: [PASS / FAIL — paste error if FAIL]
Files changed: [list]
Resume note (only if BLOCKED or partially done): [what's left]
NEXT SESSION TO RUN: 12
```

---

## SESSION 12 — PHASE ACC — Part 2 of 2: ACCOUNT PAGE COMPLETE OVERHAUL

### START-OF-SESSION CHECK
- [ ] Confirm previous session's BUILD CHECK passed (see AGENT NOTES at bottom).
- [ ] If previous session is marked [!] BLOCKED, fix that first. Do not start this session on a broken build.

### TASKS

### ACC-04 — NotificationsSection.jsx
Granular per-notification-type toggles. Not a single on/off.

- [ ] ACTIVITY group: Habit reminder, Discipline prompt, Journal prompt, Focus suggestions, Weekly digest
- [ ] SPORTS group: Match starting (30 min before), Final score, Transfer news, Press conferences
- [ ] FINANCIAL group: Budget exceeded, Subscription detected, Safe-to-spend daily
- [ ] SYSTEM group: Security alerts (always on, toggle disabled), Product updates, Tips and guides
- [ ] Custom toggle component: pill 44x24px, electric blue when on, gray when off, thumb slides with CSS transition
- [ ] Store all prefs as JSONB in user_profiles.notification_prefs. Server checks this before any email/push.

---

### ACC-05 — PrivacySection.jsx
- [ ] Security block: email (read-only), linked social (Google connected status), 2FA status + link to Clerk 2FA, active sessions count + revoke link
- [ ] AI and Data Privacy block:
      Toggle: Allow AI to analyze journal entries (saves to user_profiles.ai_journal_opt_in)
      Toggle: Allow AI to generate sports summaries
      Factual note: "Finance data is never sent to AI."
      Server MUST respect these toggles before calling AI
- [ ] What we process: plain English list per researchbased.md 3.5

---

### ACC-06 — SubscriptionSection.jsx
- [ ] Current plan card: tier, price, renewal date, payment method, Manage button
- [ ] Feature chips for current tier
- [ ] Upgrade block below (never over) current content: specific pro features listed, not "get more features"
- [ ] Rule from research: "Never show a paywall that blocks the current content."

---

### ACC-07 — DataSection.jsx
- [ ] Download All My Data button: GET /api/account/export, force download as JSON file
- [ ] Delete Account: red border card, user must type DELETE to confirm, then DELETE /api/account
- [ ] Data sync info: last synced timestamp, server region (Mumbai, India), force sync button

---

### ACC-08 — LegalSection.jsx
- [ ] 4 legal page links with last-updated dates
- [ ] Compliance list: IT Act 2000, DPDPA 2023, GDPR, COPPA
- [ ] Contact emails: legal@aiimin.in, privacy@aiimin.in, support@aiimin.in, security@aiimin.in

---

### END-OF-SESSION — RUN BUILD CHECK NOW
Run the standard BUILD CHECK block (top of file). Do not proceed until it passes.

### SESSION END SUMMARY (fill in, then paste into AGENT NOTES at bottom of file)
```
SESSION 12 (ACC — Part 2 of 2): [DONE / BLOCKED]
Build check result: [PASS / FAIL — paste error if FAIL]
Files changed: [list]
Resume note (only if BLOCKED or partially done): [what's left]
NEXT SESSION TO RUN: 13
```

---

## SESSION 13 — PHASE PW — Part 1 of 2: WAITLIST LANDING PAGE

### START-OF-SESSION CHECK
- [ ] Confirm previous session's BUILD CHECK passed (see AGENT NOTES at bottom).
- [ ] If previous session is marked [!] BLOCKED, fix that first. Do not start this session on a broken build.

### TASKS

### Prerequisite: P0 and TYP complete. Design system must exist before landing page is built.
### Estimated Time: 12-16 hours

---

### PW-01 — waitlist_emails Table
- [ ] Run migration in Supabase SQL editor (create table with UUID, email UNIQUE, name, source, created_at)
- [ ] Enable RLS, add insert-only policy
- [ ] Save migration to server/migrations/023_waitlist_emails.sql

---

### PW-02 — Waitlist API Routes
- [ ] Create server/routes/waitlist.js
- [ ] POST /api/waitlist: validate email format, sanitize, insert, handle duplicate gracefully (return already_registered:true not 500)
- [ ] GET /api/waitlist/count: return row count for social proof on page
- [ ] Apply waitlistLimiter (3 req/hour/IP) from SEC phase
- [ ] Register in server entry file

---

### PW-03 — Waitlist Mode Guard in App.jsx
- [ ] VITE_WAITLIST_MODE=true in .env and Vercel production
- [ ] In App.jsx: if waitlistMode AND user not in ADMIN_USER_IDS array, render WaitlistLanding at /
- [ ] Hardcode your Clerk user ID in ADMIN_USER_IDS

---

### PW-04 — Hero Section (Anti-AI-Slop)
No purple/teal gradient. No "Transform your life." No generic CTA.

- [ ] Background: #0A0C10 with single centered radial glow (electric blue #2563EB, 20% opacity, 600px radius)
- [ ] AIIMIN wordmark: inlined SVG directly in JSX (no image request)
- [ ] Headline: "Run your life like a system." Outfit 800, --text-hero size. "system" in #2563EB.
- [ ] Subheadline: one sentence, Inter 400, #A1A1AA
- [ ] Launch badge: "Opening September 2026" pill with #2563EB border
- [ ] Email form + CTA: "Join the Waitlist >" (not "Get Started")
- [ ] Waitlist count: fetch from GET /api/waitlist/count. If < 50: "Be among the first 1,000 — get Core free for 3 months."
- [ ] CTA hover: whileHover scale 1.02 (subtle, not 1.1)

---

### PW-05 — Sections 2 Through 6
Anti-AI-slop: show real product UI in Section 3, not emoji icons.

- [ ] Section 2 (Problem): "Habitify. Notion. Cricbuzz. PhonePe. Forest. YouTube." as text pills, then: "You use 6. AIIMIN does it in one."
- [ ] Section 3 (Feature Glimpses): 3 animated cards with actual product screenshots or high-fidelity UI mockups. whileInView, stagger 0.15s.
- [ ] Section 4 (Who It's For): 4 persona tiles in 2x2 grid (1 column mobile) — specific, real personas, no corporate language
- [ ] Section 5 (Pricing): 3 blurred tier cards, prices visible
- [ ] Section 6 (Repeat CTA): same WaitlistForm component as Hero
- [ ] Footer: wordmark, "Built in India", 4 legal links

---

### PW-06 — Waitlist Form Logic
- [ ] WaitlistForm component: validate before send, loading state on button, success message on complete, duplicate message, error message
- [ ] On success: replace form with "You're on the list. See you in September."
- [ ] GA4 event on success: window.gtag('event', 'waitlist_signup')
- [ ] GA4 async script in index.html (non-blocking)

---

### PW-07 — SEO and OG Meta Tags
- [ ] Create og-image.png 1200x630px with AIIMIN wordmark and tagline on dark background
- [ ] Add OG and Twitter meta tags to index.html
- [ ] Verify with opengraph.xyz after deployment

### END-OF-SESSION — RUN BUILD CHECK NOW
Run the standard BUILD CHECK block (top of file). Do not proceed until it passes.

### SESSION END SUMMARY (fill in, then paste into AGENT NOTES at bottom of file)
```
SESSION 13 (PW — Part 1 of 2): [DONE / BLOCKED]
Build check result: [PASS / FAIL — paste error if FAIL]
Files changed: [list]
Resume note (only if BLOCKED or partially done): [what's left]
NEXT SESSION TO RUN: 14
```

---

## SESSION 14 — PHASE PW — Part 2 of 2: WAITLIST LANDING PAGE

### START-OF-SESSION CHECK
- [ ] Confirm previous session's BUILD CHECK passed (see AGENT NOTES at bottom).
- [ ] If previous session is marked [!] BLOCKED, fix that first. Do not start this session on a broken build.

### TASKS

### PW-08 — Section Padding and Performance
- [ ] Apply clamp-based padding per section from UX-18
- [ ] Alternate section backgrounds between --color-base and --color-surface-1
- [ ] html { scroll-behavior: smooth; }
- [ ] All images get loading="lazy" except hero

---

### PW-09 — Deploy and Test
- [ ] Push to main, verify Vercel deploys successfully
- [ ] Test on production in incognito: form submit, success state, count display
- [ ] Test on mobile Safari 375px viewport
- [ ] Lighthouse: target 90+ Performance, 90+ Accessibility, 90+ SEO

---

### END-OF-SESSION — RUN BUILD CHECK NOW
Run the standard BUILD CHECK block (top of file). Do not proceed until it passes.

### SESSION END SUMMARY (fill in, then paste into AGENT NOTES at bottom of file)
```
SESSION 14 (PW — Part 2 of 2): [DONE / BLOCKED]
Build check result: [PASS / FAIL — paste error if FAIL]
Files changed: [list]
Resume note (only if BLOCKED or partially done): [what's left]
NEXT SESSION TO RUN: 15
```

---

## SESSION 15 — PHASE PERF — Part 1 of 2: PERFORMANCE HARDENING

### START-OF-SESSION CHECK
- [ ] Confirm previous session's BUILD CHECK passed (see AGENT NOTES at bottom).
- [ ] If previous session is marked [!] BLOCKED, fix that first. Do not start this session on a broken build.

### TASKS

### Prerequisite: P0 complete. Run in parallel with UX and TYP.
### Estimated Time: 10-14 hours

---

### PERF-01 — SVG Audit and Inline Critical Icons
- [ ] Run: grep -r "\.svg" frontend/src --include="*.jsx" --include="*.css" -l
- [ ] Categorize each SVG: CRITICAL (above fold on main pages) or NON-CRITICAL (below fold)
- [ ] Inline CRITICAL only. Do NOT inline any SVG larger than 2KB.
- [ ] Likely candidates: Navbar AIIMIN logo, sidebar icons, Habits empty state icon
- [ ] Target: zero .svg network requests for above-fold content on /overview, /habits, /goals

---

### PERF-02 — Database Connection Audit and Pooling
- [ ] Check for raw pg patterns: grep -r "createClient\|new Pool\|pg.connect" server/ --include="*.js"
- [ ] If raw pg Pool is created per-request: move it to module level in server/lib/db.js
- [ ] Enable Supabase PgBouncer transaction mode (port 6543) in Supabase Settings > Database > Connection Pooling
- [ ] Set Pool config: max:5, idleTimeoutMillis:30000, connectionTimeoutMillis:5000

VERIFICATION: SELECT count(*) FROM pg_stat_activity stays below 10 under normal load.

---

### PERF-03 — Upstash Redis Cache Layer
- [ ] Create free Redis DB at upstash.com
- [ ] Add UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN to .env and Vercel
- [ ] Install: npm install @upstash/redis
- [ ] Create server/lib/cache.js with cacheGet, cacheSet, cacheDel helpers. Wrap every call in try-catch.

---

### PERF-04 — Cache Key Endpoints Server-Side
Apply cache-aside to 6 endpoints in this priority order:
- [ ] GET /api/intelligence: TTL 86400s. Key: insights:userId:date
- [ ] GET /api/sports feed: TTL 300s. Key: sports:userId:type
- [ ] GET /api/dashboard: TTL 60s. Key: dashboard:userId. Invalidate on: habit/goal/finance writes.
- [ ] GET /api/habits list: TTL 30s. Key: habits:userId. Invalidate on: any habit mutation.
- [ ] GET /api/goals list: TTL 30s. Key: goals:userId. Invalidate on: any goal mutation.
- [ ] GET /api/wealth summary: TTL 120s. Key: wealth:userId. Invalidate on: any transaction write.

VERIFICATION: Second request within TTL window returns under 20ms. Upstash dashboard shows cache hits.

---

### PERF-05 — React Query Client-Side Cache
- [ ] Install: npm install @tanstack/react-query
- [ ] Wrap app in QueryClientProvider: staleTime 30000, gcTime 300000, retry 1
- [ ] Migrate Overview, Habits, Goals, Finance, Sports pages from useEffect+fetch to useQuery
- [ ] Every mutation: use useMutation + queryClient.invalidateQueries on success

---

### PERF-06 — Code Split Large Pages
- [ ] Verify all pages use React.lazy(() => import('./pages/PageName'))
- [ ] These 5 files must be lazy loaded: AccountPage (61KB), Placements (58KB), Family (56KB), Finance (44KB), Discipline (34KB)
- [ ] Wrap Routes with Suspense showing skeleton loader (not spinner) as fallback

---

### PERF-07 — Lazy Load Below-Fold Images
- [ ] Add loading="lazy" to all img elements not in the first viewport

---

### PERF-08 — Font-Display Swap Verification
- [ ] Verify every @font-face has font-display: swap
- [ ] Lighthouse: "Ensure text remains visible during webfont load" check passes

### END-OF-SESSION — RUN BUILD CHECK NOW
Run the standard BUILD CHECK block (top of file). Do not proceed until it passes.

### SESSION END SUMMARY (fill in, then paste into AGENT NOTES at bottom of file)
```
SESSION 15 (PERF — Part 1 of 2): [DONE / BLOCKED]
Build check result: [PASS / FAIL — paste error if FAIL]
Files changed: [list]
Resume note (only if BLOCKED or partially done): [what's left]
NEXT SESSION TO RUN: 16
```

---

## SESSION 16 — PHASE PERF — Part 2 of 2: PERFORMANCE HARDENING

### START-OF-SESSION CHECK
- [ ] Confirm previous session's BUILD CHECK passed (see AGENT NOTES at bottom).
- [ ] If previous session is marked [!] BLOCKED, fix that first. Do not start this session on a broken build.

### TASKS

### PERF-09 — Prefetch Overview Data Before Login Redirect
- [ ] After successful Clerk auth, before redirect to /overview:
      Call queryClient.prefetchQuery(['dashboard', userId], fetchDashboard)
- [ ] Overview data loads during redirect, not after arrival

---

### PERF-10 — Initial Bundle Size Check
- [ ] Run npm run build, check dist/assets/ for main bundle size
- [ ] Target: main bundle under 200KB gzipped
- [ ] If over: identify large imports with npm install --save-dev rollup-plugin-visualizer, add to vite.config.js

---

### END-OF-SESSION — RUN BUILD CHECK NOW
Run the standard BUILD CHECK block (top of file). Do not proceed until it passes.

### SESSION END SUMMARY (fill in, then paste into AGENT NOTES at bottom of file)
```
SESSION 16 (PERF — Part 2 of 2): [DONE / BLOCKED]
Build check result: [PASS / FAIL — paste error if FAIL]
Files changed: [list]
Resume note (only if BLOCKED or partially done): [what's left]
NEXT SESSION TO RUN: 17
```

---

## SESSION 17 — PHASE SEC — Part 1 of 2: SECURITY HARDENING

### START-OF-SESSION CHECK
- [ ] Confirm previous session's BUILD CHECK passed (see AGENT NOTES at bottom).
- [ ] If previous session is marked [!] BLOCKED, fix that first. Do not start this session on a broken build.

### TASKS

### Prerequisite: P0 complete. Must be 100% complete before Phase P11 (billing).
### Every task here is a direct vulnerability. None are optional.
### Estimated Time: 16-20 hours

---

### SEC-01 — Install Security Dependencies
- [ ] npm install helmet express-rate-limit express-validator cors sanitize-html

---

### SEC-02 — Helmet.js Security Headers
- [ ] In server entry file, before all routes:
      app.use(helmet({ contentSecurityPolicy with specific directives, hsts maxAge 31536000, noSniff, hidePoweredBy }))
- [ ] CSP: defaultSrc self, scriptSrc self+googletagmanager, imgSrc self+data+clerk+google, connectSrc self+supabase+groq+gemini, fontSrc self, frameSrc none, objectSrc none

---

### SEC-03 — CORS Lock to Production Origin
- [ ] Allow only https://aiimin.in and https://www.aiimin.in in production
- [ ] Allow localhost:5173 and localhost:3000 in development
- [ ] credentials:true, methods: GET/POST/PATCH/PUT/DELETE

---

### SEC-04 — Global Sanitize Middleware
- [ ] Create server/middleware/sanitize.js: strip HTML from all string req.body values via sanitize-html
- [ ] Apply globally after express.json(): app.use(sanitizeBody)

VERIFICATION: POST {"name":"<script>alert(1)</script>"} reaches handler with script tag stripped.

---

### SEC-05 — Input Validation on All Write Routes
Apply express-validator checks to these routes in order of risk:
- [ ] POST /api/waitlist: email isEmail(), name isLength max 100
- [ ] POST /api/habits: name isLength 1-100, frequency isIn enum, color matches(/^#[0-9A-Fa-f]{6}$/)
- [ ] POST /api/goals: title 1-200, target_date isISO8601, progress isInt 0-100
- [ ] POST /api/money_transactions: amount isFloat min 0, category string, date isISO8601
- [ ] POST /api/journal_entries: content isLength max 50000, mode isIn enum
- [ ] POST /api/discipline/logs: event_type isIn enum, trigger isLength max 500
- [ ] POST /api/family: name isString, relationship isIn enum, dob isDate
- [ ] POST /api/notes: title isLength max 200, body isLength max 100000

---

### SEC-06 — Full IDOR Audit
Every route taking :id must verify the user owns the resource.

- [ ] Audit: grep -n "req.params.id" server/routes/*.js
- [ ] For each result: add .eq('user_id', req.userId) to the Supabase query
- [ ] Routes to audit: habits.js, goals.js, dailyLogs.js, discipline.js, wealth.js, family.js, notes.js, lab.js, placements.js, account.js

VERIFICATION: As User A, GET User B's habit by habit ID. Must return 404.

---

### SEC-07 — Auth Middleware Verification
- [ ] Verify middleware: reads Bearer token, verifies via Clerk, sets req.userId, returns 401 on failure
- [ ] Verify applied to every route except: /api/health, /api/waitlist, /api/auth/webhook
- [ ] Verify Clerk webhook uses svix signature verification

---

### SEC-08 — Secrets Audit
- [ ] grep -r "service_role" frontend/ — must return zero results
- [ ] grep -r "gsk_\|nvapi-\|AIzaSy" frontend/ — must return zero results
- [ ] Verify .env in .gitignore
- [ ] Scan git history for accidental commits: git log --all -p | grep -i "service_role" | head -20
- [ ] If secrets found in history: rotate ALL keys immediately before continuing any other work

### END-OF-SESSION — RUN BUILD CHECK NOW
Run the standard BUILD CHECK block (top of file). Do not proceed until it passes.

### SESSION END SUMMARY (fill in, then paste into AGENT NOTES at bottom of file)
```
SESSION 17 (SEC — Part 1 of 2): [DONE / BLOCKED]
Build check result: [PASS / FAIL — paste error if FAIL]
Files changed: [list]
Resume note (only if BLOCKED or partially done): [what's left]
NEXT SESSION TO RUN: 18
```

---

## SESSION 18 — PHASE SEC — Part 2 of 2: SECURITY HARDENING

### START-OF-SESSION CHECK
- [ ] Confirm previous session's BUILD CHECK passed (see AGENT NOTES at bottom).
- [ ] If previous session is marked [!] BLOCKED, fix that first. Do not start this session on a broken build.

### TASKS

### SEC-09 — Tiered Rate Limiting
- [ ] Create server/middleware/rateLimiter.js with 5 limiters:
      general: 100 req/min/IP
      auth: 10 req/15min/IP
      AI: 5 req/min/userId (not IP)
      waitlist: 3 req/hr/IP
      accountCreation: 3 req/hr/IP
- [ ] Apply generalLimiter globally: app.use('/api/', generalLimiter)
- [ ] Apply authLimiter to auth routes, aiLimiter to intelligence routes, waitlistLimiter to /api/waitlist

VERIFICATION: 11th rapid request to /api/auth returns 429.

---

### SEC-10 — Security Event Logging
- [ ] npm install winston
- [ ] Create server/lib/logger.js with Winston JSON transport
- [ ] Log: auth failures, rate limit hits, IDOR attempts, AI rate limit hits
- [ ] Verify logs appear in Vercel Function Logs dashboard

---

### SEC-11 — File Upload Security
- [ ] npm install file-type
- [ ] For all upload endpoints: validate MIME type via magic bytes (not Content-Type header alone)
- [ ] Whitelist: application/pdf, image/jpeg, image/png. Max 10MB per file.
- [ ] Rename uploaded files server-side to UUID + original extension

---

### SEC-12 — Supabase RLS Full Audit
- [ ] Run in Supabase SQL editor:
      SELECT tablename, rowsecurity FROM pg_tables WHERE schemaname = 'public' ORDER BY rowsecurity ASC
- [ ] Every table with user data and rowsecurity=false: enable RLS and add appropriate policies
- [ ] Verify: money_transactions, journal_entries, family_documents, discipline_streaks, wealth_assets

---

### SEC-13 — Secure Deployment Checklist
- [ ] NODE_ENV=production in Vercel
- [ ] All .env files in .gitignore, never committed
- [ ] No VITE_ prefix on server-only secrets
- [ ] Vercel preview deployments password-protected
- [ ] Supabase API rate limiting enabled
- [ ] Vercel billing alert $5/month, Supabase alert $10/month

---

### END-OF-SESSION — RUN BUILD CHECK NOW
Run the standard BUILD CHECK block (top of file). Do not proceed until it passes.

### SESSION END SUMMARY (fill in, then paste into AGENT NOTES at bottom of file)
```
SESSION 18 (SEC — Part 2 of 2): [DONE / BLOCKED]
Build check result: [PASS / FAIL — paste error if FAIL]
Files changed: [list]
Resume note (only if BLOCKED or partially done): [what's left]
NEXT SESSION TO RUN: 19
```

---

## SESSION 19 — PHASE P1: DISCIPLINE FRONTEND MIGRATION

### START-OF-SESSION CHECK
- [ ] Confirm previous session's BUILD CHECK passed (see AGENT NOTES at bottom).
- [ ] If previous session is marked [!] BLOCKED, fix that first. Do not start this session on a broken build.

### TASKS

### Prerequisite: P0, PERF-05 (React Query installed), UX complete.
### Estimated Time: 8-10 hours

### Science context for AI prompts in this phase:
### Streak tracking: basal ganglia reinforcement (Graybiel, MIT). 
### Urge Surfing: MBRP research (Marlatt 1985, Bowen 2014) — 30-55% relapse reduction vs suppression.
### HALT check: clinical addiction medicine standard.
### Compassionate Restart: Neff & Germer (2012) — self-forgiveness doubles re-engagement speed vs self-criticism.
### Replacement habit: Pavlov and Skinner behavioral conditioning — cannot suppress a behavior, must redirect it.

### P1-01 — Remove All localStorage from Discipline.jsx
- [ ] Find all localStorage reads/writes for discipline data
- [ ] Document key names in a comment before removing
- [ ] Remove: streak count, streak start, discipline logs, urge logs, replacement habits from localStorage
- [ ] Keep localStorage only for UI state (panel collapsed/expanded)

### P1-02 — Wire Discipline Data to API
- [ ] Create frontend/src/api/discipline.js with all fetch functions
- [ ] Replace localStorage reads with useQuery calls
- [ ] Replace localStorage writes with useMutation + cache invalidation

### P1-03 — Build Trigger Identification Modal
3-step post-reset modal. Cannot be skipped. No X button.
- [ ] Step 1: Trigger type chips (Stress, Boredom, Social Pressure, Physical, Other)
- [ ] Step 2: Time of day radios (Morning, Afternoon, Evening, Late Night)
- [ ] Step 3: HALT check chips (Hungry, Angry, Lonely, Tired)
- [ ] On submit: POST to /api/discipline/trigger-log with all 3 steps as JSON

### P1-04 — Build Urge Surfing Log UI
- [ ] "Log an Urge" button visible only when streak_days > 0
- [ ] Inline panel: intensity slider 1-5, timestamp auto-captured
- [ ] Submit "Surfed it" > POST /api/discipline/urges
- [ ] Show: "Urges surfed today: X. Total this streak: Y."

### P1-05 — Build Compassionate Restart UI
Research basis: self-compassion doubles re-engagement speed vs self-criticism (Neff, 2012).
- [ ] After reset: Framer Motion AnimatePresence entrance card with user's actual streak history data
- [ ] "Your streaks: 3 days > 7 days > [N] days. The trend is up." — never use generic quotes
- [ ] "Start New Streak" button triggers new streak record via useMutation

### P1-06 — Replacement Habit Linker
- [ ] "When I feel an urge, I'll..." dropdown populated from /api/habits
- [ ] On select: POST /api/discipline/replacement-habits

### P1-07 — Urge Frequency Chart
- [ ] Recharts BarChart: last 8 weeks X-axis, urge count per week Y-axis
- [ ] Colors: blue (#2563EB) for surfed urges, amber (#F59E0B) for resets (color-blind accessible)

### P1-08 — Streak Milestone Trigger
- [ ] Verify the milestone check from UX-16 fires correctly from Discipline.jsx on page load

### P1-09 — End-to-End Test
- [ ] Start streak, log 3 urges, reset, verify TriggerModal appears and cannot be skipped
- [ ] Verify Compassionate Restart shows correct data
- [ ] Refresh page — data must come from API, not localStorage
- [ ] Switch browser — same data (proves server persistence)

---

### END-OF-SESSION — RUN BUILD CHECK NOW
Run the standard BUILD CHECK block (top of file). Do not proceed until it passes.

### SESSION END SUMMARY (fill in, then paste into AGENT NOTES at bottom of file)
```
SESSION 19 (P1): [DONE / BLOCKED]
Build check result: [PASS / FAIL — paste error if FAIL]
Files changed: [list]
Resume note (only if BLOCKED or partially done): [what's left]
NEXT SESSION TO RUN: 20
```

---

## SESSION 20 — PHASE P2: JOURNAL OVERHAUL

### START-OF-SESSION CHECK
- [ ] Confirm previous session's BUILD CHECK passed (see AGENT NOTES at bottom).
- [ ] If previous session is marked [!] BLOCKED, fix that first. Do not start this session on a broken build.

### TASKS

### Prerequisite: P1 complete.
### Science: Pennebaker (1986-2022), Aaron Beck (1970s), Cuijpers (2012), Park et al. (2016)
### Estimated Time: 14-18 hours

### P2-01 — 5 Mode Tab System
- [ ] 5 pill tabs: Free Write, CBT Record, What Went Well, Morning Pages, Weekly Review
- [ ] Active tab in URL query param ?mode=free
- [ ] Create 5 sub-components in frontend/src/components/journal/

### P2-02 — Free Write Mode (Pennebaker Protocol)
- [ ] Timer: 10/15/20 minutes. Start > full-screen editor.
- [ ] Word count, countdown timer, optional blur-as-you-write
- [ ] On timer end: auto-save, show read-only. No editing after save.

### P2-03 — CBT Record Mode (Aaron Beck)
- [ ] 6 labeled fields with guiding placeholders. Emotion field: 1-10 slider + text.
- [ ] On save: background AI analysis via Gemini Flash. Poll for result. Show as chips.

### P2-04 — What Went Well Mode
- [ ] 3 text inputs with expandable "Why did this happen?" secondary fields

### P2-05 — Morning Pages Mode (Available 6am-9am Only)
- [ ] Time check on mount. Outside window: show "Available 6am-9am" message.
- [ ] Within window: check if today's entry exists. If yes: read-only. If no: editor.

### P2-06 — Weekly Review Mode (Available Sundays After 5pm)
- [ ] Day/time check on mount. Auto-populate habit %, focus hours, streak from API data.

### P2-07 — Socratic Idle Prompt System
- [ ] After 90 seconds idle: animate in one of 3 Socratic prompts. Not motivational phrases.

### P2-08 — Background AI Emotion Analysis (Park et al., 2016)
- [ ] After every save: non-blocking POST to /api/intelligence/analyze-journal
- [ ] Gemini returns: {emotion_tag, cognitive_distortion, theme}. Cache in Supabase. Show as chips.

### P2-09 — Journal Sidebar History
- [ ] Last 30 entries: date, mode pill, first 80 chars, emotion chip. Filter by mode.

### P2-10 through P2-14
- [ ] P2-10: Cross-section integration — emotion tags to daily_logs, wins to goal evidence
- [ ] P2-11: Search via Supabase ilike on content
- [ ] P2-12: Export to plain text file (download)
- [ ] P2-13: Journal streak counter (consecutive days with any entry)
- [ ] P2-14: Mobile audit — all 5 modes usable at 375px

---

### END-OF-SESSION — RUN BUILD CHECK NOW
Run the standard BUILD CHECK block (top of file). Do not proceed until it passes.

### SESSION END SUMMARY (fill in, then paste into AGENT NOTES at bottom of file)
```
SESSION 20 (P2): [DONE / BLOCKED]
Build check result: [PASS / FAIL — paste error if FAIL]
Files changed: [list]
Resume note (only if BLOCKED or partially done): [what's left]
NEXT SESSION TO RUN: 21
```

---

## SESSION 21 — PHASE P3: INTERCONNECTED CORE

### START-OF-SESSION CHECK
- [ ] Confirm previous session's BUILD CHECK passed (see AGENT NOTES at bottom).
- [ ] If previous session is marked [!] BLOCKED, fix that first. Do not start this session on a broken build.

### TASKS

### Prerequisite: P1 and P2 complete.
### Science: Gollwitzer (1999) for focus framing, Kolb (1984) for post-session reflection

### P3-01 through P3-11 — Build as specified in previous plan
Key science notes to add to code comments:
- [ ] P3-05 FocusRoom Pre-Session: "Gollwitzer (1999): specifying WHAT and WHY triples goal attainment. This form is not optional."
- [ ] P3-06 Post-Session Reflection: "Kolb (1984): without reflection, experience does not convert to skill. This step is the learning loop."
- [ ] P3-08 Habit Stacking: "Gollwitzer (1999) implementation intentions via IF-THEN anchoring: increases goal attainment 200-300%."
- [ ] P3-09 Chain Wall: "Kahneman loss aversion (1979): once visible, the psychological cost of breaking the chain creates genuine behavioral resistance."
- [ ] P3-10 AI Habit Coach: AI tone must respect user's ai_tone preference from Personalization. Never say "21 days" — say "18 to 254 days, average 66 days (Lally et al., UCL 2010)."

---

### END-OF-SESSION — RUN BUILD CHECK NOW
Run the standard BUILD CHECK block (top of file). Do not proceed until it passes.

### SESSION END SUMMARY (fill in, then paste into AGENT NOTES at bottom of file)
```
SESSION 21 (P3): [DONE / BLOCKED]
Build check result: [PASS / FAIL — paste error if FAIL]
Files changed: [list]
Resume note (only if BLOCKED or partially done): [what's left]
NEXT SESSION TO RUN: 22
```

---

## SESSION 22 — PHASE P4: SPORTS FULL BUILD

### START-OF-SESSION CHECK
- [ ] Confirm previous session's BUILD CHECK passed (see AGENT NOTES at bottom).
- [ ] If previous session is marked [!] BLOCKED, fix that first. Do not start this session on a broken build.

### TASKS

### Prerequisite: P0 complete.
Build as specified. Key UX additions from research:
- [ ] Apply card-active gradient border (TYP-08) to live match cards
- [ ] Apply color-blind accessible chart colors (UX-11) to any sports stats charts
- [ ] Empty state copy (UX-05): "Choose your teams. We'll build your feed." > "Set up my sports"

---

### END-OF-SESSION — RUN BUILD CHECK NOW
Run the standard BUILD CHECK block (top of file). Do not proceed until it passes.

### SESSION END SUMMARY (fill in, then paste into AGENT NOTES at bottom of file)
```
SESSION 22 (P4): [DONE / BLOCKED]
Build check result: [PASS / FAIL — paste error if FAIL]
Files changed: [list]
Resume note (only if BLOCKED or partially done): [what's left]
NEXT SESSION TO RUN: 23
```

---

## SESSION 23 — PHASE P5: GROWTH ENGINE VISUAL OVERHAUL

### START-OF-SESSION CHECK
- [ ] Confirm previous session's BUILD CHECK passed (see AGENT NOTES at bottom).
- [ ] If previous session is marked [!] BLOCKED, fix that first. Do not start this session on a broken build.

### TASKS

### Science: Amabile & Kramer HBS (2011), Deci & Ryan SDT, Miller's Law, Csikszentmihalyi flow
- [ ] Apply scroll-triggered reveals from UX-08 to Life Score rings and Growth Engine nodes
- [ ] Apply score-highlight glow from TYP-07 to Life Score total number
- [ ] Apply useReducedMotion from UX-09 to all ring and node animations
- [ ] Apply AnimatedNumber from UX-04 to the Life Score total
- [ ] Delete all rainbow CSS. Apply design system colors only.
- [ ] Add science note in code: "Domain balance predicts life satisfaction (Journal of Happiness Studies, 2005)."
- [ ] Add science note: "Tracking Competence growth is a reliable intrinsic motivation driver (Deci & Ryan SDT, 1985-2020)."
Remaining P5 tasks as specified in previous plan.

---

### END-OF-SESSION — RUN BUILD CHECK NOW
Run the standard BUILD CHECK block (top of file). Do not proceed until it passes.

### SESSION END SUMMARY (fill in, then paste into AGENT NOTES at bottom of file)
```
SESSION 23 (P5): [DONE / BLOCKED]
Build check result: [PASS / FAIL — paste error if FAIL]
Files changed: [list]
Resume note (only if BLOCKED or partially done): [what's left]
NEXT SESSION TO RUN: 24
```

---

## SESSION 24 — PHASE P6: FINANCE UPGRADES

### START-OF-SESSION CHECK
- [ ] Confirm previous session's BUILD CHECK passed (see AGENT NOTES at bottom).
- [ ] If previous session is marked [!] BLOCKED, fix that first. Do not start this session on a broken build.

### TASKS

### Science: Thaler (Nobel 2017), Lerner et al. Harvard (2013), Hershfield Northwestern (2011)
Build as specified. Key additions:
- [ ] Apply AnimatedNumber (UX-04) to Safe-to-Spend widget main number
- [ ] Apply score-highlight glow (TYP-07) to Safe-to-Spend number
- [ ] Emotion tags on transactions: UI per UX-05 empty state spec
- [ ] SIP Planner chart: apply color-blind accessible colors (UX-11)
- [ ] Add science note in code for SIP chart: "Hershfield et al. (2011): visualizing compound growth curve increases savings decisions by 14%."
- [ ] CSV export uses papaparse for formatting

---

### END-OF-SESSION — RUN BUILD CHECK NOW
Run the standard BUILD CHECK block (top of file). Do not proceed until it passes.

### SESSION END SUMMARY (fill in, then paste into AGENT NOTES at bottom of file)
```
SESSION 24 (P6): [DONE / BLOCKED]
Build check result: [PASS / FAIL — paste error if FAIL]
Files changed: [list]
Resume note (only if BLOCKED or partially done): [what's left]
NEXT SESSION TO RUN: 25
```

---

## SESSION 25 — PHASE P7: FAMILY VAULT COMPLETION

### START-OF-SESSION CHECK
- [ ] Confirm previous session's BUILD CHECK passed (see AGENT NOTES at bottom).
- [ ] If previous session is marked [!] BLOCKED, fix that first. Do not start this session on a broken build.

### TASKS

### Prerequisite: SEC-11 (file upload security) complete before document uploads.
Build as specified in previous plan. Apply TYP-08 gradient border to documents expiring within 30 days.

---

### END-OF-SESSION — RUN BUILD CHECK NOW
Run the standard BUILD CHECK block (top of file). Do not proceed until it passes.

### SESSION END SUMMARY (fill in, then paste into AGENT NOTES at bottom of file)
```
SESSION 25 (P7): [DONE / BLOCKED]
Build check result: [PASS / FAIL — paste error if FAIL]
Files changed: [list]
Resume note (only if BLOCKED or partially done): [what's left]
NEXT SESSION TO RUN: 26
```

---

## SESSION 26 — PHASE P8: LAB INTELLIGENCE UPGRADES

### START-OF-SESSION CHECK
- [ ] Confirm previous session's BUILD CHECK passed (see AGENT NOTES at bottom).
- [ ] If previous session is marked [!] BLOCKED, fix that first. Do not start this session on a broken build.

### TASKS

### Science: Jaeggi (2008), Ebbinghaus (1885), FSRS (Ye 2023), Ericsson (1993), Salthouse (1996)
Build as specified. Key additions:
- [ ] Apply color-blind accessible chart colors (UX-11) to cognitive benchmark radar chart
- [ ] Apply AnimatedNumber (UX-04) to WPM score, accuracy %, benchmark scores
- [ ] Key Heatmap (P8-02): apply tabular-nums (TYP-03) to stat numbers in tooltips
- [ ] Add code comment for FSRS: "Outperforms SM-2 (Anki) by 8-14% fewer reviews for same retention (2022 study)."
- [ ] Weekly Benchmark (P8-06): add code comment: "N-back: Jaeggi et al. Michigan (2008) — 40% fluid intelligence improvement over 19 sessions."

---

### END-OF-SESSION — RUN BUILD CHECK NOW
Run the standard BUILD CHECK block (top of file). Do not proceed until it passes.

### SESSION END SUMMARY (fill in, then paste into AGENT NOTES at bottom of file)
```
SESSION 26 (P8): [DONE / BLOCKED]
Build check result: [PASS / FAIL — paste error if FAIL]
Files changed: [list]
Resume note (only if BLOCKED or partially done): [what's left]
NEXT SESSION TO RUN: 27
```

---

## SESSION 27 — PHASE P9: OVERVIEW: MISSION CONTROL

### START-OF-SESSION CHECK
- [ ] Confirm previous session's BUILD CHECK passed (see AGENT NOTES at bottom).
- [ ] If previous session is marked [!] BLOCKED, fix that first. Do not start this session on a broken build.

### TASKS

### Prerequisite: P1 through P5 complete.
Build as specified. Key additions:
- [ ] Apply skeleton loaders (UX-06) to all widgets individually
- [ ] Apply card entrance stagger (UX-07) to widget grid on load
- [ ] Monday insight card and Saturday summary card: respect user's ai_tone preference from ACC-03
- [ ] Day 1 card (UX-14) renders here — verify integration
- [ ] Empty state if no widgets configured: "Add widgets to customize your overview. Go to Account > Personalization."

---

### END-OF-SESSION — RUN BUILD CHECK NOW
Run the standard BUILD CHECK block (top of file). Do not proceed until it passes.

### SESSION END SUMMARY (fill in, then paste into AGENT NOTES at bottom of file)
```
SESSION 27 (P9): [DONE / BLOCKED]
Build check result: [PASS / FAIL — paste error if FAIL]
Files changed: [list]
Resume note (only if BLOCKED or partially done): [what's left]
NEXT SESSION TO RUN: 28
```

---

## SESSION 28 — PHASE P10: LEGAL PAGES

### START-OF-SESSION CHECK
- [ ] Confirm previous session's BUILD CHECK passed (see AGENT NOTES at bottom).
- [ ] If previous session is marked [!] BLOCKED, fix that first. Do not start this session on a broken build.

### TASKS

### Prerequisite: P0 complete. Required before launch.
Build as specified in previous plan. Key addition:
- [ ] Privacy policy must explicitly mention DPDPA 2023 (India's Digital Personal Data Protection Act 2023)
- [ ] Privacy policy must state: "Journal entries are analyzed by Gemini AI for emotion tags. This is an anonymous API call. The content is not stored by Google."

---

### END-OF-SESSION — RUN BUILD CHECK NOW
Run the standard BUILD CHECK block (top of file). Do not proceed until it passes.

### SESSION END SUMMARY (fill in, then paste into AGENT NOTES at bottom of file)
```
SESSION 28 (P10): [DONE / BLOCKED]
Build check result: [PASS / FAIL — paste error if FAIL]
Files changed: [list]
Resume note (only if BLOCKED or partially done): [what's left]
NEXT SESSION TO RUN: 29
```

---

## SESSION 29 — PHASE P11: SUBSCRIPTIONS AND BILLING

### START-OF-SESSION CHECK
- [ ] Confirm previous session's BUILD CHECK passed (see AGENT NOTES at bottom).
- [ ] If previous session is marked [!] BLOCKED, fix that first. Do not start this session on a broken build.

### TASKS

### Prerequisite: ALL phases above complete. SEC must be 100% done first.
### Estimated Time: 12-16 hours
Build as specified in previous plan. Key addition from UX:
- [ ] Post-purchase congratulations experience (UX-15) triggers on first login after tier upgrade
- [ ] Locked features: blurred preview below content — never a modal that blocks the content (per researchbased.md 3.6 rule)

---

### END-OF-SESSION — RUN BUILD CHECK NOW
Run the standard BUILD CHECK block (top of file). Do not proceed until it passes.

### SESSION END SUMMARY (fill in, then paste into AGENT NOTES at bottom of file)
```
SESSION 29 (P11): [DONE / BLOCKED]
Build check result: [PASS / FAIL — paste error if FAIL]
Files changed: [list]
Resume note (only if BLOCKED or partially done): [what's left]
NEXT SESSION TO RUN: 30
```

---

## SESSION 30 — PHASE ENG — Part 1 of 2: RE-ENGAGEMENT AND EMAIL FLOWS

### START-OF-SESSION CHECK
- [ ] Confirm previous session's BUILD CHECK passed (see AGENT NOTES at bottom).
- [ ] If previous session is marked [!] BLOCKED, fix that first. Do not start this session on a broken build.

### TASKS

### Prerequisite: AW-02 (AWS SES) complete, P11 complete.
### Research basis: Fogg Behavior Model, Amplitude/Mixpanel behavioral analytics data

---

### ENG-01 — Streak Recovery Email (SES)
Research: morning timing + compassionate framing increases re-engagement (Fogg Behavior Model).

- [ ] Daily cron at 9am IST: query users where streak ended yesterday
- [ ] Send streak_recovery SES template with the actual streak length in the subject
      Subject: "Your [N]-day streak broke. That's okay."
      Body: show previous streak history, send CTA "Start again >"
- [ ] Log to email_logs before sending. Check logs to prevent duplicate sends.
- [ ] Respect user_profiles.notification_prefs.activity_notifications

---

### ENG-02 — Idle User Re-engagement Sequence (3/7/14 Days)
Research: churn prevention via progressively softer nudges at key intervals.

- [ ] Add last_seen TIMESTAMPTZ to users table. Update on every authenticated API request.
- [ ] Daily cron: identify users where last_seen is exactly 3, 7, or 14 days ago
- [ ] Day 3: "Your [habit_name] streak is [N]. Keep it alive." — shows real data
- [ ] Day 7: "Your life OS is waiting." — shows one specific achievement
- [ ] Day 14: "Miss you. Here's what you've built." — mini stats card with real numbers
- [ ] After 14 days: no more emails until user returns
- [ ] Each sequence resets on login

---

### ENG-03 — Weekly Digest Email (Monday 8am IST)
- [ ] Generate for active users (last_seen within 7 days AND weekly_digest notification enabled)
- [ ] Content: previous week Life Score, streak, habits %, focus hours, net savings, journal words
- [ ] Generate via Gemini Flash, cache in weekly_digest_cache 7 days
- [ ] 1 coaching observation per user, in their selected AI tone

---

### ENG-04 — SES Template Management
- [ ] Create SES HTML templates for: waitlist_confirmation, streak_recovery, idle_day3, idle_day7, idle_day14, weekly_digest, document_expiry, post_purchase
- [ ] Template design: #0A0C10 background, #EDEDED text, #2563EB accent, system-ui font, 600px max width, single column
- [ ] Subject lines follow anti-AI-slop copy rules from TYP-12
- [ ] Every email has unsubscribe link calling DELETE /api/notifications/email-unsubscribe/:userId/:type

---

### ENG-05 — Email Unsubscribe Handler
- [ ] Create route: DELETE /api/notifications/email-unsubscribe/:userId/:type
- [ ] No auth required (user is clicking from email)
- [ ] Update user_profiles.notification_prefs, redirect to simple "You've unsubscribed" page

---

### ENG-06 — Email Deliverability Setup
- [ ] SES: DKIM signing (3 CNAME DNS records)
- [ ] DMARC DNS record: v=DMARC1; p=none; rua=mailto:dmarc@aiimin.in
- [ ] SPF record: v=spf1 include:amazonses.com ~all
- [ ] Test via mail-tester.com — target 9/10+
- [ ] Verify inbox delivery (not spam) for Gmail, Outlook, iCloud

---

### ENG-07 — Email Log Table
- [ ] Create email_logs table: id UUID, user_id TEXT, email_type TEXT, sent_at TIMESTAMPTZ, ses_message_id TEXT
- [ ] Index on (user_id, email_type, sent_at) for fast duplicate checks
- [ ] Log every email before sending. Check log before every re-engagement send.

### END-OF-SESSION — RUN BUILD CHECK NOW
Run the standard BUILD CHECK block (top of file). Do not proceed until it passes.

### SESSION END SUMMARY (fill in, then paste into AGENT NOTES at bottom of file)
```
SESSION 30 (ENG — Part 1 of 2): [DONE / BLOCKED]
Build check result: [PASS / FAIL — paste error if FAIL]
Files changed: [list]
Resume note (only if BLOCKED or partially done): [what's left]
NEXT SESSION TO RUN: 31
```

---

## SESSION 31 — PHASE ENG — Part 2 of 2: RE-ENGAGEMENT AND EMAIL FLOWS

### START-OF-SESSION CHECK
- [ ] Confirm previous session's BUILD CHECK passed (see AGENT NOTES at bottom).
- [ ] If previous session is marked [!] BLOCKED, fix that first. Do not start this session on a broken build.

### TASKS

### ENG-08 — Document Expiry Alerts (Family Vault Integration)
- [ ] Integrate with P7-02: verify the daily cron uses email_logs table from ENG-07 to prevent duplicate sends
- [ ] Verify the SES template from ENG-04 is used for expiry alerts

---

### END-OF-SESSION — RUN BUILD CHECK NOW
Run the standard BUILD CHECK block (top of file). Do not proceed until it passes.

### SESSION END SUMMARY (fill in, then paste into AGENT NOTES at bottom of file)
```
SESSION 31 (ENG — Part 2 of 2): [DONE / BLOCKED]
Build check result: [PASS / FAIL — paste error if FAIL]
Files changed: [list]
Resume note (only if BLOCKED or partially done): [what's left]
NEXT SESSION TO RUN: 32
```

---

## SESSION 32 — PHASE AW: AWS MIGRATION

### START-OF-SESSION CHECK
- [ ] Confirm previous session's BUILD CHECK passed (see AGENT NOTES at bottom).
- [ ] If previous session is marked [!] BLOCKED, fix that first. Do not start this session on a broken build.

### TASKS

### Prerequisite: P0 complete. Run in parallel with feature phases.

### AW-01 — AWS Safety Setup
- [ ] Set billing alert: $10/month via AWS Budgets
- [ ] Enable MFA on AWS root account
- [ ] Create IAM user with least-privilege permissions, store credentials in .env

### AW-02 — AWS SES Setup (Required Before ENG Phase)
- [ ] Verify aiimin.in domain in SES ap-south-1 (Mumbai)
- [ ] Verify noreply@aiimin.in as sending address
- [ ] Create server/lib/email.js with sendEmail(to, templateId, variables) function
- [ ] Test: send email to yourself from the server

### AW-03 — CloudFront for Static Assets
- [ ] S3 bucket: aiimin-static-assets, ap-south-1
- [ ] Upload: self-hosted fonts, favicon, OG images
- [ ] CloudFront distribution pointing to S3
- [ ] Cache-Control: public, max-age=31536000 on font files
- [ ] Update vercel.json to rewrite /fonts/* to CloudFront URL

### AW-04 — S3 for Family Vault Documents
- [ ] S3 bucket: aiimin-family-vault, SSE-S3 encryption, block all public access, versioning on
- [ ] Update blobService.js to use S3 for family documents
- [ ] All URLs: pre-signed, 24h expiry, never permanent

### AW-05 through AW-08 — Lambda and Cost Control
- [ ] AW-05: Sports cache refresh Lambda (EventBridge, every 2 hours)
- [ ] AW-06: AI background jobs Lambda (Monday insights, Saturday summaries, weekly habit coach)
- [ ] AW-07: Check AWS billing after each service addition
- [ ] AW-08: S3 Lifecycle Policy — S3-IA after 6 months, never auto-delete

---

### END-OF-SESSION — RUN BUILD CHECK NOW
Run the standard BUILD CHECK block (top of file). Do not proceed until it passes.

### SESSION END SUMMARY (fill in, then paste into AGENT NOTES at bottom of file)
```
SESSION 32 (AW): [DONE / BLOCKED]
Build check result: [PASS / FAIL — paste error if FAIL]
Files changed: [list]
Resume note (only if BLOCKED or partially done): [what's left]
NEXT SESSION TO RUN: 33
```

---

## SESSION 33 — PHASE MOB — Part 1 of 2: MOBILE STRATEGY

### START-OF-SESSION CHECK
- [ ] Confirm previous session's BUILD CHECK passed (see AGENT NOTES at bottom).
- [ ] If previous session is marked [!] BLOCKED, fix that first. Do not start this session on a broken build.

### TASKS

### Prerequisite: All UI phases complete.

### MOB-01 — Bottom Navigation Bar
BottomNav.jsx: fixed at bottom, visible only at width < 768px. 5 items: Home, Habits, Sports, Finance, More. "More" opens Framer Motion slide-up bottom sheet.

### MOB-02 — Hide Sidebar on Mobile
CSS: @media (max-width: 768px) { .sidebar { display: none; } }

### MOB-03 — Touch Target Audit
All interactive elements minimum 44x44px. Add min-w-[44px] min-h-[44px] to all icon buttons.

### MOB-04 — Tab Swipe Navigation
Sports page (3 tabs) and Journal page (5 modes): swipe left = next tab, swipe right = previous tab. Use react-swipeable-list (already installed in UX-17) or @use-gesture/react.

### MOB-05 — Horizontal Overflow Audit
Run overflow detection script in browser console on each page. Fix every element causing horizontal scroll.

### MOB-06 — PWA Manifest
- [ ] Create frontend/public/manifest.json with AIIMIN name, start_url=/overview, display=standalone, colors
- [ ] Create icons at 192px and 512px
- [ ] Add to index.html: manifest link and apple-touch-icon
- [ ] theme-color meta tag: #2563EB

### MOB-07 — Install Prompt
After 3 page visits (localStorage count): show dismissable bottom banner. Android: beforeinstallprompt. iOS: show manual instructions.

### MOB-08 — Input Font Size Verification
- [ ] Verify all inputs have font-size: 16px on mobile via global CSS rule
- [ ] @media (max-width: 768px) { input, textarea, select { font-size: 16px !important; } }

### MOB-09 — Mobile QA Pass
Test all 12 pages at 375px viewport. Every page must be fully usable with no horizontal scroll and no broken layouts.

### END-OF-SESSION — RUN BUILD CHECK NOW
Run the standard BUILD CHECK block (top of file). Do not proceed until it passes.

### SESSION END SUMMARY (fill in, then paste into AGENT NOTES at bottom of file)
```
SESSION 33 (MOB — Part 1 of 2): [DONE / BLOCKED]
Build check result: [PASS / FAIL — paste error if FAIL]
Files changed: [list]
Resume note (only if BLOCKED or partially done): [what's left]
NEXT SESSION TO RUN: 34
```

---

## SESSION 34 — PHASE MOB — Part 2 of 2: MOBILE STRATEGY

### START-OF-SESSION CHECK
- [ ] Confirm previous session's BUILD CHECK passed (see AGENT NOTES at bottom).
- [ ] If previous session is marked [!] BLOCKED, fix that first. Do not start this session on a broken build.

### TASKS

## LAUNCH CHECKLIST
### Prerequisite: ALL phases above complete. No exceptions.

### LC-01 — Security Final Audit
- [ ] IDOR test as non-admin user: attempt to access another user's resource. Must return 404 or 403.
- [ ] SQL injection test: POST with malicious input. Sanitizer blocks it.
- [ ] npm audit in server/ — zero critical vulnerabilities
- [ ] grep -r "sk-\|nvapi-\|AIzaSy\|service_role" frontend/ — zero results

### LC-02 — Performance Baseline
- [ ] Lighthouse on production: landing page, overview, habits, finance
- [ ] Targets: Performance 80+, Accessibility 90+, Best Practices 95+, SEO 90+

### LC-03 — Database Backup Verification
- [ ] Supabase automatic backups confirmed enabled
- [ ] Manual backup test restore performed

### LC-04 — Environment Variables Final Check
All 16 environment variables verified in Vercel production (listed in previous plan — check against that list).

### LC-05 — Anti-AI-Slop Final Visual Audit
Walk through every page. Check all 10 tells from researchbased.md 4.2:
- [ ] No purple/teal gradients
- [ ] No "Transform your", "Get Started", "Learn More" copy
- [ ] No emoji feature icon grids
- [ ] No Poppins/Nunito/Quicksand fonts
- [ ] No fake testimonials or fake social proof numbers
- [ ] No popups in first 30 seconds
- [ ] All button text answers "What happens when I click this?"
- [ ] Section padding varies between sections

### LC-06 — Full Functional Smoke Test (Production, Fresh Account)
- [ ] Sign up via email and via Google OAuth
- [ ] Complete full onboarding including sports preferences and AI tone
- [ ] Day 1 experience card appears correctly
- [ ] Create habit, mark complete, streak starts
- [ ] Write journal entry, AI analysis chip appears
- [ ] Log transaction, Finance updates
- [ ] Start focus session with pre-session framing, complete it
- [ ] Add family member with document
- [ ] Run Lab typing test
- [ ] Check Overview — all widgets load with real user data
- [ ] Check Account page — all 7 sections load and save correctly

### LC-07 — Email System Test
- [ ] Submit waitlist form, verify confirmation email (not spam)
- [ ] Manually trigger streak recovery email for test user
- [ ] Verify inbox delivery for Gmail, Outlook, iCloud

### LC-08 — Remove Waitlist Mode
- [ ] Change VITE_WAITLIST_MODE=false in Vercel
- [ ] Redeploy, verify main app accessible

### LC-09 — Error Monitoring
- [ ] Sentry configured for frontend and server
- [ ] Alert set for 5+ errors/minute

### LC-10 — Analytics Events
- [ ] GA4 tracking page views on every navigation
- [ ] Custom events firing: habit_completed, journal_saved, focus_session_started, upgrade_clicked, upgrade_completed

### LC-11 — Status Page
- [ ] status.aiimin.in live via Instatus (free tier)
- [ ] Monitors for: production site, Supabase, AI endpoint
- [ ] Linked in app footer

### LC-12 — Onboarding Complete Test
- [ ] Fresh account, complete all 9+ steps
- [ ] All preferences saved, arrive at Overview with data present

### LC-13 — Legal Complete Check
- [ ] All 4 legal pages accessible
- [ ] Privacy policy mentions AI journal analysis, DPDPA 2023
- [ ] Data deletion tested end-to-end with throwaway account

### LC-14 — Launch Day Protocol
- [ ] Supabase connection count monitored in real-time (stay under 15)
- [ ] Vercel function logs open and watched
- [ ] Upstash cache hit rate monitored (target 40%+ within first hour)
- [ ] AWS billing dashboard open
- [ ] Rollback ready: VITE_WAITLIST_MODE=true in Vercel (no redeployment needed)

---

### END-OF-SESSION — RUN BUILD CHECK NOW
Run the standard BUILD CHECK block (top of file). Do not proceed until it passes.

### SESSION END SUMMARY (fill in, then paste into AGENT NOTES at bottom of file)
```
SESSION 34 (MOB — Part 2 of 2): [DONE / BLOCKED]
Build check result: [PASS / FAIL — paste error if FAIL]
Files changed: [list]
Resume note (only if BLOCKED or partially done): [what's left]
NEXT SESSION TO RUN: LAUNCH CHECKLIST
```



---

## AGENT NOTES — UPDATE THIS AFTER EVERY SESSION, READ THIS FIRST IN EVERY NEW CHAT

```
LAST SESSION RUN: Launch completion pass (Supabase MCP + fixes)
LAST SESSION STATUS: DONE (all code + DB migrations applied)
LAST BUILD CHECK RESULT: PASS — frontend npm run build (June 30, 2026)
NEXT SESSION TO RUN: Manual launch only (see below)
CURRENT BLOCKERS (manual only):
  - P0-01: Add aiimin.in domains in Clerk dashboard
  - Env vars in Vercel: STRIPE_*, CRON_SECRET, AWS_SES_SMTP_*, REACT_APP_GA_MEASUREMENT_ID
  - AW-03/04: CloudFront + S3 family vault (optional)
  - LC-02/06/07/08: Prod Lighthouse, smoke test, email deliverability test, WAITLIST_MODE=false
SUPABASE MCP APPLIED (2026-06-30):
  - email_billing_columns_026: email_logs, subscription_tier, stripe_*, users.last_seen ✓
  - rls_typing_and_lab_tables: typing_* tables RLS ✓
  - email_logs_rls_deny_anon ✓
  Verified: email_logs=true, subscription_tier=true, last_seen=true
CODE FIXES THIS PASS:
  - reEngagementService: fixed streak recovery (last_reset_at, not ended_at)
  - Removed hardcoded service role key from supabase-mcp.js
  - Migration files 026/027 synced with production
NOTES:
  npm audit: 0 critical (4 high in xlsx/undici — known, no fix for xlsx)
  Clerk: use REACT_APP_GUEST_BYPASS=true locally only
  All 34 plan sessions implemented in codebase
```

Paste the SESSION END SUMMARY from the session you just finished here,
overwriting the block above, before closing each Cursor chat.

---


## APPENDIX — SCIENCE REFERENCES

| Feature | Research Reference | Year |
|---|---|---|
| Streak tracking | Graybiel MIT — basal ganglia habit circuits | 1990s-2010s |
| Urge surfing | Marlatt MBRP; Bowen meta-analysis | 1985; 2014 |
| HALT check | Clinical addiction medicine standard | established |
| Compassionate restart | Neff and Germer self-compassion | 2012 |
| Replacement habit | Pavlov to Skinner behavioral conditioning | classical |
| Habit stacking | Gollwitzer implementation intentions (94 studies) | 1999 |
| Chain wall | Kahneman and Tversky loss aversion | 1979 |
| Habit timeline | Lally et al. UCL: 18 to 254 days, avg 66 | 2010 |
| Streak milestones | Skinner variable ratio reinforcement | 1938 |
| Free write | Pennebaker expressive writing (200+ studies) | 1986-2022 |
| CBT Thought Record | Aaron Beck; Cuijpers meta-analysis (115 studies) | 1970s; 2012 |
| Morning Pages | Pennebaker plus Oettingen mental contrasting | NYU |
| Weekly review | US Army AAR methodology; Amabile and Kramer HBS | 1970s; 2011 |
| Emotion labeling | Park et al. — amygdala activation reduction | 2016 |
| Pomodoro | Zeigarnik Effect; DeskTime research | 1927; 2014 |
| Pre-session framing | Gollwitzer implementation intentions | 1999 |
| Post-session reflection | Kolb Experiential Learning Cycle | 1984 |
| Deep Work and Flow | Csikszentmihalyi | 1990 |
| Safe-to-Spend | Thaler mental accounting (Nobel 2017) | 1980s |
| Emotion tagging finance | Lerner et al. Harvard Kennedy School | 2013 |
| Subscription audit | West Monroe survey: 197% underestimate | 2022 |
| SIP visualization | Hershfield et al. Northwestern | 2011 |
| What-If Simulator | Gary Klein prospective hindsight | 1989 |
| Domain balance | Journal of Happiness Studies meta-analysis | 2005 |
| Progress Principle | Amabile and Kramer 12000 diary entries | 2011 |
| Self-Determination Theory | Deci and Ryan | 1985-2020 |
| Cognitive load | Millers Law; Gloria Mark context-switching cost | 1956; 2008 |
| N-Back training | Jaeggi et al. Michigan | 2008 |
| Spaced Repetition | Ebbinghaus forgetting curve; FSRS algorithm | 1885; 2023 |
| Deliberate Practice | K. Anders Ericsson | 1993 |
| Reaction time and typing | Salthouse processing speed biomarker | 1996 |
| Day 1 activation | Amplitude and Mixpanel behavioral analytics | 2020s |
| Streak recovery timing | Fogg Behavior Model | ongoing |
