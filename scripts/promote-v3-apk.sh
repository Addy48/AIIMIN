#!/usr/bin/env bash
# Promote a built V3 APK into native-android-v3/dist/ with retention = 2.
# Keeps: aiimin-v3-current.apk + aiimin-v3-previous.apk only.
# Deletes anything older in that folder.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
DIST="$ROOT/native-android-v3/dist"
SRC="${1:-$ROOT/native-android-v3/app/build/outputs/apk/debug/app-debug.apk}"

if [[ ! -f "$SRC" ]]; then
  echo "APK not found: $SRC" >&2
  echo "Build first: cd native-android-v3 && ./gradlew :app:assembleDebug" >&2
  exit 1
fi

mkdir -p "$DIST"
CURRENT="$DIST/aiimin-v3-current.apk"
PREVIOUS="$DIST/aiimin-v3-previous.apk"

if [[ -f "$CURRENT" ]]; then
  # Same file? skip rotate noise
  if cmp -s "$SRC" "$CURRENT"; then
    echo "No change — current already matches $SRC"
    exit 0
  fi
  rm -f "$PREVIOUS"
  mv "$CURRENT" "$PREVIOUS"
  echo "Rotated previous ← was current"
fi

cp "$SRC" "$CURRENT"
# Prune anything else in dist (dated copies, old names)
find "$DIST" -maxdepth 1 -type f \( -name '*.apk' -o -name '*.aab' \) \
  ! -name 'aiimin-v3-current.apk' \
  ! -name 'aiimin-v3-previous.apk' \
  -print -delete

SIZE=$(wc -c < "$CURRENT" | tr -d ' ')
echo "Promoted current ($SIZE bytes) from $SRC"
ls -lh "$DIST"/*.apk 2>/dev/null || true
