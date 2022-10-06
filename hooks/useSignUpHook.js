/* 
 * Algodex Rewards 
 * Copyright (C) 2022 Algodex VASP (BVI) Corp.
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

import { CheckOptinStatus } from '@/lib/getRewards'
import { signUpForRewards } from '@/lib/send_transaction'
import { useContext, useEffect, useState } from 'react'
import { WalletsContext } from './useWallets'

export const useSignUpHook = ({ setWalletSignedUp, activeWallet }) => {
  const { walletConnect } = useContext(WalletsContext)
  const [actionStatus, setActionStatus] = useState({
    message: '',
    success: false,
  })
  const [loading, setLoading] = useState(false)
  const [openModal, setOpenModal] = useState(false)
  const [optinStatus, setOptinStatus] = useState(null)

  const checkStatus = async ({ address }) => {
    if (address) {
      try {
        const res = await CheckOptinStatus(address)
        setOptinStatus(res.data?.optedIn)
      } catch (error) {
        setOptinStatus(false)
        console.error(error)
      }
    }
  }

  useEffect(() => {
    if (activeWallet) {
      checkStatus(activeWallet)
    }
  }, [activeWallet])

  const signUp = async () => {
    setLoading(true)
    const response = await signUpForRewards({
      ...activeWallet,
      connector:
        walletConnect.current?.accounts[0] == activeWallet.address
          ? walletConnect.current
          : null,
    })
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
            'You rejected the 0.00 transaction request required to sign you up for rewards',
          success: false,
        })
      } else if (
        /disconnected/.test(response) ||
        /Cannot read properties of null/.test(response)
      ) {
        setActionStatus({
          message:
            // eslint-disable-next-line max-len
            'This wallet is disconnected, kindly reconnect wallet and try again',
          success: false,
        })
      } else if (/Network mismatch between dApp and Wallet/.test(response)) {
        setActionStatus({
          message:
            // eslint-disable-next-line max-len
            'Network mismatch, wallet is connected to TestNet and dApp connected to MainNet (or vice versa)',
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
  return {
    loading,
    openModal,
    setOpenModal,
    actionStatus,
    signUp,
    optinStatus,
  }
}
