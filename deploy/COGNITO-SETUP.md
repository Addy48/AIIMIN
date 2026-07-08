# AWS Cognito setup — Phase 2 (after tester allowlist)

Task 3 (tester login) uses **Supabase Auth** temporarily. Cognito replaces it in Phase 2.

## Prerequisites

- AWS CLI configured (`aws sts get-caller-identity`)
- Domain `aiimin.in` on Vercel
- Google Cloud OAuth client (for Google sign-in)

## Step 1 — Create User Pool (Mac)

```bash
cd "/Users/aaditya/Desktop/DASHBOARD PROJECT"
bash deploy/setup-cognito.sh
```

Save output: `COGNITO_USER_POOL_ID`, `COGNITO_CLIENT_ID`, `COGNITO_HOSTED_DOMAIN`.

## Step 2 — Google IdP (AWS Console)

1. Cognito → User pool → **Sign-in experience** → Add Google
2. Google Cloud Console → OAuth client:
   - Authorized redirect: `https://aiimin-auth.auth.ap-south-1.amazoncognito.com/oauth2/idpresponse`
3. Paste Google client ID + secret into Cognito

## Step 3 — Callback URLs (Cognito app client)

Add to app client:

- `https://www.aiimin.in/auth/callback`
- `https://aiimin.in/auth/callback`
- `http://localhost:3000/auth/callback`

Logout URLs: same origins.

## Step 4 — Vercel env

| Variable | Example |
|----------|---------|
| `REACT_APP_COGNITO_USER_POOL_ID` | `ap-south-1_xxxxx` |
| `REACT_APP_COGNITO_CLIENT_ID` | `xxxxxxxx` |
| `REACT_APP_COGNITO_DOMAIN` | `https://aiimin-auth.auth.ap-south-1.amazoncognito.com` |
| `REACT_APP_COGNITO_REGION` | `ap-south-1` |

Keep `REACT_APP_SUPABASE_URL` + `REACT_APP_SUPABASE_ANON_KEY` until migration cutover.

## Step 5 — EC2 env

```
COGNITO_USER_POOL_ID=ap-south-1_xxxxx
COGNITO_CLIENT_ID=xxxxxxxx
COGNITO_REGION=ap-south-1
OWNER_COGNITO_SUBS=<your-sub-after-first-login>
```

## Step 6 — Code (not yet implemented)

- [ ] `server/lib/cognitoJwt.js` — verify access tokens
- [ ] `server/middleware/auth.js` — Cognito first, Supabase fallback
- [ ] `frontend/src/context/CognitoAuthContext.jsx` — replace Supabase session
- [ ] `Login.jsx` — Hosted UI or Amplify sign-in
- [ ] `AuthCallback.jsx` — exchange code for tokens

## Tester access (works now)

1. Email on `tester_allowlist` or `TESTER_EMAILS` / `DEV_EMAILS`
2. Sign in at `/login` (Google or OS-ID + PIN via Supabase)
3. `GET /auth/access` returns `canAccessApp: true`

Seed allowlist:

```bash
node scripts/seed-access-allowlist.mjs
```
