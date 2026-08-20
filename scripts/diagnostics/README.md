# Ad-hoc diagnostics

Historical one-file probes moved from the repository root. They are not part of automated tests.

| Script | Purpose |
|--------|---------|
| `query_user.js` | Query one local-development user by OS-ID |
| `test_auth.js` | Inspect columns on the configured `users` table |
| `test_auth_middleware.js` | Exercise auth middleware with a synthetic request |
| `test_sports.js` | Probe the external ESPN F1 scoreboard |
| `test_tables.js` | List tables from the configured database |

Run from the repository root:

```bash
node scripts/diagnostics/<script>.js
```

Database scripts load local environment configuration and may contact the configured database. Review the target before running. No script belongs in CI.
