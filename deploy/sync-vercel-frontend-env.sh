#!/usr/bin/env bash
# Sync critical REACT_APP_* vars on Vercel (fixes empty dashboard placeholders).
set -euo pipefail
cd "$(dirname "$0")/.."

echo "https://api.aiimin.in/api" | npx vercel env add REACT_APP_API_URL production --force --yes 2>/dev/null || true
echo "true" | npx vercel env add REACT_APP_WAITLIST_MODE production --force --yes 2>/dev/null || true
echo "Done. Re-pull: npx vercel pull --yes --environment=production"
