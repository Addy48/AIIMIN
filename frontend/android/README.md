# Android (Capacitor)

Remote WebView shell for phone capture. See `docs/knowledge/09_FEATURES/Mobile/Capacitor-Android.md`.

## Quick start

```bash
cd frontend
npm run cap:build:android   # build web + sync + debug APK (JDK 21 via brew)
npm run cap:open:android    # Android Studio
```

**JDK:** Capacitor 7 needs **JDK 21**. Script auto-picks `brew --prefix openjdk@21`. Install: `brew install openjdk@21`

**Output:** `android/app/build/outputs/apk/debug/app-debug.apk`

Loads `https://aiimin.in/m` — no Firebase.
