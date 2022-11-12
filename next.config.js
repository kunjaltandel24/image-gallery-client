const path = require('path')

/** @type {import('next').NextConfig} */
module.exports = {
  distDir: 'dist',
  compress: true,
  reactStrictMode: false,
  optimizeFonts: true,
  sassOptions: {
    includePaths: [path.join(__dirname, 'styles')],
  },
  env: {
    // declare here all your variables
    scheme: process.env.REACT_APP_BACKEND_SERVER_SCHEME,
    host: process.env.REACT_APP_BACKEND_SERVER_HOST,
  },
}
