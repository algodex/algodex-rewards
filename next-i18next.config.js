const path = require('path')
const defaults = ['common', 'bottom-navigation', 'toolbar', 'drawer']
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
  react: { useSuspense: false },
  localePath: path.resolve('./locales'),
}
