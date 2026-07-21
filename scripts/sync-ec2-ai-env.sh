#!/usr/bin/env bash
# Sync gitignored AI / env keys to EC2 WITHOUT committing secrets to GitHub.
# Usage (from repo root, with SSH access):
#   bash scripts/sync-ec2-ai-env.sh
#
# Requires: deploy/EC2.env.paste (gitignored) OR root .env with keys.
# Host defaults match deploy workflow; override with EC2_HOST / EC2_USER.

set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
HOST="${EC2_HOST:-}"
USER="${EC2_USER:-ubuntu}"
KEY="${EC2_SSH_KEY_PATH:-$HOME/.ssh/aiimin-ec2.pem}"
REMOTE_ENV="\$HOME/AIIMIN/.env"
SRC=""

if [[ -f "$ROOT/deploy/EC2.env.paste" ]]; then
  SRC="$ROOT/deploy/EC2.env.paste"
elif [[ -f "$ROOT/.env" ]]; then
  SRC="$ROOT/.env"
else
  echo "No deploy/EC2.env.paste or .env found"
  exit 1
fi

if [[ -z "$HOST" ]]; then
  echo "Set EC2_HOST (e.g. export EC2_HOST=ec2-xx-xx-xx-xx.compute.amazonaws.com)"
  exit 1
fi

TMP="$(mktemp)"
# Extract only AI-related lines to merge into remote .env
grep -E '^(GEMINI_|GROQ_|NVIDIA_|KIMI_|XAI_|MOONSHOT_|GEMINI_LITE)' "$SRC" > "$TMP" || true

if [[ ! -s "$TMP" ]]; then
  echo "No AI key lines found in $SRC"
  rm -f "$TMP"
  exit 1
fi

echo "==> Merging AI keys from $SRC → ${USER}@${HOST}:${REMOTE_ENV}"
# shellcheck disable=SC2029
ssh -i "$KEY" -o StrictHostKeyChecking=accept-new "${USER}@${HOST}" bash -s <<EOF
set -euo pipefail
ENV_FILE="\$HOME/AIIMIN/.env"
mkdir -p "\$HOME/AIIMIN"
touch "\$ENV_FILE"
while IFS= read -r line; do
  [[ -z "\$line" || "\$line" =~ ^# ]] && continue
  key="\${line%%=*}"
  # strip existing key
  grep -v "^\\\${key}=" "\$ENV_FILE" > "\$ENV_FILE.tmp" || true
  mv "\$ENV_FILE.tmp" "\$ENV_FILE"
  echo "\$line" >> "\$ENV_FILE"
done <<'KEYS'
$(cat "$TMP")
KEYS
pm2 reload deploy/ecosystem.config.cjs --update-env || pm2 restart all
echo "==> AI env merged + pm2 reloaded"
EOF

rm -f "$TMP"
echo "Done. Keys never touched GitHub."
