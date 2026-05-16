#!/bin/bash
# ════════════════════════════════════════════════════════════════
# AIIMIN — AWS EC2 One-Shot Bootstrap Script
# Instance: t4g.nano (ARM Graviton2) · Ubuntu 24.04 LTS ARM64
# Region:   ap-south-1 (Mumbai)
#
# Run ONCE after SSHing into a fresh EC2:
#   chmod +x bootstrap.sh && ./bootstrap.sh
# ════════════════════════════════════════════════════════════════
set -euo pipefail

GREEN='\033[0;32m'; YELLOW='\033[1;33m'; RED='\033[0;31m'; NC='\033[0m'
log()   { echo -e "${GREEN}[✓]${NC} $1"; }
warn()  { echo -e "${YELLOW}[!]${NC} $1"; }
error() { echo -e "${RED}[✗]${NC} $1"; exit 1; }

echo ""
echo "═══════════════════════════════════════════════════════"
echo "   AIIMIN Backend Bootstrap — AWS EC2 t4g.nano"
echo "═══════════════════════════════════════════════════════"
echo ""

# ── 1. System update ─────────────────────────────────────
log "Updating system packages..."
sudo apt-get update -qq
sudo apt-get upgrade -y -qq
sudo apt-get install -y -qq curl wget git build-essential ufw

# ── 2. Node.js 20.x (ARM-compatible via NodeSource) ──────
log "Installing Node.js 20.x..."
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash - > /dev/null
sudo apt-get install -y -qq nodejs
node_version=$(node --version)
log "Node.js $node_version installed"

# ── 3. PM2 process manager ───────────────────────────────
log "Installing PM2..."
sudo npm install -g pm2 > /dev/null 2>&1
pm2 --version

# ── 4. Nginx ─────────────────────────────────────────────
log "Installing Nginx..."
sudo apt-get install -y -qq nginx
sudo systemctl enable nginx

# ── 5. Certbot (SSL) ─────────────────────────────────────
log "Installing Certbot..."
sudo apt-get install -y -qq certbot python3-certbot-nginx

# ── 6. Firewall (UFW) ────────────────────────────────────
log "Configuring firewall..."
sudo ufw allow OpenSSH
sudo ufw allow 'Nginx Full'     # 80 + 443
sudo ufw --force enable
sudo ufw status

# ── 7. Create log directory ──────────────────────────────
log "Creating log directory..."
mkdir -p ~/logs

# ── 8. Clone / pull repo ─────────────────────────────────
log "Cloning AIIMIN repository..."
if [ -d ~/AIIMIN ]; then
    warn "Repo already exists, pulling latest..."
    cd ~/AIIMIN && git pull origin main
else
    git clone https://github.com/Addy48/AIIMIN.git ~/AIIMIN
fi

# ── 9. Install backend dependencies ─────────────────────
log "Installing backend dependencies..."
cd ~/AIIMIN/backend
npm ci --omit=dev

# ── 10. Create .env file ─────────────────────────────────
echo ""
warn "═══════════════════════════════════════════════════════"
warn "  MANUAL STEP: Create backend/.env"
warn "═══════════════════════════════════════════════════════"
warn ""
warn "  Copy your environment variables:"
warn "    nano ~/AIIMIN/backend/.env"
warn ""
warn "  Template: ~/AIIMIN/backend/.env.example"
warn "  Required vars:"
warn "    SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, SUPABASE_SERVICE_KEY"
warn "    GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET"
warn "    JWT_SECRET (run: openssl rand -hex 32)"
warn "    TOKEN_ENCRYPTION_KEY (run: openssl rand -hex 32)"
warn "    FRONTEND_URL=https://aiimin.in"
warn "    NODE_ENV=production"
warn "    PORT=3000"
warn ""

read -p "Press Enter after creating .env to continue..."

# Verify .env exists
[ -f ~/AIIMIN/backend/.env ] || error ".env file not found at ~/AIIMIN/backend/.env"
log ".env file found"

# ── 11. Deploy Nginx config ──────────────────────────────
log "Deploying Nginx config..."
sudo cp ~/AIIMIN/backend/setup/nginx.conf /etc/nginx/sites-available/aiimin-api
sudo ln -sf /etc/nginx/sites-available/aiimin-api /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t
sudo systemctl reload nginx
log "Nginx configured"

# ── 12. SSL Certificate (Let's Encrypt) ──────────────────
echo ""
warn "═══════════════════════════════════════════════════════"
warn "  MANUAL STEP: Point DNS before SSL"
warn "═══════════════════════════════════════════════════════"
warn ""
warn "  In your domain registrar (GoDaddy):"
warn "    api.aiimin.in  →  A  →  $(curl -s ifconfig.me)"
warn ""
warn "  Wait for DNS to propagate (1-5 minutes), then continue."
warn ""

read -p "Press Enter after DNS is pointing to this IP..."

log "Obtaining SSL certificate..."
sudo certbot --nginx -d api.aiimin.in \
    --non-interactive \
    --agree-tos \
    --email aadityaupadhyay10@gmail.com \
    --redirect || {
    warn "Certbot failed. Run manually: sudo certbot --nginx -d api.aiimin.in"
}

# ── 13. Start backend with PM2 ───────────────────────────
log "Starting backend with PM2..."
cd ~/AIIMIN/backend
pm2 start ecosystem.config.cjs --env production
pm2 save

# ── 14. PM2 startup on reboot ────────────────────────────
log "Configuring PM2 startup on reboot..."
PM2_STARTUP=$(pm2 startup | grep "sudo env")
if [ -n "$PM2_STARTUP" ]; then
    eval "$PM2_STARTUP"
    log "PM2 startup configured"
else
    warn "Run 'pm2 startup' manually and execute the shown command"
fi

# ── 15. Final health check ───────────────────────────────
log "Running health check..."
sleep 5
if curl -sf http://localhost:3000/health > /dev/null; then
    log "Backend responding on port 3000"
else
    warn "Health check failed. Checking logs..."
    pm2 logs aiimin-api --lines 20
fi

if curl -sf https://api.aiimin.in/health > /dev/null; then
    log "HTTPS endpoint responding: https://api.aiimin.in/health"
else
    warn "HTTPS not yet responding — SSL may still be propagating"
fi

# ── Done ─────────────────────────────────────────────────
echo ""
echo "═══════════════════════════════════════════════════════"
echo "  ✅ AIIMIN Backend is LIVE"
echo "═══════════════════════════════════════════════════════"
echo ""
echo "  URL:      https://api.aiimin.in"
echo "  Health:   https://api.aiimin.in/health"
echo "  PM2 logs: pm2 logs aiimin-api"
echo "  PM2 list: pm2 list"
echo ""
echo "  Next step: Add GitHub Actions secrets"
echo "    EC2_HOST = $(curl -s ifconfig.me)"
echo "    EC2_SSH_KEY = contents of your .pem file"
echo ""
echo "  Cost estimate: ~\$3.71/month (~\$44.5/year)"
echo "  \$80 credits will last: ~21 months"
echo ""
