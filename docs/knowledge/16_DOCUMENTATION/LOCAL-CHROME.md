# Run AIIMIN locally in Chrome

## Prerequisites
- Node.js 18+ installed
- `.env` in project root (already configured)
- `frontend/.env.local` (already configured)

## Start (two terminals)

**Terminal 1 — API (port 3001)**
```bash
cd "/Users/aaditya/Desktop/DASHBOARD PROJECT"
npm run dev:api
```
Wait for: `Server is running on port 3001`

**Terminal 2 — Frontend (port 3000)**
```bash
cd "/Users/aaditya/Desktop/DASHBOARD PROJECT/frontend"
npm start
```
Chrome should open automatically to **http://localhost:3000**

If it doesn't, open Chrome manually and go to:
- **http://localhost:3000** — full app (waitlist OFF locally)
- **http://localhost:3000/login** — sign up / sign in
- **http://localhost:3000/overview** — dashboard (after login)

## Verify API + Better Auth

```bash
curl http://localhost:3001/api/health
curl http://localhost:3001/api/auth/ok
```
Both should return JSON with `"ok"` or `"status":"ok"`.

## Local vs live

| | Local Chrome | Live (aiimin.in) |
|---|--------------|------------------|
| Frontend | localhost:3000 | Vercel |
| API | localhost:3001 | api.aiimin.in (EC2) |
| Waitlist landing | OFF (`REACT_APP_WAITLIST_MODE=false`) | ON for public |
| Your email | Full app (dev/tester) | Full app if in TESTER_EMAILS |

## First-time signup (fresh DB)
1. Go to http://localhost:3000/login
2. Sign up with email + OS-ID + 6-digit PIN
3. Verify email (check inbox — Resend)
4. Complete onboarding
5. Use **Account → Privacy & Security** for PIN / calendar

## Troubleshooting
- **Port in use:** `lsof -ti:3001 | xargs kill -9` then restart API
- **Blank page:** check Terminal 2 for compile errors
- **401 on API:** sign out and sign in again; clear site data for localhost in Chrome DevTools → Application
