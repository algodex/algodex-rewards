const Helper = {
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
