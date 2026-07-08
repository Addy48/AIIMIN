/**
 * PM2 ecosystem — AIIMIN API on EC2
 * Usage: pm2 start deploy/ecosystem.config.cjs
 */
module.exports = {
  apps: [
    {
      name: 'aiimin-api',
      script: 'dev_server.js',
      cwd: '/home/ubuntu/AIIMIN',
      instances: 1,
      exec_mode: 'fork',
      node_args: '--dns-result-order=ipv4first',
      autorestart: true,
      watch: false,
      max_memory_restart: '400M',
      env: {
        NODE_ENV: 'production',
        PORT: 3001,
      },
      error_file: '/home/ubuntu/.pm2/logs/aiimin-api-error.log',
      out_file: '/home/ubuntu/.pm2/logs/aiimin-api-out.log',
      merge_logs: true,
      time: true,
    },
  ],
};
