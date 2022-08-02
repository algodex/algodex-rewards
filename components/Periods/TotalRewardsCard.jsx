import React, { useMemo } from 'react'
import PropTypes from 'prop-types'
import Image from 'next/image'

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
  const totalEarned = useMemo(() => {
    return rewards.reduce((a, b) => {
      return a + b.value.earnedRewards
    }, 0)
  }, [rewards])

  const totalVested = useMemo(() => {
    return vestedRewards.reduce((a, b) => {
      return a + b.value.vestedRewards
    }, 0)
  }, [vestedRewards])

  const totalUnvested = useMemo(() => {
    return totalEarned - totalVested
  }, [totalEarned, totalVested])

  const { conversionRate } = usePriceConversionHook({})

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
          <Typography variant="p" fontSize={'1.1rem'} fontWeight={600}>
            Total Rewards Earned:
          </Typography>
          <Box
            marginBottom={'0.5rem'}
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
            }}
          >
            <Typography fontSize={'0.95rem'} fontWeight={600}>
              Total Earned Rewards:
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
                      {totalEarned.toLocaleString()} ALGX
                    </Typography>

                    <Typography
                      fontSize={'0.85rem'}
                      fontWeight={700}
                      textAlign={'right'}
                      sx={{ color: 'secondary.light' }}
                    >
                      {(totalEarned * conversionRate).toLocaleString()} USD
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
              Total Unvested Rewards:
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
                      {totalUnvested.toLocaleString()} ALGX
                    </Typography>

                    <Typography
                      fontSize={'0.85rem'}
                      fontWeight={700}
                      textAlign={'right'}
                      sx={{ color: 'secondary.light' }}
                    >
                      {(totalUnvested * conversionRate).toLocaleString()} USD
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
                }}
              >
                Connect a wallet to see your total rewards add up here
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
