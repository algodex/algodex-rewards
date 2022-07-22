import { signUpForRewards } from '@/lib/send_transaction'
import { useState } from 'react'

export const useSignUpHook = ({ setWalletSignedUp, activeWallet }) => {
  const [actionStatus, setActionStatus] = useState({
    message: '',
    success: false,
  })
  const [loading, setLoading] = useState(false)
  const [openModal, setOpenModal] = useState(false)

  const signUp = async () => {
    setLoading(true)
    const response = await signUpForRewards(activeWallet)
    setLoading(false)
    console.debug(response)
    if (response instanceof Error) {
      if (
        /Transaction Request Rejected: The User has rejected the transaction request/.test(
          response
        )
      ) {
        setActionStatus({
          message:
            'You rejected the 0.00 transaction request required to sign you up for reward',
          success: false,
        })
      } else if (
        /disconnected/.test(response) ||
        /connector.sendCustomRequest is not a function/.test(response)
      ) {
        setActionStatus({
          message:
            'This wallet is disconnected, please kindly reconnect wallet and try again',
          success: false,
        })
      } else if (/overspend/.test(response)) {
        setActionStatus({
          message:
            'This transaction request failed, requires a 0.01 Algo network fee.',
          success: false,
        })
      } else if (
        /PopupOpenError|blocked|Can not open popup window/.test(response)
      ) {
        setActionStatus({
          message:
            'Please disable your popup blocker (likely in the top-right of your browser window)',
          success: false,
        })
      } else {
        setActionStatus({
          message: 'Sorry, an error occurred',
          success: false,
        })
      }
    } else {
      setWalletSignedUp(true)
      setActionStatus({
        message:
          // eslint-disable-next-line max-len
          'This wallet was successfully connected and is signed up for rewards! Continue to view your rewards in the app.',
        success: true,
      })
    }
    setOpenModal(true)
  }
  return { loading, openModal, setOpenModal, actionStatus, signUp }
}
