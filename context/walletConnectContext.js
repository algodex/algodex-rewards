import { createContext, useEffect, useRef } from 'react'
import QRCodeModal from 'algorand-walletconnect-qrcode-modal'
import PropTypes from 'prop-types'

export const WalletConnectContext = createContext(undefined)

export function WalletConnectProvider({ children }) {

  const walletConnect = useRef()

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


  return (
    <WalletConnectContext.Provider
      value={{
        walletConnect
      }}
    >
      {children}
    </WalletConnectContext.Provider>
  )
}
WalletConnectProvider.propTypes = {
  children: PropTypes.node,
}
