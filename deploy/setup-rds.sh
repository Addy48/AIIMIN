#!/usr/bin/env bash
# RDS PostgreSQL 16 for AIIMIN — private subnet, no NAT, EC2-only access
set -euo pipefail

REGION="${AWS_REGION:-ap-south-1}"
DB_ID="${DB_ID:-aiimin-db}"
DB_NAME="${DB_NAME:-aiimin}"
DB_USER="${DB_USER:-aiimin_admin}"
DB_CLASS="${DB_CLASS:-db.t4g.micro}"
ALLOCATED_STORAGE="${ALLOCATED_STORAGE:-20}"
EC2_SG_NAME="${EC2_SG_NAME:-aiimin-api-sg}"

ACCOUNT=$(aws sts get-caller-identity --query Account --output text)
echo "Account: $ACCOUNT | Region: $REGION"

# DB password — generate if not set
if [[ -z "${DB_MASTER_PASSWORD:-}" ]]; then
  DB_MASTER_PASSWORD=$(openssl rand -base64 24 | tr -d '/+=' | head -c 24)
  echo "Generated DB_MASTER_PASSWORD (save this): $DB_MASTER_PASSWORD"
fi

# VPC — use tagged aiimin-vpc or default
VPC_ID=$(aws ec2 describe-vpcs --region "$REGION" \
  --filters "Name=tag:Name,Values=aiimin-vpc" \
  --query 'Vpcs[0].VpcId' --output text 2>/dev/null || echo "None")
if [[ "$VPC_ID" == "None" || -z "$VPC_ID" ]]; then
  VPC_ID=$(aws ec2 describe-vpcs --region "$REGION" --filters "Name=isDefault,Values=true" \
    --query 'Vpcs[0].VpcId' --output text)
  echo "Using default VPC: $VPC_ID"
else
  echo "Using VPC: $VPC_ID"
fi

# Subnets (need 2 AZs for RDS subnet group)
SUBNET_IDS=$(aws ec2 describe-subnets --region "$REGION" \
  --filters "Name=vpc-id,Values=$VPC_ID" \
  --query 'Subnets[*].SubnetId' --output text | tr '\t' ' ')
SUBNET_ARR=($SUBNET_IDS)

if [[ ${#SUBNET_ARR[@]} -lt 2 ]]; then
  echo "Only ${#SUBNET_ARR[@]} subnet(s) — creating second subnet in another AZ..."
  AZ1=$(aws ec2 describe-subnets --region "$REGION" --subnet-ids "${SUBNET_ARR[0]}" \
    --query 'Subnets[0].AvailabilityZone' --output text)
  AZ2=$(aws ec2 describe-availability-zones --region "$REGION" \
    --query "AvailabilityZones[?ZoneName!='$AZ1'].ZoneName | [0]" --output text)
  VPC_CIDR=$(aws ec2 describe-vpcs --region "$REGION" --vpc-ids "$VPC_ID" \
    --query 'Vpcs[0].CidrBlock' --output text)
  # Pick a secondary CIDR block for new subnet
  SECOND_CIDR="10.0.2.0/24"
  NEW_SUBNET=$(aws ec2 create-subnet --region "$REGION" --vpc-id "$VPC_ID" \
    --cidr-block "$SECOND_CIDR" --availability-zone "$AZ2" \
    --tag-specifications "ResourceType=subnet,Tags=[{Key=Name,Value=aiimin-subnet-2}]" \
    --query Subnet.SubnetId --output text 2>/dev/null || true)
  if [[ -n "$NEW_SUBNET" && "$NEW_SUBNET" != "None" ]]; then
    SUBNET_ARR+=("$NEW_SUBNET")
    echo "Created subnet $NEW_SUBNET in $AZ2"
  fi
fi

if [[ ${#SUBNET_ARR[@]} -lt 2 ]]; then
  echo "ERROR: Need at least 2 subnets in VPC for RDS. Add a subnet manually or use default VPC."
  exit 1
fi

# RDS security group
RDS_SG_NAME="aiimin-rds-sg"
RDS_SG_ID=$(aws ec2 describe-security-groups --region "$REGION" \
  --filters "Name=group-name,Values=$RDS_SG_NAME" "Name=vpc-id,Values=$VPC_ID" \
  --query 'SecurityGroups[0].GroupId' --output text 2>/dev/null || echo "None")

if [[ "$RDS_SG_ID" == "None" || -z "$RDS_SG_ID" ]]; then
  RDS_SG_ID=$(aws ec2 create-security-group --region "$REGION" \
    --group-name "$RDS_SG_NAME" --description "AIIMIN RDS PostgreSQL" --vpc-id "$VPC_ID" \
    --query GroupId --output text)
  echo "Created RDS SG: $RDS_SG_ID"
fi

# Allow EC2 SG → RDS 5432
EC2_SG_ID=$(aws ec2 describe-security-groups --region "$REGION" \
  --filters "Name=group-name,Values=$EC2_SG_NAME" "Name=vpc-id,Values=$VPC_ID" \
  --query 'SecurityGroups[0].GroupId' --output text 2>/dev/null || echo "None")

if [[ -n "$EC2_SG_ID" && "$EC2_SG_ID" != "None" ]]; then
  aws ec2 authorize-security-group-ingress --region "$REGION" \
    --group-id "$RDS_SG_ID" --protocol tcp --port 5432 \
    --source-group "$EC2_SG_ID" 2>/dev/null || echo "RDS ingress rule may already exist"
fi

# DB subnet group
SUBNET_GROUP="aiimin-db-subnet"
aws rds create-db-subnet-group --region "$REGION" \
  --db-subnet-group-name "$SUBNET_GROUP" \
  --db-subnet-group-description "AIIMIN RDS subnets" \
  --subnet-ids "${SUBNET_ARR[0]}" "${SUBNET_ARR[1]}" 2>/dev/null || echo "Subnet group exists"

# Create RDS if not exists
if aws rds describe-db-instances --region "$REGION" --db-instance-identifier "$DB_ID" >/dev/null 2>&1; then
  echo "RDS instance $DB_ID already exists"
else
  echo "Creating RDS $DB_ID ($DB_CLASS)..."
  aws rds create-db-instance --region "$REGION" \
    --db-instance-identifier "$DB_ID" \
    --db-instance-class "$DB_CLASS" \
    --engine postgres \
    --engine-version "16.4" \
    --master-username "$DB_USER" \
    --master-user-password "$DB_MASTER_PASSWORD" \
    --allocated-storage "$ALLOCATED_STORAGE" \
    --storage-type gp3 \
    --db-name "$DB_NAME" \
    --vpc-security-group-ids "$RDS_SG_ID" \
    --db-subnet-group-name "$SUBNET_GROUP" \
    --no-publicly-accessible \
    --backup-retention-period 7 \
    --preferred-backup-window "03:00-04:00" \
    --preferred-maintenance-window "sun:04:00-sun:05:00" \
    --tags Key=Name,Value=aiimin-rds
  echo "Waiting for RDS (5-10 min)..."
  aws rds wait db-instance-available --region "$REGION" --db-instance-identifier "$DB_ID"
fi

ENDPOINT=$(aws rds describe-db-instances --region "$REGION" --db-instance-identifier "$DB_ID" \
  --query 'DBInstances[0].Endpoint.Address' --output text)

DATABASE_URL="postgresql://${DB_USER}:${DB_MASTER_PASSWORD}@${ENDPOINT}:5432/${DB_NAME}?sslmode=require"

echo ""
echo "=== RDS Ready ==="
echo "Endpoint: $ENDPOINT"
echo "DATABASE_URL=$DATABASE_URL"
echo ""
echo "Save DB_MASTER_PASSWORD in EC2 .env and run pg_restore from Supabase backup."
