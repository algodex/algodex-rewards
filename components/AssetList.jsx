import React, { useContext } from 'react'
import PropTypes from 'prop-types'
import { useTranslation } from 'next-i18next'

// Material UI components
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'

//Custom components and hooks
import { ChartDataContext } from 'context/chartContext'
import { AssetContainer } from './AssetContainer'

export const AssetList = ({ isConnected }) => {
  const { t } = useTranslation('common')
  const context = useContext(ChartDataContext)
  if (context === undefined) {
    throw new Error('Must be inside of a Chart Provider')
  }
  const { lastWkEarnedAssets } = context

  return (
    <Box sx={{ paddingBlock: '1.5rem' }}>
      {!isConnected ? (
        <Typography
          data-testid={'connect-wallet'}
          fontSize={'0.95rem'}
          fontStyle={'italic'}
          color={'primary.contrastText'}
          marginBlock={'10vh'}
          textAlign={'center'}
        >
          {t('Connect Wallet to View Assets')}
        </Typography>
      ) : (
        <>
          {lastWkEarnedAssets.length > 0 && (
            <>
              <Typography
                fontSize={'0.95rem'}
                fontWeight={600}
                color={'secondary.light'}
                marginBottom={'1rem'}
              >
                {t(
                  // eslint-disable-next-line max-len
                  'These tiles below are for ASAs this wallet provided liquidity to over the last week'
                )}
                .{' '}
                {t(
                  // eslint-disable-next-line max-len
                  '“Amount Supplied” is the average supplied over the last week'
                )}
                .
              </Typography>
              <Typography
                fontSize={'0.95rem'}
                fontStyle={'italic'}
                color={'secondary.light'}
                marginBottom={'1rem'}
              >
                {t(
                  // eslint-disable-next-line max-len
                  'Only ASAs that this wallet provided liquidity to over the last week are shown here'
                )}
                .
              </Typography>
            </>
          )}
          <Grid container spacing={2}>
            {lastWkEarnedAssets.map((asset) => (
              <Grid
                key={asset.accrualAssetId}
                item
                xs={12}
                sm={10}
                md={6}
                lg={4}
                xl={4}
              >
                <AssetContainer asset={asset} />
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
  rewards: PropTypes.array,
}

AssetList.defaultProps = {
  isConnected: false,
  rewards: [],
}
