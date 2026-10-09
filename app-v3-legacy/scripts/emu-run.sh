#!/usr/bin/env bash
# Cursor → Gradle (optional) → ADB → AiiminLean emulator → screenshot.
# Default: install the existing debug APK. Do not rebuild while the emulator
# is running on this 8 GB Mac unless you pass --build.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
SDK="${ANDROID_HOME:-${ANDROID_SDK_ROOT:-$HOME/Library/Android/sdk}}"
export ANDROID_HOME="$SDK"
export ANDROID_SDK_ROOT="$SDK"
export PATH="$SDK/platform-tools:$SDK/emulator:$PATH"

AVD="${AIIMIN_AVD:-AiiminLean}"
PKG="in.aiimin.app.v3"
ACTIVITY="aiimin.app.MainActivity"
APK="$ROOT/app/build/outputs/apk/debug/app-debug.apk"
SHOT_DIR="$ROOT/captures/emu"
ADB="$SDK/platform-tools/adb"
EMU="$SDK/emulator/emulator"
ANDROID_CLI="${ANDROID_CLI:-$(command -v android || true)}"

BUILD=0
SHOT_ONLY=0
NO_LAUNCH=0

usage() {
  cat <<'EOF'
Usage: scripts/emu-run.sh [--build] [--shot] [--no-launch]

  (default)   Start AiiminLean if needed, install debug APK, launch, screenshot.
  --build     Run :app:assembleDebug first. Avoid while the emulator is already
              running on this 8 GB machine.
  --shot      Screenshot only (device must already be up).
  --no-launch Install but do not start the activity.

Env: ANDROID_HOME  AIIMIN_AVD (default AiiminLean)
APK: app/build/outputs/apk/debug/app-debug.apk
Pkg: in.aiimin.app.v3
EOF
}

while [[ $# -gt 0 ]]; do
  case "$1" in
    --build) BUILD=1; shift ;;
    --shot) SHOT_ONLY=1; shift ;;
    --no-launch) NO_LAUNCH=1; shift ;;
    -h|--help) usage; exit 0 ;;
    *) echo "unknown arg: $1" >&2; usage; exit 2 ;;
  esac
done

need() {
  [[ -x "$1" ]] || { echo "missing executable: $1" >&2; exit 1; }
}

need "$ADB"
need "$EMU"

serial() {
  "$ADB" devices | awk '/^emulator-/{print $1; exit}'
}

boot_done() {
  local s="$1"
  [[ "$("$ADB" -s "$s" shell getprop sys.boot_completed 2>/dev/null | tr -d '\r')" == "1" ]]
}

wait_boot() {
  local s=""
  local i=0
  echo "waiting for emulator (up to 180s)…"
  while (( i < 90 )); do
    s="$(serial)"
    if [[ -n "$s" ]] && boot_done "$s"; then
      echo "boot complete: $s"
      echo "$s"
      return 0
    fi
    sleep 2
    i=$((i + 1))
  done
  echo "emulator did not reach sys.boot_completed" >&2
  "$ADB" devices -l >&2
  return 1
}

ensure_emu() {
  local s
  s="$(serial)"
  if [[ -n "$s" ]] && boot_done "$s"; then
    echo "emulator already up: $s" >&2
    echo "$s"
    return 0
  fi
  if [[ -z "$s" ]]; then
    echo "starting $AVD via Terminal (must outlive this shell)…" >&2
    open "$ROOT/scripts/start-emulator.command"
  else
    echo "emulator serial $s present, waiting for boot…" >&2
  fi
  wait_boot
}

shot() {
  local s="$1"
  mkdir -p "$SHOT_DIR"
  local out="$SHOT_DIR/$(date +%Y%m%d-%H%M%S).png"
  if [[ -n "$ANDROID_CLI" ]]; then
    "$ANDROID_CLI" screen capture --device="$s" -o="$out"
  else
    "$ADB" -s "$s" exec-out screencap -p >"$out"
  fi
  echo "screenshot $out"
}

if [[ "$SHOT_ONLY" -eq 1 ]]; then
  s="$(serial)"
  [[ -n "$s" ]] || { echo "no emulator" >&2; exit 1; }
  shot "$s"
  exit 0
fi

if [[ "$BUILD" -eq 1 ]]; then
  echo "assembleDebug — keep emulator stopped on this 8 GB Mac if Gradle thrashes"
  (cd "$ROOT" && ./gradlew :app:assembleDebug --quiet)
fi

[[ -f "$APK" ]] || { echo "no APK at $APK — run with --build" >&2; exit 1; }

s="$(ensure_emu)"
s="$(serial)"
[[ -n "$s" ]] || { echo "no emulator serial after start" >&2; exit 1; }

"$ADB" -s "$s" shell settings put global window_animation_scale 0 || true
"$ADB" -s "$s" shell settings put global transition_animation_scale 0 || true
"$ADB" -s "$s" shell settings put global animator_duration_scale 0 || true

echo "install $APK → $s"
"$ADB" -s "$s" install -r -t "$APK"

if [[ "$NO_LAUNCH" -eq 0 ]]; then
  echo "launch $PKG/$ACTIVITY"
  "$ADB" -s "$s" shell am start -W -n "$PKG/$ACTIVITY"
  sleep 2
fi

shot "$s"
echo "ok  $s  $PKG"
