#!/usr/bin/env bash
# Build debug APK that loads your Mac dev server (for phone testing before deploy).
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

LAN_IP="${CAP_DEV_HOST:-$(ipconfig getifaddr en0 2>/dev/null || ipconfig getifaddr en1 2>/dev/null || echo "127.0.0.1")}"
DEV_PORT="${CAP_DEV_PORT:-3000}"
DEV_URL="http://${LAN_IP}:${DEV_PORT}/m"

echo "Dev WebView URL: $DEV_URL"
echo "Start frontend first: HOST=0.0.0.0 npm start"
echo ""

node -e "
const fs = require('fs');
const base = JSON.parse(fs.readFileSync('capacitor.config.json', 'utf8'));
const dev = {
  ...base,
  server: {
    url: process.env.DEV_URL || '$DEV_URL',
    cleartext: true,
    androidScheme: 'http',
  },
};
fs.writeFileSync('capacitor.config.json', JSON.stringify(dev, null, 2) + '\n');
console.log('Patched capacitor.config.json for dev');
"

export DEV_URL
bash scripts/cap-android-build.sh

echo ""
echo "Install on phone (USB debugging on):"
echo "  ~/Library/Android/sdk/platform-tools/adb install -r android/app/build/outputs/apk/debug/app-debug.apk"
echo ""
echo "Restore production config after test:"
echo "  git checkout -- capacitor.config.json && npx cap sync android"
echo ""
echo "Note: debug APK allows cleartext via android/app/src/debug/res/xml/network_security_config.xml"
echo "Production APK loads https://www.aiimin.in/m (no cleartext)."
