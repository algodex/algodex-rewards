function clear() {
  cy.clearLocalStorage()
}

describe('Algodex Rewards home page', () => {
  beforeEach(clear)
  afterEach(clear)

  it('Should not render sign up button if wallet is signed up', () => {
    cy.fixture('wallet').then(function (walletData) {
      cy.visit(`/?viewAsWallet=${walletData.address}`)
    })
    cy.get('[data-testid=signup-btn]').should('not.exist')
  })

  it('Should render sign up button if wallet is not signed up', () => {
    cy.fixture('wallet').then(function (walletData) {
      cy.visit(`/?viewAsWallet=${walletData.address2}`)
    })
    cy.get('[data-testid=signup-btn]').should('be.visible')
  })
})
