# 15 — Obsolete Ideas

```yaml
purpose: Ideas abandoned, rejected, or superseded — do not revive without explicit owner ask.
confidence: ★★★★☆
generated_from:
  - docs/AIIMIN_PRODUCT_BIBLE/15_THINGS_NEVER_TO_BUILD.md
  - docs/knowledge/09_FEATURES/*/Changelog.md
  - docs/knowledge/10_DECISIONS/*
  - MASTER_PLAN.md
  - audit.md
related_notes: [16_VALUABLE_IDEAS.md, 03_PRODUCT_DECISIONS.md, 08_FEATURE_HISTORY.md]
dependencies: [03_PRODUCT_DECISIONS.md]
consumers: Agents proposing features
importance: ★★★★★
```

---

## OBSOLETE = THREE BUCKETS

| Bucket | Meaning |
|--------|---------|
| `rejected` | Explicit never-build / founder reject |
| `superseded` | Replaced by better decision |
| `abandoned_experiment` | Tried; reverted or dropped |

---

## REJECTED (DO NOT BUILD)

| Idea | Why obsolete | Source |
|------|--------------|--------|
| Social feed | Not a network | Never-Build |
| Public leaderboards | Privacy + anxiety | Never-Build |
| AI therapist persona | Clinical liability | Never-Build, ADR |
| Automatic posting | User must own writes | Never-Build |
| Infer emergency meds/allergies | Safety | Never-Build |
| Diagnostic MH labels | Digital phenotyping ethics | Never-Build |
| Journal body in analytics | Privacy | Principles |
| PIN in telemetry | Security | Principles |
| Sell/share lifelog data | Trust | Never-Build |
| Another mood/theme/arc picker surface | Duplicates | Never-Build |
| Journal mode gate before capture | Kills vent | Never-Build, kill list |
| Required title on quick notes | Kill | Never-Build |
| Priority dropdown on goals | Infer instead | Never-Build |
| 6-field finance as only path | Compression | Never-Build |
| 14-module Lab as only entry | Choice overload | Never-Build |
| Mobile analytics dashboard on `/m` | Capture lock | Never-Build |
| New brand colors | Palette lock | Never-Build |
| Protein input on mobile | Daily Log rule | Never-Build |
| GoodNotes / handwriting canvas Notes | Wrong product | ADR-Notes |
| Elite = longer PDF | Wrong product | Reports Prototypes |
| Capacitor as primary Play app | Founder reject | Capacitor MOC |
| Capture-only native as final ceiling | Product fraud | Device-Tiers |
| Forced sidebar taxonomy | Free-pin wins | Navigation |
| Dark upgrade nag loops | Anti dark patterns | Never-Build |
| Fat AGENTS.md memory | Brain OS | ADR |
| Whole-repo scan as research | Brain OS | Never-Build |
| Schema change driven only by intelligence | Process lock | Never-Build |
| `window.confirm` new usages | Migrate ConfirmDialog | Never-Build |

---

## SUPERSEDED

| Old idea | Replaced by | When |
|----------|-------------|------|
| Clerk auth | Better Auth | 2026-07-05 |
| AWS SES | Resend | 2026-07-05 |
| Electric blue + Outfit system | Orange palette lock | post MASTER_PLAN |
| Leaf logo | Arch Bracket | 2026-07-08 |
| WaitlistBrand `/brand` | Human Momentum | 2026-07-17 |
| Quick Capture tiles | Universal Logger only | Craft J0=A |
| Insights standalone product | Reports consolidation | ~2026-07 |
| Folio naming | Life OS Review | 2026-07-18 |
| North Star field label | Life Arc | 2026-07-09 |
| Command Center vault | Brain OS Home | 2026-07-10 |
| localStorage Life Score sole source | API-first LHS | 2026-07-18 |
| Legacy Calendar Supabase path | Google sync | Calendar MOC |

---

## ABANDONED EXPERIMENTS

| Experiment | Fate | Source |
|------------|------|--------|
| Campus strip BITS/IIT social proof | Removed | Waitlist Changelog |
| c1–c5 waitlist email themes | Collapsed to Resend template | Waitlist Changelog |
| Discipline stripped urge-only page | Reverted; engine UI restored | Discipline Changelog |
| 40% Core discount waitlist copy | Dropped from current pricing truth | Waitlist history |
| Share-sheet / Twilio journal capture | Deferred not killed | Journal/Account |
| JITAI discipline A5 | Deferred/rejected ethics | Discipline Changelog |
| NVIDIA/xAI in default routing | Not in active map | AI-Provider-Map |
| Stripe live billing path | Deferred; click-upgrade active | Account |

---

## "LOOKS PRODUCTIVE BUT ISN'T" (BIBLE)

| Trap | Real need |
|------|-----------|
| More dashboard widgets | Morning briefing one card |
| More journal modes | AI tags post-capture |
| More onboarding questions | Infer from behavior |
| More gamification badges | Coordinate XP + Life Score |
| More filter dropdowns | AI pre-filter |
| Separate mobile app *routes* | Responsive capture (≠ kill native client) |

---

## REVIVAL RULE

To revive any item here:
1. Explicit owner ask
2. Check Kill List + Never-Build gate (5 questions)
3. New ADR if architecture
4. Vault changelog entry
5. Do not "quietly" reintroduce
