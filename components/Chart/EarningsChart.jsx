import React, { useContext, useEffect } from 'react'
import PropTypes from 'prop-types'
import { useTranslation } from 'next-i18next'

// Material UI components
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import FormControlLabel from '@mui/material/FormControlLabel'
import Checkbox from '@mui/material/Checkbox'
import Grid from '@mui/material/Grid'

// Custom components
import AreaChart from './Area-chart'
import { ChartDataContext } from 'context/chartContext'

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

export const EarningsChart = ({ isConnected, isMobile, isHome }) => {
  const { t } = useTranslation('common')
  const context = useContext(ChartDataContext)
  if (context === undefined) {
    throw new Error('Must be inside of a Chart Provider')
  }
  const {
    timeRangeEnum,
    stagesEnum,
    activeRange,
    setActiveRange,
    activeStage,
    setActiveStage,
    activeCurrency,
    setActiveCurrency,
    includeUnvested,
    setIncludeUnvested,
    assetTableData,
    selected,
    setSelected,
  } = context

  useEffect(() => {
    let ignore = false
    const assets = assetTableData.map(({ asset }) => asset)
    if (selected.includes('ALL') || isHome) {
      if (!ignore) setSelected(assets)
    }
    return () => {
      ignore = false
    }
  }, [assetTableData])

  return (
    <Box sx={{ marginBlock: '1.5rem', padding: '0' }}>
      <Box
        marginBottom={'2rem'}
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Typography
          data-testid={'earnings-overtime'}
          fontSize={'1rem'}
          fontWeight={600}
          color={'secondary.contrastText'}
        >
          {t('Earnings Over Time')}
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

      <Box
        sx={{
          position: 'relative',
        }}
      >
        {!isConnected && (
          <Box
            data-testid={'connect-wallet'}
            sx={{
              color: 'primary.contrastText',
              position: 'absolute',
              bottom: '30vh',
              right: 0,
              width: '9.5rem',
              fontSize: '1rem',
              fontWeight: 600,
              textAlign: 'center',
            }}
          >
            {t(
              'Connect a wallet to view rewards over time with an interactive chart'
            )}
          </Box>
        )}
        <FormControlLabel
          control={
            <Checkbox
              checked={includeUnvested}
              sx={{ color: 'primary.contrastText' }}
              onChange={({ target: { checked } }) =>
                setIncludeUnvested(checked)
              }
            />
          }
          disabled={!isConnected}
          label={`${t('Include unvested rewards in chart totals')}`}
          sx={{ color: 'primary.contrastText' }}
        />
        <Box
          sx={{
            opacity: `${isConnected ? '1' : '.6'}`,
            pointerEvents: `${isConnected ? 'all' : 'none'}`,
          }}
        >
          <Box sx={{ marginBlock: '2rem' }}>
            <AreaChart isConnected={isConnected} />
          </Box>
          <Grid container>
            <Grid item xs={12} sm={12} md={6} lg={5} xl={5}>
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
                {Object.values(stagesEnum).map((item) => (
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
                        width: '98px',
                        lineHeight: '0.8rem',
                        marginRight: '13px',
                        height: '38px',
                      },
                    ]}
                  >
                    {item}
                  </Box>
                ))}
              </Box>
            </Grid>
            <Grid item xs={12} sm={12} md={6} lg={6} xl={5} marginLeft={'auto'}>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginBlock: '1rem',
                }}
              >
                {Object.values(timeRangeEnum).map(({ value, name }) => (
                  <Box
                    key={value}
                    onClick={() => {
                      setActiveRange(value)
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
                      activeRange == value ? styles.activeSelector : {},
                    ]}
                  >
                    {isMobile ? value : name}
                  </Box>
                ))}
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Box>
  )
}

EarningsChart.propTypes = {
  isConnected: PropTypes.bool,
  isMobile: PropTypes.bool,
  isHome: PropTypes.bool,
}

EarningsChart.defaultProps = {
  isConnected: false,
}
