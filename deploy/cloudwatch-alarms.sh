#!/usr/bin/env bash
# CloudWatch alarms for AIIMIN EC2 (run once after instance is up)
set -euo pipefail

INSTANCE_ID="${1:?Usage: cloudwatch-alarms.sh <instance-id>}"
REGION=ap-south-1
SNS_EMAIL="${2:-aadityaupadhyay10@gmail.com}"

SNS_ARN=$(aws sns create-topic --region "$REGION" --name aiimin-alerts --query TopicArn --output text 2>/dev/null || \
  aws sns list-topics --region "$REGION" --query "Topics[?contains(TopicArn,'aiimin-alerts')].TopicArn" --output text)

aws sns subscribe --region "$REGION" --topic-arn "$SNS_ARN" \
  --protocol email --notification-endpoint "$SNS_EMAIL" 2>/dev/null || true

aws cloudwatch put-metric-alarm --region "$REGION" \
  --alarm-name "aiimin-ec2-cpu-high" \
  --alarm-description "AIIMIN API CPU > 80% for 10 min" \
  --metric-name CPUUtilization --namespace AWS/EC2 \
  --statistic Average --period 300 --evaluation-periods 2 \
  --threshold 80 --comparison-operator GreaterThanThreshold \
  --dimensions "Name=InstanceId,Value=$INSTANCE_ID" \
  --alarm-actions "$SNS_ARN"

aws cloudwatch put-metric-alarm --region "$REGION" \
  --alarm-name "aiimin-ec2-status-check" \
  --alarm-description "AIIMIN EC2 status check failed" \
  --metric-name StatusCheckFailed --namespace AWS/EC2 \
  --statistic Maximum --period 60 --evaluation-periods 2 \
  --threshold 1 --comparison-operator GreaterThanOrEqualToThreshold \
  --dimensions "Name=InstanceId,Value=$INSTANCE_ID" \
  --alarm-actions "$SNS_ARN"

echo "CloudWatch alarms created for $INSTANCE_ID (confirm SNS email subscription)"
