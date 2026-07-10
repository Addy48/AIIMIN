# Database Architecture

## Host

- Supabase hosted PostgreSQL
- Project id historically: `yubxgftugxbwtywyhcsv` (confirm in env; do not put keys in vault)

## Schema practice

- Prefer numbered migrations in `server/migrations/`
- Document tables under `03_DATABASE/` — one note per major table when touched
- Never store credentials in vault notes

## Important table groups

| Group | Examples | Docs |
|-------|----------|------|
| Auth / access | users, allowlists, oauth tokens | [[03_DATABASE/users]], [[03_DATABASE/user_oauth_tokens]] |
| Waitlist | waitlist_emails, waitlist_feedback | [[03_DATABASE/waitlist_emails]] |
| Daily | daily_logs | [[03_DATABASE/daily_logs]] |
| Calendar | calendar_events | [[03_DATABASE/calendar_events]] |
| Sports | sports_cache | [[03_DATABASE/sports_cache]] |
| Usage | api_usage_log, api_provider_budgets | [[03_DATABASE/api_usage_log]] |

## Related

- [[Overview]]
- [[03_DATABASE/Index]]
