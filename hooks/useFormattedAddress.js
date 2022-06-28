import { useCallback, useContext } from 'react'
import useMyAlgo from './use-my-algo'

//context
import { WalletContext } from 'contexts/WalletContext'

function useFormattedAddress() {
  const {setFormattedAddresses} = useContext(WalletContext)

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

  const { connect: connectAlgoWallet } = useMyAlgo(updateAddresses)

  return { connectAlgoWallet }
}

export default useFormattedAddress
