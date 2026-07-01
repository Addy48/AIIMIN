#!/usr/bin/env bash
# Cognito User Pool for AIIMIN (replaces Clerk)
set -euo pipefail

REGION="${AWS_REGION:-ap-south-1}"
POOL_NAME="${POOL_NAME:-aiimin-users}"
CLIENT_NAME="${CLIENT_NAME:-aiimin-web}"
DOMAIN_PREFIX="${DOMAIN_PREFIX:-aiimin-auth}"
CALLBACK_URLS="${CALLBACK_URLS:-https://aiimin.in,https://www.aiimin.in,http://localhost:3000}"

echo "=== Cognito Setup ($REGION) ==="

# Create User Pool
POOL_ID=$(aws cognito-idp list-user-pools --region "$REGION" --max-results 60 \
  --query "UserPools[?Name=='$POOL_NAME'].Id | [0]" --output text 2>/dev/null || echo "None")

if [[ "$POOL_ID" == "None" || -z "$POOL_ID" ]]; then
  POOL_ID=$(aws cognito-idp create-user-pool --region "$REGION" \
    --pool-name "$POOL_NAME" \
    --auto-verified-attributes email \
    --username-attributes email \
    --policies "PasswordPolicy={MinimumLength=8,RequireUppercase=true,RequireLowercase=true,RequireNumbers=true,RequireSymbols=false}" \
    --account-recovery-setting "RecoveryMechanisms=[{Priority=1,Name=verified_email}]" \
    --query 'UserPool.Id' --output text)
  echo "Created User Pool: $POOL_ID"
else
  echo "Using existing User Pool: $POOL_ID"
fi

# App client (SPA — no secret)
CLIENT_ID=$(aws cognito-idp list-user-pool-clients --region "$REGION" --user-pool-id "$POOL_ID" \
  --query "UserPoolClients[?ClientName=='$CLIENT_NAME'].ClientId | [0]" --output text 2>/dev/null || echo "None")

IFS=',' read -ra CB_ARR <<< "$CALLBACK_URLS"
CB_JSON=$(printf '"%s",' "${CB_ARR[@]}" | sed 's/,$//')

if [[ "$CLIENT_ID" == "None" || -z "$CLIENT_ID" ]]; then
  CLIENT_ID=$(aws cognito-idp create-user-pool-client --region "$REGION" \
    --user-pool-id "$POOL_ID" \
    --client-name "$CLIENT_NAME" \
    --no-generate-secret \
    --explicit-auth-flows ALLOW_USER_SRP_AUTH ALLOW_REFRESH_TOKEN_AUTH ALLOW_USER_PASSWORD_AUTH \
    --supported-identity-providers COGNITO \
    --callback-urls ${CB_ARR[@]} \
    --logout-urls ${CB_ARR[@]} \
    --allowed-oauth-flows code \
    --allowed-oauth-scopes email openid profile \
    --allowed-oauth-flows-user-pool-client \
    --query 'UserPoolClient.ClientId' --output text)
  echo "Created App Client: $CLIENT_ID"
else
  echo "Using existing App Client: $CLIENT_ID"
fi

# Hosted UI domain
aws cognito-idp create-user-pool-domain --region "$REGION" \
  --domain "$DOMAIN_PREFIX" --user-pool-id "$POOL_ID" 2>/dev/null || echo "Domain may exist"

HOSTED_DOMAIN="https://${DOMAIN_PREFIX}.auth.${REGION}.amazoncognito.com"

echo ""
echo "=== Cognito Ready ==="
echo "COGNITO_USER_POOL_ID=$POOL_ID"
echo "COGNITO_CLIENT_ID=$CLIENT_ID"
echo "COGNITO_HOSTED_DOMAIN=$HOSTED_DOMAIN"
echo ""
echo "Vercel env:"
echo "  REACT_APP_COGNITO_USER_POOL_ID=$POOL_ID"
echo "  REACT_APP_COGNITO_CLIENT_ID=$CLIENT_ID"
echo "  REACT_APP_COGNITO_DOMAIN=$HOSTED_DOMAIN"
echo ""
echo "Manual: Add Google IdP in Cognito console → Federation → Google"
echo "  Authorized redirect: https://${DOMAIN_PREFIX}.auth.${REGION}.amazoncognito.com/oauth2/idpresponse"
