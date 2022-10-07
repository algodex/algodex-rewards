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

import React, { useMemo } from 'react'
import PropTypes from 'prop-types'
import Image from 'next/image'
import { useTranslation } from 'next-i18next'

// Material UI components
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import CircularProgress from '@mui/material/CircularProgress'

// Custom Hook
import { usePriceConversionHook } from '@/hooks/usePriceConversionHook'

export const TotalRewardsCard = ({
  isConnected,
  rewards,
  vestedRewards,
  loading,
}) => {
  const { t } = useTranslation('index')
  const totalEarned = useMemo(() => {
    return rewards.reduce((a, b) => {
      return a + b.value.earnedRewardsFormatted
    }, 0)
  }, [rewards])

  const totalVested = useMemo(() => {
    return vestedRewards.reduce((a, b) => {
      return a + b.value.formattedVestedRewards
    }, 0)
  }, [vestedRewards])

  const totalUnvested = useMemo(() => {
    return totalEarned - totalVested
  }, [totalEarned, totalVested])

  const { conversionRate } = usePriceConversionHook({})

  const formatter = (amount) => {
    const count = amount.toString().split('.')[0].length
    return amount.toLocaleString(undefined, {
      minimumFractionDigits: count > 6 ? 0 : undefined,
      maximumFractionDigits: count > 6 ? 0 : undefined,
    })
  }

  return (
    <>
      <Box
        sx={{
          backgroundColor: 'secondary.dark',
          color: 'primary.contrastText',
          borderRadius: '3px',
          padding: '1rem',
          marginBlock: '1.2rem',
          border: '1px solid',
          borderColor: 'secondary.light2',
          display: 'flex',
          alignItems: 'flex-start',
        }}
      >
        <Box marginRight={'7px'} marginTop={'3px'}>
          <Image
            src={'/algo-rounded-icon.png'}
            alt="algodex_icon"
            height="16"
            width="16"
          />
        </Box>
        <Box sx={{ width: '100%' }}>
          <Typography
            variant="p"
            fontSize={'1.1rem'}
            fontWeight={600}
            data-testid={'total-rewards'}
          >
            {t('All Time Rewards')}:
          </Typography>
          <Box
            marginBottom={'0.5rem'}
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
            }}
          >
            <Typography fontSize={'0.95rem'} fontWeight={600}>
              {t('Total Earned Rewards')}:
            </Typography>

            {isConnected && (
              <Box>
                {loading ? (
                  <>
                    <CircularProgress size={'1rem'} />
                  </>
                ) : (
                  <>
                    <Typography
                      fontSize={'1rem'}
                      fontWeight={600}
                      textAlign={'right'}
                    >
                      {formatter(totalEarned || 0)} ALGX
                    </Typography>

                    <Typography
                      fontSize={'0.85rem'}
                      fontWeight={700}
                      textAlign={'right'}
                      sx={{ color: 'secondary.light' }}
                    >
                      {(totalEarned * conversionRate).toLocaleString(
                        undefined,
                        {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        }
                      )}{' '}
                      USD
                    </Typography>
                  </>
                )}
              </Box>
            )}
          </Box>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
            }}
          >
            <Typography fontSize={'0.95rem'} fontWeight={600}>
              {t('Total Unvested Rewards')}:
            </Typography>
            {isConnected ? (
              <Box>
                {loading ? (
                  <>
                    <CircularProgress size={'1rem'} />
                  </>
                ) : (
                  <>
                    <Typography
                      fontSize={'1rem'}
                      fontWeight={600}
                      textAlign={'right'}
                    >
                      {formatter(totalUnvested || 0)} ALGX
                    </Typography>

                    <Typography
                      fontSize={'0.85rem'}
                      fontWeight={700}
                      textAlign={'right'}
                      sx={{ color: 'secondary.light' }}
                    >
                      {(totalUnvested * conversionRate).toLocaleString(
                        undefined,
                        {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        }
                      )}{' '}
                      USD
                    </Typography>
                  </>
                )}
              </Box>
            ) : (
              <Typography
                fontSize={'0.85rem'}
                fontWeight={500}
                textAlign={'right'}
                sx={{
                  color: 'secondary.light',
                  width: '8rem',
                  textAlign: 'center',
                  marginTop: '-2rem',
                  marginLeft: '2.2rem',
                }}
              >
                {t('Connect a wallet to see your total rewards add up here')}
              </Typography>
            )}
          </Box>
        </Box>
      </Box>
    </>
  )
}

TotalRewardsCard.propTypes = {
  isConnected: PropTypes.bool,
  rewards: PropTypes.array,
  vestedRewards: PropTypes.array,
  loading: PropTypes.bool,
}

TotalRewardsCard.defaultProps = {
  isConnected: false,
  vestedRewards: [],
}
