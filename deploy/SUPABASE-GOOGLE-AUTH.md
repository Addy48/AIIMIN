# Google OAuth + Supabase Auth — tester login fix

## Error: `signup_disabled`

Supabase has **new signups disabled**. Google login for a **new** Gmail tries to create an account → blocked.

**Fix A (recommended for testers):** Pre-invite allowlist emails:

```bash
node scripts/invite-tester-auth.mjs
```

Then testers use **Continue with Google** — Supabase links to the existing user.

**Fix B (alternative):** Supabase Dashboard → **Authentication** → **Providers** → enable **Allow new users to sign up**.  
Waitlist gate still blocks non-allowlisted emails in the app.

---

## Error: `invalid_client` / Unable to exchange external code

Google **Client Secret** in Supabase does not match Google Cloud Console.

1. Google Cloud → Credentials → OAuth 2.0 Client
2. Copy Client ID + **current** Client Secret (or reset secret)
3. Supabase → Authentication → Providers → **Google** → paste both → Save

**Redirect URI in Google Cloud (required):**

```
https://yubxgftugxbwtywyhcsv.supabase.co/auth/v1/callback
```

---

## Supabase URL Configuration

| Field | Value |
|-------|--------|
| Site URL | `https://www.aiimin.in` |
| Redirect URLs | `https://www.aiimin.in/auth/callback` |
| | `https://aiimin.in/auth/callback` |

---

## Security

- Never commit `client_secret*.json` — added to `.gitignore`
- Store Google secret **only** in Supabase Google provider settings
- Rotate secret if exposed in chat or git

---

## Verify

```bash
node scripts/invite-tester-auth.mjs
```

Sign out → `/login` → Google with allowlisted Gmail → should reach `/overview` or onboarding.
