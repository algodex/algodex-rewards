const path = require('path')
const defaults = ['common', 'bottom-navigation', 'toolbar', 'drawer']
module.exports = {
  defaults,
  i18n: {
    'locales': ['en', 'es'],
    'defaultLocale': 'en',
    'pages': {
      '*': defaults,
      '/': [...defaults, 'index'],
      '/favorites': [...defaults, 'favorites']
    }
  },
  localePath: path.resolve('./locales'),
}
