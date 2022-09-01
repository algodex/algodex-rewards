import React, { useMemo } from 'react'
import PropTypes from 'prop-types'
import { useTranslation } from 'next-i18next'

// Material UI components
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import AccessTimeRoundedIcon from '@mui/icons-material/AccessTimeRounded'
import InfoRoundedIcon from '@mui/icons-material/InfoRounded'
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'

// Custom Component and hooks
import Link from '../Nav/Link'
import { WarningCard } from '../WarningCard'

export const PendingEpochCard = ({
  isConnected,
  rewards,
  pendingPeriod,
  isMobile,
  activeWallet,
  minAmount,
}) => {
  const { t } = useTranslation('index')
  const { t: tc } = useTranslation('common')

  const currentPeriod = useMemo(() => {
    // return a reward whose epoch is current.
    const newR = rewards.filter(
      ({ value: { epoch } }) => epoch >= pendingPeriod.number
    )
    return newR || []
  }, [rewards, pendingPeriod])

  const shortenAddress = ({ address }) => {
    const list = address.split('')
    const first = list.slice(0, 6)
    const last = list.slice(list.length - 6, list.length)
    return `${first.join('')}...${last.join('')}`
  }

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
          <Box sx={{ display: 'flex' }}>
            <CheckCircleOutlineIcon
              sx={{
                marginRight: '6px',
                fontSize: '1.2rem',
                marginTop: '2px',
              }}
            />
            <Box marginBottom={'2rem'}>
              <Typography fontSize={'0.8rem'} fontWeight={600}>
                Wallet {activeWallet?.address && shortenAddress(activeWallet)}{' '}
                {tc('is')} {currentPeriod.length == 0 && <>{tc('NOT')} </>}
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
              </Typography>
            </Box>
          </Box>
        ) : (
          <Typography
            fontSize={'0.85rem'}
            fontWeight={500}
            textAlign={'right'}
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
}

PendingEpochCard.defaultProps = {
  isConnected: false,
  rewards: [],
}
