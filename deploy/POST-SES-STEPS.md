# Post-SES verification — EC2 `.env` block

Copy into `/home/ubuntu/AIIMIN/.env` on EC2 (merge with existing DATABASE_URL, etc.).

```bash
# Waitlist
WAITLIST_MODE=true
DEV_EMAILS=aadityaupadhyay10@gmail.com
OWNER_EMAILS=aadityaupadhyay10@gmail.com
TESTER_EMAILS=aadityaupadhyay85@gmail.com,sanchitbhatia2006@gmail.com,adityamehta298@gmail.com,shishangthakur@icloud.com
OWNER_NOTIFY_EMAIL=aadityaupadhyay10@gmail.com
CRON_SECRET=<generate-random-32-chars>

# AWS SES (ap-south-1) — from SES → SMTP settings → Create SMTP credentials
AWS_SES_REGION=ap-south-1
AWS_SES_SMTP_USER=<from-aws>
AWS_SES_SMTP_PASS=<from-aws>
SES_FROM_EMAIL=noreply@aiimin.in
SES_FROM_NAME=AIIMIN

NODE_ENV=production
FRONTEND_URL=https://www.aiimin.in
```

After editing:

```bash
cd ~/AIIMIN
pm2 reload deploy/ecosystem.config.cjs --update-env
curl -s https://api.aiimin.in/api/health
```

Test email (optional, from EC2):

```bash
node -e "
import('./server/lib/email.js').then(({ sendEmail }) =>
  sendEmail('aadityaupadhyay10@gmail.com', 'waitlist_confirmation', { firstName: 'Test' })
).then(console.log).catch(console.error);
"
```

## Vercel (frontend)

| Variable | Value |
|----------|-------|
| `REACT_APP_WAITLIST_MODE` | `true` |
| `REACT_APP_API_URL` | `https://api.aiimin.in/api` |
| `REACT_APP_DEV_EMAILS` | `aadityaupadhyay10@gmail.com` |

Delete: `REACT_APP_CLERK_PUBLISHABLE_KEY` (if present). Redeploy.

## SES sandbox

Until production access is approved, SES only sends to **verified** recipient emails.
Request: SES → Account dashboard → **Request production access**.

**Faster unblock:** see `deploy/EMAIL-SETUP.md` — verify test inboxes in SES sandbox, or add **Resend** (`RESEND_API_KEY` on EC2).
