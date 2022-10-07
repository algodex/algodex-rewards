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

import useWallets from '@/hooks/useWallets'
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react'
import PropTypes from 'prop-types'
import algosdk from 'algosdk'

import { useRouter } from 'next/router'
import {
  getActiveWallet,
  getAllWallets,
  storageKeys,
  updateActiveWallet,
  updateWallets,
} from '../lib/walletStorage'

export const RewardsAddressesContext = createContext(undefined)

export function RewardsAddressesProvider({ children }) {
  const [addresses, setAddresses] = useState(getAllWallets())
  const [activeWallet, setActiveWallet] = useState(getActiveWallet())
  const [isConnected, setIsConnected] = useState(false)
  const minAmount = 1000
  useEffect(() => {
    setIsConnected(addresses.length > 0 ? true : false)
  }, [addresses])

  return (
    <RewardsAddressesContext.Provider
      value={{
        addresses,
        setAddresses,
        activeWallet,
        setActiveWallet,
        minAmount,
        isConnected,
        setIsConnected,
      }}
    >
      {children}
    </RewardsAddressesContext.Provider>
  )
}
RewardsAddressesProvider.propTypes = {
  children: PropTypes.node,
}
const indexerClient = new algosdk.Indexer(
  '',
  'https://algoindexer.algoexplorerapi.io',
  443
)
/**
 * Account info from Algorand Indexer
 * @param {Wallet} wallet
 * @return {Object}
 * @private
 */
export const _getEmptyAccountInfo = (wallet) => {
  return {
    amount: 0,
    'amount-without-pending-rewards': 0,
    'apps-local-state': [],
    'apps-total-schema': { 'num-byte-slice': 0, 'num-uint': 0 },
    assets: [],
    'created-apps': [],
    'created-assets': [],
    'pending-rewards': 0,
    'reward-base': 0,
    rewards: 0,
    round: -1,
    status: 'Offline',
    ...wallet,
  }
}

export default function useRewardsAddresses() {
  const {
    query: { viewAsWallet },
  } = useRouter()
  const context = useContext(RewardsAddressesContext)
  if (context === undefined) {
    throw new Error('Must be inside of a Rewards Addresses Provider')
  }
  const { addresses, setAddresses, activeWallet, setActiveWallet, minAmount } =
    context

  const updateAddresses = useCallback((_addresses) => {
    if (_addresses == null) {
      return
    }
    updateStorage(_addresses)
  }, [])

  const removeAddress = useCallback(async (_address) => {
    const _addresses = getAllWallets()
    const _activeWallet = getActiveWallet()
    const remainder = _addresses.filter(({ address }) => address != _address)
    setAddresses(remainder)
    updateWallets(remainder)
    if (_address === _activeWallet?.address) {
      setActiveWallet(remainder[0])
    }
  }, [])

  const { myAlgoConnect, peraConnect, peraDisconnect, myAlgoDisconnect } =
    useWallets(updateAddresses, removeAddress)

  // Fetch saved and active wallets from storage
  useEffect(() => {
    getStoredData()
  }, [])

  // Get updated acount details and display on screen
  const getStoredData = async () => {
    const result =
      addresses.length > 0 ? await getAccountInfo(addresses) : addresses
    setAddresses(result)
    updateWallets(result)

    if (
      viewAsWallet &&
      !addresses.find(({ address }) => address === viewAsWallet) &&
      (process.env.NEXT_PUBLIC_ENVIRONMENT === 'development' ||
        typeof window.end2end !== 'undefined')
    ) {
      loginAsAnother(viewAsWallet)
    } else if (result.length > 0 && !activeWallet) {
      setActiveWallet(result[0])
    }
  }

  // Login as another wallet
  const loginAsAnother = async (address) => {
    const result = await getAccountInfo([{ address }])
    setActiveWallet(result[0])
    setAddresses([result[0], ...addresses])
    updateWallets([result[0], ...addresses])
  }

  // Save active wallet when updated
  useEffect(() => {
    updateActiveWallet(activeWallet)
  }, [activeWallet])

  //Get account info
  const getAccountInfo = async (_addresses) => {
    const result = await Promise.all(
      _addresses.map(async (addr) => {
        let accountInfo
        try {
          accountInfo = (
            await indexerClient
              .lookupAccountByID(addr.address)
              .includeAll(true)
              .do()
          ).account
          if (typeof accountInfo?.assets === 'undefined') {
            accountInfo.assets = []
          }
        } catch (e) {
          if (e.status !== 404) {
            throw e
          } else {
            accountInfo = _getEmptyAccountInfo(addr)
          }
        }
        return {
          ...addr,
          ...accountInfo,
        }
      })
    )
    return result
  }

  const _mergeAddresses = (a, b) => {
    if (!Array.isArray(a) || !Array.isArray(b)) {
      throw new TypeError('Must be an array of addresses!')
    }
    const map = new Map()
    a.forEach((wallet) => map.set(wallet.address, wallet))
    b.forEach((wallet) =>
      map.set(wallet.address, { ...map.get(wallet.address), ...wallet })
    )
    return Array.from(map.values())
  }

  // Get updated account info and save to storage
  const updateStorage = async (_addresses) => {
    if (_addresses) {
      const result = await getAccountInfo(_addresses)
      setAddresses(_mergeAddresses(_addresses, result))
      updateWallets(_mergeAddresses(_addresses, result))

      if (result.length > 0 && !activeWallet) {
        setActiveWallet(result[0])
      }
    }
  }

  // Handle removing from storage
  const handleDisconnect = (_address, type) => {
    if (type == 'wallet-connect') {
      peraDisconnect()
    } else {
      myAlgoDisconnect()
    }
    removeAddress(_address)
  }

  return {
    addresses,
    setAddresses,
    activeWallet,
    setActiveWallet,
    myAlgoConnect,
    peraConnect,
    minAmount,
    peraDisconnect,
    handleDisconnect,
  }
}
