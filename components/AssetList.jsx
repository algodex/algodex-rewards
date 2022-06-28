import React from 'react'
import PropTypes from 'prop-types'
import Image from 'next/image'

// Material UI components
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import LaunchRoundedIcon from '@mui/icons-material/LaunchRounded'

//Custom components
import Link from './Nav/Link'

export const AssetList = ({ isConnected }) => {
  return (
    <Box sx={{ paddingBlock: '1.5rem' }}>
      {!isConnected ? (
        <Typography
          fontSize={'0.95rem'}
          fontStyle={'italic'}
          color={'primary.contrastText'}
          marginBlock={'10vh'}
          textAlign={'center'}
        >
          Connect Wallet to View Assets
        </Typography>
      ) : (
        <>
          {[...Array(3)].map((asset, index) => (
            <Box
              key={index}
              sx={{
                backgroundColor: 'secondary.dark',
                color: 'secondary.contrastText',
                borderRadius: '3px',
                border: '1px solid',
                borderColor: 'secondary.light3',
                padding: '1rem',
                marginBlock: '1.2rem',
              }}
            >
              <Box
                marginBottom={'0.7rem'}
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <Typography
                  fontSize={'0.9rem'}
                  fontWeight={700}
                  color={'secondary.light'}
                >
                  Asset
                </Typography>
                <Link href="/" target={'_blanc'}>
                  <LaunchRoundedIcon
                    sx={{ color: 'secondary.contrastText', cursor: 'pointer' }}
                  />
                </Link>
              </Box>
              <Box
                marginBottom={'0.5rem'}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <Image
                  src={'/btc-logo.png'}
                  alt="BTC logo"
                  width="28"
                  height="28"
                />
                <Box marginLeft={'0.5rem'}>
                  <Typography fontSize={'1rem'} fontWeight={600}>
                    goBTC
                  </Typography>

                  <Typography
                    fontSize={'0.85rem'}
                    fontWeight={700}
                    sx={{ color: 'secondary.light3' }}
                  >
                    Asset ID: 386192725
                  </Typography>
                </Box>
              </Box>
              <hr />
              <Box
                marginBottom={'0.5rem'}
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  color: 'secondary.light',
                }}
              >
                <Typography fontSize={'0.95rem'} fontWeight={700}>
                  Amount Supplied
                </Typography>

                <Typography fontSize={'0.95rem'} fontWeight={700}>
                  Est. Daily Rewards
                </Typography>
              </Box>
              <Box
                marginBottom={'0.5rem'}
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <Typography
                  fontSize={'0.95rem'}
                  fontWeight={600}
                  lineHeight={'2rem'}
                >
                  10.89 goBTC <br /> 42,989.976 ALGO
                </Typography>
                <Box>
                  <Typography fontSize={'1rem'} fontWeight={600}>
                    1267 ALGX
                  </Typography>

                  <Typography
                    fontSize={'0.85rem'}
                    fontWeight={700}
                    sx={{ color: 'secondary.light' }}
                  >
                    ($14.57 USD)
                  </Typography>
                </Box>
              </Box>
            </Box>
          ))}
        </>
      )}
    </Box>
  )
}

AssetList.propTypes = {
  isConnected: PropTypes.bool,
}

AssetList.defaultProps = {
  isConnected: false,
}
