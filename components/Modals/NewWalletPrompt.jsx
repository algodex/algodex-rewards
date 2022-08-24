import React from 'react'
import { useTranslation } from 'next-i18next'
import PropTypes from 'prop-types'

// Material UI components
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import Modal from '@mui/material/Modal'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import useRewardsAddresses from '@/hooks/useRewardsAddresses'

export const NewWalletPrompt = ({ open, handleClose, address, type }) => {
  const { peraConnect, handleDisconnect } = useRewardsAddresses()
  const { t } = useTranslation('common')

  const shortenAddress = (address) => {
    const list = address.split('')
    const first = list.slice(0, 6)
    const last = list.slice(list.length - 6, list.length)
    return `${first.join('')}...${last.join('')}`
  }

  return (
    <Modal
      open={open}
      onClose={handleClose}
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
          padding: '29px 20px',
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
          {t('Active Session')}:
        </Typography>

        {address && (
          <Button
            sx={{
              backgroundColor: 'secondary.light3',
              color: 'accent.contrastText',
              display: 'flex',
              margin: 'auto',
              width: '100%',
              fontSize: '16px',
              fontWeight: 'bold',
            }}
          >
            {shortenAddress(address)}
          </Button>
        )}
        <Divider
          sx={{ borderColor: 'primary.contrastText', marginBlock: '20px' }}
        />

        <Typography
          variant="p"
          fontWeight={600}
          fontSize="1rem"
          marginBottom={'1.5rem'}
        >
          You have an active walletconnect session, do you want to disconnect
          the current session to connect another?
        </Typography>

        <Box sx={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
          <Button
            sx={{
              backgroundColor: 'accent.main',
              color: 'accent.contrastText',
              paddingInline: '2rem',
              fontWeight: 'bold',
            }}
            onClick={handleClose}
          >
            {t('Close')}
          </Button>
          <Button
            sx={{
              backgroundColor: 'accent.main',
              color: 'accent.contrastText',
              paddingInline: '2rem',
              fontWeight: 'bold',
            }}
            onClick={() => {
              handleDisconnect(address, type)
              setTimeout(() => {
                handleClose()
                peraConnect()
              }, 1000)
            }}
          >
            {t('Connect new')}
          </Button>
        </Box>
      </Box>
    </Modal>
  )
}

NewWalletPrompt.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func,
  address: PropTypes.string,
  type: PropTypes.string,
}

NewWalletPrompt.defaultProps = {
  open: false,
}
