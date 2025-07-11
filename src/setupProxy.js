const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
  app.use(
    '/diagnose',
    createProxyMiddleware({
      target: 'http://localhost:5000',
      changeOrigin: true,
      timeout: 30000,
      proxyTimeout: 30000,
    })
  );
};