# AI Provider Map (AIIMIN)

Keys live only in **gitignored** files: root `.env` (local) and `deploy/EC2.env.paste` (production paste).
Never commit real keys. Sync to EC2 with `bash scripts/sync-ec2-ai-env.sh` (SSH; no GitHub secrets).

## Status (tested 2026-07-10)

| Env var | Works? | Model | Role |
|---------|--------|-------|------|
| `GEMINI_LITE_API_KEY` | ✅ | `gemini-2.5-flash-lite` | **Light only** — 5 tasks |
| `GEMINI_API_KEY` | ❌ invalid | — | Cleared; do not use |
| `GROQ_API_KEY` | ✅ | `llama-3.3-70b-versatile` | **Heavy** — primary |
| `OPENROUTER_API_KEY` | ✅ | `meta-llama/llama-3.3-70b-instruct:free` | **Heavy fallback** when Groq fails |
| `NVIDIA_API_KEY` / `KIMI_API_KEY` | ⚠️ key ok, models 404 | — | Tried first; **falls back to Groq → OpenRouter** |
| `XAI_API_KEY` | ❌ 403 | — | Not routed |

## What each key powers

### Gemini Lite (`GEMINI_LITE_API_KEY`) — keep light

| Task | Route / UI | Avg tokens / call (est.) |
|------|------------|---------------------------|
| Sharpen Life Arc | `/intelligence/arc/sharpen` · Account Arc editor | ~80–150 |
| Journal prompts | `/intelligence/lite` · Journal | ~150–250 |
| Habit coach | `/intelligence/lite` · Habits | ~100–180 |
| Emotion tag | `/intelligence/lite` | ~80–150 |
| Short summary | `/intelligence/lite` | ~100–200 |

App budget: `GEMINI_DAILY_LIMIT=200` **calls/day** (not tokens).

Google free tier (Flash-Lite class): typically **~1,000–1,500 RPD** and RPM caps — treat **200 app calls/day** as safe headroom for testers.

**Rough runtime:** ~200 light calls/day ≈ **~40–60k tokens/day** if each call ~200–300 tokens. At ~5 Arc sharpens + a few prompts per user/day → **~20–40 active users** on Gemini alone before app budget blocks.

### Groq (`GROQ_API_KEY`) — heavy workhorse

| Task | Route / UI | Avg tokens / call (est.) |
|------|------------|---------------------------|
| `/intelligence/generate` | Lab / structured generate | ~400–1,200 |
| `/intelligence/chat` (provider=groq) | `aiService` tasks | ~300–1,500 |
| Universal Logger | `/intelligence/universal-log` | ~400–800 |
| Journal AI analyze | `/daily-logs/journal/ai-analyze` | ~400–700 |
| Wealth AI summary | `/wealth/ai-summary` | ~600–1,200 |
| Wealth SMS/AI import | `/wealth/import/ai` | ~500–1,500 |
| CBT / weekly insight / sports / finance what-if | via `aiService` → chat | ~300–1,000 |

App budget: `GROQ_DAILY_LIMIT=1000` **calls/day** (align with Groq free RPD for 70B).

Groq free tier (official, model-dependent): for `llama-3.3-70b-versatile` typically **~1,000 RPD**, **30 RPM**, **12K TPM**.

### OpenRouter (`OPENROUTER_API_KEY`) — free fallback

| Task | Route / UI | Notes |
|------|------------|--------|
| Same heavy paths | via `heavyChat` / `nvidiaOrGroqChat` | Used when Groq fails or `provider=openrouter` |

Env: `OPENROUTER_MODEL=meta-llama/llama-3.3-70b-instruct:free`, `OPENROUTER_DAILY_LIMIT=50` (OpenRouter free ~50 req/day without credits).

Keys live in root `.env` + `deploy/EC2.env.paste`; sync: `bash scripts/sync-ec2-ai-env.sh`.

### NVIDIA / Kimi — standby

Key stored; models not enabled on account. Code path: try NVIDIA → **Groq → OpenRouter**. Enable models at [build.nvidia.com](https://build.nvidia.com/) later.

### xAI — unused

403; not in routing.

## Production deploy (no GitHub secrets)

1. Keys already in **gitignored** `deploy/EC2.env.paste`.
2. Push **code** (routing) to `main` — Actions deploys API but **preserves** EC2 `.env`.
3. Merge AI keys onto server:
   ```bash
   export EC2_HOST=your-ec2-host
   export EC2_SSH_KEY_PATH=~/.ssh/your-key.pem
   bash scripts/sync-ec2-ai-env.sh
   ```
   Or SSH and paste the LLM block from `deploy/EC2.env.paste` into `~/AIIMIN/.env`, then `pm2 reload … --update-env`.

## Local test

```bash
npm run test:ai-keys
npm run dev:api   # restart to load .env
```

Then: Account → Life Arc → Sharpen (Gemini lite); Journal AI / Universal Logger (Groq).
