#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

# Capacitor 7 Android requires JDK 21 (compile target)
pick_java_home() {
  if [[ -n "${JAVA_HOME:-}" ]] && "$JAVA_HOME/bin/java" -version 2>&1 | grep -Eq 'version "(1[89]|[2-9][0-9])'; then
    return 0
  fi
  if ! command -v brew >/dev/null 2>&1; then
    return 1
  fi
  for formula in openjdk@21 openjdk@17; do
    prefix="$(brew --prefix "$formula" 2>/dev/null || true)"
    candidate="$prefix/libexec/openjdk.jdk/Contents/Home"
    if [[ -x "$candidate/bin/java" ]]; then
      export JAVA_HOME="$candidate"
      return 0
    fi
  done
  return 1
}

if ! pick_java_home; then
  echo "ERROR: JDK 21+ required. Install: brew install openjdk@21" >&2
  exit 1
fi

echo "Using JAVA_HOME=$JAVA_HOME"
"$JAVA_HOME/bin/java" -version

npm run build
npm run cap:icons
npx cap sync android
cd android
./gradlew assembleDebug "$@"

APK="app/build/outputs/apk/debug/app-debug.apk"
if [[ -f "$APK" ]]; then
  echo ""
  echo "Debug APK: $ROOT/android/$APK"
fi
