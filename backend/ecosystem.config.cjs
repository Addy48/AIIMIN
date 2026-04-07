/**
 * PM2 Ecosystem Config — AIIMIN Backend
 * Usage:
 *   pm2 start ecosystem.config.cjs --env production
 *   pm2 save && pm2 startup
 */
module.exports = {
  apps: [
    {
      name: 'aiimin-api',
      script: './index.js',
      interpreter: 'node',
      node_args: '--experimental-vm-modules',

      instances: 1,          // t4g.nano has 2 vCPUs but 0.5GB RAM — keep at 1
      exec_mode: 'fork',     // not cluster (saves RAM)

      env_production: {
        NODE_ENV: 'production',
        PORT: 3000,          // Nginx proxies 443 → 3000
      },

      // ── Restart policy ──────────────────────────────
      restart_delay: 3000,        // wait 3s before restart
      max_restarts: 10,           // max 10 restarts in watch window
      min_uptime: '10s',          // must stay up 10s to count as "started"
      autorestart: true,

      // ── Logging ─────────────────────────────────────
      log_date_format: 'YYYY-MM-DD HH:mm:ss',
      out_file: '/home/ubuntu/logs/aiimin-out.log',
      error_file: '/home/ubuntu/logs/aiimin-err.log',
      merge_logs: true,
      log_type: 'json',

      // ── Memory guard (kills + restarts if RAM exceeds 350MB) ──
      max_memory_restart: '350M',

      // ── Watch (disabled in prod — use pm2 reload instead) ──
      watch: false,
    },
  ],
};
