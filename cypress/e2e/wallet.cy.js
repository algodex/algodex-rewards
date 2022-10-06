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
    cy.get('[data-testid=addr-summary]').click({ multiple: true })
    cy.get('[data-testid=balance]').should('be.visible')
    cy.get('[data-testid=disconnect]').should('be.visible')
    cy.fixture('wallet').then(function (walletData) {
      cy.get('[data-testid=addr]').contains(
        shortenAddress({ address: walletData.address })
      )
    })
  })
})
