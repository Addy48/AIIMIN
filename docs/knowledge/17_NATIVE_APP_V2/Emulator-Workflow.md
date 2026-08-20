---
authority: engineering
derived_from: 15_MEMORY/Handoff-Native-App-Build · Guides/The-App-Build
status: active
owner: founder
lifecycle: living
last_reviewed: 2026-08-15
can_override_genesis: false
knowledge_layer: KL-BUILD
graph_role: leaf
note_type: NT-ENG-LEAF
tags:
  - type/runbook
  - domain/native
  - status/living
---

# Native V3 — Emulator workflow (no USB)

> How to **see** the Kotlin app on this Mac without plugging in AIN065.
> Palette and Genesis are unchanged. This is tooling, not product.

## Why this exists

Handoff 2026-08-03 said: 8 GB RAM, prefer physical phone, no emulator MCP. Founder 2026-08-13 asked for a visual loop anyway: Cursor builds, emulator shows the UI, agent can screenshot.

That override stands. The RAM warning still stands.

## What is installed (2026-08-13)

| Piece | Where |
|-------|--------|
| Android CLI | `brew tap android/tap` · `android` at `/opt/homebrew/bin/android` · SDK root `~/Library/Android/sdk` |
| Emulator | `~/Library/Android/sdk/emulator/emulator` 37.1.11 · Hypervisor.Framework (Apple M2) |
| System image | `system-images/android-35/google_apis/arm64-v8a/` — **Google APIs, no Play Store** |
| AVD | `AiiminLean` · 1080×2400 @ 420dpi · guest RAM 1536 (emulator may raise to 2560) |
| Package | `in.aiimin.app.v3` · activity `aiimin.app.MainActivity` |
| Scripts | `native-android-v3/scripts/start-emulator.command` · `native-android-v3/scripts/emu-run.sh` |
| Cursor extension | **Android Studio Lite** `krishna-kudari.android-studio-lite` 0.0.10 — sidebar Run / AVD / Logcat. Not Android Studio.app |
| Repo `gradlew` | Workspace-root **forwarder** → `native-android-v3/gradlew` (Lite only looks at folder `[0]`) |
| cmdline-tools | `~/Library/Android/sdk/cmdline-tools/latest/` (installed 2026-08-15 — `avdmanager` needs this) |

Broken leftover: `Medium_Phone_API_36.1` points at a missing `android-36.1` Play image. Ignore it. Do not select it in Lite.

## Android Studio Lite (Cursor — stay out of Android Studio.app)

Founder asked 2026-08-15: use this extension in detail; do not go back to Android Studio for a while.

### What it is

Activity-bar Android icon. Sidebar: AVD dropdown, module dropdown, **Run**, Logcat toggle, AVD tree, Build Variant tree.

It is **not** a substitute for the RAM law. Lite **Run** boots the AVD (if needed) then runs Gradle `installDebug`. On this 8 GB Mac that is qemu + Gradle together — the same trap as `assembleDebug` while the emulator is up.

### First-time (already done on this Mac, 2026-08-15)

1. Extension installed: `krishna-kudari.android-studio-lite` 0.0.10.
2. SDK path in **User** and **Workspace** settings: `android-studio-lite.sdkPath` = `/Users/aaditya/Library/Android/sdk` (also adb, emulator, avdHome, avdmanager, sdkmanager).
3. `cmdline-tools/latest` installed via `android sdk install cmdline-tools/latest`.
4. `ANDROID_HOME` / `JAVA_HOME` in `~/.zshrc` and `launchctl` (GUI Cursor does not read zshrc). LaunchAgent: `~/Library/LaunchAgents/in.aiimin.env.android.plist`.
5. Repo-root `gradlew` forwards into `native-android-v3/` so Lite does not show “Open an Android project”.

After changing settings or env: **Developer: Reload Window**. After `launchctl setenv`, **fully quit Cursor** (Cmd+Q) and reopen so the extension host inherits `JAVA_HOME`.

### Founder loop (daily)

1. Open this repo folder (DASHBOARD PROJECT), not `native-android-v3` alone — vault + web stay in the same window.
2. Click the Android icon in the activity bar.
3. Device: **AiiminLean**. Ignore `Medium_Phone_API_36.1`.
4. Module: **`:app`** (application). Variant: **debug**.
5. **Logcat:** turn on only after the app has been launched once from Lite (it filters by last-run PID). Until then: `adb logcat --pid=$(adb shell pidof -s in.aiimin.app.v3)`.
6. **Run on this 8 GB Mac:**
   - Emulator already up → **do not click Run**. Stop qemu first, *or* use `emu-run.sh` to install an already-built APK.
   - Emulator down → Run will start AiiminLean **and** Gradle. That still overlaps. Prefer: stop everything → `./gradlew :app:assembleDebug` from `native-android-v3` → `open scripts/start-emulator.command` → `./scripts/emu-run.sh`.
   - Physical **AIN065** USB → Run is Gradle-only (no qemu). That is the safe Lite Run target.

Commands (Command Palette, `Android Studio Lite:`):

| Command | Use |
|---------|-----|
| Run App | Gradle install + launch. RAM-dangerous if qemu is up |
| Start Emulator / Select Device | Prefer `start-emulator.command` so qemu is not a Cursor child |
| Start / Stop / Clear Logcat | After first Lite Run |
| Stop App / Uninstall / Clear Data | Device lifecycle. Clear Data wipes local PIN/session — ask first |
| Update SDK Root Path | Already set — leave it |
| Run Setup Wizard | Re-check SDK; accept detected `~/Library/Android/sdk` |

### Why a root `gradlew`

Lite `GradleService` uses `workspaceFolders[0]/gradlew`. This monorepo’s real wrappers live in `native-android-v3/`, `native-android/` (V2, do not use), and `frontend/android/` (Capacitor). The root script `cd`s into **V3 only**.

### Env (this machine)

```text
ANDROID_HOME=/Users/aaditya/Library/Android/sdk
JAVA_HOME=/opt/homebrew/opt/openjdk@17/libexec/openjdk.jdk/Contents/Home
AVD=AiiminLean
package=in.aiimin.app.v3
```

## Loop

```text
Cursor writes Kotlin
        │
  ./gradlew :app:assembleDebug     ← only when emulator is STOPPED on 8 GB
        │
  open scripts/start-emulator.command     ← Terminal.app, not the agent shell
        │
  scripts/emu-run.sh               ← adb install -r, launch, PNG
        │
  captures/emu/*.png               ← gitignored (captures/)
        │
  android screen capture / layout  ← agent inspect
```

### Founder — see the phone window

1. Leave a Terminal window open (closing it kills qemu).
2. Double-click `native-android-v3/scripts/start-emulator.command`, or from repo:

```bash
open native-android-v3/scripts/start-emulator.command
```

3. Wait until the emulator shows a home screen (~30–60 s first boot).
4. Then:

```bash
cd native-android-v3
./scripts/emu-run.sh          # install existing debug APK + launch + screenshot
./scripts/emu-run.sh --shot   # screenshot only
```

Do **not** pass `--build` while the emulator is running on this machine. Stop the emulator, assemble, start again.

### Agent — do not start qemu as a child of the Cursor shell

If qemu is a child of the agent command, it dies when that command ends. Always start via `open …/start-emulator.command` (Aqua / Terminal.app). Then `adb` from the agent is fine.

Useful Android CLI (after the emulator is up):

```bash
android emulator list
adb devices
android screen capture -o=native-android-v3/captures/emu/now.png
android screen capture -a -o=native-android-v3/captures/emu/annotated.png
android layout --pretty
adb logcat --pid=$(adb shell pidof -s in.aiimin.app.v3)
```

## RAM law (do not ignore)

This Mac is **8 GB**. Observed 2026-08-13: ~0.06 GB free, compressor ~3.3 GB before qemu. Guest RAM was raised by the emulator to **2560 MB**. First visual session: Welcome rendered, then **System UI isn't responding**, then qemu exited.

Rules:

1. Do not run Android Studio.app + Gradle daemon + emulator together. Android Studio Lite in Cursor is the IDE path; it is not a free pass to Gradle-while-qemu.
2. Do not `assembleDebug` / Lite **Run** while qemu is up.
3. If System UI ANRs, tap **Wait** or `adb shell input tap` the Wait control — that is the emulator, not AIIMIN.
4. Physical AIN065 remains the source of truth for screen-time, Health Connect, SMS, biometrics.
5. Maestro / Appium: not installed. Add only after this loop stays up for a full onboarding pass.

## First visual proof (2026-08-13)

- `adb install -r` **Success** on `emulator-5554`
- Cold launch `in.aiimin.app.v3/aiimin.app.MainActivity` TotalTime 15693 ms
- Splash: peak-A BrandMark on light field
- Then Welcome: `STEP 01 / 06 · WELCOME` · `ONE SCREEN. EVERY DAY.` · `I AM 18 OR OLDER` / `BEGIN` / `SKIP · LOCAL DEMO`
- PNGs: `native-android-v3/captures/emu/` (gitignored)

Emulator visual QA is **possible**. It is not a substitute for AIN065 on device-only APIs.

## Related

- [[15_MEMORY/Handoff-Native-App-Build]] — original 8 GB / no-emulator constraint
- [[Guides/The-App-Build]]
- [[V3-COMPLETE-BUILD-SPEC]]
- [[CHANGELOG]]
