import useMyAlgoConnect from './useMyAlgoConnect'
import useWalletConnect from './useWalletConnect'
import { createContext, useCallback, useContext, useState } from 'react'
import PropTypes from 'prop-types'

/**
 *
 * @param {Array<Wallet>} a
 * @param {Array<Wallet>} b
 * @return {Array<Wallet>}
 * @private
 */
function _mergeAddresses(a, b) {
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
export const WalletsContext = createContext()
export function WalletsProvider({ children }) {
  const [addresses, setAddresses] = useState([])
  return (
    <WalletsContext.Provider value={[addresses, setAddresses]}>
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
function useWallets(updateAddresses, removeAddress) {
  const context = useContext(WalletsContext)
  if (context === undefined) {
    throw new Error('Must be inside of a Wallets Provider')
  }
  const [addresses, setAddresses] = context

  // TODO: Account Info Query
  // Handle any Connection
  const handleConnect = useCallback(
    async (_addresses) => {
      const accounts = []
      const mergedPrivateAddresses = _mergeAddresses(_addresses, accounts)
      console.log({
        accounts,
        _addresses,
        addresses,
        mergedPrivateAddresses,
        merge: _mergeAddresses(
          addresses,
          _mergeAddresses(_addresses, accounts)
        ),
      })
      setAddresses(
        _mergeAddresses(addresses, _mergeAddresses(_addresses, accounts))
      )
      updateAddresses(
        _mergeAddresses(addresses, _mergeAddresses(_addresses, accounts))
      )
    },
    [setAddresses, addresses]
  )

  // Handle any Disconnect
  const handleDisconnect = useCallback((_address) => {
    console.debug('Handle removing from storage', _address)
    if (_address) {
      // const _addresses = JSON.parse(
      //   localStorage.getItem('algodex_user_wallet_addresses')
      // ).filter((wallet) => wallet.address !== _address)
      // setAddresses(_addresses)
      // updateAddresses(_addresses)
      removeAddress(_address)
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

  return {
    addresses,
    setAddresses,
    myAlgoConnect,
    peraConnect,
    peraDisconnect,
    myAlgoDisconnect,
  }
}

export default useWallets
