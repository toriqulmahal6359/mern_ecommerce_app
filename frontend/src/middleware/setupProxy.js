const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
    app.use('/backend', createProxyMiddleware({
        target: 'https://sandbox.sslcommerz.com',
        changeOrigin: true
    }))
};