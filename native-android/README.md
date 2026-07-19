# AIIMIN Native Android (V2)

Kotlin + Jetpack Compose companion app. Package: `in.aiimin.app`.

## Requirements

- JDK 17
- Android SDK (API 35)
- Physical device or emulator (API 26+)

## Build

```bash
cd native-android
export JAVA_HOME="$(/usr/libexec/java_home -v 17)"   # macOS; adjust on Linux

./gradlew :app:assembleDebug
./gradlew :app:assembleRelease   # unsigned (debug keystore) unless signing env set
```

**APK outputs**

| Variant | Path |
|---------|------|
| Debug | `app/build/outputs/apk/debug/app-debug.apk` |
| Release | `app/build/outputs/apk/release/app-release.apk` |

## Install

```bash
adb install -r app/build/outputs/apk/debug/app-debug.apk
```

## Signed release (Play / sideload)

Set env vars then `assembleRelease`:

```bash
export ANDROID_KEYSTORE_PATH=/path/to/aiimin-release.keystore
export ANDROID_KEYSTORE_PASSWORD=...
export ANDROID_KEY_ALIAS=aiimin
export ANDROID_KEY_PASSWORD=...
./gradlew :app:assembleRelease
```

CI: GitHub Actions → **Native Android** → `build_release: true` (needs repo secrets — see `docs/knowledge/17_NATIVE_APP_V2/WORKFLOW-PLAN.md`).

## API

Default prod: `https://api.aiimin.in/api`

Local override:

```bash
./gradlew :app:assembleDebug -Paiimin.apiBaseUrl=http://10.0.2.2:3001/api
```

Endpoints: `GET /mobile/bootstrap`, `POST /mobile/sync/batch`, Better Auth sign-in.

## Vault

Living tracker: `docs/knowledge/17_NATIVE_APP_V2/WORKFLOW-PLAN.md`
