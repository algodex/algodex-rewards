import { useCallback, useContext, useEffect, useRef } from 'react'

import QRCodeModal from 'algorand-walletconnect-qrcode-modal'
import { WalletsContext } from './useWallets'
const ERROR = {
  FAILED_TO_INIT: 'MyAlgo Wallet failed to initialize.',
  FAILED_TO_CONNECT: 'MyAlgo Wallet failed to connect.',
}

/**
 * Use Wallet Connect query
 * @param {Function} onConnect On Connect Callback
 * @param {Function} onDisconnect On Disconnect Callback
 * @return {object}
 */
export default function useWalletConnect(onConnect, onDisconnect) {
  const {addresses} = useContext(WalletsContext)
  /**
   * Instance referenc
   */
  const walletConnect = useRef()

  const connect = async () => {
    console.debug('Connecting')
    try {
      // Something went wrong!
      if (!walletConnect.current) {
        console.error(ERROR.FAILED_TO_INIT)
        return
      }

      // Check if connection is already established
      if (!walletConnect.current.connected) {
        console.debug('Creating Session')
        // create new session
        walletConnect.current.createSession()
      } else {
        console.debug('Already Connected')
        QRCodeModal.close()
      }
      // Map the connector to the address list
      const _addresses = walletConnect.current.accounts.map((acct) => {
        console.debug(acct)
        return {
          name: 'WalletConnect',
          address: acct,
          type: 'wallet-connect',
          connector: walletConnect.current,
        }
      })
      onConnect(_addresses)
    } catch (e) {
      console.error(ERROR.FAILED_TO_CONNECT, e)
    }
  }
  const disconnect = (_address) => {
    if (walletConnect.current._connected) {
      walletConnect.current.killSession()
    }
    onDisconnect(_address, addresses)
  }

  useEffect(() => {
    const initWalletConnect = async () => {
      const WalletConnect = (await import('@walletconnect/client')).default

      walletConnect.current = new WalletConnect({
        bridge: 'https://bridge.walletconnect.org', // Required
        qrcodeModal: QRCodeModal,
      })
      walletConnect.current.connected = false
    }
    initWalletConnect()
  }, [])

  const handleDisconnect = useCallback(
    (err) => {
      console.debug('DISCONNECTED')
      if (err) throw err
      const { accounts } = walletConnect.current
      onDisconnect(accounts[0], addresses)
    },
    [onDisconnect]
  )

  const handleConnected = (err, payload) => {
    console.log({payload})
    console.debug('CONNECTED')
    if (err) {
      throw err
    }

    let accounts = []

    // Get provided accounts
    if (typeof payload !== 'undefined' && Array.isArray(payload.params)) {
      accounts = payload.params[0].accounts
    }

    // Map the connector to the address list
    const _addresses = accounts.map((acct) => ({
      type: 'wallet-connect',
      connector: walletConnect.current,
      address: acct,
    }))
    console.log('connected here')
    onConnect(_addresses)
    QRCodeModal.close()
  }
  useEffect(() => {
    console.log('listener')
    console.log(walletConnect)
    // let listener;
    if (typeof walletConnect.current !== 'undefined') {
      console.log('listener-2')
      walletConnect.current.on('connect', handleConnected)
      walletConnect.current.on('session_update', handleConnected)
      walletConnect.current.on('disconnect', handleDisconnect)
    }
    return () => {
      if (typeof walletConnect.current !== 'undefined') {
        walletConnect.current.off('connect')
        walletConnect.current.off('session_update')
        walletConnect.current.off('disconnect')
      }
    }
  }, [walletConnect.current])

  return { connect, disconnect, connector: walletConnect.current }
}
