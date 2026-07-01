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
};
