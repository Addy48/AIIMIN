#!/usr/bin/env bash
# Billing alerts — $10/mo cap, weekly cost digest, SNS to owner email
set -euo pipefail

REGION="${AWS_REGION:-ap-south-1}"
ACCOUNT=$(aws sts get-caller-identity --query Account --output text)
OWNER_EMAIL="${OWNER_EMAIL:-aadityaupadhyay10@gmail.com}"
MONTHLY_BUDGET="${MONTHLY_BUDGET:-10}"

echo "=== Billing Alerts → $OWNER_EMAIL ==="

# SNS topic
TOPIC_ARN=$(aws sns create-topic --region "$REGION" --name aiimin-alerts --query TopicArn --output text 2>/dev/null || \
  aws sns list-topics --region "$REGION" --query "Topics[?contains(TopicArn,'aiimin-alerts')].TopicArn | [0]" --output text)

aws sns subscribe --region "$REGION" --topic-arn "$TOPIC_ARN" \
  --protocol email --notification-endpoint "$OWNER_EMAIL" 2>/dev/null || true
echo "SNS topic: $TOPIC_ARN (confirm subscription email if new)"

# Monthly budget $10 — actual at 80% and 100%
aws budgets create-budget --account-id "$ACCOUNT" --budget "{
  \"BudgetName\": \"aiimin-monthly-${MONTHLY_BUDGET}\",
  \"BudgetLimit\": {\"Amount\": \"${MONTHLY_BUDGET}\", \"Unit\": \"USD\"},
  \"TimeUnit\": \"MONTHLY\",
  \"BudgetType\": \"COST\"
}" --notifications-with-subscribers "[{
  \"Notification\": {
    \"NotificationType\": \"ACTUAL\",
    \"ComparisonOperator\": \"GREATER_THAN\",
    \"Threshold\": 80,
    \"ThresholdType\": \"PERCENTAGE\"
  },
  \"Subscribers\": [{\"SubscriptionType\": \"EMAIL\", \"Address\": \"${OWNER_EMAIL}\"}]
},{
  \"Notification\": {
    \"NotificationType\": \"ACTUAL\",
    \"ComparisonOperator\": \"GREATER_THAN\",
    \"Threshold\": 100,
    \"ThresholdType\": \"PERCENTAGE\"
  },
  \"Subscribers\": [{\"SubscriptionType\": \"EMAIL\", \"Address\": \"${OWNER_EMAIL}\"}]
}]" 2>/dev/null || echo "Monthly budget may exist"

# Forecast alert at $8
aws budgets create-budget --account-id "$ACCOUNT" --budget "{
  \"BudgetName\": \"aiimin-forecast-8\",
  \"BudgetLimit\": {\"Amount\": \"8\", \"Unit\": \"USD\"},
  \"TimeUnit\": \"MONTHLY\",
  \"BudgetType\": \"COST\"
}" --notifications-with-subscribers "[{
  \"Notification\": {
    \"NotificationType\": \"FORECASTED\",
    \"ComparisonOperator\": \"GREATER_THAN\",
    \"Threshold\": 100,
    \"ThresholdType\": \"PERCENTAGE\"
  },
  \"Subscribers\": [{\"SubscriptionType\": \"EMAIL\", \"Address\": \"${OWNER_EMAIL}\"}]
}]" 2>/dev/null || echo "Forecast budget may exist"

# Credits tracking — alert when month-to-date > $5 (mid-month check)
aws budgets create-budget --account-id "$ACCOUNT" --budget "{
  \"BudgetName\": \"aiimin-midmonth-5\",
  \"BudgetLimit\": {\"Amount\": \"5\", \"Unit\": \"USD\"},
  \"TimeUnit\": \"MONTHLY\",
  \"BudgetType\": \"COST\"
}" --notifications-with-subscribers "[{
  \"Notification\": {
    \"NotificationType\": \"ACTUAL\",
    \"ComparisonOperator\": \"GREATER_THAN\",
    \"Threshold\": 100,
    \"ThresholdType\": \"PERCENTAGE\"
  },
  \"Subscribers\": [{\"SubscriptionType\": \"EMAIL\", \"Address\": \"${OWNER_EMAIL}\"}]
}]" 2>/dev/null || echo "Mid-month budget may exist"

# Billing alarm via CloudWatch (estimated charges — us-east-1 only for billing metrics)
# Note: AWS billing metrics are only in us-east-1
aws cloudwatch put-metric-alarm --region us-east-1 \
  --alarm-name aiimin-estimated-charges-10 \
  --alarm-description "AIIMIN estimated charges exceed \$9" \
  --metric-name EstimatedCharges \
  --namespace AWS/Billing \
  --statistic Maximum \
  --period 21600 \
  --evaluation-periods 1 \
  --threshold 9 \
  --comparison-operator GreaterThanThreshold \
  --dimensions Name=Currency,Value=USD \
  --alarm-actions "$TOPIC_ARN" 2>/dev/null || echo "Billing alarm (enable billing alerts in Billing Preferences first)"

echo ""
echo "=== Alerts configured ==="
echo "- Monthly budget: \$${MONTHLY_BUDGET} (80% + 100% email)"
echo "- Forecast: \$8"
echo "- Mid-month: \$5 actual"
echo "- SNS: $TOPIC_ARN"
echo ""
echo "Enable in AWS Console → Billing → Billing preferences → Receive Billing Alerts"
echo "Cost Explorer → create weekly report subscription to $OWNER_EMAIL (manual, one-time)"
