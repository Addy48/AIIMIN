#!/usr/bin/env bash
# Promote a built APK into app/dist/ with retention = 2.
# Keeps: aiimin-v3-current.apk + aiimin-v3-previous.apk only.
# Deletes anything older in that folder.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
DIST="$ROOT/app/dist"
RELEASE_APK="$ROOT/app/app/build/outputs/apk/release/app-release.apk"
DEBUG_APK="$ROOT/app/app/build/outputs/apk/debug/app-debug.apk"

SRC="${1:-}"
if [[ -z "$SRC" ]]; then
  if [[ -f "$RELEASE_APK" ]]; then
    SRC="$RELEASE_APK"
  else
    SRC="$DEBUG_APK"
  fi
fi

if [[ ! -f "$SRC" ]]; then
  echo "APK not found: $SRC" >&2
  echo "Build first: cd app && ./gradlew :app:assembleRelease (or :app:assembleDebug)" >&2
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
# Also synchronize to website public mirror
mkdir -p "$ROOT/frontend/public"
cp "$SRC" "$ROOT/frontend/public/aiimin-v2-debug.apk"
# Prune anything else in dist (dated copies, old names)
find "$DIST" -maxdepth 1 -type f \( -name '*.apk' -o -name '*.aab' \) \
  ! -name 'aiimin-v3-current.apk' \
  ! -name 'aiimin-v3-previous.apk' \
  -print -delete

SIZE=$(wc -c < "$CURRENT" | tr -d ' ')
echo "Promoted current ($SIZE bytes) from $SRC"
ls -lh "$DIST"/*.apk "$ROOT/frontend/public/aiimin-v2-debug.apk" 2>/dev/null || true
