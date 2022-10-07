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

export const storageKeys = {
  allWallets: 'algodex_rewards_wallets',
  activeWallet: 'activeWallet',
}

export const getAllWallets = () => {
  const list =
    typeof window !== 'undefined'
      ? localStorage.getItem(storageKeys.allWallets)
      : null
  if (list) {
    return JSON.parse(list)
  } else {
    return []
  }
}

export const getActiveWallet = () => {
  const list =
    typeof window !== 'undefined'
      ? localStorage.getItem(storageKeys.activeWallet)
      : null
  if (list) {
    return JSON.parse(list)
  } else {
    return null
  }
}

export const updateWallets = (wallets) => {
  if (wallets.length > 0) {
    localStorage.setItem(storageKeys.allWallets, JSON.stringify(wallets))
  } else {
    localStorage.removeItem(storageKeys.allWallets)
  }
}

export const updateActiveWallet = (activeWallet) => {
  if (activeWallet) {
    localStorage.setItem(
      storageKeys.activeWallet,
      JSON.stringify(activeWallet)
    )
  } else {
    localStorage.removeItem(storageKeys.activeWallet)
  }
}
