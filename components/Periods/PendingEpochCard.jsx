import React, { useMemo } from 'react'
import PropTypes from 'prop-types'
import { useTranslation } from 'next-i18next'

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
import { getEpochEnd, getEpochStart } from '@/lib/getRewards'
import { DateTime } from 'luxon'

export const PendingEpochCard = ({
  isConnected,
  rewards,
  vestedRewards,
  loading,
  isMobile,
  activeWallet,
  minAmount,
}) => {
  const { t } = useTranslation('index')
  const { t: tc } = useTranslation('common')
  const getLastWeekEpoch = () => {
    const now = new Date()
    return Date.parse(
      new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7)
    )
  }

  const newReward = useMemo(() => {
    // Find a reward whose epoch is not over a week from now
    const newR = rewards.find(
      ({ value }) => getEpochEnd(value.epoch) * 1000 > getLastWeekEpoch()
    )
    return newR
  }, [rewards])

  const vestedReward = useMemo(() => {
    return vestedRewards.reduce((a, b) => {
      return a + b.value.vestedRewards
    }, 0)
  }, [vestedRewards])

  const pendingPeriod = useMemo(() => {
    if (newReward) {
      const { epoch } = newReward.value

      const start = DateTime.fromJSDate(
        new Date(getEpochStart(epoch) * 1000)
      ).toLocaleString(DateTime.DATE_MED)

      const end = DateTime.fromJSDate(
        new Date(getEpochEnd(epoch) * 1000)
      ).toLocaleString(DateTime.DATE_MED)

      return {
        date: `${start} - ${end}`,
        number: epoch,
      }
    }
    return {
      date: '--',
      number: 0,
    }
  }, [newReward])

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
                {t('Pending Period')} {pendingPeriod.number}:
              </Typography>
            </Box>
            {isConnected && (
              <Typography
                fontSize={'0.85rem'}
                fontWeight={700}
                sx={{ color: 'secondary.light' }}
              >
                {pendingPeriod.date}
              </Typography>
            )}
            <Box
              marginBottom={'0.5rem'}
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
              }}
            >
              <Typography fontSize={'0.95rem'} fontWeight={600}>
                {t('New Rewards')}:
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
                        {(
                          newReward?.value?.earnedRewards || 0
                        ).toLocaleString()}{' '}
                        ALGX
                      </Typography>
                      <Typography
                        fontSize={'0.85rem'}
                        fontWeight={700}
                        textAlign={'right'}
                        sx={{ color: 'secondary.light' }}
                      >
                        {(
                          (newReward?.value?.earnedRewards || 0) *
                          conversionRate
                        ).toLocaleString()}{' '}
                        USD
                      </Typography>
                    </>
                  )}
                </Box>
              )}
            </Box>
            <Box
              marginBottom={'2rem'}
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
              }}
            >
              <Typography fontSize={'0.95rem'} fontWeight={600}>
                {t('Vested Rewards')}:
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
                        {vestedReward.toLocaleString()} ALGX
                      </Typography>

                      <Typography
                        fontSize={'0.85rem'}
                        fontWeight={700}
                        textAlign={'right'}
                        sx={{ color: 'secondary.light' }}
                      >
                        {(vestedReward * conversionRate).toLocaleString()} USD
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
                    width: '7rem',
                    textAlign: 'center',
                    marginTop: '-2rem',
                  }}
                >
                  {t(
                    'Connect a wallet to see your pending rewards for each period'
                  )}
                </Typography>
              )}
            </Box>
          </Box>
        </Box>
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
              {tc('How are Rewards Calculated?')}
            </Typography>
          </Box>
          <Typography
            variant="p"
            fontSize={'0.8rem'}
            fontStyle={'italic'}
            marginLeft={'0.5rem'}
          >
            {tc(
              'Rewards will be paid out within two days after the end of one-week accrual periods'
            )}
          </Typography>

          {rewards.length > 0 && (
            <Box textAlign={'center'} marginTop={'1.5rem'}>
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
          )}
        </>
      </Box>

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
  loading: PropTypes.bool,
  rewards: PropTypes.array,
  vestedRewards: PropTypes.array,
  isMobile: PropTypes.bool,
  activeWallet: PropTypes.object,
  minAmount: PropTypes.number,
}

PendingEpochCard.defaultProps = {
  isConnected: false,
  rewards: [],
  vestedRewards: [],
}
