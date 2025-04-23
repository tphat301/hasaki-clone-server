module.exports = {
  apps: [
    {
      name: 'Hasaki',
      script: 'node dist/index.js',
      env: {
        NODE_ENV: '',
        TEN_BIEN: 'Gia tri'
      },
      env_production: {
        NODE_ENV: 'production'
      }
    }
  ]
}
