# Handoff Latest

**When:** 2026-07-16  
**From:** tier AI quotas + free-key strategy + key smoke

## Paste pack

```text
AIIMIN handoff — paste as first message in new chat

Read first:
1. docs/knowledge/00_HOME.md
2. docs/knowledge/15_MEMORY/Current-Context.md
3. docs/knowledge/15_MEMORY/Handoff-Latest.md
4. docs/knowledge/09_FEATURES/Intelligence/AI-Provider-Map.md
5. docs/knowledge/09_FEATURES/DevTools/ApiUsage.md

Done this chat:
- Per-user tier AI daily caps: Explore 1 / Core 10 / Pro 25 / Elite 40 (apiUsageService)
- Dual gate + enforce on wealth/journal/universal-log (no enforceBudget:false bypass)
- Marketing copy: no more “unlimited AI”
- sync-ec2-ai-env.sh greps OPENROUTER_* + AI_DAILY_LIMIT_*; EC2 env already synced
- Key smoke 2026-07-16: Groq OK; Gemini lite 429; OpenRouter 429; NVIDIA 404; xAI 403
- Inventoried live AI vs dead aiService stubs; Elite = quota only, not new AI features
- Owner constraint: never pay for AI keys (now or future) — free providers + hard caps only

Still open:
- Commit/push tier-quota code so prod API actually enforces user limits
- Rotate OpenRouter key (leaked earlier); refill Gemini/OpenRouter free quota or new free keys
- Optional: vault note AI-Features-by-Tier.md

Touch only if needed:
- server/services/apiUsageService.js
- server/routes/intelligence.js, dailyLogs.js, wealth.js
- server/services/billingService.js
- frontend subscription/landing tier copy
- scripts/sync-ec2-ai-env.sh, deploy/EC2.env.paste, .env

Constraints:
- Vault-first. No whole-repo scan.
- Palette lock. Mobile /m = capture only.
- No auth/schema change unless I ask.
- Commit only if I ask.
- No paid AI APIs — free keys + tier/org budgets only.

Next action:
- Ask: commit+push tier AI quota code? Then hunt free Gemini/OpenRouter keys / rotate OpenRouter.
```
