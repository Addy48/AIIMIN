#!/bin/bash
# Double-click or: open app/scripts/start-emulator.command
# Must start in a detached session so the emulator process is preserved.
set -euo pipefail
SDK="${ANDROID_HOME:-${ANDROID_SDK_ROOT:-$HOME/Library/Android/sdk}}"
export ANDROID_HOME="$SDK"
export ANDROID_SDK_ROOT="$SDK"
export PATH="$SDK/platform-tools:$SDK/emulator:$PATH"
AVD="${AIIMIN_AVD:-AiiminLean}"
echo "Starting $AVD — close this window only if you also want the emulator to quit."
exec "$SDK/emulator/emulator" -avd "$AVD" \
  -no-boot-anim -no-audio \
  -gpu host \
  -netdelay none -netspeed full
