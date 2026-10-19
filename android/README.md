# AIIMIN for Android

The main AIIMIN app: Today, Money from bank SMS, Vault for the family's papers, and Me.

- **Package:** `in.aiimin.app.v4`
- **Android:** 8.0+ (minSdk 26), targets API 37
- **Stack:** Kotlin, Jetpack Compose, Hilt, Room 3, Navigation 3, WorkManager, ML Kit text recognition

## Build and run

```bash
./gradlew :app:assembleDebug
adb install -r app/build/outputs/apk/debug/app-debug.apk
```

Release builds (`:app:assembleRelease`) are minified with R8. They are signed with the release key when `AIIMIN_STORE_PASSWORD`, `AIIMIN_KEY_ALIAS` and `AIIMIN_KEY_PASSWORD` are set in `~/.gradle/gradle.properties`, and with the debug key otherwise. Never commit keystores or passwords.

## Tests

```bash
./gradlew testDebugUnitTest
```

## Modules

| Module | What it holds |
|---|---|
| `app` | Activity, navigation graph, app-level wiring |
| `core/designsystem` | Theme, type scale, colours and shared Compose components |
| `core/model` | Plain data types shared across modules |
| `core/database` | Room entities, DAOs and migrations |
| `core/data` | Repositories and pure rules (money, plans, vault) |
| `core/nlp` | Bank SMS reading and filtering, voice capture parsing |
| `core/sensing` | Steps, sleep and screen time from the phone |
| `core/engine` | The day model and on-device rules (day snapshot, battery, intentions) |
| `core/network` | API client: sign-in, sync, billing |
| `core/privacy` | Access rules for family profiles |
| `feature/*` | One module per area: today, money, vault, notes, me, assistant, onboarding |
| `build-logic` | Gradle convention plugins shared by every module |

## How it treats data

- Bank SMS are read and filtered on the phone (`core/nlp`); payments land in a review list in the local database, and the messages themselves are not uploaded.
- Health Connect and screen-time data stay on the phone.
- Sign-in and sync go to the AIIMIN API (`../server`).

Third-party fonts and assets: [THIRD_PARTY.md](THIRD_PARTY.md).
