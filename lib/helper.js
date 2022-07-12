/* eslint-disable max-len */
const algosdk = require('algosdk')

const Helper = {
  envObjs: null,
  getAlgodex: function () {
    if (!this.envObjs) {
      const environment = this.getEnvironment()
      const algodexEnvironment = this.getAlgodexEnvironment()
      const algodToken = ''
      const algodServer = 'https://node.algoexplorerapi.io/'
      const algodPort = ''

      const algodClient = new algosdk.Algodv2(
        algodToken,
        algodServer,
        algodPort
      )

      this.envObjs = {
        algodClient,
        environment,
        algodexEnvironment,
      }
    }
    return this.envObjs
  },

  getAlgodexEnvironment: function () {
    return process.env.NEXT_PUBLIC_ALGODEX_ENVIRONMENT || 'public_test'
  },

  getEnvironment: function () {
    const algodexEnvironment = this.getAlgodexEnvironment()
    if (algodexEnvironment === 'production') {
      return 'mainnet'
    }
    return 'testnet'
  },
}

module.exports = Helper
