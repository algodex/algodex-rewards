import React from 'react'
import PropTypes from 'prop-types'
import Image from 'next/image'

// Material UI components
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Divider from '@mui/material/Divider'
import LaunchRoundedIcon from '@mui/icons-material/LaunchRounded'

//Custom components and hooks
import Link from './Nav/Link'
// import { usePriceConversionHook } from '@/hooks/usePriceConversionHook'

export const AssetList = ({ isConnected }) => {
  // const { conversionRate } = usePriceConversionHook({})
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
          <Grid container spacing={2}>
            {[...Array(6)].map((asset, index) => (
              <Grid key={index} item xs={12} sm={10} md={6} lg={4} xl={4}>
                <Box
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
                  <Typography
                    fontSize={'1rem'}
                    fontWeight={700}
                    color={'secondary.light'}
                    marginBottom={'0.7rem'}
                  >
                    Asset
                  </Typography>

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
                      <Typography fontSize={'1.1rem'} fontWeight={600}>
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
                    <Box sx={{ marginLeft: 'auto', alignSelf: 'flex-start' }}>
                      <Link href="/" target={'_blanc'}>
                        <LaunchRoundedIcon
                          sx={{
                            color: 'secondary.contrastText',
                            cursor: 'pointer',
                          }}
                        />
                      </Link>
                    </Box>
                  </Box>
                  <hr />

                  <Box
                    marginBottom={'0.5rem'}
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <Box>
                      <Typography
                        fontSize={'0.95rem'}
                        fontWeight={700}
                        color={'secondary.light'}
                        marginBottom={'0.5rem'}
                      >
                        Amount Supplied
                      </Typography>
                      <Typography
                        fontSize={'0.95rem'}
                        fontWeight={600}
                        lineHeight={'1.5rem'}
                      >
                        10.89 goBTC <br /> 42,989.976 ALGO
                      </Typography>
                    </Box>
                    <Divider
                      orientation="vertical"
                      variant="middle"
                      flexItem
                      sx={{ borderColor: 'primary.contrastText' }}
                    />
                    <Box>
                      <Typography
                        fontSize={'0.95rem'}
                        fontWeight={700}
                        color={'secondary.light'}
                        textAlign={'right'}
                        marginBottom={'0.5rem'}
                      >
                        Est. Daily Rewards
                      </Typography>
                      <Typography
                        fontSize={'1rem'}
                        fontWeight={600}
                        textAlign={'right'}
                      >
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
                </Box>
              </Grid>
            ))}
          </Grid>
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
