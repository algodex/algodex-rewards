import { useCallback, useContext } from 'react'
import useMyAlgo from './use-my-algo'

//context
import { WalletContext } from 'contexts/WalletContext'

function useFormattedAddress() {
  const { formattedAddresses, setFormattedAddresses } =
    useContext(WalletContext)

  const updateAddresses = useCallback(
    (addresses) => {
      if (addresses == null) {
        return
      }
      localStorage.setItem(
        'algodex_user_wallet_addresses',
        JSON.stringify(addresses)
      )
      setFormattedAddresses(addresses)
    },
    [setFormattedAddresses]
  )

  const disConnectWallet = (address) => {
    if (formattedAddresses.length > 1) {
      const remainder = formattedAddresses.filter((addy) => addy != address)
      localStorage.setItem(
        'algodex_user_wallet_addresses',
        JSON.stringify(remainder)
      )
      setFormattedAddresses(remainder)
    } else {
      localStorage.removeItem('algodex_user_wallet_addresses')
      setFormattedAddresses([])
    }
  }

  const { connect: connectAlgoWallet } = useMyAlgo(updateAddresses)

  return { connectAlgoWallet, disConnectWallet }
}

export default useFormattedAddress
