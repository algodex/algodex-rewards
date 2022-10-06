/* 
 * Algodex Rewards 
 * Copyright (C) 2022 Algodex VASP (BVI) Corp.
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published
 * by the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.

 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

// eslint-disable-next-line @typescript-eslint/no-var-requires
const withPWA = require('next-pwa')
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { i18n } = require('./next-i18next.config')

/** @type {import('next').NextConfig} */

const rewrites = () => {
  return [
    {
      source: '/pouch/:db*',
      destination: `${
        process.env.DB_BASE_URL ? `${process.env.DB_BASE_URL}/:db*` : '/:db*'
      }`,
    },
    {
      source: '/rewards/:db*',
      destination: `${
        process.env.ALGODEX_PROXY_API
          ? `${process.env.ALGODEX_PROXY_API}/rewards/:db*`
          : '/rewards/:db*'
      }`,
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
