const sizes = ['iphone-6', 'iphone-x', 'samsung-s10', 'samsung-note9']
function clear() {
  cy.clearLocalStorage()
}
describe('Algodex Rewards Mobile Layout', () => {
  beforeEach(clear)
  afterEach(clear)
  sizes.forEach((size) => {
    it(`Should render home page on ${size} screen`, () => {
      cy.viewport(size)
      cy.visit('/')
      cy.get('[data-testid=app-bar]').should('be.visible')
      cy.get('[data-testid=menu-btn]').should('be.visible')
      cy.get('[data-testid=toolbar-links]').should('not.exist')
      cy.get('[data-testid=pending-period]').should('be.visible')
      cy.get('[data-testid=total-rewards]').should('be.visible')
    })

    it(`Should render chart page on ${size} screen`, () => {
      cy.viewport(size)
      cy.get('[data-testid=mb-chart-link]').click()
      cy.get('[data-testid=app-bar]').should('be.visible')
      cy.get('[data-testid=menu-btn]').should('be.visible')
      cy.get('[data-testid=toolbar-links]').should('not.exist')
      cy.url().should('include', '/chart')
      cy.get('[data-testid=earnings-overtime]').should('be.visible')
    })

    it(`Should render period page on ${size} screen`, () => {
      cy.viewport(size)
      cy.get('[data-testid=mb-period-link]').click()
      cy.get('[data-testid=app-bar]').should('be.visible')
      cy.get('[data-testid=menu-btn]').should('be.visible')
      cy.get('[data-testid=toolbar-links]').should('not.exist')
      cy.url().should('include', '/periods')
    })

    it(`Should render wallet page on ${size} screen`, () => {
      cy.viewport(size)
      cy.get('[data-testid=mb-wallet-link]').click()
      cy.get('[data-testid=app-bar]').should('be.visible')
      cy.get('[data-testid=menu-btn]').should('be.visible')
      cy.get('[data-testid=toolbar-links]').should('not.exist')
      cy.url().should('include', '/wallet')
      cy.get('[data-testid=return-home]').should('be.visible')
    })
  })
})
