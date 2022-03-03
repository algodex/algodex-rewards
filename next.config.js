const withPWA = require('next-pwa')

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  i18n: {
    'locales': ['en', 'ca', 'es'],
    'defaultLocale': 'en',
    'pages': {
      '*': ['common'],
      '/': ['index'],
      '/favorites': ['favorites']
    }
  },
  pwa: {
    dest: 'public',
    disable: process.env.NODE_ENV === 'development',
  },
  eslint: {
    dirs: ['pages', 'utils', 'components'],
    // Only run ESLint on the 'pages' and 'utils' directories during production builds (next build)
  },
}

module.exports = withPWA(nextConfig)
