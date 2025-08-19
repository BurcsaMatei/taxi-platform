// next.config.js
const { createVanillaExtractPlugin } = require('@vanilla-extract/next-plugin');
const withVanillaExtract = createVanillaExtractPlugin();

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,

  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [360, 640, 768, 1024, 1280, 1536, 1920],
    imageSizes: [160, 240, 320, 480, 640, 820],
  },

  experimental: {
    optimizeCss: true,
  },

  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/i,
      issuer: /\.[jt]sx?$/,
      use: [{ loader: '@svgr/webpack', options: { svgo: true, titleProp: true } }],
    });
    return config;
  },

  async headers() {
    const isDev = process.env.NODE_ENV !== 'production';

    const cspDev = [
      "default-src 'self'",
      "script-src 'self' 'unsafe-eval' 'unsafe-inline'",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' https: data: blob:",
      "font-src 'self' https: data:",
      "connect-src 'self' ws:",
      "frame-ancestors 'self'",
      "base-uri 'self'",
      "form-action 'self'",
    ].join('; ');

    const cspProd = [
      "default-src 'self'",
      "script-src 'self'",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' https: data: blob:",
      "font-src 'self' https: data:",
      "connect-src 'self'",
      "frame-ancestors 'self'",
      "base-uri 'self'",
      "form-action 'self'",
    ].join('; ');

    const securityHeaders = [
      { key: 'Content-Security-Policy', value: isDev ? cspDev : cspProd },
      { key: 'X-Frame-Options', value: 'DENY' },
      { key: 'X-Content-Type-Options', value: 'nosniff' },
      { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
      { key: 'Permissions-Policy', value: "geolocation=(), camera=(), microphone=()" },
      { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
    ];

    return [{ source: '/(.*)', headers: securityHeaders }];
  },
};

module.exports = withVanillaExtract(nextConfig);
