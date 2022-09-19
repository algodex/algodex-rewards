function clear() {
  cy.clearLocalStorage()
}

describe('Algodex Rewards Chart ', () => {
  beforeEach(clear)
  afterEach(clear)

  it('Should render assets table with data', () => {
    cy.fixture('wallet').then(function (walletData) {
      this.walletData = walletData
      cy.visit(`/chart?viewAsWallet=${walletData.address}`)
    })

    cy.get('[data-testid=chart]').should('be.visible')
    cy.get('[data-testid=column-asset-USDC]').contains('USDC')
    // cy.get('[data-testid=column-asset-GEMS]').contains('GEMS')
    cy.get('[data-testid=column-asset-goBTC]').contains('goBTC')
  })
})
