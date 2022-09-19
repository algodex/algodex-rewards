import { shortenAddress } from '../../lib/helper'

function clear() {
  cy.clearLocalStorage()
}

describe('Algodex Rewards Wallet page', () => {
  beforeEach(clear)
  afterEach(clear)

  it('Should render signed-in wallet', () => {
    cy.fixture('wallet').then(function (walletData) {
      cy.visit(`/wallet?viewAsWallet=${walletData.address}`)
    })
    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.wait(4000)
    cy.get('[data-testid=address]').click()
    cy.get('[data-testid=balance]').should('be.visible')
    cy.get('[data-testid=disconnect]').should('be.visible')
    cy.fixture('wallet').then(function (walletData) {
      cy.get('[data-testid=address]').contains(
        shortenAddress({ address: walletData.address })
      )
    })
  })
})
