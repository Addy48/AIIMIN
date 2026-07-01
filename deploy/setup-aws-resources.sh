#!/usr/bin/env bash
# One-time AWS resource setup for AIIMIN (~$0.25/mo S3 + free budgets)
set -euo pipefail
REGION=ap-south-1
ACCOUNT=808850080350
BUCKET=aiimin-family-vault-${ACCOUNT}

# S3 family vault (private)
if ! aws s3api head-bucket --bucket "$BUCKET" 2>/dev/null; then
  aws s3api create-bucket --bucket "$BUCKET" --region "$REGION" \
    --create-bucket-configuration LocationConstraint="$REGION"
  aws s3api put-public-access-block --bucket "$BUCKET" \
    --public-access-block-configuration BlockPublicAcls=true,IgnorePublicAcls=true,BlockPublicPolicy=true,RestrictPublicBuckets=true
  echo "Created S3 bucket: $BUCKET"
else
  echo "S3 bucket exists: $BUCKET"
fi

# S3 uploads bucket (replaces Supabase Storage dashboard-uploads)
UPLOADS_BUCKET="aiimin-uploads-${ACCOUNT}"
if ! aws s3api head-bucket --bucket "$UPLOADS_BUCKET" 2>/dev/null; then
  aws s3api create-bucket --bucket "$UPLOADS_BUCKET" --region "$REGION" \
    --create-bucket-configuration LocationConstraint="$REGION"
  aws s3api put-public-access-block --bucket "$UPLOADS_BUCKET" \
    --public-access-block-configuration BlockPublicAcls=true,IgnorePublicAcls=true,BlockPublicPolicy=true,RestrictPublicBuckets=true
  echo "Created S3 uploads bucket: $UPLOADS_BUCKET"
else
  echo "S3 uploads bucket exists: $UPLOADS_BUCKET"
fi

aws budgets create-budget --account-id "$ACCOUNT" --budget '{
  "BudgetName": "aiimin-monthly-10",
  "BudgetLimit": {"Amount": "10", "Unit": "USD"},
  "TimeUnit": "MONTHLY",
  "BudgetType": "COST"
}' --notifications-with-subscribers '[{
  "Notification": {
    "NotificationType": "ACTUAL",
    "ComparisonOperator": "GREATER_THAN",
    "Threshold": 80,
    "ThresholdType": "PERCENTAGE"
  },
  "Subscribers": [{"SubscriptionType": "EMAIL", "Address": "aadityaupadhyay10@gmail.com"}]
}]' 2>/dev/null || echo "Budget may already exist"

echo "Done. Set S3_FAMILY_VAULT_BUCKET=$BUCKET and S3_UPLOADS_BUCKET=$UPLOADS_BUCKET on EC2"

# Credits buffer alert — notify when monthly forecast exceeds $8 (80% of $10 budget)
aws budgets create-budget --account-id "$ACCOUNT" --budget '{
  "BudgetName": "aiimin-credits-buffer",
  "BudgetLimit": {"Amount": "8", "Unit": "USD"},
  "TimeUnit": "MONTHLY",
  "BudgetType": "COST"
}' --notifications-with-subscribers '[{
  "Notification": {
    "NotificationType": "FORECASTED",
    "ComparisonOperator": "GREATER_THAN",
    "Threshold": 100,
    "ThresholdType": "PERCENTAGE"
  },
  "Subscribers": [{"SubscriptionType": "EMAIL", "Address": "aadityaupadhyay10@gmail.com"}]
}]' 2>/dev/null || echo "Credits buffer budget may already exist"
