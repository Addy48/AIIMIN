#!/usr/bin/env bash
# AIIMIN EC2 bootstrap — Ubuntu 24.04 ARM (t4g.nano)
# Run once on a fresh instance: bash deploy/bootstrap.sh
set -euo pipefail

export DEBIAN_FRONTEND=noninteractive

echo "==> Updating system packages"
sudo apt-get update -y
sudo apt-get upgrade -y

echo "==> Installing base dependencies"
sudo apt-get install -y curl git build-essential ufw nginx certbot python3-certbot-nginx

echo "==> Configuring UFW firewall"
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow OpenSSH
sudo ufw allow 'Nginx Full'
sudo ufw --force enable

echo "==> Installing Node.js 22 (NodeSource)"
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt-get install -y nodejs
node -v
npm -v

echo "==> Installing PM2 globally"
sudo npm install -g pm2

APP_DIR="${HOME}/AIIMIN"
if [ ! -d "$APP_DIR" ]; then
  echo "==> Cloning AIIMIN repository"
  git clone https://github.com/Addy48/AIIMIN.git "$APP_DIR"
fi

cd "$APP_DIR"

echo "==> Installing production dependencies (API only — skip frontend on EC2)"
npm install --omit=dev --ignore-scripts

if [ ! -f "$APP_DIR/.env" ]; then
  echo "==> Copying deploy/.env.production.example to .env (edit before starting)"
  cp "$APP_DIR/deploy/.env.production.example" "$APP_DIR/.env"
fi

echo "==> Installing Nginx site config (HTTP until Certbot)"
sudo cp "$APP_DIR/deploy/nginx.http-only.conf" /etc/nginx/sites-available/aiimin-api
sudo ln -sf /etc/nginx/sites-available/aiimin-api /etc/nginx/sites-enabled/aiimin-api
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t
sudo systemctl enable nginx
sudo systemctl restart nginx

echo "==> Requesting SSL certificate (api.aiimin.in) — requires DNS A record"
if sudo certbot --nginx -d api.aiimin.in --non-interactive --agree-tos -m admin@aiimin.in --redirect 2>/dev/null; then
  sudo cp "$APP_DIR/deploy/nginx.conf" /etc/nginx/sites-available/aiimin-api
  sudo nginx -t && sudo systemctl reload nginx
else
  echo "Certbot skipped — using HTTP proxy. After DNS propagates, run:"
  echo "  sudo certbot --nginx -d api.aiimin.in"
  echo "  sudo cp $APP_DIR/deploy/nginx.conf /etc/nginx/sites-available/aiimin-api && sudo nginx -t && sudo systemctl reload nginx"
fi

echo "==> Starting API with PM2"
pm2 start "$APP_DIR/deploy/ecosystem.config.cjs"
pm2 save
sudo env PATH="$PATH:/usr/bin" pm2 startup systemd -u "$USER" --hp "$HOME" | tail -1 | bash || true

echo "==> Bootstrap complete"
echo "Health check: curl https://api.aiimin.in/api/health"
