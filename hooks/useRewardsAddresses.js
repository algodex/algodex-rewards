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

export const RewardsAddressesContext = createContext(undefined)

export function RewardsAddressesProvider({ children }) {
  const [formattedAddresses, setFormattedAddresses] = useState([])
  const [addresses, setAddresses] = useState([])
  const [activeWallet, setActiveWallet] = useState()

  return (
    <RewardsAddressesContext.Provider
      value={{
        addresses,
        setAddresses,
        formattedAddresses,
        setFormattedAddresses,
        activeWallet,
        setActiveWallet,
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
const _getEmptyAccountInfo = (wallet) => {
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
  const context = useContext(RewardsAddressesContext)
  if (context === undefined) {
    throw new Error('Must be inside of a Rewards Addresses Provider')
  }
  const {
    formattedAddresses,
    addresses,
    setAddresses,
    activeWallet,
    setActiveWallet,
  } = context
  const {
    addresses: _addresses,
    myAlgoConnect,
    peraConnect,
    peraDisconnect,
    myAlgoDisconnect,
  } = useWallets()

  // Fetch saved and active wallets from storage
  useEffect(() => {
    const _activeWallet = localStorage.getItem('activeWallet')
    const _addresses =
      JSON.parse(localStorage.getItem('algodex_user_wallet_addresses')) || []
    setAddresses(_addresses)
    setActiveWallet(_activeWallet)
    if (_addresses.length > 0) {
      updateStorage(_addresses, _activeWallet)
    }
  }, [])

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

  // handle storing to storage
  const updateStorage = async (_addresses, _activeWallet) => {
    const result = await getAccountInfo(_addresses)
    console.log({ result })
    console.log({ activeWallet })
    if (_activeWallet) {
      const active = _addresses.find(({ address }) => address == _activeWallet)
      let _formattedAddresses = [
        active,
        ...result.filter(({ address }) => address !== _activeWallet),
      ]
      setAddresses(_formattedAddresses)
      setActiveWallet(_activeWallet)
      localStorage.setItem(
        'algodex_user_wallet_addresses',
        JSON.stringify(_formattedAddresses)
      )
      localStorage.setItem('activeWallet', _activeWallet)
    } else {
      setAddresses(result)
      localStorage.setItem(
        'algodex_user_wallet_addresses',
        JSON.stringify(result)
      )
      if (result.length > 0) {
        setActiveWallet(result[0].address)
        localStorage.setItem('activeWallet', result[0].address)
      }
    }
  }

  useEffect(() => {
    const __addresses = _addresses.filter((addy) => addy.address)
    console.log({ _addresses })
    if (__addresses.length > 0) {
      if (addresses.length > 0) {
        let finalArray = [...addresses]
        for (let index = 0; index < __addresses.length; index++) {
          const newAddr = __addresses[index]
          const found = addresses.find(
            ({ address }) => address == newAddr.address
          )
          if (!found) {
            finalArray.push(newAddr)
          }
        }
        updateStorage(finalArray, activeWallet)
      } else {
        updateStorage(__addresses, activeWallet)
      }
    }
  }, [_addresses])

  // Handle removing from storage
  const handleDisconnect = useCallback((_address, type, _addresses) => {
    if (type == 'wallet-connect') {
      peraDisconnect(_address)
    } else {
      myAlgoDisconnect(_address)
    }
    if (_addresses.length > 1) {
      const remainder = _addresses.filter(({ address }) => address != _address)
      console.log({ remainder })
      if (_address == activeWallet) {
        updateStorage(remainder, remainder[0].address)
      } else {
        updateStorage(remainder, activeWallet)
      }
    } else {
      localStorage.removeItem('algodex_user_wallet_addresses')
      localStorage.removeItem('activeWallet')
      setAddresses([])
      setActiveWallet()
    }
  }, [])

  return {
    formattedAddresses,
    addresses,
    setAddresses,
    activeWallet,
    setActiveWallet,
    myAlgoConnect,
    peraConnect,
    handleDisconnect,
  }
}
