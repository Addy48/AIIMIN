# Capacitor Android (capture shell)

## Contract

| Field | Value |
|-------|--------|
| **Package** | `in.aiimin.app` |
| **Load mode** | Option A — remote WebView (`server.url`) |
| **Start URL** | `https://www.aiimin.in/m` |
| **Firebase** | None — zero Firebase spend |
| **Shell** | Phone capture only (Today / Score / Account) |

Native Android wraps the live `/m` web shell. No bundled full Life OS. Updates ship via Vercel deploy — no Play Store release required for web changes.

## Files

- `frontend/capacitor.config.json` — app id + `server.url`
- `frontend/android/` — Gradle project (committed; build artifacts gitignored)
- `frontend/src/utils/capacitorEnv.js` — native detection, status bar, splash hide
- `frontend/src/hooks/useDeviceTier.js` — `Capacitor.isNativePlatform()` → phone tier
- `frontend/src/components/mobile/MobileBottomNav.jsx` — hides “Get App” tab in native shell

## Local build

Prerequisites: Android Studio, **JDK 21+** (`brew install openjdk@21`), Android SDK.

```bash
cd frontend
npm run cap:build:android    # one-shot: web build + sync + debug APK
npm run cap:open:android     # open Android Studio
```

In Android Studio: **Run** on device/emulator. WebView loads `https://www.aiimin.in/m`.

### Icons / splash

```bash
cd frontend
npm run cap:icons   # brand mark → mipmap + splash densities
```

Runs automatically inside `cap:build:android` / `cap:android`.

### Dev override (optional)

Temporarily point `server.url` in `capacitor.config.json` to your LAN dev server (e.g. `http://192.168.x.x:3000/m`) with `"cleartext": true`, then `npx cap sync android`. Debug APK allows cleartext via `android/app/src/debug/res/xml/network_security_config.xml`. Revert before release builds.

## Play Store

- Listing URL: `MobileBottomNav` → `PLAY_STORE_URL` (`in.aiimin.app`)
- Version: `versionName` in `android/app/build.gradle` (currently `1.0.0`)
- Signing keystore: Android Studio → Build → Generate Signed Bundle — **not in repo**

### First AAB checklist

1. Play Console → Create app → package `in.aiimin.app`
2. Android Studio → `npm run cap:open:android` → Build → Generate Signed Bundle (AAB)
3. Store listing: screenshots of `/m`, `/m/score`, `/m/account`
4. Privacy policy URL: `https://aiimin.in/privacy`
5. No Firebase — push not required for v1 capture shell

## Changelog

### 2026-07-19 — V2 Compose path (not this Capacitor shell)
- **What:** Product native V2 lives in repo-root `native-android/` (Jetpack Compose). This Capacitor project remains legacy `/m` capture WebView only.
- **Why:** Founder rejected wrapping website as the app.
- **Files:** see `docs/knowledge/17_NATIVE_APP_V2/CHANGELOG.md`
- **Status:** partial (Compose Phase 1)

### 2026-07-19 — P0: useDeviceTier crash (prod)
- **What:** Added missing `useState` / `useEffect` import in `useDeviceTier.js` — site + `/m` white-screened
- **Why:** Hook used React APIs without import; ErrorBoundary caught `ReferenceError: useState`
- **Files:** `frontend/src/hooks/useDeviceTier.js`
- **Status:** shipped

### 2026-07-19 — Production WebView + brand icons + DayNight
- **What:** Default `server.url` → `https://www.aiimin.in/m` (HTTPS; no LAN cleartext). Debug builds allow cleartext via `src/debug/res/xml/network_security_config.xml`. Branded launcher + splash from AIIMIN mark (`npm run cap:icons`). Native DayNight chrome (palette light/dark). Status bar follows theme; first native launch follows system light/dark.
- **Why:** Dev APK pointed at LAN HTTP with cleartext blocked — WebView blank / “won’t open”. Prod URL loads on device (login redirect when unauthed).
- **Files:** `capacitor.config.json`, `network_security_config.xml`, `src/debug/.../network_security_config.xml`, `scripts/export-android-icons.mjs`, `values|values-night/colors.xml`, `styles.xml`, `capacitorEnv.js`, `ThemeContext.jsx`, `cap-android-build.sh`, `craco.config.js`
- **Status:** passed (adb install + log: `Loading app at https://www.aiimin.in/m` → `/login`)

### 2026-07-19 — Debug APK build script
- **What:** `scripts/cap-android-build.sh` + `npm run cap:build:android`; auto JDK 21 via Homebrew; first debug APK built
- **Why:** Unblock Android smoke without manual JAVA_HOME
- **Files:** `frontend/scripts/cap-android-build.sh`, `package.json`, `android/README.md`
- **Status:** passed (local `app-debug.apk`)

### 2026-07-19 — Native polish (auth routing + offline + back)
- **What:** `getPostAuthPath()` → `/m` on phone/native; Android back button; offline banner; HTTPS network security config
- **Why:** Capacitor v1 usability — login must land on capture shell, not overview
- **Files:** `mobileEntry.js`, `MobileOfflineBanner.jsx`, `capacitorEnv.js`, `MobileShell.jsx`, `AuthCallback.jsx`, `Login.jsx`, `Onboarding.jsx`, `App.js`, `network_security_config.xml`, `AndroidManifest.xml`
- **Status:** partial (local; device smoke pending)

### 2026-07-19 — Capacitor v1 scaffold
- **What:** Capacitor 7 Android project; remote `server.url` → `https://aiimin.in/m`; native phone tier; status bar `#1A1A1A`; skip PWA SW in native; safe-area padding
- **Why:** P3 audit — Android path without Firebase, ship capture shell fast
- **Files:** `capacitor.config.json`, `frontend/android/*`, `capacitorEnv.js`, `useDeviceTier.js`, `MobileBottomNav.jsx`, `registerServiceWorker.js`, `deviceTiers.css`, `package.json`
- **Status:** partial (scaffold local; Play Store + device smoke pending)
