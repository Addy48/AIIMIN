#!/usr/bin/env bash
# Launch AIIMIN locally — always fresh dev servers with hot reload.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

echo "▸ AIIMIN local launch"
echo "  Project: $ROOT"

# Stop stale servers so you always get the latest code.
if lsof -ti:3000,3001 >/dev/null 2>&1; then
  echo "▸ Stopping old servers on ports 3000 / 3001..."
  lsof -ti:3000,3001 | xargs kill -9 2>/dev/null || true
  sleep 1
fi

if [[ ! -d node_modules ]]; then
  echo "▸ Installing root dependencies..."
  npm install
fi

if [[ ! -d frontend/node_modules ]]; then
  echo "▸ Installing frontend dependencies..."
  (cd frontend && npm install)
fi

# Open browser once the React dev server responds.
(
  for _ in {1..60}; do
    if curl -fsS "http://localhost:3000" >/dev/null 2>&1; then
      open "http://localhost:3000"
      echo "▸ Opened http://localhost:3000"
      exit 0
    fi
    sleep 1
  done
  echo "▸ Timed out waiting for frontend — open http://localhost:3000 manually"
) &

echo "▸ Starting API (3001) + frontend (3000) with hot reload..."
echo "  Press Ctrl+C to stop."
npm run dev
