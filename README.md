<div align="center">

# AIIMIN

**Your day, your money and your family's papers, in one calm place.**

[Website](https://aiimin.in) · [Android beta](https://github.com/Addy48/AIIMIN/releases/latest) · [Changelog](CHANGELOG.md) · [Security](SECURITY.md)

</div>

AIIMIN turns what your phone already knows into a clear picture of your life. It reads bank SMS on the phone to build your month of spending, keeps tasks and focus time for the day, and holds the family's documents and emergency card offline. It only ever compares you with you. No ads, no lending, and your data is never sold.

> **Status:** public beta on Android (`4.0.0-beta01`). The web app at [aiimin.in](https://aiimin.in) is in waitlist mode.

## What's in this repository

| Folder | What it is | Stack |
|---|---|---|
| [`android/`](android/) | The Android app, the main product | Kotlin, Jetpack Compose, Hilt, Room, Navigation 3 |
| [`web/`](web/) | aiimin.in: waitlist, `/app` download page and the web app | React 19, React Router 7, React Query, CRACO |
| [`server/`](server/) | The API behind sign-in, sync, waitlist and billing | Node.js, Hono, Better Auth, Postgres (Supabase) |
| [`api/`](api/) | The API entry point that mounts the server routes | Hono |
| [`supabase/`](supabase/) | Database migrations | SQL |
| [`deploy/`](deploy/) | API hosting: EC2 setup, PM2, nginx, maintenance scripts | Bash |
| [`scripts/`](scripts/) | Developer tools: env sync, auth migrations, QA captures | Node.js |
| [`docs/`](docs/) | Architecture diagrams | |
| [`app-v3-legacy/`](app-v3-legacy/) | The previous Android app, kept for reference. Not built or shipped. | Kotlin |

## Get the Android app

Download `aiimin-android.apk` from the [latest release](https://github.com/Addy48/AIIMIN/releases/latest) on an Android phone and open it. Android 8.0 or newer; tested most on Android 12 and later, on phones, foldables and tablets.

## Run it locally

Requirements: Node.js 20+ (Vercel builds on 24), JDK 17, Android SDK (API 37).

```bash
git clone https://github.com/Addy48/AIIMIN.git
cd AIIMIN
cp .env.example .env          # fill in the values you need
npm install                   # installs the root (API) and web dependencies
npm run dev                   # API on :3001, web on :3000
```

Android:

```bash
cd android
./gradlew :app:assembleDebug
adb install -r app/build/outputs/apk/debug/app-debug.apk
```

Each folder's README has the details: [android](android/README.md), [web](web/README.md), [server](server/README.md).

## Tests

```bash
npm test                                          # server unit tests
cd web && CI=true npx craco test --watchAll=false # web
cd android && ./gradlew testDebugUnitTest         # Android unit tests
```

CI builds the web app and the Android app on pull requests that touch them (`.github/workflows`).

## Privacy, in short

- Bank SMS are read on the phone. They are never uploaded.
- Health and screen-time data stay on the phone.
- Sync to aiimin.in is private to your account, and you can export your data anytime.

Found a security issue? See [SECURITY.md](SECURITY.md).

## License

Copyright © 2026 Aaditya Upadhyay. All rights reserved. The source is published so people can see how AIIMIN handles their data; it is not open source. See [LICENSE](LICENSE).
