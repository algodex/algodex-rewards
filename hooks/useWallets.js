import useMyAlgoConnect from './useMyAlgoConnect'
import useWalletConnect from './useWalletConnect'
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react'
import PropTypes from 'prop-types'
import algosdk from 'algosdk'

/**
 *
 * @param {Array<Wallet>} a
 * @param {Array<Wallet>} b
 * @return {Array<Wallet>}
 * @private
 */
function _mergeAddresses(a, b) {
  console.log('ab', a, b)
  if (!Array.isArray(a) || !Array.isArray(b)) {
    throw new TypeError('Must be an array of addresses!')
  }
  // eslint-disable-next-line no-undef
  const map = new Map()
  a.forEach((wallet) => map.set(wallet.address, wallet))
  b.forEach((wallet) =>
    map.set(wallet.address, { ...map.get(wallet.address), ...wallet })
  )
  return Array.from(map.values())
}
export const WalletsContext = createContext()
export function WalletsProvider({ children }) {
  const [addresses, setAddresses] = useState([])
  useEffect(() => {
    setAddresses(
      JSON.parse(localStorage.getItem('algodex_user_wallet_addresses')) || []
    )
  }, [])
  return (
    <WalletsContext.Provider value={{ addresses, setAddresses }}>
      {children}
    </WalletsContext.Provider>
  )
}
WalletsProvider.propTypes = {
  children: PropTypes.node,
}
/**
 * Use Wallets Hooks
 * @param {Object} initialState Wallet Initial State
 * @return {*}
 */
function useWallets(initialState) {
  const context = useContext(WalletsContext)
  if (context === undefined) {
    throw new Error('Must be inside of a Wallets Provider')
  }
  const [wallet, setWallet] = useState(initialState)
  //   const [activeWallet, setActiveWallet] = useState()
  const { addresses, setAddresses } = context
  console.debug({ addresses })
  // TODO: Account Info Query
  // Handle any Connection
  const handleConnect = useCallback(
    async (_addresses) => {
      console.debug('Handling Connect')
      const indexerClient = new algosdk.Indexer(
        '',
        'https://algoindexer.algoexplorerapi.io',
        443
      )
      if (_addresses.length > 0) {
        let accounts = []
        _addresses.forEach(async ({ address }) => {
          try {
            const account = await indexerClient.lookupAccountByID(address).do()
            accounts.push(account)
          } catch (error) {
            console.error(error)
          }
        })
        const mergedPrivateAddresses = _mergeAddresses(_addresses, accounts)
        console.debug({
          accounts,
          _addresses,
          addresses,
          mergedPrivateAddresses,
          // merge: _mergeAddresses(addresses, _mergeAddresses(_addresses, accounts))
        })
        updateStorage(
          _mergeAddresses(addresses, _mergeAddresses(_addresses, accounts))
        )
      }
    },
    [setAddresses, addresses]
  )

  // Handle any Disconnect
  const handleDisconnect = useCallback((_address, _addresses) => {
    console.error('Handle removing from storage', _address)
    if (_addresses.length > 1) {
      const remainder = _addresses.filter(({ address }) => address != _address)
      updateStorage(remainder)
    } else {
      localStorage.removeItem('algodex_user_wallet_addresses')
      setAddresses([])
    }
  }, [])

  // My Algo Connect/Disconnect
  const { connect: myAlgoConnect, disconnect: myAlgoDisconnect } =
    useMyAlgoConnect(handleConnect, handleDisconnect)
  // Pera Connect/Disconnect
  const { connect: peraConnect, disconnect: peraDisconnect } = useWalletConnect(
    handleConnect,
    handleDisconnect
  )

  // Fetch active wallet from local storage
  //   useEffect(() => {
  //     const res = localStorage.getItem('activeWallet')
  //     if (res && res !== activeWallet) {
  //       setActiveWallet(localStorage.getItem('activeWallet'))
  //     }
  //   }, [setActiveWallet])

  //Update storage
  const updateStorage = (_addresses) => {
    localStorage.setItem(
      'algodex_user_wallet_addresses',
      JSON.stringify(_addresses)
    )
    setAddresses(_addresses)
  }

  return {
    wallet,
    setWallet,
    addresses,
    myAlgoConnect,
    peraConnect,
    peraDisconnect,
    myAlgoDisconnect,
  }
}

export default useWallets
