
const sizes = [
  'ipad-mini',
  'macbook-11',
  'macbook-13',
  'macbook-15',
  'macbook-16'
]

function clear() {
  cy.clearLocalStorage()
}
describe('Algodex Rewards Desktop Layout', () => {
  beforeEach(clear)
  afterEach(clear)
  sizes.forEach((size) => {
    it(`Should render all the pages on ${size} screen`, () => {
      cy.viewport(size)
      cy.visit('/')
      cy.get('[data-testid=app-bar]').should('be.visible')
      cy.get('[data-testid=toolbar-links]').should('be.visible')
      // cy.get('[data-testid=launch-btn]').click()
      // cy.url().should('include', '/send-assets')
      // cy.location('pathname').should('eq', '/send-assets')
    })
  })
})
