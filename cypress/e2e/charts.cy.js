function clear() {
  cy.clearLocalStorage()
}
describe('Algodex Rewards Chart ', () => {
  beforeEach(clear)
  afterEach(clear)
  it('Should render chart with data', () => {
    cy.visit('/chart')
    //     cy.get('[data-testid=app-bar]').should('be.visible')
    //     cy.get('[data-testid=toolbar-links]').should('be.visible')
    //     cy.location('pathname').should('eq', '/chart')
    //     cy.get('[data-testid=earnings-overtime]').should('be.visible')
    //     cy.get('[data-testid=connect-wallet]').should('be.visible')
  })
})
