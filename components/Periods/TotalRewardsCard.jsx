import React from 'react'
import PropTypes from 'prop-types'

// Material UI components
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import Image from 'next/image'

export const TotalRewardsCard = ({ isConnected }) => {
  return (
    <>
      {isConnected && (
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
              <Box>
                <Typography fontSize={'1rem'} fontWeight={600}>
                  1267 ALGX
                </Typography>

                <Typography
                  fontSize={'0.85rem'}
                  fontWeight={700}
                  textAlign={'right'}
                  sx={{ color: 'secondary.light' }}
                >
                  $14.57 USD
                </Typography>
              </Box>
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
              <Box>
                <Typography fontSize={'1rem'} fontWeight={600}>
                  545 ALGX
                </Typography>

                <Typography
                  fontSize={'0.85rem'}
                  fontWeight={700}
                  textAlign={'right'}
                  sx={{ color: 'secondary.light' }}
                >
                  $6.98 USD
                </Typography>
              </Box>
            </Box>
          </Box>
        </Box>
      )}
    </>
  )
}

TotalRewardsCard.propTypes = {
  isConnected: PropTypes.bool,
}

TotalRewardsCard.defaultProps = {
  isConnected: false,
}
