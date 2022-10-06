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
