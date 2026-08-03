# Current Context

> Agents read after Home. Keep ≤400 lines.

**Date:** 2026-07-16

## Today

- OpenRouter wired: env + `heavyChat` fallback (Groq → OpenRouter)
- Syncing `OPENROUTER_*` to EC2 via `sync-ec2-ai-env.sh`

## Next

1. Confirm EC2 has OPENROUTER_* + pm2 reload
2. Smoke Journal AI / Universal Logger on prod
3. Rotate OpenRouter key (was in chat)

## Touch

- `server/lib/aiChat.js`, `intelligence.js`, `apiUsageService.js`
- `deploy/EC2.env.paste`, `.env` (gitignored)
- `scripts/sync-ec2-ai-env.sh`
