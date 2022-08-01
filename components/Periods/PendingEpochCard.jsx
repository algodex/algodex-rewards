import React, { useMemo } from 'react'
import PropTypes from 'prop-types'

// Material UI components
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import CircularProgress from '@mui/material/CircularProgress'
import AccessTimeRoundedIcon from '@mui/icons-material/AccessTimeRounded'
import InfoRoundedIcon from '@mui/icons-material/InfoRounded'

// Custom Component and hooks
import Link from '../Nav/Link'
import { WarningCard } from '../WarningCard'
import { usePriceConversionHook } from '@/hooks/usePriceConversionHook'

export const PendingEpochCard = ({
  isConnected,
  rewards,
  loading,
  isMobile,
  activeWallet,
  minAmount,
}) => {
  const newReward = useMemo(() => {
    return rewards[0]?.value?.earnedRewards || 0
  }, [rewards])

  const vestingReward = useMemo(() => {
    return rewards[0]?.value?.earnedRewards - 0 || 0
  }, [rewards])

  const pendingPeriod = useMemo(() => {
    return rewards[0]?.value?.epoch || 0
  }, [rewards])

  const { conversionRate } = usePriceConversionHook({})

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
              <Typography fontSize={'1.1rem'} fontWeight={600}>
                Pending Period {pendingPeriod}:
              </Typography>

              {!isConnected && (
                <Typography fontSize={'0.95rem'} fontStyle={'italic'}>
                  Connect Wallet
                </Typography>
              )}
            </Box>
            {isConnected && (
              <>
                <Typography
                  fontSize={'0.85rem'}
                  fontWeight={700}
                  sx={{ color: 'secondary.light' }}
                >
                  June 06, 2022 - June 20, 2022
                </Typography>
                <Box
                  marginBottom={'0.5rem'}
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                  }}
                >
                  <Typography fontSize={'0.95rem'} fontWeight={600}>
                    New Rewards:
                  </Typography>
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
                          {newReward.toLocaleString()} ALGX
                        </Typography>
                        <Typography
                          fontSize={'0.85rem'}
                          fontWeight={700}
                          textAlign={'right'}
                          sx={{ color: 'secondary.light' }}
                        >
                          {(newReward * conversionRate).toLocaleString()} USD
                        </Typography>{' '}
                      </>
                    )}
                  </Box>
                </Box>
                <Box
                  marginBottom={'2rem'}
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                  }}
                >
                  <Typography fontSize={'0.95rem'} fontWeight={600}>
                    Vesting Rewards:
                  </Typography>
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
                          {vestingReward.toLocaleString()} ALGX
                        </Typography>

                        <Typography
                          fontSize={'0.85rem'}
                          fontWeight={700}
                          textAlign={'right'}
                          sx={{ color: 'secondary.light' }}
                        >
                          {(vestingReward * conversionRate).toLocaleString()}{' '}
                          USD
                        </Typography>
                      </>
                    )}
                  </Box>
                </Box>
              </>
            )}
          </Box>
        </Box>
        {isConnected && (
          <>
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
                How are Rewards Calculated?
              </Typography>
            </Box>
            <Typography
              variant="p"
              fontSize={'0.8rem'}
              fontStyle={'italic'}
              marginLeft={'0.5rem'}
            >
              Rewards will be paid out within two days after the end of one-week
              accrual periods
            </Typography>

            <Box textAlign={'center'} marginTop={'1.5rem'}>
              <Link href="/periods" sx={{ textDecoration: 'none' }}>
                <Button variant="outlined">View Past Periods</Button>
              </Link>
            </Box>
          </>
        )}
      </Box>

      {isConnected && isMobile && activeWallet?.amount < minAmount && (
        <WarningCard
          warnings={[
            // eslint-disable-next-line max-len
            `At least ${minAmount} ALGX must be held for a wallet to vest retroactive rewards and/or earn new rewards.`,
            'Plan is subject to change as nessesary.',
          ]}
        />
      )}
    </>
  )
}

PendingEpochCard.propTypes = {
  isConnected: PropTypes.bool,
  loading: PropTypes.bool,
  rewards: PropTypes.array,
  isMobile: PropTypes.bool,
  activeWallet: PropTypes.object,
  minAmount: PropTypes.number,
}

PendingEpochCard.defaultProps = {
  isConnected: false,
  rewards: [],
}
