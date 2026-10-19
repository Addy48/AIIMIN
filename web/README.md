# AIIMIN web

The aiimin.in site and web app: the waitlist, the `/app` Android download page, and the signed-in web app for desktop, tablet and phone browsers.

> The Android app lives in [`../android`](../android). The `android/` folder here is a separate Capacitor WebView shell, not the main app.

---

## Stack

| Piece | Tech |
|-------|------|
| UI | React 19, React Router 7 |
| Styling | Tailwind + CSS variables (`index.css`) |
| Data | React Query hooks (`useDailyLogsQuery`, `useCorrelationsQuery`, …) |
| Charts | Recharts |
| Auth | Better Auth client → `api.aiimin.in` |
| Build | CRACO (`craco.config.js`) |

---

## Device tiers

```mermaid
flowchart TD
  D[DeviceGate] --> P{Phone?}
  P -->|yes| M["/m MobileShell<br/>capture only"]
  P -->|no| T{Tablet?}
  T -->|yes| F["Full OS + TabRail"]
  T -->|no| W["Full OS + Navbar"]
```

| Tier | Width / UA | Experience |
|------|------------|----------|
| Phone | &lt;768px or mobile UA | `/m` — Today, Score, Account |
| Tablet | 768–1099px or iPad | Full OS, touch masthead |
| Desktop | ≥1100px | Full OS, wide layouts |

Override: `?forceDesktop=1`

---

## Key directories

```
src/
├── pages/           # Route-level views (Overview, Finance, Journal, …)
├── components/      # Shared UI (not mobile/ for web-only work)
├── components/mobile/   # ⚠ /m + Capacitor only
├── hooks/           # React Query + domain hooks
├── api/             # Thin fetch wrappers per domain
├── context/         # Auth, theme
└── styles/          # Global + feature CSS
```

---

## Scripts

```bash
npm start          # dev server :3000
npm run build      # production bundle → build/
CI=true npx craco test --watchAll=false   # Jest

# Capacitor (separate release train)
npm run cap:build:android
npm run cap:dev:phone    # LAN dev WebView
```

---

## Environment

Set in `web/.env.local` (never commit):

- `REACT_APP_API_URL` — API base (prod: `https://api.aiimin.in`)
- Supabase public keys if used client-side
- Feature flags (`REACT_APP_WAITLIST_MODE`, etc.)

---

## Palette (locked)

| Token | Value |
|-------|-------|
| `--color-base` dark | `#1a1a1a` |
| `--color-surface` dark | `#2d2d2d` |
| `--color-accent` | `#ff6b35` |
| `--color-done` | `#10b981` |


---

## Related docs

- Phone shell (`/m`): [`src/components/mobile/README.md`](src/components/mobile/README.md)
- Capacitor shell: [`android/README.md`](android/README.md)
- API: [`../server/README.md`](../server/README.md)
