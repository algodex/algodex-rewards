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
