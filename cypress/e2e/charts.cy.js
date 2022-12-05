/* 
 * Algodex Rewards 
 * Copyright (C) 2022 Algodex VASP (BVI) Corp.
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

describe('Algodex Rewards Chart ', () => {
  beforeEach(clear)
  afterEach(clear)

  it('Should render assets table with data', () => {
    cy.fixture('wallet').then(function (walletData) {
      this.walletData = walletData
      cy.visit(`/chart?viewAsWallet=${walletData.address}`)
    })

    cy.get('[data-testid=chart]').should('be.visible')
    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.wait(4000)
    cy.get('[data-testid=column-asset-USDC]').contains('USDC')
    cy.get('[data-testid=column-asset-goBTC]').contains('goBTC')
  })
})
