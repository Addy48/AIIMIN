#!/usr/bin/env bash
#
# install-maintenance.sh — install the self-healing maintenance job on the API box.
# Idempotent: safe to re-run, and the EC2 deploy script can call it every time.
#
#   sudo bash deploy/install-maintenance.sh
#
set -euo pipefail
HERE="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo "==> installing /usr/local/bin/ec2-maintenance.sh"
install -m 0755 "$HERE/ec2-maintenance.sh" /usr/local/bin/ec2-maintenance.sh

echo "==> capping journald at 64M so it cannot fill the disk again"
install -d /etc/systemd/journald.conf.d
cat > /etc/systemd/journald.conf.d/99-aiimin-size.conf <<'EOF'
[Journal]
SystemMaxUse=64M
SystemMaxFileSize=16M
EOF
systemctl restart systemd-journald || true

echo "==> capping pm2 logs (pm2-logrotate)"
su - ubuntu -c 'pm2 install pm2-logrotate' >/dev/null 2>&1 || true
su - ubuntu -c 'pm2 set pm2-logrotate:max_size 10M'      >/dev/null 2>&1 || true
su - ubuntu -c 'pm2 set pm2-logrotate:retain 5'          >/dev/null 2>&1 || true
su - ubuntu -c 'pm2 set pm2-logrotate:compress true'     >/dev/null 2>&1 || true

echo "==> installing daily timer"
cat > /etc/systemd/system/aiimin-maintenance.service <<'EOF'
[Unit]
Description=AIIMIN API box maintenance — reclaim disk, alert if it cannot
After=network-online.target

[Service]
Type=oneshot
ExecStart=/usr/local/bin/ec2-maintenance.sh
# Never let maintenance starve the API on a 408MB box.
Nice=10
IOSchedulingClass=idle
EOF

cat > /etc/systemd/system/aiimin-maintenance.timer <<'EOF'
[Unit]
Description=Run AIIMIN box maintenance daily

[Timer]
OnCalendar=*-*-* 02:30:00
RandomizedDelaySec=15m
Persistent=true

[Install]
WantedBy=timers.target
EOF

systemctl daemon-reload
systemctl enable --now aiimin-maintenance.timer
echo "==> installed. Next run:"
systemctl list-timers aiimin-maintenance.timer --no-pager | head -3
