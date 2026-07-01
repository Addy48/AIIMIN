# AIIMIN Production Gap Report
**Generated:** 2026-07-01 | **Supabase project:** yubxgftugxbwtywyhcsv

## Summary
- **87 public tables** exist in production Supabase (family, lab, oauth tables present)
- **Storage:** `dashboard-uploads` bucket exists (public)
- **Missing tables:** addiction_tracking, cbt_records, www_entries, cognitive_benchmarks, financial_health_scores, lab_aptitude_scores, lab_system_design_logs, lab_reading_log, tester_allowlist
- **users.clerk_id** column missing — Clerk ID mapping uses MD5 hash only
- **RLS gaps:** daily_logs policies dropped; 11 tables with RLS enabled but no policies (API-only access OK)
- **AWS:** No idle EIPs; no budgets configured
- **Deploy:** API on Vercel serverless; EC2 assets not in repo

## Env vars required for production
See `deploy/.env.production.example`

## Blockers addressed in this implementation
1. Schema migration `028_production_completion`
2. Auth: clerk_id column, owner/tester tier overrides
3. EC2 deploy assets in `deploy/`
4. Waitlist admin API + tester allowlist
5. Frontend API migration (direct Supabase writes removed)
6. AWS budget alerts at $10/mo spend and credits threshold
