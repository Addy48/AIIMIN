# 08 — Feature History

```yaml
purpose: Per-feature origin, pivots, status, abandoned ideas — institutional feature memory.
confidence: ★★★★☆
generated_from:
  - docs/knowledge/09_FEATURES/**
  - docs/knowledge/_manifest.json
  - docs/knowledge/17_NATIVE_APP_V2/00_FEATURE_SELECTION.md
related_notes: [01_PRODUCT_HISTORY.md, 03_PRODUCT_DECISIONS.md, 15_OBSOLETE_IDEAS.md, 16_VALUABLE_IDEAS.md]
dependencies: [00_KNOWLEDGE_SUMMARY.md]
consumers: Feature agents; Codex reconstructing domain history
importance: ★★★★★
```

---

## MASTER FEATURE TABLE

| Feature | Origin intent | Current status | Key pivots | Abandoned | Sources |
|---------|---------------|----------------|------------|-----------|---------|
| Waitlist | Pre-launch gate + founding perks | google-oauth-bearer-fix-shipped | Clerk→Better Auth; SES→Resend; modular v9; hide public position | Clerk; campus strip; WaitlistBrand-as-brand | Waitlist.md + Changelog |
| Auth | Login + gates | better-auth + waitlist gates | Supabase OAuth→Better Auth; OS-ID→PIN after resolve | Fake field overlays; query session tokens | Auth.md |
| Overview/Today | Daily command | j0a-single-logger | Remove Quick Capture tiles; API Life Score | Option B dual tiles+logger | Overview.md |
| Journal | Low-friction reflection | craft-b1-in-progress | Studio redesign; mode chips; en-IN dates | Share-sheet / Twilio deferred | Journal/* |
| Notes | Reference layer ≠ journal | ocr-drive-watch-local | Reject GoodNotes; OCR+Drive; FK 044 | Canvas; PDF annotate; collab; recall streaks | Notes/* + ADR |
| Discipline | Willpower compounding | urge-redesign-planned | Restore engine UI; API hydrate; UrgeEvent ADR | Addiction score; AI therapist; recovery XP; JITAI A5 | Discipline/* + ADR |
| Goals | Pipeline + vision | pipeline-achieved-fix | Achieved column fix; DeadlinePicker; palette pillars | — | Goals/* |
| Reports | Tiered intelligence | core-pro-live-elite-web-craft | Folio→Life OS Review; Elite=web | Elite longer PDF; font-only prototypes | Reports/* |
| Life Score | Honest composite | api-backed-local | localStorage→API | Vanity XP as score | LifeScore.md |
| Calendar | Route-backed calendar | google-sync-tasks-auto-pull | Google Tasks+auto-pull | Legacy Supabase path | Calendar.md |
| Sports | Multi-sport + AI preview | dual-cricket-failover-live | Provider registry+cron; CricAPI→RapidAPI→ESPN | Research-only mode | Sports/* |
| Family | Household vault | menus shipped 2026-07-19 | Card ⋯ edit all 9 tabs | — | Family.md |
| Navigation | User-owned pins | notes-pin-restore-local | Free-pin 1–12; overflow More | Sidebar taxonomy | Navigation.md |
| Onboarding | First-run | life-mode-gate-local | Life-mode required; tour v2 8 stops | 12-step brochure tour | Onboarding.md |
| Account | Profile + presets | persona-presets-shipped | North Star→Life Arc; click-upgrade | Stripe live (deferred) | Personalization.md |
| Gamification | XP ranks quests | shipped | — | Hardcoded Insights domains (audit) | Gamification.md |
| Daily Log | Core metrics | core-logging-shipped | Mobile capture rules; no protein on mobile | — | DailyLog.md |
| Intelligence | Provider map + budgets | provider-map-live | Gemini→OpenRouter→Groq; tier caps | NVIDIA/xAI routing | AI-Provider-Map.md |
| DevTools | Owner API usage | dev-dashboard-live | Dual budgets | usage-report draining budgets | ApiUsage.md |
| Typography | Token scale | token-rollout-phase1-complete | Metric components; Design Lab Today prototypes | — | Typography.md |
| Mobile Capacitor | Android capture shell | legacy | Remote `/m`; founder reject as app | Play V1 primary | Capacitor-Android.md |
| Native Android V2 | True companion | Phase1 ~92% | Reject WebView; 5-tab IA | Capture-only native | 17_NATIVE_APP_V2/* |
| Device tiers | Phone/tablet/desktop | phone-m-ipad-full | Native ≠ `/m` ceiling | — | Device-Tiers.md |

---

## RECURRING FEATURE THEMES

1. **localStorage → API** (Life Score, Discipline, Lab, Focus)
2. **Duplicate primitives must die** (mood, theme, arc)
3. **Design Lab before ship** (Today, Elite reports)
4. **Ethics bar on Discipline/Journal**
5. **India-first** (₹, en-IN, cricket)
6. **Local ≠ shipped** (craft honesty)

---

## FEATURE STATUS LEGEND (MANIFEST)

Statuses from `_manifest.json` / MOCs — treat as vault claims; verify runtime separately (proof-or-stop).
