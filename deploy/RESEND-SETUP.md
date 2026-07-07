# Resend — AIIMIN email (replaces AWS SES)

All transactional email (waitlist, re-engagement, billing) uses **Resend** via `server/lib/email.js`.

## 1. Resend account

1. [resend.com](https://resend.com) → sign up
2. **API Keys** → Create → copy `re_...`
3. **Domains** → Add `admin.aiimin.in` (verified subdomain on GoDaddy DNS)

> **Note:** Root `aiimin.in` is separate. Use `noreply@admin.aiimin.in` as the from address until/unless you also verify the root domain.

## 2. DNS records (Vercel or Route53)

Resend shows required records after adding the domain:

| Type | Purpose |
|------|---------|
| TXT | SPF |
| CNAME × 3 | DKIM |
| (optional) MX | Inbound if you use receiving later |

Wait until Resend shows **Verified** for `admin.aiimin.in`.

## 3. Environment variables

### Local `.env`

```bash
RESEND_API_KEY=re_xxxxxxxx
RESEND_FROM_EMAIL=noreply@admin.aiimin.in
RESEND_FROM_NAME=AIIMIN
RESEND_REPLY_TO=aadityaupadhyay10@gmail.com
```

### EC2 `~/AIIMIN/.env`

Same vars. Remove all `AWS_SES_*` and `SES_*` keys.

```bash
pm2 reload deploy/ecosystem.config.cjs --update-env
```

## 4. Test send

```bash
node scripts/test-email.mjs your-email@gmail.com
```

Until domain is verified, Resend may reject `noreply@aiimin.in`. Temporary test from:

```bash
RESEND_FROM="AIIMIN <onboarding@resend.dev>" node scripts/test-email.mjs your@gmail.com
```

## 5. Decommission AWS SES (save money)

| Step | Action |
|------|--------|
| 1 | Confirm Resend sends work in production |
| 2 | AWS SES → delete SMTP credentials (IAM user used only for SMTP) |
| 3 | SES → Verified identities → remove if unused |
| 4 | Cancel/close production access request if still open |
| 5 | Remove SES-related IAM policies from deploy user if any |
| 6 | Billing: SES is pay-per-email — no monthly fee, but removing SMTP IAM user reduces attack surface |

**Keep on AWS:** EC2 (API), Route53 (if used), billing alerts — only SES email goes away.

## 6. Resend MCP (optional — for you in Cursor)

Add to Cursor MCP settings for AI-assisted template work:

```json
{
  "mcpServers": {
    "resend": {
      "url": "https://mcp.resend.com/mcp",
      "headers": {
        "Authorization": "Bearer re_xxxxxxxx"
      }
    }
  }
}
```

Use OAuth flow if you prefer not to put the key in config.

## 7. Pricing

- Free tier: 3,000 emails/month (enough for waitlist + testers)
- Pro when you scale: ~$20/mo for 50k emails

No EC2 SMTP port 587, no sandbox, no verified-recipient limit.
