# 01 — First Impression

## Purpose
Document what users believe, feel, and expect within the first seconds to first ten minutes of contact with AIIMIN across waitlist, brand, auth, and first authenticated canvas.

## Confidence
★★★★☆ — Live SEO + waitlist/brand/onboarding/source copy verified. No eye-tracking or session recordings.

## Evidence Sources
Live `www.aiimin.in` (200); `WaitlistHeroSection.jsx`; `Brand.jsx`; `Login.jsx`; `Onboarding.jsx`; `Overview.jsx`; `ProductTour.jsx`; `DeviceGate.jsx` / `/m`.

## Files Used
`frontend/src/pages/Login.jsx`, `Onboarding.jsx`, `Overview.jsx`, `Brand.jsx`, waitlist components, `ProductTour.jsx`, live HTML head meta.

## Reasoning
First impression is multi-surface. Evaluating only `/overview` would miss the waitlist gate that most strangers hit first.

## Dependencies
[[00_EXECUTIVE_SUMMARY]]

## Consumers
Marketing, onboarding redesign, brand QA.

## Known Unknowns
Exact waitlist-to-access conversion; guest-mode first impression for unauthenticated explorers inside shell.

---

## Timeline audit

### Within 3 seconds

| Surface | Belief formed | Emotion | Why |
|---------|---------------|---------|-----|
| Waitlist `/` | “Personal Life OS / productivity dashboard for students” | Curiosity + FOMO (cutoff dates) | Title: “AIIMIN — Personal Life OS \| Join the Waitlist”; meta: habits, money, focus, mood, Indian students, Sep 2026 |
| Brand `/brand` | “Serious philosophy product” | Calm respect | Light ivory, manifesto H1: infrastructure for human momentum |
| Login | “Secure workspace, PIN-gated” | Mild seriousness | “Welcome back” / “Access your intelligent workspace” |
| Overview (authed desktop) | “Command center / ops dashboard” | Focused or overwhelmed | Header “Day Control.” / “Operational Intelligence” |

**3-second verdict:** Strangers meet **Life OS marketing**. Authed desktop users meet **operations theater**. These are different brands sharing a logo.

### Within 10 seconds

Expectations form:
- One place for habits + money + mood (waitlist hero: “One screen. Every day.”)
- Desktop-first (mobile notice: built for laptop & desktop)
- Pricing accessible (OG: ₹0 to ₹99/mo)
- Privacy claimed early in onboarding footer (“Your data is always private”)

Assumptions:
- “This will replace Notion + habit app + expense tracker”
- “AI will do the structuring”
- “Mobile will work like desktop” ← **false for phone web**

### Within 30 seconds

| Path | Emotional turn |
|------|----------------|
| Waitlist scroll | Pricing, tester cutoff 31 Jul, go-live Sep 2026 → commitment anxiety |
| Signup | OS-ID + PIN ritual → feels like joining a system, not a website |
| Overview | Widget density, Life Score ring, Logger mid-column → “I should customize this” |

Feel labels (multi-vote allowed):

| Label | Applies when | Evidence |
|-------|--------------|----------|
| Premium | Brand manifesto, locked palette, typography (Familjen + Figtree) | Brand + waitlist fonts |
| Cheap | Demo Recent Wins chips if enabled; emoji-heavy onboarding cards | Overview demo wins; onboarding emoji grids |
| Experimental | Lab, Design Lab inside Account | Lab 14 modules; Account Design section |
| Confusing | Dual Settings/Account; Insights redirects to Reports | `Insights.jsx` redirect; Command Palette → Settings vs Account |
| Modern | Dark `#1a1a1a` + orange `#ff6b35`, glass nav moments | Palette lock + glass banners |
| Human | ProductTour anti-shame copy; Discipline urge language | ProductTour steps |
| Corporate | “Day Control.” / “Operational Intelligence” / “Mission Control” | Overview + onboarding success |
| AI Generated | LIVE badges, glass pills, card grids, emoji mood scales | Overview Trajectory; GuestTour gradients |
| Personal | Life Arc banner, OS-ID identity | ArcBanner, login identity |
| Professional | Finance, Placements CRM, Family Vault | Finance/Placements/Family |

### Within 2 minutes

User either:
1. **Submits waitlist email** and leaves (lowest friction acquisition path), or
2. **Starts auth** and hits PIN + verify email, or
3. **Lands on Today** and scans widgets without capturing.

Belief at 2 minutes if authenticated: “Powerful but I need a tour.” ProductTour offers 8 chapters — reinforces that the product expects teaching.

### Within 10 minutes

Critical fork:
- **Capture achieved** (habit toggle / journal / logger) → confidence spike; doctrine starts matching experience.
- **Still configuring** (onboarding goals/habits/arc/wake/persona, or widget customize) → fatigue; product feels like setup software.
- **Phone user** redirected to `/m` → belief shift: “This is a logbook, not the OS I saw in ads.” Honest, but can feel like bait-and-switch if marketing said Life OS without device caveat.

Onboarding active steps = **10** (`TOTAL_STEPS = 10`) after signup steps — far past Product Bible target of 3-step setup.

---

## What users believe AIIMIN is (synthesis)

1. **Public stranger:** Life OS waitlist product for Indian students/young professionals.
2. **Brand reader:** Human Momentum behavioural infrastructure (anti-dashboard rhetoric).
3. **New authed desktop user:** Dense personal operations suite with AI logging.
4. **Phone web user:** Capture companion with score glance.
5. **Native user:** Journal/notes/vault pocket app that defers structure to desktop.

These five beliefs coexist in production. That is the first-impression problem.

---

## Confidence vs confusion moments

| Confidence | Confusion |
|------------|-----------|
| Habit one-tap complete | Why Insights URL becomes Reports |
| Universal Logger promise copy | Space→L discoverability |
| Brand manifesto clarity | Logo → Brand, wordmark → Today (clever but untaught) |
| Privacy footer during onboarding | Guest Mode “No subscriptions — free to explore” vs real tiers |
| PIN a11y on Login | Onboarding numpad weaker a11y |

---

## Cross-link
[[04_USER_JOURNEYS]] · [[13_AI_SLOP_ANALYSIS]] · [[12_PLATFORM_CONTINUITY]] · [[10_MICROCOPY_AUDIT]]
