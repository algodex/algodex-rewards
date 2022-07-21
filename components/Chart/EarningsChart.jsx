import React, { useState } from 'react'
import PropTypes from 'prop-types'

// Material UI components
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import FormControlLabel from '@mui/material/FormControlLabel'
import Checkbox from '@mui/material/Checkbox'
import Grid from '@mui/material/Grid'

// Custom components
import AreaChart from './Area-chart'

const styles = {
  selectorContainer: {
    display: 'flex',
    alignItems: 'center',
    backgroundColor: 'secondary.main',
    justifyContent: 'center',
    borderRadius: '3px',
    overflow: 'hidden',
    height: '28px',
  },
  selector: {
    padding: '5px 6px',
    fontSize: '0.8rem',
    fontWeight: 800,
    color: 'secondary.light',
    cursor: 'pointer',
    minWidth: '3rem',
    textAlign: 'center',
  },
  activeSelector: {
    color: 'secondary.contrastText',
    backgroundColor: 'accent.main',
  },
}

export const EarningsChart = ({ isConnected }) => {
  const [activeCurrency, setActiveCurrency] = useState('ALGX')
  const [activeRange, setActiveRange] = useState('3M')
  const [activeStage, setActiveStage] = useState('Total')

  return (
    <Container sx={{ marginBlock: '1.5rem', padding: '0' }}>
      <Box
        marginBottom={'2rem'}
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Typography
          fontSize={'1rem'}
          fontWeight={600}
          color={'secondary.contrastText'}
        >
          Earnings Over Time
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
      {!isConnected ? (
        <Typography
          fontSize={'0.95rem'}
          fontStyle={'italic'}
          color={'primary.contrastText'}
          marginBlock={'10vh'}
          textAlign={'center'}
        >
          Connect Wallet to View Charts
        </Typography>
      ) : (
        <>
          <FormControlLabel
            control={<Checkbox sx={{ color: 'primary.contrastText' }} />}
            label="Include unvested rewards in chart totals"
            sx={{ color: 'primary.contrastText' }}
          />
          <Box sx={{ marginBlock: '2rem' }}>
            <AreaChart />
          </Box>
          <Grid container>
            <Grid item xs={12} sm={12} md={12} lg={6} xl={6}>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginBlock: '1rem',
                  overflow: 'scroll',
                  ['&::-webkit-scrollbar']: {
                    width: '0',
                    display: 'none',
                  },
                }}
              >
                {[...Array('Total', 'Mainnet Stage 1', 'Mainnet Stage 2')].map(
                  (item) => (
                    <Box
                      key={item}
                      onClick={() => {
                        setActiveStage(item)
                      }}
                      sx={[
                        styles.selectorContainer,
                        styles.selector,
                        activeStage == item ? styles.activeSelector : {},
                        {
                          width: '80px',
                          lineHeight: '0.8rem',
                          marginRight: '13px',
                          height: '35px',
                        },
                      ]}
                    >
                      {item}
                    </Box>
                  )
                )}
              </Box>
            </Grid>
            <Grid item xs={12} sm={12} md={12} lg={6} xl={6}>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginBlock: '1rem',
                }}
              >
                {[...Array('1D', '1W', '1M', '3M', '1Y', '5Y')].map((item) => (
                  <Box
                    key={item}
                    onClick={() => {
                      setActiveRange(item)
                    }}
                    sx={[
                      styles.selectorContainer,
                      {
                        color: 'gray.main',
                        fontWeight: 700,
                        fontSize: '0.95rem',
                        cursor: 'pointer',
                        background: 'transparent',
                        padding: '5px',
                      },
                      activeRange == item ? styles.activeSelector : {},
                    ]}
                  >
                    {item}
                  </Box>
                ))}
              </Box>
            </Grid>
          </Grid>
        </>
      )}
    </Container>
  )
}

EarningsChart.propTypes = {
  isConnected: PropTypes.bool,
}

EarningsChart.defaultProps = {
  isConnected: false,
}
