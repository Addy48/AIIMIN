# AIIMIN API

The API behind sign-in, sync, the waitlist, billing and the web app's data. Served at `api.aiimin.in`.

- **Stack:** Node.js (ES modules), [Hono](https://hono.dev), [Better Auth](https://better-auth.com), Postgres on Supabase
- **Entry:** [`../api/index.js`](../api/index.js) builds the Hono app and mounts every route under `/api`; [`../dev_server.js`](../dev_server.js) serves it on port 3001, locally and on the server.

## Run locally

From the repository root:

```bash
cp .env.example .env    # at least DATABASE_URL, BETTER_AUTH_SECRET, BETTER_AUTH_URL
npm install
npm run dev:api         # http://localhost:3001/api
```

`npm run dev` starts the API and the web app together.

## Layout

| Folder | What it holds |
|---|---|
| `routes/` | One Hono router per area: auth, account, waitlist, billing, tasks, notes, family, health, … |
| `services/` | Logic the routes share (AI providers, sports cache, scoring); unit tests sit next to them |
| `lib/` | Database pool, Better Auth setup, email, crypto helpers |
| `middleware/` | Auth, rate limits, request checks |
| `jobs/` | Scheduled work (recurring transactions, sports fetch, correlations) |
| `migrations/` | SQL migrations, applied in order |

## Tests

```bash
npm test    # node --test server/services/*.test.js
```

## Configuration

Every variable is listed, with comments, in [`../.env.example`](../.env.example). Secrets live only in the host's environment (Vercel project settings, the EC2 `.env`). Never commit them.

## Deploy

- **Vercel** hosts the website and forwards `aiimin.in/api/*` to `api.aiimin.in` ([`../vercel.json`](../vercel.json)).
- **EC2:** pushes to `main` that touch `server/`, `api/` or `deploy/` run [`deploy-api.yml`](../.github/workflows/deploy-api.yml), which pulls the repo on the server and reloads PM2 ([`../deploy/ecosystem.config.cjs`](../deploy/ecosystem.config.cjs)).
