# API Usage Changelog

## 2026-07-04

- Added: `api_usage_log` + `api_provider_budgets` tables, `apiUsageService`, admin routes, AdminPanel API Usage tab
- Why: track free-tier cricket/AI quotas, enforce per-user sports refresh limits, give owner/dev budget visibility without exposing secrets
- Files: `server/migrations/032_api_usage_tracking.sql`, `server/services/apiUsageService.js`, `server/routes/admin.js`, `server/middleware/requireDev.js`, `frontend/src/components/account/AdminPanel.jsx`, `deploy/.env.production.example`
- Status: live for owner/dev roles
