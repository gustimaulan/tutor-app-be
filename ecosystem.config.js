module.exports = {
  apps: [{
    name: 'tutor-app-backend',
    script: 'server.js',
    cwd: '/var/www/tutor-app-backend/backend-supabase',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 3001
    },
    env_file: '.env.production',
    log_file: '/var/log/tutor-app-backend/combined.log',
    out_file: '/var/log/tutor-app-backend/out.log',
    error_file: '/var/log/tutor-app-backend/error.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    merge_logs: true,
    max_memory_restart: '1G',
    restart_delay: 4000,
    max_restarts: 10,
    min_uptime: '10s',
    watch: false,
    ignore_watch: ['node_modules', 'uploads', 'logs'],
    node_args: '--max-old-space-size=1024'
  }]
}; 