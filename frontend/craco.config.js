const path = require('path');

module.exports = {
  eslint: {
    enable: false,
  },
  webpack: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      'next/link': path.resolve(__dirname, 'src/shims/next/link.js'),
      'next/image': path.resolve(__dirname, 'src/shims/next/image.js'),
      'next-themes': path.resolve(__dirname, 'src/shims/next-themes.js'),
    },
  },
  // Safari caches CRA chunks aggressively — force no-store in local dev.
  // Phone WebView + SPA routes (/m) must not hit package.json proxy → :3001.
  devServer: {
    headers: {
      'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
      Pragma: 'no-cache',
      Expires: '0',
    },
    historyApiFallback: {
      disableDotRule: true,
      index: '/index.html',
    },
    // Allow phone LAN access (HOST=0.0.0.0)
    allowedHosts: 'all',
  },
};
