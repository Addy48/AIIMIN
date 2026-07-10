# Backend Architecture

## Stack

- Node.js server under `server/`
- Route modules in `server/routes/` (auth, waitlist, sports, calendar, dailyLogs, wealth, intelligence, billing, habits, focus, goals, notifications, admin, cron, …)
- Services/jobs under `server/services/` and `server/jobs/`
- Migrations under `server/migrations/` (numbered SQL)

## Patterns

- Auth middleware on protected routes
- Cron endpoints often gated by `CRON_SECRET` Bearer
- External providers (sports, AI, email) behind services with budgets/fallbacks where applicable

## Related

- [[Overview]]
- [[04_API/Index]]
- [[07_DEPLOYMENT/Deploy]]
