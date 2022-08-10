import React from 'react'
import Image from 'next/image'
import PropTypes from 'prop-types'
import { useTranslation } from 'next-i18next'

// Material UI components
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'

export const ConnectWalletPrompt = ({ connectWallet }) => {
  const { t } = useTranslation('common')
  return (
    <>
      <Typography
        variant="p"
        fontWeight={700}
        fontSize="1rem"
        marginTop={'1rem'}
      >
        {t('Connect Wallet with')}:
      </Typography>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          marginBlock: '1rem',
          marginLeft: '1.5rem',
          cursor: 'pointer',
        }}
        onClick={() => connectWallet('myalgo')}
      >
        <Image
          src={'/algo-wallet.svg'}
          alt="MyAlgo Wallet"
          width="42"
          height="42"
        />
        <Typography
          variant="p"
          fontWeight={700}
          fontSize="1rem"
          marginLeft={'0.65rem'}
          sx={{ textDecoration: 'underline' }}
        >
          MyAlgo Wallet
        </Typography>
      </Box>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          marginBlock: '1rem',
          marginLeft: '1.5rem',
          cursor: 'pointer',
        }}
        onClick={() => connectWallet('pera')}
      >
        <Image
          src={'/pera-wallet.svg'}
          alt="Pera Wallet"
          width="42"
          height="42"
        />
        <Typography
          variant="p"
          fontWeight={700}
          fontSize="1rem"
          marginLeft={'0.65rem'}
          sx={{ textDecoration: 'underline' }}
        >
          Pera Wallet
        </Typography>
      </Box>
    </>
  )
}

ConnectWalletPrompt.propTypes = {
  connectWallet: PropTypes.func,
}
