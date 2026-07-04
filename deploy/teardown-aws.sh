#!/usr/bin/env bash
# Tear down AIIMIN AWS resources for clean-slate rebuild.
# WARNING: api.aiimin.in will go offline until setup-option-a.sh completes.
set -euo pipefail

REGION="${AWS_REGION:-ap-south-1}"
INSTANCE_TAG="${INSTANCE_TAG:-aiimin-api}"

echo "=== AIIMIN AWS Teardown (region: $REGION) ==="
echo "This will terminate EC2, release Elastic IPs, and remove alarms."
read -p "Type 'yes-teardown' to continue: " confirm
[[ "$confirm" == "yes-teardown" ]] || { echo "Aborted."; exit 1; }

# EC2 instances tagged aiimin-api
INSTANCE_IDS=$(aws ec2 describe-instances --region "$REGION" \
  --filters "Name=tag:Name,Values=$INSTANCE_TAG" "Name=instance-state-name,Values=running,stopped,stopping,pending" \
  --query 'Reservations[].Instances[].InstanceId' --output text 2>/dev/null || true)

if [[ -n "$INSTANCE_IDS" && "$INSTANCE_IDS" != "None" ]]; then
  echo "Terminating instances: $INSTANCE_IDS"
  aws ec2 terminate-instances --region "$REGION" --instance-ids $INSTANCE_IDS
  aws ec2 wait instance-terminated --region "$REGION" --instance-ids $INSTANCE_IDS || true
fi

# Release unassociated Elastic IPs tagged or named aiimin
EIPS=$(aws ec2 describe-addresses --region "$REGION" \
  --query 'Addresses[?Tags[?Key==`Name` && Value==`aiimin-eip`]].AllocationId' --output text 2>/dev/null || true)
for eip in $EIPS; do
  [[ -z "$eip" || "$eip" == "None" ]] && continue
  echo "Releasing EIP: $eip"
  aws ec2 release-address --region "$REGION" --allocation-id "$eip" 2>/dev/null || true
done

# CloudWatch alarms
for alarm in aiimin-ec2-cpu-high aiimin-ec2-status-check aiimin-rds-storage-high; do
  aws cloudwatch delete-alarms --region "$REGION" --alarm-names "$alarm" 2>/dev/null || true
done

# SNS topic (optional — comment out if shared)
# aws sns delete-topic --region "$REGION" --topic-arn "arn:aws:sns:$REGION:$(aws sts get-caller-identity --query Account --output text):aiimin-alerts" 2>/dev/null || true

echo ""
echo "Teardown complete. S3 buckets and RDS are NOT deleted by default."
echo "To delete RDS: aws rds delete-db-instance --db-instance-identifier aiimin-db --skip-final-snapshot --region $REGION"
echo "Next: bash deploy/setup-option-a.sh"
