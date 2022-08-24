// eslint-disable-next-line @typescript-eslint/no-var-requires
const { defineConfig } = require('cypress')

module.exports = defineConfig({
  env: {
    'cypress-react-selector': {
      root: '#__next',
    },
  },
  viewportWidth: 1300,
  viewportHeight: 1000,
  defaultCommandTimeout: 10000,
  requestTimeout: 100000,
  responseTimeout: 100000,
  pageLoadTimeout: 100000,
  video: true,
  e2e: {
    setupNodeEvents() {
      // implement node event listeners here
    },
    baseUrl: 'http://localhost:3000',
  },
})
