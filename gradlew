#!/usr/bin/env bash
# Forwarder for Android Studio Lite (and any tool that looks for ./gradlew
# at the Cursor workspace root). Real Android project is native-android-v3/.
# Do not add a second Gradle project here.
set -euo pipefail
ROOT="$(cd "$(dirname "$0")" && pwd)"
cd "$ROOT/native-android-v3"
exec ./gradlew "$@"
