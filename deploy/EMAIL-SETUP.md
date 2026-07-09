# Email delivery — SES sandbox vs Resend

Waitlist confirmation, owner alerts, and re-engagement emails go through `server/lib/email.js`.

## Why users don't get mail (your current blocker)

**AWS SES sandbox** only delivers to **verified recipient addresses**. Owner mail to your dev inbox works because that address is verified. Random waitlist emails fail until either:

1. SES **production access** is approved, or
2. Each address is **verified** in SES → Verified identities → Create identity → Email address, or
3. You switch to **Resend** with a verified domain.

AWS production-access tickets often sit 24–72h+ with no reply. Don't block launch on that alone.

---

## Path A — Quick fix today (SES sandbox, $0)

Use while waiting on AWS:

1. AWS Console → **SES** → **Verified identities** → **Create identity** → Email
2. Verify every tester + your personal test inboxes
3. Re-run waitlist signup — confirmation should deliver

Limit: only verified addresses receive mail. Fine for tester phase, not public waitlist.

---

## Path B — Recommended: Resend (parallel to SES)

Resend usually approves domains faster than SES production access.

### 1. Sign up

[resend.com](https://resend.com) → add domain **aiimin.in**

### 2. DNS

Add the DKIM + SPF records Resend shows. Wait until domain status = **Verified**.

### 3. API key

Resend → API Keys → create → copy `re_...`

### 4. EC2 `.env`

```bash
EMAIL_PROVIDER=resend
RESEND_API_KEY=re_xxxxxxxx
RESEND_FROM=AIIMIN <noreply@aiimin.in>
SES_FROM_EMAIL=noreply@aiimin.in
SES_FROM_NAME=AIIMIN
```

```bash
pm2 reload deploy/ecosystem.config.cjs --update-env
```

### 5. Test

```bash
node scripts/test-email.mjs your-test@gmail.com
```

`EMAIL_PROVIDER=auto` (default): uses Resend when `RESEND_API_KEY` is set, else SES.

---

## Path C — Escalate AWS (while using A or B)

1. **Support case**: AWS Console → Support → Create case → Service: SES
2. Mention: transactional waitlist for verified domain `aiimin.in`, opt-in only, &lt;500/day
3. Check spam for mail from `no-reply-aws@amazon.com`
4. Same region: **ap-south-1**

When approved, set `EMAIL_PROVIDER=ses` or leave `auto` with Resend as fallback.

---

## Env reference

| Variable | Purpose |
|----------|---------|
| `EMAIL_PROVIDER` | `auto` \| `resend` \| `ses` |
| `RESEND_API_KEY` | Resend API key |
| `RESEND_FROM` | e.g. `AIIMIN <noreply@aiimin.in>` |
| `AWS_SES_SMTP_USER` / `AWS_SES_SMTP_PASS` | SES SMTP |
| `SES_FROM_EMAIL` | From address (both providers) |
| `OWNER_NOTIFY_EMAIL` | Owner waitlist alerts |
