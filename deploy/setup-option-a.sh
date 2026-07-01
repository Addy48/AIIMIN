#!/usr/bin/env bash
# AIIMIN Option A — full fresh AWS backend setup (no NAT Gateway)
set -euo pipefail

export AWS_REGION="${AWS_REGION:-ap-south-1}"
export OWNER_EMAIL="${OWNER_EMAIL:-aadityaupadhyay10@gmail.com}"

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo "╔══════════════════════════════════════════╗"
echo "║  AIIMIN AWS Option A — Fresh Setup       ║"
echo "║  Region: $AWS_REGION                      ║"
echo "╚══════════════════════════════════════════╝"

bash "$SCRIPT_DIR/setup-aws-resources.sh"
bash "$SCRIPT_DIR/setup-ec2.sh"
bash "$SCRIPT_DIR/setup-rds.sh"
bash "$SCRIPT_DIR/setup-cognito.sh"
bash "$SCRIPT_DIR/setup-billing-alerts.sh"
bash "$SCRIPT_DIR/cloudwatch-alarms.sh" || true

echo ""
echo "╔══════════════════════════════════════════╗"
echo "║  Setup complete — YOUR manual steps:       ║"
echo "╚══════════════════════════════════════════╝"
echo "1. GoDaddy: point api.aiimin.in → Elastic IP from setup-ec2.sh"
echo "2. SSH + bootstrap: bash deploy/rsync-to-ec2.sh <EIP>"
echo "3. Copy deploy/.env.production.example → EC2 .env and fill secrets"
echo "4. pg_restore Supabase backup to RDS (see docs/AWS_MIGRATION_MASTER_PLAN.md)"
echo "5. Vercel: REACT_APP_WAITLIST_MODE=true + Cognito vars"
echo "6. Confirm SNS + Budget emails in inbox"
