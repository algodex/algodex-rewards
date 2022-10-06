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

import { useCallback, useContext, useEffect, useRef } from 'react'

import QRCodeModal from 'algorand-walletconnect-qrcode-modal'
import { WalletsContext } from './useWallets'
const ERROR = {
  FAILED_TO_INIT: 'WalletConnect Wallet failed to initialize.',
  FAILED_TO_CONNECT: 'WalletConnect Wallet failed to connect.',
}

/**
 * Use Wallet Connect query
 * @param {Function} onConnect On Connect Callback
 * @param {Function} onDisconnect On Disconnect Callback
 * @return {object}
 */
export default function useWalletConnect(onConnect, onDisconnect) {
  /**
   * Instance referenc
   */

  const { walletConnect, initWalletConnect } = useContext(WalletsContext)

  const connect = async () => {
    try {
      // Something went wrong!
      if (!walletConnect.current) {
        console.error(ERROR.FAILED_TO_INIT)
        return
      }
      // Check if connection is already established
      if (!walletConnect.current.connected) {
        console.debug('Creating Session')
        if (walletConnect.current.sessionStarted) {
          // Reinitialize wallet connect
          walletConnect.current = await initWalletConnect()
          walletConnect.current.on('connect', handleConnected)
          walletConnect.current.on('session_update', handleConnected)
          walletConnect.current.on('disconnect', handleDisconnect)
        }
        // create new session
        walletConnect.current.createSession()
        walletConnect.current.sessionStarted = true
      } else {
        // Stop and start a new session
        walletConnect.current.killSession()
        setTimeout(() => {
          walletConnect.current.createSession()
        }, 1000)
      }
    } catch (e) {
      console.error(ERROR.FAILED_TO_CONNECT, e)
    }
  }

  const disconnect = () => {
    if (walletConnect.current.connected) {
      onDisconnect(walletConnect.current.accounts[0])
      walletConnect.current.killSession()
      walletConnect.current.sessionStarted = false
    }
  }

  const handleDisconnect = useCallback(
    (err) => {
      console.debug('DISCONNECTED')
      if (err) throw err
      localStorage.removeItem('walletconnect')
      walletConnect.current.sessionStarted = false
      onDisconnect(walletConnect.current.accounts[0])
    },
    [onDisconnect, walletConnect]
  )

  const handleConnected = (err, payload) => {
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
    onConnect(_addresses)
    QRCodeModal.close()
  }
  useEffect(() => {
    // let listener;
    if (typeof walletConnect.current !== 'undefined') {
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
