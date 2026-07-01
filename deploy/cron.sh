#!/usr/bin/env bash
# EC2 crontab entries for AIIMIN API
# Install: crontab -e and paste:
# 0 0 * * * curl -sf https://api.aiimin.in/api/keepalive >/dev/null
# 30 3 * * * curl -sf -H "Authorization: Bearer $CRON_SECRET" https://api.aiimin.in/api/cron/re-engagement >/dev/null
# 0 */2 * * * curl -sf -H "Authorization: Bearer $CRON_SECRET" -X POST https://api.aiimin.in/api/sports/refresh/system >/dev/null

CRON_SECRET="${CRON_SECRET:?Set CRON_SECRET}"
API="${API_URL:-https://api.aiimin.in}"

curl -sf "${API}/api/keepalive" || exit 1
curl -sf -H "Authorization: Bearer ${CRON_SECRET}" "${API}/api/cron/re-engagement" || exit 1
curl -sf -X POST -H "Authorization: Bearer ${CRON_SECRET}" "${API}/api/sports/refresh/system" || exit 1
