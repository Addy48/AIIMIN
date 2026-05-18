# AIIMIN — AWS EC2 Setup Guide

## Cost Estimate

| Resource | Price (ap-south-1) | Monthly | Annual |
|---|---|---|---|
| t4g.nano (0.5GB RAM, 2 vCPU ARM) | $0.0042/hr | $3.07 | $36.8 |
| 8GB gp3 EBS volume | $0.08/GB | $0.64 | $7.7 |
| Elastic IP (attached, running) | Free | $0 | $0 |
| Data transfer out (first 100GB free) | Free | $0 | $0 |
| **Total** | | **~$3.71** | **~$44.5** |

**$80 AWS credits → ~21 months of free running.**

---

## Step 1 — Create EC2 Instance (AWS Console)

1. Go to **EC2 → Launch Instance** (ap-south-1 / Mumbai region)
2. Settings:
   - **Name:** `aiimin-backend`
   - **AMI:** Ubuntu Server 24.04 LTS (ARM) — search "ubuntu-24.04-arm64"
   - **Instance type:** `t4g.nano`
   - **Key pair:** Create new → name it `aiimin` → download `aiimin.pem`
   - **Storage:** 8 GiB gp3 (not gp2)
   - **Security group (new):**
     - SSH (22) — My IP only
     - HTTP (80) — Anywhere (0.0.0.0/0, ::/0)
     - HTTPS (443) — Anywhere (0.0.0.0/0, ::/0)
3. **Launch instance**

---

## Step 2 — Assign Elastic IP

1. EC2 → **Elastic IPs** → Allocate Elastic IP → `ap-south-1`
2. **Associate** it to your `aiimin-backend` instance
3. Note the IP (example: `13.235.xxx.xxx`)

---

## Step 3 — Point DNS

In your domain registrar (GoDaddy):

```
Type: A
Name: api
Value: <your-elastic-ip>
TTL: 600
```

Wait 2-5 minutes for propagation.

---

## Step 4 — SSH In + Bootstrap

```bash
# Fix key permissions (required by SSH)
chmod 600 ~/Downloads/aiimin.pem

# SSH into your instance
ssh -i ~/Downloads/aiimin.pem ubuntu@<your-elastic-ip>

# Once inside, run the bootstrap script
cd ~
git clone https://github.com/Addy48/AIIMIN.git
chmod +x ~/AIIMIN/backend/setup/bootstrap.sh
~/AIIMIN/backend/setup/bootstrap.sh
```

The script handles: Node.js, PM2, Nginx, Certbot SSL, firewall, starting the app.

---

## Step 5 — Create .env on EC2

```bash
cp ~/AIIMIN/backend/.env.example ~/AIIMIN/backend/.env
nano ~/AIIMIN/backend/.env
```

Fill in all values. Required:
- `SUPABASE_URL` + `SUPABASE_SERVICE_ROLE_KEY` + `SUPABASE_SERVICE_KEY`
- `GOOGLE_CLIENT_ID` + `GOOGLE_CLIENT_SECRET`
- `JWT_SECRET` → run: `openssl rand -hex 32`
- `TOKEN_ENCRYPTION_KEY` → run: `openssl rand -hex 32`

---

## Step 6 — Set GitHub Actions Secrets

Go to: `github.com/Addy48/AIIMIN → Settings → Secrets → Actions`

Add these two secrets:

| Secret | Value |
|--------|-------|
| `EC2_HOST` | Your Elastic IP (e.g. `13.235.xxx.xxx`) |
| `EC2_SSH_KEY` | Full contents of `aiimin.pem` file |

After this, every push to `main` that changes `backend/` auto-deploys.

---

## Step 7 — Verify

```bash
# Health check
curl https://api.aiimin.in/health

# PM2 status
pm2 list

# Live logs
pm2 logs aiimin-api
```

---

## Ongoing Operations

```bash
# SSH in
ssh -i ~/Downloads/aiimin.pem ubuntu@<elastic-ip>

# View logs
pm2 logs aiimin-api --lines 50

# Restart manually
pm2 restart aiimin-api

# Check Nginx
sudo systemctl status nginx
sudo tail -f /var/log/nginx/aiimin-api-error.log

# Renew SSL (auto-renews, but manual test)
sudo certbot renew --dry-run

# Update code manually
cd ~/AIIMIN && git pull origin main && cd backend && npm ci --omit=dev && pm2 reload aiimin-api
```

---

## Files Created for AWS

```
backend/
├── setup/
│   ├── bootstrap.sh        # Run once on fresh EC2
│   └── nginx.conf          # Nginx reverse proxy config
├── ecosystem.config.cjs    # PM2 process config
└── .env.example            # Environment variables template

.github/workflows/
└── deploy-backend.yml      # GitHub Actions auto-deploy
```
