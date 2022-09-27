// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require('path')
const defaults = ['common']
module.exports = {
  defaults,
  i18n: {
    locales: ['en', 'es'],
    defaultLocale: 'en',
    pages: {
      '*': defaults,
      '/': [...defaults, 'index'],
      '/chart': [...defaults, 'chart'],
      '/periods': [...defaults, 'periods'],
      '/wallet': [...defaults, 'wallet'],
    },
  },
  localePath: path.resolve('./locales'),
}
