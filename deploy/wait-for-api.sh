#!/usr/bin/env bash
# Wait until the API responds on localhost (PM2 needs a few seconds on t4g.nano).
wait_for_api() {
  local url="${1:-http://localhost:3001/api/health}"
  local attempts="${2:-30}"
  local delay="${3:-2}"
  local i=1

  while [[ "$i" -le "$attempts" ]]; do
    if response="$(curl -fsS "$url" 2>/dev/null)"; then
      echo "$response"
      return 0
    fi
    echo "    waiting for API (${i}/${attempts})…"
    sleep "$delay"
    i=$((i + 1))
  done

  echo "ERROR: API not healthy after $((attempts * delay))s" >&2
  pm2 status || true
  pm2 logs aiimin-api --lines 40 --nostream 2>/dev/null || true
  return 1
}
