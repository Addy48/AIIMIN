# AI Provider Map (AIIMIN)

Keys live only in **gitignored** files: root `.env` (local) and `deploy/EC2.env.paste` (production paste).
Never commit real keys. Sync to EC2 with `bash scripts/sync-ec2-ai-env.sh` (SSH; no GitHub secrets).

## Status (tested 2026-07-16)

| Env var | Works? | Model | Role |
|---------|--------|-------|------|
| `GEMINI_LITE_API_KEY` | ❌ 429 quota | `gemini-2.5-flash-lite` | Light first choice |
| `OPENROUTER_API_KEY` | ✅ | lite: `openai/gpt-oss-20b:free` (+ `nvidia/nemotron-nano-9b-v2:free`) | **Light fallback** when Gemini dead |
| `GROQ_API_KEY` | ✅ | `llama-3.3-70b-versatile` | **Heavy primary** |
| `OPENROUTER` heavy | ⚠️ | `llama-3.3-70b-instruct:free` often 429 → falls to gpt-oss-20b | Last-ditch only |
| `NVIDIA` / xAI | ❌ | — | Unused / broken |

### Routing (2026-07-16)

- **Lite** (Arc, journal prompts, habit coach, emotion, short summary): Gemini → OpenRouter lite models (low tokens, `reasoning.effort=minimal`) → tiny Groq rescue
- **Heavy** (universal log, journal analyze, wealth, generate/chat): Groq → OpenRouter heavy list only if Groq fails
- Env: `OPENROUTER_LITE_MODELS`, `OPENROUTER_HEAVY_MODELS` (CSV failover)
- Do **not** put weak free models on wealth JSON / CBT as primary — quality too low

**Tier AI caps:** Explore 1 / Core 10 / Pro 25 / Elite 40. See [[09_FEATURES/DevTools/ApiUsage]].

## What each key powers

### Gemini Lite (`GEMINI_LITE_API_KEY`) — keep light

| Task | Route / UI | Avg tokens / call (est.) |
|------|------------|---------------------------|
| Sharpen Life Arc | `/intelligence/arc/sharpen` · Account Arc editor | ~80–150 |
| Journal prompts | `/intelligence/lite` · Journal | ~150–250 |
| Habit coach | `/intelligence/lite` · Habits | ~100–180 |
| Emotion tag | `/intelligence/lite` | ~80–150 |
| Short summary | `/intelligence/lite` | ~100–200 |

App budget: `GEMINI_DAILY_LIMIT=150` **calls/day** (not tokens).

**Per-user tier caps** (all AI providers combined): Explore **1** / Core **10** / Pro **25** / Elite **40** — env `AI_DAILY_LIMIT_*`. See [[09_FEATURES/DevTools/ApiUsage]].

Google free tier (Flash-Lite class): typically **~1,000–1,500 RPD** and RPM caps — treat **150 app calls/day** as safe headroom for testers.

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

App budget: `GROQ_DAILY_LIMIT=800` **calls/day** (under Groq free ~1K RPD for 70B).

Groq free tier (official, model-dependent): for `llama-3.3-70b-versatile` typically **~1,000 RPD**, **30 RPM**, **12K TPM**.

### OpenRouter (`OPENROUTER_API_KEY`) — free fallback

| Task | Route / UI | Notes |
|------|------------|--------|
| Same heavy paths | via `heavyChat` / `nvidiaOrGroqChat` | Used when Groq fails or `provider=openrouter` |

Env: `OPENROUTER_MODEL=meta-llama/llama-3.3-70b-instruct:free`, `OPENROUTER_DAILY_LIMIT=40` (OpenRouter free ~50 req/day without credits — keep app under).

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
