const withPWA = require('next-pwa')
const { i18n } = require('./next-i18next.config')

/** @type {import('next').NextConfig} */

const rewrites = () => {
  return [
    {
      source: '/pouch/:db*',
      destination: `${process.env.DB_BASE_URL}/:db*`,
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
