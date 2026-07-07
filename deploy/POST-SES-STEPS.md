# EC2 production `.env` — post-Resend migration

> **SES removed.** Use Resend only. See `deploy/RESEND-SETUP.md` and `deploy/LAUNCH-PLAN.md`.

Copy into `/home/ubuntu/AIIMIN/.env` on EC2 (merge with existing `DATABASE_URL`, etc.):

```bash
# Waitlist
WAITLIST_MODE=true
DEV_EMAILS=aadityaupadhyay10@gmail.com
OWNER_EMAILS=aadityaupadhyay10@gmail.com
TESTER_EMAILS=aadityaupadhyay85@gmail.com,sanchitbhatia2006@gmail.com,adityamehta298@gmail.com,shishangthakur@icloud.com,kuldeepyadav2911@gmail.com
OWNER_NOTIFY_EMAIL=aadityaupadhyay10@gmail.com
CRON_SECRET=<generate-random-32-chars>

# Resend (replaces AWS SES)
RESEND_API_KEY=re_xxxxxxxx
RESEND_FROM_EMAIL=noreply@aiimin.in
RESEND_FROM_NAME=AIIMIN
RESEND_REPLY_TO=aadityaupadhyay10@gmail.com

NODE_ENV=production
FRONTEND_URL=https://www.aiimin.in
```

**Remove** from EC2 if present:

```bash
AWS_SES_REGION
AWS_SES_SMTP_USER
AWS_SES_SMTP_PASS
SES_FROM_EMAIL
SES_FROM_NAME
EMAIL_PROVIDER
```

After editing:

```bash
cd ~/AIIMIN
git pull
npm install
pm2 reload deploy/ecosystem.config.cjs --update-env
curl -s https://api.aiimin.in/api/health
```

Test email:

```bash
node scripts/test-email.mjs aadityaupadhyay10@gmail.com
```

## Vercel (frontend)

| Variable | Value |
|----------|-------|
| `REACT_APP_WAITLIST_MODE` | `true` |
| `REACT_APP_API_URL` | `https://api.aiimin.in/api` |
| `REACT_APP_DEV_EMAILS` | `aadityaupadhyay10@gmail.com` |

Redeploy after push.
