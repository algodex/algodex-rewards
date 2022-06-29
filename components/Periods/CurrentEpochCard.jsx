import React, { useState } from 'react'
import PropTypes from 'prop-types'

// Material UI components
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import LaunchRoundedIcon from '@mui/icons-material/LaunchRounded'
import InfoRoundedIcon from '@mui/icons-material/InfoRounded'
import Link from '../Nav/Link'

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

export const CurrentEpochCard = ({ isConnected }) => {
  const [activeCurrency, setActiveCurrency] = useState('ALGX')
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
            Current Epoch 345 Pending:
          </Typography>

          {isConnected ? (
            <>
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
            </>
          ) : (
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
              sx={{ color: 'secondary.light', marginBottom: '1rem' }}
            >
              June 06, 2022 - June 20, 2022
            </Typography>
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
                New Earned Rewards:
              </Typography>
              <Typography fontSize={'1rem'} fontWeight={600}>
                1267 ALGX
              </Typography>
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
                New Earned Unvested:
              </Typography>
              <Typography
                fontSize={'1rem'}
                fontWeight={600}
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
                320 ALGX
              </Typography>
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
                Vesting Rewards:
              </Typography>
              <Box>
                <Typography fontSize={'1rem'} fontWeight={600}>
                  545 ALGX
                </Typography>

                <Typography
                  fontSize={'0.85rem'}
                  fontWeight={700}
                  sx={{ color: 'secondary.light' }}
                >
                  $6.98 USD
                </Typography>
              </Box>
            </Box>
          </>
        )}
        {isConnected && (
          <>
            <Typography
              variant="p"
              fontSize={'0.8rem'}
              fontStyle={'italic'}
              marginLeft={'0.5rem'}
            >
              Rewards will be paid out [time] two days after the end of one-week
              accrual epochs
            </Typography>

            <Box textAlign={'center'} marginTop={'1.5rem'}>
              <Link
                href="/"
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
                View on AlgoExplorer
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
        )}
      </Box>
    </>
  )
}

CurrentEpochCard.propTypes = {
  isConnected: PropTypes.bool,
}

CurrentEpochCard.defaultProps = {
  isConnected: false,
}