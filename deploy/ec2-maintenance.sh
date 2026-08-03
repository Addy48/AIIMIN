#!/usr/bin/env bash
#
# ec2-maintenance.sh — keep the API box healthy without anyone watching it.
#
# Runs daily from aiimin-maintenance.timer. Two jobs, in this order:
#   1. Reclaim disk that grows back on its own (apt cache, npm cache, journald,
#      old kernels, pm2 logs). All of it is regenerable — never app data.
#   2. Check what it could not fix, and email the founder if the box still needs
#      a human. Silent when healthy, so an email always means something.
#
# Context: on 2026-08-03 the 8 GB root disk hit 100% (0 bytes free) with nobody
# alerted. The API survived, but the deploy would have failed. This exists so
# that cannot happen quietly again.
#
# Install: deploy/install-maintenance.sh
# Manual:  sudo /usr/local/bin/ec2-maintenance.sh --dry-run

set -uo pipefail

DISK_WARN_PCT="${DISK_WARN_PCT:-80}"
ENV_FILE="${ENV_FILE:-/home/ubuntu/AIIMIN/.env}"
HEALTH_URL="${HEALTH_URL:-http://127.0.0.1:3001/api/health}"
LOG="/var/log/aiimin-maintenance.log"
DRY_RUN=0
[ "${1:-}" = "--dry-run" ] && DRY_RUN=1

log() { echo "[$(date -u +%Y-%m-%dT%H:%M:%SZ)] $*" | tee -a "$LOG"; }
run() { if [ "$DRY_RUN" = 1 ]; then log "DRY: $*"; else eval "$@" >/dev/null 2>&1; fi; }

disk_pct() { df --output=pcent / | tail -1 | tr -dc '0-9'; }

# Read one key out of the app .env without sourcing it (it is not shell-safe).
env_get() { sed -n "s/^$1=//p" "$ENV_FILE" 2>/dev/null | head -1 | sed 's/^"//; s/"$//' ; }

BEFORE="$(disk_pct)"
log "start — disk ${BEFORE}%"

# ── 1. reclaim ───────────────────────────────────────────────────────────────
run "apt-get clean"
run "journalctl --vacuum-size=64M"
run "apt-get -y autoremove --purge"
run "su - ubuntu -c 'npm cache clean --force'"
# pm2 keeps writing to the same two files forever unless flushed.
run "su - ubuntu -c 'pm2 flush'"
# Anything left in /tmp older than a week is not in use.
run "find /tmp -type f -mtime +7 -delete"

AFTER="$(disk_pct)"
log "reclaimed — disk ${BEFORE}% -> ${AFTER}%"

# Keep our own log from becoming the thing that fills the disk.
if [ -f "$LOG" ] && [ "$(stat -c %s "$LOG" 2>/dev/null || echo 0)" -gt 1048576 ]; then
  tail -n 500 "$LOG" > "${LOG}.tmp" && mv "${LOG}.tmp" "$LOG"
fi

# ── 2. report only what a human must act on ──────────────────────────────────
PROBLEMS=""
[ "$AFTER" -ge "$DISK_WARN_PCT" ] && \
  PROBLEMS="${PROBLEMS}- Root disk is ${AFTER}% full after automatic cleanup. Cleanup can no longer keep up; the volume needs to grow or something large needs removing.\n"

if ! curl -fsS --max-time 10 "$HEALTH_URL" >/dev/null 2>&1; then
  PROBLEMS="${PROBLEMS}- API health check failed at ${HEALTH_URL}. The API may be down.\n"
fi

RESTARTS="$(su - ubuntu -c 'pm2 jlist' 2>/dev/null | tr ',' '\n' | sed -n 's/.*"restart_time":\([0-9]*\).*/\1/p' | head -1)"
if [ -n "${RESTARTS:-}" ] && [ "$RESTARTS" -gt 200 ] 2>/dev/null; then
  PROBLEMS="${PROBLEMS}- pm2 has restarted aiimin-api ${RESTARTS} times. Something is crashing it repeatedly.\n"
fi

if [ -z "$PROBLEMS" ]; then
  log "healthy — disk ${AFTER}%, API ok. No alert sent."
  exit 0
fi

log "PROBLEMS FOUND:"; printf "%b" "$PROBLEMS" | tee -a "$LOG"

KEY="$(env_get RESEND_API_KEY)"
TO="$(env_get OWNER_NOTIFY_EMAIL)"
FROM="$(env_get RESEND_FROM_EMAIL)"
if [ -z "$KEY" ] || [ -z "$TO" ] || [ -z "$FROM" ]; then
  log "cannot alert — RESEND_API_KEY / OWNER_NOTIFY_EMAIL / RESEND_FROM_EMAIL missing from $ENV_FILE"
  exit 1
fi

BODY="$(printf "The AIIMIN API box needs attention.\n\n%b\nDisk: %s%% used (was %s%% before cleanup)\nHost: %s\nTime: %s UTC\n\nAutomatic cleanup already ran and could not resolve this.\n\n  ssh -i aiimin.pem ubuntu@13.207.146.15\n  df -h / ; pm2 logs aiimin-api --lines 100\n" \
  "$PROBLEMS" "$AFTER" "$BEFORE" "$(hostname)" "$(date -u +%Y-%m-%dT%H:%M:%SZ)")"

if [ "$DRY_RUN" = 1 ]; then
  log "DRY: would email $TO"; printf "%s\n" "$BODY"; exit 0
fi

PAYLOAD="$(TO="$TO" FROM="$FROM" BODY="$BODY" AFTER="$AFTER" python3 - <<'PY'
import json, os
print(json.dumps({
    "from": os.environ["FROM"],
    "to": [os.environ["TO"]],
    "subject": f"[AIIMIN] API box needs attention — disk {os.environ['AFTER']}%",
    "text": os.environ["BODY"],
}))
PY
)"

CODE="$(curl -s -o /tmp/aiimin-alert.out -w '%{http_code}' -X POST https://api.resend.com/emails \
  -H "Authorization: Bearer ${KEY}" -H "Content-Type: application/json" -d "$PAYLOAD")"
log "alert email -> ${TO} (HTTP ${CODE})"
[ "$CODE" = "200" ] || { log "alert body: $(cat /tmp/aiimin-alert.out)"; exit 1; }
