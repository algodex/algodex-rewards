import React, { useEffect, useRef, useState } from 'react'
import PropTypes from 'prop-types'

import WalletConnect from '@walletconnect/client'
import QRCodeModal from 'algorand-walletconnect-qrcode-modal'

const connector = new WalletConnect({
  bridge: 'https://bridge.walletconnect.org', // Required
  qrcodeModal: QRCodeModal,
})

// Material UI components
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import Modal from '@mui/material/Modal'

//Custom components and hooks
import { ConfirmLocationModal } from '@/components/Modals/ConfirmLocationModal'
import { ConnectWalletPrompt } from './Modals/ConnectWalletPrompt'
import useRewardsAddresses from '@/hooks/useRewardsAddresses'

export const WalletDropdown = ({ screen }) => {
  const connectorRef = useRef(connector)
  const {
    addresses,
    activeWallet,
    setActiveWallet,
    myAlgoConnect,
    peraConnect,
  } = useRewardsAddresses()
  const addressesLength = addresses.length
  // const addressesLength = 0
  const [showList, setShowList] = useState(false)
  const [openModal, setOpenModal] = useState(false)
  const [connectWalletModal, setConnectWalletModal] = useState(false)

  const addWallet = () => {
    setConnectWalletModal(!connectWalletModal)
  }

  const toggleModal = () => {
    setOpenModal(!openModal)
  }
  const shortenAddress = ({ address }) => {
    const list = address.split('')
    const first = list.slice(0, 6)
    const last = list.slice(list.length - 6, list.length)
    return `${first.join('')}...${last.join('')}`
  }

  const connectWallet = (type) => {
    if (type == 'myalgo') {
      myAlgoConnect()
    } else {
      peraConnect()
    }
  }

  useEffect(() => {
    // eslint-disable-next-line max-len
    // This useEffect is necessary because when getting the wallet from localStorage the sendCustomRequest method is undefined
    // rerunning peraConnect reAttaches the signing method to the connector.
    if (
      activeWallet?.type === 'wallet-connect' &&
      typeof activeWallet.connector.sendCustomRequest === 'undefined'
    ) {
      console.log('first')
      setActiveWallet({
        ...activeWallet,
        connector: connectorRef.current,
      })
    }
  }, [activeWallet])

  return (
    <>
      <Box
        sx={{
          backgroundColor: 'accent.main',
          color: 'accent.contrastText',
          display: 'flex',
          justifyContent: 'center',
          alignItems: `${showList ? 'baseline' : 'center'}`,
          minHeight: '2.625rem',
          borderRadius: '3px',
          padding: '1rem',
          marginBlock: '1.2rem',
          cursor: 'pointer',
        }}
        onClick={() => {
          if (addressesLength < 1) {
            toggleModal()
          } else if (screen == 'wallet') {
            addWallet()
          }
        }}
      >
        <>
          {addressesLength > 0 ? (
            <Box flex={1}>
              <>
                {screen !== 'wallet' && (
                  <>
                    {addresses
                      .slice(0, showList ? addressesLength : 1)
                      .map((addr) => (
                        <Typography
                          key={addr.address}
                          fontSize={'1.2rem'}
                          textAlign={'center'}
                          fontWeight={700}
                          marginLeft={'auto'}
                          sx={{
                            display: 'block',
                            paddingBlock: `${showList ? '0.8rem' : '0'}`,
                            borderBottom: `solid ${showList ? '1px' : '0'}`,
                            borderColor: 'accent.contrastText',
                          }}
                          onClick={() => {
                            if (activeWallet.address !== addr.address) {
                              setActiveWallet(addr)
                            }
                          }}
                        >
                          {shortenAddress(addr)}
                        </Typography>
                      ))}
                  </>
                )}
                {(showList || screen == 'wallet') && (
                  <Typography
                    fontSize={screen == 'wallet' ? '1rem' : '0.95rem'}
                    textAlign={'center'}
                    fontWeight={700}
                    marginLeft={'auto'}
                    paddingBlock={screen == 'wallet' ? 0 : '1rem'}
                    onClick={addWallet}
                  >
                    Add Another Wallet
                  </Typography>
                )}
              </>
            </Box>
          ) : (
            <Typography
              fontSize={'1rem'}
              fontWeight={700}
              flex={1}
              textAlign={'center'}
            >
              Sign Up for Rewards
            </Typography>
          )}
        </>
        {screen !== 'wallet' && (
          <ExpandMoreIcon
            sx={{
              marginLeft: 'auto',
              transform: `${showList ? 'rotate(180deg)' : '0'}`,
            }}
            onClick={() => {
              if (addressesLength > 0) {
                setShowList(!showList)
              }
            }}
          />
        )}
      </Box>
      <ConfirmLocationModal
        open={openModal}
        handleClose={toggleModal}
        connectWallet={connectWallet}
      />
      <Modal
        open={connectWalletModal}
        onClose={addWallet}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        sx={{
          width: '380px',
          maxWidth: '93%',
          marginTop: '20vh',
          marginInline: 'auto',
        }}
      >
        <Box
          sx={{
            backgroundColor: 'secondary.main',
            color: 'secondary.contrastText',
            borderRadius: '3px',
            padding: '1rem',
            marginBlock: '1.2rem',
            border: '1px solid',
            borderColor: 'secondary.light2',
          }}
        >
          <ConnectWalletPrompt
            connectWallet={(e) => {
              addWallet()
              connectWallet(e)
            }}
          />
        </Box>
      </Modal>
    </>
  )
}

WalletDropdown.propTypes = {
  screen: PropTypes.string,
}
