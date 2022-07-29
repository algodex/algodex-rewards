import React, { useState } from 'react'
import PropTypes from 'prop-types'
import Image from 'next/image'

// Material UI components
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import Modal from '@mui/material/Modal'
import Button from '@mui/material/Button'
import TwitterIcon from '@mui/icons-material/Twitter'
import TelegramIcon from '@mui/icons-material/Telegram'
import RedditIcon from '@mui/icons-material/Reddit'

// Custom components
import { ConnectWalletPrompt } from './ConnectWalletPrompt'
import { SelectCountry } from './SelectCountry'

export const ConfirmLocationModal = ({ open, handleClose, connectWallet }) => {
  const [openSuccessModal, setOpenSuccessModal] = useState(false)
  const [openFailedModal, setOpenFailedModal] = useState(false)
  const [countryValue, setCountryValue] = useState({})

  const toggleSuccessModal = () => {
    setOpenSuccessModal(!openSuccessModal)
  }
  const toggleFailedModal = () => {
    setOpenFailedModal(!openFailedModal)
  }

  const clearandClose = () => {
    setCountryValue({})
    handleClose()
  }

  const handleConfirm = () => {
    if (countryValue.code && countryValue.code != 'US') {
      clearandClose()
      toggleSuccessModal()
    } else {
      clearandClose()
      toggleFailedModal()
    }
  }

  return (
    <>
      <Modal
        open={open}
        onClose={clearandClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        sx={{
          width: '340px',
          maxWidth: '93%',
          marginTop: '30vh',
          marginInline: 'auto',
        }}
      >
        <Box
          sx={{
            backgroundColor: 'secondary.main',
            color: 'primary.contrastText',
            borderRadius: '3px',
            padding: '1rem',
            marginBlock: '1.2rem',
            border: '1px solid',
            borderColor: 'secondary.light2',
          }}
        >
          <Typography variant="p" fontWeight={700} fontSize="1rem">
            Confirm Your Location
          </Typography>
          <hr />
          <Typography variant="p" fontWeight={500} fontSize="0.9rem">
            Algodex needs to confirm your location to comply with local
            regulations
          </Typography>
          <SelectCountry
            sx={{ marginBlock: '1.5rem' }}
            value={countryValue}
            setValue={setCountryValue}
          />
          <Button
            sx={{
              backgroundColor: 'accent.main',
              color: 'accent.contrastText',
              display: 'flex',
              margin: 'auto',
              paddingInline: '2rem',
              fontWeight: 'bold',
            }}
            onClick={handleConfirm}
            disabled={!countryValue.code}
          >
            Confirm
          </Button>
        </Box>
      </Modal>
      <Modal
        open={openSuccessModal}
        onClose={toggleSuccessModal}
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
            color: 'primary.contrastText',
            borderRadius: '3px',
            padding: '1rem',
            marginBlock: '1.2rem',
            border: '1px solid',
            borderColor: 'secondary.light2',
          }}
        >
          <Typography
            variant="p"
            fontWeight={700}
            fontSize="1.1rem"
            marginBottom={'1rem'}
          >
            Your country is supported!
          </Typography>
          <Typography
            variant="p"
            fontWeight={500}
            fontSize="1rem"
            marginBottom={'1.5rem'}
          >
            To sign up for rewards you will need to connect your wallet with a 0
            ALGO transaction. This transaction will also opt into ALGX if your
            wallet hasn&apos;t done so already.
          </Typography>
          <hr />

          <ConnectWalletPrompt
            connectWallet={(e) => {
              toggleSuccessModal()
              connectWallet(e)
            }}
            countryValue={countryValue}
          />
        </Box>
      </Modal>
      <Modal
        open={openFailedModal}
        onClose={toggleFailedModal}
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
            color: 'primary.contrastText',
            borderRadius: '3px',
            padding: '1rem',
            marginBlock: '1.2rem',
            border: '1px solid',
            borderColor: 'secondary.light2',
          }}
        >
          <Typography
            variant="p"
            fontWeight={700}
            fontSize="1.1rem"
            marginBottom={'1rem'}
          >
            Your country is not supported yet
          </Typography>
          <Typography
            variant="p"
            fontWeight={500}
            fontSize="1rem"
            marginBottom={'1.5rem'}
          >
            At this time, your country is not eligible to sign up for rewards.
            Your country may become eligible in the future. Keep an eye on our
            social channels for updates.
          </Typography>
          <hr />
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              columnGap: '0.8rem',
              marginLeft: '1rem',
              marginBottom: '1rem',
            }}
          >
            <TwitterIcon sx={{ fontSize: '1.8rem' }} />
            <a
              style={{ color: 'inherit', fontWeight: 700 }}
              href="https://twitter.com/AlgodexOfficial"
              target="_blank"
              rel="noreferrer"
            >
              @AlgodexOfficial
            </a>
          </Box>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              columnGap: '0.8rem',
              marginLeft: '1rem',
              marginBottom: '1rem',
            }}
          >
            <TelegramIcon sx={{ fontSize: '2.1rem' }} />
            <a
              style={{ color: 'inherit', fontWeight: 700 }}
              href="http://t.me/algodex"
              target="_blank"
              rel="noreferrer"
            >
              t.me/algodex
            </a>
          </Box>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              columnGap: '0.8rem',
              marginLeft: '1rem',
              marginBottom: '1rem',
            }}
          >
            <Image
              src="/discord.png"
              alt="Discord Logo"
              width="24"
              height="24"
            />
            <a
              style={{ color: 'inherit', fontWeight: 700 }}
              href="https://discord.gg/qS3Q7AqwF6"
              target="_blank"
              rel="noreferrer"
            >
              discord.gg/qS3Q7AqwF6
            </a>
          </Box>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              columnGap: '0.8rem',
              marginLeft: '1rem',
              marginBottom: '1rem',
            }}
          >
            <RedditIcon sx={{ fontSize: '1.8rem' }} />
            <a
              style={{ color: 'inherit', fontWeight: 700 }}
              href="https://www.reddit.com/r/Algodex/"
              target="_blank"
              rel="noreferrer"
            >
              r/Algodex
            </a>
          </Box>
        </Box>
      </Modal>
    </>
  )
}

ConfirmLocationModal.propTypes = {
  handleClose: PropTypes.func,
  connectWallet: PropTypes.func,
  open: PropTypes.bool,
}

ConfirmLocationModal.defaultProps = {
  open: false,
}
