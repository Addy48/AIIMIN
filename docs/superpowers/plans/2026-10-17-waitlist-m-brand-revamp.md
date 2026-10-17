# Waitlist, /m and /brand revamp — plan

> **For agentic workers:** REQUIRED SUB-SKILL: use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to carry this out task by task. Steps use checkbox (`- [ ]`) syntax. **Research and execution start only when the owner says usage is available.** This file is the plan only.

**Goal:** Turn three pages of aiimin.in into AIIMIN's best growth surfaces: `/waitlist` (sign up or log in during the beta), `/m` (the app showcase) and `/brand` (brand book and press kit). Each must be on-brand with the light v4 app, honest, fast, measured, and better than the top brands we compare against.

**Architecture:**
- **Phase A** captures what exists today (screenshots, copy, speed, funnel).
- **Phase B** researches about 40 reference sites with agent-reach and the built-in browser.
- **Phase C** writes the strategy and messaging (positioning, taglines, proof, objections).
- **Phase D** specifies each page section by section.
- **Phases E and F** build them in `frontend/` on a branch, with tests.
- **Phase G** wires up measurement.
- **Phase H** ships through a Vercel preview, then to `main` only when the owner says "merge to main".

**Tech stack:**
- React 19 + Tailwind (`frontend/`), deployed on Vercel from `main`; Node API at `api.aiimin.in`; Supabase auth/DB (shared by local and live).
- Playwright harness in `~/Desktop/aiimin/09-tools/web-playwright-tests`.
- The built-in browser for screenshots.
- agent-reach for research.
- The Android emulator + demo data for fresh app screenshots.

---

## 0. Read this first (summary in plain words)

**What's wrong today (owner's words plus known facts):**
- **/m is outdated.** It's mostly black while the app is now light, the screenshots show the old app, and the copy and data aren't good enough for marketing.
- **/waitlist works but doesn't convert.** It's where people sign up or log in to get beta access to the website, and it needs a full revamp.
- **/brand needs to become a real brand book and press kit.** It should match the wordmark (Bodoni Moda), the logo animation and the light palette.
- **Out of scope:** the main `aiimin.in` home page (a later pass).

**What we'll produce:**
1. **A "before" file** for each page: screenshots at 3 widths × light/dark, the full copy, Lighthouse scores, and the funnel numbers we can get.
2. **A research pack:** about 40 reference sites (§4), screenshotted and broken down section by section, with what to copy and what to avoid.
3. **A messaging doc:** positioning, audience, message house, **refined taglines** (including "One screen, every day."), proof points, objection answers, voice rules.
4. **Three page specs:** wireframe in words, every section, the final copy, the assets list, and motion.
5. **New, honest app screenshots and a short screen recording** from the current v4 build.
6. **Built pages** on a branch, with tests, accessibility, SEO, analytics, a preview link for the owner, then release.

**What we won't do without the owner's OK:**
- change sign-up or login logic or the database;
- send any email or post to social media;
- merge to `main`;
- invent numbers (user counts, ratings, press logos).

---

## 1. Scope

| In scope | Out of scope (this pass) |
|---|---|
| `/waitlist`: hero, sign-up/log-in form UX, founding perks, social proof, FAQ, light/dark parity, mobile layout, speed, events | Main home page `/` and other marketing pages |
| `/m`: full redesign as the app showcase in light theme, new screenshots/video, download path (APK now, Play Store later), FAQ | Changing auth or the database schema (UI only unless the owner approves) |
| `/brand`: brand book + press kit (logo, wordmark, colours, type, motion, voice, taglines, Raahi, downloads) | Paid ads, email sequences, social posting (planned, not run) |
| Taglines and the core message used on all three pages and in the app's opening line | Play Store listing assets (a follow-up, reusing Phase C copy) |
| SEO, OG images, schema and metadata for the three routes | Rewriting `/m` web capture features beyond what the showcase needs |

**First check in Task A0:** confirm which component renders `/m` (`frontend/src/App.js:229`). The owner calls `/m` "the app showcase". The repo also has `AndroidApp.jsx` (the `/app` route) and the older `/m` capture view. The plan treats the showcase as **one page**; if two routes exist, `/m` gets the new showcase and `/app` redirects to it (owner to confirm).

---

## 2. Files we'll touch (known now; confirmed in A0)

| File | Today | Change |
|---|---|---|
| `frontend/src/pages/WaitlistLanding.jsx` | Waitlist page | Restructure to the new section order (§6.1) |
| `frontend/src/components/waitlist/WaitlistForm.jsx` | Sign-up / log-in form (OS-ID already uppercases on line 410) | Form CRO: one task per step, live OS-ID preview, clearer errors, log-in/sign-up toggle |
| `frontend/src/components/waitlist/WaitlistHeroAside.jsx`, `WaitlistScreenshotStudio.jsx`, `WaitlistSocialProof.jsx`, `WaitlistFoundingPerks.jsx`, `WaitlistQuickFeedback.jsx`, `WaitlistThemeSync.jsx`, `landing/*` | Waitlist parts | Keep, rewrite or delete per §6.1 |
| `frontend/src/pages/AndroidApp.jsx` (+ the `/m` route component) | App page, dark, old screenshots, "v2.0.4 / 44.2 MB" copy | New light showcase (§6.2) |
| `frontend/src/pages/Brand.jsx`, `frontend/src/pages/brandPage.css` | Brand page | Brand book + press kit (§6.3) |
| `frontend/public/` | `og-image-v2.png`, `aiimin-v2-debug.apk` (46 MB, in git) | New OG images per route; new screenshots in `public/showcase/`; the APK served from GitHub Releases (the master plan's Phase 13 decision); remove the 46 MB file from `public/` |
| `frontend/src/components/brand/Wordmark.jsx`, `archBracketMark.js` | Wordmark (Bodoni Moda 700, -0.03em) | Shared by all three pages; add the animated mark (web version of the app's BootMark) |
| `frontend/public/index.html`, route metadata helper | Fonts, meta | Per-route title, description, OG and JSON-LD |
| New: `frontend/src/marketing/copy.js` | — | **Single source** for taglines and page copy, so the three pages and the app never disagree |
| New: `frontend/src/marketing/track.js` | — | Thin event helper (§7) |
| Tests: `frontend/src/**/__tests__/*` + `09-tools/web-playwright-tests/tests/marketing.spec.js` | — | Render tests, form behaviour, visual snapshots at 3 widths |

---

## 3. Skills to use (and exactly what for)

Paths are in `~/Desktop/skills-library/<Category>/<skill>/SKILL.md`. Each skill is read before its task, and its checklist is pasted into that task's notes.

### Research and competitive
| Skill | Use |
|---|---|
| **agent-reach** (own + library) | Pull pages, Reddit/X threads, YouTube reviews and GitHub for the §4 sites and for what people say about waitlists and life apps |
| Research/**market-research**, **product-research**, **deep-research**, **research** | Structure for the research pack: questions, sources, synthesis |
| Product/**competitive-teardown**, Business-Growth/**competitive-landscape**, Marketing/**competitor-alternatives** | Section-by-section teardown of each reference page, a positioning map, and a "why AIIMIN vs X" grid |
| Product/**ux-researcher-designer**, Product/**research-summarizer** | Turn findings into page requirements |
| UI-Design/**explain-interface** | How a reference effect is built (scroll, sticky phone, video) |

### Strategy and messaging
| Skill | Use |
|---|---|
| Marketing/**marketing-context** | One context file: product, audience, voice. Every later skill reads it |
| Marketing/**marketing-strategy-pmm** | Positioning statement, audience segments, message house |
| Marketing/**marketing-psychology** | Ethical persuasion: specificity, loss aversion for "founding" perks, social proof without lies |
| Marketing/**copywriting**, **copy-editing**, Content-Docs/**avoid-ai-writing**, Marketing/**content-humanizer** | Every headline, line and button; strip AI-sounding filler |
| Marketing/**brand-guidelines**, UI-Design/**brand-guidelines**, **brandkit**, **brand-landingpage** | The /brand page content: logo rules, colour, type, voice, do/don't, downloads |
| Marketing/**launch-strategy**, **referral-program** | Waitlist mechanics: founding cohort, invite and skip-the-line, beta access |
| Marketing/**pricing-strategy** | How the Free/Plus/Pro/Family prices and the free beta show on the pages |

### Conversion (CRO)
| Skill | Use |
|---|---|
| Marketing/**page-cro**, **landing** | Above-the-fold, section order, the CTA hierarchy for /waitlist and /m |
| Marketing/**signup-flow-cro**, **form-cro** | OS-ID + PIN sign-up and log-in: fields, steps, errors, trust lines |
| Marketing/**onboarding-cro** | What happens right after sign-up (first web screen, email, the app download step) |
| Marketing/**popup-cro** | Rules: no popups on these pages unless a test proves they help |
| Marketing/**ab-test-setup**, Product/**experiment-designer** | Two tests to run after launch (hero line, form layout) |

### Design and build
| Skill | Use |
|---|---|
| UI-Design/**design-taste-frontend**, **high-end-visual-design**, **frontend-design**, **impeccable** | Visual direction that doesn't look templated, matching the app's warm cream + ink + one orange |
| UI-Design/**better-typography**, **better-layout**, **better-colors**, **better-ui**, **better-writing** | Typography scale (Bodoni Moda only for the wordmark; Funnel/Golos to match the app), grid, contrast |
| UI-Design/**emil-design-eng**, **animate**, **improve-animations**, **fixing-motion-performance** | Logo assembly animation on the web, phone scroll story, reduced motion |
| UI-Design/**responsive-design**, **mobile-android-design** | Phone-first layouts; device frames for Android screenshots |
| UI-Design/**wcag-audit-patterns**, **better-accessibility**, **fixing-accessibility** | AA contrast, focus, labels on the form |
| UI-Design/**fixing-metadata**, Marketing/**seo-audit**, **schema-markup**, **aeo** | Titles, descriptions, OG/Twitter cards, `SoftwareApplication` and `Organization` JSON-LD; answer-engine-friendly FAQ |
| Marketing/**app-store-optimization** | Screenshot captions and order, reused later for the Play Store |
| Marketing/**analytics-tracking** | Event plan (§7) |
| Marketing/**social-content**, **video-content-strategist** | Shareable OG cards, a 20-second app reel for /m (planned assets, not posted) |

### Own capabilities
- **Built-in browser:** full-page screenshots, mobile emulation, light/dark, reading pages.
- **Playwright harness:** repeatable screenshots, visual diffs, form tests.
- **Lighthouse via the CLI:** speed, SEO and accessibility scores.
- **Android emulator + demo data:** new app screenshots and screen recordings with honest sample data (Meera).
- **Artifact:** a private review page for the owner showing before/after side by side.

---

## 4. Research scope (agent-reach + browser) — run later

### 4.1 Reference sites to capture (desktop 1440, tablet 834, phone 390; light and dark where they have it)

**Waitlist and beta access pages** (how they sell an unreleased product and get the sign-up):

| Site | Why |
|---|---|
| Linear (launch era) | The gold standard for a calm, crafted launch page |
| Arc / The Browser Company | Invite-only waitlist, member referral |
| Superhuman | Waitlist with an onboarding call, exclusivity done well |
| Notion Calendar (Cron) launch | Waitlist for a productivity app |
| Raycast | Beta page, community proof |
| Dia browser | Recent waitlist with video |
| Granola | Simple, honest beta page |
| Things 3 | Product-led calm |
| Sunsama | Trial onboarding, daily-ritual story |
| Robinhood (original waitlist) | Position-in-line referral mechanics |

**App showcase pages** (an Android/iOS app on the web):

| Site | Why |
|---|---|
| Structured, Tiimo | Day planners; light, soft, visual |
| Opal | Screen time, data-led storytelling |
| Finch | Character/mascot used in marketing |
| Copilot Money, Monarch | Money charts on a marketing page |
| CRED, Jupiter, Fi, Groww | Indian fintech audience, trust and tone |
| Nothing (phone + Nothing OS) | Minimal hardware-grade presentation |
| Todoist, Bear, Apple Journal page | Feature storytelling, screenshots in frames |
| Headspace, Calm | Calm tone, illustration with UI |

**Brand books and press kits:**

| Site | Why |
|---|---|
| Linear brand, Stripe press/brand, Notion brand assets, Vercel design/brand, Spotify for Brands, Airbnb design, Nothing brand, Figma brand, Raycast press kit | Structure, downloads, logo rules, voice sections |

**Indian consumer tone:** Zepto, Swiggy, Zomato, CRED (copy and microcopy only).

### 4.2 What to capture per site
1. Full-page screenshots at 3 widths.
2. **Section map:** the order of sections and what each one does (hook, proof, feature, objection, CTA).
3. Headline and subhead **verbatim, under 15 words each** (copyright rule: short quotes, cited).
4. CTA labels and how many CTAs there are; form fields and steps.
5. Proof used (numbers, logos, quotes) and whether it's verifiable.
6. Visual system: type pairing, colour count, image style, device frames, motion.
7. Speed: a Lighthouse quick run on the public URL (performance, accessibility, SEO).
8. **What AIIMIN should copy, adapt or avoid**, one line each.

### 4.3 Voice-of-customer sources (agent-reach)
- **Reddit:** r/productivity, r/getdisciplined, r/IndiaInvestments, r/personalfinanceindia, r/androidapps, threads about "life OS", habit apps, budgeting from SMS, screen-time apps. Look for jobs, pains and exact phrases.
- **X/Twitter:** reactions to waitlists (what feels manipulative vs exciting), Indian app launches.
- **YouTube:** reviews of Structured, Tiimo, Opal, CRED, which show what reviewers praise.
- **Play Store reviews** of competitors (public pages), for phrases about privacy, SMS reading and clutter.
- **Output:** a phrase bank of real words users use, which feeds the copy.

### 4.4 Rules for research
- Public pages only; no logins, no scraping behind paywalls (Mobbin/Screenlane need a login, so they're skipped).
- Store everything in `~/Desktop/aiimin/06-research/web-pages-2026-10/` (screenshots + `teardown.md` per site).
- Short quotes only, with source links; we don't copy anyone's design or copy wholesale.

---

## 5. Strategy and messaging (Phase C output: `03-plans/current/aiimin-messaging-2026-10.md`)

1. **Audience (to be validated by research):**
   - **Primary:** Indian 18–30s with busy, self-managed lives (students, early-career professionals, freelancers) who already juggle a planner app, a budget sheet and a screen-time app.
   - **Secondary:** people who look after family papers (insurance, IDs).
2. **Jobs:** "Know what today needs", "see where my money went without typing it", "find the policy in 10 seconds", "use my phone less without guilt".
3. **Positioning draft:** *For people running their own lives, AIIMIN is the one calm screen for your day, money and papers. It reads what your phone already knows and never compares you with anyone but you.*
4. **Message house:**
   - **Roof:** "One screen, every day."
   - **Pillars:**
     - Day (minimums, plan, focus)
     - Money (bank SMS read on the phone, a pace line, no typing)
     - Papers (vault, expiry, emergency card)
     - Phone (honest screen time)
   - **Foundation:** private by default (read on the phone, no ads, no loans, nothing sold).
5. **Tagline candidates** (tested later with an A/B test and 10 people):

   | Tagline | Notes |
   |---|---|
   | One screen, every day. | Current; the owner's pick |
   | Your day, your money, your papers. One calm place. | |
   | Everything your day needs. Nothing it doesn't. | |
   | The quiet way to run your life. | |
   | Life, on one screen. | |
   | Know today. Spend knowingly. Keep what matters. | |

   Each is scored against: clarity in 3 seconds, memorability, fit with the brand (calm, honest), Hindi/Hinglish translatability, and not already owned by a competitor (agent-reach check).
6. **Proof points, honest only:**
   - screen time matches Android to within about 1 minute (measured);
   - bank alerts read on the phone;
   - 58 screens tested with no crash;
   - the beta is free.
   - **No invented user counts.** Real waitlist numbers appear only if the owner approves showing them.
7. **Objections to answer on the pages:**
   - "Does it read my SMS / is it safe?"
   - "Is it free?"
   - "Why an APK, not Play Store?"
   - "Android only?"
   - "What happens to my data?"
   - "Will it nag me?"
8. **Voice rules:** short, specific, warm, no hype words ("revolutionary", "seamless"), Indian English (₹, "on this phone").

---

## 6. Page specs (Phase D; final copy written in Phase C, sections fixed here)

### 6.1 `/waitlist` — "get into the beta"

**Purpose:** a visitor understands AIIMIN in 5 seconds and either signs up (OS-ID + PIN) or logs in, then lands in the beta website.

**Primary metrics:**
- visit → form start;
- form start → completed sign-up;
- returning users → log-in success.

**Sections, in order:**
1. **Hero:** the animated mark assembling (web BootMark, 1 s, skipped with reduced motion) + wordmark + tagline + one line of value. **The form sits in the hero on desktop and directly under it on phones.** A Sign up / Log in toggle sits above the form.
2. **Form (signup-flow-cro, form-cro):**
   - Fields: name, email, OS-ID (live capitals preview "AADI2004", rules shown as you type: 8 characters, up to 4 numbers, availability check), PIN (6 digits, show/hide), consent line.
   - One primary button; inline errors under fields; no CAPTCHA unless abuse appears.
   - After submit: a success state with "What happens next" (beta access, app download link, founding perks).
3. **"What you get in the beta":** 3 cards max, each with a real light-theme app screenshot.
4. **Founding perks:** honest and specific (e.g. "Founding members keep Plus free for the first year", **only if the owner confirms**).
5. **Privacy promise:** 3 short lines plus a link to the privacy page.
6. **FAQ:** the objections from §5.7, in an AEO-friendly format with `FAQPage` schema.
7. **Footer CTA** repeating the form button; links to /m and /brand.

**Removals:** anything not true today, duplicate CTAs, dark-only styling (light default, dark parity via the existing theme sync).

**States to design:** empty, typing, OS-ID taken, server error, offline, already registered (switch to log in), success, logged-in visitor (redirect to the app).

### 6.2 `/m` — the app showcase

**Purpose:** show the real v4 app and get Android users to install it, with honest data; later, the Play Store badge.

**Primary metrics:**
- visit → download tap;
- download → install guide opened;
- scroll depth.

**Sections, in order:**
1. **Hero (light):** a phone frame with the **live-looking Today screen** (fresh screenshot), headline + one line, buttons "Download for Android (beta)" + "Join the waitlist". Small print: version, size and date pulled from the release, never hard-coded.
2. **"A day with AIIMIN" scroll story** (sticky phone, the screen changes as you scroll):
   - morning: Today + minimums;
   - capture: "spent 240 on lunch, call Ravi at 5" becomes chips;
   - afternoon: Money pace chart;
   - evening: wrap-up + Phone day;
   - night: the arc with the moon.
   - On phones this becomes a simple vertical sequence.
3. **Four pillars** (Day, Money, Papers, Phone): one real screenshot each, and one proof line.
4. **Privacy, explained:** what stays on the phone and what syncs (copy from the app's own screens).
5. **Raahi teaser:** only after the owner approves the companion (decision in the app plan §8).
6. **Install guide** for the APK: 3 steps with screenshots ("Allow from this source", install, open). It disappears when the Play Store link exists.
7. **FAQ + footer CTA.**

**Assets:**
- 8–10 new screenshots from the emulator with the demo data, at 1080×2412, framed as a Pixel/Nothing-style device;
- one 20-second screen recording (opening animation → Today → capture → Money);
- an OG image.
- **All taken from the current build, light theme.**

**Data honesty:** the demo person is "Meera" with plausible, messy numbers (₹18,420 spent, 1 of 3 minimums), no fake reviews and no fake download counts.

### 6.3 `/brand` — brand book and press kit

**Purpose:** one page a journalist, partner or designer can use; it also shows the craft behind AIIMIN.

**Sections:**
1. **The mark:** the logo assembling (animation) + the story (arc = the day, peak = the A, sun = now).
2. **Wordmark:** Bodoni Moda 700, -0.03em; clear space; minimum size; on cream, on ink.
3. **Colours:** cream #F5F3EE, surface #FBFAF7, ink #1A1916, orange #FF6B35 (now / needs you), done green #2F6B4F, gold #B8893A (Money), with contrast ratios and what each colour means.
4. **Type:** Funnel Display (numbers, titles), Golos Text (reading), Bodoni Moda (wordmark only); a sample scale.
5. **Motion:** the logo build, the Money pace line, calm rules (reduced motion respected).
6. **Voice:** taglines, the do/don't word list, sample microcopy from the app.
7. **Raahi** (if approved): poses, the minimal 28dp glyph, rules.
8. **App icon and screenshots.**
9. **Downloads:** a zip with SVG/PNG logos (light/dark), the wordmark, colour swatches (ASE/JSON), screenshots, and a fact sheet (one paragraph, founder name, contact email).
10. **Usage do/don't:** stretched logo, wrong colours, effects.

---

## 7. Measurement (Phase G)

**Events,** sent via `frontend/src/marketing/track.js` to the existing analytics. If none exists, the owner picks between Vercel Web Analytics and Plausible; no tracking pixels without approval.

| Event | When |
|---|---|
| `wl_view` | Waitlist page shown |
| `wl_form_start` | First field touched |
| `wl_osid_checked` | OS-ID availability checked (`{available}`) |
| `wl_submit` | Form submitted (`{mode: signup|login}`) |
| `wl_success` | Sign-up or log-in succeeded |
| `wl_error` | Error shown (`{code}`) |
| `m_view` | /m shown |
| `m_download_click` | Download button tapped |
| `m_install_guide_open` | Install guide opened |
| `m_scroll_50` / `m_scroll_90` | Scrolled half / most of the page |
| `brand_view` | /brand shown |
| `brand_download` | A download taken (`{asset}`) |

**Tests after launch:**
- (a) hero line: "One screen, every day." vs the best alternative from §5.5;
- (b) form inline in the hero vs a "Join" button that opens it.
- Minimum sample before deciding: 500 visits per arm (ab-test-setup skill).

**Targets** (set from the Phase A baseline):
- visit → sign-up conversion up by 50% relative;
- /m download tap rate over 25%;
- Lighthouse on phone ≥ 90 performance and ≥ 95 accessibility and SEO.

---

## 8. Tasks

### Phase A — capture today (≈ 0.5 day)
- [ ] **A0** Confirm the routes: which component renders `/m`, `/app` and `/waitlist` (`frontend/src/App.js:203,229,290`). Write the result at the top of this plan.
- [ ] **A1** Screenshots with the built-in browser (public URLs, no login), saved to `05-design/screenshots/web-before-2026-10/`:
  - `https://www.aiimin.in/waitlist`, `/m` and `/brand`;
  - at 1440, 834 and 390 px; light and dark; full page.
- [ ] **A2** Copy inventory: every headline, line, button and FAQ per page into `before-copy.md`.
- [ ] **A3** Lighthouse (phone and desktop) for the 3 URLs; save the JSON and the scores table.
- [ ] **A4** Funnel baseline: waitlist sign-ups per day from Supabase (read-only count query, the owner runs it or approves it), plus any analytics that exist.
- [ ] **A5** List every claim on the pages and mark each true/false/unknown (e.g. "v2.0.4", "44.2 MB", user counts).

### Phase B — research (≈ 1 day, when usage allows)
- [ ] **B1** Read the agent-reach SKILL.md; run `agent-reach doctor --json`; confirm the web, Reddit, X and YouTube channels work.
- [ ] **B2** Capture the §4.1 sites (screenshots + section map) into `06-research/web-pages-2026-10/<site>/`.
- [ ] **B3** Teardowns with competitive-teardown and page-cro checklists; one `teardown.md` per site.
- [ ] **B4** Voice of customer (§4.3), building the phrase bank `06-research/web-pages-2026-10/voice-of-customer.md`.
- [ ] **B5** Synthesis: the top 15 patterns for waitlist pages, the top 15 for app showcases, the top 10 for brand pages, each with "adopt / adapt / avoid".

### Phase C — strategy and messaging (≈ 0.5 day)
- [ ] **C1** `marketing-context` file (product, audience, voice, proof, constraints).
- [ ] **C2** Positioning + message house (marketing-strategy-pmm).
- [ ] **C3** Taglines: generate about 20, score them against the §5.5 criteria, shortlist 3, and run an agent-reach check that none is owned by a competitor.
- [ ] **C4** Final copy for all three pages in `frontend/src/marketing/copy.js` (copywriting → copy-editing → avoid-ai-writing pass).
- [ ] **C5** The owner approves the taglines and copy (blocking).

### Phase D — design specs and assets (≈ 1 day)
- [ ] **D1** A visual direction board for light theme (cream, ink, one orange), checked against the app; dark mode as a secondary option.
- [ ] **D2** Section wireframes in words + layout grid for each page at 390, 834 and 1440.
- [ ] **D3** New app assets: emulator with demo data, 10 screenshots, a 20 s screen recording, device frames, OG images ×3.
- [ ] **D4** The brand download kit: logo SVG/PNG, wordmark, swatches, fact sheet.
- [ ] **D5** The owner reviews a private Artifact page with before/after mockups (blocking).

### Phase E — build `/waitlist` (≈ 1.5 days), on branch `feat/web-waitlist-m-brand` from `main`
- [ ] **E1** Shared: `copy.js`, `track.js`, the web BootMark component (`frontend/src/components/brand/BootMark.jsx`, CSS/SVG, reduced motion).
- [ ] **E2** Hero + form restructure (WaitlistLanding.jsx, WaitlistForm.jsx); keep the API calls as they are. Write render tests first: the OS-ID preview uppercases, errors show under fields, and the log-in toggle switches modes.
- [ ] **E3** Benefits, perks, privacy, FAQ (+ FAQPage JSON-LD).
- [ ] **E4** All form states (§6.1); light/dark; 390-px layout.
- [ ] **E5** Playwright: visual snapshots at 3 widths and the form flow (sign-up up to submit, mocked; no real account created).

### Phase F — build `/m` and `/brand` (≈ 2 days)
- [ ] **F1** `/m` hero with the release-driven version/size (reads the latest GitHub Release, falls back to text).
- [ ] **F2** The "day with AIIMIN" scroll story (IntersectionObserver, transform/opacity only, a vertical sequence on phones).
- [ ] **F3** Pillars, privacy, install guide, FAQ; remove the 46 MB APK from `public/` and link GitHub Releases.
- [ ] **F4** `/brand` sections 1–10 + downloads zip in `public/brand/`.
- [ ] **F5** Metadata: titles, descriptions, OG/Twitter, `SoftwareApplication` and `Organization` JSON-LD (schema-markup, fixing-metadata).
- [ ] **F6** Accessibility pass (wcag-audit-patterns): contrast AA, focus order, labels, alt text, reduced motion.

### Phase G — measure (≈ 0.5 day)
- [ ] **G1** Wire the §7 events; verify them in the analytics debug view.
- [ ] **G2** Set up the two A/B tests behind a flag (off until the owner starts them).

### Phase H — ship (≈ 0.5 day)
- [ ] **H1** Lighthouse ≥ the targets in §7; fix regressions.
- [ ] **H2** Push the branch; the Vercel preview URL goes to the owner with a before/after Artifact.
- [ ] **H3** On the owner's "merge to main": merge, verify live, and add a line to `STATUS.md`.
- [ ] **H4** One week later: read the funnel numbers vs the baseline and decide on the A/B tests.

---

## 9. Acceptance criteria
- All three pages are light by default, match the v4 app palette and fonts, and every screenshot comes from the current build.
- No false claim anywhere (A5 list all resolved); version and size come from the release, not hard-coded.
- /waitlist: the form works at 390 px, the OS-ID uppercases live, all states designed, `FAQPage` schema valid.
- /m: the download path works (APK from GitHub Releases now), the install guide is clear, the scroll story is smooth (no jank, reduced motion respected).
- /brand: the downloads zip works; logo rules, colours (with contrast) and voice are complete.
- Lighthouse phone: Performance ≥ 90, Accessibility ≥ 95, SEO ≥ 95 on all three.
- Events fire for every §7 item; the owner has a before/after review page.

## 10. Decisions needed from the owner (before Phase C ends)
1. Founding perks to promise (e.g. Plus free for a year for founding members), or none.
2. Whether to show real waitlist numbers ("1,240 people waiting"); only if true.
3. `/app` vs `/m`: one showcase at `/m` with `/app` redirecting (recommended).
4. The analytics tool if none is wired (Vercel Web Analytics recommended; no ad pixels).
5. The final tagline after C3 (default: "One screen, every day.").
6. Raahi on the website: yes once approved in the app, or later.
7. Brand kit contact email and founder line for the fact sheet.

## 11. Effort
About 7–8 working days in total:

| Phase | Days |
|---|---|
| A, capture today | 0.5 |
| B, research | 1 |
| C, messaging | 0.5 |
| D, specs and assets | 1 |
| E, build /waitlist | 1.5 |
| F, build /m and /brand | 2 |
| G, measurement | 0.5 |
| H, ship | 0.5 |

Research (B) and execution start only when the owner says usage is available.

---

# v2 update (17 Oct, owner's answers): read this before Phase A

## A. Owner decisions, applied
1. **Canonical app page = `/app`.** `/mobile` redirects to `/app`.
   **Warning, verified in code:** `/m` is the URL the installed **v2 Capacitor app loads** (`frontend/capacitor.config.json:9` → `https://www.aiimin.in/m`), and it's the logged-in capture shell (`App.js:229`). Redirecting `/m` would break every installed v2 app. So the rules are:
   - logged-in users and the app's WebView stay on `/m`;
   - logged-out web visitors are sent to `/app` instead of `/login`;
   - `/m` is fully retired only once the v4 APK replaces v2.
2. **Founder / contact:** "AIIMIN team" everywhere; remove the owner's name and the "made with love" lines. They're currently in `WaitlistFooter.jsx`, `WaitlistAndroidSection.jsx`, `MobilePreviewMock.jsx` and `AndroidApp.jsx`.
   **Contact:** the owner wrote "support@aimin.in", but the domain is aiimin.in. The plan uses **support@aiimin.in**, which the owner must confirm and set up the mailbox for.
3. **Raahi:** shown on `/app` as "coming to Plus and above" (it's still being built, so it's labelled "in development"), with the minimal glyph art.
4. **Analytics (none wired today):**
   - **Vercel Web Analytics + Speed Insights:** cookie-free, one line each, so no consent banner is needed.
   - **PostHog** (free tier): funnels, events from §7, session replay **off** by default.
   - **Google Search Console:** search queries and indexing.
   - No ad pixels until paid ads start (then Meta/Google with consent).
5. **Lighthouse, phone performance and acceptance status** are tracked as a table in STATUS.md for every deploy (performance / accessibility / SEO on phone, LCP, CLS, INP).

## B. The waitlist counter: honest version (not 122)
**Showing an invented number ("122 waiting") is fake social proof.** It breaks India's dark-pattern guidelines (CCPA 2023, "false urgency / fake social proof") and the plan's own no-fake-numbers rule, and one screenshot comparison can expose it. I won't build an inflated counter. Honest options that convert as well or better:
- **(a) Founding seats remaining:** "First 500 founding members · 377 seats left". This counts down from a real cap, so it shows scarcity truthfully.
- **(b) Show the real number only once it reaches 250**; until then show "Founding cohort is open" with no number.
- **(c) Recent-joins ticker** with real first names and cities, opt-in only.

**Recommended: (a) + (c).**

## C. Founding-member offer (so people pay, and it's genuine)
Benchmarks, to verify in Phase B:
- Superhuman: paid onboarding.
- Arc: free invite plus member perks.
- Linear: no discount, craft as the hook.
- Notion and Raycast: student/early pricing.
- Typical "founding" offers: lifetime 30–50% off, a badge, roadmap votes.

Proposal:
- **Founding member (first 500 to join the paid plan when billing starts):**
  - **50% off for life on Plus or Pro** (Plus ₹24/month, Pro ₹49/month instead of ₹49/₹99) while they stay subscribed;
  - the first 30 days free;
  - a founding badge in the app and on the waitlist pass;
  - a vote on the roadmap;
  - Raahi early access.
- **Price-lock pre-commit:** join now, pay nothing, and your founding price is held for 14 days after billing opens. That honours the "no charge without subscribing" rule.
- **Referral:** each friend who joins moves you up and gives you both +1 free month when billing starts. Capped at 6 months.

## D. Motion stack (owner-supplied libraries)
**Lenis (smooth scroll):**
- Use it on `/app` and `/brand` only, not on the form-heavy `/waitlist`.
- Settings: `respectReducedMotion: true`, `anchors: true`, `allowNestedScroll: true`.
- Install with `npm i lenis`.

**GSAP 3.15 (now free, including SplitText and ScrollTrigger) + `@gsap/react` `useGSAP()`:**
- logo assembly;
- the pinned "day with AIIMIN" phone story (ScrollTrigger, synced to Lenis via `lenis.on('scroll', ScrollTrigger.update)`);
- SplitText for the headline;
- `gsap.matchMedia()` for reduced motion and phones;
- only transform and opacity are animated.

**React Bits (MIT + Commons Clause, fine to use in our site):**
- Pick at most 3, added through the shadcn registry (`@react-bits/...-TS-TW`): SplitText or a scroll reveal for headings, one subtle background on the `/brand` hero, a card/gallery for screenshots.
- No heavy WebGL backgrounds on phones (LCP budget).

**Rules:**
- Framer Motion already exists (`framer-motion` + `motion`); don't mix GSAP and Framer on the same component tree.
- Remove one of the two motion packages if it becomes unused.
- **Budget:** under 45 KB of extra JS (gzip) on `/app`; phone LCP under 2.5 s.

## E. Tagline shortlist (for the owner to pick; Phase C tests the top 3)
1. One screen, every day.
2. Your whole day. One quiet screen.
3. Less app-hopping. More living.
4. Your day, sorted before you are.
5. Run your life like you mean it. Gently.
6. Twelve apps walked into a bar. Only AIIMIN came out. *(witty, for ads)*
7. The calm way to keep score of your life.
8. Know your day. Know your money. Know where the papers are.
9. Say it once. It files itself.
10. Fewer tabs, more life.
11. Your phone already knows. AIIMIN makes it useful.
12. Plan less. Live more. Miss nothing.
13. Built for people who forget the passport is expiring.
14. All your life admin, none of the admin feeling.
15. The only app that compares you with you.

**Pairing:** brand line #1 or #2. The waitlist hero uses #9 or #15 as proof lines, and ads test #6, #11 and #13.

## F. Growth plan: more users, traffic and revenue (new Phase I, after launch)
| Channel | What | Skills |
|---|---|---|
| **SEO / programmatic** | Pages for "SMS expense tracker India", "screen time tracker that matches Digital Wellbeing", "document expiry reminder", one page per bank ("HDFC SMS to budget") | seo-audit, programmatic-seo, site-architecture, schema-markup |
| **AEO** | FAQ answers written to be quoted by AI search | aeo |
| **Launch** | Product Hunt + Indie Hackers + Reddit (r/IndiaInvestments, r/productivity, r/androidapps) + LinkedIn founder-less "AIIMIN team" posts; a launch-week calendar | launch-strategy, social-content, linkedin-strategy |
| **Referral loop** | Shareable waitlist pass (OG image with seat number), +1 month per friend | referral-program |
| **Content** | "Week in AIIMIN" changelog, 20 s reels of capture and the Money chart (built with hyperframes) | content-strategy, video-content-strategist |
| **Play Store** | Listing, screenshots and keywords reusing `/app` assets once release-signed | app-store-optimization |
| **Email** | Waitlist welcome, beta access, founding offer (via the existing Resend; consent only) | email-sequence, onboarding-cro |
| **Pricing and paywall** | Founding offer, then a Plus upgrade moment inside the app | pricing-strategy, paywall-upgrade-cro |
| **Measure** | Weekly funnel review; A/B tests on the hero line and form | analytics-tracking, ab-test-setup, campaign-analytics |

**Targets for 30 days after launch** (to be confirmed against the Phase A baseline):
- 1,000 waitlist sign-ups;
- 25% of `/app` visitors tap download;
- 10% of waitlist members pre-commit to the founding price.

## G. Added tasks
- **A6:** check `/m` usage (how many active v2 Capacitor installs), then apply the redirect rule from §A1.
- **E0:** install Lenis, GSAP and `@gsap/react`, plus the React Bits picks; bundle-size check.
- **E6:** founding seats counter (real cap, server count read-only) + referral pass. **Any schema change needs the owner's OK.**
- **E7:** footer and credits → "AIIMIN team"; contact support@aiimin.in (once confirmed).
- **G0:** wire Vercel Analytics, Speed Insights and PostHog; submit to Search Console.
- **I1–I6:** the growth channels from §F, each with its own one-page brief before it runs.
