/**
 * setupProxy.js
 * -------------
 * Custom dev-server proxy middleware for Create React App.
 * Proxies all /api requests to the backend server running on http://localhost:5000.
 *
 * Strips the 'cookie' header from proxied API requests because CodeSpire uses
 * Bearer JWT tokens in the Authorization header. This prevents accumulated
 * localhost cookies from causing HTTP 431 (Request Header Fields Too Large).
 */

const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'http://localhost:5000',
      changeOrigin: true,
      onProxyReq: (proxyReq) => {
        // Remove cookie header to prevent header bloat and 431 errors
        proxyReq.removeHeader('cookie');
      }
    })
  );
};
