import React, { useState, createContext, useEffect } from 'react'

export const WalletContext = createContext('')
const AppContext = ({ children }) => {
  const [formattedAddresses, setFormattedAddresses] = useState([])

  useEffect(() => {
    setFormattedAddresses(
      JSON.parse(localStorage.getItem('algodex_user_wallet_addresses')) || []
    )
  }, [])

  return (
    <WalletContext.Provider value={{formattedAddresses, setFormattedAddresses}}>
      {children}
    </WalletContext.Provider>
  )
}
export default AppContext
