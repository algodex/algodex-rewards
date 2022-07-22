import React from 'react'
import PropTypes from 'prop-types'

// Material UI components
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import Modal from '@mui/material/Modal'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'

export const SignUpResponse = ({
  open,
  address,
  actionStatus,
  handleClose,
}) => {
  const shortenAddress = (address) => {
    const list = address.split('')
    const first = list.slice(0, 6)
    const last = list.slice(list.length - 6, list.length)
    return `${first.join('')}...${last.join('')}`
  }

  return (
    <>
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
            Connected Address:
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
            {actionStatus.message}
          </Typography>

          <Button
            sx={{
              backgroundColor: 'accent.main',
              color: 'accent.contrastText',
              display: 'flex',
              margin: 'auto',
              paddingInline: '2rem',
              fontWeight: 'bold',
            }}
            onClick={handleClose}
          >
            {actionStatus.success ? 'View Rewards' : 'Try Again'}
          </Button>
        </Box>
      </Modal>
    </>
  )
}

SignUpResponse.propTypes = {
  open: PropTypes.bool.isRequired,
  address: PropTypes.string,
  actionStatus: PropTypes.object,
  handleClose: PropTypes.func,
}

SignUpResponse.defaultProps = {
  open: false,
}
