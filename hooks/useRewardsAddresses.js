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

export const RewardsAddressesContext = createContext(undefined)

export function RewardsAddressesProvider({ children }) {
  const [addresses, setAddresses] = useState([])
  const [activeWallet, setActiveWallet] = useState()

  return (
    <RewardsAddressesContext.Provider
      value={{
        addresses,
        setAddresses,
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
  const addressessDb = new DB('algodex_user_wallet_addresses')
  const activeWalletDb = new DB('activeWallet')
  const context = useContext(RewardsAddressesContext)
  const minAmount = 1000
  if (context === undefined) {
    throw new Error('Must be inside of a Rewards Addresses Provider')
  }
  const { addresses, setAddresses, activeWallet, setActiveWallet } = context

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

    console.log({ _address })
    console.log({ parsedAddresses })
    console.log({ _activeWallet })
    // addressessDb.removeAddress(_address)
    if (parsedAddresses.length > 1) {
      const remainder = parsedAddresses.filter(
        ({ address }) => address != _address
      )
      setAddresses(remainder)
      _setAddresses(remainder)
      console.log({ remainder })
      if (_address == _activeWallet?.address) {
        setActiveWallet(remainder[0].address)
      }
    } else {
      // activeWalletDb.removeAddress(_address)
      setAddresses([])
      _setAddresses([])
      setActiveWallet()
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
      console.log({ _activeWallet })
      const parsedAddresses =
        _addresses.map(({ doc }) => JSON.parse(doc.wallet)) || []
      console.log({ parsedAddresses })
      setActiveWallet(_activeWallet ? JSON.parse(_activeWallet.wallet) : null)
      updateStorage(parsedAddresses)
    }
    getDBData()
  }, [])

  // Save active wallet when updated
  useEffect(() => {
    const updateActive = async () => {
      const address = (await activeWalletDb.getAddresses())[0]?.doc
      const _activeWallet = address ? JSON.parse(address.wallet) : null
      if (
        addresses.length > 0 &&
        _activeWallet?.address !== activeWallet?.address
      ) {
        console.log('\'count\'')

        const result = await getAccountInfo([activeWallet])
        activeWalletDb.updateActiveWallet(result[0])
        // activeWalletDb.updateActiveWallet(activeWallet)
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

  // Get updated acount details and safe to storage
  const updateStorage = async (_addresses) => {
    const result = await getAccountInfo(_addresses)
    // const result = _addresses
    setAddresses(result)
    _setAddresses(result)
    addressessDb.updateAddresses(result)
    if (addresses.length > 0 && !activeWallet) {
      setActiveWallet(result[0])
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
    handleDisconnect,
  }
}
