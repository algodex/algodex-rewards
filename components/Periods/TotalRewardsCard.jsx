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
          <Box
            sx={{
              marginRight: '6px',
              border: '2px solid',
              borderRadius: '50%',
              width: '20px',
              height: '20px',
              display: 'flex',
              justifyContent: 'center',
              marginTop: '3px',
            }}
          >
            <Image
              src={'/algodex-icon.svg'}
              alt="algodex_icon"
              height="8"
              width="8"
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
