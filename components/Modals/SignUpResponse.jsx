/* 
 * Algodex Rewards 
 * Copyright (C) 2021-2022 Algodex VASP (BVI) Corp.
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
import PropTypes from 'prop-types'
import { useTranslation } from 'next-i18next'

// Material UI components
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import Modal from '@mui/material/Modal'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import { shortenAddress } from '../../lib/helper'

export const SignUpResponse = ({
  open,
  address,
  actionStatus,
  handleClose,
}) => {
  const { t } = useTranslation('common')

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
            {t('Connected Address')}:
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
              {shortenAddress({address})}
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
            {actionStatus.success
              ? `${t('View Rewards')}`
              : `${t('Try Again')}`}
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
