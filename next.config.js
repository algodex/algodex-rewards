// eslint-disable-next-line @typescript-eslint/no-var-requires
const withPWA = require('next-pwa')
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { i18n } = require('./next-i18next.config')

/** @type {import('next').NextConfig} */

const rewrites = () => {
  return [
    {
      source: '/pouch/:db*',
      destination: `${process.env.DB_BASE_URL}/:db*`,
    },
    {
      source: '/optin/:db*',
      destination: `${process.env.ALGODEX_PROXY_API}/rewards/optin/:db*`,
    },
  ]
}

const nextConfig = {
  reactStrictMode: true,
  i18n,
  rewrites,
  pwa: {
    dest: 'public',
    disable: process.env.NODE_ENV === 'development',
  },
  images: {
    domains: ['asa-list.tinyman.org'],
  },
}

module.exports = withPWA(nextConfig)
