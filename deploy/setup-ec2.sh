#!/usr/bin/env bash
# Provision AIIMIN EC2 in ap-south-1 (~$3.71/mo on credits)
set -euo pipefail

REGION=ap-south-1
INSTANCE_TYPE=t4g.nano
KEY_NAME=aiimin
SG_NAME=aiimin-api-sg
VPC_NAME=aiimin-vpc
SUBNET_CIDR=10.0.1.0/24
VPC_CIDR=10.0.0.0/16

AMI=$(aws ec2 describe-images --region "$REGION" --owners 099720109477 \
  --filters "Name=name,Values=ubuntu/images/hvm-ssd-gp3/ubuntu-noble-24.04-arm64-server-*" \
  --query 'sort_by(Images,&CreationDate)[-1].ImageId' --output text)

echo "AMI: $AMI"

# ── VPC (create if account has no default VPC) ───────────────────────────────
VPC_ID=$(aws ec2 describe-vpcs --region "$REGION" \
  --filters "Name=tag:Name,Values=$VPC_NAME" \
  --query 'Vpcs[0].VpcId' --output text 2>/dev/null || echo "None")

if [ "$VPC_ID" = "None" ] || [ -z "$VPC_ID" ]; then
  VPC_ID=$(aws ec2 create-vpc --region "$REGION" --cidr-block "$VPC_CIDR" \
    --tag-specifications "ResourceType=vpc,Tags=[{Key=Name,Value=$VPC_NAME}]" \
    --query Vpc.VpcId --output text)
  aws ec2 modify-vpc-attribute --region "$REGION" --vpc-id "$VPC_ID" --enable-dns-hostnames
  aws ec2 modify-vpc-attribute --region "$REGION" --vpc-id "$VPC_ID" --enable-dns-support

  IGW_ID=$(aws ec2 create-internet-gateway --region "$REGION" \
    --tag-specifications "ResourceType=internet-gateway,Tags=[{Key=Name,Value=aiimin-igw}]" \
    --query InternetGateway.InternetGatewayId --output text)
  aws ec2 attach-internet-gateway --region "$REGION" --internet-gateway-id "$IGW_ID" --vpc-id "$VPC_ID"

  AZ=$(aws ec2 describe-availability-zones --region "$REGION" \
    --query 'AvailabilityZones[0].ZoneName' --output text)
  SUBNET_ID=$(aws ec2 create-subnet --region "$REGION" --vpc-id "$VPC_ID" \
    --cidr-block "$SUBNET_CIDR" --availability-zone "$AZ" \
    --tag-specifications "ResourceType=subnet,Tags=[{Key=Name,Value=aiimin-subnet}]" \
    --query Subnet.SubnetId --output text)
  aws ec2 modify-subnet-attribute --region "$REGION" --subnet-id "$SUBNET_ID" --map-public-ip-on-launch

  RT_ID=$(aws ec2 create-route-table --region "$REGION" --vpc-id "$VPC_ID" \
    --tag-specifications "ResourceType=route-table,Tags=[{Key=Name,Value=aiimin-rt}]" \
    --query RouteTable.RouteTableId --output text)
  aws ec2 create-route --region "$REGION" --route-table-id "$RT_ID" \
    --destination-cidr-block 0.0.0.0/0 --gateway-id "$IGW_ID"
  aws ec2 associate-route-table --region "$REGION" --route-table-id "$RT_ID" --subnet-id "$SUBNET_ID"
  echo "Created VPC $VPC_ID, subnet $SUBNET_ID"
else
  SUBNET_ID=$(aws ec2 describe-subnets --region "$REGION" \
    --filters "Name=vpc-id,Values=$VPC_ID" \
    --query 'Subnets[0].SubnetId' --output text)
  echo "Using VPC $VPC_ID, subnet $SUBNET_ID"
fi

# ── Security group ───────────────────────────────────────────────────────────
SG_ID=$(aws ec2 describe-security-groups --region "$REGION" \
  --filters "Name=group-name,Values=$SG_NAME" "Name=vpc-id,Values=$VPC_ID" \
  --query 'SecurityGroups[0].GroupId' --output text 2>/dev/null || echo "None")

if [ "$SG_ID" = "None" ] || [ -z "$SG_ID" ]; then
  SSH_CIDR="${SSH_CIDR:-$(curl -sf https://checkip.amazonaws.com | tr -d '\n')/32}"
  SG_ID=$(aws ec2 create-security-group --region "$REGION" \
    --group-name "$SG_NAME" --description "AIIMIN API" --vpc-id "$VPC_ID" \
    --query GroupId --output text)
  aws ec2 authorize-security-group-ingress --region "$REGION" --group-id "$SG_ID" \
    --protocol tcp --port 22 --cidr "$SSH_CIDR"
  aws ec2 authorize-security-group-ingress --region "$REGION" --group-id "$SG_ID" \
    --protocol tcp --port 80 --cidr 0.0.0.0/0
  aws ec2 authorize-security-group-ingress --region "$REGION" --group-id "$SG_ID" \
    --protocol tcp --port 443 --cidr 0.0.0.0/0
fi

echo "Security group: $SG_ID"

# ── Key pair ─────────────────────────────────────────────────────────────────
if ! aws ec2 describe-key-pairs --region "$REGION" --key-names "$KEY_NAME" >/dev/null 2>&1; then
  aws ec2 create-key-pair --region "$REGION" --key-name "$KEY_NAME" \
    --query KeyMaterial --output text > "${KEY_NAME}.pem"
  chmod 600 "${KEY_NAME}.pem"
  echo "Saved SSH key: ${KEY_NAME}.pem"
fi

# ── Launch instance ──────────────────────────────────────────────────────────
INSTANCE_ID=$(aws ec2 run-instances --region "$REGION" \
  --image-id "$AMI" --instance-type "$INSTANCE_TYPE" \
  --key-name "$KEY_NAME" --security-group-ids "$SG_ID" --subnet-id "$SUBNET_ID" \
  --block-device-mappings '[{"DeviceName":"/dev/sda1","Ebs":{"VolumeSize":8,"VolumeType":"gp3"}}]' \
  --tag-specifications 'ResourceType=instance,Tags=[{Key=Name,Value=aiimin-api}]' \
  --query Instances[0].InstanceId --output text)

echo "Instance: $INSTANCE_ID — waiting..."
aws ec2 wait instance-running --region "$REGION" --instance-ids "$INSTANCE_ID"

ALLOC_ID=$(aws ec2 allocate-address --region "$REGION" --domain vpc --query AllocationId --output text)
aws ec2 associate-address --region "$REGION" --instance-id "$INSTANCE_ID" --allocation-id "$ALLOC_ID"
EIP=$(aws ec2 describe-addresses --region "$REGION" --allocation-ids "$ALLOC_ID" --query 'Addresses[0].PublicIp' --output text)

echo ""
echo "=== EC2 Ready ==="
echo "Instance ID: $INSTANCE_ID"
echo "Elastic IP:  $EIP"
echo "SSH: ssh -i ${KEY_NAME}.pem ubuntu@$EIP"
echo "DNS: Point api.aiimin.in A record to $EIP"
echo "Then: scp -i ${KEY_NAME}.pem deploy/bootstrap.sh ubuntu@$EIP:~/ && ssh -i ${KEY_NAME}.pem ubuntu@$EIP 'bash bootstrap.sh'"
