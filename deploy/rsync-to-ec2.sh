#!/usr/bin/env bash
# Sync AIIMIN repo to EC2 (use after setup-ec2.sh)
set -euo pipefail

EIP="${1:-13.207.146.15}"
KEY="${2:-aiimin.pem}"
REMOTE_DIR="/home/ubuntu/AIIMIN"

rsync -avz --delete \
  --exclude node_modules \
  --exclude frontend/node_modules \
  --exclude frontend/build \
  --exclude .git \
  --exclude .env \
  --exclude '*.pem' \
  -e "ssh -o StrictHostKeyChecking=accept-new -i \"${KEY}\"" \
  ./ "ubuntu@${EIP}:${REMOTE_DIR}/"

echo "Synced to ubuntu@${EIP}:${REMOTE_DIR}"
echo "Next: ssh -i \"${KEY}\" ubuntu@${EIP} 'cd AIIMIN && npm install --omit=dev --ignore-scripts && pm2 reload deploy/ecosystem.config.cjs --update-env'"
