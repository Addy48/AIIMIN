# Google Cloud Console — AIIMIN OAuth (one-time setup)

Use **one OAuth 2.0 Client** (Web application) for both login and calendar, or two separate clients with the same redirect URIs pattern.

**Client ID in use:** `719779655523-fbio87p15lhshptn8rpeaa779bj41rft.apps.googleusercontent.com`

---

## 1. APIs & Services → OAuth consent screen

| Field | Value |
|-------|--------|
| User type | **External** (or Internal if Workspace) |
| App name | **AIIMIN** |
| User support email | your email |
| Developer contact | your email |

**Scopes** (add manually):

| Scope | Purpose |
|-------|---------|
| `openid` | Login identity |
| `email` | Login email |
| `profile` | Name/avatar |
| `https://www.googleapis.com/auth/calendar.readonly` | Calendar sync |
| `https://www.googleapis.com/auth/youtube.readonly` | YouTube (optional) |

**Test users** (while app is in *Testing*): add every Gmail that must use Calendar or Google login:

- `aadityaupadhyay10@gmail.com` (dev/owner)
- `aadityaupadhyay85@gmail.com`
- `sanchitbhatia2006@gmail.com`
- `adityamehta298@gmail.com`
- `shishangthakur@icloud.com`
- `kuldeepyadav2911@gmail.com`
- Any other Gmail used for **calendar linking** (can differ from AIIMIN login email)

To go live for everyone: **Publish app** (may require Google verification for sensitive scopes).

---

## 2. APIs & Services → Credentials → OAuth 2.0 Client ID → Web client

### Authorized JavaScript origins

```
http://localhost:3000
http://localhost:3001
https://aiimin.in
https://www.aiimin.in
https://api.aiimin.in
```

### Authorized redirect URIs (all four — do not skip)

| URI | Used for |
|-----|----------|
| `http://localhost:3001/api/auth/callback/google` | **Better Auth login** (local) |
| `https://api.aiimin.in/api/auth/callback/google` | **Better Auth login** (production) |
| `http://localhost:3001/api/google/auth/callback` | **Calendar/YouTube** (local) |
| `https://api.aiimin.in/api/google/auth/callback` | **Calendar/YouTube** (production) |

Do **not** use `aiimin.in/auth/callback` for Google — login callback is on the **API host** (`api.aiimin.in`).

---

## 3. Environment mapping

| Environment | `BETTER_AUTH_URL` | `FRONTEND_URL` | `GOOGLE_*_REDIRECT_URI` |
|-------------|-------------------|----------------|-------------------------|
| **Local** | `http://localhost:3001` | `http://localhost:3000` | `http://localhost:3001/api/google/auth/callback` |
| **Production** | `https://api.aiimin.in` | `https://aiimin.in` | `https://api.aiimin.in/api/google/auth/callback` |

Better Auth Google login callback is always: `{BETTER_AUTH_URL}/api/auth/callback/google`

---

## 4. Enable APIs (APIs & Services → Library)

- **Google Calendar API**
- **YouTube Data API v3** (if using YouTube features)

---

## 5. Checklist before launch

- [ ] All 4 redirect URIs added
- [ ] All 5 JavaScript origins added
- [ ] Calendar + YouTube APIs enabled
- [ ] Test users added OR app published
- [ ] EC2 `.env`: `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL=https://api.aiimin.in`
- [ ] Vercel: `REACT_APP_API_URL=https://api.aiimin.in/api`
