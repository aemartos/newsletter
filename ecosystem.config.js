module.exports = {
  apps: [
    {
      name: 'newsletter-server',
      cwd: './server',
      script: 'pnpm',
      args: 'dev',
      watch: false,
      ignore_watch: ['node_modules', 'dist'],
      instances: 1,
      exec_mode: 'fork',
      interpreter: 'none',
    },
    {
      name: 'newsletter-client',
      cwd: './client',
      script: 'pnpm',
      args: 'dev',
      watch: false,
      ignore_watch: ['node_modules', 'build'],
      instances: 1,
      exec_mode: 'fork',
      interpreter: 'none',
    }
  ]
};

