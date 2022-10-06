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

// PouchDB
import DB from '@/lib/db'
import { useRouter } from 'next/router'

export const RewardsAddressesContext = createContext(undefined)

export function RewardsAddressesProvider({ children }) {
  const [addresses, setAddresses] = useState([])
  const [isConnected, setIsConnected] = useState(false)
  const [activeWallet, setActiveWallet] = useState()
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
  const addressessDb = new DB('algodex_user_wallet_addresses')
  const activeWalletDb = new DB('activeWallet')
  const context = useContext(RewardsAddressesContext)
  if (context === undefined) {
    throw new Error('Must be inside of a Rewards Addresses Provider')
  }
  const {
    addresses,
    setAddresses,
    activeWallet,
    setActiveWallet,
    minAmount,
    setIsConnected,
  } = context

  const updateAddresses = useCallback((_addresses) => {
    if (_addresses == null) {
      return
    }
    updateStorage(_addresses)
  }, [])

  const removeAddress = useCallback(async (_address) => {
    const _addresses = await addressessDb.getAddresses()
    const parsedAddresses =
      _addresses.map(({ doc }) => JSON.parse(doc.wallet)) || []
    const _activeWallet = (await activeWalletDb.getAddresses())[0]?.doc
    const parsedActiveWallet = JSON.parse(_activeWallet?.wallet)
    addressessDb.removeAddress(_address)
    const remainder = parsedAddresses.filter(
      ({ address }) => address != _address
    )
    setAddresses(remainder)
    _setAddresses(remainder)
    if (_address === parsedActiveWallet?.address) {
      setActiveWallet(remainder[0])
      // activeWalletDb.removeAddress(_address)
    }
  }, [])

  const {
    setAddresses: _setAddresses,
    myAlgoConnect,
    peraConnect,
    peraDisconnect,
    myAlgoDisconnect,
  } = useWallets(updateAddresses, removeAddress)

  // Fetch saved and active wallets from storage
  useEffect(() => {
    const getDBData = async () => {
      const _addresses = await addressessDb.getAddresses()
      const _activeWallet = (await activeWalletDb.getAddresses())[0]?.doc
      const parsedAddresses =
        _addresses.map(({ doc }) => JSON.parse(doc.wallet)) || []
      setActiveWallet(_activeWallet ? JSON.parse(_activeWallet.wallet) : null)
      loadPage(parsedAddresses)
    }
    getDBData()
  }, [])

  // Get updated acount details and display on screen
  const loadPage = async (_addresses) => {
    if (_addresses) {
      setIsConnected(_addresses.length > 0 ? true : false)
      const result = await getAccountInfo(_addresses)
      setAddresses(result)
      _setAddresses(result)
      addressessDb.updateAddresses(result)
      const _activeWallet = (await activeWalletDb.getAddresses())[0]?.doc
      if (
        viewAsWallet &&
        (process.env.NEXT_PUBLIC_ENVIRONMENT === 'development' ||
          typeof window.end2end !== 'undefined')
      ) {
        loginAsAnother(viewAsWallet)
      } else if (result.length > 0 && !_activeWallet) {
        setActiveWallet(result[0])
      }
    }
  }

  // Login as another wallet
  const loginAsAnother = async (address) => {
    const result = await getAccountInfo([{ address }])
    setActiveWallet(result[0])
    setAddresses([result[0], ...addresses])
    _setAddresses([result[0], ...addresses])
    addressessDb.updateAddresses([result[0], ...addresses])
  }

  // Save active wallet when updated
  useEffect(() => {
    const updateActive = async () => {
      const address = (await activeWalletDb.getAddresses())[0]?.doc
      const _activeWallet = address ? JSON.parse(address.wallet) : null
      if (
        addresses.length > 0 &&
        activeWallet &&
        _activeWallet?.address !== activeWallet?.address
      ) {
        const result = await getAccountInfo([activeWallet])
        if (result[0]) {
          activeWalletDb.removeAddress(_activeWallet?.address)
          activeWalletDb.updateActiveWallet(result[0])
        }
      }
    }
    updateActive()
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

  // Get updated acount details and save to storage
  const updateStorage = async (_addresses) => {
    if (_addresses) {
      const DBaddresses = await addressessDb.getAddresses()
      const parsedAddresses =
        DBaddresses.map(({ doc }) => JSON.parse(doc.wallet)) || []
      setIsConnected(parsedAddresses.length > 0 ? true : false)
      const result = await getAccountInfo(_addresses)
      setAddresses(_mergeAddresses(parsedAddresses, result))
      _setAddresses(_mergeAddresses(parsedAddresses, result))
      addressessDb.updateAddresses(result)
      const _activeWallet = (await activeWalletDb.getAddresses())[0]?.doc
      if (result.length > 0 && !_activeWallet) {
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
