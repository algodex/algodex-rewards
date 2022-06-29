import React, { useState } from 'react'
import PropTypes from 'prop-types'

// Material UI components
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import Modal from '@mui/material/Modal'
import Button from '@mui/material/Button'

// Custom components
import { ConnectWalletPrompt } from './ConnectWalletPrompt'
import { SelectCountry } from './SelectCountry'

export const ConfirmLocationModal = ({ open, handleClose }) => {
  const [openSuccessModal, setOpenSuccessModal] = useState(false)
  const [countryValue, setCountryValue] = useState({})

  const toggleSuccessModal = () => {
    setOpenSuccessModal(!openSuccessModal)
  }

  const clearandClose = () => {
    setCountryValue({})
    handleClose()
  }

  const handleConfirm = () => {
    if (countryValue.code) {
      clearandClose()
      toggleSuccessModal()
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
            color: 'secondary.contrastText',
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
            color: 'secondary.contrastText',
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
            toggleModal={toggleSuccessModal}
            countryValue={countryValue}
          />
        </Box>
      </Modal>
    </>
  )
}

ConfirmLocationModal.propTypes = {
  handleClose: PropTypes.func,
  open: PropTypes.bool,
}

ConfirmLocationModal.defaultProps = {
  open: false,
}
