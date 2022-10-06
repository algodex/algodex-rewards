/* 
 * Algodex Rewards 
 * Copyright (C) 2021-2022 Algodex VASP (BVI) Corp.
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published
 * by the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.

 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

const sizes = [
  'ipad-mini',
  'macbook-11',
  'macbook-13',
  'macbook-15',
  'macbook-16',
]

function clear() {
  cy.clearLocalStorage()
}
describe('Algodex Rewards Desktop Layout', () => {
  beforeEach(clear)
  afterEach(clear)
  sizes.forEach((size) => {
    it(`Should render home page on ${size} screen`, () => {
      cy.viewport(size)
      cy.visit('/')
      cy.get('[data-testid=app-bar]').should('be.visible')
      cy.get('[data-testid=toolbar-links]').should('be.visible')
      cy.get('[data-testid=pending-period]').should('be.visible')
      cy.get('[data-testid=total-rewards]').should('be.visible')
    })

    it(`Should render chart page on ${size} screen`, () => {
      cy.viewport(size)
      cy.get('[data-testid=chart-link]').click()
      cy.get('[data-testid=app-bar]').should('be.visible')
      cy.get('[data-testid=toolbar-links]').should('be.visible')
      cy.location('pathname').should('eq', '/chart')
      cy.get('[data-testid=earnings-overtime]').should('be.visible')
    })

    it(`Should render period page on ${size} screen`, () => {
      cy.viewport(size)
      cy.get('[data-testid=period-link]').click()
      cy.get('[data-testid=app-bar]').should('be.visible')
      cy.get('[data-testid=toolbar-links]').should('be.visible')
      cy.location('pathname').should('eq', '/periods')
    })

    it(`Should render wallet page on ${size} screen`, () => {
      cy.viewport(size)
      cy.get('[data-testid=wallet-link]').click()
      cy.get('[data-testid=app-bar]').should('be.visible')
      cy.get('[data-testid=toolbar-links]').should('be.visible')
      cy.location('pathname').should('eq', '/wallet')
      cy.get('[data-testid=return-home]').should('be.visible')
    })
  })
})
