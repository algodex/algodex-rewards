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
import Button from '@mui/material/Button'
import AccessTimeRoundedIcon from '@mui/icons-material/AccessTimeRounded'
import InfoRoundedIcon from '@mui/icons-material/InfoRounded'
import ErrorOutlineOutlinedIcon from '@mui/icons-material/ErrorOutlineOutlined'
import CheckCircleOutlineRoundedIcon from '@mui/icons-material/CheckCircleOutlineRounded'

// Custom Component and hooks
import Link from '../Nav/Link'
import { WarningCard } from '../WarningCard'
import { shortenAddress } from '../../lib/helper'

export const PendingEpochCard = ({
  isConnected,
  rewards,
  pendingPeriod,
  currentlyEarning,
  isMobile,
  activeWallet,
  minAmount,
}) => {
  const { t } = useTranslation('index')
  const { t: tc } = useTranslation('common')

  return (
    <>
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
        <Box
          sx={{
            display: 'flex',
            alignItems: 'flex-start',
          }}
        >
          <AccessTimeRoundedIcon
            sx={{ marginRight: '6px', fontSize: '1.2rem', marginTop: '3px' }}
          />
          <Box sx={{ width: '100%' }}>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <Typography
                fontSize={'1.1rem'}
                fontWeight={600}
                data-testid={'pending-period'}
              >
                {t('Pending Period')} {pendingPeriod?.number}:
              </Typography>
            </Box>
            <Typography
              fontSize={'0.8rem'}
              fontWeight={700}
              sx={{ color: 'secondary.light', marginBottom: '1rem' }}
            >
              {pendingPeriod?.date}
            </Typography>
          </Box>
        </Box>
        {isConnected ? (
          <>
            {currentlyEarning?.wallet && (
              <Box sx={{ display: 'flex' }}>
                {currentlyEarning.isAccruingRewards ? (
                  <CheckCircleOutlineRoundedIcon
                    sx={{
                      marginRight: '6px',
                      fontSize: '1.2rem',
                      marginTop: '2px',
                    }}
                  />
                ) : (
                  <ErrorOutlineOutlinedIcon
                    sx={{
                      marginRight: '6px',
                      fontSize: '1.2rem',
                      marginTop: '2px',
                    }}
                  />
                )}
                <Box marginBottom={'2rem'}>
                  <Typography fontSize={'0.8rem'} fontWeight={600}>
                    Wallet{' '}
                    {activeWallet?.address && shortenAddress(activeWallet)}{' '}
                    {tc('is')}{' '}
                    {currentlyEarning.isAccruingRewards === false && (
                      <>{tc('NOT')} </>
                    )}
                    {tc(
                      // eslint-disable-next-line max-len
                      'currently earning rewards for this period. Number of rewards will be updated when they are paid out'
                    )}
                    .
                  </Typography>

                  <Typography
                    variant="p"
                    fontSize={'0.8rem'}
                    fontStyle={'italic'}
                    sx={{ color: 'secondary.light' }}
                  >
                    {tc(
                      // eslint-disable-next-line max-len
                      'Rewards will be paid out within two days after the end of one-week accrual periods'
                    )}
                    .
                  </Typography>
                </Box>
              </Box>
            )}
          </>
        ) : (
          <Typography
            fontSize={'0.85rem'}
            fontWeight={500}
            sx={{
              color: 'secondary.light',
              width: '80%',
              textAlign: 'center',
              marginBottom: '1rem',
              marginInline: 'auto',
            }}
          >
            {t('Connect a wallet to see your pending rewards for each period')}
          </Typography>
        )}
        <Box sx={{ display: 'flex' }}>
          <InfoRoundedIcon
            sx={{
              marginRight: '6px',
              fontSize: '1.2rem',
              marginTop: '2px',
            }}
          />
          <Typography
            variant="p"
            fontSize={'0.9rem'}
            fontWeight={600}
            sx={{ textDecoration: 'underline', marginBottom: '0.7rem' }}
          >
            <Link
              href="https://docs.algodex.com/rewards-program/algx-liquidity-rewards-program"
              target={'_blanc'}
            >
              {tc('How are Rewards Calculated?')}
            </Link>
          </Typography>
        </Box>
      </Box>
      {rewards.length > 0 && (
        <Box
          sx={{
            backgroundColor: 'secondary.dark',
            color: 'primary.contrastText',
            borderRadius: '3px',
            padding: '0.7rem 1rem',
            marginBlock: '1.2rem',
            border: '1px solid',
            borderColor: 'secondary.light2',
          }}
        >
          <Typography
            fontSize={'0.8rem'}
            fontWeight={700}
            marginBottom={'.3rem'}
          >
            {t('Rewards have been paid out through Period')}:{' '}
            {Math.max(...rewards.map(({ value }) => value.epoch))}
          </Typography>
          <Typography
            variant="p"
            fontSize={'0.7rem'}
            fontStyle={'italic'}
            sx={{ color: 'secondary.light' }}
          >
            {tc(
              'View breakdown of earning and vesting of ALGX from each period here'
            )}
            :
          </Typography>
          <Box textAlign={'center'} marginTop={'1rem'}>
            <Link href="/periods" sx={{ textDecoration: 'none' }}>
              <Button
                variant="outlined"
                disabled={!isConnected}
                sx={{ borderWidth: '1px' }}
              >
                {t('View Past Periods')}
              </Button>
            </Link>
          </Box>
        </Box>
      )}

      {isConnected && isMobile && activeWallet?.amount < minAmount && (
        <WarningCard
          warnings={[
            // eslint-disable-next-line max-len
            `${t('At least')} ${minAmount} ${t(
              'ALGX must be held for a wallet to vest retroactive rewards and/or earn new rewards'
            )}`,
            `${t('Plan is subject to change as necessary')}.`,
          ]}
        />
      )}
    </>
  )
}

PendingEpochCard.propTypes = {
  isConnected: PropTypes.bool,
  rewards: PropTypes.array,
  isMobile: PropTypes.bool,
  activeWallet: PropTypes.object,
  minAmount: PropTypes.number,
  pendingPeriod: PropTypes.object,
  currentlyEarning: PropTypes.object,
}

PendingEpochCard.defaultProps = {
  isConnected: false,
  rewards: [],
}
