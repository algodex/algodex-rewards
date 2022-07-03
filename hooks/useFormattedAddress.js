import { useCallback, useContext } from 'react'

//context
import { WalletsContext } from '@/hooks/useWallets'

//Custom hook
import useWallets from './useWallets'

function useFormattedAddress() {
  const { addresses, setAddresses } = useContext(WalletsContext)

  const updateAddresses = useCallback(
    (addresses) => {
      if (addresses == null) {
        return
      }
      localStorage.setItem(
        'algodex_user_wallet_addresses',
        JSON.stringify(addresses)
      )
      setAddresses(addresses)
    },
    [setAddresses]
  )

  const disConnectWallet = (address) => {
    if (addresses.length > 1) {
      const remainder = addresses.filter((addy) => addy != address)
      localStorage.setItem(
        'algodex_user_wallet_addresses',
        JSON.stringify(remainder)
      )
      setAddresses(remainder)
    } else {
      localStorage.removeItem('algodex_user_wallet_addresses')
      setAddresses([])
    }
  }

  // const { connect: connectAlgoWallet } = useMyAlgo(updateAddresses)
  const { myAlgoConnect, peraConnect } = useWallets(updateAddresses)

  return { myAlgoConnect, peraConnect, disConnectWallet }
}

export default useFormattedAddress
