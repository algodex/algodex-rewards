import React, { useEffect, useMemo, useRef, useState } from 'react'
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
import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import Tooltip from '@mui/material/Tooltip'

//Custom components and hooks
import { ConfirmLocationModal } from '@/components/Modals/ConfirmLocationModal'
import { ConnectWalletPrompt } from './Modals/ConnectWalletPrompt'
import useRewardsAddresses from '@/hooks/useRewardsAddresses'
import { NewWalletPrompt } from './Modals/NewWalletPrompt'

export const WalletDropdown = ({ screen, sx, fontSize }) => {
  const dropdownRef = useRef(null)
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
  const [newWalletPrompt, setNewWalletPrompt] = useState(false)
  const [connectWalletModal, setConnectWalletModal] = useState(false)
  const [tooltiptext, setTooltiptext] = useState('Click to Copy')
  const [addressToDisconnect, setAddressToDisconnect] = useState()

  const formattedAddresses = useMemo(() => {
    const copy = [...addresses]
    if (activeWallet) {
      const index = copy.findIndex(
        (wallet) => wallet?.address == activeWallet.address
      )
      if (index >= 0) {
        copy.splice(index, 1)
      }
      copy.unshift(activeWallet)
    }
    return copy
  }, [addresses, activeWallet])

  const toggleWalletModal = () => {
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
      // Check if connection is already established
      if (!connectorRef.current.connected) {
        peraConnect()
      } else {
        console.log(connectorRef.current)
        setNewWalletPrompt(true)
        setAddressToDisconnect(connectorRef.current._accounts[0])
      }
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
      setActiveWallet({
        ...activeWallet,
        connector: connectorRef.current,
      })
    }
  }, [activeWallet])

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setShowList(false)
    }
  }

  useEffect(() => {
    document.addEventListener('click', handleClickOutside, true)
    return () => {
      document.removeEventListener('click', handleClickOutside, true)
    }
  }, [])

  const copyAddress = (address) => {
    document.querySelector('.copyToClipboard')
    navigator.clipboard.writeText(address)
    setTooltiptext(`Copied: ${address}`)
    setTimeout(() => {
      setTooltiptext('Click to Copy')
    }, 500)
  }

  return (
    <>
      <Box
        ref={dropdownRef}
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
          ...sx,
        }}
        onClick={() => {
          if (addressesLength < 1) {
            toggleModal()
          } else if (screen == 'wallet') {
            toggleWalletModal()
          } else {
            setShowList(!showList)
          }
        }}
      >
        <>
          {addressesLength > 0 ? (
            <Box flex={1}>
              <>
                {screen !== 'wallet' && (
                  <>
                    {formattedAddresses
                      .slice(0, showList ? addressesLength : 1)
                      .map((addr) => (
                        <Box
                          key={addr.address}
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            borderBottom: `solid ${showList ? '1px' : '0'}`,
                            borderColor: 'accent.contrastText',
                          }}
                        >
                          <Tooltip
                            title={tooltiptext}
                            placement="top"
                            arrow
                            sx={{
                              cursor: 'pointer',
                              marginLeft: '0.5rem',
                            }}
                          >
                            <ContentCopyIcon
                              sx={{
                                marginRight: '0.4rem',
                                fontSize: '0.9rem',
                                opacity: 0.7,
                                transition: 'all .3s ease',
                                ['&:hover']: {
                                  opacity: 1,
                                },
                                ['@media(max-width:600px)']: {
                                  fontSize: '1.5rem',
                                },
                              }}
                              onClick={(e) => {
                                copyAddress(addr.address)
                                e.stopPropagation()
                              }}
                            />
                          </Tooltip>
                          <Typography
                            fontSize={fontSize || '1.2rem'}
                            textAlign={'center'}
                            fontWeight={700}
                            marginInline={'auto'}
                            sx={{
                              display: 'block',
                              paddingBlock: `${showList ? '0.8rem' : '0'}`,
                            }}
                            onClick={() => {
                              if (activeWallet?.address !== addr.address) {
                                setActiveWallet(addr)
                              }
                            }}
                          >
                            {shortenAddress(addr)}
                          </Typography>
                        </Box>
                      ))}
                  </>
                )}
                {(showList || screen == 'wallet') && (
                  <Typography
                    fontSize={screen == 'wallet' ? '1rem' : '0.95rem'}
                    textAlign={'center'}
                    fontWeight={700}
                    // marginLeft={'auto'}
                    paddingBlock={screen == 'wallet' ? 0 : '1rem'}
                    onClick={toggleWalletModal}
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
              Connect Wallet
            </Typography>
          )}
        </>
        {screen !== 'wallet' && (
          <ExpandMoreIcon
            sx={{
              marginLeft: 'auto',
              transform: `${showList ? 'rotate(180deg)' : '0'}`,
            }}
          />
        )}
      </Box>
      <ConfirmLocationModal
        open={openModal}
        handleClose={toggleModal}
        connectWallet={connectWallet}
      />
      <NewWalletPrompt
        open={newWalletPrompt}
        handleClose={() => setNewWalletPrompt(false)}
        address={addressToDisconnect}
        type={'walletconnect'}
      />
      <Modal
        open={connectWalletModal}
        onClose={toggleWalletModal}
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
              toggleWalletModal()
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
  sx: PropTypes.object,
  fontSize: PropTypes.string,
}
