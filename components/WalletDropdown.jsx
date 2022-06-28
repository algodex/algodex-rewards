import React, { useContext, useState } from 'react'

// Material UI components
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import Modal from '@mui/material/Modal'

//Custom components
import { ConfirmLocationModal } from '@/components/Modals/ConfirmLocationModal'

//Custom hooks
import { ConnectWalletPrompt } from './Modals/ConnectWalletPrompt'


//context api
import { WalletContext } from 'contexts/WalletContext'

export const WalletDropdown = () => {
  const {formattedAddresses} = useContext(WalletContext)
  const formattedAddressesLength = formattedAddresses.length
  // const formattedAddressesLength = 0
  const [showList, setShowList] = useState(false)
  const [openModal, setOpenModal] = useState(false)
  const [connectWalletModal, setConnectWalletModal] = useState(false)
  

  const addWallet = () => {
    setConnectWalletModal(!connectWalletModal)
  }

  const toggleModal = () => {
    setOpenModal(!openModal)
  }
  const shortenAddress = (address) => {
    const list = address.split('')
    const first = list.slice(0, 6)
    const last = list.slice(list.length - 6, list.length)
    return `${first.join('')}...${last.join('')}`
  }

  return (
    <>
      <Box
        sx={{
          backgroundColor: 'accent.main',
          color: 'accent.contrastText',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '2.625rem',
          borderRadius: '3px',
          padding: '1rem',
          marginBlock: '1.2rem',
          cursor: 'pointer',
        }}
        onClick={() => {
          if (formattedAddressesLength < 1) {
            toggleModal()
          }
        }}
      >
        <>
          {formattedAddressesLength > 0 ? (
            <Box flex={1}>
              <>
                {formattedAddresses
                  .slice(0, showList ? formattedAddressesLength : 1)
                  .map((address) => (
                    <Typography
                      key={address}
                      fontSize={'1rem'}
                      textAlign={'center'}
                      fontWeight={700}
                      marginLeft={'auto'}
                      sx={{
                        display: 'block',
                        paddingBlock: `${showList ? '1rem' : '0'}`,
                        borderBottom: `solid ${showList ? '1px' : '0'}`,
                        borderColor: 'accent.contrastText',
                      }}
                    >
                      {shortenAddress(address)}
                    </Typography>
                  ))}
                {showList && (
                  <Typography
                    fontSize={'0.85rem'}
                    textAlign={'center'}
                    fontWeight={700}
                    marginLeft={'auto'}
                    paddingBlock={'1rem'}
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
        <ExpandMoreIcon
          sx={{ marginLeft: 'auto' }}
          onClick={() => {
            if (formattedAddressesLength > 0) {
              setShowList(!showList)
            }
          }}
        />
      </Box>
      <ConfirmLocationModal open={openModal} handleClose={toggleModal} />
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
          <ConnectWalletPrompt toggleModal={addWallet} />
        </Box>
      </Modal>
    </>
  )
}
