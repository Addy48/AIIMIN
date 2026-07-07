#!/usr/bin/env bash
# GitHub Actions + manual EC2 deploy — idempotent, preserves .env
set -euo pipefail

APP_DIR="${APP_DIR:-$HOME/AIIMIN}"
REPO_URL="${REPO_URL:-https://github.com/Addy48/AIIMIN.git}"
BRANCH="${BRANCH:-main}"
ENV_BACKUP="$HOME/aiimin-env-backup"

export NODE_OPTIONS="${NODE_OPTIONS:---dns-result-order=ipv4first --max-old-space-size=384}"

echo "==> AIIMIN EC2 deploy (branch: $BRANCH)"

if [[ -f "$APP_DIR/.env" ]]; then
  cp "$APP_DIR/.env" "$ENV_BACKUP"
  echo "    backed up .env"
fi

if [[ ! -d "$APP_DIR/.git" ]]; then
  echo "    no git repo at $APP_DIR — cloning fresh"
  if [[ -d "$APP_DIR" ]]; then
    mv "$APP_DIR" "${APP_DIR}-rsync-backup-$(date +%s)"
  fi
  git clone --depth 1 --branch "$BRANCH" "$REPO_URL" "$APP_DIR"
else
  echo "    git repo found"
fi

if [[ -f "$ENV_BACKUP" ]]; then
  cp "$ENV_BACKUP" "$APP_DIR/.env"
  echo "    restored .env"
fi

cd "$APP_DIR"

git fetch origin "$BRANCH"
git reset --hard "origin/$BRANCH"
echo "    at $(git rev-parse --short HEAD)"

LOCK_CHANGED=0
if git diff --name-only HEAD@{1} HEAD 2>/dev/null | grep -qE '^package(-lock)?\.json$'; then
  LOCK_CHANGED=1
fi

if [[ ! -d node_modules ]] || [[ "$LOCK_CHANGED" -eq 1 ]]; then
  echo "    npm install (omit dev)…"
  npm install --omit=dev --ignore-scripts --no-audit --no-fund
else
  echo "    skipping npm install — lockfile unchanged"
fi

if pm2 describe aiimin-api >/dev/null 2>&1; then
  pm2 reload deploy/ecosystem.config.cjs --update-env
else
  pm2 start deploy/ecosystem.config.cjs
fi
pm2 save

echo "==> health check"
curl -fsS http://localhost:3001/api/health
echo ""
echo "==> deploy OK ($(git rev-parse --short HEAD))"
