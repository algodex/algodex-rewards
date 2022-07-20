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
// import DB from '@/lib/db'

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
  // const addressessDb = new DB('algodex_user_wallet_addresses')
  // const activeWalletDb = new DB('activeWallet')
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

  const updateAddresses = useCallback((_addresses) => {
    if (_addresses == null) {
      return
    }
    updateStorage(_addresses, activeWallet)
  }, [])

  const {
    setAddresses: _setAddresses,
    myAlgoConnect,
    peraConnect,
    peraDisconnect,
    myAlgoDisconnect,
  } = useWallets(updateAddresses)

  // Fetch saved and active wallets from storage
  useEffect(() => {
    const getDBData = async () => {
      // const _addresses = await addressessDb.getAddresses()
      // const _activeWallet = await activeWalletDb.getActiveWallet()
      const _addresses =
        JSON.parse(localStorage.getItem('algodex_user_wallet_addresses')) || []
      const _activeWallet = JSON.parse(localStorage.getItem('activeWallet'))
      console.log({ _addresses })
      setAddresses(_addresses)
      if (_addresses.length > 0) {
        setActiveWallet(_activeWallet)
        updateStorage(_addresses, _activeWallet)
      }
    }
    getDBData()
  }, [])

  //save active wallet when updated
  useEffect(() => {
    const updateActive = async () => {
      const _activeWallet = JSON.parse(localStorage.getItem('activeWallet'))
      // const _activeWallet = await activeWalletDb.getActiveWallet()
      if (
        addresses.length > 0 &&
        _activeWallet?.address !== activeWallet?.address
      ) {
        updateStorage(addresses, activeWallet)
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

  // Handle storage
  const updateStorage = async (_addresses, _activeWallet) => {
    const result = await getAccountInfo(_addresses)
    if (_activeWallet?.address) {
      const active = _addresses.find(
        ({ address }) => address == _activeWallet?.address
      )
      let _formattedAddresses = [
        active,
        ...result.filter(({ address }) => address !== _activeWallet?.address),
      ]
      setAddresses(_formattedAddresses)
      _setAddresses(_formattedAddresses)
      setActiveWallet(_activeWallet)
      localStorage.setItem(
        'algodex_user_wallet_addresses',
        JSON.stringify(_formattedAddresses)
      )
      localStorage.setItem('activeWallet', JSON.stringify(_activeWallet))
      // _formattedAddresses.forEach((address) => {
      //   addressessDb.updateAddresses(address)
      // })
      // activeWalletDb.updateAddresses(_activeWallet)
    } else {
      setAddresses(result)
      _setAddresses(result)
      localStorage.setItem(
        'algodex_user_wallet_addresses',
        JSON.stringify(result)
      )
      setActiveWallet(result[0])
      localStorage.setItem('activeWallet', JSON.stringify(result[0]))
      // if (result.length > 0) {
      //   result.forEach((address) => {
      //     const update = async () => {
      //       await addressessDb.updateAddresses(address)
      //     }
      //     update()
      //   })
      // }
      // activeWalletDb.updateAddresses(result[0])
    }
  }

  // Handle removing from storage
  const handleDisconnect = (_address, type) => {
    if (type == 'wallet-connect') {
      peraDisconnect(type)
    } else {
      myAlgoDisconnect(_address)
    }
    if (addresses.length > 1) {
      const remainder = addresses.filter(({ address }) => address != _address)
      _setAddresses(remainder)
      if (_address == activeWallet?.address) {
        updateStorage(remainder, remainder[0].address)
      } else {
        updateStorage(remainder, activeWallet)
      }
    } else {
      // addressessDb.removeAddresses()
      // activeWalletDb.removeActiveWallet()
      localStorage.removeItem('algodex_user_wallet_addresses')
      localStorage.removeItem('activeWallet')
      setAddresses([])
      _setAddresses([])
      setActiveWallet()
    }
  }

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
