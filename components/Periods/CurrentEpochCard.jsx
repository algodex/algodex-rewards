import React, { useMemo } from 'react'
import PropTypes from 'prop-types'
import Link from '../Nav/Link'
import { useTranslation } from 'next-i18next'

// Material UI components
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import LaunchRoundedIcon from '@mui/icons-material/LaunchRounded'
import InfoRoundedIcon from '@mui/icons-material/InfoRounded'
import CircularProgress from '@mui/material/CircularProgress'

// custom hook and libs
import { usePriceConversionHook } from '@/hooks/usePriceConversionHook'

const styles = {
  selectorContainer: {
    display: 'flex',
    alignItems: 'center',
    backgroundColor: 'secondary.light3',
    justifyContent: 'center',
    borderRadius: '3px',
    overflow: 'hidden',
    height: '28px',
  },
  selector: {
    padding: '5px 9px',
    fontSize: '0.8rem',
    fontWeight: 800,
    color: 'secondary.dark',
    cursor: 'pointer',
    minWidth: '3rem',
    textAlign: 'center',
  },
  activeSelector: {
    color: 'primary.contrastText',
    backgroundColor: 'accent.main',
  },
}

export const CurrentEpochCard = ({
  isConnected,
  rewards,
  vestedRewards,
  loading,
  activeCurrency,
  setActiveCurrency,
  completedPeriod,
}) => {
  const { t } = useTranslation('common')
  const getLastWeekEpoch = () => {
    const now = new Date()
    return Date.parse(
      new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7)
    )
  }

  const sumVestedRewards = useMemo(() => {
    return vestedRewards.reduce((a, b) => {
      return a + b.value.vestedRewards
    }, 0)
  }, [vestedRewards])

  const { conversionRate } = usePriceConversionHook({})

  const attachCurrency = (price) => {
    return `${(activeCurrency === 'ALGX'
      ? price
      : price * conversionRate
    ).toLocaleString()} ${activeCurrency}`
  }

  // console.log({ completedPeriod })
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
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Typography fontSize={'1.1rem'} fontWeight={600}>
            {t('Period')} {completedPeriod.number} {t('Complete')}:
          </Typography>

          <Box sx={styles.selectorContainer}>
            <Typography
              variant="p"
              sx={[
                styles.selector,
                activeCurrency == 'ALGX' ? styles.activeSelector : {},
              ]}
              onClick={() => {
                setActiveCurrency('ALGX')
              }}
            >
              ALGX
            </Typography>
            <Typography
              variant="p"
              sx={[
                styles.selector,
                activeCurrency == 'USD' ? styles.activeSelector : {},
              ]}
              onClick={() => {
                setActiveCurrency('USD')
              }}
            >
              USD
            </Typography>
          </Box>
        </Box>
        {isConnected && (
          <Typography
            fontSize={'0.85rem'}
            fontWeight={700}
            sx={{ color: 'secondary.light', marginBottom: '1rem' }}
          >
            {completedPeriod.date}
          </Typography>
        )}
        <Box
          marginBottom={'0.5rem'}
          marginLeft={'0.6rem'}
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Typography fontSize={'0.95rem'} fontWeight={600}>
            {t('Earned Rewards')}:
          </Typography>
          {isConnected && (
            <Typography fontSize={'1rem'} fontWeight={600}>
              {loading ? (
                <>
                  <CircularProgress size={'1rem'} />
                </>
              ) : (
                <>{attachCurrency(completedPeriod.earnedRewards || 0)}</>
              )}
            </Typography>
          )}
        </Box>
        <Box
          marginBottom={'0.5rem'}
          marginLeft={'0.6rem'}
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            color: 'secondary.light',
          }}
        >
          <Typography fontSize={'0.95rem'} fontWeight={600}>
            {t('Earned Vested')}:
          </Typography>
          {isConnected && (
            <Typography
              fontSize={'1rem'}
              fontWeight={600}
              textAlign={'right'}
              sx={{
                display: 'flex',
                alignItems: 'flex-start',
                lineHeight: '1rem',
              }}
            >
              <InfoRoundedIcon
                sx={{
                  fontSize: '1rem',
                  marginRight: '0.3rem',
                }}
              />
              {loading ? (
                <>
                  <CircularProgress size={'1rem'} />
                </>
              ) : (
                <>{attachCurrency(completedPeriod.vestedRewards || 0)}</>
              )}
            </Typography>
          )}
        </Box>
        <Box
          marginBottom={'2rem'}
          marginLeft={'0.6rem'}
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
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
                    textAlign={'right'}
                    fontWeight={600}
                  >
                    {sumVestedRewards.toLocaleString()} ALGX
                  </Typography>

                  <Typography
                    fontSize={'0.85rem'}
                    fontWeight={700}
                    textAlign={'right'}
                    sx={{ color: 'secondary.light' }}
                  >
                    {(sumVestedRewards * conversionRate).toLocaleString()} USD
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
              {t('Connect a wallet to see your current pending rewards')}
            </Typography>
          )}
        </Box>
        <>
          <Typography
            variant="p"
            fontSize={'0.8rem'}
            fontStyle={'italic'}
            marginLeft={'0.5rem'}
          >
            {t(
              'Rewards will be paid out two days after the end of one-week accrual periods'
            )}
          </Typography>

          <Box textAlign={'center'} marginTop={'1.5rem'}>
            <Link
              href="http://algoexplorer.io/"
              target={'_blanc'}
              sx={{
                textDecoration: 'none',
                fontSize: '0.8rem',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-end',
              }}
            >
              {t('View on AlgoExplorer')}
              <LaunchRoundedIcon
                sx={{
                  color: 'primary.contrastText',
                  fontSize: '0.9rem',
                  marginLeft: '0.3rem',
                }}
              />
            </Link>
          </Box>
        </>
      </Box>
    </>
  )
}

CurrentEpochCard.propTypes = {
  isConnected: PropTypes.bool,
  rewards: PropTypes.array,
  vestedRewards: PropTypes.array,
  loading: PropTypes.bool,
  completedPeriod: PropTypes.object,
}

CurrentEpochCard.defaultProps = {
  isConnected: false,
  rewards: [],
  vestedRewards: [],
  loading: true,
}
