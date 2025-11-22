/**
 * PM2 Ecosystem Configuration File
 *
 * This file configures PM2 for production deployment on VPS/Niagahoster
 * PM2 is a production process manager for Node.js applications
 *
 * Usage:
 * - Start: pm2 start ecosystem.config.js
 * - Restart: pm2 restart my_web
 * - Stop: pm2 stop my_web
 * - Logs: pm2 logs my_web
 * - Monitor: pm2 monit
 */

module.exports = {
  apps: [
    {
      name: 'my_web',
      script: 'node_modules/next/dist/bin/next',
      args: 'start',
      cwd: './',
      instances: 1, // Single instance for small VPS. Use 'max' for multi-core servers
      exec_mode: 'cluster',

      // Environment variables
      env_production: {
        NODE_ENV: 'production',
        PORT: 3000,
      },

      // Logging
      error_file: './logs/pm2-error.log',
      out_file: './logs/pm2-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      merge_logs: true,

      // Auto-restart configuration
      watch: false, // Don't watch in production
      max_memory_restart: '500M', // Restart if memory exceeds 500MB
      min_uptime: '10s', // Minimum uptime before considering app as stable
      max_restarts: 10, // Maximum number of restarts within 1 minute

      // Graceful shutdown
      kill_timeout: 5000, // Time to wait before forcing shutdown (ms)
      listen_timeout: 3000, // Time to wait for app to be ready (ms)

      // Process management
      autorestart: true, // Auto restart if crashes
      restart_delay: 4000, // Delay between restarts (ms)

      // Advanced features
      exp_backoff_restart_delay: 100, // Exponential backoff for restart delays

      // Instance variables (useful for multi-instance setups)
      instance_var: 'INSTANCE_ID',
    },
  ],

  /**
   * Deployment configuration (optional)
   * Uncomment and configure if you want to use PM2 deploy
   */
  // deploy: {
  //   production: {
  //     user: 'your-username',
  //     host: 'your-server-ip',
  //     ref: 'origin/main',
  //     repo: 'git@github.com:username/repo.git',
  //     path: '/var/www/my_web',
  //     'post-deploy': 'npm install && npm run build && pm2 reload ecosystem.config.js --env production',
  //     'pre-setup': 'apt-get install git'
  //   }
  // }
};
