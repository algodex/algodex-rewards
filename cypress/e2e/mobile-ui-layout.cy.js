const sizes = ['iphone-6', 'iphone-x', 'samsung-s10', 'samsung-note9']
function clear() {
  cy.clearLocalStorage()
}
describe('Algodex Rewards Mobile Layout', () => {
  beforeEach(clear)
  afterEach(clear)
  sizes.forEach((size) => {
    it(`Should render all the pages on ${size} screen`, () => {
      cy.viewport(size)
      cy.visit('/wallet')
      cy.get('[data-testid=app-bar]').should('be.visible')
      cy.get('[data-testid=menu-btn]').should('be.visible')
      cy.get('[data-testid=toolbar-links]').should('not.exist')
    })
  })
})
